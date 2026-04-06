# Quick Start Guide - Practice Feature

## What Was Implemented

A complete backend API and admin management system for the Practice feature with AI-powered evaluation.

## Quick Setup (5 minutes)

### 1. Seed Database
```bash
cd backend
npm install  # if needed
node seed.js
```

### 2. Start Backend
```bash
npm start
# Server should run on http://localhost:8080
```

### 3. Access Admin Dashboard
- Navigate to: `http://localhost:8080/admin.html`
- Login: `admin@admin.com` / `admin123`
- Click "Practice" in navigation

### 4. Create Practice Resources (Optional)
In admin dashboard:
- Go to "Simulations" tab → Click "New Simulation" → Fill form → Save
- Go to "Debate Topics" tab → Click "New Topic" → Fill form → Save
- Go to "Policy Guidance" tab → Click "New Guidance" → Fill form → Save

## Frontend Integration (For Vue App)

### Step 1: Create API Composable
Create `civichernaija-frontend/composables/usePracticeAPI.ts`:

```typescript
import { ref } from 'vue';

const API_BASE = 'http://localhost:8080/api';

export function usePracticeAPI() {
  const userToken = localStorage.getItem('token');

  async function getSimulationResources() {
    const response = await fetch(`${API_BASE}/practice/resources?type=simulation`);
    return await response.json();
  }

  async function getDebateResources() {
    const response = await fetch(`${API_BASE}/practice/resources?type=debateTopic`);
    return await response.json();
  }

  async function submitSimulation(resourceId, option, reason) {
    const response = await fetch(`${API_BASE}/practice/submit/simulation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ resourceId, option, reason })
    });
    return await response.json();
  }

  async function submitDebate(resourceId, topicIndex, response, timeSpent) {
    const res = await fetch(`${API_BASE}/practice/submit/debate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ resourceId, topicIndex, response, timeSpent })
    });
    return await res.json();
  }

  async function submitPolicy(title, problem, proposal) {
    const response = await fetch(`${API_BASE}/practice/submit/policy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ title, problem, proposal })
    });
    return await response.json();
  }

  async function getUserSubmissions() {
    const response = await fetch(`${API_BASE}/practice/submissions`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    return await response.json();
  }

  return {
    getSimulationResources,
    getDebateResources,
    submitSimulation,
    submitDebate,
    submitPolicy,
    getUserSubmissions
  };
}
```

### Step 2: Update Practice Page
In `civichernaija-frontend/pages/practice/index.vue`, in the `<script setup>`:

```typescript
import { onMounted, ref } from 'vue';
import { usePracticeAPI } from '~/composables/usePracticeAPI';

const { usePracticeAPI } = useToast();
const { 
  getSimulationResources, 
  getDebateResources,
  submitSimulation,
  submitDebate,
  submitPolicy 
} = usePracticeAPI();

// Load resources
const simulationResources = ref([]);
const debateResources = ref([]);
const currentSimulation = ref(null);

onMounted(async () => {
  simulationResources.value = await getSimulationResources();
  debateResources.value = await getDebateResources();
  if (simulationResources.value.length > 0) {
    currentSimulation.value = simulationResources.value[0];
  }
});

// Update submitSimulation function:
const submitSimulation = async () => {
  if (!selectedOption.value) {
    showError('Select one option before submitting.');
    return;
  }
  if (!simulationReason.value.trim()) {
    showError('Add your reasoning.');
    return;
  }

  try {
    const result = await submitSimulation(
      currentSimulation.value._id,
      selectedOption.value,
      simulationReason.value
    );
    showSuccess('Simulation submitted! Your response is being evaluated.');
    simulationReason.value = '';
    selectedOption.value = '';
  } catch (err) {
    showError('Error: ' + err.message);
  }
};

