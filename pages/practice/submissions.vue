<template>
  <div class="submissions-page container">
    <section class="header">
      <div>
        <h2>My Practice Submissions</h2>
        <p>Review your submission history and AI feedback.</p>
      </div>
      <router-link to="/practice" class="btn-secondary">← Back to Practice</router-link>
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
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { usePracticeAPI } from '~/composables/usePracticeAPI';

const { error: showError, success: showSuccess } = useToast();
const { getSubmission, getUserSubmissions } = usePracticeAPI();

const submissionHistory = ref([]);
const selectedSubmissionId = ref('');
const refreshingHistory = ref(false);
const refreshingSubmission = ref(false);

const selectedSubmission = computed(() => {
  return submissionHistory.value.find((item) => item._id === selectedSubmissionId.value) || null;
});

const loadSubmissionHistory = async (showSpinner = true) => {
  if (showSpinner) refreshingHistory.value = true;
  const submissions = await getUserSubmissions();
  submissionHistory.value = submissions;

  if (!selectedSubmissionId.value && submissions.length > 0) {
    selectedSubmissionId.value = submissions[0]._id;
  }

  if (showSpinner) refreshingHistory.value = false;
};

const selectSubmission = async (submissionId) => {
  selectedSubmissionId.value = submissionId;
};

const refreshSubmissionDetail = async () => {
  if (!selectedSubmissionId.value) return;
  refreshingSubmission.value = true;
  const submission = await getSubmission(selectedSubmissionId.value);
  if (submission) {
    const index = submissionHistory.value.findIndex((item) => item._id === submission._id);
    if (index !== -1) submissionHistory.value[index] = submission;
    selectedSubmissionId.value = submission._id;
  }
  refreshingSubmission.value = false;
};

onMounted(async () => {
  await loadSubmissionHistory();
});

function formatSubmissionDate(value) {
  return new Date(value).toLocaleString();
}
</script>

<style scoped>
.submissions-page {
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

.empty-state {
  padding: 2rem;
  text-align: center;
  background: #f4f0f8;
  border-radius: 12px;
  border: 1px solid #ece4f4;
}

.empty-state p {
  color: #5f5574;
  font-size: 1rem;
  margin: 0;
}

@media (max-width: 600px) {
  .header {
    flex-direction: column;
  }

  .history-grid {
    grid-template-columns: 1fr;
  }
}
</style>
