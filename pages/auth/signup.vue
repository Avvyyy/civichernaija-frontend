<template>
  <div class="auth-page">
    <div class="glass-card auth-card">
      <h2 class="title">Join CivicHerNaija</h2>
      <form @submit.prevent="signup">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" v-model="form.name" required />
        </div>
        <div class="form-group">
           <label>Email</label>
           <input type="email" v-model="form.email" required />
        </div>
        <div class="form-group">
           <label>Password</label>
           <input type="password" v-model="form.password" required />
        </div>
        <button type="submit" class="btn-primary w-full">Sign Up</button>
      </form>
      <p class="switch-auth">Already have an account? <NuxtLink to="/auth/login">Login</NuxtLink></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const form = ref({ name: '', email: '', password: '' });
const router = useRouter();
const config = useRuntimeConfig();

const signup = async () => {
    try {
    const res = await $fetch(`${config.public.apiBase}/auth/signup`, {
            method: 'POST',
            body: form.value
        });
        localStorage.setItem('token', res.token);
        router.push('/dashboard');
    } catch(err) {
        alert(err.data?.message || 'Error signing up');
    }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-color);
}
.auth-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.title { text-align: center; margin-bottom: 1.5rem; }
.form-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; }
input {
  width: 100%; padding: 0.75rem; border-radius: 6px;
  border: 1px solid #ddd; outline: none; transition: border-color 0.2s;
}
input:focus { border-color: var(--primary); }
.w-full { width: 100%; margin-top: 1rem; }
.switch-auth { text-align: center; margin-top: 1rem; font-size: 0.9rem; }
.switch-auth a { color: var(--primary); text-decoration: none; font-weight: 600; }
</style>
