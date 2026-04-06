<template>
  <div class="practice-page container">
    <section class="header">
      <div>
        <h2>Practice &amp; Empower</h2>
        <p>Sharpen your leadership skills through interactive exercises.</p>
      </div>
      <router-link to="/practice/submissions" class="btn-secondary">View Submissions →</router-link>
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
<!-- 
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
    </section> -->

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
  getSubmission
} = usePracticeAPI();

const tabs = [
  { id: 'simulations', label: 'Simulations' },
  { id: 'mockDebate', label: 'Mock Debate' },
  { id: 'policyDraft', label: 'Policy Draft' }
];

const activeTab = ref('simulations');
const loadingResources = ref(false);
let evaluationPollInterval = null;

// Simulations
const simulationResources = ref([]);
const currentSimulation = ref(null);
const currentSimulationIndex = ref(0);
const selectedOption = ref('');
const simulationReason = ref('');
const submittingSimulation = ref(false);
const policyResources = ref([]);
const currentPolicyGuidance = computed(() => policyResources.value[0] || null);

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

const startEvaluationPolling = (submissionId) => {
  if (evaluationPollInterval) {
    clearInterval(evaluationPollInterval);
  }

  evaluationPollInterval = setInterval(async () => {
    const submission = await getSubmission(submissionId);
    if (!submission) return;

    if (submission.evaluationStatus === 'completed') {
      clearInterval(evaluationPollInterval);
      evaluationPollInterval = null;
      showSuccess('AI evaluation is ready. Check your submissions.');
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
    startEvaluationPolling(result.submissionId);
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
    startEvaluationPolling(result.submissionId);
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
    startEvaluationPolling(result.submissionId);
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
</script>

<style scoped>
.practice-page {
  padding: 1.4rem 1rem 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.header h2 {
  color: #211235;
  margin-bottom: 0.3rem;
  font-size: clamp(1.35rem, 2.3vw, 1.9rem);
  margin: 0;
}

.header p {
  margin: 0.2rem 0 0;
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

@media (max-width: 600px) {
  .header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .header > div {
    width: 100%;
  }

  .header .btn-secondary {
    width: 100%;
  }
}
</style>