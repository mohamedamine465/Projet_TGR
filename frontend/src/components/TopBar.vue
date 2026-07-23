<template>
  <header class="top-bar">
    <div class="logo-container">
      <img src="@/assets/images.png" alt="Logo TGR" class="logo" />
      <div class="title-container">
        <h1 class="main-title">Trésorerie Générale du Royaume</h1>
        <h2 class="sub-title">Gestion de la Dette Publique</h2>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 10px 30px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 80px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  height: 55px;
  object-fit: contain;
}

.title-container {
  display: flex;
  flex-direction: column;
}

.main-title {
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sub-title {
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0;
}
</style>
