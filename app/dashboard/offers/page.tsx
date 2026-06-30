"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { supabase } from "@/lib/supabase"
import { buildDashboardSiteCards } from "@/lib/utils/dashboard-site-cards"
import { PremiumPageHeader } from "@/components/dashboard/premium-ui"
import { ImageIcon, Loader2, Plus, Trash2, Tag, Upload, X } from "lucide-react"

interface OfferRow {
  id: string
  title: string
  description: string | null
  tag: string | null
  valid_until: string | null
  site_slug: string | null
  image_url: string | null
  show_popup: boolean
  created_at: string
}

interface OfferForm {
  title: string
  description: string
  tag: string
  valid_until: string
  site_slug: string
  image_url: string
  show_popup: boolean
}

type DealerBrandRow = {
  brand_name: string
  vehicle_type: string | null
}

type SiteOption = {
  slug: string
  label: string
}

const TAG_OPTIONS = ["Finance", "Exchange", "Service", "Electric", "Offer", "Referral", "Seasonal"]

const EMPTY_FORM: OfferForm = {
  title: "",
  description: "",
  tag: "Offer",
  valid_until: "",
  site_slug: "",
  image_url: "",
  show_popup: false,
}

const TAG_COLORS: Record<string, string> = {
  Finance:  "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  Exchange: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  Service:  "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  Electric: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",
  Offer:    "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  Referral: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  Seasonal: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
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

export default function OffersPage() {
  const { dealerId, setDealerId, setDealerSlug } = useOnboardingStore()
  const [offers, setOffers] = useState<OfferRow[]>([])
  const [siteOptions, setSiteOptions] = useState<SiteOption[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<OfferForm>(EMPTY_FORM)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageError, setImageError] = useState("")
  const offerImageInputRef = useRef<HTMLInputElement>(null)

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
    fetch(`/api/offers?dealer_id=${dealerId}`)
      .then(r => r.json())
      .then(d => setOffers(d.offers ?? []))
      .finally(() => setLoading(false))
  }, [dealerId])

  async function uploadOfferImage(file: File) {
    if (!dealerId) return
    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a PNG, JPG or WEBP image")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Offer image must be under 5 MB")
      return
    }

    setUploading(true)
    setImageError("")
    try {
      const mime = file.type
      const ext = mime.split("/")[1]?.replace("jpeg", "jpg") ?? "png"
      const path = `dealers/${dealerId}/offers/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("dealer-assets")
        .upload(path, file, { upsert: false, contentType: mime })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("dealer-assets")
        .getPublicUrl(path)

      setForm(current => ({ ...current, image_url: publicUrl, show_popup: true }))
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function saveOffer() {
    if (!dealerId || !form.title.trim()) return
    setSaving(true)
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer internal" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        tag: form.tag,
        valid_until: form.valid_until || null,
        site_slug: form.site_slug || siteOptions[0]?.slug || null,
        image_url: form.image_url || null,
        show_popup: form.show_popup && Boolean(form.image_url),
      }),
    })
    const data = await res.json()
    if (data.success && data.offer) {
      setOffers(prev => [data.offer, ...prev])
      setForm({ ...EMPTY_FORM, site_slug: siteOptions[0]?.slug ?? "" })
      setAdding(false)
      setImageError("")
    }
    setSaving(false)
  }

  async function deleteOffer(id: string) {
    await fetch(`/api/offers?id=${id}`, { method: "DELETE" })
    setOffers(prev => prev.filter(o => o.id !== id))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PremiumPageHeader
        eyebrow="Promotions"
        title="Offers & Schemes"
        description="Manage website-specific offers and visitor popup images"
        actions={
          <Button
            onClick={() => setAdding(v => !v)}
            variant={adding ? "outline" : "default"}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {adding ? "Cancel" : "Add New Offer"}
          </Button>
        }
      />

      {adding && (
        <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
          <CardHeader>
            <CardTitle className="text-base font-black tracking-tight">New Website Offer</CardTitle>
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
            <div>
              <label className="text-sm font-medium mb-1 block">Title <span className="text-red-500">*</span></label>
              <Input
                placeholder="e.g. Creta Festive Offer"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                maxLength={120}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description <span className="text-muted-foreground font-normal">(optional)</span></label>
              <textarea
                placeholder="Add more details about this offer..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Tag</label>
                <Select value={form.tag} onValueChange={v => setForm(f => ({ ...f, tag: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAG_OPTIONS.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Valid Until <span className="text-muted-foreground font-normal">(optional)</span></label>
                <Input
                  type="date"
                  value={form.valid_until}
                  onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium block">Offer Popup Image</label>
              <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-3 sm:flex-row sm:items-center">
                {form.image_url ? (
                  <div className="relative h-28 w-full overflow-hidden rounded-lg bg-background sm:w-44">
                    <Image src={form.image_url} alt="Offer preview" fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="flex h-28 w-full items-center justify-center rounded-lg bg-background text-muted-foreground sm:w-44">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={uploading}
                      onClick={() => offerImageInputRef.current?.click()}
                    >
                      {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                      {uploading ? "Uploading..." : "Upload Image"}
                    </Button>
                    {form.image_url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground"
                        onClick={() => setForm(f => ({ ...f, image_url: "", show_popup: false }))}
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <Input
                    value={form.image_url}
                    onChange={e => setForm(f => ({ ...f, image_url: e.target.value, show_popup: Boolean(e.target.value) && f.show_popup }))}
                    placeholder="Or paste an image URL"
                  />
                  {imageError && <p className="text-xs text-destructive">{imageError}</p>}
                </div>
                <input
                  ref={offerImageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) uploadOfferImage(file)
                    e.currentTarget.value = ""
                  }}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.show_popup}
                  disabled={!form.image_url}
                  onCheckedChange={checked => setForm(f => ({ ...f, show_popup: checked === true }))}
                />
                Show this image as a popup when visitors enter this website
              </label>
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={saveOffer} disabled={saving || !form.title.trim() || !form.site_slug} size="sm" className="gap-1.5">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {saving ? "Saving..." : "Save Offer"}
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
            <Tag className="w-4 h-4" />
            Active Offers
            {offers.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground ml-1">({offers.length})</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading offers...</span>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground px-4">
              <Tag className="w-8 h-8 mx-auto mb-3 opacity-25" />
              <p className="font-medium">No offers yet</p>
              <p className="text-sm mt-1">Add your first website offer above.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {offers.map(offer => (
                <div key={offer.id} className="flex items-start gap-3 p-4 hover:bg-muted/20 transition-colors">
                  {offer.image_url && (
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={offer.image_url} alt="" fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {offer.tag && (
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[offer.tag] ?? "bg-muted text-muted-foreground"}`}>
                          {offer.tag}
                        </span>
                      )}
                      {offer.show_popup && offer.image_url && (
                        <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                          Popup
                        </span>
                      )}
                      <h3 className="font-semibold text-sm">{offer.title}</h3>
                    </div>
                    <p className="text-xs text-primary">
                      {siteLabel(siteOptions, offer.site_slug)}
                    </p>
                    {offer.description && (
                      <p className="text-sm text-muted-foreground">{offer.description}</p>
                    )}
                    {offer.valid_until && (
                      <p className="text-xs text-muted-foreground">
                        Expires: {new Date(offer.valid_until).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-600 shrink-0"
                    onClick={() => deleteOffer(offer.id)}
                    title="Remove offer"
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
