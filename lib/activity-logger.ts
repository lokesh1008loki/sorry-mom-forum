import { prisma } from './prisma'

/**
 * Log an activity/action to the database
 */
export async function logActivity({
    userId,
    action,
    entityType,
    entityId,
    metadata,
    ipAddress,
    userAgent
}: {
    userId?: string
    action: string
    entityType?: string
    entityId?: string
    metadata?: Record<string, any>
    ipAddress?: string
    userAgent?: string
}) {
    try {
        await prisma.activityLog.create({
            data: {
                userId: userId || null,
                action,
                entityType: entityType || null,
                entityId: entityId || null,
                metadata: metadata ? JSON.stringify(metadata) : null,
                ipAddress: ipAddress || null,
                userAgent: userAgent || null
            }
        })
    } catch (error) {
        console.error('Failed to log activity:', error)
        // Don't throw - logging failures shouldn't break the app
    }
}

/**
 * Common action types for consistency
 */
export const ActivityActions = {
    // Authentication
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    REGISTER: 'REGISTER',

    // Staff Management
    CREATE_STAFF: 'CREATE_STAFF',
    UPDATE_STAFF: 'UPDATE_STAFF',
    DELETE_STAFF: 'DELETE_STAFF',

    // Content Moderation
    APPROVE_CONTENT: 'APPROVE_CONTENT',
    REJECT_CONTENT: 'REJECT_CONTENT',
    CREATE_CONTENT: 'CREATE_CONTENT',

    // Contributor Management
    APPROVE_CONTRIBUTOR: 'APPROVE_CONTRIBUTOR',
    REJECT_CONTRIBUTOR: 'REJECT_CONTRIBUTOR',
    UPDATE_CONTRIBUTOR: 'UPDATE_CONTRIBUTOR',

    // User Management
    UPDATE_USER: 'UPDATE_USER',
    DELETE_USER: 'DELETE_USER',
    BAN_USER: 'BAN_USER',

    // System
    SYSTEM_ERROR: 'SYSTEM_ERROR',

    // Admin Settings & Customization
    UPDATE_SYSTEM_SETTING: 'UPDATE_SYSTEM_SETTING',
    CREATE_BADGE: 'CREATE_BADGE',
    UPDATE_BADGE: 'UPDATE_BADGE',
    CREATE_ANNOUNCEMENT: 'CREATE_ANNOUNCEMENT',
    UPDATE_ANNOUNCEMENT: 'UPDATE_ANNOUNCEMENT',
    DELETE_ANNOUNCEMENT: 'DELETE_ANNOUNCEMENT',
} as const

export type ActivityAction = typeof ActivityActions[keyof typeof ActivityActions]
