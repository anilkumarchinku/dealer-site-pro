'use client'

import { useState, useRef } from 'react'
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { bulkAddVehicles } from '@/lib/db/vehicles'

interface Props {
    isOpen: boolean
    onClose: () => void
    dealerId: string
    onSuccess: (count: number) => void
}

interface ParsedRow {
    make: string
    model: string
    year: number
    price_paise: number
    mileage_km?: number
    color?: string
    transmission?: string
    fuel_type?: string
    condition: 'used' | 'certified_pre_owned'
    _raw: string
    _error?: string
}

const EXPECTED_HEADERS = ['make', 'model', 'year', 'price', 'mileage', 'color', 'transmission', 'fuel_type', 'condition']

function parseCSV(text: string): ParsedRow[] {
    const lines = text.trim().split('\n').filter(l => l.trim())
    if (lines.length < 2) return []

    // skip header row
    const dataLines = lines[0].toLowerCase().includes('make') ? lines.slice(1) : lines

    return dataLines.map((line, i) => {
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
        const [make, model, yearStr, priceStr, mileageStr, color, transmission, fuel_type, condition] = cols
        const errors: string[] = []

        if (!make) errors.push('make missing')
        if (!model) errors.push('model missing')
        const year = parseInt(yearStr)
        if (isNaN(year) || year < 1990 || year > 2026) errors.push('invalid year')
        const price = parseFloat(priceStr)
        if (isNaN(price) || price <= 0) errors.push('invalid price')

        const conditionNorm = (condition ?? 'used').toLowerCase().replace(/\s+/g, '_')
        const validCondition = conditionNorm === 'certified_pre_owned' || conditionNorm === 'cpo'
            ? 'certified_pre_owned'
            : 'used'

        return {
            make: make ?? '',
            model: model ?? '',
            year,
            price_paise: Math.round(price * 100),
            mileage_km: mileageStr ? parseInt(mileageStr) || undefined : undefined,
            color: color || undefined,
            transmission: transmission || undefined,
            fuel_type: fuel_type || undefined,
            condition: validCondition,
            _raw: line,
            _error: errors.length ? errors.join(', ') : undefined,
        } as ParsedRow
    })
}

const SAMPLE_CSV = `make,model,year,price,mileage,color,transmission,fuel_type,condition
Maruti Suzuki,Swift,2022,650000,25000,Red,Manual,Petrol,used
Honda,City,2021,900000,35000,White,Automatic,Petrol,used
Hyundai,Creta,2020,1100000,42000,Blue,Automatic,Diesel,certified_pre_owned`

