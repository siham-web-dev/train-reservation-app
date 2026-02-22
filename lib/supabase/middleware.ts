import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/app/config/constants'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // getUser(). A simple mistake can make it very hard to debug issues with sessions.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const protectedPaths = [
        '/analytics',
        '/reservations',
        '/settings',
        '/drivers',
        '/passengers',
        '/trains',
        '/admin'
    ]

    const path = request.nextUrl.pathname
    const isProtectedPath = protectedPaths.some(p => path === p || path.startsWith(`${p}/`))
    const isAdminPath = path.startsWith('/admin')

    if (!user && isProtectedPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // Role-based check for Admin routes
    const userRole = user?.user_metadata?.role
    if (user && isAdminPath && userRole !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/' // or some "Access Denied" page
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
