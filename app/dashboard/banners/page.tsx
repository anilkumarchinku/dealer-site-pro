"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PremiumPageHeader } from "@/components/dashboard/premium-ui"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { supabase } from "@/lib/supabase"
import { buildDashboardSiteCards } from "@/lib/utils/dashboard-site-cards"
import { ImageIcon, Loader2, Plus, Trash2, Upload, X } from "lucide-react"

interface BannerRow {
  id: string
  title: string | null
  site_slug: string | null
  desktop_image_url: string
  mobile_image_url: string | null
  sort_order: number
  created_at: string
}

interface BannerForm {
  title: string
  site_slug: string
  start_order: string
}

interface CarouselSlideForm {
  id: number
  desktop_image_url: string
  mobile_image_url: string
}

type DealerBrandRow = {
  brand_name: string
  vehicle_type: string | null
}

type SiteOption = {
  slug: string
  label: string
}

const EMPTY_FORM: BannerForm = {
  title: "",
  site_slug: "",
  start_order: "0",
}

const MAX_CAROUSEL_SLIDES = 4
const MIN_CAROUSEL_SLIDES = 3
const BANNER_VARIANTS = {
  desktop: { width: 1600, height: 600, label: "Desktop" },
  mobile: { width: 900, height: 1125, label: "Mobile" },
} as const

type BannerVariant = keyof typeof BANNER_VARIANTS

function createEmptySlides(): CarouselSlideForm[] {
  return Array.from({ length: MAX_CAROUSEL_SLIDES }, (_, index) => ({
    id: index + 1,
    desktop_image_url: "",
    mobile_image_url: "",
  }))
}

function brandsForType(rows: DealerBrandRow[], types: string[], fallback: string[]): string[] {
  const normalizedTypes = new Set(types.map(type => type.toLowerCase()))
  const brands = [...new Set(rows
    .filter(row => row.vehicle_type && normalizedTypes.has(row.vehicle_type.toLowerCase()))
    .map(row => row.brand_name))]

  return brands.length > 0 ? brands : [...new Set(fallback)]
}

function siteLabel(options: SiteOption[], slug: string | null) {
  if (!slug) return "All websites"
  return options.find(option => option.slug === slug)?.label ?? slug
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new window.Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not read image"))
    }
    image.src = url
  })
}

async function createCroppedBannerBlob(file: File, variant: BannerVariant): Promise<Blob> {
  const image = await loadImage(file)
  const target = BANNER_VARIANTS[variant]
  const sourceRatio = image.naturalWidth / image.naturalHeight
  const targetRatio = target.width / target.height

  let sourceWidth = image.naturalWidth
  let sourceHeight = image.naturalHeight
  let sourceX = 0
  let sourceY = 0

  if (sourceRatio > targetRatio) {
    sourceWidth = image.naturalHeight * targetRatio
    sourceX = (image.naturalWidth - sourceWidth) / 2
  } else {
    sourceHeight = image.naturalWidth / targetRatio
    sourceY = (image.naturalHeight - sourceHeight) / 2
  }

  const canvas = document.createElement("canvas")
  canvas.width = target.width
  canvas.height = target.height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Could not process image")

  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, target.width, target.height)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    target.width,
    target.height,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob)
      else reject(new Error("Could not generate banner image"))
    }, "image/jpeg", 0.9)
  })
}

