import { Badge } from "@/components/ui/badge"
import { getStatusVariant } from "./utils"

export function StatusBadge({ status }: { status: string }) {
    return (
        <Badge variant={getStatusVariant(status)} className="capitalize shrink-0">
            {status.replace(/_/g, " ")}
        </Badge>
    )
}
