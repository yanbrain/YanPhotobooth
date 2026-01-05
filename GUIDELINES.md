# YanPhotobooth - Development Guidelines

**Version:** 1.0
**Last Updated:** 2026-01-04

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Folder Structure](#folder-structure)
3. [Naming Conventions](#naming-conventions)
4. [Code Style](#code-style)
5. [Import Rules](#import-rules)
6. [Error Handling](#error-handling)
7. [Environment Configuration](#environment-configuration)
8. [Testing Strategy](#testing-strategy)
9. [Git Workflow](#git-workflow)
10. [Performance Best Practices](#performance-best-practices)

---

## Architecture Overview

### Frontend: Next.js 14 + Feature-Sliced Design (FSD)

We use **Feature-Sliced Design** for frontend architecture:

```
src/
├── app/          # Next.js App Router (routing only, thin wrappers)
├── pages/        # FSD Pages layer (page compositions)
├── widgets/      # FSD Widgets layer (complex independent blocks)
├── features/     # FSD Features layer (business features)
├── entities/     # FSD Entities layer (business entities)
└── shared/       # FSD Shared layer (reusable primitives)
```

**FSD Rules:**
- **NO barrel files** (no `index.ts` re-exports)
- Each layer can only import from layers below it
- Features cannot import from other features
- Use direct imports: `import { Button } from '@/shared/ui/Button'`

### Backend: Firebase Functions + Clean Architecture

```
functions/src/
├── controllers/  # HTTP request handlers (thin layer)
├── services/     # Business logic
├── adapters/     # External integrations (Runware, Email, Storage)
├── domain/       # Domain models, errors, validators
├── config/       # Configuration files
└── utils/        # Shared utilities
```

**Clean Architecture Rules:**
- Domain layer has NO external dependencies
- Services contain business logic
- Controllers are thin (validation + service calls)
- Adapters abstract external APIs

---

## Folder Structure

### Frontend (Next.js)

```
src/
├── app/                    # Next.js routing
│   ├── (public)/           # Route group
│   │   ├── capture/
│   │   │   └── page.tsx   # Imports from @/pages/capture
│   │   └── ...
│   ├── layout.tsx
│   └── page.tsx
├── pages/                  # Page compositions (FSD)
│   └── capture/
│       └── ui/
│           └── CapturePage.tsx
├── widgets/                # Complex UI blocks
│   └── style-carousel/
│       ├── ui/
│       └── model/
├── features/               # Business features
│   └── capture-photo/
│       ├── ui/            # Components
│       ├── model/         # State (stores)
│       ├── api/           # API calls
│       └── lib/           # Feature-specific utils
├── entities/               # Business entities
│   └── style/
│       ├── model/
│       ├── config/
│       └── lib/
└── shared/                 # Reusable code
    ├── ui/                # UI primitives
    ├── api/               # HTTP client
    ├── lib/               # Utilities
    ├── config/            # Global config
    └── types/             # Shared types
```

### Backend (Firebase Functions)

```
functions/
├── src/
│   ├── controllers/       # HTTP handlers
│   │   ├── generate.ts
│   │   ├── status.ts
│   │   └── email.ts
│   ├── services/          # Business logic
│   │   ├── generate-portrait.ts
│   │   └── send-email.ts
│   ├── adapters/          # External APIs
│   │   ├── runware-client.ts
│   │   ├── email-client.ts
│   │   ├── storage-client.ts
│   │   └── mocks/        # Mock implementations
│   ├── domain/            # Domain models
│   │   ├── types.ts
│   │   ├── errors.ts
│   │   └── validators.ts
│   ├── config/            # Configuration
│   │   ├── env.ts
│   │   └── prompts.ts
│   ├── utils/             # Shared utilities
│   │   ├── logger.ts
│   │   ├── http-errors.ts
│   │   └── idempotency.ts
│   └── index.ts           # Entry point
├── dist/                  # Compiled output (gitignored)
├── package.json
└── tsconfig.json
```

---

## Naming Conventions

### Files

| Type | Convention | Example |
|------|-----------|---------|
| React Components | `PascalCase.tsx` | `Button.tsx`, `StyleCard.tsx` |
| TypeScript files | `kebab-case.ts` | `http-client.ts`, `capture-store.ts` |
| Folders | `kebab-case` | `capture-photo/`, `style-carousel/` |
| Route groups | `(kebab-case)` | `(public)/`, `(admin)/` |

### Code

| Element | Convention | Example |
|---------|-----------|---------|
| Variables | `camelCase` | `const userName = 'John'` |
| Functions | `camelCase` | `function validateEmail()` |
| Components | `PascalCase` | `export function Button()` |
| Types/Interfaces | `PascalCase` | `interface UserData {}` |
| Constants | `UPPER_SNAKE_CASE` | `const MAX_RETRIES = 3` |
| Enums | `PascalCase` (keys UPPER) | `enum Status { ACTIVE = 'active' }` |

**Class naming:**
```typescript
// Domain classes - PascalCase with descriptive suffix
export class DomainError extends Error {}
export class RateLimitError extends DomainError {}

// Properties - use readonly when immutable
constructor(
  public readonly code: ErrorCode,  // ✅ Explicit visibility
  message: string
) {}
```

---

## Code Style

### TypeScript

**Use explicit types:**
```typescript
// ✅ Good
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ❌ Bad
function validateEmail(email) {  // implicit any
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

**Use readonly for immutables:**
```typescript
// ✅ Good
export class DomainError extends Error {
  public readonly statusCode: number;

  constructor(public readonly code: ErrorCode, message: string) {
    super(message);
    this.statusCode = ERROR_CODE_TO_HTTP_STATUS[code];
  }
}
```

**Document complex logic:**
```typescript
/**
 * Maps error codes to HTTP status codes
 */
const ERROR_CODE_TO_HTTP_STATUS: Record<ErrorCode, number> = {
  RUNWARE_TEMPORARY: 503,
  DAILY_CAP: 429,
  // ...
};
```

### React/Next.js

**Component structure:**
```typescript
'use client';  // Only if needed (useState, useEffect, etc.)

import { useState } from 'react';
import { Button } from '@/shared/ui/Button';

interface Props {
  title: string;
  onSubmit: () => void;
}

export function MyComponent({ title, onSubmit }: Props) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
```

---

## Import Rules

### ❌ NO Barrel Files

**Never create `index.ts` re-exports:**
```typescript
// ❌ Bad - barrel file
// shared/ui/index.ts
export { Button } from './Button';
export { Modal } from './Modal';

// ❌ Bad - importing from barrel
import { Button, Modal } from '@/shared/ui';
```

**Always use direct imports:**
```typescript
// ✅ Good - direct imports
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
```

**Why?** [Barrel files harm performance](https://www.atlassian.com/blog/atlassian-engineering/faster-builds-when-removing-barrel-files):
- 75% slower builds (Atlassian case study)
- Break tree-shaking (import 1 thing → load everything)
- Slow TypeScript compiler

### Import Order

```typescript
// 1. External libraries
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Internal absolute imports (grouped by layer)
import { Button } from '@/shared/ui/Button';
import { StyleCard } from '@/features/select-style/ui/StyleCard';

// 3. Relative imports
import { localHelper } from './helpers';

// 4. Types (if separate)
import type { Props } from './types';
```

---

## Error Handling

### Backend (Domain Errors)

**Always use domain errors:**
```typescript
import { DomainError, RateLimitError } from '../domain/errors';

// ✅ Good
if (count >= maxRequests) {
  throw new RateLimitError();
}

// ❌ Bad
if (count >= maxRequests) {
  throw new Error('Rate limit exceeded');
}
```

**Error hierarchy:**
```
DomainError (base)
├── RunwareError
├── RateLimitError
├── BotCheckError
├── DailyCapError
└── EmailError
```

**Each error maps to HTTP status:**
```typescript
const ERROR_CODE_TO_HTTP_STATUS: Record<ErrorCode, number> = {
  RUNWARE_BAD_INPUT: 400,   // Client error
  BOT_CHECK_FAILED: 403,    // Forbidden
  DAILY_CAP: 429,           // Too many requests
  RUNWARE_TEMPORARY: 503,   // Service unavailable
  // ...
};
```

### Frontend (Error Handling)

```typescript
try {
  await generatePortrait(data);
} catch (error) {
  const mapped = mapError(error);
  toast.error(mapped.message);
}
```

---

## Environment Configuration

### Backend (.env)

```bash
# Development Mode (Local)
USE_MOCK=true
MOCK_GENERATION_DELAY=2000
NODE_ENV=development

# Production Mode
USE_MOCK=false
RUNWARE_API_KEY=your-key
SENDGRID_API_KEY=your-key
```

### Frontend (public-env.ts)

**Never expose secrets in frontend:**
```typescript
// ✅ Good - public only
export const publicEnv = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
} as const;

// ❌ Bad - exposing secrets
export const config = {
  runwareKey: process.env.RUNWARE_API_KEY  // NEVER!
};
```

---

## Testing Strategy

### Unit Tests (Future)

```typescript
// tests/utils/validators.test.ts
import { validateEmail } from '@/utils/validators';

describe('validateEmail', () => {
  it('accepts valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

### E2E Tests (Future)

Use Playwright for critical user flows.

---

## Git Workflow

### Branch Naming

```
main                     # Production
claude/feature-name      # Feature branches
```

### Commit Messages

```
feat: Add dark mode toggle
fix: Resolve TypeScript null check in SuccessPage
refactor: Remove bloat from idempotency utils
docs: Update guidelines with naming conventions
```

**Format:** `type: Brief description`

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

---

## Performance Best Practices

### 1. No Barrel Files ⚠️

Already covered above. **Critical for performance.**

### 2. Code Splitting

```typescript
// ✅ Good - dynamic import
const HeavyComponent = dynamic(() => import('./HeavyComponent'));

// ❌ Bad - eager load
import { HeavyComponent } from './HeavyComponent';
```

### 3. Image Optimization

```typescript
// ✅ Good - Next.js Image
import Image from 'next/image';

<Image src="/photo.jpg" width={500} height={500} alt="Photo" />

// ❌ Bad - regular img
<img src="/photo.jpg" />
```

### 4. Minimize Dependencies

- Don't install libraries for simple tasks
- Check bundle size impact before adding deps
- Use tree-shakeable libraries

---

## Common Patterns

### Mock Adapters (Development)

```typescript
// adapters/runware-client.ts
import { env } from '../config/env';
import { generateWithRunwareMock } from './mocks/runware-mock';

export async function generateWithRunware(...): Promise<string> {
  if (env.useMock) {
    return generateWithRunwareMock(imageBase64, prompt, taskId);
  }

  // Real implementation
  const response = await fetch(API_URL, { ... });
  return response.url;
}
```

**Benefits:**
- Local development without API costs
- Faster feedback loop
- Works offline

### Idempotency Keys

```typescript
const idempotencyKey = createIdempotencyKey();

// First call - creates job
const job1 = await generatePortrait({ ..., idempotencyKey });

// Second call - returns existing job
const job2 = await generatePortrait({ ..., idempotencyKey });

// job1.id === job2.id  ✅
```

---

## Tools & Automation (Recommended)

### Essential

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **TypeScript** - Type safety
4. **Husky** - Git hooks

### Future Additions

1. **`eslint-plugin-boundaries`** - Enforce FSD layer rules
2. **Steiger** - Official FSD linter
3. **Jest** - Unit testing
4. **Playwright** - E2E testing

---

## Don'ts ❌

1. ❌ **Don't create barrel files** (`index.ts` re-exports)
2. ❌ **Don't use relative imports across layers**
3. ❌ **Don't put business logic in controllers**
4. ❌ **Don't hardcode configuration** (use env variables)
5. ❌ **Don't expose secrets in frontend** (use `NEXT_PUBLIC_` only for safe values)
6. ❌ **Don't skip error handling**
7. ❌ **Don't commit secrets to git**

---

## Dos ✅

1. ✅ **Use direct imports** (`import { X } from '@/path/to/X'`)
2. ✅ **Follow FSD hierarchy** (shared → entities → features → widgets → pages)
3. ✅ **Use TypeScript strict mode**
4. ✅ **Document complex logic** (JSDoc comments)
5. ✅ **Use domain errors** (not generic Error)
6. ✅ **Keep functions small** (single responsibility)
7. ✅ **Use readonly for immutables**

---

## Questions?

For questions or clarifications, refer to:
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Functions Guide](https://firebase.google.com/docs/functions)

---

**Last updated:** 2026-01-04
**Maintained by:** Development Team