export default function BulkUploadModal({ isOpen, onClose, dealerId, onSuccess }: Props) {
    const [rows, setRows] = useState<ParsedRow[]>([])
    const [uploading, setUploading] = useState(false)
    const [done, setDone] = useState<{ count: number } | null>(null)
    const [error, setError] = useState('')
    const fileRef = useRef<HTMLInputElement>(null)

    const validRows = rows.filter(r => !r._error)
    const invalidRows = rows.filter(r => r._error)

    function handleFile(file: File) {
        setError('')
        setDone(null)
        const reader = new FileReader()
        reader.onload = e => {
            const text = e.target?.result as string
            const parsed = parseCSV(text)
            if (parsed.length === 0) {
                setError('No valid rows found. Make sure your CSV has data rows.')
                return
            }
            setRows(parsed)
        }
        reader.readAsText(file)
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    async function handleUpload() {
        if (!validRows.length || !dealerId) return
        setUploading(true)
        setError('')

        const payloads = validRows.map(r => ({
            dealer_id: dealerId,
            make: r.make,
            model: r.model,
            year: r.year,
            price_paise: r.price_paise,
            mileage_km: r.mileage_km,
            color: r.color,
            transmission: r.transmission,
            fuel_type: r.fuel_type,
            condition: r.condition,
            features: [],
        }))

        const result = await bulkAddVehicles(payloads)
        setUploading(false)

        if (result.success) {
            setDone({ count: result.count })
            onSuccess(result.count)
        } else {
            setError(result.errors[0] ?? 'Upload failed. Please try again.')
        }
    }

    function handleClose() {
        setRows([])
        setDone(null)
        setError('')
        onClose()
    }

    function downloadSample() {
        const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'bulk-upload-sample.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-xl">
                            <Upload className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <DialogTitle>Bulk Upload Vehicles</DialogTitle>
                            <DialogDescription className="sr-only">Upload multiple vehicle listings at once via CSV or manual entry</DialogDescription>
                            <p className="text-sm text-muted-foreground">Upload a CSV to add multiple vehicles at once</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Success state */}
                    {done ? (
                        <div className="py-10 text-center">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">{done.count} Vehicles Uploaded!</h3>
                            <p className="text-muted-foreground text-sm mb-6">All vehicles are now live in your inventory.</p>
                            <Button onClick={handleClose}>Done</Button>
                        </div>
                    ) : (
                        <>
                            {/* Sample CSV download */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold">Download Sample CSV</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Columns: make, model, year, price (₹), mileage (km), color, transmission, fuel_type, condition
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" onClick={downloadSample} className="gap-2 shrink-0">
                                    <Download className="w-4 h-4" />
                                    Sample
                                </Button>
                            </div>

                            {/* Drop zone */}
                            {rows.length === 0 && (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={e => e.preventDefault()}
                                    onClick={() => fileRef.current?.click()}
                                    className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                                >
                                    <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                                    <p className="font-semibold mb-1">Drop your CSV here</p>
                                    <p className="text-sm text-muted-foreground">or click to browse</p>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept=".csv,text/csv"
                                        className="hidden"
                                        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                                    />
                                </div>
                            )}

                            {/* Preview table */}
                            {rows.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">
                                            Preview — {validRows.length} valid
                                            {invalidRows.length > 0 && (
                                                <span className="text-destructive ml-2">· {invalidRows.length} with errors</span>
                                            )}
                                        </p>
                                        <button onClick={() => setRows([])} className="text-xs text-muted-foreground hover:text-foreground">
                                            Change file
                                        </button>
                                    </div>

                                    <div className="rounded-xl border border-border overflow-hidden">
                                        <div className="overflow-x-auto max-h-60">
                                            <table className="w-full text-xs">
                                                <thead className="bg-muted/50 sticky top-0">
                                                    <tr>
                                                        {['Make', 'Model', 'Year', 'Price (₹)', 'Mileage', 'Condition', 'Status'].map(h => (
                                                            <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {rows.map((row, i) => (
                                                        <tr key={i} className={row._error ? 'bg-destructive/5' : ''}>
                                                            <td className="px-3 py-2">{row.make}</td>
                                                            <td className="px-3 py-2">{row.model}</td>
                                                            <td className="px-3 py-2">{row.year || '—'}</td>
                                                            <td className="px-3 py-2">{row.price_paise ? `₹${(row.price_paise / 100).toLocaleString('en-IN')}` : '—'}</td>
                                                            <td className="px-3 py-2">{row.mileage_km ? `${row.mileage_km.toLocaleString()} km` : '—'}</td>
                                                            <td className="px-3 py-2">{row.condition === 'certified_pre_owned' ? 'CPO' : 'Used'}</td>
                                                            <td className="px-3 py-2">
                                                                {row._error
                                                                    ? <span className="text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{row._error}</span>
                                                                    : <span className="text-emerald-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" />OK</span>
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-center gap-2 text-sm text-destructive">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            {rows.length > 0 && (
                                <div className="flex gap-3 justify-end">
                                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                                    <Button
                                        onClick={handleUpload}
                                        disabled={uploading || validRows.length === 0}
                                        className="gap-2 bg-amber-500 hover:bg-amber-600 text-white"
                                    >
                                        {uploading
                                            ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading…</>
                                            : <><Upload className="w-4 h-4" />Upload {validRows.length} Vehicles</>
                                        }
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
