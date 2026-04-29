import { ExternalApiError, externalApiFetch } from '@/lib/services/external-api-fetch'

const originalFetch = global.fetch

describe('externalApiFetch', () => {
    beforeEach(() => {
        vi.useRealTimers()
        global.fetch = vi.fn()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        vi.useRealTimers()
        global.fetch = originalFetch
    })

    it('returns parsed JSON for successful responses', async () => {
        vi.mocked(global.fetch).mockResolvedValue(
            new Response(JSON.stringify({ ok: true }), { status: 200 })
        )

        await expect(externalApiFetch({
            baseUrl: 'https://provider.test',
            providerName: 'Provider',
            path: '/ok',
            headers: {},
        })).resolves.toEqual({ ok: true })
    })

    it('throws a provider error with status and parsed body for non-2xx responses', async () => {
        vi.mocked(global.fetch).mockResolvedValue(
            new Response(JSON.stringify({ error: { description: 'bad request' } }), { status: 400 })
        )

        await expect(externalApiFetch({
            baseUrl: 'https://provider.test',
            providerName: 'Provider',
            path: '/bad',
            headers: {},
        })).rejects.toMatchObject({
            name: 'ExternalApiError',
            providerName: 'Provider',
            path: '/bad',
            status: 400,
            bodyJson: { error: { description: 'bad request' } },
        } satisfies Partial<ExternalApiError>)
    })

    it('aborts slow provider calls with a normalized timeout error', async () => {
        vi.useFakeTimers()
        vi.mocked(global.fetch).mockImplementation((_url, init) => new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
                const error = new Error('aborted')
                error.name = 'AbortError'
                reject(error)
            })
        }))

        const promise = externalApiFetch({
            baseUrl: 'https://provider.test',
            providerName: 'Provider',
            path: '/slow',
            headers: {},
            timeoutMs: 10,
        })
        const expectation = expect(promise).rejects.toMatchObject({
            name: 'ExternalApiError',
            providerName: 'Provider',
            path: '/slow',
        })

        await vi.advanceTimersByTimeAsync(10)

        await expectation
    })
})
