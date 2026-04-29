import { createHmac } from 'crypto'
import {
    getRazorpayErrorMessage,
    verifyBookingPaymentSignature,
    verifyRazorpayWebhookSignature,
    verifySubscriptionPaymentSignature,
} from '@/lib/services/razorpay-service'
import { ExternalApiError } from '@/lib/services/external-api-fetch'

const secret = 'test_secret_key_123456'

function sign(message: string): string {
    return createHmac('sha256', secret).update(message).digest('hex')
}

describe('razorpay-service', () => {
    beforeEach(() => {
        process.env.RAZORPAY_KEY_SECRET = secret
    })

    afterEach(() => {
        delete process.env.RAZORPAY_KEY_SECRET
    })

    it('validates subscription payment signatures', () => {
        expect(verifySubscriptionPaymentSignature(
            'pay_1',
            'sub_1',
            sign('pay_1|sub_1')
        )).toBe(true)
    })

    it('validates booking payment signatures', () => {
        expect(verifyBookingPaymentSignature(
            'order_1',
            'pay_1',
            sign('order_1|pay_1'),
            'Booking'
        )).toBe(true)
    })

    it('returns false instead of throwing for malformed webhook signatures', () => {
        expect(verifyRazorpayWebhookSignature(
            JSON.stringify({ event: 'subscription.activated' }),
            'short_signature',
            secret
        )).toBe(false)
    })

    it('extracts Razorpay provider error descriptions', () => {
        const error = new ExternalApiError(
            'Razorpay API /orders -> 400',
            'Razorpay',
            '/orders',
            400,
            '{"error":{"description":"amount too low"}}',
            { error: { description: 'amount too low' } }
        )

        expect(getRazorpayErrorMessage(error, 'fallback')).toBe('amount too low')
    })
})
