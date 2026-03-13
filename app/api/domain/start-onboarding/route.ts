/**
 * POST /api/domain/start-onboarding
 * Initialize a new domain onboarding process
 */

import { NextRequest, NextResponse } from 'next/server';
import { DomainVerificationService } from '@/lib/services/domain-verification';
import { requireAuth } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
    try {
        const { user, supabase, errorResponse } = await requireAuth();
        if (errorResponse) return errorResponse;

        const body = await request.json();
        const { domain_name, registrar, access_level } = body;

        // Validate required fields
        if (!domain_name) {
            return NextResponse.json(
                { error: 'Missing required field: domain_name' },
                { status: 400 }
            );
        }

        // Validate and clean domain
        const cleanDomain = DomainVerificationService.extractBaseDomain(domain_name);
        if (!DomainVerificationService.isValidDomain(cleanDomain)) {
            return NextResponse.json(
                { error: 'Invalid domain format' },
                { status: 400 }
            );
        }

        // Generate verification token
        const verificationToken = DomainVerificationService.generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create onboarding record
        const onboardingId = crypto.randomUUID();
        const onboarding = {
            id: onboardingId,
            user_id: user.id,
            domain_name: cleanDomain,
            registrar: registrar || 'unknown',
            access_level: access_level || 'full',
            verification: {
                status: 'pending',
                method: null,
                token: verificationToken,
                expires_at: expiresAt.toISOString(),
                attempts: 0,
                verified_at: null
            } as import('@/lib/database.types').Json,
            current_state: 'domain_collection',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Insert into DB; if record already exists for this user+domain, return the existing row
        const { data, error } = await supabase
            .from('domain_onboardings')
            .insert(onboarding)
            .select()
            .single();

        if (error) {
            // Unique constraint violation — record already exists; fetch and return it
            if (error.code === '23505') {
                const { data: existing, error: fetchError } = await supabase
                    .from('domain_onboardings')
                    .select()
                    .eq('user_id', user.id)
                    .eq('domain_name', cleanDomain)
                    .single();

                if (fetchError || !existing) {
                    return NextResponse.json(
                        { error: 'Domain onboarding already exists but could not be retrieved' },
                        { status: 409 }
                    );
                }

                const existingVerification = existing.verification as { token?: string; expires_at?: string } | null
                return NextResponse.json({
                    success: true,
                    onboarding_id: existing.id,
                    domain_name: existing.domain_name,
                    verification_token: existingVerification?.token ?? null,
                    expires_at: existingVerification?.expires_at ?? null,
                    current_state: existing.current_state,
                    already_exists: true,
                    next_steps: [
                        'Choose verification method (DNS TXT or HTML file)',
                        'Complete domain ownership verification',
                        'DNS analysis will be performed automatically'
                    ]
                });
            }

            return NextResponse.json(
                { error: 'Failed to save domain onboarding record', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            onboarding_id: data.id,
            domain_name: cleanDomain,
            verification_token: verificationToken,
            expires_at: expiresAt,
            current_state: 'domain_collection',
            next_steps: [
                'Choose verification method (DNS TXT or HTML file)',
                'Complete domain ownership verification',
                'DNS analysis will be performed automatically'
            ]
        });

    } catch (error) {
        console.error('Error starting onboarding:', error);
        return NextResponse.json(
            { error: 'Failed to initialize domain onboarding' },
            { status: 500 }
        );
    }
}
