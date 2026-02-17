import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingData, DealerType, Brand, Service, StyleTemplate, InventorySystem } from '@/lib/types';

interface OnboardingStore {
    // Current step (1-5)
    currentStep: number;

    // Form data
    data: Partial<OnboardingData>;

    // Supabase: dealer row ID after onboarding is saved
    dealerId: string | null;

    // Supabase: dealer URL slug
    dealerSlug: string | null;

    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateData: (data: Partial<OnboardingData>) => void;
    setDealerId: (id: string) => void;
    setDealerSlug: (slug: string) => void;
    reset: () => void;

    // Computed
    isComplete: () => boolean;
    getDealerType: () => DealerType | null;
}

const initialData: Partial<OnboardingData> = {
    dealershipName: '',
    tagline: '',
    location: '',
    fullAddress: '',
    mapLink: '',
    yearsInBusiness: null,
    phone: '',
    whatsapp: '',
    email: '',
    gstin: '',
    sellsNewCars: false,
    sellsUsedCars: false,
    brands: [],
    inventorySystem: null,
    services: [],
    styleTemplate: 'family',
    dealerType: null,
    templateConfig: {
        heroTitle: '',
        heroSubtitle: '',
        heroCtaText: 'View Inventory',
        featuresTitle: 'Why Choose Us',
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        linkedin: '',
        workingHours: ''
    },
};

export const useOnboardingStore = create<OnboardingStore>()(
    persist(
        (set, get) => ({
            currentStep: 1,
            data: initialData,
            dealerId: null,
            dealerSlug: null,

            setStep: (step) => set({ currentStep: step }),

            nextStep: () => set((state) => ({
                currentStep: Math.min(state.currentStep + 1, 5)
            })),

            prevStep: () => set((state) => ({
                currentStep: Math.max(state.currentStep - 1, 1)
            })),

            updateData: (newData) => set((state) => ({
                data: { ...state.data, ...newData }
            })),

            setDealerId: (id) => set({ dealerId: id }),

            setDealerSlug: (slug) => set({ dealerSlug: slug }),

            reset: () => set({ currentStep: 1, data: initialData, dealerId: null, dealerSlug: null }),

            isComplete: () => {
                const { data } = get();
                return !!(
                    data.dealershipName &&
                    data.location &&
                    data.email &&
                    data.phone &&
                    data.styleTemplate &&
                    (data.sellsNewCars || data.sellsUsedCars) &&
                    data.services && data.services.length > 0
                );
            },

            getDealerType: () => {
                const { data } = get();

                // Not enough info yet
                if (!data.sellsNewCars && !data.sellsUsedCars) return null;

                // Type 3: Used only
                if (!data.sellsNewCars && data.sellsUsedCars) {
                    return 'used_only';
                }

                // Type 1: Single OEM (new cars, one brand)
                if (data.sellsNewCars && !data.sellsUsedCars && data.brands?.length === 1) {
                    return 'single_oem';
                }

                // Type 2: Multi OEM (new cars, multiple brands)
                if (data.sellsNewCars && !data.sellsUsedCars && (data.brands?.length ?? 0) > 1) {
                    return 'multi_oem';
                }

                // Type 4: Hybrid (new + used)
                if (data.sellsNewCars && data.sellsUsedCars) {
                    return 'hybrid';
                }

                return null;
            },
        }),
        {
            name: 'dealersite-onboarding',
        }
    )
);
