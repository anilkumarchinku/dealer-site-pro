/**
 * Domain Verification Service
 * Handles domain ownership verification via DNS TXT records and HTML files
 */

import crypto from 'crypto';
import dns from 'dns/promises';

export interface VerificationToken {
    token: string;
    domain: string;
    method: 'dns_txt' | 'html_file';
    created_at: Date;
    expires_at: Date;
}

export class DomainVerificationService {
    /**
     * Generate a unique verification token
     */
    static generateToken(): string {
        const randomPart = crypto.randomBytes(16).toString('hex');
        return `dealersite-verify-${randomPart}`;
    }

    /**
     * Generate HTML verification file content
     */
    static generateHTMLFile(token: string): string {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>DealerSite Pro Domain Verification</title>
</head>
<body>
    <h1>DealerSite Pro Domain Verification</h1>
    <p>Verification Token: ${token}</p>
    <meta name="dealersite-verification" content="${token}" />
</body>
</html>`;
    }

    /**
     * Verify domain ownership via DNS TXT record
     */
    static async verifyDNSTXT(domain: string, expectedToken: string): Promise<{
        verified: boolean;
        found_records: string[];
        error?: string;
    }> {
        try {
            console.log(`🔍 Checking DNS TXT records for ${domain}`);

            // Remove protocol and www if present
            const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');

            // Query TXT records
            const txtRecords = await dns.resolveTxt(cleanDomain);

            // Flatten array of arrays
            const allRecords = txtRecords.flat();

            console.log(`📝 Found ${allRecords.length} TXT records`);

            // Check if our verification token exists
            const verified = allRecords.some(record =>
                record.trim() === expectedToken
            );

            return {
                verified,
                found_records: allRecords
            };
        } catch (error: any) {
            console.error('❌ DNS TXT verification error:', error);

            // Handle specific DNS errors
            if (error.code === 'ENOTFOUND') {
                return {
                    verified: false,
                    found_records: [],
                    error: 'Domain not found. Please check the domain name.'
                };
            }

            if (error.code === 'ENODATA' || error.code === 'ENOTEXTUAL') {
                return {
                    verified: false,
                    found_records: [],
                    error: 'No TXT records found. The record may not have propagated yet.'
                };
            }

            return {
                verified: false,
                found_records: [],
                error: `DNS lookup failed: ${error.message}`
            };
        }
    }

    /**
     * Verify domain ownership via HTML file
     */
    static async verifyHTMLFile(domain: string, expectedToken: string): Promise<{
        verified: boolean;
        content?: string;
        error?: string;
    }> {
        try {
            console.log(`🔍 Checking HTML verification file for ${domain}`);

            // Clean domain
            const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');

            // Try both HTTP and HTTPS
            const urls = [
                `https://${cleanDomain}/dealersite-verify.html`,
                `http://${cleanDomain}/dealersite-verify.html`,
                `https://www.${cleanDomain}/dealersite-verify.html`,
                `http://www.${cleanDomain}/dealersite-verify.html`
            ];

            for (const url of urls) {
                try {
                    console.log(`📡 Fetching: ${url}`);

                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'User-Agent': 'DealerSite-Verification-Bot/1.0'
                        },
                        signal: AbortSignal.timeout(10000) // 10 second timeout
                    });

                    if (response.ok) {
                        const content = await response.text();

                        // Check if content contains the token
                        const verified = content.includes(expectedToken);

                        if (verified) {
                            console.log(`✅ Verification successful via ${url}`);
                            return {
                                verified: true,
                                content
                            };
                        }
                    }
                } catch (err) {
                    // Try next URL
                    continue;
                }
            }

            return {
                verified: false,
                error: 'Verification file not found or token mismatch'
            };

        } catch (error: any) {
            console.error('❌ HTML file verification error:', error);
            return {
                verified: false,
                error: `Failed to fetch verification file: ${error.message}`
            };
        }
    }

    /**
     * Check if verification token is expired
     */
    static isTokenExpired(created_at: Date, hours: number = 24): boolean {
        const now = new Date();
        const expiryTime = new Date(created_at.getTime() + hours * 60 * 60 * 1000);
        return now > expiryTime;
    }

    /**
     * Validate domain format
     */
    static isValidDomain(domain: string): boolean {
        // Remove protocol if present
        const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');

        // Basic domain validation regex
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}\.)*[a-zA-Z]{2,}$/;

        return domainRegex.test(cleanDomain);
    }

    /**
     * Extract base domain from URL or domain string
     */
    static extractBaseDomain(input: string): string {
        // Remove protocol
        let domain = input.replace(/^(https?:\/\/)/, '');

        // Remove www
        domain = domain.replace(/^www\./, '');

        // Remove path, query, and fragment
        domain = domain.split('/')[0];
        domain = domain.split('?')[0];
        domain = domain.split('#')[0];

        // Remove port if present
        domain = domain.split(':')[0];

        return domain.toLowerCase();
    }
}
