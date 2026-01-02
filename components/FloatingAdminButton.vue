<template>
  <NuxtLink
    to="/admin/login"
    class="admin-button"
    aria-label="Admin login"
  >
    <span class="text-3xl">🚪</span>
  </NuxtLink>
</template>

<style scoped>
.admin-button {
  position: fixed;
  bottom: 20px;
  left: 40px;
  width: 64px;
  height: 64px;
  background: linear-gradient(145deg, #1a0a0a, #2a1a1a);
  border: 3px solid #8b0000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(139, 0, 0, 0.5);
  z-index: 50;
  text-decoration: none;
}

.admin-button:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px #ff0000, 0 0 40px #8b0000;
  border-color: #ff0000;
}

@media (max-width: 768px) {
  .admin-button {
    width: 56px;
    height: 56px;
    bottom: 20px;
    left: 16px;
  }

  .admin-button .text-3xl {
    font-size: 24px;
  }
}
</style>
