export const PLATFORM_ADMIN_ROLE = 'super_admin'

type Metadata = Record<string, unknown> | null | undefined

export function getMetadataString(metadata: Metadata, key: string): string | null {
    const value = metadata?.[key]
    return typeof value === 'string' && value.trim() ? value.trim() : null
}

export function isPlatformAdminAppMetadata(metadata: Metadata): boolean {
    return getMetadataString(metadata, 'role') === PLATFORM_ADMIN_ROLE
}
