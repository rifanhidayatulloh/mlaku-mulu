# Mlaku-mulu (NestJS + TypeORM + MySQL)

A backend API to manage tourists and their trips for a travel bureau. Includes:

- Auth (JWT) & role-based access (EMPLOYEE, TOURIST)
- Employees can create/update/delete tourists and trips
- Tourists can create trips for themselves and list their trips
- Initial seed creates one employee

## Quick Start

1. **Clone & install**

```bash
npm i
cp .env.example .env
# edit .env to your MySQL credentials
```

2. **Start**

```bash
npm run start:dev
```

3. **Seed initial employee**

```bash
npm run seed
# Login with:
# email: employee@mlaku.com
# password: Password123!
```

## Test

```bash
npm test
npm run test:e2e
```

## Roles

- **EMPLOYEE**: manage tourists and trips (all tourists)
- **TOURIST**: create and list own trips
