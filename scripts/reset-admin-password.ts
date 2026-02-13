import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetAdminPassword() {
    try {
        const username = 'admin'
        const newPassword = 'Admin@123456'

        // Hash the new password
        const passwordHash = await bcrypt.hash(newPassword, 10)

        // Update admin password
        const user = await prisma.user.update({
            where: { username },
            data: { passwordHash },
            select: {
                id: true,
                username: true,
                email: true,
            }
        })

        console.log('✅ Admin password reset successfully!')
        console.log('─'.repeat(50))
        console.log(`Username: ${user.username}`)
        console.log(`Email: ${user.email}`)
        console.log(`Password: ${newPassword}`)
        console.log('─'.repeat(50))

    } catch (error) {
        console.error('❌ Error resetting admin password:', error)
    } finally {
        await prisma.$disconnect()
    }
}

resetAdminPassword()
