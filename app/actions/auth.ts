"use server"

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { SITE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '@/app/config/constants'
import { sendPasswordResetEmail } from '@/lib/mail'

const supabaseAdmin = createAdminClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

export async function signUp(formData: any) {
    const supabase = await createClient()
    const { email, password, name } = formData

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                role: 'station_owner',
            },
        },
    })

    if (authError) {
        return { error: authError.message }
    }

    if (authData.user) {
        try {
            // Create user in Prisma database
            await prisma.user.create({
                data: {
                    id: authData.user.id,
                    email: authData.user.email!,
                    name: name,
                    role: 'station_owner', // Default role
                },
            })
        } catch (dbError: any) {
            console.error('Error creating user in Prisma:', dbError)
            return { error: 'Auth successful but failed to create user record.' }
        }
    }

    return { success: true }
}

export async function signIn(formData: any) {
    const supabase = await createClient()
    const { email, password } = formData

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    const role = user?.user_metadata?.role || 'station_owner'

    return { success: true, role }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}

export async function resetPassword(email: string) {
    try {
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: email,
            options: {
                redirectTo: `${SITE_URL}/auth/callback?next=/reset-password`,
            }
        })

        if (error) {
            return { error: error.message }
        }

        // Use custom link with token_hash for better SSR support
        const customResetLink = `${SITE_URL}/auth/callback?token_hash=${data.properties.hashed_token}&type=recovery&next=/reset-password`
        const mailResult = await sendPasswordResetEmail(email, customResetLink)

        if (mailResult.error) {
            return { error: `Failed to send reset email: ${mailResult.error}` }
        }

        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function updatePassword(password: string) {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function getUserProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { station: true }
        })
        return { data: dbUser }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function updateProfile(formData: { name: string; phone?: string; address?: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    try {
        // 1. Update Prisma User
        const dbUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name: formData.name,
                phone: formData.phone || null,
            }
        })

        // 2. Update Supabase User Metadata
        await supabase.auth.updateUser({
            data: { full_name: formData.name }
        })

        return { success: true }
    } catch (error: any) {
        console.error('updateProfile Error:', error)
        return { error: error.message }
    }
}
