import { createBrowserClient } from '@supabase/ssr'
import { type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/app/config/constants'

let client: SupabaseClient | undefined

function createClient() {
    if (client) return client

    client = createBrowserClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    )

    return client
}

export const supabase = createClient()
