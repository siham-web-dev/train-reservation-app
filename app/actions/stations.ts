"use server"

import { createClient } from '@supabase/supabase-js'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { sendInvitationEmail } from '@/lib/mail'

import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SITE_URL } from '@/app/config/constants'

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

export async function getStations() {
    try {
        const stations = await prisma.station.findMany({
            include: {
                users: true
            }
        })
        return { data: stations }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function createStationWithOwner(formData: any) {
    const {
        name,
        code,
        city,
        country,
        latitude,
        longitude,
        ownerName,
        ownerEmail
    } = formData

    try {
        // 0. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: ownerEmail }
        })

        if (existingUser) {
            return { error: 'A user with this email already exists. Please use a different email or delete the existing user first.' }
        }

        // 0.1 Check if station code already exists
        const existingStation = await prisma.station.findUnique({
            where: { code }
        })

        if (existingStation) {
            return { error: `A station with code "${code}" already exists. Please use a unique station code.` }
        }

        // 1. Create Station in Prisma
        const station = await prisma.station.create({
            data: {
                name,
                code,
                city,
                country,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
            }
        })

        // 2. Generate Invitation Link via Supabase
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'invite',
            email: ownerEmail,
            options: {
                data: {
                    full_name: ownerName,
                    role: 'station_owner',
                },
                redirectTo: `${SITE_URL}/plans`,
            }
        })

        if (authError) {
            console.error('Supabase Link Generation Error:', authError)
            return { error: `Station created but invitation link generation failed: ${authError.message}` }
        }

        // Use custom link with token_hash for better SSR support
        const customInviteLink = `${SITE_URL}/auth/callback?token_hash=${authData.properties.hashed_token}&type=invite&next=/plans`
        const mailResult = await sendInvitationEmail(ownerEmail, ownerName, customInviteLink)

        if (mailResult.error) {
            console.error('Email Sending Error:', mailResult.error)
            // We'll continue even if email fails, but notify the admin
        }

        // 4. Create User in Prisma
        await prisma.user.create({
            data: {
                id: authData.user.id,
                email: ownerEmail,
                name: ownerName,
                role: 'station_owner',
                station_id: station.id,
                subscription_plan: 'starter'
            }
        })

        revalidatePath('/admin/stations')
        return { success: true }
    } catch (error: any) {
        console.error('Create Station Error:', error)
        return { error: error.message || 'An error occurred during station creation' }
    }
}

export async function deleteStation(id: number) {
    try {
        // Find users associated with this station to delete them from Supabase too
        const users = await prisma.user.findMany({
            where: { station_id: id }
        })

        // Delete users from Supabase Auth
        for (const user of users) {
            await supabaseAdmin.auth.admin.deleteUser(user.id)
        }

        // Delete station (cascading might be needed if not set in DB, but Prisma will handle what's defined)
        await prisma.station.delete({
            where: { id }
        })

        revalidatePath('/admin/stations')
        return { success: true }
    } catch (error: any) {
        console.error('Delete Station Error:', error)
        return { error: error.message || 'An error occurred during station deletion' }
    }
}
