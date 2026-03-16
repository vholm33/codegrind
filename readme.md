# NEW INFO : workspaces

Install to workspace from root:

- npm install cors --workspace=api // not --workspace=apps/api

## workspace : api - backend

- npm run dev:back // Runs dev in backend workspace - tsx --watch src/server.ts
- npm run build:back // Builds backend dist/
- npm run start:back // Starts compiled js app from dist/

## workspace : web - frontend

- npm run dev:front // runs dev in frontend workspace

# Project Name

Short description of what the project does and why it exists.

---

# 1. Project Philosophy

Core principles for all technical decisions:

- Prefer simplicity and easy to understand code over clever code
- Type safety first (TypeScript strict mode)
- Separation of concerns (routes → controllers → services → repositories)
- One error class to rule them all. Write explicit error messages
- Configuration via environment variables

---

# 2. Tech Stack

## Core Runtime

- Node.js (ES6)
- TypeScript
- Express

## Database

- MySQL (`mysql2/promise`)

## Authentication

- jsonwebtoken
- bcrypt

## Dev Tooling

- tsx (dev runtime)
- nodemon (optional)
- dotenv
- prettier

---

# 3. Projectstruktur

<pre><code>
apps/
├── shared/types.ts
├── api/
│ ├── dist/
│ ├── src/
│ │ ├── middleware/authMiddleware.ts
│ │ ├── mongodb/{routes/, controllers/, connection.ts}
│ │ └── mysql/{routes/, controllers/, services/, repositories/, db/}
│ ├── server.ts
│ ├── tsconfig.json
│ └── .env
├── web/
│ ├── dist/
│ ├── src/
│ │  ├── components/
│ │  ├── handouts/
│ │  ├── pages/...
│ └── utils/initToolbarSidebar.ts
├── dist/
├── package.json
├── tsconfig.json
</code></pre>

### Layer Responsibilities

Routes

- Define endpoints
- No business logic

Controllers

- Parse request
- Call service
- Return response

Services

- Business logic
- Orchestration

Repositories

- Database access only
- No business logic

Domain

- Types
- Factories
- Entities
- Validation logic

---

# 4. Development Workflow

## Feature Workflow

1. Define domain type
2. Write service logic
3. Write repository function
4. Write controller
5. Register route
6. Test manually

---

## Branching Strategy

- main → stable
- dev → integration
- feature/xyz → new features

---

## Running Locally

npm install
npm run dev

Example scripts:

{
"scripts": {
"dev": "tsx watch src/server.ts",
"build": "tsc",
"start": "node dist/server.js"
}
}

---

# 5. Environment Variables

.env

PORT=3000
DATABASE_URL=
JWT_SECRET=

Never commit .env.

---

# 6. Common Dev Decisions

Document WHY choices were made.

## Why TypeScript Strict Mode?

- Prevent runtime bugs
- Better refactoring
- Clear contracts between layers

## Why Service + Repository Pattern?

- Database logic isolated
- Business logic testable
- Thin controllers

## Why JWT Instead of Sessions?

- Stateless
- API-friendly
- Easy horizontal scaling

## Why mysql2/promise?

- Native async/await
- Lightweight
- No ORM overhead

---

# 7. Package Selection Guidelines

Before adding a package:

1. Is it actively maintained?
2. Is it widely used?
3. Does it reduce complexity?
4. Can we write this ourselves easily?
5. Does it duplicate built-in functionality?

Avoid:

- Overlapping libraries
- Heavy frameworks for small problems
- Magic-heavy ORMs unless necessary

---

# 8. Error Handling Strategy

- Domain errors
- Validation errors
- Infrastructure errors
- Centralized error middleware

Example pattern:

class AppError extends Error {
constructor(message: string, public statusCode: number) {
super(message);
}
}

---

# 9. Logging Strategy

Development

- console.log

Production

- Structured logger (pino / winston)

---

# 10. Testing Strategy

- Unit test services
- Integration test API routes
- Mock repositories in service tests
- Use test database for integration

---

# 11. Deployment Strategy

- Build with tsc
- Run node dist/server.js
- Environment-specific configs
- Docker for reproducibility

---

# 12. Scaling Considerations

- Stateless API
- Separate database instance
- Redis for caching (if needed)
- Background jobs via queue (BullMQ)

---

# 13. Code Style Rules

- Named exports preferred
- Default export only for routers
- No business logic in controllers
- No DB logic in services
- Strict typing everywhere

---

# 14. New Feature Checklist

- [ ] Define domain types
- [ ] Add repository
- [ ] Add service
- [ ] Add controller
- [ ] Add route
- [ ] Add validation
- [ ] Update README if architecture changes

---

# 15. Future Improvements

Document:

- Planned refactors
- Known limitations
- Performance bottlenecks
- Architecture upgrades
