"use server"

import prisma from '@/lib/prisma'

export async function getStationReservations(stationId: number) {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                schedule: {
                    route: {
                        OR: [
                            { source_station_id: stationId },
                            { destination_station_id: stationId }
                        ]
                    }
                }
            },
            include: {
                user: true,
                schedule: {
                    include: {
                        route: {
                            include: {
                                train: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                booked_at: 'desc'
            }
        })

        return {
            data: bookings.map(b => ({
                key: b.id,
                id: b.id.slice(0, 8).toUpperCase(),
                passenger: b.user.name,
                train: b.schedule.route.train.name || 'N/A',
                date: b.schedule.travel_date.toLocaleDateString(),
                status: b.booking_status.charAt(0).toUpperCase() + b.booking_status.slice(1),
                amount: `$${Number(b.total_amount).toFixed(2)}`,
            }))
        }
    } catch (error: any) {
        return { error: 'Failed to fetch reservations' }
    }
}

export async function getStationPassengers(stationId: number) {
    try {
        // Fetch unique users who have bookings at this station
        const bookings = await prisma.booking.findMany({
            where: {
                schedule: {
                    route: {
                        OR: [
                            { source_station_id: stationId },
                            { destination_station_id: stationId }
                        ]
                    }
                }
            },
            include: {
                user: true,
                schedule: {
                    include: {
                        route: {
                            include: {
                                source_station: true,
                                destination_station: true
                            }
                        }
                    }
                }
            },
            distinct: ['user_id']
        })

        return {
            data: await Promise.all(bookings.map(async b => {
                const tripsCount = await prisma.booking.count({
                    where: { user_id: b.user_id }
                })

                return {
                    key: b.user.id,
                    name: b.user.name,
                    email: b.user.email,
                    route: `${b.schedule.route.source_station.name} -> ${b.schedule.route.destination_station.name}`,
                    trips: tripsCount,
                    status: 'Active',
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.user.name}`
                }
            }))
        }
    } catch (error: any) {
        return { error: 'Failed to fetch passengers' }
    }
}
