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

**Note**: You do NOT need a Runware API key for local development! See setup below.

## 🎯 Professional 3-Environment Setup

This project uses a professional development workflow with **three environments**:

```
┌─────────────────────────────────────────────┐
│ LOCAL (Your Laptop) - USES MOCKS           │
│ ✅ No API keys needed                       │
│ ✅ $0 cost                                  │
│ ✅ Fast (2-second fake AI generation)       │
│ ✅ Works offline                            │
└─────────────────────────────────────────────┘
          ↓ Deploy when ready to test with real AI
┌─────────────────────────────────────────────┐
│ STAGING (Firebase Dev Project)             │
│ ✅ Real Runware API (test credits)          │
│ ✅ Real email                               │
│ ✅ Test before production                   │
└─────────────────────────────────────────────┘
          ↓ Deploy when ready for users
┌─────────────────────────────────────────────┐
│ PRODUCTION (Firebase Prod Project)         │
│ ✅ Live users                               │
│ ✅ Production Runware credits               │
└─────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (LOCAL with Mocks)

This is the **recommended** way to start developing. No API keys needed!

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

### 2. Configure for Mock Mode

The `.env` file is already configured for mock mode:

```bash
# Already configured in functions/.env
USE_MOCK=true
MOCK_GENERATION_DELAY=2000  # 2 seconds (adjust for testing)
```

**That's it!** No API keys needed for local development.

### 3. Run with Firebase Emulators

Terminal 1 - Start Firebase emulators:
```bash
cd functions
npm run serve
```

You'll see:
```
✅ MOCK: Simulating Runware generation
🎨 Using fake AI images (no API calls)
📧 Emails logged to console (not sent)
```

Terminal 2 - Start Next.js dev server:
```bash
npm run dev
```

Visit http://localhost:3000

### 4. Test the Flow

1. Capture a photo from webcam
2. Select a style (e.g., Cyberpunk)
3. Click START
4. **Mock generation completes in 2 seconds** (vs 30+ seconds with real API)
5. View result (random placeholder image)
6. Test Email (logs to console instead of sending)

**Benefits:**
- ✅ Develop without spending $$ on Runware credits
- ✅ Fast iteration (no 30+ second wait for AI)
- ✅ Works offline
- ✅ Predictable results for debugging

---

## 🔧 Staging Setup (Real APIs for Testing)

When you're ready to test with **real** Runware API:

### 1. Get API Keys

- Sign up at https://runware.ai
- Get test API key (separate from production)

### 2. Update Environment

Edit `functions/.env`:
```env
# Switch to real mode
USE_MOCK=false

# Add real credentials
RUNWARE_API_KEY=your_test_api_key_here
FIREBASE_STORAGE_BUCKET=your-staging-project.appspot.com
EMAIL_API_KEY=your_test_email_key
```

### 3. Deploy to Staging Firebase Project

```bash
# Set staging project
firebase use staging

# Deploy
firebase deploy
```

Now test with **real** AI generation before going to production.

---

## 📦 Production Deployment

See full deployment section below.

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
