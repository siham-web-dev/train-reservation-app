import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { createClient } from '@supabase/supabase-js'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
        process.exit(1)
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })

    const adminEmail = 'admin@trainres.com'
    const adminPassword = 'AdminPassword123!' // Change this after first login
    const adminName = 'System Admin'

    console.log(`Checking if admin user exists: ${adminEmail}`)

    // 1. Check if user exists in Supabase Auth
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    if (listError) {
        console.error('Error listing users:', listError)
        return
    }

    let adminUser = users.users.find((u) => u.email === adminEmail)

    if (!adminUser) {
        console.log('Creating admin user in Supabase Auth...')
        const { data: { user }, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true,
            user_metadata: {
                name: adminName,
                role: 'admin'
            }
        })

        if (createError) {
            console.error('Error creating user in Supabase:', createError)
            return
        }
        adminUser = user!
        console.log('Admin user created in Supabase Auth.')
    } else {
        console.log('Admin user already exists in Supabase Auth.')
    }

    // 2. Sync with Prisma users table
    console.log('Syncing admin user with Prisma database...')
    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            id: adminUser.id,
            role: 'admin',
            name: adminName
        },
        create: {
            id: adminUser.id,
            email: adminEmail,
            name: adminName,
            role: 'admin'
        }
    })

    console.log('Admin user synced with Prisma.')
    console.log('--- Seed complete ---')
    console.log(`Admin Email: ${adminEmail}`)
    console.log(`Initial Password: ${adminPassword}`)
    console.log('IMPORTANT: Please change the password after logging in.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
