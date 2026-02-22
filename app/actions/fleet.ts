"use server"

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { CoachClass, SeatType } from '@prisma/client'

export async function getStationTrains(stationId: number) {
    try {
        const trains = await prisma.train.findMany({
            where: {
                station_id: stationId
            },
            include: {
                _count: {
                    select: { coaches: true }
                }
            }
        })

        return {
            data: trains.map(t => ({
                key: t.id.toString(),
                name: t.name || t.train_number,
                type: 'Regional', // Default
                capacity: t.total_seats || 0,
                status: 'Operational',
                route: 'N/A',
                coach_count: t._count.coaches
            }))
        }
    } catch (error: any) {
        return { error: 'Failed to fetch trains' }
    }
}

export async function addTrain(data: any) {
    try {
        const { station_id, train_number, name, num_coaches, seats_per_coach, coach_class } = data;
        const total_seats = parseInt(num_coaches) * parseInt(seats_per_coach);

        await prisma.$transaction(async (tx) => {
            const train = await tx.train.create({
                data: {
                    station_id: parseInt(station_id),
                    train_number,
                    name,
                    total_seats: total_seats
                }
            });

            for (let i = 1; i <= parseInt(num_coaches); i++) {
                const coach = await tx.coach.create({
                    data: {
                        train_id: train.id,
                        coach_number: `C${i}`,
                        class: (coach_class as CoachClass) || CoachClass.economy,
                    }
                });

                const seatsData = [];
                for (let j = 1; j <= parseInt(seats_per_coach); j++) {
                    let st: SeatType = SeatType.middle;
                    if (j % 3 === 1) st = SeatType.window;
                    else if (j % 3 === 2) st = SeatType.aisle;

                    seatsData.push({
                        coach_id: coach.id,
                        seat_number: `${j}`,
                        seat_type: st
                    });
                }

                await tx.seat.createMany({
                    data: seatsData
                });
            }
        });

        revalidatePath('/(station-owner)/trains')
        return { success: true }
    } catch (error: any) {
        console.error("Add train error:", error);
        return { error: error.message }
    }
}

export async function getTrainCoaches(trainId: number) {
    try {
        const coaches = await prisma.coach.findMany({
            where: { train_id: trainId },
            include: {
                seats: true
            },
            orderBy: {
                coach_number: 'asc'
            }
        });
        return { data: coaches };
    } catch (error: any) {
        return { error: 'Failed to fetch coaches' };
    }
}

export async function updateSeat(seatId: number, data: { seat_number: string; seat_type: SeatType }) {
    try {
        await prisma.seat.update({
            where: { id: seatId },
            data: {
                seat_number: data.seat_number,
                seat_type: data.seat_type
            }
        });
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function addSeat(coachId: number, data: { seat_number: string; seat_type: SeatType }) {
    try {
        const coach = await prisma.coach.findUnique({
            where: { id: coachId },
            include: { train: true }
        });

        if (!coach) throw new Error('Coach not found');

        await prisma.$transaction([
            prisma.seat.create({
                data: {
                    coach_id: coachId,
                    seat_number: data.seat_number,
                    seat_type: data.seat_type
                }
            }),
            prisma.train.update({
                where: { id: coach.train_id },
                data: {
                    total_seats: {
                        increment: 1
                    }
                }
            })
        ]);

        revalidatePath('/(station-owner)/trains')
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteSeat(seatId: number) {
    try {
        const seat = await prisma.seat.findUnique({
            where: { id: seatId },
            include: { coach: { include: { train: true } } }
        });

        if (!seat) throw new Error('Seat not found');

        await prisma.$transaction([
            prisma.seat.delete({
                where: { id: seatId }
            }),
            prisma.train.update({
                where: { id: seat.coach.train_id },
                data: {
                    total_seats: {
                        decrement: 1
                    }
                }
            })
        ]);

        revalidatePath('/(station-owner)/trains')
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
