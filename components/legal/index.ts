export { LegalShell } from './LegalShell'
export { TermsContent } from './TermsContent'
export { PrivacyContent } from './PrivacyContent'
export { AboutContent } from './AboutContent'
export { ContactContent } from './ContactContent'

export type VehicleSegment = '4w' | '2w' | '3w'

export function getVehicleWord(seg: VehicleSegment) {
    if (seg === '2w') return 'two-wheeler'
    if (seg === '3w') return 'three-wheeler'
    return 'vehicle'
}

export function getVehicleEmoji(seg: VehicleSegment) {
    if (seg === '2w') return '🏍️'
    if (seg === '3w') return '🛺'
    return '🚗'
}
