"use client"

/**
 * Imperative confirmation dialog — `await confirm({ ... })` returns a boolean.
 *
 * Mirrors the ergonomics of `lib/utils/toast` (no provider required) but is
 * rendered through Radix `Dialog`, so it is focus-trapped, Esc-dismissible,
 * token-driven, and dark-mode correct — unlike `window.confirm`.
 *
 *   if (await confirm({ title: "Delete listing?", destructive: true })) { ... }
 */

import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { AlertTriangle } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export type ConfirmOptions = {
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    /** Apply destructive styling + warning icon for dangerous actions. */
    destructive?: boolean
}

function ConfirmDialog({
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    destructive = false,
    onResolve,
}: ConfirmOptions & { onResolve: (result: boolean) => void }) {
    const [open, setOpen] = React.useState(true)

    // Resolve exactly once — guards the race between an explicit button click
    // and Radix's onOpenChange firing on the same interaction.
    const settled = React.useRef(false)
    const settle = React.useCallback(
        (result: boolean) => {
            if (settled.current) return
            settled.current = true
            setOpen(false)
            onResolve(result)
        },
        [onResolve],
    )

    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next) settle(false) }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {destructive && <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />}
                        {title}
                    </DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline" onClick={() => settle(false)}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={destructive ? "destructive" : "default"}
                        onClick={() => settle(true)}
                        autoFocus
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function confirm(options: ConfirmOptions): Promise<boolean> {
    if (typeof document === "undefined") return Promise.resolve(false)

    return new Promise<boolean>((resolve) => {
        const host = document.createElement("div")
        document.body.appendChild(host)
        const root: Root = createRoot(host)

        const finish = (result: boolean) => {
            resolve(result)
            // Defer unmount so the Radix close animation (~200ms) can play out.
            setTimeout(() => {
                root.unmount()
                host.remove()
            }, 200)
        }

        root.render(<ConfirmDialog {...options} onResolve={finish} />)
    })
}
