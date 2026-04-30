import {
    getOnboardingAccountPrefill,
    getOnboardingBranchPrefill,
    getOnboardingContactFormPrefill,
    getOnboardingResetPrefill,
    getPrefilledTemplateConfig,
} from '@/lib/onboarding/prefill'

describe('onboarding prefill helpers', () => {
    it('preserves registration contact fields across onboarding resets', () => {
        expect(getOnboardingResetPrefill({
            dealershipName:  ' Raj Motors ',
            phone:           '+919876543210',
            email:           'owner@rajmotors.in',
            location:        '',
            brands:          ['Tata Motors'],
            services:        ['new_car_sales'],
            dealerCategory:  'new',
            styleTemplate:   'luxury',
        })).toEqual({
            dealershipName: 'Raj Motors',
            phone:          '+919876543210',
            email:          'owner@rajmotors.in',
        })
    })

    it('maps stored contact data back into editable onboarding fields', () => {
        expect(getOnboardingContactFormPrefill({
            dealershipName:  'Raj Motors',
            phone:           '+919876543210',
            whatsapp:        '+918765432109',
            email:           'owner@rajmotors.in',
            yearsInBusiness: 12,
        })).toMatchObject({
            dealershipName:  'Raj Motors',
            phone:           '9876543210',
            whatsapp:        '8765432109',
            email:           'owner@rajmotors.in',
            yearsInBusiness: '12',
            phoneCountryCode: '+91',
        })
    })

    it('prefills homepage copy from dealership details collected earlier', () => {
        expect(getPrefilledTemplateConfig({
            dealershipName: 'Raj Motors',
            tagline:        'Driven by Trust',
            location:       'Hyderabad',
        }, 'two-wheeler')).toMatchObject({
            heroTitle:    'Welcome to Raj Motors',
            heroSubtitle: 'Driven by Trust',
            heroCtaText:  'View Our Bikes',
        })
    })

    it('normalizes saved branch phone numbers for editing', () => {
        expect(getOnboardingBranchPrefill([
            { city: 'Hyderabad', state: 'Telangana', address: 'Main Road', phone: '+919876543210' },
        ])).toEqual([
            { city: 'Hyderabad', state: 'Telangana', address: 'Main Road', phone: '9876543210', phoneCountryCode: '+91' },
        ])
    })

    it('prefills empty onboarding fields from the verified account dealer row', () => {
        expect(getOnboardingAccountPrefill(
            { dealershipName: 'Already Typed' },
            {
                userEmail: 'owner@rajmotors.in',
                metadata:  { dealership_name: 'Metadata Motors', phone: '+919876543210' },
                dealer:    {
                    dealership_name:  'Dealer Row Motors',
                    location:         'Hyderabad',
                    full_address:     'Main Road',
                    years_in_business: 8,
                    phone:            '+918765432109',
                    email:            'dealer@rajmotors.in',
                },
            },
        )).toEqual({
            location:        'Hyderabad',
            fullAddress:     'Main Road',
            yearsInBusiness: 8,
            phone:           '+918765432109',
            email:           'dealer@rajmotors.in',
        })
    })
})
