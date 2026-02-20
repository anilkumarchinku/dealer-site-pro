"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft, ArrowRight, Upload, Download,
    CheckCircle2, XCircle, AlertCircle, FileText,
    X, Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { VehicleUploadRow } from "@/lib/types"

// ── CSV template the dealer downloads ────────────────────────────────────────
const CSV_HEADERS = [
    "make", "model", "variant", "year",
    "price_inr", "km_driven", "fuel",
    "transmission", "color", "reg_number",
]

const CSV_EXAMPLE = [
    "Maruti Suzuki,Swift,VXi,2020,450000,35000,Petrol,Manual,Red,KA01AB1234",
    "Honda City,City,SV CVT,2019,780000,42000,Petrol,Automatic,White,MH02XY5678",
    "Hyundai Creta,Creta,SX,2021,1050000,28000,Diesel,Manual,Blue,TN09CD9012",
].join("\n")

const CSV_TEMPLATE = [CSV_HEADERS.join(","), CSV_EXAMPLE].join("\n")

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse a single CSV line, handling quoted fields */
function parseLine(line: string): string[] {
    const result: string[] = []
    let current = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (ch === '"') {
            inQuotes = !inQuotes
        } else if (ch === "," && !inQuotes) {
            result.push(current.trim())
            current = ""
        } else {
            current += ch
        }
    }
    result.push(current.trim())
    return result
}

/** Parse full CSV text → array of row objects */
function parseCSV(text: string): { rows: VehicleUploadRow[]; errors: string[] } {
    const lines = text.trim().split(/\r?\n/).filter(l => l.trim())
    if (lines.length < 2) return { rows: [], errors: ["CSV has no data rows"] }

    const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, "_"))
    const rows: VehicleUploadRow[] = []
    const errors: string[] = []

    for (let i = 1; i < lines.length; i++) {
        const vals = parseLine(lines[i])
        const row: Record<string, string> = {}
        headers.forEach((h, j) => { row[h] = vals[j] ?? "" })

        const make  = row.make?.trim()
        const model = row.model?.trim()
        const year  = parseInt(row.year)
        const price = parseFloat(row.price_inr)

        if (!make)              { errors.push(`Row ${i}: 'make' is required`);  continue }
        if (!model)             { errors.push(`Row ${i}: 'model' is required`); continue }
        if (isNaN(year) || year < 1980 || year > new Date().getFullYear() + 1) {
            errors.push(`Row ${i}: invalid year '${row.year}'`); continue
        }
        if (isNaN(price) || price <= 0) {
            errors.push(`Row ${i}: invalid price '${row.price_inr}'`); continue
        }

        rows.push({
            make,
            model,
            variant:      row.variant      || undefined,
            year,
            price_inr:    price,
            km_driven:    row.km_driven    ? parseInt(row.km_driven)    : undefined,
            fuel:         row.fuel         || undefined,
            transmission: row.transmission || undefined,
            color:        row.color        || undefined,
            reg_number:   row.reg_number   || undefined,
        })
    }
    return { rows, errors }
}

function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = "vehicle-upload-template.csv"
    a.click()
    URL.revokeObjectURL(url)
}

