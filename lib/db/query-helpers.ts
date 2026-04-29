import { createAdminClient } from '@/lib/supabase-server'

export const DEFAULT_DB_PAGE_SIZE = 20

type QueryError = { message: string; code?: string }
type QueryResult<TData> = {
    data: TData | null
    error: QueryError | null
    count?: number | null
}
type SelectOptions = { count?: 'exact' | 'planned' | 'estimated' }

type DynamicQuery = PromiseLike<QueryResult<Record<string, unknown>>> & {
    eq(column: string, value: unknown): DynamicQuery
    neq(column: string, value: unknown): DynamicQuery
    ilike(column: string, pattern: string): DynamicQuery
    gte(column: string, value: unknown): DynamicQuery
    lte(column: string, value: unknown): DynamicQuery
    order(column: string, options?: { ascending?: boolean }): DynamicQuery
    range(from: number, to: number): Promise<QueryResult<Record<string, unknown>[]>>
    single(): Promise<QueryResult<Record<string, unknown>>>
}

type DynamicInsertQuery = {
    select(columns: string): {
        single(): Promise<QueryResult<{ id?: string }>>
    }
}

type DynamicTable = {
    select(columns?: string, options?: SelectOptions): DynamicQuery
    insert(payload: unknown): DynamicInsertQuery
    update(payload: unknown): DynamicQuery
}

type DynamicDbClient = {
    from(table: string): DynamicTable
    rpc(fn: string, args?: Record<string, unknown>): Promise<unknown>
}

export function db() {
    return createAdminClient() as unknown as DynamicDbClient
}

export function getPageRange(page: number, pageSize: number) {
    const from = (page - 1) * pageSize
    return { from, to: from + pageSize - 1 }
}

export function dealerScopedActiveQuery(table: string, dealerId: string) {
    return db()
        .from(table)
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .eq('status', 'active')
}

export async function runPagedQuery<TItem, TKey extends string>(
    query: Pick<DynamicQuery, 'range'>,
    page: number,
    pageSize: number,
    resultKey: TKey,
    errorLabel: string,
    logErrors = true
): Promise<Record<TKey, TItem[]> & { total: number }> {
    const { from, to } = getPageRange(page, pageSize)
    const { data, error, count } = await query.range(from, to)

    if (error) {
        if (logErrors) console.error(`[${errorLabel}]`, error.message)
        return { [resultKey]: [], total: 0 } as Record<TKey, TItem[]> & { total: number }
    }
    return { [resultKey]: (data ?? []) as TItem[], total: count ?? 0 } as Record<TKey, TItem[]> & { total: number }
}

export async function getById<TItem>(
    table: string,
    id: string,
    dealerId: string | undefined,
    errorLabel?: string
): Promise<TItem | null> {
    let query = db()
        .from(table)
        .select('*')
        .eq('id', id)

    if (dealerId) query = query.eq('dealer_id', dealerId)
    const { data, error } = await query.single()

    if (error) {
        if (errorLabel) console.error(`[${errorLabel}]`, error.message)
        return null
    }
    return data as TItem
}

export async function insertAndReturnId(
    table: string,
    payload: unknown,
    errorLabel?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
    const { data, error } = await db()
        .from(table)
        .insert(payload)
        .select('id')
        .single()

    if (error) {
        if (errorLabel) console.error(`[${errorLabel}]`, error.message)
        return { success: false, error: error.message }
    }
    return { success: true, id: data?.id }
}

export async function updateDealerScoped(
    table: string,
    id: string,
    dealerId: string,
    payload: unknown,
    errorLabel?: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from(table)
        .update(payload)
        .eq('id', id)
        .eq('dealer_id', dealerId)

    if (error) {
        if (errorLabel) console.error(`[${errorLabel}]`, error.message)
        return { success: false, error: error.message }
    }
    return { success: true }
}
