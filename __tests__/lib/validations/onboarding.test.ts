import {
    formatOnboardingPhone,
    hasValidationErrors,
    toOnboardingPhoneInputValue,
    validateOnboardingContactStep,
    validateOnboardingPhone,
    validateOnboardingReadyForSave,
    validateTemplateSocialUrls,
} from '@/lib/validations/onboarding'

describe('onboarding validation', () => {
    it('normalizes stored +91 phone numbers back to 10 digit input values', () => {
        expect(toOnboardingPhoneInputValue('+91 98765 43210')).toBe('9876543210')
        expect(formatOnboardingPhone('98765 43210')).toBe('+919876543210')
    })

    it('requires onboarding phone numbers to be 10 digit Indian mobile numbers', () => {
        expect(validateOnboardingPhone('9876543210')).toBeNull()
        expect(validateOnboardingPhone('987654321')).toBe('Phone number must be exactly 10 digits')
        expect(validateOnboardingPhone('5876543210')).toBe('Phone number must start with 6, 7, 8, or 9')
        expect(validateOnboardingPhone('', { required: false })).toBeNull()
    })

    it('validates contact step core fields, slug state, whatsapp, map link, and branches', () => {
        const result = validateOnboardingContactStep({
            dealershipName:      '',
            location:            '',
            phone:               '123',
            email:               'bad',
            gstin:               'bad',
            whatsapp:            '123',
            mapLink:             'ftp://maps.example.com',
            siteSlug:            'demo',
            slugStatus:          'checking',
            hasMultipleBranches: true,
            branches:            [{ city: '', state: '', address: '', phone: '123' }],
        })

        expect(result.errors).toMatchObject({
            dealershipName: 'Dealership name is required',
            location:       'Location is required',
            phone:          'Phone number must be exactly 10 digits',
            email:          'Please enter a valid email',
            gstin:          'Enter a valid 15-character GSTIN',
            whatsapp:       'WhatsApp number must be exactly 10 digits',
            mapLink:        'Enter a valid map URL starting with http:// or https://',
            siteSlug:       'Checking site name. Please wait a moment.',
            _branches:      'Please fix branch errors',
        })
        expect(result.branchErrors).toMatchObject({
            '0-city':    'City is required',
            '0-state':   'State is required',
            '0-address': 'Address is required',
            '0-phone':   'Branch phone must be exactly 10 digits',
        })
    })

    it('blocks invalid social URLs before review steps continue', () => {
        const errors = validateTemplateSocialUrls({
            facebook: 'https://facebook.com/demo',
            instagram: 'instagram/demo',
        })

        expect(errors).toEqual({
            instagram: 'Enter a valid URL starting with http:// or https://',
        })
        expect(hasValidationErrors(errors)).toBe(true)
    })

    it('validates final onboarding save prerequisites', () => {
        const errors = validateOnboardingReadyForSave({
            dealershipName: '',
            location: '',
            phone: '987654321',
            email: 'bad',
            slug: '',
            services: [],
            dealerCategory: 'new',
            brands: [],
            templateConfig: {
                heroTitle: '',
                heroSubtitle: '',
                heroCtaText: '',
                featuresTitle: '',
                facebook: 'facebook/demo',
            },
        })

        expect(errors).toContain('Dealership name is required before completing setup.')
        expect(errors).toContain('Please select at least one service before completing setup.')
        expect(errors).toContain('Please select at least one authorised brand before completing setup.')
        expect(errors).toContain('Please fix invalid social media links before completing setup.')
    })

    it('validates authorised brands against the selected vehicle segments', () => {
        const base = {
            dealershipName: 'Kumar Motors',
            location:       'Hyderabad',
            phone:          '9876543210',
            email:          'owner@example.com',
            slug:           'kumar-motors',
            services:       ['new_car_sales' as const],
            styleTemplate:  'family' as const,
            templateConfig: {
                heroTitle:     '',
                heroSubtitle:  '',
                heroCtaText:   '',
                featuresTitle: '',
            },
        }

        expect(validateOnboardingReadyForSave({
            ...base,
            dealerCategory:    'new',
            sellsTwoWheelers:  true,
            sellsNewCars:      false,
            brands2w:          ['Hero'],
        })).toEqual([])

        expect(validateOnboardingReadyForSave({
            ...base,
            dealerCategory:    'new',
            sellsTwoWheelers:  true,
            sellsNewCars:      true,
            brands2w:          ['Hero'],
        })).toEqual([])

        expect(validateOnboardingReadyForSave({
            ...base,
            dealerCategory:      'new',
            sellsThreeWheelers:  true,
            sellsNewCars:        false,
            brands3w:            ['Piaggio'],
        })).toEqual([])

        expect(validateOnboardingReadyForSave({
            ...base,
            dealerCategory:      'new',
            sellsThreeWheelers:  true,
            sellsNewCars:        true,
            brands3w:            ['Piaggio'],
        })).toEqual([])

        expect(validateOnboardingReadyForSave({
            ...base,
            dealerCategory:   'new',
            sellsFourWheelers: true,
            sellsNewCars:     true,
            brands:           ['Hyundai'],
        })).toEqual([])

        const missingTwoWheelerBrandErrors = validateOnboardingReadyForSave({
            ...base,
            dealerCategory:   'new',
            sellsTwoWheelers: true,
            sellsNewCars:     true,
            brands2w:         [],
        })
        expect(missingTwoWheelerBrandErrors).toContain('Please select at least one authorised two-wheeler brand before completing setup.')
        expect(missingTwoWheelerBrandErrors).not.toContain('Please select at least one authorised car brand before completing setup.')

        const missingThreeWheelerBrandErrors = validateOnboardingReadyForSave({
            ...base,
            dealerCategory:     'new',
            sellsThreeWheelers: true,
            sellsNewCars:       true,
            brands3w:           [],
        })
        expect(missingThreeWheelerBrandErrors).toContain('Please select at least one authorised three-wheeler brand before completing setup.')
        expect(missingThreeWheelerBrandErrors).not.toContain('Please select at least one authorised car brand before completing setup.')
    })
})
