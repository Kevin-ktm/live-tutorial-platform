<template>
  <div class="hero-carousel">
    <!-- 主轮播图 -->
    <el-carousel :interval="5000" height="500px" trigger="click" arrow="always" :autoplay="true">
      <!-- 第一张：主推内容 -->
      <el-carousel-item>
        <div class="carousel-item slide-1">
          <div class="carousel-content">
            <div class="content-left">
              <h2 class="slide-title">成为下一个直播明星</h2>
              <h1 class="slide-headline">从0到百万粉丝<br />完整成长路径</h1>
              <p class="slide-description">
                系统化教学 + 实战案例 + 导师指导<br />
                带你快速突破直播瓶颈，实现流量爆发
              </p>
              <div class="slide-actions">
                <el-button type="primary" size="large" @click="startLearning">
                  <el-icon><VideoPlay /></el-icon>
                  立即开始学习
                </el-button>
                <el-button size="large" @click="scrollToFeatures">
                  <el-icon><Star /></el-icon>
                  了解优势
                </el-button>
              </div>
              <div class="slide-stats">
                <div class="stat-item">
                  <span class="stat-number">500+</span>
                  <span class="stat-label">优质教程</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">10,000+</span>
                  <span class="stat-label">学员成功案例</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">98%</span>
                  <span class="stat-label">学员满意度</span>
                </div>
              </div>
            </div>
            <div class="content-right">
              <div class="floating-elements">
                <div class="floating-element element-1">
                  <el-icon><VideoCamera /></el-icon>
                  <span>专业设备指南</span>
                </div>
                <div class="floating-element element-2">
                  <el-icon><MagicStick /></el-icon>
                  <span>美颜参数秘籍</span>
                </div>
                <div class="floating-element element-3">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>话术技巧宝典</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>

      <!-- 第二张：电商直播 -->
      <el-carousel-item>
        <div class="carousel-item slide-2">
          <div class="carousel-content">
            <div class="content-left">
              <h2 class="slide-title">电商直播变现秘籍</h2>
              <h1 class="slide-headline">单场直播<br />GMV提升300%</h1>
              <p class="slide-description">
                选品策略 + 话术技巧 + 转化方法<br />
                完整电商直播变现体系，助你成为带货达人
              </p>
              <div class="slide-actions">
                <el-button type="success" size="large" @click="goToCategory(5)">
                  <el-icon><ShoppingCart /></el-icon>
                  学习电商直播
                </el-button>
                <el-button size="large" @click="showCaseStudy">
                  <el-icon><Trophy /></el-icon>
                  查看成功案例
                </el-button>
              </div>
            </div>
            <div class="content-right">
              <div class="stats-card">
                <div class="stats-header">
                  <el-icon><TrendCharts /></el-icon>
                  <span>学员平均提升</span>
                </div>
                <div class="stats-body">
                  <div class="progress-item">
                    <span>转化率</span>
                    <el-progress :percentage="85" :stroke-width="12" color="#67c23a" />
                    <span class="progress-value">+85%</span>
                  </div>
                  <div class="progress-item">
                    <span>客单价</span>
                    <el-progress :percentage="65" :stroke-width="12" color="#409EFF" />
                    <span class="progress-value">+65%</span>
                  </div>
                  <div class="progress-item">
                    <span>复购率</span>
                    <el-progress :percentage="92" :stroke-width="12" color="#e6a23c" />
                    <span class="progress-value">+92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>

      <!-- 第三张：娱乐直播 -->
      <el-carousel-item>
        <div class="carousel-item slide-3">
          <div class="carousel-content">
            <div class="content-left">
              <h2 class="slide-title">娱乐直播互动大师</h2>
              <h1 class="slide-headline">告别冷场<br />打造高互动直播间</h1>
              <p class="slide-description">
                互动游戏 + 气氛调动 + 粉丝维护<br />
                让直播间人气持续攀升，礼物不断
              </p>
              <div class="slide-actions">
                <el-button type="warning" size="large" @click="goToCategory(1)">
                  <el-icon><Sunny /></el-icon>
                  学习娱乐直播
                </el-button>
                <el-button size="large" @click="showInteractiveDemo">
                  <el-icon><MagicStick /></el-icon>
                  互动演示
                </el-button>
              </div>
              <div class="live-demo">
                <div class="demo-item">
                  <el-icon><Timer /></el-icon>
                  <span>平均停留时长：15分钟</span>
                </div>
                <div class="demo-item">
                  <el-icon><ChatDotSquare /></el-icon>
                  <span>互动率：45%</span>
                </div>
              </div>
            </div>
            <div class="content-right">
              <div class="interactive-demo">
                <div class="chat-bubble bubble-1">主播好漂亮！</div>
                <div class="chat-bubble bubble-2">礼物走一波🎁</div>
                <div class="chat-bubble bubble-3">可以点歌吗？</div>
                <div class="chat-bubble bubble-4">关注了！</div>
                <div class="live-indicator">
                  <span class="live-dot"></span>
                  <span>直播中</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 轮播指示器自定义 -->
    <div class="carousel-indicators">
      <div
        v-for="(_, index) in 3"
        :key="index"
        :class="['indicator', { active: activeIndex === index }]"
        @click="handleIndicatorClick(index)"
      >
        <div class="indicator-progress" v-if="activeIndex === index"></div>
      </div>
    </div>

    <!-- 下载引导浮层 -->
    <div class="download-floating" v-if="showDownload">
      <div class="download-content">
        <h3>📱 手机学习更便捷</h3>
        <p>随时随地学习直播技巧</p>
        <div class="download-buttons">
          <el-button type="primary" size="small">
            <el-icon><Apple /></el-icon>
            App Store
          </el-button>
          <el-button type="success" size="small">
            <el-icon><Android /></el-icon>
            安卓下载
          </el-button>
        </div>
        <el-icon class="close-download" @click="showDownload = false"><Close /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeIndex = ref(0)