function formatPrice(n: number) {
    if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`
    if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`
    return `₹${n.toLocaleString("en-IN")}`
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BulkUploadPage() {
    const router = useRouter()
    const { updateData, setStep } = useOnboardingStore()

    const [rows,       setRows]       = useState<VehicleUploadRow[]>([])
    const [parseErrors, setParseErrors] = useState<string[]>([])
    const [fileName,   setFileName]   = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const [saving,     setSaving]     = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { setStep(2) }, [setStep])

    // ── File processing ───────────────────────────────────────────────────────
    const processFile = useCallback((file: File) => {
        if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
            setParseErrors(["Please upload a .csv file"])
            return
        }
        if (file.size > 2 * 1024 * 1024) {
            setParseErrors(["File too large — max 2 MB"])
            return
        }

        setFileName(file.name)
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target?.result as string
            const { rows: parsed, errors } = parseCSV(text)
            setRows(parsed)
            setParseErrors(errors)
        }
        reader.readAsText(file)
    }, [])

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) processFile(file)
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) processFile(file)
    }

    const clearFile = () => {
        setRows([])
        setParseErrors([])
        setFileName("")
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    // ── Save & continue ───────────────────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true)
        // Store uploaded vehicles in Zustand (persisted to localStorage)
        // They will be saved to the DB when the dealer completes step-6
        updateData({
            inventorySource:  "own",
            uploadedVehicles: rows,
        })
        await new Promise(r => setTimeout(r, 400)) // brief save animation
        setSaving(false)
        setStep(3)
        router.push("/onboarding/step-3")
    }

    const handleBack = () => router.push("/onboarding/step-2-inventory")

    // ── Render ────────────────────────────────────────────────────────────────
    const hasFile = fileName !== ""
    const hasRows = rows.length > 0

    return (
        <div className="space-y-6 animate-fade-in">

            {/* Heading */}
            <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Step 2 of 5 — Bulk Upload
                </p>
                <h1 className="text-2xl font-bold tracking-tight">Upload Your Vehicle Stock</h1>
                <p className="text-sm text-muted-foreground">
                    Download the template, fill in your vehicles, then upload it here.
                    We&apos;ll show a preview before saving anything.
                </p>
            </div>

            {/* Download template */}
            <Card variant="glass" className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold">vehicle-upload-template.csv</p>
                                <p className="text-xs text-muted-foreground">
                                    Columns: {CSV_HEADERS.join(", ")}
                                </p>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={downloadTemplate}
                            className="gap-2 shrink-0"
                        >
                            <Download className="w-4 h-4" />
                            Download Template
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Upload area */}
            {!hasFile ? (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200",
                        isDragging
                            ? "border-blue-500/60 bg-blue-500/5 scale-[1.01]"
                            : "border-border hover:border-blue-400/50 hover:bg-muted/30"
                    )}
                >
                    <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                        isDragging ? "bg-blue-500/15" : "bg-muted"
                    )}>
                        <Upload className={cn("w-7 h-7 transition-colors", isDragging ? "text-blue-500" : "text-muted-foreground")} />
                    </div>
                    <div className="text-center">
                        <p className="text-base font-semibold">
                            {isDragging ? "Drop your CSV here!" : "Click or drag & drop your CSV"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            CSV files only · Max 2 MB · Up to 500 vehicles
                        </p>
                    </div>
                </div>
            ) : (
                /* File uploaded — show status bar */
                <div className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-colors",
                    hasRows ? "border-emerald-500/40 bg-emerald-500/5" : "border-destructive/40 bg-destructive/5"
                )}>
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        hasRows ? "bg-emerald-500/15" : "bg-destructive/15"
                    )}>
                        {hasRows
                            ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            : <XCircle className="w-5 h-5 text-destructive" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{fileName}</p>
                        <p className={cn("text-xs mt-0.5", hasRows ? "text-emerald-600" : "text-destructive")}>
                            {hasRows
                                ? `${rows.length} vehicle${rows.length !== 1 ? "s" : ""} ready to upload`
                                : "No valid rows found"}
                        </p>
                    </div>
                    <button
                        onClick={clearFile}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileInput}
                className="hidden"
            />

            {/* Parse errors */}
            {parseErrors.length > 0 && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm font-semibold">
                            {parseErrors.length} row{parseErrors.length !== 1 ? "s" : ""} skipped
                        </p>
                    </div>
                    <ul className="space-y-1 max-h-32 overflow-y-auto">
                        {parseErrors.map((e, i) => (
                            <li key={i} className="text-xs text-muted-foreground font-mono">
                                {e}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Preview table */}
            {hasRows && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">
                            Preview — {rows.length} vehicle{rows.length !== 1 ? "s" : ""}
                            {rows.length > 5 && (
                                <span className="text-muted-foreground font-normal ml-1.5">
                                    (showing first 5)
                                </span>
                            )}
                        </h3>
                        <button
                            onClick={clearFile}
                            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                        >
                            Replace file
                        </button>
                    </div>

                    <div className="rounded-xl border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        {["#", "Make & Model", "Year", "Price", "KM", "Fuel", "Transmission", "Colour"].map(h => (
                                            <th key={h} className="px-3 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.slice(0, 5).map((row, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                                        >
                                            <td className="px-3 py-2.5 text-muted-foreground">{i + 1}</td>
                                            <td className="px-3 py-2.5">
                                                <p className="font-semibold text-foreground">
                                                    {row.make} {row.model}
                                                </p>
                                                {row.variant && (
                                                    <p className="text-muted-foreground">{row.variant}</p>
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5 text-foreground font-medium">{row.year}</td>
                                            <td className="px-3 py-2.5 text-emerald-600 font-semibold whitespace-nowrap">
                                                {formatPrice(row.price_inr)}
                                            </td>
                                            <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                                                {row.km_driven ? `${row.km_driven.toLocaleString()} km` : "—"}
                                            </td>
                                            <td className="px-3 py-2.5 text-muted-foreground">{row.fuel ?? "—"}</td>
                                            <td className="px-3 py-2.5 text-muted-foreground">{row.transmission ?? "—"}</td>
                                            <td className="px-3 py-2.5 text-muted-foreground">{row.color ?? "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {rows.length > 5 && (
                            <div className="px-3 py-2 bg-muted/20 border-t border-border text-xs text-muted-foreground text-center">
                                + {rows.length - 5} more vehicle{rows.length - 5 !== 1 ? "s" : ""} will also be uploaded
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                </Button>

                <Button
                    onClick={handleSave}
                    disabled={!hasRows || saving}
                    className="gap-2"
                >
                    {saving ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                    ) : (
                        <>
                            Upload {hasRows ? `${rows.length} Vehicle${rows.length !== 1 ? "s" : ""}` : ""}
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </Button>
            </div>

        </div>
    )
}
