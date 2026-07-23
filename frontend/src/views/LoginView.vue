<template>
  <div class="login-page">
    <div class="login-card">
      <div class="card-header">
        <img src="@/assets/images.png" alt="Logo TGR" class="card-logo" />
        <h2>Portail d'Authentification</h2>
      </div>

      <form @submit.prevent="handleLogin" v-if="!showChangePasswordForm">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required placeholder="votre.email@tgr.gov.ma" />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" v-model="password" required placeholder="••••••••" />
        </div>
        <div class="form-actions">
          <a href="#" @click.prevent="toggleChangePassword" class="text-link">Modifier mon mot de passe</a>
        </div>
        <button type="submit" class="btn-primary">Se connecter</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
      
      <form @submit.prevent="handleChangePassword" v-else>
        <h3 v-if="firstLoginMode">Première Connexion</h3>
        <h3 v-else>Modifier le mot de passe</h3>
        
        <p v-if="firstLoginMode" class="helper-text">Veuillez changer votre mot de passe obligatoire avant de continuer.</p>
        
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required placeholder="votre.email@tgr.gov.ma" />
        </div>
        <div class="form-group">
          <label>Mot de passe actuel</label>
          <input type="password" v-model="password" required placeholder="••••••••" />
        </div>
        <div class="form-group">
          <label>Nouveau mot de passe</label>
          <input type="password" v-model="newPassword" required placeholder="Nouveau mot de passe" />
        </div>
        
        <button type="submit" class="btn-primary">Mettre à jour</button>
        <div class="form-actions center" v-if="!firstLoginMode">
          <a href="#" @click.prevent="toggleChangePassword" class="text-link">Retour à la connexion</a>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const newPassword = ref('');
const errorMessage = ref('');
const firstLoginMode = ref(false);
const showChangePasswordForm = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  const result = await authStore.login(email.value, password.value);
  
  if (result.success) {
    router.push({ name: 'home' });
  } else if (result.first_login) {
    firstLoginMode.value = true;
    showChangePasswordForm.value = true;
    errorMessage.value = 'Veuillez changer votre mot de passe obligatoire.';
  } else {
    errorMessage.value = result.message;
  }
};

const toggleChangePassword = () => {
  showChangePasswordForm.value = !showChangePasswordForm.value;
  firstLoginMode.value = false;
  errorMessage.value = '';
  newPassword.value = '';
};

const handleChangePassword = async () => {
  try {
    await api.post('/auth/change-password', {
      email: email.value,
      currentPassword: password.value,
      newPassword: newPassword.value
    });
    // Une fois changé, on se reconnecte avec le nouveau mot de passe
    password.value = newPassword.value;
    firstLoginMode.value = false;
    await handleLogin();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors du changement.';
  }
};
</script>

<style scoped>
.login-page {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  /* Un fond gris très clair pour bien faire ressortir les hexagones sombres */
  background-color: #f1f5f9;
  /* Superposer deux fois la même texture double son opacité et la rend légèrement plus prononcée */
  background-image: url('https://www.transparenttextures.com/patterns/cubes.png'), 
                    url('https://www.transparenttextures.com/patterns/cubes.png');
  font-family: 'Inter', sans-serif;
  padding: 20px;
}

.login-card {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(234, 88, 12, 0.15); /* Ombre très légèrement teintée orange */
  width: 100%;
  max-width: 450px;
  text-align: left;
  border-top: 5px solid #ea580c; /* Ligne d'accentuation Orange TGR */
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
}

.card-logo {
  height: 80px;
  margin-bottom: 15px;
  object-fit: contain;
}

h2 {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

h3 {
  color: #1e293b;
  margin-bottom: 10px;
  font-weight: 600;
  text-align: center;
}

.helper-text {
  text-align: center;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #64748b;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-weight: 600;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #ea580c;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.15);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.form-actions.center {
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 0;
}

.text-link {
  color: #ea580c;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.3s;
}

.text-link:hover {
  color: #c2410c;
  text-decoration: underline;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: #ea580c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.1s;
}

.btn-primary:hover {
  background: #c2410c;
}

.btn-primary:active {
  transform: translateY(2px);
}

.error {
  color: #dc2626;
  margin-top: 16px;
  font-size: 0.9rem;
  background: #fef2f2;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #dc2626;
  text-align: center;
}
</style>
