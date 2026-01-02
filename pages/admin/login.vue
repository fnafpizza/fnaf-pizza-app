<template>
  <div class="login-page scan-lines grain">
    <!-- Static Overlay -->
    <div class="static-overlay"></div>

    <!-- VHS Timestamp -->
    <div class="vhs-timestamp">{{ currentTime }}</div>
    <div class="camera-label camera-flicker" :class="{ 'camera-glitch': isPasswordRevealed }">
      CAM-SECURITY OFFICE
    </div>

    <!-- Animatronic Detection Warning -->
    <div class="detection-warning" :class="{ 'active': isPasswordRevealed }">
      <span class="warning-blink">⚠️</span>
      <span class="warning-text">ANIMATRONIC DETECTED</span>
    </div>

    <!-- Animatronic Eyes (background) -->
    <div class="animatronic-eyes" :class="{ 'eyes-watching': isPasswordRevealed }">
      <div class="eye left" :class="{ blink: isBlinking }"></div>
      <div class="eye right" :class="{ blink: isBlinking }"></div>
    </div>

    <!-- Login Card -->
    <div class="login-container">
      <div class="login-card">
        <!-- Security Warning -->
        <div class="security-warning flicker-fast">
          <span class="warning-icon">⚠️</span>
          <span>AUTHORIZED PERSONNEL ONLY</span>
        </div>

        <h1 class="login-title glitch-text" :class="{ 'watching-text': isPasswordRevealed }">
          {{ isPasswordRevealed ? 'I SEE YOU' : 'SECURITY ACCESS' }}
        </h1>

        <div class="security-notice">
          <p class="notice-text">Night Shift - Security Office</p>
          <p class="notice-subtext">"I always come back..."</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="password" class="form-label">
              SECURITY CODE
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="Enter passcode"
              required
              autocomplete="off"
            />
          </div>

          <div v-if="error" class="error-message pulse">
            <span class="error-icon">⚠️</span>
            <span>{{ error }}</span>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="submit-btn"
            :class="{ 'btn-loading': loading }"
          >
            <span v-if="loading">ACCESSING...</span>
            <span v-else>ENTER SECURITY OFFICE</span>
          </button>
        </form>

        <!-- Demo Password Hint -->
        <div class="demo-password">
          <div class="demo-label">
            <span class="demo-icon">🔑</span>
            <span>DEMO ACCESS CODE</span>
          </div>
          <div
            class="password-reveal"
            :class="{ 'revealed': isPasswordRevealed }"
            @click="togglePasswordReveal"
          >
            <span class="password-text">{{ demoPassword }}</span>
            <span class="reveal-hint" v-if="!isPasswordRevealed">Click to reveal</span>
          </div>
          <button
            v-if="isPasswordRevealed"
            @click.stop="copyPassword"
            class="copy-btn"
            :class="{ 'copied': isCopied }"
          >
            {{ isCopied ? '✓ Copied!' : '📋 Copy' }}
          </button>
        </div>

        <div class="back-link">
          <NuxtLink to="/" class="link-text">
            ← Exit to Main Entrance
          </NuxtLink>
        </div>

        <!-- Creepy Footer -->
        <div class="footer-warning">
          <p class="footer-text">WARNING: Animatronics active after hours</p>
          <p class="footer-subtext">Keep doors closed. Conserve power.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

// Demo password reveal
const demoPassword = ref('••••••••••••')
const isPasswordRevealed = ref(false)
const isCopied = ref(false)

// Fetch demo password on mount
const fetchDemoPassword = async () => {
  try {
    const response = await $fetch('/api/admin/auth/demo-password')
    demoPassword.value = response.password
  } catch (err) {
    demoPassword.value = 'freddyfazbear'
  }
}

const togglePasswordReveal = () => {
  isPasswordRevealed.value = !isPasswordRevealed.value
}

const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(demoPassword.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy password')
  }
}

// Current time for VHS effect
const currentTime = ref('')
const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

// Blinking eyes effect
const isBlinking = ref(false)
const startBlinking = () => {
  setInterval(() => {
    isBlinking.value = true
    setTimeout(() => {
      isBlinking.value = false
    }, 200)
  }, 3000 + Math.random() * 3000)
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    // Call the auth API to validate password
    const response = await $fetch('/api/admin/auth/login', {
      method: 'POST',
      body: {
        password: password.value
      }
    })

    // Store auth token in localStorage
    if (response.token) {
      localStorage.setItem('fnaf-admin-auth', response.token)

      // Redirect to admin dashboard
      await router.push('/admin/orders')
    }
  } catch (err: any) {
    error.value = 'ACCESS DENIED - Invalid Security Code'
    password.value = '' // Clear password field on error
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
onMounted(() => {
  const authToken = localStorage.getItem('fnaf-admin-auth')
  if (authToken) {
    router.push('/admin/orders')
  }

  updateTime()
  setInterval(updateTime, 1000)
  startBlinking()
  fetchDemoPassword()
})
</script>

<style scoped>
.login-page {
  position: fixed;
  inset: 0;
  background: #0d0d0d;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Static Overlay */
.static-overlay {
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.03) 2px,
    rgba(255, 255, 255, 0.03) 4px
  );
  pointer-events: none;
  z-index: 1;
  animation: static-noise 0.1s infinite;
}

