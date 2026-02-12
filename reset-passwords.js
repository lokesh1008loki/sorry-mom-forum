const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPasswords() {
    try {
        const newPassword = 'Test010';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        console.log('Resetting passwords for test accounts...\n');

        // Update all test accounts (test01 to test10)
        const testUsers = [
            'test01', 'test02', 'test03', 'test04', 'test05',
            'test06', 'test07', 'test08', 'test09', 'test10'
        ];

        for (const username of testUsers) {
            const result = await prisma.user.updateMany({
                where: { username: username },
                data: { passwordHash: hashedPassword }
            });

            if (result.count > 0) {
                console.log(`✓ Updated password for ${username}`);
            } else {
                console.log(`✗ User ${username} not found`);
            }
        }

        console.log('\n✅ Password reset complete!');
        console.log('All test accounts now use password: Test010');

    } catch (error) {
        console.error('Error resetting passwords:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetPasswords();
