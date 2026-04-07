<template>
    <header class="app-nav-wrap">
        <nav class="app-nav container">
            <NuxtLink to="/dashboard" class="brand">Civic<span class="text-secondary">Her</span><span
                    class="text-black">Naija</span></NuxtLink>

            <div class="desktop-actions">
                <div class="nav-links">
                    <NuxtLink to="/learn" class="nav-link" :class="{ active: route.path.startsWith('/learn') }">Learn
                    </NuxtLink>
                    <NuxtLink to="/practice" class="nav-link" :class="{ active: route.path.startsWith('/practice') }">
                        Practice</NuxtLink>
                    <NuxtLink to="/opportunities" class="nav-link"
                        :class="{ active: route.path.startsWith('/opportunities') }">Opportunities</NuxtLink>
                    <NuxtLink to="/inspired" class="nav-link"
                        :class="{ active: route.path.startsWith('/inspired') }">Get Inspired</NuxtLink>
                </div>
                <button @click="logout" class="btn-primary logout-btn">Logout</button>
            </div>

            <button
                class="menu-toggle"
                type="button"
                @click="menuOpen = !menuOpen"
                :aria-expanded="menuOpen"
                aria-label="Toggle navigation menu"
            >
                <X v-if="menuOpen" :size="20" />
                <Menu v-else :size="20" />
            </button>
        </nav>

        <div v-if="menuOpen" class="mobile-menu container">
            <NuxtLink
                to="/learn"
                class="mobile-link"
                :class="{ active: route.path.startsWith('/learn') }"
                @click="closeMenu"
            >
                Learn
            </NuxtLink>
            <NuxtLink
                to="/practice"
                class="mobile-link"
                :class="{ active: route.path.startsWith('/practice') }"
                @click="closeMenu"
            >
                Practice
            </NuxtLink>
            <NuxtLink
                to="/opportunities"
                class="mobile-link"
                :class="{ active: route.path.startsWith('/opportunities') }"
                @click="closeMenu"
            >
                Opportunities
            </NuxtLink>
            <NuxtLink
                to="/inspired"
                class="mobile-link"
                :class="{ active: route.path.startsWith('/inspired') }"
                @click="closeMenu"
            >
                Get Inspired
            </NuxtLink>
            <button @click="logoutMobile" class="btn-primary mobile-logout">Logout</button>
        </div>
    </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Menu, X } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const menuOpen = ref(false);

watch(
    () => route.path,
    () => {
        menuOpen.value = false;
    }
);

const closeMenu = () => {
    menuOpen.value = false;
};

const logout = () => {
    localStorage.removeItem('token');
    router.push('/');
};

const logoutMobile = () => {
    closeMenu();
    logout();
};
</script>

<style scoped>
.app-nav-wrap {
    position: sticky;
    top: 0;
    z-index: 20;
    background: rgba(250, 250, 250, 0.88);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.app-nav {
    min-height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.brand {
    text-decoration: none;
    color: var(--primary);
    font-weight: 800;
    letter-spacing: 0.2px;
    font-size: 1.15rem;
}

.desktop-actions {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.nav-link {
    text-decoration: none;
    color: var(--text-main);
    font-weight: 600;
    padding: 0.5rem 0.9rem;
    border-radius: 10px;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
    background: var(--secondary);
    color: var(--primary);
}

.nav-link.active {
    background: var(--primary);
    color: #fff;
}

.logout-btn {
    padding: 0.52rem 0.9rem;
}

.menu-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: 1px solid #e8dfef;
    border-radius: 10px;
    background: #fff;
    color: #2a1a40;
    cursor: pointer;
}

.mobile-menu {
    display: none;
    padding-top: 0.3rem;
    padding-bottom: 0.9rem;
    border-top: 1px solid rgba(15, 23, 42, 0.08);
}

.mobile-link {
    display: block;
    text-decoration: none;
    color: #2a1a40;
    font-weight: 600;
    padding: 0.68rem 0.3rem;
    border-bottom: 1px solid #f1ebf8;
}

.mobile-link.active {
    color: var(--primary);
}

.mobile-logout {
    margin-top: 0.8rem;
    width: 100%;
}

@media (max-width: 640px) {
    .app-nav {
        min-height: 60px;
    }

    .brand {
        font-size: 1rem;
    }

    .nav-link {
        font-size: 0.9rem;
        padding: 0.45rem 0.7rem;
    }
}

@media (max-width: 900px) {
    .desktop-actions {
        display: none;
    }

    .menu-toggle {
        display: inline-flex;
    }

    .mobile-menu {
        display: block;
    }
}
</style>