import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingData, DealerType, OnboardingWebsitePlan } from '@/lib/types';

interface OnboardingStore {
    // Current route step (car flow uses 1-6; 2W/3W use 1-5)
    currentStep: number;

    // Form data
    data: Partial<OnboardingData>;

    // Which vehicle category this dealer sells
    vehicleType: 'car' | 'two-wheeler' | 'three-wheeler';

    // Additional segment flags (true when dealer adds a secondary vehicle type)
    sellsTwoWheelers:   boolean;
    sellsThreeWheelers: boolean;
    sellsFourWheelers:  boolean;

    // Supabase: dealer row ID after onboarding is saved
    dealerId: string | null;

    // Supabase: dealer URL slug
    dealerSlug: string | null;

    // Draft websites selected from the onboarding entry flow
    pendingWebsitePlans: OnboardingWebsitePlan[];
    activeWebsitePlanId: string | null;

    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateData: (data: Partial<OnboardingData>) => void;
    setVehicleType: (type: 'car' | 'two-wheeler' | 'three-wheeler') => void;
    setSellsTwoWheelers:   (v: boolean) => void;
    setSellsThreeWheelers: (v: boolean) => void;
    setSellsFourWheelers:  (v: boolean) => void;
    setDealerId: (id: string) => void;
    setDealerSlug: (slug: string) => void;
    setPendingWebsitePlans: (plans: OnboardingWebsitePlan[]) => void;
    clearPendingWebsitePlans: () => void;
    removePendingWebsitePlan: (id: string) => void;
    setActiveWebsitePlanId: (id: string | null) => void;
    reset: (prefill?: Partial<OnboardingData>) => void;

    // Computed
    isComplete: () => boolean;
    getDealerType: () => DealerType | null;
    isUsedCarDealer: () => boolean;
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
    brands2w: [],
    brands3w: [],
    sellsFourWheelers: false,
    sellsTwoWheelers: false,
    sellsThreeWheelers: false,
    inventorySystem: null,
    services: [],
    styleTemplate: 'family',
    dealerType: null,
    dealerCategory: undefined,
    launchMode: 'initial',
    brandColor: undefined,
    brandAccentColor: undefined,
    brandColorPreset: undefined,
    brandLogo: undefined,
    outlets: [],
    heroImage: undefined,
    heroImages: undefined,
    inventorySource: undefined,
    inventoryEntryMode: undefined,
    cyeproApiKey: undefined,
    uploadedVehicles: undefined,
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

const initialTemplateConfig: OnboardingData['templateConfig'] = {
    heroTitle: '',
    heroSubtitle: '',
    heroCtaText: 'View Inventory',
    featuresTitle: 'Why Choose Us',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: '',
    workingHours: '',
};

export const useOnboardingStore = create<OnboardingStore>()(
    persist(
        (set, get) => ({
            currentStep: 1,
            data: initialData,
            vehicleType: 'car',
            sellsTwoWheelers:   false,
            sellsThreeWheelers: false,
            sellsFourWheelers:  false,
            dealerId: null,
            dealerSlug: null,
            pendingWebsitePlans: [],
            activeWebsitePlanId: null,

            setStep: (step) => set({ currentStep: step }),

            nextStep: () => set((state) => ({
                currentStep: Math.min(state.currentStep + 1, 6)
            })),

            prevStep: () => set((state) => ({
                currentStep: Math.max(state.currentStep - 1, 1)
            })),

            updateData: (newData) => set((state) => ({
                data: { ...state.data, ...newData }
            })),

            setVehicleType: (type) => set({ vehicleType: type }),

            setSellsTwoWheelers:   (v) => set({ sellsTwoWheelers:   v }),
            setSellsThreeWheelers: (v) => set({ sellsThreeWheelers: v }),
            setSellsFourWheelers:  (v) => set({ sellsFourWheelers:  v }),

            setDealerId: (id) => set({ dealerId: id }),

            setDealerSlug: (slug) => set({ dealerSlug: slug }),

            setPendingWebsitePlans: (plans) => set({ pendingWebsitePlans: plans }),

            clearPendingWebsitePlans: () => set({ pendingWebsitePlans: [], activeWebsitePlanId: null }),

            removePendingWebsitePlan: (id) => set((state) => {
                const nextPlans = state.pendingWebsitePlans.filter((plan) => plan.id !== id);
                return {
                    pendingWebsitePlans: nextPlans,
                    activeWebsitePlanId: state.activeWebsitePlanId === id ? null : state.activeWebsitePlanId,
                };
            }),

            setActiveWebsitePlanId: (id) => set({ activeWebsitePlanId: id }),

            reset: (prefill = {}) => set({
                currentStep: 1,
                data: {
                    ...initialData,
                    ...prefill,
                    templateConfig: {
                        ...initialTemplateConfig,
                        ...prefill.templateConfig,
                    },
                },
                vehicleType: 'car',
                sellsTwoWheelers: false,
                sellsThreeWheelers: false,
                sellsFourWheelers: false,
                dealerId: null,
                dealerSlug: null,
                activeWebsitePlanId: null,
            }),

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

                // Type 1: Single OEM (new vehicles, one chosen brand/site)
                if (data.sellsNewCars && !data.sellsUsedCars) {
                    return 'single_oem';
                }

                // Type 4: Hybrid (new + used)
                if (data.sellsNewCars && data.sellsUsedCars) {
                    return 'hybrid';
                }

                return null;
            },

            isUsedCarDealer: () => {
                const { data } = get();
                return data.dealerCategory === 'used' || data.dealerCategory === 'both';
            },
        }),
        {
            name: 'dealersite-onboarding',
            // Heavy base64 fields (logo, hero images, bulk-upload payloads) are kept
            // in memory only — persisting them to localStorage can exceed the ~5MB
            // quota, making the persist write throw and silently break the step that
            // sets them (e.g. the Continue button after uploading a logo + hero).
            // They survive in-session and are uploaded to Storage on final save.
            partialize: (state) => ({
                ...state,
                data: {
                    ...state.data,
                    brandLogo: undefined,
                    heroImage: undefined,
                    heroImages: undefined,
                    uploadedVehicles: undefined,
                },
            }),
        }
    )
);
