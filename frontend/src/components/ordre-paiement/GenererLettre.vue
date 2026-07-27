<template>
  <div class="generer-container">
    <div class="pdf-card">
      <div class="icon-header">
        📄
      </div>
      <h3>Générer la lettre de règlement</h3>
      <p class="description">
        Saisissez le numéro de la lettre pour regrouper tous les ordres de paiement correspondants et générer le document officiel au format PDF à destination de Bank Al-Maghrib.
      </p>

      <form @submit.prevent="generatePdf" class="generate-form">
        <div class="form-group">
          <label for="numlettre">Numéro de la lettre *</label>
          <input 
            type="number" 
            id="numlettre" 
            v-model="numlettre" 
            class="custom-input" 
            placeholder="Ex: 405" 
            required 
          />
        </div>

        <button type="submit" class="btn-primary btn-generate" :disabled="isGenerating || !numlettre">
          <span v-if="!isGenerating">📥 Télécharger le PDF</span>
          <span v-else>⏳ Génération en cours...</span>
        </button>
      </form>
      
      <div v-if="errorMsg" class="error-msg">
        {{ errorMsg }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';

const numlettre = ref('');
const isGenerating = ref(false);
const errorMsg = ref('');

const generatePdf = async () => {
  if (!numlettre.value) return;
  
  isGenerating.value = true;
  errorMsg.value = '';
  
  try {
    // Requête pour télécharger un fichier (blob)
    const response = await api.get(`/dette-tresor/ordres-paiement/lettre/${numlettre.value}/pdf`, {
      responseType: 'blob'
    });
    
    // Créer une URL pour le blob et forcer le téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lettre_reglement_${numlettre.value}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Nettoyage
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    numlettre.value = '';
  } catch (error) {
    console.error("Erreur lors de la génération du PDF", error);
    if (error.response && error.response.status === 404) {
      errorMsg.value = "Aucun ordre de paiement trouvé pour ce numéro de lettre.";
    } else {
      errorMsg.value = "Une erreur est survenue lors de la génération du PDF.";
    }
  } finally {
    isGenerating.value = false;
  }
};
</script>

<style scoped>
.generer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.pdf-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.icon-header {
  font-size: 3rem;
  margin-bottom: 20px;
}

h3 {
  color: #1e293b;
  font-size: 1.4rem;
  margin-bottom: 15px;
}

.description {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 30px;
}

.generate-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #475569;
  font-weight: 600;
  margin-bottom: 8px;
}

.custom-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.custom-input:focus {
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
}

.btn-generate {
  background-color: #ea580c; /* Orange pour l'action PDF */
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-generate:hover:not(:disabled) {
  background-color: #c2410c;
}

.btn-generate:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-msg {
  margin-top: 20px;
  color: #dc2626;
  background-color: #fef2f2;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.9rem;
}
</style>
