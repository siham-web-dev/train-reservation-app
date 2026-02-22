"use server"

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getDrivers(stationId: number) {
    try {
        const drivers = await prisma.driver.findMany({
            where: {
                station_id: stationId
            },
            include: {
                train: true
            }
        })

        return {
            data: drivers.map(d => ({
                key: d.id,
                id: d.id.slice(0, 8).toUpperCase(),
                driver: d.name,
                email: d.email,
                phone: d.phone || 'N/A',
                status: d.status === 'on_duty' ? 'On Duty' : d.status === 'off_duty' ? 'Off Duty' : 'On Leave',
                train: d.train?.name || null,
                avatar: d.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.name}`
            }))
        }
    } catch (error: any) {
        return { error: 'Failed to fetch drivers' }
    }
}

export async function createDriver(stationId: number, data: any) {
    try {
        await prisma.driver.create({
            data: {
                ...data,
                station_id: stationId
            }
        })
        revalidatePath('/(station-owner)/drivers')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
