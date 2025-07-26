# 📄 Voikup Phase 3: Vapi.ai Voice Integration PRD

**Phase**: 3 - Voice Calling Integration & Testing  
**Duration**: 2-3 weeks  
**Status**: 🟡 Ready to Start (after Phase 2)  
**Last Updated**: January 26, 2025

---

## 🎯 Phase 3 Objectives

Integrate Vapi.ai for voice calling functionality, enable users to trigger test calls, and establish the foundation for call tracking and management. This phase transforms the user profile data from Phase 2 into actual voice calling capabilities.

### Success Criteria
- Voice calls can be triggered manually via Vapi
- Call events are properly tracked via webhooks
- Call history and logs are stored and displayed
- Voice settings are configurable
- All integrations are tested and working reliably

---

## 🏗️ Architecture Overview

### Frontend Components
```
src/app/dashboard/
├── calls/
│   ├── page.tsx           # Call history & logs
│   ├── [id]/page.tsx      # Individual call details
│   └── test/page.tsx      # Test call interface
└── settings/
    ├── voice/page.tsx     # Voice configuration
    └── scripts/page.tsx   # Script management
```

### Backend Structure
```
src/server/api/routers/
├── call.ts         # Call management & Vapi integration
├── vapi.ts         # Vapi-specific operations
└── webhook.ts      # Webhook handlers for call events
```

---

## 📋 Detailed Requirements

### 1. Vapi.ai Integration

#### Setup Requirements
- Vapi account with API key
- Server SDK: `npm install @vapi-ai/server-sdk`
- Phone number configured in Vapi dashboard
- Webhook endpoints for call events

#### Environment Variables
```bash
# Vapi Configuration
VAPI_API_KEY=your_vapi_api_key_here
VAPI_PHONE_NUMBER_ID=your_phone_number_id
VAPI_WEBHOOK_SECRET=your_webhook_secret_for_verification

# Optional: Custom endpoints
VAPI_BASE_URL=https://api.vapi.ai  # Default
```

#### Development & Testing Options
**CLI Alternative:**
```bash
# Install CLI
curl -sSL https://vapi.ai/install.sh | bash

# Login and create assistant
vapi login
vapi assistant create
```

**Dashboard Testing:**
- Test assistants directly in the Vapi dashboard
- Web calling (no phone number required)
- Real-time call monitoring and logs

#### Assistant Configuration
```typescript
interface VapiAssistant {
  id: string;
  name: "Voikup Motivator";
  voice: {
    provider: "11labs" | "playht" | "openai";
    voiceId: string;
    stability?: number;
    similarityBoost?: number;
  };
  model: {
    provider: "openai";
    model: "gpt-4" | "gpt-4-turbo" | "gpt-3.5-turbo";
    temperature: number;
    maxTokens?: number;
  };
  firstMessage: string;
  systemMessage: string; // Updated from 'context'
  endCallFunctionEnabled?: boolean;
  recordingEnabled?: boolean;
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
}
```

#### Call Flow
1. User clicks "Test Call" or scheduler triggers
2. System prepares personalized script
3. API call to Vapi with user's phone number
4. Vapi initiates outbound call
5. Call events tracked via webhooks
6. Call summary and recording saved

#### Webhook Integration
Vapi sends real-time events to track call progress:

```typescript
// Webhook endpoint to handle call events
export async function POST(request: Request) {
  const body = await request.json();
  
  switch (body.message.type) {
    case 'status-update':
      await updateCallStatus(body.message.call.id, body.message.status);
      break;
    case 'transcript':
      await saveTranscript(body.message.call.id, body.message.transcript);
      break;
    case 'function-call':
      // Handle any function calls from the assistant
      break;
    case 'end-of-call-report':
      await saveCallReport(body.message.call.id, body.message);
      break;
  }
  
  return new Response('OK', { status: 200 });
}

interface WebhookCallStatus {
  type: 'status-update';
  call: {
    id: string;
    orgId: string;
    status: 'queued' | 'ringing' | 'in-progress' | 'forwarding' | 'ended';
  };
}
```

#### Vapi API Integration
```typescript
// Install Vapi Server SDK: npm install @vapi-ai/server-sdk
import Vapi from '@vapi-ai/server-sdk';

const vapi = new Vapi({
  token: process.env.VAPI_API_KEY!,
});

// Example call initiation
async function initiateCall(userId: string, phoneNumber: string) {
  const user = await getUserWithPreferences(userId);
  const script = interpolateScript(user.script, user);
  
  try {
    const call = await vapi.calls.create({
      assistant: {
        firstMessage: script,
        model: {
          provider: 'openai',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 250,
        },
        voice: {
          provider: '11labs',
          voiceId: user.preferences?.voiceId || 'rachel',
        },
        systemMessage: `You are a motivational accountability assistant helping ${user.name || 'the user'} stay on track with their goals.`,
        recordingEnabled: true,
        silenceTimeoutSeconds: 30,
        maxDurationSeconds: 300, // 5 minutes max
      },
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID!,
      customer: {
        number: phoneNumber,
      },
      metadata: {
        userId: user.id,
        callType: 'scheduled',
        timestamp: new Date().toISOString(),
      },
    });

    console.log('Outbound call initiated:', call.id);
    return call;
  } catch (error) {
    console.error('Error making outbound call:', error);
    throw error;
  }
}

// Alternative using assistantId for pre-created assistants
async function initiateCallWithAssistant(userId: string, phoneNumber: string, assistantId: string) {
  try {
    const call = await vapi.calls.create({
      assistantId: assistantId,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID!,
      customer: {
        number: phoneNumber,
      },
      metadata: {
        userId: userId,
        callType: 'scheduled',
      },
    });

    return call;
  } catch (error) {
    console.error('Error making outbound call:', error);
    throw error;
  }
}
```

