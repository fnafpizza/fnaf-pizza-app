<template>
  <NuxtLink
    to="/orders"
    class="orders-button"
    aria-label="View orders"
  >
    <span class="text-3xl">📋</span>
  </NuxtLink>
</template>

<style scoped>
.orders-button {
  position: fixed;
  bottom: 20px;
  right: 40px;
  width: 64px;
  height: 64px;
  background: linear-gradient(145deg, #3d1f4d, #4d2f5d);
  border: 3px solid #d4af37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(61, 31, 77, 0.5);
  z-index: 50;
  text-decoration: none;
}

.orders-button:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px #d4af37, 0 0 40px #3d1f4d;
}

@media (max-width: 768px) {
  .orders-button {
    width: 56px;
    height: 56px;
    bottom: 20px;
    right: 16px;
  }

  .orders-button .text-3xl {
    font-size: 24px;
  }
}
</style>
