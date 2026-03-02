"use client"

import { useRef, useState } from "react"
import { Upload, X, Loader2 } from "lucide-react"

interface Props {
    value: string[]
    onChange: (urls: string[]) => void
    maxImages?: number
}

export function VehicleImageUpload({ value, onChange, maxImages = 6 }: Props) {
    const inputRef             = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError]    = useState("")

    async function handleFiles(files: FileList | null) {
        if (!files || files.length === 0) return
        const remaining = maxImages - value.length
        if (remaining <= 0) return

        const toUpload = Array.from(files).slice(0, remaining)
        setUploading(true)
        setError("")

        const uploaded: string[] = []
        for (const file of toUpload) {
            const fd = new FormData()
            fd.append("file", file)
            try {
                const res  = await fetch("/api/two-wheelers/upload-image", { method: "POST", body: fd })
                const data = await res.json()
                if (res.ok && data.url) {
                    uploaded.push(data.url)
                } else {
                    setError(data.error ?? "Upload failed")
                }
            } catch {
                setError("Upload failed — check your connection")
            }
        }

        if (uploaded.length > 0) onChange([...value, ...uploaded])
        setUploading(false)
        if (inputRef.current) inputRef.current.value = ""
    }

    function remove(idx: number) {
        onChange(value.filter((_, i) => i !== idx))
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
    }

    return (
        <div className="space-y-3">
            {/* Previews */}
            {value.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {value.map((url, i) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden aspect-video bg-muted/30">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            {i === 0 && (
                                <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    Cover
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload zone */}
            {value.length < maxImages && (
                <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => !uploading && inputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors"
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-sm">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="w-8 h-8" />
                            <p className="text-sm font-medium">Click or drag to upload</p>
                            <p className="text-xs">JPEG, PNG, WebP · max 5 MB · up to {maxImages} images</p>
                            <p className="text-xs">{value.length}/{maxImages} uploaded · first image is cover</p>
                        </div>
                    )}
                </div>
            )}

            {error && <p className="text-xs text-destructive">{error}</p>}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
            />
        </div>
    )
}
