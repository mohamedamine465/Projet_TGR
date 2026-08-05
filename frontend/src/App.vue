<script setup>
import TopBar from './components/TopBar.vue'
</script>

<template>
  <div id="app-root">
    <TopBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
:root {
  --primary: #ea580c;
  --primary-hover: #c2410c;
  --surface: #ffffff;
  --bg-color: #f8fafc;
  --text-dark: #1e293b;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-dark);
}

/* Fix global input focus ring to match primary color */
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.15) !important;
}

#app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Global transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Global Modern Table */
.table-responsive {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.modern-table th {
  background-color: var(--bg-color);
  color: var(--text-muted);
  font-weight: 600;
  text-align: left;
  padding: 12px 15px;
  border-bottom: 2px solid var(--border-color);
}

.modern-table td {
  padding: 12px 15px;
  border-bottom: 1px solid var(--bg-color);
  color: var(--text-dark);
}

.modern-table tbody tr {
  transition: background-color 0.15s;
}

.modern-table tbody tr:hover {
  background-color: var(--bg-color);
}
</style>
