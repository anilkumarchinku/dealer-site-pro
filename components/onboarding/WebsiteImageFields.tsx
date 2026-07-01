"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ImageIcon, Upload, X } from "lucide-react"

type AssetType = "logo" | "hero"

interface WebsiteImageFieldsProps {
    logoValue?: string
    heroValue?: string
    onLogoChange: (value: string | undefined) => void
    onHeroChange: (value: string | undefined) => void
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export function WebsiteImageFields({
    logoValue,
    heroValue,
    onLogoChange,
    onHeroChange,
}: WebsiteImageFieldsProps) {
    const [errors, setErrors] = useState<Record<AssetType, string | null>>({ logo: null, hero: null })
    const [dragging, setDragging] = useState<Record<AssetType, boolean>>({ logo: false, hero: false })

    async function processFile(type: AssetType, file: File) {
        const maxSizeMb = type === "logo" ? 2 : 5
        if (!file.type.startsWith("image/")) {
            setErrors(prev => ({ ...prev, [type]: "Please upload an image file." }))
            return
        }
        if (file.size > maxSizeMb * 1024 * 1024) {
            setErrors(prev => ({ ...prev, [type]: `Image must be under ${maxSizeMb} MB.` }))
            return
        }

        setErrors(prev => ({ ...prev, [type]: null }))
        const base64 = await fileToBase64(file)
        if (type === "logo") onLogoChange(base64)
        else onHeroChange(base64)
    }

    function handleFileChange(type: AssetType, file?: File) {
        if (file) void processFile(type, file)
    }

    function handleDrop(type: AssetType, event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        setDragging(prev => ({ ...prev, [type]: false }))
        handleFileChange(type, event.dataTransfer.files?.[0])
    }

    return (
        <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground border-b border-border pb-2">
                <ImageIcon className="w-4 h-4" />
                Website Images
            </div>

            <div className="grid items-stretch gap-4 md:grid-cols-2">
                <AssetUploadBox
                    type="logo"
                    title="Logo"
                    description="PNG, JPG, SVG, or WEBP under 2 MB."
                    value={logoValue}
                    error={errors.logo}
                    dragging={dragging.logo}
                    onClear={() => onLogoChange(undefined)}
                    onFileChange={file => handleFileChange("logo", file)}
                    onDragState={value => setDragging(prev => ({ ...prev, logo: value }))}
                    onDrop={event => handleDrop("logo", event)}
                />
                <AssetUploadBox
                    type="hero"
                    title="Hero image"
                    description="Wide showroom or vehicle image under 5 MB."
                    value={heroValue}
                    error={errors.hero}
                    dragging={dragging.hero}
                    onClear={() => onHeroChange(undefined)}
                    onFileChange={file => handleFileChange("hero", file)}
                    onDragState={value => setDragging(prev => ({ ...prev, hero: value }))}
                    onDrop={event => handleDrop("hero", event)}
                />
            </div>

            <p className="text-xs text-muted-foreground">
                If these are left empty, the live site will use the selected brand logo and a matching vehicle image automatically.
            </p>
        </div>
    )
}

interface AssetUploadBoxProps {
    type: AssetType
    title: string
    description: string
    value?: string
    error: string | null
    dragging: boolean
    onClear: () => void
    onFileChange: (file?: File) => void
    onDragState: (dragging: boolean) => void
    onDrop: (event: React.DragEvent<HTMLDivElement>) => void
}

function AssetUploadBox({
    type,
    title,
    description,
    value,
    error,
    dragging,
    onClear,
    onFileChange,
    onDragState,
    onDrop,
}: AssetUploadBoxProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const inputId = `website-${type}-upload`
    const handlePick = () => inputRef.current?.click()

    return (
        <div className="space-y-2">
            <Label htmlFor={inputId}>{title}</Label>
            <div
                onDragOver={event => {
                    event.preventDefault()
                    onDragState(true)
                }}
                onDragLeave={() => onDragState(false)}
                onDrop={onDrop}
                className={cn(
                    "relative min-h-[210px] rounded-xl border border-dashed border-border bg-muted/30 p-4 transition-colors",
                    dragging && "border-primary bg-primary/5"
                )}
            >
                <input
                    ref={inputRef}
                    id={inputId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={event => onFileChange(event.target.files?.[0])}
                />

                {value ? (
                    <div className="flex h-full min-h-[178px] flex-col gap-3">
                        <div className={cn(
                            "relative flex-1 overflow-hidden rounded-lg bg-background",
                            type === "logo" ? "min-h-[118px]" : "min-h-[118px]"
                        )}>
                            <Image
                                src={value}
                                alt={`${title} preview`}
                                fill
                                unoptimized
                                className={type === "logo" ? "object-contain p-4" : "object-contain"}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <div className="flex min-h-9 items-center justify-between gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={handlePick}>
                                Replace
                            </Button>
                            <Button type="button" size="sm" variant="ghost" onClick={onClear}>
                                <X className="mr-1.5 h-3.5 w-3.5" />
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handlePick}
                        className="flex min-h-[178px] w-full flex-col items-center justify-center gap-3 rounded-lg text-center transition-colors hover:bg-background/60"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Upload className="h-5 w-5" />
                        </span>
                        <span>
                            <span className="block text-sm font-medium text-foreground">Upload {title.toLowerCase()}</span>
                            <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
                        </span>
                    </button>
                )}
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}
