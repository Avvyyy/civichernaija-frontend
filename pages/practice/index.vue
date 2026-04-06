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

    <section v-if="activeTab === 'simulations'" class="tab-panel">
      <article class="scenario-card">
        <span class="topic-pill">Scenario 1 of 1</span>
        <h3>
          Your local government has N10 million remaining in the budget. The community needs a new
          borehole for clean water and repairs to the primary school roof. You can only fund one
          project fully right now. What do you do?
        </h3>
      </article>

      <div class="options-grid">
        <label v-for="opt in simulationOptions" :key="opt.id" class="option-item" :class="{ selected: selectedOption === opt.id }">
          <input type="radio" name="budget-choice" :value="opt.id" v-model="selectedOption" />
          <div>
            <strong>{{ opt.title }}</strong>
            <p>{{ opt.desc }}</p>
          </div>
        </label>
      </div>

      <textarea
        v-model="simulationReason"
        rows="5"
        placeholder="Explain your decision clearly and confidently..."
      ></textarea>

      <button class="btn-primary submit-btn" @click="submitSimulation">Submit Simulation Response</button>
    </section>

    <section v-else-if="activeTab === 'mockDebate'" class="tab-panel">
      <article class="scenario-card">
        <div class="debate-top-row">
          <span class="topic-pill">Topic {{ currentDebateIndex + 1 }} of {{ debateTopics.length }}</span>
          <span class="timer">{{ formattedTime }}</span>
        </div>
        <h3>{{ debateTopics[currentDebateIndex] }}</h3>
      </article>

      <textarea
        v-model="debateResponse"
        rows="7"
        placeholder="Share your argument. Be bold and clear."
      ></textarea>

      <div class="debate-actions">
        <button class="btn-secondary control-btn" @click="startTimer" :disabled="isRunning">Start Timer</button>
        <button class="btn-secondary control-btn" @click="stopTimer" :disabled="!isRunning">Stop Timer</button>
        <button class="btn-secondary control-btn" @click="resetTimer">Reset</button>
        <button class="btn-primary" @click="submitDebate">Submit Response</button>
      </div>
    </section>

    <section v-else class="tab-panel">
      <article class="scenario-card">
        <span class="topic-pill">Policy Draft</span>
        <h3>Draft a Policy Proposal</h3>
        <p>Think about a problem in your community. Write a short policy proposal to address it.</p>
      </article>

      <div class="policy-fields">
        <input v-model="policyTitle" type="text" placeholder="Policy title (example: Safer Roads Initiative)" />
        <textarea
          v-model="policyProblem"
          rows="3"
          placeholder="What problem are you trying to solve?"
        ></textarea>
        <textarea
          v-model="policyProposal"
          rows="6"
          placeholder="Describe your proposed policy, who it affects, and how it will be implemented."
        ></textarea>
      </div>

      <button class="btn-primary submit-btn" @click="submitPolicy">Submit Draft</button>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';

const { error: showError, success: showSuccess } = useToast();

const tabs = [
  { id: 'simulations', label: 'Simulations' },
  { id: 'mockDebate', label: 'Mock Debate' },
  { id: 'policyDraft', label: 'Policy Draft' }
];

const activeTab = ref('simulations');

const simulationOptions = [
  {
    id: 'borehole-now',
    title: 'Fund the borehole now',
    desc: 'Prioritize immediate access to clean water, then plan school repairs in the next budget cycle.'
  },
  {
    id: 'school-roof-now',
    title: 'Repair the school roof now',
    desc: 'Protect the learning environment first, then launch a short fundraising campaign for water infrastructure.'
  },
  {
    id: 'hybrid-phased',
    title: 'Negotiate a phased hybrid plan',
    desc: 'Do urgent temporary roof fixes and begin borehole groundwork while seeking state support for completion.'
  }
];

const selectedOption = ref('');
const simulationReason = ref('');

const submitSimulation = () => {
  if (!selectedOption.value) {
    showError('Select one option before submitting your simulation response.');
    return;
  }
  if (!simulationReason.value.trim()) {
    showError('Add your reasoning so your decision is clear.');
    return;
  }

  showSuccess('Simulation response captured. You can connect backend scoring later.');
  simulationReason.value = '';
};

const debateTopics = [
  'Should Nigeria adopt a parliamentary system of government instead of presidential?',
  'Should civic education be mandatory in all secondary schools?',
  'Should local governments reserve leadership seats for women and youth?'
];

const currentDebateIndex = ref(0);
const debateResponse = ref('');
const isRunning = ref(false);
const time = ref(120);
let interval = null;

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

const submitDebate = () => {
  if (!debateResponse.value.trim()) {
    showError('Please draft your debate response first.');
    return;
  }

  showSuccess('Debate response submitted. Great effort.');
  debateResponse.value = '';
  resetTimer();
  currentDebateIndex.value = (currentDebateIndex.value + 1) % debateTopics.length;
};

const policyTitle = ref('');
const policyProblem = ref('');
const policyProposal = ref('');

const submitPolicy = () => {
  if (!policyTitle.value.trim() || !policyProblem.value.trim() || !policyProposal.value.trim()) {
    showError('Fill all policy draft fields before submitting.');
    return;
  }

  showSuccess('Policy draft submitted successfully. Keep refining your ideas.');
  policyTitle.value = '';
  policyProblem.value = '';
  policyProposal.value = '';
};

onBeforeUnmount(() => {
  clearInterval(interval);
});
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
</style>