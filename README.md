# Sorry Mom Forum

A modern forum platform built with Next.js, featuring user registration, authentication, and contributor management.

## Features

- User registration with age verification
- Real-time username and email availability checking
- Contributor account creation with platform links
- Modern UI with loading states and toast notifications
- Form validation and error handling
- Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Hook Form
- Zod Validation
- CockroachDB
- Prisma ORM

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="your_cockroachdb_url"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 