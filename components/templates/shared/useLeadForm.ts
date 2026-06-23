/**
 * Lead-capture form state + submit, shared by all dealer-site templates.
 * (Previously duplicated as identical useState blocks + handleSubmit in each.)
 *
 * Posts to /api/leads with lead_source 'contact_form'. Consent is required and
 * validated via validateLeadForm; checking the consent box clears its error.
 */
'use client';

import { useState, type FormEvent } from 'react';
import {
    validateLeadForm,
    hasLeadFormErrors,
    normalizeLeadPhone,
    type LeadFormErrors,
} from '@/lib/validations/lead';

export interface LeadFormData {
    name: string;
    phone: string;
    email: string;
    message: string;
}

export type LeadFormStatus = 'idle' | 'sending' | 'sent' | 'error';

export function useLeadForm(dealerId: string) {
    const [formData, setFormData] = useState<LeadFormData>({ name: '', phone: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState<LeadFormStatus>('idle');
    const [formErrors, setFormErrors] = useState<LeadFormErrors>({});
    const [consent, setConsentState] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const errors = validateLeadForm({ name: formData.name, phone: formData.phone, email: formData.email, consent });
        if (hasLeadFormErrors(errors)) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        setFormStatus('sending');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealer_id: dealerId,
                    name: formData.name.trim(),
                    phone: normalizeLeadPhone(formData.phone),
                    email: formData.email.trim(),
                    message: formData.message,
                    lead_source: 'contact_form',
                }),
            });
            setFormStatus(res.ok ? 'sent' : 'error');
        } catch {
            setFormStatus('error');
        }
    };

    /** Toggle consent; checking it clears any pending consent error. */
    const setConsent = (checked: boolean) => {
        setConsentState(checked);
        if (checked) setFormErrors(prev => ({ ...prev, consent: undefined }));
    };

    return { formData, setFormData, formStatus, formErrors, consent, setConsent, handleSubmit };
}