export default function BannersPage() {
  const { dealerId, setDealerId, setDealerSlug } = useOnboardingStore()
  const [banners, setBanners] = useState<BannerRow[]>([])
  const [siteOptions, setSiteOptions] = useState<SiteOption[]>([])
  const [form, setForm] = useState<BannerForm>(EMPTY_FORM)
  const [slides, setSlides] = useState<CarouselSlideForm[]>(() => createEmptySlides())
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [messageTone, setMessageTone] = useState<"error" | "success">("error")
  const slideInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    async function loadSites() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: dealer } = await supabase
        .from("dealers")
        .select("id, slug, dealership_name, sells_new_cars, sells_used_cars, vehicle_type, sells_two_wheelers, sells_three_wheelers, sells_four_wheelers")
        .eq("user_id", user.id)
        .eq("onboarding_complete", true)
        .maybeSingle()

      if (!dealer?.id || !dealer.slug) return

      const { data: brandsRaw } = await supabase
        .from("dealer_brands")
        .select("brand_name, vehicle_type")
        .eq("dealer_id", dealer.id)
        .order("is_primary", { ascending: false })

      const brandRows = (brandsRaw ?? []) as DealerBrandRow[]
      const brands = brandRows.map(row => row.brand_name)
      const vtype =
        dealer.vehicle_type === "two-wheeler" || dealer.vehicle_type === "three-wheeler"
          ? dealer.vehicle_type
          : "car"
      const isNew = dealer.sells_new_cars ?? false
      const isUsed = dealer.sells_used_cars ?? false
      const has2W = dealer.sells_two_wheelers ?? vtype === "two-wheeler"
      const has3W = dealer.sells_three_wheelers ?? vtype === "three-wheeler"
      const has4W = dealer.sells_four_wheelers ?? vtype === "car"
      const activeSegmentCount = [has4W || vtype === "car", has2W || vtype === "two-wheeler", has3W || vtype === "three-wheeler"].filter(Boolean).length

      const cards = buildDashboardSiteCards({
        slug: dealer.slug,
        dealerName: dealer.dealership_name,
        carBrands: brandsForType(brandRows, ["cars", "car", "4w"], activeSegmentCount === 1 ? brands : []),
        twoWheelerBrands: brandsForType(brandRows, ["2w", "two-wheeler"], activeSegmentCount === 1 ? brands : []),
        threeWheelerBrands: brandsForType(brandRows, ["3w", "three-wheeler"], activeSegmentCount === 1 ? brands : []),
        isNew,
        isUsed,
        vehicleType: vtype,
        has2W,
        has3W,
        has4W,
      })

      const options = cards.map(card => ({
        slug: card.slug,
        label: card.showLabel ? card.label : dealer.dealership_name,
      }))

      setDealerId(dealer.id)
      setDealerSlug(dealer.slug)
      setSiteOptions(options)
      setForm(current => current.site_slug ? current : { ...current, site_slug: options[0]?.slug ?? "" })
    }

    loadSites()
  }, [setDealerId, setDealerSlug])

  useEffect(() => {
    if (!dealerId) return
    setLoading(true)
    fetch(`/api/banners?dealer_id=${dealerId}`)
      .then(r => r.json())
      .then(d => setBanners(d.banners ?? []))
      .finally(() => setLoading(false))
  }, [dealerId])

  async function uploadGeneratedBannerImage(blob: Blob, slideId: number, variant: BannerVariant) {
    if (!dealerId) throw new Error("Dealer account not loaded")

    const path = `dealers/${dealerId}/banners/slide-${slideId}-${variant}-${crypto.randomUUID()}.jpg`
    const { error: uploadError } = await supabase.storage
      .from("dealer-assets")
      .upload(path, blob, { upsert: false, contentType: "image/jpeg" })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from("dealer-assets")
      .getPublicUrl(path)

    return publicUrl
  }

  async function uploadBannerImage(file: File, slideId: number, field: "desktop" | "mobile") {
    if (!dealerId) return
    if (!file.type.startsWith("image/")) {
      setMessageTone("error")
      setMessage("Please upload a PNG, JPG or WEBP image")
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setMessageTone("error")
      setMessage("Banner image must be under 8 MB")
      return
    }

    const uploadKey = `${slideId}-${field}`
    setUploadingField(uploadKey)
    setMessage("")
    try {
      const [desktopBlob, mobileBlob] = await Promise.all([
        createCroppedBannerBlob(file, "desktop"),
        createCroppedBannerBlob(file, "mobile"),
      ])
      const [desktopUrl, mobileUrl] = await Promise.all([
        uploadGeneratedBannerImage(desktopBlob, slideId, "desktop"),
        uploadGeneratedBannerImage(mobileBlob, slideId, "mobile"),
      ])

      setSlides(current => current.map(slide => (
        slide.id === slideId
          ? { ...slide, desktop_image_url: desktopUrl, mobile_image_url: mobileUrl }
          : slide
      )))
      setMessageTone("success")
      setMessage(`Slide ${slideId} ready. Desktop and mobile crops were generated automatically.`)
    } catch (err) {
      setMessageTone("error")
      setMessage(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploadingField(null)
    }
  }

  async function saveBanner() {
    if (!dealerId || !form.site_slug) return
    const readySlides = slides.filter(slide => slide.desktop_image_url)
    if (readySlides.length < MIN_CAROUSEL_SLIDES) {
      setMessageTone("error")
      setMessage(`Upload at least ${MIN_CAROUSEL_SLIDES} carousel images`)
      return
    }

    setSaving(true)
    setMessage("")

    const startOrder = Number(form.start_order) || 0
    const savedBanners: BannerRow[] = []

    for (const [index, slide] of readySlides.entries()) {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title ? `${form.title} ${index + 1}` : `Carousel banner ${index + 1}`,
          site_slug: form.site_slug,
          desktop_image_url: slide.desktop_image_url,
          mobile_image_url: slide.mobile_image_url || null,
          sort_order: startOrder + index,
        }),
      })
      const data = await res.json()
      if (!data.success || !data.banner) {
        setMessageTone("error")
        setMessage(data.error || "Failed to save banner")
        setSaving(false)
        return
      }
      savedBanners.push(data.banner)
    }

    if (savedBanners.length > 0) {
      setBanners(prev => [...savedBanners, ...prev].sort((a, b) => a.sort_order - b.sort_order))
      setForm({ ...EMPTY_FORM, site_slug: siteOptions[0]?.slug ?? "" })
      setSlides(createEmptySlides())
      setAdding(false)
    }

    setSaving(false)
  }

  async function deleteBanner(id: string) {
    await fetch(`/api/banners?id=${id}`, { method: "DELETE" })
    setBanners(prev => prev.filter(banner => banner.id !== id))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PremiumPageHeader
        eyebrow="Website media"
        title="Banners"
        description="Add scrolling banners above the services section for each website"
        actions={
          <Button
            onClick={() => setAdding(v => !v)}
            variant={adding ? "outline" : "default"}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {adding ? "Cancel" : "Add Banner"}
          </Button>
        }
      />

      {adding && (
        <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
          <CardHeader>
            <CardTitle className="text-base font-black tracking-tight">New Website Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Website <span className="text-red-500">*</span></label>
              <Select value={form.site_slug} onValueChange={v => setForm(f => ({ ...f, site_slug: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose website" />
                </SelectTrigger>
                <SelectContent>
                  {siteOptions.map(site => (
                    <SelectItem key={site.slug} value={site.slug}>{site.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_160px]">
              <div>
                <label className="text-sm font-medium mb-1 block">Banner Name <span className="text-muted-foreground font-normal">(optional)</span></label>
                <Input
                  placeholder="e.g. Festive service banner"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  maxLength={120}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Start Order</label>
                <Input
                  type="number"
                  value={form.start_order}
                  onChange={e => setForm(f => ({ ...f, start_order: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Carousel Images</p>
                <p className="text-xs text-muted-foreground">
                  Upload 3 to 4 source images. Each upload is auto-cropped into desktop and mobile banner versions.
                </p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {slides.map(slide => (
                  <CarouselSlidePanel
                    key={slide.id}
                    slide={slide}
                    uploadingField={uploadingField}
                    onUploadClick={(field) => slideInputRefs.current[`${slide.id}-${field}`]?.click()}
                    onRemove={(field) => setSlides(current => current.map(item => (
                      item.id === slide.id
                        ? { ...item, [field === "desktop" ? "desktop_image_url" : "mobile_image_url"]: "" }
                        : item
                    )))}
                    setInputRef={(field, node) => {
                      slideInputRefs.current[`${slide.id}-${field}`] = node
                    }}
                    onFileSelected={(file, field) => uploadBannerImage(file, slide.id, field)}
                  />
                ))}
              </div>
            </div>

            {message && (
              <p className={`text-sm ${messageTone === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                {message}
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                onClick={saveBanner}
                disabled={saving || !form.site_slug || slides.filter(slide => slide.desktop_image_url).length < MIN_CAROUSEL_SLIDES}
                size="sm"
                className="gap-1.5"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {saving ? "Saving..." : "Save Carousel"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
        <CardHeader>
          <CardTitle className="text-base font-black tracking-tight flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Active Banners
            {banners.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground ml-1">({banners.length})</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading banners...</span>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground px-4">
              <ImageIcon className="w-8 h-8 mx-auto mb-3 opacity-25" />
              <p className="font-medium">No banners yet</p>
              <p className="text-sm mt-1">Add your first website banner above.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {banners.map(banner => (
                <div key={banner.id} className="flex items-start gap-3 p-4 hover:bg-muted/20 transition-colors">
                  <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={banner.desktop_image_url} alt="" fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-semibold text-sm">{banner.title || "Website banner"}</h3>
                    <p className="text-xs text-primary">{siteLabel(siteOptions, banner.site_slug)}</p>
                    <p className="text-xs text-muted-foreground">
                      Order {banner.sort_order}
                      {banner.mobile_image_url ? " · Mobile image added" : " · Desktop image used on mobile"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-600 shrink-0"
                    onClick={() => deleteBanner(banner.id)}
                    title="Remove banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CarouselSlidePanel({
  slide,
  uploadingField,
  onUploadClick,
  onRemove,
  setInputRef,
  onFileSelected,
}: {
  slide: CarouselSlideForm
  uploadingField: string | null
  onUploadClick: (field: "desktop" | "mobile") => void
  onRemove: (field: "desktop" | "mobile") => void
  setInputRef: (field: "desktop" | "mobile", node: HTMLInputElement | null) => void
  onFileSelected: (file: File, field: "desktop" | "mobile") => void
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Slide {slide.id}</p>
          <p className="text-xs text-muted-foreground">Upload either preview; both sizes are generated</p>
        </div>
        {slide.desktop_image_url && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            Ready
          </span>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <SlideImageUploader
          label="Desktop"
          hint="Generated 16:6"
          imageUrl={slide.desktop_image_url}
          uploading={uploadingField === `${slide.id}-desktop`}
          onUploadClick={() => onUploadClick("desktop")}
          onRemove={() => onRemove("desktop")}
          required
        />
        <SlideImageUploader
          label="Mobile"
          hint="Generated 4:5"
          imageUrl={slide.mobile_image_url}
          uploading={uploadingField === `${slide.id}-mobile`}
          onUploadClick={() => onUploadClick("mobile")}
          onRemove={() => onRemove("mobile")}
        />
      </div>
      <input
        ref={node => setInputRef("desktop", node)}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onFileSelected(file, "desktop")
          e.currentTarget.value = ""
        }}
      />
      <input
        ref={node => setInputRef("mobile", node)}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onFileSelected(file, "mobile")
          e.currentTarget.value = ""
        }}
      />
    </div>
  )
}

function SlideImageUploader({
  label,
  hint,
  imageUrl,
  uploading,
  required,
  onUploadClick,
  onRemove,
}: {
  label: string
  hint: string
  imageUrl: string
  uploading: boolean
  required?: boolean
  onUploadClick: () => void
  onRemove: () => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <div className="relative flex aspect-[16/7] items-center justify-center overflow-hidden rounded-lg bg-background text-muted-foreground">
        {imageUrl ? (
          <Image src={imageUrl} alt={`${label} preview`} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex flex-col items-center gap-1 text-center text-xs">
            <ImageIcon className="h-6 w-6 opacity-50" />
            <span>{hint}</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" className="gap-2" disabled={uploading} onClick={onUploadClick}>
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? "Processing..." : "Upload source"}
        </Button>
        {imageUrl && (
          <Button type="button" variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={onRemove}>
            <X className="h-3.5 w-3.5" />
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}
