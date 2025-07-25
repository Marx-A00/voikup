# 📄 Product Requirements Document (PRD)

## Product Name: `Voikup`
**Purpose**: Deliver automated voice calls to help users stay accountable — e.g., wake-up calls, gym reminders, daily goals — using Vapi.ai.

---

## 1. 🎯 Goal

Create a SaaS platform that:
- Lets users schedule recurring voice calls to their phone
- Sends motivating, human-like calls powered by Vapi
- Helps people stay consistent with habits like waking up, going to the gym, or doing hard tasks
- Offers subscription-based monetization

---

## 2. 🧱 Tech Stack

| Layer       | Tech                        |
|------------|-----------------------------|
| Frontend   | Next.js (App Router), TailwindCSS |
| Backend    | tRPC + Next.js API routes    |
| Auth       | Supabase Auth (email magic link) |
| DB         | Prisma + Supabase PostgreSQL |
| Voice API  | Vapi.ai                      |
| Billing    | Stripe                       |
| Cron/Scheduler | Supabase Edge Functions or cron-job.org |
| Deployment | Vercel                       |

---

## 3. 🧑‍💻 User Stories

### 🧍‍♂️ End User
- Sign up/login securely
- Input phone number and preferred call time
- Customize the voice message/script used in the call
- Receive a call at the preferred time daily
- Upgrade or downgrade subscription plan
- View call history and success/failure status
- Pause or cancel subscription

### 🧑‍💼 Admin (you)
- View total users, active calls, call logs
- Trigger test calls
- Toggle HIPAA/TCPA-safe modes (optional)

---

## 4. 📦 Features (MVP)

### ✅ Core Features
- User signup/login via Supabase
- User dashboard to:
  - Set phone number
  - Set call time
  - Customize message
- Outbound call logic using Vapi API
- Stripe billing
- Call logs
- Consent capture (TCPA compliance)

### 🔜 Stretch Goals
- Streak tracker
- SMS fallback reminders
- AI-generated scripts
- Assistant voice customization
- Admin dashboard

---

## 5. 🧩 Data Models

### `User`
```ts
id: string (uuid)
email: string
phoneNumber: string
preferredCallTime: string
script: string
isSubscribed: boolean
stripeCustomerId: string
createdAt, updatedAt
```

### `Call`
```ts
id: string
userId: string (FK)
scheduledFor: DateTime
status: 'pending' | 'completed' | 'failed'
vapiCallId: string
duration: number (optional)
transcript: string (optional)
createdAt, updatedAt
```

---

## 6. 📅 Scheduling Logic

- Cron job runs every minute (or 5 minutes)
- Query users with `preferredCallTime` matching current time
- Create a call using `POST /calls` Vapi API
- Log call data

---

## 7. 🔐 Auth & Security

- Supabase Auth
- Phone numbers validated
- Consent checkbox for legal compliance
- Stripe used for billing access control
- Anonymized logs for HIPAA (optional)

---

## 8. 💵 Billing

- Free trial (3–5 calls)
- $X/month for 1 daily call
- $Y/month for premium
- Stripe integration with webhooks

---

## 9. 📞 Voice Calls via Vapi

- Use Vapi assistant with motivational tone
- Example call:
```ts
POST https://api.vapi.ai/v1/calls
{
  assistantId: "...",
  phoneNumber: "+15551234567",
  metadata: { userId: "..." }
}
```
- Vapi webhook updates call log

---

## 10. 🧪 Dev / Testing

