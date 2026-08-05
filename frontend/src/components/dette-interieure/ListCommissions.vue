<template>
  <div class="list-container">
    <div class="list-card">
      <div class="list-header">
        <h3 class="list-title">Liste des Bordereaux (Commissions)</h3>
        <button class="btn-refresh" @click="fetchData">
          <span class="refresh-icon">↻</span> Actualiser
        </button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <span class="loader"></span>
        <p>Chargement des données...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchData" class="btn-retry">Réessayer</button>
      </div>

      <div v-else-if="bordereaux.length === 0" class="empty-state">
        <p>Aucun bordereau n'a été trouvé.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Code Bordereau</th>
              <th>N° Décompte</th>
              <th>Montant (MAD)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bord in bordereaux" :key="bord.numBord">
              <td><strong>#{{ bord.numBord }}</strong></td>
              <td><span class="badge">D-{{ bord.numDecompte }}</span></td>
              <td class="amount">{{ formatMontant(bord.montantBordereau) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/services/api';
import { ref, onMounted } from 'vue';

const bordereaux = ref([]);
const isLoading = ref(true);
const error = ref(null);

const formatMontant = (montant) => {
  if (montant === null || montant === undefined) return '-';
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(montant);
};

const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await api.get('/dette-interieure/commissions/bordereaux');
    const result = response.data;
    bordereaux.value = result.data || [];
  } catch (err) {
    error.value = err.message || 'Impossible de récupérer les bordereaux.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.list-container {
  padding: 20px 0;
}

.list-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  padding: 25px;
  border: 1px solid #f1f5f9;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.btn-refresh {
  padding: 6px 12px;
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-refresh:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.refresh-icon {
  font-size: 1rem;
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #64748b;
}

.error-state {
  color: #ef4444;
}

.btn-retry {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-retry:hover {
  background-color: #fecaca;
}

.table-responsive {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.modern-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-align: left;
  padding: 12px 15px;
  border-bottom: 2px solid #e2e8f0;
}

.modern-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.modern-table tbody tr {
  transition: background-color 0.15s;
}

.modern-table tbody tr:hover {
  background-color: #f8fafc;
}

.badge {
  background-color: #f3e8ff;
  color: #7e22ce;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
}

.amount {
  font-weight: 600;
  font-family: 'Courier New', Courier, monospace;
}

.loader {
  border: 3px solid #f3f3f3;
  border-bottom-color: #3b82f6;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  width: 32px;
  height: 32px;
  margin-bottom: 15px;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
