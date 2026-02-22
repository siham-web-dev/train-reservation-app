# Train Reservation System

A modern, full-stack train reservation and station management platform built with Next.js, Prisma, and Ant Design.

## 🚀 Key Features

### 🚄 Station Owner Dashboard
- **Fleet Management**: Manage trains, coaches, and seating configurations.
- **Booking Management**: High-performance interface for tracking reservations, viewing passenger manifests, and updating booking statuses.
- **Driver Management**: Dedicated section for managing train drivers and assignments.
- **Analytics**: Real-time insights into station activity and revenue.

### 🛡️ Admin Portal
- **Station Control**: Create and manage railway stations.
- **Owner Onboarding**: Manage station owners and subscription plans.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [Ant Design](https://ant.design/) & [Tailwind CSS](https://tailwindcss.com/)
- **ORM**: [Prisma](https://www.prisma.io/) (PostgreSQL)
- **Auth & Database**: [Supabase](https://supabase.com/)
- **Icons**: Ant Design Icons

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase project)

### 2. Environment Variables
Create a `.env` file in the root:
```env
DATABASE_URL="your_postgresql_url"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the App
```bash
npm run dev
```

## 📂 Project Structure

- `/app`: Next.js pages, layouts, and server actions.
- `/components`: Shared React components.
- `/lib`: Utility libraries (Prisma client, Supabase client).
- `/prisma`: Database schema and migrations.
- `/public`: Static assets.

---
Built with ❤️ for efficient railway management.
