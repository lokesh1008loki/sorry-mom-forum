import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding users...')
    const password = await hash('password123', 12)

    for (let i = 1; i <= 5; i++) {
        const num = i.toString().padStart(2, '0')
        const username = `test${num}`
        const email = `test${num}@example.com`

        try {
            const user = await prisma.user.upsert({
                where: { username },
                update: {},
                create: {
                    username,
                    email,
                    passwordHash: password,
                    dateOfBirth: new Date('2000-01-01'),
                    isContributor: false,
                    profilePicture: `https://avatar.vercel.sh/${username}`
                }
            })
            console.log(`Created user: ${username} (${email})`)
        } catch (e) {
            console.error(`Failed to create ${username}:`, e)
        }
    }
    console.log('Seeding complete.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
