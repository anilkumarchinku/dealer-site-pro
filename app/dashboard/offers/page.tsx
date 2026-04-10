"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { Loader2, Plus, Trash2, Tag } from "lucide-react"

interface OfferRow {
  id: string
  title: string
  description: string | null
  tag: string | null
  valid_until: string | null
  created_at: string
}

const TAG_OPTIONS = ["Finance", "Exchange", "Service", "Electric", "Offer", "Referral", "Seasonal"]

const TAG_COLORS: Record<string, string> = {
  Finance:  'bg-green-100 text-green-700',
  Exchange: 'bg-blue-100 text-blue-700',
  Service:  'bg-purple-100 text-purple-700',
  Electric: 'bg-yellow-100 text-yellow-700',
  Offer:    'bg-orange-100 text-orange-700',
  Referral: 'bg-red-100 text-red-700',
  Seasonal: 'bg-pink-100 text-pink-700',
}

export default function OffersPage() {
  const { dealerId } = useOnboardingStore()
  const [offers, setOffers] = useState<OfferRow[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', tag: 'Offer', valid_until: '' })
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!dealerId) return
    setLoading(true)
    fetch(`/api/offers?dealer_id=${dealerId}`)
      .then(r => r.json())
      .then(d => setOffers(d.offers ?? []))
      .finally(() => setLoading(false))
  }, [dealerId])

  async function saveOffer() {
    if (!dealerId || !form.title.trim()) return
    setSaving(true)
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer internal' },
      body: JSON.stringify({ dealer_id: dealerId, ...form, valid_until: form.valid_until || null })
    })
    const data = await res.json()
    if (data.success) {
      setOffers(prev => [{ id: data.id, ...form, valid_until: form.valid_until || null, created_at: new Date().toISOString() }, ...prev])
      setForm({ title: '', description: '', tag: 'Offer', valid_until: '' })
      setAdding(false)
    }
    setSaving(false)
  }

  async function deleteOffer(id: string) {
    await fetch(`/api/offers?id=${id}`, { method: 'DELETE' })
    setOffers(prev => prev.filter(o => o.id !== id))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Offers &amp; Schemes</h1>
          <p className="text-muted-foreground">Manage special offers shown on your dealer site</p>
        </div>
        <Button
          onClick={() => setAdding(v => !v)}
          variant={adding ? "outline" : "default"}
          size="sm"
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {adding ? "Cancel" : "Add New Offer"}
        </Button>
      </div>

      {/* Add Offer Form */}
      {adding && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-base">New Offer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title <span className="text-red-500">*</span></label>
              <Input
                placeholder="e.g. Free 1st Service on any new purchase"
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
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[160px]">
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
              <div className="flex-1 min-w-[160px]">
                <label className="text-sm font-medium mb-1 block">Valid Until <span className="text-muted-foreground font-normal">(optional)</span></label>
                <Input
                  type="date"
                  value={form.valid_until}
                  onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={saveOffer} disabled={saving || !form.title.trim()} size="sm" className="gap-1.5">
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

      {/* Offers List */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
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
              <p className="text-sm mt-1">Add your first offer above to display it on your dealer site.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {offers.map(offer => (
                <div key={offer.id} className="flex items-start gap-3 p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {offer.tag && (
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[offer.tag] ?? 'bg-gray-100 text-gray-700'}`}>
                          {offer.tag}
                        </span>
                      )}
                      <h3 className="font-semibold text-sm">{offer.title}</h3>
                    </div>
                    {offer.description && (
                      <p className="text-sm text-muted-foreground">{offer.description}</p>
                    )}
                    {offer.valid_until && (
                      <p className="text-xs text-muted-foreground">
                        Expires: {new Date(offer.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