// Similar updates for debate and policy...
```

## Files Created/Modified

### Created
- `backend/models/PracticeSubmission.js`
- `backend/models/PracticeResource.js`
- `backend/routes/practice.js`
- `backend/public/manage-practice.html`
- `PRACTICE_API.md` - Complete API documentation
- `FRONTEND_INTEGRATION.md` - Frontend integration guide
- `PRACTICE_IMPLEMENTATION.md` - Full implementation details

### Modified
- `backend/server.js` - Added practice routes
- `backend/gemini-start.js` - Added AI evaluation function
- `backend/routes/admin.js` - Added practice management endpoints
- `backend/seed.js` - Added default practice resources
- `backend/public/admin.html` - Added Practice nav link

## Key Features

### For Users
✅ Submit simulation scenarios and get evaluation  
✅ Participate in structured debates on governance  
✅ Write policy proposals and receive AI feedback  
✅ View evaluation scores, feedback, strengths, and improvement areas  
✅ Track practice statistics

### For Admins
✅ Create and manage simulations
✅ Add debate topics for practice  
✅ Create policy writing guidance  
✅ Toggle resources active/inactive  
✅ View user submissions and evaluations  
✅ Monitor practice analytics

### AI-Powered Evaluation
✅ Automatic async evaluation using Gemini  
✅ Context-aware prompts for each submission type  
✅ Scores, feedback, strengths, improvement areas  
✅ Non-blocking (evaluation happens in background)

## Testing

### 1. Test Admin Dashboard
```
http://localhost:8080/manage-practice.html
```

### 2. Test User Submission (CLI)
```bash
curl -X POST http://localhost:8080/api/practice/submit/simulation \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resourceId": "RESOURCE_ID_HERE",
    "option": "borehole-now",
    "reason": "Because clean water is essential for health"
  }'
```

### 3. Check Evaluation Status
Wait 3-5 seconds, then:
```bash
curl -X GET http://localhost:8080/api/practice/submissions/SUBMISSION_ID \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

You should see:
```json
{
  "evaluationStatus": "completed",
  "aiEvaluation": {
    "score": 85,
    "feedback": "Your reasoning...",
    "strengths": [...],
    "areasForImprovement": [...],
    "suggestedNextSteps": [...]
  }
}
```

## API Endpoints at a Glance

```
# User endpoints (all require auth)
POST   /api/practice/submit/simulation
POST   /api/practice/submit/debate
POST   /api/practice/submit/policy
GET    /api/practice/resources?type=simulation
GET    /api/practice/submissions
GET    /api/practice/submissions/:id

# Admin endpoints (require admin role)
GET    /api/admin/practice-resources
POST   /api/admin/practice-resources/simulation
PUT    /api/admin/practice-resources/:id
DELETE /api/admin/practice-resources/:id
GET    /api/admin/practice-analytics
```

## Default Seed Data

After running `node seed.js`, you'll have:

**1 Simulation**:
- Budget allocation scenario (N10 million for water vs school)
- 3 response options

**3 Debate Topics**:
- Parliamentary vs Presidential system
- Mandatory civic education
- Reserved leadership seats for women/youth

**1 Policy Guidance**:
- Framework for policy proposal writing

## Environment Requirements

```
.env variables needed:
- MONGO_URI (MongoDB connection)
- API_KEY or GEMINI_API_KEY (Google Gemini API)
- JWT_SECRET (for token signing)
- PORT (default 8080)
```

## Common Issues & Solutions

### "Evaluation stays pending"
- Check Google API key is valid
- Check MongoDB connection
- Wait 5-10 seconds (Gemini API may be slow)

### "401 Unauthorized"
- Verify JWT token is valid
- Check token is in Authorization header
- Token format: `Bearer {token}`

### "400 Bad Request"
- Check all required fields are provided
- Verify field types match API docs
- Check JSON is valid

### Resources not showing in admin
- Run `node seed.js` to create defaults
- Check resources have `isActive: true`
- Verify MongoDB has data: `db.practiceresources.find()`

## Next Steps

1. ✅ Backend API complete
2. ✅ Admin dashboard complete  
3. ⏳ Integrate frontend Vue component
4. ⏳ Add user submission history page
5. ⏳ Create practice certificates
6. ⏳ Add leaderboards

## Support

For detailed information, see:
- `PRACTICE_API.md` - Full API reference
- `PRACTICE_IMPLEMENTATION.md` - Technical details
- `FRONTEND_INTEGRATION.md` - Frontend guide
