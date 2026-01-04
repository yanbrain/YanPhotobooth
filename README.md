# YanPhotobooth - AI Photobooth

An AI-powered photobooth application that transforms your photos into different artistic styles using the Runware API.

## Features

- 📸 Webcam photo capture
- 🎨 Multiple AI style transformations (Cyberpunk, Medieval, Anime, Vintage, Fantasy)
- 📧 Email generated photos
- 🖨️ Print functionality
- 🛡️ Rate limiting and bot protection
- ⚡ Real-time generation progress tracking

## Architecture

This project follows **Feature-Sliced Design (FSD)** architecture:

- **Frontend**: Next.js 14 with App Router + TypeScript + Tailwind CSS
- **State Management**: Zustand
- **Backend**: Firebase Functions (Node.js 18)
- **AI Processing**: Runware API
- **Storage**: Firebase Cloud Storage
- **Email**: SendGrid (configurable)

### Folder Structure

```
YanPhotobooth/
├── src/
│   ├── app/              # Next.js routes
│   ├── pages/            # Page compositions (FSD layer)
│   ├── widgets/          # Complex UI widgets
│   ├── features/         # Feature modules
│   ├── entities/         # Business entities
│   └── shared/           # Shared utilities
├── functions/
│   └── src/
│       ├── http/         # HTTP handlers
│       ├── usecases/     # Business logic
│       ├── adapters/     # External integrations
│       ├── domain/       # Domain types and errors
│       ├── config/       # Configuration
│       └── lib/          # Utilities
└── public/               # Static assets
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Runware API key (sign up at https://runware.ai)
- Firebase project

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd YanPhotobooth

# Install frontend dependencies
npm install

# Install backend dependencies
cd functions
npm install
cd ..
```

### 2. Configure Environment Variables

**Frontend** (`.env.local`):
```bash
cp .env.example .env.local
```

Edit `.env.local` if needed (optional for local dev).

**Backend** (`functions/.env`):
```bash
cp functions/.env.example functions/.env
```

Edit `functions/.env` and add:
```env
RUNWARE_API_KEY=your_runware_api_key_here
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EMAIL_API_KEY=your_sendgrid_api_key  # Optional
EMAIL_FROM=noreply@yourapp.com
DAILY_MAX_GENERATIONS=1000
NODE_ENV=development
```

### 3. Set Up Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Select:
# - Functions
# - Hosting
# - Storage

# Update .firebaserc with your project ID
```

### 4. Run Development Servers

**Option A: Frontend + Firebase Emulators**

Terminal 1 - Start Firebase emulators:
```bash
cd functions
npm run serve
```

Terminal 2 - Start Next.js dev server:
```bash
npm run dev
```

**Option B: Frontend Only (with deployed backend)**
```bash
npm run dev
```

Visit http://localhost:3000

## Building for Production

### Build Frontend

```bash
# Build Next.js app
npm run build

# For static export (if not using SSR)
npm run build && npx next export
```

### Build Backend

```bash
cd functions
npm run build
```

## Deployment

### Deploy to Firebase

**1. Configure Firebase Project**

Edit `.firebaserc`:
```json
{
  "projects": {
    "default": "your-production-project-id"
  }
}
```

**2. Set Environment Variables**

```bash
# Set backend secrets
firebase functions:config:set \
  runware.api_key="your_runware_key" \
  email.api_key="your_email_key" \
  email.from="noreply@yourapp.com"

# Or use .env file in functions/ for Firebase Functions Gen 2
```

**3. Deploy**

```bash
# Deploy everything
firebase deploy

# Or deploy selectively
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only storage
```

### Deploy Frontend to Vercel (Alternative)

If hosting frontend separately on Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
NEXT_PUBLIC_API_BASE_URL=https://your-firebase-functions-url.com
```

## Configuration

### Styles Catalog

Edit `src/entities/style/config/styles-catalog.ts` to add or modify AI styles.

Each style needs:
- `id`: Unique identifier
- `name`: Display name
- `prompt`: AI generation prompt
- `thumbnail`: Path to preview image

### Rate Limits

Edit `functions/src/adapters/rate-limiter.ts`:
- Default: 10 requests per minute per IP
- Customizable per endpoint

### Daily Cap

Set in `functions/.env`:
```env
DAILY_MAX_GENERATIONS=1000
```

### Bot Protection

For production, integrate Firebase App Check or reCAPTCHA:
1. Set up App Check in Firebase Console
2. Update `src/shared/config/public-env.ts` with site key
3. Update `functions/src/adapters/bot-check.ts` with verification logic

## API Endpoints

### POST /api/generate
Generate AI portrait from photo.

**Request** (multipart/form-data):
- `image`: File
- `styleId`: string
- `idempotencyKey`: string
- `botToken`: string

**Response**:
```json
{
  "jobId": "job_123...",
  "status": "queued|running|done|failed",
  "resultUrl": "https://...",
  "error": null
}
```

### GET /api/status?id={jobId}
Get generation status.

**Response**:
```json
{
  "jobId": "job_123...",
  "status": "done",
  "progress": 100,
  "resultUrl": "https://...",
  "error": null
}
```

### POST /api/email
Email generated photo.

**Request** (JSON):
```json
{
  "jobId": "job_123...",
  "email": "user@example.com",
  "botToken": "string"
}
```

**Response**:
```json
{
  "ok": true
}
```

## Error Codes

- `RUNWARE_TEMPORARY`: Temporary API error, retry allowed
- `RUNWARE_BAD_INPUT`: Invalid input, user action required
- `RUNWARE_QUOTA`: API quota exceeded
- `DAILY_CAP`: Daily generation limit reached
- `RATE_LIMITED`: Too many requests
- `BOT_CHECK_FAILED`: Bot verification failed
- `EMAIL_TEMPORARY`: Email send failed, retry allowed
- `EMAIL_BLOCKED`: Email address blocked

## Troubleshooting

### Camera Not Working
- Ensure HTTPS or localhost (required for getUserMedia)
- Check browser permissions
- Try different browser

### Backend Errors
- Check Firebase Functions logs: `firebase functions:log`
- Verify environment variables are set
- Check Runware API key is valid

### Build Errors
- Clear `.next` and `functions/lib` folders
- Delete `node_modules` and reinstall
- Ensure Node.js version is 18+

## Development Tips

### Naming Conventions

- **Folders**: Always `kebab-case/`
- **React Components**: `PascalCase.tsx`
- **Other files**: `kebab-case.ts`
- **Backend**: All `kebab-case.ts`

### FSD Rules

Never import upward:
- ✅ `features` can import from `entities` and `shared`
- ❌ `entities` cannot import from `features`

### Idempotency

The backend implements idempotency to prevent double-spending on retries:
- Same `idempotencyKey` returns the same job
- Keys expire after 24 hours

## License

[Your License Here]

## Support

For issues, please open a GitHub issue or contact support.