### 2. Database Schema Extensions

```prisma
model UserPreference {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  voiceId         String   @default("rachel")
  voiceProvider   String   @default("11labs")
  callDuration    Int      @default(60) // seconds
  enableRecording Boolean  @default(true)
  enableSms       Boolean  @default(false)
  
  // Scheduling preferences
  daysOfWeek      Int[]    @default([1,2,3,4,5]) // Mon-Fri
  skipHolidays    Boolean  @default(true)
  snoozeEnabled   Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Call {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  
  scheduledFor    DateTime
  initiatedAt     DateTime?
  answeredAt      DateTime?
  endedAt         DateTime?
  duration        Int?      // seconds
  
  status          CallStatus
  vapiCallId      String?   @unique
  vapiCallUrl     String?
  costInCents     Int?
  
  script          String    @db.Text
  transcript      String?   @db.Text
  recordingUrl    String?
  
  metadata        Json?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId, scheduledFor])
  @@index([status])
}

model CallTemplate {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  name        String
  script      String   @db.Text
  category    String   // "wakeup", "gym", "productivity", "custom"
  isDefault   Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([userId, name])
}

enum CallStatus {
  SCHEDULED
  QUEUED
  RINGING
  IN_PROGRESS
  FORWARDING
  ENDED
  FAILED
  NO_ANSWER
  CANCELLED
}
```

### 3. Call History & Analytics

#### Call Record Schema
```typescript
interface CallRecord {
  id: string;
  userId: string;
  scheduledFor: Date;
  initiatedAt: Date;
  answeredAt?: Date;
  endedAt?: Date;
  duration?: number;
  status: 'scheduled' | 'queued' | 'ringing' | 'in-progress' | 'ended' | 'failed' | 'no-answer';
  vapiCallId: string;
  vapiCallUrl?: string;
  costInCents?: number;
  transcript?: string;
  recording?: {
    url: string;
    duration: number;
  };
  metadata: {
    scriptUsed: string;
    voiceUsed: string;
    phoneNumber: string;
  };
}
```

#### Call History UI
- **List View**:
  - Date/time of call
  - Status badge (answered/missed)
  - Duration
  - Quick play recording button
  - Transcript preview
- **Detail View**:
  - Full transcript
  - Audio player for recording
  - Call timeline
  - Cost breakdown
  - Script used

### 4. tRPC Router Implementations

#### Call Router
```typescript
export const callRouter = createTRPCRouter({
  initiateTestCall: protectedProcedure
    .input(z.object({
      script: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Trigger immediate test call via Vapi
    }),
    
  getCallHistory: protectedProcedure
    .input(z.object({
      limit: z.number().default(10),
      offset: z.number().default(0),
      status: z.enum(['all', 'completed', 'failed']).default('all'),
    }))
    .query(async ({ ctx, input }) => {
      // Fetch paginated call history
    }),
    
  getCallDetails: protectedProcedure
    .input(z.object({
      callId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      // Fetch detailed call information
    }),
    
  cancelScheduledCall: protectedProcedure
    .input(z.object({
      callId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Cancel a scheduled call
    }),
});
```

#### Vapi Router
```typescript
export const vapiRouter = createTRPCRouter({
  createAssistant: protectedProcedure
    .input(z.object({
      name: z.string(),
      voiceId: z.string(),
      script: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Create Vapi assistant
    }),
    
  updateVoiceSettings: protectedProcedure
    .input(z.object({
      voiceId: z.string(),
      provider: z.enum(['11labs', 'playht', 'openai']),
      stability: z.number().optional(),
      similarityBoost: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Update voice preferences
    }),
});
```

### 5. Security & Privacy

#### Vapi Security Considerations
- Webhook signature verification using VAPI_WEBHOOK_SECRET
- API key protection in environment variables
- Rate limiting to prevent abuse
- Call metadata sanitization

#### Call Recording Privacy
- User consent required
- Automatic deletion after 30 days
- Download option for users
- GDPR compliance

### 6. Cost Management & Limitations

#### Vapi Pricing Considerations
- Per-minute billing for calls
- Different rates for inbound vs outbound
- Additional costs for premium voices (11labs)
- Free tier limitations for development

