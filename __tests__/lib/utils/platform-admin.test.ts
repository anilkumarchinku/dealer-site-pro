import { describe, expect, it } from 'vitest'

import {
    getMetadataString,
    isPlatformAdminAppMetadata,
    PLATFORM_ADMIN_ROLE,
} from '@/lib/utils/platform-admin'

describe('platform admin metadata helpers', () => {
    it('accepts only the platform admin app metadata role', () => {
        expect(isPlatformAdminAppMetadata({ role: PLATFORM_ADMIN_ROLE })).toBe(true)
        expect(isPlatformAdminAppMetadata({ role: 'dealer' })).toBe(false)
        expect(isPlatformAdminAppMetadata({ role: ' super_admin ' })).toBe(true)
        expect(isPlatformAdminAppMetadata(null)).toBe(false)
    })

    it('returns trimmed string metadata and ignores non-strings', () => {
        expect(getMetadataString({ name: ' Ravi Abhinav ' }, 'name')).toBe('Ravi Abhinav')
        expect(getMetadataString({ name: '' }, 'name')).toBeNull()
        expect(getMetadataString({ name: 42 }, 'name')).toBeNull()
        expect(getMetadataString(undefined, 'name')).toBeNull()
    })
})
