import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
    try {
        // Admin credentials
        const username = 'admin'
        const email = 'admin@sorrymom.com'
        const password = 'Admin@123456'
        const dateOfBirth = new Date('1990-01-01')

        // Check if admin already exists
        const existingUser = await prisma.user.findUnique({
            where: { username }
        })

        if (existingUser) {
            console.log('❌ Admin user already exists!')
            console.log(`Username: ${existingUser.username}`)
            console.log(`Email: ${existingUser.email}`)
            return
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Create admin user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
                dateOfBirth,
                isAdmin: true,
                isContributor: false,
                isPartner: false,
                role: 'admin'
            }
        })

        console.log('✅ Admin user created successfully!')
        console.log('─'.repeat(50))
        console.log(`Username: ${username}`)
        console.log(`Email: ${email}`)
        console.log(`Password: ${password}`)
        console.log(`User ID: ${user.id}`)
        console.log('─'.repeat(50))
        console.log('⚠️  IMPORTANT: Save these credentials securely!')
        console.log('⚠️  Change the password after first login!')

    } catch (error) {
        console.error('❌ Error creating admin user:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createAdminUser()
