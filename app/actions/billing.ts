"use server"

import prisma from '@/lib/prisma'

export async function getAdminBillingStats() {
    try {
        const totalRevenue = await prisma.booking.aggregate({
            where: {
                booking_status: 'confirmed',
            },
            _sum: {
                total_amount: true,
            },
        })

        const activeSubscriptions = await prisma.stationSubscription.count({
            where: {
                status: 'active',
            },
        })

        const recentTransactions = await prisma.booking.findMany({
            take: 5,
            orderBy: {
                booked_at: 'desc',
            },
            include: {
                user: true,
            },
        })

        return {
            totalRevenue: Number(totalRevenue._sum.total_amount || 0),
            activeSubscriptions,
            recentTransactions: recentTransactions.map(t => ({
                key: t.id,
                id: t.id.slice(0, 8).toUpperCase(),
                description: `Booking - ${t.user.name}`,
                amount: `+$${Number(t.total_amount).toFixed(2)}`,
                status: 'Completed',
                date: t.booked_at.toLocaleDateString(),
            })),
        }
    } catch (error: any) {
        console.error('getAdminBillingStats Error:', error)
        return { error: 'Failed to fetch admin billing stats' }
    }
}

export async function getStationSubscription(stationId: number) {
    try {
        const subscription = await prisma.stationSubscription.findFirst({
            where: {
                station_id: stationId,
                status: 'active',
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        return { data: subscription }
    } catch (error: any) {
        return { error: 'Failed to fetch station subscription' }
    }
}