const showDownload = ref(true)
let autoPlayTimer = null

const startLearning = () => {
  router.push('/tutorials')
}

const scrollToFeatures = () => {
  const element = document.querySelector('.features-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToCategory = (categoryId) => {
  router.push(`/tutorials?category=${categoryId}`)
}

const showCaseStudy = () => {
  ElMessage.success('正在加载成功案例...')
}

const showInteractiveDemo = () => {
  ElMessage.info('互动演示功能正在开发中')
}

const handleIndicatorClick = (index) => {
  const carousel = document.querySelector('.el-carousel')
  if (carousel) {
    carousel.setActiveItem(index)
  }
}

// 监听轮播变化
const handleCarouselChange = (currentIndex) => {
  activeIndex.value = currentIndex
}

// 自动切换下载浮层
const toggleDownloadFloating = () => {
  showDownload.value = !showDownload.value
  autoPlayTimer = setTimeout(toggleDownloadFloating, 10000)
}

onMounted(() => {
  // 监听轮播变化
  const carousel = document.querySelector('.el-carousel')
  if (carousel) {
    carousel.addEventListener('change', (e) => {
      activeIndex.value = e.detail.current
    })
  }

  // 10秒后自动切换下载浮层
  autoPlayTimer = setTimeout(toggleDownloadFloating, 10000)
})

onUnmounted(() => {
  if (autoPlayTimer) {
    clearTimeout(autoPlayTimer)
  }
})
</script>

<style scoped>
.hero-carousel {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.carousel-item {
  height: 100%;
  padding: 60px 80px;
  position: relative;
  overflow: hidden;
}

/* 第一张轮播图样式 */
.slide-1 {
  background:
    linear-gradient(135deg, rgba(26, 115, 232, 0.95) 0%, rgba(156, 39, 176, 0.95) 100%),
    url('https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=1600&auto=format&fit=crop&q=80&blur=20');
  background-size: cover;
  background-position: center;
  color: white;
}

/* 第二张轮播图样式 */
.slide-2 {
  background:
    linear-gradient(135deg, rgba(102, 187, 106, 0.95) 0%, rgba(56, 142, 60, 0.95) 100%),
    url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&auto=format&fit=crop&q=80&blur=20');
  background-size: cover;
  background-position: center;
  color: white;
}

/* 第三张轮播图样式 */
.slide-3 {
  background:
    linear-gradient(135deg, rgba(255, 167, 38, 0.95) 0%, rgba(230, 74, 25, 0.95) 100%),
    url('https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=1600&auto=format&fit=crop&q=80&blur=20');
  background-size: cover;
  background-position: center;
  color: white;
}

.carousel-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  gap: 60px;
}

.content-left {
  flex: 1;
  max-width: 600px;
  z-index: 2;
}

.content-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  z-index: 2;
}

