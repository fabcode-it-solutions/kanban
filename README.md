# Kanban — Project & Task Management Platform

A modern, full-stack Kanban-style project management application built with **Next.js 15**, **TypeScript**, and **PostgreSQL**. It provides teams with role-based project boards, secure authentication, and a complete admin control panel for managing users, roles, and permissions.

This project is showcased as a reference of production-quality, scalable web application architecture — demonstrating clean code organization, secure authentication flows, and a fully custom Role-Based Access Control (RBAC) system built from the ground up.

---

## Key Features

- **Kanban Project Boards** — organize work visually across projects and tasks.
- **Authentication & Authorization** — secure sign-up/login powered by NextAuth, with hashed credentials (bcrypt).
- **Role-Based Access Control (RBAC)** — fine-grained permission system with custom roles, assignable per user and per project.
- **Admin Dashboard** — a dedicated control panel to:
  - Manage users and verify new sign-ups
  - Create and assign roles
  - Configure granular permissions
- **Type-Safe Data Layer** — built with Drizzle ORM and PostgreSQL for reliable, type-safe database access.
- **Modern UI** — responsive interface built with Radix UI and Tailwind CSS.
- **State Management** — centralized app state via Redux Toolkit.

---

## Tech Stack

| Layer            | Technology                                   |
|-------------------|-----------------------------------------------|
| Framework         | Next.js 15 (App Router, Turbopack)            |
| Language          | TypeScript                                    |
| UI                | Radix UI, Tailwind CSS                        |
| State Management  | Redux Toolkit                                 |
| Authentication    | NextAuth.js                                   |
| Database          | PostgreSQL                                    |
| ORM               | Drizzle ORM                                   |
| Validation        | Zod                                           |

---

## Project Highlights

- Clean separation of concerns across `app`, `components`, `db`, `models`, `redux`, and `utils` layers.
- Custom middleware for route protection based on authentication and role permissions.
- Database schema and migrations managed with Drizzle Kit for safe, version-controlled changes.
- Seed scripts for bootstrapping an admin account and default permission sets, enabling quick environment setup for demos or new deployments.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database instance

### 1. Configure environment variables

Create a `.env` file in the project root:

```bash
# Database Configuration
DATABASE_URL=postgresql://<pg_user>:<pg_password>@<pg_host>:<pg_port>/<pg_database>

DB_HOST=<pg_host>
DB_PORT=<pg_port>
DB_NAME=<pg_database>
DB_USER=<pg_user>
DB_PASSWORD=<pg_password>

# Admin Configuration
ADMIN_EMAIL=<any_email_for_admin_user>
ADMIN_PASSWORD=<admin_password>

NEXTAUTH_SECRET=<secret_key>
NEXTAUTH_URL=<app_url>
```

Generate a secure `NEXTAUTH_SECRET` with:

```bash
openssl rand -base64 32
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run database migrations

```bash
npm run migrate
```

### 4. Create the initial admin user

```bash
npm run seed:admin -- --email "<any_email_for_admin_user>" --password "<admin_password>"
```

### 5. Start the development server

```bash
npm run dev
```

### (Optional) Seed default permissions

```bash
npm run seed:permissions
```

---

## About

This project was developed by **[The Fabcode](https://thefabcode.org)** as a demonstration of a production-grade Kanban / project management solution, showcasing full-stack development capabilities including secure authentication, role-based access control, and scalable database design.

## License

This repository is publicly available for **viewing and reference purposes only**. See [LICENSE](./LICENSE) for full terms. No part of this code may be copied, modified, distributed, or reused without prior written permission from The Fabcode.

Interested in a similar solution for your team? [Get in touch](mailto:gurdit@thefabcode.org).
