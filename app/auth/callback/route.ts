import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/app/config/constants'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    // if "next" is in search params, use it as the redirection URL
    const next = searchParams.get('next') ?? '/'

    const redirectTo = (path: string) => {
        const isLocalEnv = process.env.NODE_ENV === 'development'
        const base = isLocalEnv ? origin : SITE_URL
        return NextResponse.redirect(`${base}${path}`)
    }

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return redirectTo(next)
        }
    } else if (token_hash && type) {
        const supabase = await createClient()
        const { error } = await supabase.auth.verifyOtp({ token_hash, type })
        if (!error) {
            return redirectTo(next)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