#### Usage Monitoring
- Track call duration and costs
- Set user limits to prevent overuse
- Monitor API rate limits
- Alert on unusual usage patterns

### 7. Testing Requirements

#### Unit Tests
- Vapi API integration mocking
- Call status flow validation
- Webhook event processing
- Script interpolation logic

#### Integration Tests
- End-to-end call flows
- Webhook delivery and processing
- Database call record creation
- Error handling scenarios

#### E2E Tests
- Complete test call flow
- Voice settings persistence
- Recording playback
- Call history accuracy

---

## 📅 Implementation Timeline

### Week 1: Vapi Integration Foundation
**Days 1-2: Vapi Setup**
- Set up Vapi account and API credentials
- Install SDK and configure environment
- Create basic assistant configuration
- Test API connectivity

**Days 3-4: Database Extensions**
- Add Call, CallTemplate, UserPreference models
- Create database migrations
- Update Prisma client
- Test data relationships

**Days 5-7: Basic Call Integration**
- Implement call initiation API
- Create webhook endpoints
- Test basic call flow
- Handle call status updates

### Week 2: Call Management & History
**Days 8-9: Call History UI**
- Build call history list view
- Create call detail pages
- Implement pagination
- Add call status badges

**Days 10-11: Recording & Transcripts**
- Implement recording playback
- Display call transcripts
- Add download functionality
- Handle recording storage

**Days 12-14: Voice Configuration**
- Build voice settings UI
- Implement voice selection
- Create script templates
- Test voice configurations

### Week 3: Testing & Polish
**Days 15-16: Testing**
- Write comprehensive tests
- Test error scenarios
- Validate webhook reliability
- Performance testing

**Days 17-18: Security & Privacy**
- Implement webhook verification
- Add call consent features
- Security audit
- Privacy compliance review

**Days 19-21: Documentation & Preparation**
- API documentation
- Vapi configuration guide
- Testing documentation
- Phase 4 preparation

---

## 🚧 Risk Mitigation

### Technical Risks
1. **Vapi API Reliability**
   - Implement retry logic
   - Monitor service status
   - Have fallback options
   - Cache configurations

2. **Webhook Delivery**
   - Implement retry mechanisms
   - Store webhook events
   - Handle duplicate events
   - Monitor webhook health

3. **Call Quality Issues**
   - Test with multiple voice providers
   - Monitor call completion rates
   - Implement quality metrics
   - User feedback collection

### Business Risks
1. **Cost Overruns**
   - Monitor usage closely
   - Set spending limits
   - Implement user quotas
   - Cost alerting system

2. **User Experience**
   - Comprehensive testing
   - Clear error messages
   - Intuitive call controls
   - Responsive support

---

## ✅ Acceptance Criteria

### Must Have
- [ ] Test calls working reliably via Vapi
- [ ] Call status tracking and webhooks functioning
- [ ] Basic call history with playback
- [ ] Voice settings configurable
- [ ] Error handling and fallbacks working

### Should Have
- [ ] Call recordings with transcript display
- [ ] Multiple voice provider support
- [ ] Call cost tracking and display
- [ ] Template script management
- [ ] Webhook signature verification

### Nice to Have
- [ ] Real-time call status updates
- [ ] Advanced voice customization
- [ ] Call analytics and insights
- [ ] A/B testing for scripts
- [ ] Call scheduling preview

---

## 📊 Success Metrics

### Technical Metrics
- Call success rate > 95%
- Webhook delivery rate > 99%
- API response time < 500ms
- Zero data loss

### User Metrics
- 90% successful test calls
- < 5% call failures
- 85% user satisfaction
- 80% feature adoption

---

## 🔗 Dependencies

### External Services
- Vapi.ai API access and phone number
- 11labs/PlayHT for premium voices
- Webhook endpoint accessibility
- SSL certificates for webhooks

### Internal Dependencies
- Phase 2 completion (User Dashboard & Profile)
- Database schema ready
- User phone verification
- Basic dashboard functionality

---

## 📝 Notes & Considerations

1. **Vapi Limitations**: Be aware of rate limits and concurrent call limits
2. **International Calling**: Consider additional costs and regulations
3. **Call Recording Laws**: Ensure compliance with local recording laws
4. **Voice Quality**: Test extensively with different voice providers
5. **Scalability**: Design for growth in call volume
6. **Monitoring**: Implement comprehensive logging and monitoring

---

## 🎯 Phase 3 Completion Checklist

- [ ] Vapi integration tested and working
- [ ] Call initiation via dashboard functional
- [ ] Webhook events processing correctly
- [ ] Call history displaying accurately
- [ ] Voice settings saving and applying
- [ ] Recording playback working
- [ ] Error handling comprehensive
- [ ] Security measures implemented
- [ ] Cost tracking functional
- [ ] Documentation complete
- [ ] Ready for Phase 4 (Scheduling) 