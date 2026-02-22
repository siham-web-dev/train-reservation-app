"use server"

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function getAdminAnalytics() {
    try {
        const [totalUsers, activeStations, ticketsToday] = await Promise.all([
            prisma.user.count(),
            prisma.station.count(),
            prisma.booking.count({
                where: {
                    booked_at: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
        ])

        return {
            totalUsers,
            activeStations,
            ticketsToday,
        }
    } catch (error: any) {
        console.error('getAdminAnalytics Error:', error)
        return { error: 'Failed to fetch admin analytics' }
    }
}

export async function getStationAnalytics(stationId: number) {
    try {
        // Daily passengers (confirmed bookings for this station)
        const dailyPassengers = await prisma.booking.count({
            where: {
                schedule: {
                    route: {
                        OR: [
                            { source_station_id: stationId },
                            { destination_station_id: stationId }
                        ]
                    }
                },
                booking_status: 'confirmed',
                booked_at: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        })

        // Daily revenue
        const dailyRevenue = await prisma.booking.aggregate({
            where: {
                schedule: {
                    route: {
                        OR: [
                            { source_station_id: stationId },
                            { destination_station_id: stationId }
                        ]
                    }
                },
                booking_status: 'confirmed',
                booked_at: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
            _sum: {
                total_amount: true,
            },
        })

        return {
            dailyPassengers,
            dailyRevenue: Number(dailyRevenue._sum.total_amount || 0),
            onTimePerformance: 92, // Mock for now as we don't have historical status tracking
        }
    } catch (error: any) {
        console.error('getStationAnalytics Error:', error)
        return { error: 'Failed to fetch station analytics' }
    }
}