@keyframes static-noise {
  0% { opacity: 0.05; }
  50% { opacity: 0.1; }
  100% { opacity: 0.05; }
}

/* VHS Elements */
.vhs-timestamp {
  position: fixed;
  top: 20px;
  right: 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: rgba(255, 0, 0, 0.8);
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.8);
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.camera-label {
  position: fixed;
  top: 20px;
  left: 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: bold;
  color: #d4af37;
  text-shadow: 0 0 8px rgba(212, 175, 55, 0.8);
  z-index: 10;
  transition: all 0.1s;
}

.camera-label.camera-glitch {
  animation: camera-glitch-effect 0.3s infinite;
  filter: blur(1px);
  color: #ff0000;
  text-shadow:
    0 0 8px rgba(255, 0, 0, 0.8),
    2px 0 3px rgba(0, 255, 0, 0.5),
    -2px 0 3px rgba(0, 0, 255, 0.5);
}

@keyframes camera-glitch-effect {
  0%, 100% {
    transform: translate(0, 0);
    filter: blur(1px);
  }
  20% {
    transform: translate(-2px, 1px);
    filter: blur(2px);
  }
  40% {
    transform: translate(2px, -1px);
    filter: blur(0.5px);
  }
  60% {
    transform: translate(-1px, -1px);
    filter: blur(1.5px);
  }
  80% {
    transform: translate(1px, 1px);
    filter: blur(0.8px);
  }
}

/* Detection Warning */
.detection-warning {
  position: fixed;
  top: 50px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(139, 0, 0, 0.9);
  border: 2px solid #ff0000;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: bold;
  color: #ff0000;
  text-shadow: 0 0 5px rgba(255, 0, 0, 1);
  z-index: 10;
  opacity: 0;
  transform: translateX(-100%);
  transition: all 0.5s;
  letter-spacing: 0.1em;
}

.detection-warning.active {
  opacity: 1;
  transform: translateX(0);
  animation: warning-pulse 1s infinite;
}

@keyframes warning-pulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 0, 0, 1), 0 0 30px rgba(255, 0, 0, 0.8);
  }
}

.warning-blink {
  animation: blink 0.8s infinite;
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

.warning-text {
  white-space: nowrap;
}

/* Animatronic Eyes */
.animatronic-eyes {
  position: fixed;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 20rem;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: all 0.6s ease-out;
}

.animatronic-eyes.eyes-watching {
  opacity: 0.6;
  z-index: 10;
  animation: eyes-glow 2s infinite;
}

@keyframes eyes-glow {
  0%, 100% {
    opacity: 0.5;
    filter: brightness(1);
  }
  50% {
    opacity: 0.7;
    filter: brightness(1.3);
  }
}

.eye {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #d4af37 20%, #8b0000 40%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.2);
  transform: scale(0.8);
  transition: all 0.6s ease-out;
}

.eyes-watching .eye {
  width: 130px;
  height: 130px;
  transform: scale(1);
  box-shadow:
    0 0 60px rgba(212, 175, 55, 0.6),
    0 0 100px rgba(212, 175, 55, 0.4),
    0 0 140px rgba(139, 0, 0, 0.3),
    inset 0 0 30px rgba(212, 175, 55, 0.4);
}

.eye.blink {
  opacity: 0;
}

/* Login Container */
.login-container {
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 500px;
  padding: 1rem;
}

.login-card {
  background: linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%);
  border: 2px solid #d4af37;
  border-radius: 0.5rem;
  padding: 2.5rem;
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.4), inset 0 0 20px rgba(139, 0, 0, 0.1);
}

/* Security Warning */
.security-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(139, 0, 0, 0.2);
  border: 2px solid #8b0000;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: bold;
  color: #ff0000;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.8);
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
}

.warning-icon {
  font-size: 1rem;
}

/* Login Title */
.login-title {
  font-family: 'Courier New', monospace;
  font-size: 2.5rem;
  font-weight: bold;
  color: #d4af37;
  text-align: center;
  text-shadow: 0 0 15px rgba(212, 175, 55, 0.8);
  margin-bottom: 1.5rem;
  letter-spacing: 0.15em;
}

.glitch-text {
  animation: glitch-effect 3s infinite;
}

