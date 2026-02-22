"use server"

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSupportTickets() {
    try {
        const tickets = await prisma.supportTicket.findMany({
            include: {
                user: true
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        return {
            data: tickets.map(t => ({
                key: t.id.toString(),
                id: t.id.toString(),
                user: t.user.email,
                subject: t.subject,
                status: t.status === 'open' ? 'Open' : t.status === 'in_progress' ? 'In Progress' : 'Resolved',
                date: t.created_at.toLocaleString(),
            }))
        }
    } catch (error: any) {
        return { error: 'Failed to fetch tickets' }
    }
}

export async function createSupportTicket(data: { subject: string; message: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    try {
        await prisma.supportTicket.create({
            data: {
                user_id: user.id,
                subject: data.subject,
                message: data.message,
            }
        })
        revalidatePath('/(station-owner)/settings')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
