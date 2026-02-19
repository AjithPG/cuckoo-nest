import { createBrowserClient } from '@supabase/ssr'

export function createClient(supabaseAccessToken?: string) {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            global: {
                headers: {
                    Authorization: supabaseAccessToken ? `Bearer ${supabaseAccessToken}` : '',
                },
            },
        }
    )
}
