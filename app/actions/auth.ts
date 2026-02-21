"use server"

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

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
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
