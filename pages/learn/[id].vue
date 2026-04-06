<template>
  <div>
    <div class="module-detail container" v-if="pending">
      <NuxtLink to="/learn" class="back-link">← All Modules</NuxtLink>
      <div class="glass-card">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-box mt-4"></div>
      </div>
    </div>

    <div class="module-detail container" v-else-if="module">
      <NuxtLink to="/learn" class="back-link">← All Modules</NuxtLink>
      <h2>{{ module.title }}</h2>

      <div class="content glass-card">
        <p class="description">{{ module.description }}</p>

        <div v-if="module.videoUrl" class="video-wrapper mt-4">
          <iframe width="100%" height="400" :src="module.videoUrl" frameborder="0" allowfullscreen></iframe>
        </div>

        <div class="reading-material mt-4">
          <h3>Lesson Content</h3>
          <p>{{ module.content }}</p>
        </div>
      </div>

      <div class="quiz-section glass-card mt-4" v-if="module.quiz && module.quiz.length">
        <h3>Knowledge Check</h3>
        <div v-if="quizResult" class="quiz-result">
          <p class="quiz-score">
            You scored {{ quizResult.score }}/{{ quizResult.totalQuestions }}
          </p>
          <p class="quiz-summary">
            {{ quizResult.score === quizResult.totalQuestions ? 'Perfect score.' : 'Review the questions below and try again if needed.' }}
          </p>
        </div>

        <div v-for="(q, index) in module.quiz" :key="index" class="question-block">
          <p class="question">Q: {{ q.question }}</p>
          <div class="options">
            <label v-for="(opt, oIndex) in q.options" :key="oIndex" class="option">
              <input type="radio" :name="`q-${index}`" :value="oIndex" v-model="answers[index]" />
              {{ opt }}
            </label>
          </div>
          <p
            v-if="quizResult?.answers?.[index]"
            class="question-feedback"
            :class="{ correct: quizResult.answers[index].isCorrect, incorrect: !quizResult.answers[index].isCorrect }"
          >
            {{ quizResult.answers[index].isCorrect ? 'Correct' : `Incorrect. Correct answer: ${q.options[quizResult.answers[index].correctAnswerIndex]}` }}
          </p>
        </div>

        <div class="quiz-actions">
          <button @click="submitQuiz" class="btn-primary lg-btn" :disabled="quizSubmitting">
            {{ quizSubmitting ? 'Grading...' : (quizResult ? 'Resubmit Quiz' : 'Submit Quiz') }}
          </button>
        </div>
      </div>

      <div class="simulation-section glass-card mt-4" v-if="module.simulationPrompt">
        <h3>Empowerment Simulation</h3>
        <p class="prompt">{{ module.simulationPrompt }}</p>
        <textarea v-model="simulationResponse" rows="4" placeholder="Draft your proposal/action here..."></textarea>
      </div>

      <div class="actions mt-4 text-center">
        <button @click="completeModule" class="btn-primary lg-btn">Complete Module & Earn Badge</button>
      </div>
    </div>

    <div v-else class="module-detail container">
      <NuxtLink to="/learn" class="back-link">← All Modules</NuxtLink>
      <div class="glass-card empty-state">
        <h3>{{ errorMessage || 'Module not found' }}</h3>
        <p>Please try again later or choose a different module.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const module = ref(null);
const pending = ref(true);
const errorMessage = ref('');
const answers = ref({});
const simulationResponse = ref('');
const quizResult = ref(null);
const quizSubmitting = ref(false);
const config = useRuntimeConfig();
const { error: showError, success: showSuccess } = useToast();

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) return router.push('/auth/login');

  try {
    const data = await $fetch(`${config.public.apiBase}/modules/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    module.value = data.module ?? data;
    quizResult.value = data.pastResult ?? null;

    if (quizResult.value?.answers?.length) {
      const restoredAnswers = {};
      quizResult.value.answers.forEach((entry) => {
        restoredAnswers[entry.questionIndex] = entry.selectedOptionIndex;
      });
      answers.value = restoredAnswers;
    }
  } catch (err) {
    errorMessage.value = err?.data?.message || 'Failed to load module';
    showError(errorMessage.value);
  } finally {
    pending.value = false;
  }
});

const submitQuiz = async () => {
  const token = localStorage.getItem('token');
  if (!token) return router.push('/auth/login');
  if (!module.value?.quiz?.length) return;

  try {
    quizSubmitting.value = true;
    const normalizedAnswers = module.value.quiz.map((_, index) => {
      const selected = answers.value[index];
      return typeof selected === 'number' ? selected : -1;
    });

    const res = await $fetch(`${config.public.apiBase}/modules/${route.params.id}/quiz`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { answers: normalizedAnswers }
    });

    quizResult.value = res.result;
    showSuccess(res.message || 'Quiz graded successfully');
  } catch (err) {
    showError(err?.data?.message || 'An error occurred while grading the quiz');
  } finally {
    quizSubmitting.value = false;
  }
};

const completeModule = async () => {
  const token = localStorage.getItem('token');
  if (!token) return router.push('/auth/login');

  try {
    const res = await $fetch(`${config.public.apiBase}/modules/${route.params.id}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { simulationResponse: simulationResponse.value }
    });

    showSuccess(`Congratulations! ${res.message}. Check your dashboard!`);
    router.push('/dashboard');
  } catch (err) {
    showError(err?.data?.message || 'Failed to complete module');
  }
};
</script>

<style scoped>
.module-detail {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.back-link {
  color: var(--text-muted);
  text-decoration: none;
  display: inline-block;
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 2rem;
}

.description {
  font-size: 1.1rem;
  color: var(--text-muted);
}

.video-wrapper {
  border-radius: 12px;
  overflow: hidden;
}

.reading-material {
  line-height: 1.7;
}

.question {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.quiz-result {
  margin: 1rem 0 1.25rem;
  padding: 1rem;
  border-radius: 10px;
  background: rgba(107, 33, 168, 0.08);
}

.quiz-score {
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.quiz-summary {
  color: var(--text-muted);
}

.question-feedback {
  margin-top: 0.6rem;
  font-size: 0.92rem;
}

.question-feedback.correct {
  color: #166534;
}

.question-feedback.incorrect {
  color: #b91c1c;
}

.quiz-actions {
  margin-top: 1.5rem;
  text-align: center;
}

.prompt {
  font-weight: 500;
  font-style: italic;
  color: var(--primary);
  margin-bottom: 1rem;
}

textarea {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  outline: none;
  font-family: inherit;
  resize: vertical;
}

textarea:focus {
  border-color: var(--primary);
}

.text-center {
  text-align: center;
}

.lg-btn {
  font-size: 1.1rem;
  padding: 1rem 2.5rem;
}

.empty-state {
  text-align: center;
}

.empty-state p {
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.skeleton {
  border-radius: 8px;
  background: linear-gradient(90deg, #eceff3 25%, #f6f8fa 37%, #eceff3 63%);
  background-size: 400% 100%;
  animation: shimmer 1.25s ease-in-out infinite;
}

.skeleton-title {
  width: 62%;
  height: 1.6rem;
  margin-bottom: 1rem;
}

.skeleton-line {
  width: 100%;
  height: 0.9rem;
  margin-bottom: 0.65rem;
}

.skeleton-line.short {
  width: 75%;
}

.skeleton-box {
  width: 100%;
  height: 260px;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}
</style>
