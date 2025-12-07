<template>
  <router-link to="/" class="logo-link" @mouseenter="startGlow" @mouseleave="stopGlow">
    <div class="logo-container" :class="{ glowing: isGlowing }">
      <!-- 简化版的Logo图标 -->
      <div class="logo-icon">
        <el-icon><VideoCameraFilled /></el-icon>
      </div>

      <!-- Logo文字 -->
      <div class="logo-text">
        <div class="logo-main">
          <span class="chinese">直播学院</span>
          <span class="english">Live Academy</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ref } from 'vue'

const isGlowing = ref(false)

const startGlow = () => {
  isGlowing.value = true
}

const stopGlow = () => {
  isGlowing.value = false
}
</script>

<style scoped>
.logo-link {
  text-decoration: none;
  display: block;
  height: 100%;
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  height: 48px;
}

.logo-container:hover {
  transform: translateY(-1px);
  box-shadow:
    0 6px 20px rgba(64, 158, 255, 0.1),
    0 2px 6px rgba(64, 158, 255, 0.05);
  border-color: rgba(64, 158, 255, 0.3);
}

.logo-container.glowing {
  animation: logoGlow 2s infinite alternate;
}

@keyframes logoGlow {
  0% {
    box-shadow:
      0 2px 12px rgba(64, 158, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
  100% {
    box-shadow:
      0 2px 20px rgba(64, 158, 255, 0.2),
      0 0 15px rgba(64, 158, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
}

/* Logo图标 */
.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
  font-size: 18px;
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
}

/* Logo文字 */
.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-main {
  display: flex;
  flex-direction: column;
}

.chinese {
  font-size: 16px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.english {
  font-size: 10px;
  font-weight: 700;
  color: #718096;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .logo-container {
    padding: 6px 12px;
    gap: 10px;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }

  .chinese {
    font-size: 14px;
  }

  .english {
    font-size: 9px;
  }
}

@media (max-width: 768px) {
  .logo-container {
    padding: 4px 10px;
  }

  .english {
    display: none;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }

  .logo-container {
    padding: 8px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }
}
</style>
