# 📄 Voikup Phase 2: User Dashboard & Basic Profile PRD

**Phase**: 2 - Core Dashboard & User Profile  
**Duration**: 1-2 weeks  
**Status**: 🟡 Ready to Start  
**Last Updated**: January 26, 2025

---

## 🎯 Phase 2 Objectives

Build a basic user dashboard with navigation structure and user profile management. This phase focuses on creating the dashboard foundation and basic profile features - all voice/call related features are deferred to Phase 3.

### Success Criteria
- Dashboard layout with navigation is implemented
- Users can view and edit their basic profile (name, email)
- Settings page structure is in place for future features
- UI/UX is intuitive and responsive across all devices
- All profile data persists correctly in the database

---

## 🏗️ Architecture Overview

### Frontend Components
```
src/app/
├── dashboard/
│   ├── layout.tsx          # Dashboard wrapper with navigation
│   ├── page.tsx           # Main dashboard overview
│   ├── settings/
│   │   └── page.tsx       # Settings placeholder page
│   └── profile/
│       └── page.tsx       # User profile page
```

### Backend Structure
```
src/server/api/routers/
└── user.ts         # Extended user management for basic profile
```

---

## 📋 Detailed Requirements

### 1. User Dashboard Layout

#### Navigation Sidebar
- **Home/Overview**: Welcome page with user info
- **Profile**: Basic user information management
- **Settings**: Placeholder for future settings
- **Billing**: Subscription status (placeholder for Phase 5)

#### Dashboard Overview Page
- Welcome message with user's name
- Profile completion status
- Quick links to profile and settings
- Placeholder cards for future features

### 2. User Profile Management

#### Profile Data Structure
```typescript
interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Profile Configuration UI
- **Personal Information**:
  - Display name (editable)
  - Email (read-only, from auth)
  - Account creation date
  - Last login time

### 3. Database Schema Updates

```prisma
// Extend existing User model with basic profile field
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String?   // Only basic profile field for Phase 2
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Existing auth relations
  accounts Account[]
  sessions Session[]
  posts    Post[]
}

