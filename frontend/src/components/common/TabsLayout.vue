<template>
  <div class="module-view">
    <div class="tabs-header">
      <h2>{{ title }}</h2>
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="setActiveTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    
    <div class="tab-content">
      <transition name="fade-slide" mode="out-in">
        <div :key="activeTab" class="tab-pane">
          <slot :name="activeTab"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  },
  defaultTab: {
    type: String,
    required: true
  }
});

const route = useRoute();
const router = useRouter();

const activeTab = ref(props.defaultTab);

onMounted(() => {
  if (route.query.tab) {
    activeTab.value = route.query.tab;
  }
});

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab;
  }
});

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
  router.push({ query: { ...route.query, tab: tabId } });
};
</script>

<style scoped>
.module-view {
  background-color: var(--surface, #ffffff);
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 500px;
  border: 1px solid var(--border-color, #e2e8f0);
}

.tabs-header {
  background-color: var(--surface, #ffffff);
  padding: 25px 25px 0 25px;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
}

.tabs-header h2 {
  margin: 0 0 20px 0;
  color: var(--text-dark, #1e293b);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.tabs {
  display: flex;
  gap: 30px;
}

.tab-btn {
  padding: 0 0 12px 0;
  background-color: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-muted, #64748b);
  transition: all 0.3s ease;
  position: relative;
  top: 1px;
}

.tab-btn:hover {
  color: var(--text-dark, #1e293b);
}

.tab-btn.active {
  color: var(--primary, #ea580c);
  border-bottom: 3px solid var(--primary, #ea580c);
}

.tab-content {
  padding: 25px;
  flex: 1;
  background-color: var(--bg-color, #f8fafc);
}

.tab-pane h3 {
  margin-top: 0;
  color: var(--text-dark, #1e293b);
  font-size: 1.15rem;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
