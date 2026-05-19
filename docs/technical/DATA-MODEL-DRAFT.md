# Data Model Draft

## Core Entities

### User

- id
- username
- email nullable
- phoneNumber nullable
- passwordHash nullable
- role
- creatorStatus nullable
- createdAt
- lastSeenAt

### AuthIdentity

- id
- userId
- provider
- providerUserId
- createdAt

### GuestSession

- id
- cookieToken
- createdAt
- lastSeenAt
- expiresAt

### AudioTrack

- id
- title
- transcript
- filePath
- level
- accent
- durationSeconds
- createdBy
- isActive
- createdAt
- updatedAt

### Topic

- id
- slug
- name

### AudioTrackTopic

- audioTrackId
- topicId

### PracticeSession

- id
- userId nullable
- guestSessionId nullable
- sessionType
- topicId nullable
- level nullable
- accent nullable
- startedAt
- endedAt nullable

### Attempt

- id
- userId nullable
- guestSessionId nullable
- practiceSessionId nullable
- audioTrackId
- submittedText
- normalizedSubmittedText
- transcriptSnapshot
- accuracyScore
- mistakeCount
- playbackRate
- attemptSource
- createdAt

### ReviewItemState

- id
- userId
- audioTrackId
- attemptCount
- lastAccuracy
- lastAttemptAt
- successStreak
- failureStreak
- priorityScore
- nextReviewAt

### ContributionEvent

- id
- userId nullable
- guestSessionId nullable
- attemptId nullable
- eventType
- symbolicPoints
- realWorldEnergyEstimate nullable
- formulaVersion
- createdAt

### CreatorPermission

- id
- userId
- status
- grantedBy nullable
- createdAt
