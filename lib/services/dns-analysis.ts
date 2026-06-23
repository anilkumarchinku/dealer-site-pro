/**
 * DNS Analysis Service
 * Scans domain DNS records to detect existing services (website, email, etc.)
 */

import dns from 'dns/promises';
import { DNSAnalysis, DeploymentRoute } from '../types/domain-onboarding';
import { isPubliclyRoutableHost } from '@/lib/utils/ssrf-guard';
import { logger } from '@/lib/utils/logger';

export interface DNSScanResult extends DNSAnalysis {
    recommended_route: DeploymentRoute;
    reason: string;
    warnings: string[];
}

export class DNSAnalysisService {
    /**
     * Perform comprehensive DNS scan
     */
    static async scanDomain(domain: string): Promise<DNSScanResult> {
        logger.log(`🔬 Starting DNS scan for ${domain}`);

        const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');

        const [
            nameservers,
            aRecords,
            mxRecords,
            txtRecords,
            cnameRecords,
            hasWebsite
        ] = await Promise.allSettled([
            this.getNameservers(cleanDomain),
            this.getARecords(cleanDomain),
            this.getMXRecords(cleanDomain),
            this.getTXTRecords(cleanDomain),
            this.getCNAMERecords(cleanDomain),
            this.checkActiveWebsite(cleanDomain)
        ]);

        const analysis: DNSAnalysis = {
            nameservers: nameservers.status === 'fulfilled' ? nameservers.value : [],
            a_records: aRecords.status === 'fulfilled' ? aRecords.value : [],
            mx_records: mxRecords.status === 'fulfilled' ? mxRecords.value : [],
            txt_records: txtRecords.status === 'fulfilled' ? txtRecords.value : [],
            cname_records: cnameRecords.status === 'fulfilled' ? cnameRecords.value : {},
            has_active_website: hasWebsite.status === 'fulfilled' ? hasWebsite.value : false,
            has_email: mxRecords.status === 'fulfilled' && mxRecords.value.length > 0,
            scanned_at: new Date()
        };

        // Determine recommendation
        const recommendation = this.determineRoute(analysis);

        logger.log(`✅ DNS scan complete for ${domain}`);
        logger.log(`📊 Recommendation: ${recommendation.recommended_route}`);

        return {
            ...analysis,
            ...recommendation
        };
    }

    /**
     * Get nameservers for domain
     */
    private static async getNameservers(domain: string): Promise<string[]> {
        try {
            const ns = await dns.resolveNs(domain);
            logger.log(`📡 Nameservers: ${ns.join(', ')}`);
            return ns;
        } catch (error) {
            logger.log(`⚠️ Could not resolve nameservers`);
            return [];
        }
    }

    /**
     * Get A records for domain
     */
    private static async getARecords(domain: string): Promise<string[]> {
        try {
            const addresses = await dns.resolve4(domain);
            logger.log(`🌐 A Records: ${addresses.join(', ')}`);
            return addresses;
        } catch (error) {
            logger.log(`⚠️ No A records found`);
            return [];
        }
    }

    /**
     * Get MX records for domain
     */
    private static async getMXRecords(domain: string): Promise<string[]> {
        try {
            const mx = await dns.resolveMx(domain);
            const exchanges = mx.map(record => record.exchange);
            logger.log(`📧 MX Records: ${exchanges.join(', ')}`);
            return exchanges;
        } catch (error) {
            logger.log(`⚠️ No MX records found`);
            return [];
        }
    }

    /**
     * Get TXT records for domain
     */
    private static async getTXTRecords(domain: string): Promise<string[]> {
        try {
            const txt = await dns.resolveTxt(domain);
            const flattened = txt.flat();
            logger.log(`📝 TXT Records: ${flattened.length} found`);
            return flattened;
        } catch (error) {
            logger.log(`⚠️ No TXT records found`);
            return [];
        }
    }

    /**
     * Get CNAME records for common subdomains
     */
    private static async getCNAMERecords(domain: string): Promise<Record<string, string>> {
        const commonSubdomains = ['www', 'mail', 'ftp', 'api', 'cdn'];
        const cnameRecords: Record<string, string> = {};

        for (const subdomain of commonSubdomains) {
            try {
                const cname = await dns.resolveCname(`${subdomain}.${domain}`);
                if (cname && cname.length > 0) {
                    cnameRecords[subdomain] = cname[0];
                    logger.log(`🔗 CNAME: ${subdomain}.${domain} → ${cname[0]}`);
                }
            } catch (error) {
                // Subdomain doesn't have CNAME, skip
            }
        }

        return cnameRecords;
    }

    /**
     * Check if domain has an active website
     */
    private static async checkActiveWebsite(domain: string): Promise<boolean> {
        if (!(await isPubliclyRoutableHost(domain))) {
            return false;
        }

        const urls = [
            `https://${domain}`,
            `http://${domain}`,
            `https://www.${domain}`,
            `http://www.${domain}`
        ];

        for (const url of urls) {
            try {
                const response = await fetch(url, {
                    method: 'HEAD',
                    redirect: 'manual',
                    signal: AbortSignal.timeout(5000)
                });

                if (response.ok) {
                    logger.log(`✅ Active website detected at ${url}`);
                    return true;
                }
            } catch (error) {
                // Try next URL
                continue;
            }
        }

        logger.log(`⚠️ No active website detected`);
        return false;
    }

    /**
     * Determine recommended deployment route
     */
    private static determineRoute(analysis: DNSAnalysis): {
        recommended_route: DeploymentRoute;
        reason: string;
        warnings: string[];
    } {
        const warnings: string[] = [];

        // Check for existing services
        if (analysis.has_email) {
            warnings.push('Email service detected. MX records will be preserved.');
        }

        if (analysis.has_active_website) {
            warnings.push('Active website detected. Consider backup before proceeding.');
        }

        // Decision logic
        if (analysis.has_active_website || analysis.has_email) {
            return {
                recommended_route: 'subdomain',
                reason: 'Subdomain deployment recommended to preserve existing services (website/email).',
                warnings
            };
        }

        return {
            recommended_route: 'full_domain',
            reason: 'Full domain deployment recommended for maximum performance and branding.',
            warnings
        };
    }

    /**
     * Check if domain is using Cloudflare
     */
    static isCloudflare(nameservers: string[]): boolean {
        return nameservers.some(ns => ns.toLowerCase().includes('cloudflare'));
    }

    /**
     * Detect registrar from nameservers
     */
    static detectRegistrar(nameservers: string[]): string | null {
        const registrarPatterns: Record<string, string> = {
            'godaddy': 'godaddy',
            'namecheap': 'namecheap',
            'bigrock': 'bigrock',
            'hostgator': 'hostgator',
            'bluehost': 'bluehost',
            'cloudflare': 'cloudflare',
            'aws': 'route53',
            'google': 'google-domains'
        };

        for (const ns of nameservers) {
            const nsLower = ns.toLowerCase();
            for (const [pattern, registrar] of Object.entries(registrarPatterns)) {
                if (nsLower.includes(pattern)) {
                    return registrar;
                }
            }
        }

        return null;
    }
}
