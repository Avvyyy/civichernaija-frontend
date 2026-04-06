<template>
  <div class="practice-page container">
    <section class="header">
      <h2>Practice &amp; Empower</h2>
      <p>Sharpen your leadership skills through interactive exercises.</p>
    </section>

    <div class="tabs" role="tablist" aria-label="Practice sections">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <section v-if="latestSubmission" class="feedback-panel" :class="latestSubmission.evaluationStatus">
      <div class="feedback-head">
        <h3>AI Feedback</h3>
        <button class="btn-secondary" @click="refreshLatestFeedback" :disabled="refreshingFeedback">
          {{ refreshingFeedback ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>

      <p class="feedback-meta">
        Type: <strong>{{ latestSubmission.submissionType }}</strong>
        <span>•</span>
        Status: <strong>{{ latestSubmission.evaluationStatus }}</strong>
      </p>

      <div v-if="latestSubmission.evaluationStatus === 'pending'" class="feedback-body">
        <p>Your response has been submitted. AI evaluation is in progress. This usually takes a few seconds.</p>
      </div>

      <div v-else-if="latestSubmission.evaluationStatus === 'failed'" class="feedback-body">
        <p>Evaluation failed for this submission. You can submit again or refresh to retry checking.</p>
        <p v-if="latestSubmission.evaluationError" class="failure-reason">
          Reason: {{ latestSubmission.evaluationError }}
        </p>
      </div>

      <div v-else-if="latestSubmission.aiEvaluation" class="feedback-body">
        <p class="score">Score: {{ Math.round(latestSubmission.aiEvaluation.score) }}/100</p>
        <p>{{ latestSubmission.aiEvaluation.feedback }}</p>

        <div v-if="latestSubmission.aiEvaluation.strengths?.length">
          <h4>Strengths</h4>
          <ul>
            <li v-for="(item, idx) in latestSubmission.aiEvaluation.strengths" :key="`s-${idx}`">{{ item }}</li>
          </ul>
        </div>

        <div v-if="latestSubmission.aiEvaluation.areasForImprovement?.length">
          <h4>Areas To Improve</h4>
          <ul>
            <li v-for="(item, idx) in latestSubmission.aiEvaluation.areasForImprovement" :key="`i-${idx}`">{{ item }}</li>
          </ul>
        </div>

        <div v-if="latestSubmission.aiEvaluation.suggestedNextSteps?.length">
          <h4>Suggested Next Steps</h4>
          <ul>
            <li v-for="(item, idx) in latestSubmission.aiEvaluation.suggestedNextSteps" :key="`n-${idx}`">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="submission-history card-shell">
      <div class="section-head">
        <div>
          <h3>My Submissions</h3>
          <p>Open any previous practice attempt to see the current AI result.</p>
        </div>
        <button class="btn-secondary" @click="loadSubmissionHistory" :disabled="refreshingHistory">
          {{ refreshingHistory ? 'Refreshing...' : 'Refresh List' }}
        </button>
      </div>

      <div v-if="submissionHistory.length === 0" class="empty-state compact">
        <p>No submissions yet. Submit a practice exercise to see it here.</p>
      </div>

      <div v-else class="history-grid">
        <button
          v-for="submission in submissionHistory"
          :key="submission._id"
          class="history-item"
          :class="{ active: selectedSubmissionId === submission._id }"
          @click="selectSubmission(submission._id)"
        >
          <div class="history-item-top">
            <strong>{{ submission.submissionType }}</strong>
            <span class="history-badge" :class="submission.evaluationStatus">{{ submission.evaluationStatus }}</span>
          </div>
          <p v-if="submission.aiEvaluation?.score !== undefined">Score: {{ Math.round(submission.aiEvaluation.score) }}/100</p>
          <p v-else>Awaiting score</p>
          <small>{{ formatSubmissionDate(submission.createdAt) }}</small>
        </button>
      </div>
    </section>

    <section v-if="selectedSubmission" class="submission-detail card-shell">
      <div class="section-head">
        <div>
          <h3>Submission Detail</h3>
          <p>Review the grade and feedback for this attempt.</p>
        </div>
        <button
          class="btn-secondary"
          @click="refreshSubmissionDetail"
          :disabled="refreshingSubmission"
        >
          {{ refreshingSubmission ? 'Checking...' : 'Retry Check' }}
        </button>
      </div>

      <p class="feedback-meta">
        Type: <strong>{{ selectedSubmission.submissionType }}</strong>
        <span>•</span>
        Status: <strong>{{ selectedSubmission.evaluationStatus }}</strong>
        <span v-if="selectedSubmission.evaluationError">•</span>
        <strong v-if="selectedSubmission.evaluationError" class="failure-label">{{ selectedSubmission.evaluationError }}</strong>
      </p>

      <div v-if="selectedSubmission.evaluationStatus === 'pending'" class="feedback-body">
        <p>This submission is still being evaluated. Use Retry Check to refresh the status.</p>
      </div>

      <div v-else-if="selectedSubmission.evaluationStatus === 'failed'" class="feedback-body">
        <p>This submission failed evaluation. Use Retry Check after an admin re-evaluates it.</p>
      </div>

      <div v-else-if="selectedSubmission.aiEvaluation" class="feedback-body">
        <p class="score">Score: {{ Math.round(selectedSubmission.aiEvaluation.score) }}/100</p>
        <p>{{ selectedSubmission.aiEvaluation.feedback }}</p>

        <div v-if="selectedSubmission.aiEvaluation.strengths?.length">
          <h4>Strengths</h4>
          <ul>
            <li v-for="(item, idx) in selectedSubmission.aiEvaluation.strengths" :key="`detail-s-${idx}`">{{ item }}</li>
          </ul>
        </div>

        <div v-if="selectedSubmission.aiEvaluation.areasForImprovement?.length">
          <h4>Areas To Improve</h4>
          <ul>
            <li v-for="(item, idx) in selectedSubmission.aiEvaluation.areasForImprovement" :key="`detail-i-${idx}`">{{ item }}</li>
          </ul>
        </div>

        <div v-if="selectedSubmission.aiEvaluation.suggestedNextSteps?.length">
          <h4>Suggested Next Steps</h4>
          <ul>
            <li v-for="(item, idx) in selectedSubmission.aiEvaluation.suggestedNextSteps" :key="`detail-n-${idx}`">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="activeTab === 'simulations'" class="tab-panel">
      <div v-if="loadingResources" class="loading-state">
        <p>Loading simulations...</p>
      </div>
      <div v-else-if="simulationResources.length === 0" class="empty-state">
        <p>No simulations available at the moment. Check back soon!</p>
      </div>
      <div v-else>
        <article class="scenario-card">
          <span class="topic-pill">Scenario {{ currentSimulationIndex + 1 }} of {{ simulationResources.length }}</span>
          <h3>{{ currentSimulation?.simulationScenario }}</h3>
          <p v-if="currentSimulation?.simulationContext" class="context">
            {{ currentSimulation.simulationContext }}
          </p>
        </article>

        <div class="options-grid">
          <label 
            v-for="opt in currentSimulation?.simulationOptions || []" 
            :key="opt.id" 
            class="option-item" 
            :class="{ selected: selectedOption === opt.id }"
          >
            <input type="radio" name="scenario-choice" :value="opt.id" v-model="selectedOption" />
            <div>
              <strong>{{ opt.title }}</strong>
              <p>{{ opt.description }}</p>
            </div>
          </label>
        </div>

        <textarea
          v-model="simulationReason"
          rows="5"
          placeholder="Explain your decision clearly and confidently..."
        ></textarea>

        <button 
          class="btn-primary submit-btn" 
          @click="submitSimulation"
          :disabled="submittingSimulation || isLoading"
        >
          {{ submittingSimulation ? 'Submitting...' : 'Submit Simulation Response' }}
        </button>
      </div>
    </section>

    <section v-else-if="activeTab === 'mockDebate'" class="tab-panel">
      <div v-if="loadingResources" class="loading-state">
        <p>Loading debate topics...</p>
      </div>
      <div v-else-if="debateResources.length === 0" class="empty-state">
        <p>No debate topics available at the moment. Check back soon!</p>
      </div>
      <div v-else>
        <article class="scenario-card">
          <div class="debate-top-row">
            <span class="topic-pill">Topic {{ currentDebateIndex + 1 }} of {{ debateResources.length }}</span>
            <span class="timer">{{ formattedTime }}</span>
          </div>
          <h3>{{ debateResources[currentDebateIndex]?.debateTopic }}</h3>
          <p v-if="debateResources[currentDebateIndex]?.debateContext" class="context">
            {{ debateResources[currentDebateIndex].debateContext }}
          </p>
        </article>

        <textarea
          v-model="debateResponse"
          rows="7"
          placeholder="Share your argument. Be bold and clear."
        ></textarea>

        <div class="debate-actions">
          <button class="btn-secondary control-btn" @click="startTimer" :disabled="isRunning || submittingDebate">Start Timer</button>
          <button class="btn-secondary control-btn" @click="stopTimer" :disabled="!isRunning || submittingDebate">Stop Timer</button>
          <button class="btn-secondary control-btn" @click="resetTimer" :disabled="submittingDebate">Reset</button>
          <button 
            class="btn-primary" 
            @click="submitDebate"
            :disabled="submittingDebate || isLoading"
          >
            {{ submittingDebate ? 'Submitting...' : 'Submit Response' }}
          </button>
        </div>
      </div>
    </section>

    <section v-else class="tab-panel">
      <div v-if="loadingResources" class="loading-state">
        <p>Loading policy guidance...</p>
      </div>
      <div v-else>
        <article class="scenario-card">
          <span class="topic-pill">Policy Draft</span>
          <h3>{{ currentPolicyGuidance?.policyGuidanceTitle || 'Draft a Policy Proposal' }}</h3>
          <p>
            {{ currentPolicyGuidance?.policyGuidanceContent || 'Think about a problem in your community. Write a short policy proposal to address it.' }}
          </p>
        </article>

        <div class="policy-fields">
          <input
            v-model="policyTitle"
            type="text"
            placeholder="Policy title (example: Safer Roads Initiative)"
            :disabled="submittingPolicy"
          />
          <textarea
            v-model="policyProblem"
            rows="3"
            placeholder="What problem are you trying to solve?"
            :disabled="submittingPolicy"
          ></textarea>
          <textarea
            v-model="policyProposal"
            rows="6"
            placeholder="Describe your proposed policy, who it affects, and how it will be implemented."
            :disabled="submittingPolicy"
          ></textarea>
        </div>

        <button
          class="btn-primary submit-btn"
          @click="submitPolicy"
          :disabled="submittingPolicy || isLoading"
        >
          {{ submittingPolicy ? 'Submitting...' : 'Submit Draft' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, onMounted, watch } from 'vue';
import { usePracticeAPI } from '~/composables/usePracticeAPI';

const { error: showError, success: showSuccess } = useToast();
const {
  isLoading,
  getAllPracticeResources,
  submitSimulation: apiSubmitSimulation,
  submitDebate: apiSubmitDebate,
  submitPolicy: apiSubmitPolicy,
  getSubmission,
  getUserSubmissions
} = usePracticeAPI();

const tabs = [
  { id: 'simulations', label: 'Simulations' },
  { id: 'mockDebate', label: 'Mock Debate' },
  { id: 'policyDraft', label: 'Policy Draft' }
];

const activeTab = ref('simulations');
const loadingResources = ref(false);
let evaluationPollInterval = null;

const latestSubmission = ref(null);
const refreshingFeedback = ref(false);
const submissionHistory = ref([]);
const selectedSubmissionId = ref('');
const refreshingHistory = ref(false);
const refreshingSubmission = ref(false);

// Simulations
const simulationResources = ref([]);
const currentSimulation = ref(null);
const currentSimulationIndex = ref(0);
const selectedOption = ref('');
const simulationReason = ref('');
const submittingSimulation = ref(false);
const policyResources = ref([]);
const currentPolicyGuidance = computed(() => policyResources.value[0] || null);
const selectedSubmission = computed(() => {
  return submissionHistory.value.find((item) => item._id === selectedSubmissionId.value) || latestSubmission.value;
});

const onSimulationTabActive = async () => {
  if (simulationResources.value.length === 0 && !loadingResources.value) {
    await loadAllResources();
  }
};

const loadAllResources = async () => {
  loadingResources.value = true;
  const resources = await getAllPracticeResources();

  simulationResources.value = resources.simulations || [];
  debateResources.value = resources.debates || [];
  policyResources.value = resources.policyGuidance || [];

  if (simulationResources.value.length > 0) {
    currentSimulation.value = simulationResources.value[currentSimulationIndex.value];
  }

  if (debateResources.value.length === 0) {
    currentDebateIndex.value = 0;
  }

  loadingResources.value = false;
};

const setLatestSubmission = async (submissionId) => {
  const submission = await getSubmission(submissionId);
  if (submission) {
    latestSubmission.value = submission;
    selectedSubmissionId.value = submission._id;
    await loadSubmissionHistory(false);
  }
};

const loadSubmissionHistory = async (showSpinner = true) => {
  if (showSpinner) refreshingHistory.value = true;
  const submissions = await getUserSubmissions();
  submissionHistory.value = submissions;

  if (!selectedSubmissionId.value && submissions.length > 0) {
    selectedSubmissionId.value = submissions[0]._id;
  }

  if (submissions.length > 0) {
    const selected = submissions.find((item) => item._id === selectedSubmissionId.value) || submissions[0];
    latestSubmission.value = selected;
    selectedSubmissionId.value = selected._id;
  }

  if (showSpinner) refreshingHistory.value = false;
};

const selectSubmission = async (submissionId) => {
  selectedSubmissionId.value = submissionId;
  const submission = submissionHistory.value.find((item) => item._id === submissionId);
  if (submission) {
    latestSubmission.value = submission;
  } else {
    await refreshSubmissionDetail();
  }
};

const refreshSubmissionDetail = async () => {
  if (!selectedSubmissionId.value) return;
  refreshingSubmission.value = true;
  const submission = await getSubmission(selectedSubmissionId.value);
  if (submission) {
    latestSubmission.value = submission;
    const index = submissionHistory.value.findIndex((item) => item._id === submission._id);
    if (index !== -1) submissionHistory.value[index] = submission;
  }
  refreshingSubmission.value = false;
};

const refreshLatestFeedback = async () => {
  if (!latestSubmission.value?._id) return;
  refreshingFeedback.value = true;
  await setLatestSubmission(latestSubmission.value._id);
  refreshingFeedback.value = false;
};

const startEvaluationPolling = (submissionId) => {
  if (evaluationPollInterval) {
    clearInterval(evaluationPollInterval);
  }

  evaluationPollInterval = setInterval(async () => {
    const submission = await getSubmission(submissionId);
    if (!submission) return;

    latestSubmission.value = submission;

    if (submission.evaluationStatus === 'completed') {
      clearInterval(evaluationPollInterval);
      evaluationPollInterval = null;
      showSuccess('AI evaluation is ready. Check your feedback above.');
      return;
    }

    if (submission.evaluationStatus === 'failed') {
      clearInterval(evaluationPollInterval);
      evaluationPollInterval = null;
      showError('AI evaluation failed for this submission. Please try again.');
    }
  }, 5000);
};

const submitSimulation = async () => {
  if (!selectedOption.value) {
    showError('Select one option before submitting your simulation response.');
    return;
  }
  if (!simulationReason.value.trim()) {
    showError('Add your reasoning so your decision is clear.');
    return;
  }

  submittingSimulation.value = true;
  try {
    const result = await apiSubmitSimulation(
      currentSimulation.value._id,
      selectedOption.value,
      simulationReason.value
    );
    showSuccess('Simulation submitted! Your response is being evaluated.');
    await setLatestSubmission(result.submissionId);
    startEvaluationPolling(result.submissionId);
    await loadSubmissionHistory(false);
    simulationReason.value = '';
    selectedOption.value = '';
    
    // Move to next simulation if available
    if (currentSimulationIndex.value < simulationResources.value.length - 1) {
      currentSimulationIndex.value++;
      currentSimulation.value = simulationResources.value[currentSimulationIndex.value];
    }
  } catch (err) {
    showError('Error submitting simulation: ' + err.message);
  } finally {
    submittingSimulation.value = false;
  }
};

// Debates
const debateResources = ref([]);
const currentDebateIndex = ref(0);
const debateResponse = ref('');
const isRunning = ref(false);
const time = ref(120);
let interval = null;
const submittingDebate = ref(false);

const onDebateTabActive = async () => {
  if (debateResources.value.length === 0 && !loadingResources.value) {
    await loadAllResources();
  }
};

const formattedTime = computed(() => {
  const min = Math.floor(time.value / 60);
  const sec = time.value % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
});

const startTimer = () => {
  if (isRunning.value) return;
  isRunning.value = true;
  interval = setInterval(() => {
    if (time.value > 0) {
      time.value -= 1;
      return;
    }
    stopTimer();
    showSuccess('Time is up. Submit your response when ready.');
  }, 1000);
};

const stopTimer = () => {
  isRunning.value = false;
  clearInterval(interval);
};

const resetTimer = () => {
  stopTimer();
  time.value = 120;
};

const submitDebate = async () => {
  if (!debateResponse.value.trim()) {
    showError('Please draft your debate response first.');
    return;
  }

  submittingDebate.value = true;
  try {
    const currentDebate = debateResources.value[currentDebateIndex.value];
    const result = await apiSubmitDebate(
      currentDebate._id,
      currentDebateIndex.value,
      debateResponse.value,
      120 - time.value
    );
    showSuccess('Debate response submitted. Great effort.');
    await setLatestSubmission(result.submissionId);
    startEvaluationPolling(result.submissionId);
    await loadSubmissionHistory(false);
    debateResponse.value = '';
    resetTimer();
    
    // Move to next debate
    currentDebateIndex.value = (currentDebateIndex.value + 1) % debateResources.value.length;
  } catch (err) {
    showError('Error submitting debate: ' + err.message);
  } finally {
    submittingDebate.value = false;
  }
};

// Policies
const policyTitle = ref('');
const policyProblem = ref('');
const policyProposal = ref('');
const submittingPolicy = ref(false);

const submitPolicy = async () => {
  if (!policyTitle.value.trim() || !policyProblem.value.trim() || !policyProposal.value.trim()) {
    showError('Fill all policy draft fields before submitting.');
    return;
  }

  submittingPolicy.value = true;
  try {
    const result = await apiSubmitPolicy(
      policyTitle.value,
      policyProblem.value,
      policyProposal.value
    );
    showSuccess('Policy draft submitted successfully. Keep refining your ideas.');
    await setLatestSubmission(result.submissionId);
    startEvaluationPolling(result.submissionId);
    await loadSubmissionHistory(false);
    policyTitle.value = '';
    policyProblem.value = '';
    policyProposal.value = '';
  } catch (err) {
    showError('Error submitting policy: ' + err.message);
  } finally {
    submittingPolicy.value = false;
  }
};

onMounted(async () => {
  await loadAllResources();
  await loadSubmissionHistory();
  if (latestSubmission.value?.evaluationStatus === 'pending') {
    startEvaluationPolling(latestSubmission.value._id);
  }
});

onBeforeUnmount(() => {
  clearInterval(interval);
  if (evaluationPollInterval) {
    clearInterval(evaluationPollInterval);
  }
});

watch(() => activeTab.value, (newTab) => {
  if (newTab === 'simulations') {
    onSimulationTabActive();
  }
  if (newTab === 'mockDebate') {
    onDebateTabActive();
  }
  if (newTab === 'policyDraft' && policyResources.value.length === 0) {
    loadAllResources();
  }
});

function formatSubmissionDate(value) {
  return new Date(value).toLocaleString();
}
</script>

<style scoped>
.practice-page {
  padding: 1.4rem 1rem 2rem;
}

.header {
  margin-bottom: 1rem;
}

.header h2 {
  color: #211235;
  margin-bottom: 0.3rem;
  font-size: clamp(1.35rem, 2.3vw, 1.9rem);
}

.header p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.9rem;
}

.tab-btn {
  border: 1px solid #ded8ea;
  background: #fff;
  color: #2f2045;
  border-radius: 10px;
  padding: 0.5rem 0.8rem;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.tab-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feedback-panel {
  border: 1px solid #e5dcf2;
  background: #faf8fc;
  border-radius: 12px;
  padding: 0.9rem;
  margin-bottom: 0.9rem;
}

.feedback-panel.pending {
  border-color: #f3e7b4;
  background: #fffaf0;
}

.feedback-panel.completed {
  border-color: #d6ead8;
  background: #f7fcf7;
}

.feedback-panel.failed {
  border-color: #f1cfd4;
  background: #fff7f8;
}

.feedback-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.35rem;
}

.feedback-head h3 {
  margin: 0;
  font-size: 1rem;
  color: #2f1b49;
}

.feedback-meta {
  margin: 0 0 0.5rem;
  color: #5f5574;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.feedback-body p {
  margin: 0.3rem 0;
}

.feedback-body h4 {
  margin: 0.7rem 0 0.3rem;
  font-size: 0.92rem;
  color: #321c4d;
}

.feedback-body ul {
  margin: 0;
  padding-left: 1rem;
  color: #5f5574;
}

.feedback-body li {
  margin-bottom: 0.2rem;
}

.score {
  font-weight: 800;
  color: #2b1550;
}

.failure-reason {
  margin-top: 0.5rem !important;
  color: #8a1f2d !important;
  font-size: 0.92rem !important;
}

.card-shell {
  border: 1px solid #e5dcf2;
  background: #faf8fc;
  border-radius: 12px;
  padding: 0.9rem;
  margin-bottom: 0.9rem;
}

.section-head {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.section-head h3 {
  margin: 0;
  font-size: 1rem;
  color: #2f1b49;
}

.section-head p {
  margin: 0.2rem 0 0;
  color: #5f5574;
  font-size: 0.88rem;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.65rem;
}

.history-item {
  text-align: left;
  border: 1px solid #e5dcf2;
  background: #fff;
  border-radius: 10px;
  padding: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item.active {
  border-color: #6b21a8;
  box-shadow: 0 0 0 2px rgba(107, 33, 168, 0.12) inset;
}

.history-item-top {
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
  align-items: center;
  margin-bottom: 0.35rem;
}

.history-item p {
  margin: 0.15rem 0;
  color: #5f5574;
  font-size: 0.88rem;
}

.history-item small {
  color: #7c6f8f;
}

.history-badge {
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.history-badge.pending {
  background: #fff7d6;
  color: #8b5e00;
}

.history-badge.completed {
  background: #e3f7e8;
  color: #166534;
}

.history-badge.failed {
  background: #fde2e6;
  color: #991b1b;
}

.compact {
  padding: 1rem;
}

.failure-label {
  color: #991b1b;
}

.scenario-card {
  background: #f4f0f8;
  border-radius: 12px;
  padding: 0.9rem;
  border: 1px solid #ece4f4;
}

.topic-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: #ece5f6;
  color: #3e2b57;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  margin-bottom: 0.55rem;
  font-size: 0.78rem;
}

.scenario-card h3 {
  color: #231438;
  margin: 0;
  line-height: 1.4;
  font-size: clamp(0.98rem, 1.7vw, 1.2rem);
}

.scenario-card p {
  margin: 0;
  color: #5f5574;
  font-size: 0.92rem;
}

.options-grid {
  display: grid;
  gap: 0.6rem;
}

.option-item {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  padding: 0.7rem;
  border: 1px solid #e4ddef;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
}

.option-item input[type='radio'] {
  width: 1rem;
  height: 1rem;
  margin-top: 0.15rem;
  flex: 0 0 auto;
  accent-color: var(--primary);
}

.option-item strong {
  font-size: 0.94rem;
}

.option-item.selected {
  border-color: #6b21a8;
  box-shadow: 0 0 0 2px rgba(107, 33, 168, 0.12) inset;
}

.option-item p {
  margin: 0.18rem 0 0;
  color: #665a7e;
  font-size: 0.88rem;
}

.debate-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
}

.timer {
  font-size: 1.2rem;
  font-weight: 800;
  color: #2f1b49;
  font-variant-numeric: tabular-nums;
}

.debate-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.control-btn {
  background: #efe8f7;
  color: #2d1c46;
}

.policy-fields {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.submit-btn {
  align-self: flex-start;
}

.policy-fields input,
textarea {
  width: 100%;
  border: 1px solid #ddd6ea;
  border-radius: 10px;
  padding: 0.72rem 0.85rem;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  background: #fff;
}

textarea {
  resize: vertical;
}

input:focus,
textarea:focus {
  border-color: #6b21a8;
}

input:disabled,
textarea:disabled {
  background: #f5f3f8;
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state,
.empty-state {
  padding: 3rem 2rem;
  text-align: center;
  background: #f4f0f8;
  border-radius: 12px;
  border: 1px solid #ece4f4;
}

.loading-state p,
.empty-state p {
  color: #5f5574;
  font-size: 1rem;
  margin: 0;
}

.context {
  margin-top: 0.8rem !important;
  margin-bottom: 0 !important;
  color: #5f5574 !important;
  font-size: 0.95rem !important;
}
</style>