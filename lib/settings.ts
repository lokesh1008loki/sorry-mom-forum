import { prisma } from '@/lib/prisma'

export type SystemSettings = {
    site_name: string
    maintenance_mode: boolean
    enable_registration: boolean
    public_view: boolean
}

const DEFAULT_SETTINGS: SystemSettings = {
    site_name: 'Sorry Mom Forum',
    maintenance_mode: false,
    enable_registration: true,
    public_view: true
}

export async function getSystemSettings(): Promise<SystemSettings> {
    try {
        const settings = await prisma.systemSetting.findMany()

        const settingsMap = settings.reduce((acc, curr) => {
            // Parse boolean values
            let value: any = curr.value
            if (curr.type === 'boolean') {
                value = curr.value === 'true'
            }
            acc[curr.key] = value
            return acc
        }, {} as Record<string, any>)

        return {
            ...DEFAULT_SETTINGS,
            ...settingsMap
        } as SystemSettings
    } catch (error) {
        console.error('Error fetching system settings:', error)
        return DEFAULT_SETTINGS
    }
}

export async function getSystemSetting(key: string): Promise<string | boolean | null> {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key }
        })

        if (!setting) return null

        if (setting.type === 'boolean') {
            return setting.value === 'true'
        }

        return setting.value
    } catch (error) {
        console.error(`Error fetching setting ${key}:`, error)
        return null
    }
}
