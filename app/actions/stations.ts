"use server"

import { createClient } from '@supabase/supabase-js'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
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

        // 2. Send Invitation Email via Supabase
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(ownerEmail, {
            data: {
                full_name: ownerName,
                role: 'station_owner',
            },
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/plans`,
        })

        if (authError) {
            console.error('Supabase Invitation Error:', authError)
            // Rollback station creation? Or just return error. 
            // Better to return error and let admin know.
            return { error: `Station created but invitation failed: ${authError.message}` }
        }

        // 3. Create User in Prisma
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
