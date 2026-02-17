/**
 * Domain Onboarding System - Type Definitions
 */

export type VerificationMethod = 'dns_txt' | 'html_file' | 'email';
export type VerificationStatus = 'pending' | 'verified' | 'failed';
export type DeploymentRoute = 'full_domain' | 'subdomain';
export type AccessLevel = 'full' | 'partial' | 'none';
export type ConfigurationStatus = 'pending' | 'complete' | 'failed';
export type SSLStatus = 'pending' | 'provisioned' | 'active' | 'failed';
export type DeploymentStatus = 'pending' | 'deploying' | 'testing' | 'live' | 'failed';

export type OnboardingState =
    | 'domain_collection'
    | 'verification_pending'
    | 'verification_complete'
    | 'dns_analysis'
    | 'route_selection'
    | 'configuration_pending'
    | 'configuration_complete'
    | 'ssl_provisioning'
    | 'deployment'
    | 'testing'
    | 'live'
    | 'failed';

export interface DomainVerification {
    method: VerificationMethod;
    token: string;
    status: VerificationStatus;
    attempts: number;
    verified_at?: Date;
    error_message?: string;
}

export interface DNSAnalysis {
    nameservers: string[];
    a_records: string[];
    mx_records: string[];
    cname_records: Record<string, string>;
    txt_records: string[];
    has_active_website: boolean;
    has_email: boolean;
    scanned_at: Date;
}

export interface DomainConfiguration {
    route: DeploymentRoute;
    subdomain_name?: string;
    cloudflare_zone_id?: string;
    cloudflare_account_id?: string;
    assigned_nameservers?: string[];
    status: ConfigurationStatus;
    configured_at?: Date;
    error_message?: string;
}

export interface SSLCertificate {
    status: SSLStatus;
    certificate_id?: string;
    provider: 'letsencrypt' | 'cloudflare';
    issued_at?: Date;
    expires_at?: Date;
    grade?: string;
}

export interface DeploymentInfo {
    status: DeploymentStatus;
    server_ip?: string;
    database_name?: string;
    admin_username?: string;
    admin_password?: string;
    deploy_started_at?: Date;
    deploy_completed_at?: Date;
    current_step?: string;
    total_steps?: number;
    completed_steps?: number;
}

export interface TestResult {
    test_name: string;
    status: 'pending' | 'passed' | 'failed';
    message?: string;
    checked_at?: Date;
}

export interface DomainOnboarding {
    id: string;
    user_id: string;
    domain_name: string;
    registrar: string;
    access_level: AccessLevel;

    verification: DomainVerification;
    dns_analysis?: DNSAnalysis;
    configuration?: DomainConfiguration;
    ssl?: SSLCertificate;
    deployment?: DeploymentInfo;

    current_state: OnboardingState;
    test_results?: TestResult[];

    created_at: Date;
    updated_at: Date;
    completed_at?: Date;
}

export interface RegistrarTemplate {
    name: string;
    logo_url?: string;
    instructions: {
        dns_txt: string[];
        cname: string[];
        nameserver: string[];
    };
    screenshots?: {
        step: number;
        url: string;
        description: string;
    }[];
    video_url?: string;
    estimated_time_minutes: number;
}

export interface DNSCheckResult {
    found: boolean;
    value?: string;
    checked_at: Date;
    next_check_in_seconds?: number;
}

export interface PropagationStatus {
    is_propagated: boolean;
    checks_performed: number;
    progress_percentage: number;
    estimated_time_remaining_minutes?: number;
    last_check: Date;
}