@keyframes glitch-effect {
  0%, 100% { transform: translate(0); }
  10% { transform: translate(-2px, 1px); }
  20% { transform: translate(2px, -1px); }
  30% { transform: translate(0); }
}

/* Watching Text (I SEE YOU) */
.watching-text {
  color: #ff0000 !important;
  text-shadow:
    0 0 20px rgba(255, 0, 0, 1),
    0 0 40px rgba(255, 0, 0, 0.8),
    2px 0 5px rgba(0, 255, 0, 0.5),
    -2px 0 5px rgba(0, 0, 255, 0.5) !important;
  animation: intense-glitch 0.4s infinite !important;
}

@keyframes intense-glitch {
  0% {
    transform: translate(0, 0);
    filter: blur(0);
  }
  10% {
    transform: translate(-5px, 2px);
    filter: blur(1px);
  }
  20% {
    transform: translate(5px, -3px);
    filter: blur(0);
  }
  30% {
    transform: translate(-3px, -2px);
    filter: blur(1.5px);
  }
  40% {
    transform: translate(4px, 3px);
    filter: blur(0.5px);
  }
  50% {
    transform: translate(-2px, 1px);
    filter: blur(0);
  }
  60% {
    transform: translate(3px, -4px);
    filter: blur(1px);
  }
  70% {
    transform: translate(-4px, 2px);
    filter: blur(0);
  }
  80% {
    transform: translate(2px, -2px);
    filter: blur(1.5px);
  }
  90% {
    transform: translate(-1px, 3px);
    filter: blur(0.5px);
  }
  100% {
    transform: translate(0, 0);
    filter: blur(0);
  }
}

/* Security Notice */
.security-notice {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.notice-text {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.notice-subtext {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: #8b0000;
  font-style: italic;
  text-shadow: 0 0 8px rgba(139, 0, 0, 0.6);
}

/* Form */
.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #3d1f4d;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: white;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.form-input::placeholder {
  color: #6b7280;
  font-style: italic;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(139, 0, 0, 0.3);
  border: 2px solid #8b0000;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: bold;
  color: #ff0000;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.8);
  margin-bottom: 1.5rem;
}

.error-icon {
  font-size: 1.25rem;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #8b0000;
  border: 2px solid #d4af37;
  border-radius: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: bold;
  color: #d4af37;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.submit-btn:hover:not(:disabled) {
  background: #a00000;
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-loading {
  animation: pulse 1.5s infinite;
}

/* Back Link */
.back-link {
  text-align: center;
  margin-bottom: 1.5rem;
}

.link-text {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.3s;
}

.link-text:hover {
  color: #d4af37;
}

/* Footer Warning */
.footer-warning {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(139, 0, 0, 0.3);
}

.footer-text {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #8b0000;
  margin-bottom: 0.25rem;
  font-weight: bold;
}

.footer-subtext {
  font-family: 'Courier New', monospace;
  font-size: 0.625rem;
  color: #6b7280;
  font-style: italic;
}

/* Demo Password */
.demo-password {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(61, 31, 77, 0.2);
  border: 2px solid #3d1f4d;
  border-radius: 0.5rem;
}

.demo-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 0.75rem;
  letter-spacing: 0.1em;
}

.demo-icon {
  font-size: 1rem;
}

.password-reveal {
  position: relative;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #3d1f4d;
  border-radius: 0.25rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 0.5rem;
}

.password-reveal:hover {
  border-color: #d4af37;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
}

.password-text {
  font-family: 'Courier New', monospace;
  font-size: 1.125rem;
  font-weight: bold;
  color: #d4af37;
  filter: blur(8px);
  transition: filter 0.3s;
  user-select: none;
}

.password-reveal.revealed .password-text {
  filter: blur(0);
  user-select: text;
}

.reveal-hint {
  display: block;
  font-family: 'Courier New', monospace;
  font-size: 0.625rem;
  color: #6b7280;
  margin-top: 0.5rem;
  font-style: italic;
}

.copy-btn {
  width: 100%;
  padding: 0.5rem;
  background: rgba(61, 31, 77, 0.5);
  border: 1px solid #3d1f4d;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-btn:hover {
  background: rgba(61, 31, 77, 0.8);
  border-color: #d4af37;
  color: #d4af37;
}

.copy-btn.copied {
  background: rgba(34, 197, 94, 0.2);
  border-color: #22c55e;
  color: #22c55e;
}

/* Responsive */
@media (max-width: 640px) {
  .login-card {
    padding: 1.5rem;
  }

  .login-title {
    font-size: 2rem;
  }

  .animatronic-eyes {
    gap: 8rem;
  }

  .eye {
    width: 80px;
    height: 80px;
  }
}
</style>