.slide-title {
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.slide-headline {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  background: linear-gradient(to right, #ffffff, #e6e6e6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.slide-description {
  font-size: 1.2rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 40px;
  max-width: 500px;
}

.slide-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.slide-actions .el-button {
  padding: 18px 36px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.slide-actions .el-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.slide-actions .el-button:first-child {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}

.slide-actions .el-button .el-icon {
  margin-right: 8px;
}

.slide-stats {
  display: flex;
  gap: 40px;
  margin-top: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 5px;
  background: linear-gradient(to right, #ffd700, #ffaa00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 浮动元素 */
.floating-elements {
  position: relative;
  width: 300px;
  height: 300px;
}

.floating-element {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
}

.floating-element .el-icon {
  font-size: 28px;
  color: #ffd700;
}

.floating-element span {
  font-weight: 600;
}

.element-1 {
  top: 0;
  left: 0;
  animation-delay: 0s;
}

.element-2 {
  top: 40%;
  right: 0;
  animation-delay: 1s;
}

.element-3 {
  bottom: 0;
  left: 20%;
  animation-delay: 2s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* 第二张轮播图统计卡片 */
.stats-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  width: 350px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
  font-size: 1.2rem;
  font-weight: 600;
}

.stats-header .el-icon {
  font-size: 24px;
  color: #ffd700;
}

.progress-item {
  margin-bottom: 25px;
}

.progress-item:last-child {
  margin-bottom: 0;
}

.progress-item span:first-child {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.progress-value {
  float: right;
  font-weight: 700;
  font-size: 1.1rem;
}

/* 第三张轮播图直播演示 */
.live-demo {
  display: flex;
  gap: 30px;
  margin-top: 30px;
}

.demo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  border-radius: 10px;
  backdrop-filter: blur(5px);
}

.demo-item .el-icon {
  font-size: 20px;
  color: #ffd700;
}

.interactive-demo {
  position: relative;
  width: 300px;
  height: 300px;
}

.chat-bubble {
  position: absolute;
  background: white;
  color: #333;
  padding: 12px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  animation: bubbleFloat 5s ease-in-out infinite;
}

.bubble-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.bubble-2 {
  top: 40%;
  right: 5%;
  animation-delay: 1s;
}

.bubble-3 {
  bottom: 30%;
  left: 15%;
  animation-delay: 2s;
}

.bubble-4 {
  bottom: 15%;
  right: 20%;
  animation-delay: 3s;
}

@keyframes bubbleFloat {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) scale(1.05);
    opacity: 0.8;
  }
}

.live-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 59, 48, 0.9);
  padding: 10px 20px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: white;
  box-shadow: 0 5px 15px rgba(255, 59, 48, 0.3);
}

.live-dot {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 轮播指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 15px;
  z-index: 10;
}

.indicator {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 0.3s;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.5);
}

.indicator.active {
  background: rgba(255, 255, 255, 0.1);
}

.indicator-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: white;
  animation: progress 5s linear infinite;
}

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

/* 下载浮层 */
.download-floating {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 100;
  animation: slideIn 0.5s ease-out;
}

.download-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  width: 250px;
}

.download-content h3 {
  color: #333;
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.download-content p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.download-buttons {
  display: flex;
  gap: 10px;
}

.close-download {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.close-download:hover {
  color: #333;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .carousel-content {
    gap: 30px;
  }

  .slide-headline {
    font-size: 2.8rem;
  }

  .stats-card {
    width: 300px;
  }
}

@media (max-width: 992px) {
  .carousel-item {
    padding: 40px;
  }

  .carousel-content {
    flex-direction: column;
    text-align: center;
  }

  .content-left {
    max-width: 100%;
  }

  .content-right {
    justify-content: center;
  }

  .slide-headline {
    font-size: 2.5rem;
  }

  .floating-elements {
    width: 100%;
    justify-content: center;
  }

  .download-floating {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero-carousel {
    margin: 10px;
  }

  .carousel-item {
    padding: 30px 20px;
  }

  .slide-headline {
    font-size: 2rem;
  }

  .slide-actions {
    flex-direction: column;
  }

  .slide-actions .el-button {
    width: 100%;
  }

  .slide-stats {
    flex-direction: column;
    gap: 20px;
  }

  .stats-card {
    width: 100%;
  }

  .floating-element {
    padding: 15px;
    font-size: 0.9rem;
  }
}
</style>
