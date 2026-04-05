<template>
  <div class="practice-page container">
    <div class="header">
        <NuxtLink to="/dashboard" class="back-link">← Back to Dashboard</NuxtLink>
        <h2>Empowerment & Practice</h2>
        <p>Hone your public speaking and decision-making skills.</p>
    </div>

    <div class="practice-grid">
        <div class="glass-card">
            <h3 class="mb-2">🎤 Mock Debate Timer</h3>
            <p class="mb-4">Practice responding to policy questions within a time limit.</p>
            <div class="timer-display">{{ formattedTime }}</div>
            <div class="timer-controls">
                <button @click="startTimer" class="btn-primary" :disabled="isRunning">Start</button>
                <button @click="stopTimer" class="btn-secondary" :disabled="!isRunning">Stop</button>
                <button @click="resetTimer" class="btn-secondary">Reset</button>
            </div>
            <p class="topic mt-4"><strong>Current Topic:</strong> Should youth quotas be implemented in the National Assembly?</p>
        </div>

        <div class="glass-card">
            <h3 class="mb-2">✍️ Policy Drafting Exercise</h3>
            <p class="mb-4">Draft a simple proposal addressing educational disparities in your local government area.</p>
            <textarea v-model="policy" rows="6" placeholder="Start drafting your policy..."></textarea>
            <button @click="submitPolicy" class="btn-primary mt-2">Submit Draft</button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const time = ref(120); // 2 minutes
const isRunning = ref(false);
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
        if(time.value > 0) time.value--;
        else stopTimer();
    }, 1000);
}

const stopTimer = () => {
    isRunning.value = false;
    clearInterval(interval);
}

const resetTimer = () => {
    stopTimer();
    time.value = 120;
}

const policy = ref('');
const submitPolicy = () => {
    if(!policy.value.trim()) return alert("Please write a draft first!");
    alert("Draft submitted successfully! Keep practicing to refine your ideas.");
    policy.value = '';
}
</script>

<style scoped>
.practice-page { padding: 2rem 1rem; }
.header { margin-bottom: 2rem; }
.header p { color: var(--text-muted); font-size: 1.1rem; }
.back-link { color: var(--text-muted); text-decoration: none; display: inline-block; margin-bottom: 1rem; }
.back-link:hover { color: var(--primary); }
.practice-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media(min-width: 768px) {
  .practice-grid { grid-template-columns: 1fr 1fr; }
}
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.timer-display { font-size: 4rem; font-weight: 800; text-align: center; color: var(--primary); font-variant-numeric: tabular-nums; margin-bottom: 1rem;}
.timer-controls { display: flex; justify-content: center; gap: 0.5rem; }
.topic { padding: 1rem; background: rgba(107, 33, 168, 0.05); border-radius: 8px; border-left: 4px solid var(--primary); }
textarea { width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid #ddd; outline: none; font-family: inherit; resize: vertical; }
textarea:focus { border-color: var(--primary); }
</style>
