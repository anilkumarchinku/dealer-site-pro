import { describe, expect, it } from 'vitest';
import nextConfig from '../next.config';

describe('security headers', () => {
    it('allows same-origin dashboard site previews while keeping Razorpay frames', async () => {
        const headers = await nextConfig.headers?.();
        const csp = headers?.[0]?.headers.find((header) => header.key === 'Content-Security-Policy')?.value;

        expect(csp).toContain("frame-src 'self'");
        expect(csp).toContain('https://api.razorpay.com');
        expect(csp).toContain('https://checkout.razorpay.com');
    });
});
