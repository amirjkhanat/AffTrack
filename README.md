# AffTrack

A self-hosted affiliate tracking platform built with modern web technologies.

## Overview

AffTrack is a comprehensive affiliate tracking solution that allows you to manage and track affiliate marketing campaigns with ease. Built with Next.js and modern web technologies, it provides a robust platform for tracking affiliate performance, managing commissions, and analyzing campaign data.

## Features

- 🚀 Real-time tracking
- 📊 Advanced analytics dashboard
- 👥 Multi-user support
- 💰 Commission management
- 🔗 Custom tracking links
- 📱 Responsive design
- 🛡️ Secure authentication
- 🎨 Customizable interface

## Tech Stack

- Next.js 13
- Prisma (Database ORM)
- PostgreSQL
- NextAuth.js
- Tailwind CSS
- React
- TypeScript

## Getting Started

For detailed installation instructions, please refer to our [Installation Guide](INSTALL.md).

## Requirements

- Node.js (v18 or higher)
- PostgreSQL database
- Linux environment (preferred)

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Initialize database: `npx prisma migrate dev`
5. Set up NEXTAUTH_SECRET in file .env.local on root of project. You can generate it with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
6. Run the development server: `npm run dev`

## Documentation

Detailed documentation for setup and configuration can be found in the [Installation Guide](INSTALL.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is released as open source software. Feel free to use, modify, and distribute it as you see fit. No attribution required.
