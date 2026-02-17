/**
 * POST /api/domain/start-onboarding
 * Initialize a new domain onboarding process
 */

import { NextRequest, NextResponse } from 'next/server';
import { DomainVerificationService } from '@/lib/services/domain-verification';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { domain_name, registrar, access_level, user_id } = body;

        // Validate required fields
        if (!domain_name || !user_id) {
            return NextResponse.json(
                { error: 'Missing required fields: domain_name, user_id' },
                { status: 400 }
            );
        }

        // Validate and clean domain
        const cleanDomain = DomainVerificationService.extractDomain(domain_name);
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
            user_id,
            domain_name: cleanDomain,
            registrar: registrar || 'unknown',
            access_level: access_level || 'full',
            verification: {
                status: 'pending',
                method: null,
                token: verificationToken,
                expires_at: expiresAt,
                attempts: 0,
                verified_at: null
            },
            current_state: 'domain_collection',
            created_at: new Date(),
            updated_at: new Date()
        };

        // TODO: Save to database (Supabase)
        // const { data, error } = await supabase
        //     .from('domain_onboardings')
        //     .insert(onboarding)
        //     .select()
        //     .single();

        console.log('✅ Domain onboarding initialized:', onboardingId);

        return NextResponse.json({
            success: true,
            onboarding_id: onboardingId,
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
        console.error('❌ Error starting onboarding:', error);
        return NextResponse.json(
            { error: 'Failed to initialize domain onboarding' },
            { status: 500 }
        );
    }
}
