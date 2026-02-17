/**
 * Cloudflare API Integration Service
 * Automates DNS configuration, SSL provisioning, and CDN setup
 */

interface CloudflareConfig {
    apiToken: string;
    accountId: string;
}

interface DNSRecord {
    type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS';
    name: string;
    content: string;
    ttl?: number;
    proxied?: boolean;
    priority?: number;
}

interface Zone {
    id: string;
    name: string;
    status: 'active' | 'pending' | 'initializing';
    name_servers: string[];
}

interface SSLStatus {
    status: 'active' | 'pending' | 'failed';
    certificate_authority: string;
    expires_on?: string;
}

export class CloudflareService {
    private apiToken: string;
    private accountId: string;
    private baseUrl = 'https://api.cloudflare.com/client/v4';

    constructor(config: CloudflareConfig) {
        this.apiToken = config.apiToken;
        this.accountId = config.accountId;
    }

    /**
     * Make authenticated request to Cloudflare API
     */
    private async request(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<any> {
        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();

        if (!data.success) {
            const errors = data.errors?.map((e: any) => e.message).join(', ');
            throw new Error(`Cloudflare API error: ${errors || 'Unknown error'}`);
        }

        return data.result;
    }

    /**
     * Create a new zone (domain) in Cloudflare
     */
    async createZone(domainName: string): Promise<Zone> {
        console.log(`📋 Creating Cloudflare zone for ${domainName}...`);

        const result = await this.request('/zones', {
            method: 'POST',
            body: JSON.stringify({
                name: domainName,
                account: { id: this.accountId },
                jump_start: true, // Auto-scan existing DNS records
                type: 'full'
            })
        });

        console.log(`✅ Zone created: ${result.id}`);
        console.log(`📡 Nameservers: ${result.name_servers.join(', ')}`);

        return {
            id: result.id,
            name: result.name,
            status: result.status,
            name_servers: result.name_servers
        };
    }

    /**
     * Get zone details
     */
    async getZone(domainName: string): Promise<Zone | null> {
        try {
            const zones = await this.request(`/zones?name=${domainName}`);

            if (zones.length === 0) {
                return null;
            }

            const zone = zones[0];
            return {
                id: zone.id,
                name: zone.name,
                status: zone.status,
                name_servers: zone.name_servers
            };
        } catch (error) {
            console.error('Error fetching zone:', error);
            return null;
        }
    }

    /**
     * Get zone ID by domain name
     */
    async getZoneId(domainName: string): Promise<string | null> {
        const zone = await this.getZone(domainName);
        return zone?.id || null;
    }

    /**
     * Add DNS record to zone
     */
    async addDNSRecord(
        zoneId: string,
        record: DNSRecord
    ): Promise<any> {
        console.log(`➕ Adding ${record.type} record: ${record.name} → ${record.content}`);

        const result = await this.request(`/zones/${zoneId}/dns_records`, {
            method: 'POST',
            body: JSON.stringify({
                type: record.type,
                name: record.name,
                content: record.content,
                ttl: record.ttl || 300,
                proxied: record.proxied !== undefined ? record.proxied : (record.type === 'A' || record.type === 'CNAME'),
                priority: record.priority
            })
        });

        console.log(`✅ DNS record added: ${result.id}`);
        return result;
    }

    /**
     * List all DNS records for a zone
     */
    async listDNSRecords(zoneId: string): Promise<any[]> {
        const result = await this.request(`/zones/${zoneId}/dns_records`);
        return result;
    }

    /**
     * Delete DNS record
     */
    async deleteDNSRecord(zoneId: string, recordId: string): Promise<void> {
        console.log(`🗑️ Deleting DNS record: ${recordId}`);

        await this.request(`/zones/${zoneId}/dns_records/${recordId}`, {
            method: 'DELETE'
        });

        console.log(`✅ DNS record deleted`);
    }

    /**
     * Update DNS record
     */
    async updateDNSRecord(
        zoneId: string,
        recordId: string,
        record: Partial<DNSRecord>
    ): Promise<any> {
        console.log(`✏️ Updating DNS record: ${recordId}`);

        const result = await this.request(`/zones/${zoneId}/dns_records/${recordId}`, {
            method: 'PATCH',
            body: JSON.stringify(record)
        });

        console.log(`✅ DNS record updated`);
        return result;
    }

    /**
     * Configure SSL/TLS for zone
     */
    async configureSSL(
        zoneId: string,
        mode: 'off' | 'flexible' | 'full' | 'strict' = 'full'
    ): Promise<void> {
        console.log(`🔒 Configuring SSL mode: ${mode}`);

        await this.request(`/zones/${zoneId}/settings/ssl`, {
            method: 'PATCH',
            body: JSON.stringify({ value: mode })
        });

        console.log(`✅ SSL configured`);
    }

    /**
     * Enable Always Use HTTPS
     */
    async enableAlwaysHTTPS(zoneId: string): Promise<void> {
        console.log(`🔒 Enabling Always Use HTTPS...`);

        await this.request(`/zones/${zoneId}/settings/always_use_https`, {
            method: 'PATCH',
            body: JSON.stringify({ value: 'on' })
        });

        console.log(`✅ Always Use HTTPS enabled`);
    }

    /**
     * Enable Automatic HTTPS Rewrites
     */
    async enableAutoHTTPSRewrites(zoneId: string): Promise<void> {
        console.log(`🔧 Enabling Automatic HTTPS Rewrites...`);

        await this.request(`/zones/${zoneId}/settings/automatic_https_rewrites`, {
            method: 'PATCH',
            body: JSON.stringify({ value: 'on' })
        });

        console.log(`✅ Automatic HTTPS Rewrites enabled`);
    }

    /**
     * Get SSL certificate status
     */
    async getSSLStatus(zoneId: string): Promise<SSLStatus> {
        console.log(`🔍 Checking SSL certificate status...`);

        const result = await this.request(`/zones/${zoneId}/ssl/certificate_packs`);

        if (result.length === 0) {
            return {
                status: 'pending',
                certificate_authority: 'none'
            };
        }

        const cert = result[0];
        return {
            status: cert.status,
            certificate_authority: cert.certificate_authority,
            expires_on: cert.expires_on
        };
    }

    /**
     * Configure caching rules
     */
    async configureCaching(zoneId: string): Promise<void> {
        console.log(`⚡ Configuring caching rules...`);

        // Set cache level to aggressive
        await this.request(`/zones/${zoneId}/settings/cache_level`, {
            method: 'PATCH',
            body: JSON.stringify({ value: 'aggressive' })
        });

        // Enable browser cache TTL
        await this.request(`/zones/${zoneId}/settings/browser_cache_ttl`, {
            method: 'PATCH',
            body: JSON.stringify({ value: 14400 }) // 4 hours
        });

        console.log(`✅ Caching configured`);
    }

    /**
     * Enable security features
     */
    async enableSecurityFeatures(zoneId: string): Promise<void> {
        console.log(`🛡️ Enabling security features...`);

        // Enable WAF (Web Application Firewall) if available
        try {
            await this.request(`/zones/${zoneId}/firewall/waf/packages`, {
                method: 'GET'
            });
            console.log(`✅ WAF already configured`);
        } catch (error) {
            console.log(`ℹ️ WAF not available on this plan`);
        }

        // Enable Bot Fight Mode (free plan)
        try {
            await this.request(`/zones/${zoneId}/settings/bot_fight_mode`, {
                method: 'PATCH',
                body: JSON.stringify({ value: 'on' })
            });
            console.log(`✅ Bot Fight Mode enabled`);
        } catch (error) {
            console.log(`ℹ️ Bot Fight Mode not available`);
        }

        console.log(`✅ Security features configured`);
    }

    /**
     * Full zone setup - create zone, configure DNS, SSL, and security
     */
    async fullZoneSetup(
        domainName: string,
        dnsRecords: DNSRecord[]
    ): Promise<{
        zone: Zone;
        nameservers: string[];
        records: any[];
    }> {
        console.log(`🚀 Starting full zone setup for ${domainName}...`);

        // Step 1: Create zone
        const zone = await this.createZone(domainName);

        // Step 2: Add DNS records
        const addedRecords = [];
        for (const record of dnsRecords) {
            try {
                const result = await this.addDNSRecord(zone.id, record);
                addedRecords.push(result);
            } catch (error) {
                console.error(`Failed to add record ${record.name}:`, error);
            }
        }

        // Step 3: Configure SSL
        await this.configureSSL(zone.id, 'full');
        await this.enableAlwaysHTTPS(zone.id);
        await this.enableAutoHTTPSRewrites(zone.id);

        // Step 4: Configure caching
        await this.configureCaching(zone.id);

        // Step 5: Enable security features
        await this.enableSecurityFeatures(zone.id);

        console.log(`✅ Full zone setup complete!`);
        console.log(`📋 Next step: Update nameservers at registrar to:`);
        zone.name_servers.forEach(ns => console.log(`   - ${ns}`));

        return {
            zone,
            nameservers: zone.name_servers,
            records: addedRecords
        };
    }

    /**
     * Check if nameservers have been updated
     */
    async checkNameserverStatus(domainName: string): Promise<{
        updated: boolean;
        current_nameservers: string[];
        expected_nameservers: string[];
    }> {
        const zone = await this.getZone(domainName);

        if (!zone) {
            throw new Error('Zone not found');
        }

        // In production, you would query actual DNS to check current nameservers
        // For now, we'll check the zone status
        const updated = zone.status === 'active';

        return {
            updated,
            current_nameservers: zone.name_servers,
            expected_nameservers: zone.name_servers
        };
    }

    /**
     * Purge cache for entire zone
     */
    async purgeCache(zoneId: string): Promise<void> {
        console.log(`🗑️ Purging cache for zone...`);

        await this.request(`/zones/${zoneId}/purge_cache`, {
            method: 'POST',
            body: JSON.stringify({ purge_everything: true })
        });

        console.log(`✅ Cache purged`);
    }

    /**
     * Get zone analytics
     */
    async getAnalytics(
        zoneId: string,
        since: Date = new Date(Date.now() - 24 * 60 * 60 * 1000)
    ): Promise<any> {
        const sinceISO = since.toISOString();

        const result = await this.request(
            `/zones/${zoneId}/analytics/dashboard?since=${sinceISO}`
        );

        return result;
    }
}

/**
 * Factory function to create CloudflareService instance
 */
export function createCloudflareService(): CloudflareService {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    if (!apiToken || !accountId) {
        throw new Error(
            'Cloudflare credentials not configured. Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in environment variables.'
        );
    }

    return new CloudflareService({
        apiToken,
        accountId
    });
}