// Note: Phone, call preferences, and other fields will be added in Phase 3
```

#### Migration Strategy
1. Extend existing User model with name field (nullable)
2. Ensure all existing users remain functional
3. No breaking changes to existing auth system

### 4. tRPC Router Implementations

#### User Router Extensions
```typescript
export const userRouter = createTRPCRouter({
  // Existing procedures...
  
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Update user profile fields
      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),
    
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      // Get basic user profile
      return await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),
});
```

### 5. UI/UX Requirements

#### Design System
- **Colors**:
  - Primary: HSL(280, 100%, 70%) - Purple
  - Success: Green for successful validation
  - Warning: Yellow for warnings/pending states
  - Error: Red for validation errors
  - Neutral: Gray scale for secondary content
- **Components**:
  - Card-based layout for dashboard sections
  - Smooth transitions and micro-animations
  - Loading skeletons for data fetching
  - Toast notifications for user feedback
  - Modal dialogs for confirmations

#### Dashboard Layout
- **Navigation Sidebar**:
  - Dashboard overview
  - Profile
  - Settings (placeholder)
  - Billing (placeholder)
  
- **Main Content Area**:
  - Welcome header with user name
  - Profile completion status
  - Quick links to key pages
  - Placeholder for future features

#### Responsive Design
- Mobile-first approach with breakpoints
- Collapsible sidebar on mobile devices
- Touch-friendly controls and tap targets
- Optimized forms for mobile input
- Horizontal scrolling for time pickers

#### Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators for all controls

### 6. Security & Privacy

#### Profile Data Security
- Secure session management with NextAuth
- Input validation on all form fields
- SQL injection prevention with Prisma
- XSS protection with proper sanitization


#### Data Privacy
- GDPR-compliant data handling
- User control over profile data
- Clear privacy policy regarding data usage
- Option to delete profile data

#### Form Security
- CSRF protection on all mutations
- Rate limiting on profile updates
- Input sanitization and validation
- Secure password handling (handled by NextAuth)

### 7. Testing Requirements

#### Unit Tests
- Profile update validation
- Form validation functions
- Profile data transformations

#### Integration Tests
- tRPC procedure testing
- Database operations with Prisma
- Authentication flows with NextAuth
- Profile data persistence
- Form submission workflows

#### E2E Tests
- Complete profile setup flow
- Dashboard navigation
- Mobile responsiveness across devices
- Error handling and user feedback

### 8. Performance Considerations

#### Optimization Targets
- Dashboard load time < 2s
- Form interactions feel instant (<100ms)
- Profile data fetching < 500ms
- Mobile performance optimization
- Smooth animations and transitions

#### Caching Strategy
- User profile data with React Query
- Form state management
- Timezone data caching
- Component-level optimization with React.memo
- Image optimization for mobile

---

## 📅 Implementation Timeline

### Week 1: Foundation & Profile
**Day 1: Database Schema**
- Extend User model with name field
- Create migration and test
- Update Prisma client

**Days 2-3: Dashboard Layout**
- Set up dashboard layout component
- Implement responsive navigation sidebar
- Create route structure
- Add loading states and error boundaries

**Days 4-5: Profile Management**
- Build profile page
- Create profile edit form
- Implement profile data persistence
- Add form validation

**Days 6-7: Settings & Polish**
- Create settings placeholder page
- Implement design system
- Add animations and transitions
- Mobile responsiveness

### Week 2: Testing & Documentation
**Days 8-9: Testing**
- Write unit tests
- Create integration tests
- Manual QA testing
- Fix bugs

**Days 10: Documentation**
- Document components
- Update API docs
- Deployment prep

---

## 🚧 Risk Mitigation

### Technical Risks
1. **Migration Issues**
   - Test schema changes thoroughly
   - Backup existing data
   - Rollback plan ready

2. **Performance**
   - Optimize queries
   - Implement caching
   - Monitor load times

### Business Risks
1. **User Adoption**
   - Intuitive onboarding
   - Clear navigation
   - Helpful placeholders

---

## ✅ Acceptance Criteria

### Must Have
- [ ] Dashboard layout with navigation implemented
- [ ] Users can view and update their name
- [ ] Profile page displays user information
- [ ] Dashboard is fully responsive on mobile and desktop
- [ ] All profile data persists across sessions

### Should Have
- [ ] Profile completion indicator
- [ ] Form validation with clear error messages
- [ ] Loading states and smooth transitions
- [ ] Settings page placeholder

### Nice to Have
- [ ] Keyboard shortcuts for navigation
- [ ] Profile picture placeholder
- [ ] Activity history placeholder

---

## 📊 Success Metrics

### Technical Metrics
- Dashboard load time < 2s
- Form submission response < 300ms
- Zero data loss on profile updates
- Mobile performance score > 90

### User Metrics
- 90% complete basic profile setup
- < 1 min to update profile name
- 95% user satisfaction with dashboard UX
- < 2% form abandonment rate

---

## 🔗 Dependencies

### External Services
- None required for Phase 2

### Internal Dependencies
- Phase 1 completion (Auth & Foundation)
- Database migrations working
- tRPC setup complete

---

## 📝 Notes & Considerations

1. **Simplicity**: Keep Phase 2 focused on basic dashboard structure
2. **Placeholders**: Create clear placeholders for Phase 3 features
3. **User Experience**: Ensure smooth navigation and intuitive layout
4. **Scalability**: Design dashboard structure to accommodate future features

---

## 🎯 Phase 2 Completion Checklist

- [ ] Dashboard layout with navigation implemented
- [ ] Database schema extended with name field
- [ ] User profile page working
- [ ] Profile edit functionality complete
- [ ] Settings page placeholder created
- [ ] Mobile responsive design complete
- [ ] tRPC procedures tested and working
- [ ] Basic testing completed
- [ ] Documentation updated
- [ ] Ready for Phase 3 (Voice Integration)