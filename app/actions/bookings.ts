"use server"

import { revalidatePath } from 'next/cache'
import { BookingStatus } from '@prisma/client'
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
                passengers: {
                    include: {
                        seat: {
                            include: {
                                coach: true
                            }
                        }
                    }
                },
                schedule: {
                    include: {
                        route: {
                            include: {
                                train: true,
                                source_station: true,
                                destination_station: true
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
                train: b.schedule.route.train.name || b.schedule.route.train.train_number,
                route: `${b.schedule.route.source_station.name} → ${b.schedule.route.destination_station.name}`,
                departure: b.schedule.departure_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                arrival: b.schedule.arrival_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: b.schedule.travel_date.toLocaleDateString(),
                status: b.booking_status,
                amount: `$${Number(b.total_amount).toFixed(2)}`,
                details: b.passengers.map(p => ({
                    id: p.id,
                    name: p.name,
                    age: p.age,
                    gender: p.gender,
                    seat: p.seat ? `${p.seat.coach.coach_number}-${p.seat.seat_number}` : 'Unassigned'
                }))
            }))
        }
    } catch (error: any) {
        console.error('getStationReservations Error:', error)
        return { error: 'Failed to fetch reservations' }
    }
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
    try {
        await prisma.booking.update({
            where: { id: bookingId },
            data: { booking_status: status }
        })
        revalidatePath('/(station-owner)/reservations')
        return { success: true }
    } catch (error: any) {
        console.error('updateBookingStatus Error:', error)
        return { error: error.message }
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

export async function getTrainReservations(trainId: number) {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                schedule: {
                    route: {
                        train_id: trainId
                    }
                }
            },
            include: {
                user: true,
                passengers: {
                    include: {
                        seat: {
                            include: {
                                coach: true
                            }
                        }
                    }
                },
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
            orderBy: {
                booked_at: 'desc'
            }
        })

        return {
            data: bookings.map(b => ({
                key: b.id,
                id: b.id.slice(0, 8).toUpperCase(),
                passenger: b.user.name,
                date: b.schedule.travel_date.toLocaleDateString(),
                route: `${b.schedule.route.source_station.name} -> ${b.schedule.route.destination_station.name}`,
                status: b.booking_status,
                amount: `$${Number(b.total_amount).toFixed(2)}`,
                details: b.passengers.map(p => ({
                    id: p.id,
                    name: p.name,
                    age: p.age,
                    gender: p.gender,
                    seat: p.seat ? `${p.seat.coach.coach_number}-${p.seat.seat_number}` : 'Unassigned'
                }))
            }))
        }
    } catch (error: any) {
        console.error('getTrainReservations Error:', error)
        return { error: 'Failed to fetch train reservations' }
    }
}