- `.env` values:
  - `VAPI_API_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `STRIPE_SECRET_KEY`

- Local dev: Vercel + Supabase CLI
- Vapi sandbox for test calls

---

## 11. ✅ Acceptance Criteria

| Feature | Criteria |
|--------|----------|
| Signup/Login | User can sign up and access dashboard |
| Phone/Time Setup | Valid input updates schedule |
| Cron + Call Trigger | Calls fire at correct time |
| Stripe | Subscription required for continued use |
| Logs | Call status visible in UI |
| Consent | User must accept before receiving calls |

---

## 12. 📦 Deliverables

- Full T3 app repo
- Supabase schema via Prisma
- Stripe + webhook integration
- Vapi assistant setup
- Scheduler running

---

# 🚀 Voikup Development Phases

## Phase 1: T3 Stack Foundation & Auth (Week 1)
### Goals
- Set up T3 stack infrastructure
- Implement authentication with NextAuth
- Create basic user model with Prisma

### Tasks
- [ ] Initialize T3 app with `npm create t3-app@latest`
  - TypeScript
  - tRPC
  - Prisma
  - NextAuth
  - Tailwind CSS
- [ ] Configure Supabase PostgreSQL connection
- [ ] Set up NextAuth with email provider (magic link)
- [ ] Create User model in Prisma schema
- [ ] Configure tRPC router structure
- [ ] Build login/signup pages
- [ ] Create protected dashboard route with NextAuth middleware
- [ ] Set up environment variables

### Deliverables
- Working T3 stack setup
- Auth flow with NextAuth
- User can sign up and access dashboard
- Database connected via Prisma

---

## Phase 2: User Dashboard & Profile (Week 2)
### Goals
- Build core user experience
- Allow users to configure their calls

### Tasks
- [ ] Create dashboard layout
- [ ] Build phone number input with validation
- [ ] Add preferred call time selector
- [ ] Create custom message/script editor
- [ ] Implement tRPC procedures for user data
- [ ] Add form persistence
- [ ] Use React Query for data fetching

### Deliverables
- Complete user dashboard
- Users can set phone, time, and message
- Data persists via tRPC + Prisma

---

## Phase 3: Vapi Integration (Week 3)
### Goals
- Integrate voice calling functionality
- Test basic outbound calls

### Tasks
- [ ] Set up Vapi account and API keys
- [ ] Create Vapi assistant configuration
- [ ] Build call triggering service
- [ ] Implement Call model in Prisma schema
- [ ] Create tRPC procedures for call management
- [ ] Create manual test call button
- [ ] Add call logging

### Deliverables
- Working Vapi integration
- Ability to trigger test calls
- Call logs stored in database

---

## Phase 4: Scheduling System (Week 4)
### Goals
- Automate call scheduling
- Ensure reliable call delivery

### Tasks
- [ ] Set up cron job (Supabase Edge Functions or cron-job.org)
- [ ] Build scheduling logic
- [ ] Create call queue management
- [ ] Add timezone handling
- [ ] Implement retry logic for failed calls
- [ ] Build call history view

### Deliverables
- Automated calls at scheduled times
- Call history visible in UI
- Reliable scheduling system

---

## Phase 5: Billing Integration (Week 5)
### Goals
- Monetize the product
- Control feature access

### Tasks
- [ ] Set up Stripe account
- [ ] Implement Stripe customer creation
- [ ] Build subscription plans
- [ ] Create billing portal integration
- [ ] Add free trial logic (3-5 calls)
- [ ] Implement feature gating

### Deliverables
- Working payment flow
- Subscription management
- Free trial functionality

---

## Phase 6: Legal & Compliance (Week 6)
### Goals
- Ensure TCPA compliance
- Protect user data

### Tasks
- [ ] Add consent checkbox and flow
- [ ] Create terms of service page
- [ ] Add privacy policy
- [ ] Implement consent storage
- [ ] Add call recording disclaimers
- [ ] Review data handling practices

### Deliverables
- Legal compliance features
- Consent capture system
- Policy pages

---

## Phase 7: Polish & Launch Prep (Week 7)
### Goals
- Improve UX/UI
- Prepare for production

### Tasks
- [ ] Add loading states and error handling
- [ ] Implement proper logging
- [ ] Create admin dashboard (basic)
- [ ] Add monitoring (Sentry/similar)
- [ ] Performance optimization
- [ ] Security audit

### Deliverables
- Production-ready application
- Admin visibility
- Monitoring in place

---

## Phase 8: Stretch Features (Post-Launch)
### Optional Enhancements
- [ ] Streak tracker
- [ ] SMS fallback reminders
- [ ] AI-generated scripts
- [ ] Voice customization
- [ ] Analytics dashboard
- [ ] Mobile app

---

## Key Milestones
1. **End of Phase 2**: Users can configure calls
2. **End of Phase 4**: Automated calls working
3. **End of Phase 5**: Revenue generation possible
4. **End of Phase 7**: Ready for public launch

## Risk Areas
- Vapi API reliability
- Scheduling accuracy
- TCPA compliance
- Stripe webhook handling
- Phone number validation 