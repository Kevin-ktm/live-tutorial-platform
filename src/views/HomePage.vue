<template>
  <div class="home-page">
    <!-- 1. 英雄轮播区 -->
    <section class="hero-section">
      <HeroCarousel />
    </section>

    <!-- 2. 快速导航区 -->
    <section class="quick-nav-section">
      <div class="container">
        <h2 class="section-title">🎯 快速找到你需要的内容</h2>
        <p class="section-subtitle">根据你的目标选择学习路径，高效成长</p>

        <div class="quick-nav-grid">
          <div class="nav-card" @click="goToCategory(1)">
            <div class="nav-icon">
              <el-icon><VideoCamera /></el-icon>
            </div>
            <h3>新手入门</h3>
            <p>零基础快速开播</p>
            <div class="nav-stats">
              <span>15个教程</span>
              <span>·</span>
              <span>8小时</span>
            </div>
            <div class="nav-progress">
              <el-progress :percentage="30" :show-text="false" />
              <span>30% 学员已学完</span>
            </div>
          </div>

          <div class="nav-card" @click="goToCategory(2)">
            <div class="nav-icon">
              <el-icon><MagicStick /></el-icon>
            </div>
            <h3>美颜优化</h3>
            <p>打造完美直播形象</p>
            <div class="nav-stats">
              <span>12个教程</span>
              <span>·</span>
              <span>6小时</span>
            </div>
            <div class="nav-progress">
              <el-progress :percentage="45" :show-text="false" />
              <span>45% 学员已学完</span>
            </div>
          </div>

          <div class="nav-card" @click="goToCategory(5)">
            <div class="nav-icon">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <h3>话术技巧</h3>
            <p>提升互动与转化</p>
            <div class="nav-stats">
              <span>20个教程</span>
              <span>·</span>
              <span>10小时</span>
            </div>
            <div class="nav-progress">
              <el-progress :percentage="25" :show-text="false" />
              <span>25% 学员已学完</span>
            </div>
          </div>

          <div class="nav-card" @click="goToCategory(7)">
            <div class="nav-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <h3>变现秘籍</h3>
            <p>实现直播收入增长</p>
            <div class="nav-stats">
              <span>8个教程</span>
              <span>·</span>
              <span>4小时</span>
            </div>
            <div class="nav-progress">
              <el-progress :percentage="15" :show-text="false" />
              <span>15% 学员已学完</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. 特色优势区 -->
    <section class="features-section" id="features">
      <div class="container">
        <h2 class="section-title">✨ 为什么选择直播学院？</h2>
        <p class="section-subtitle">我们与众不同的学习体验</p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-badge">独家</div>
            <div class="feature-icon">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <h3>实战化教学</h3>
            <p>不只是理论，每个教程都有配套的实战案例和练习任务</p>
            <ul class="feature-list">
              <li>真实案例分析</li>
              <li>随堂练习任务</li>
              <li>导师实时反馈</li>
            </ul>
          </div>

          <div class="feature-item">
            <div class="feature-badge">智能</div>
            <div class="feature-icon">
              <el-icon><MagicStick /></el-icon>
            </div>
            <h3>个性化路径</h3>
            <p>AI智能推荐学习路径，根据你的水平和目标定制专属方案</p>
            <ul class="feature-list">
              <li>智能水平测试</li>
              <li>个性化推荐</li>
              <li>动态调整方案</li>
            </ul>
          </div>

          <div class="feature-item">
            <div class="feature-badge">社区</div>
            <div class="feature-icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <h3>导师陪跑制</h3>
            <p>专业导师全程陪伴，从学习到实践，解答你的每一个问题</p>
            <ul class="feature-list">
              <li>1对1答疑</li>
              <li>直播连麦指导</li>
              <li>成功案例分享</li>
            </ul>
          </div>

          <div class="feature-item">
            <div class="feature-badge">实用</div>
            <div class="feature-icon">
              <el-icon><Download /></el-icon>
            </div>
            <h3>即学即用工具</h3>
            <p>提供实用工具和模板，学习后立即应用到你的直播间</p>
            <ul class="feature-list">
              <li>话术模板库</li>
              <li>设备选购清单</li>
              <li>直播间检查表</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. 热门教程区 -->
    <section class="popular-section">
      <div class="container">
        <div class="section-header">
          <div class="header-left">
            <h2 class="section-title">🔥 热门爆款教程</h2>
            <p class="section-subtitle">最受学员欢迎的直播秘籍</p>
          </div>
          <div class="header-right">
            <router-link to="/tutorials" class="view-all">
              查看全部教程 <el-icon><ArrowRight /></el-icon>
            </router-link>
          </div>
        </div>

        <div class="popular-tabs">
          <div class="tab-list">
            <div
              v-for="tab in tabs"
              :key="tab.id"
              :class="['tab-item', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <span class="tab-icon">{{ tab.icon }}</span>
              <span class="tab-text">{{ tab.name }}</span>
            </div>
          </div>
        </div>

        <div class="tutorials-showcase">
          <div class="showcase-main">
            <div
              v-for="tutorial in filteredTutorials"
              :key="tutorial.id"
              class="showcase-card"
              @click="goToTutorial(tutorial.id)"
            >
              <div class="showcase-image">
                <img
                  :src="tutorial.thumbnail_url || getDefaultThumbnail(tutorial.id)"
                  :alt="tutorial.title"
                />
                <div class="showcase-badge" :class="getBadgeClass(tutorial.difficulty)">
                  {{ getDifficultyText(tutorial.difficulty) }}
                </div>
                <div v-if="tutorial.is_free" class="free-badge">免费</div>
                <div class="hover-overlay">
                  <el-button type="primary" circle>
                    <el-icon><VideoPlay /></el-icon>
                  </el-button>
                </div>
              </div>

              <div class="showcase-content">
                <h3 class="showcase-title">{{ tutorial.title }}</h3>
                <p class="showcase-description">{{ tutorial.description }}</p>

                <div class="showcase-meta">
                  <div class="meta-item">
                    <el-icon><Timer /></el-icon>
                    <span>{{ tutorial.estimated_time }}分钟</span>
                  </div>
                  <div class="meta-item">
                    <el-icon><View /></el-icon>
                    <span>{{ tutorial.views }} 人学习</span>
                  </div>
                  <div class="meta-item">
                    <el-icon><Star /></el-icon>
                    <span>{{ tutorial.likes }} 好评</span>
                  </div>
                </div>

                <div class="showcase-rating">
                  <el-rate
                    v-model="tutorial.rating"
                    disabled
                    :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                    show-score
                    text-color="#ff9900"
                  />
                  <span class="rating-text">{{ tutorial.rating.toFixed(1) }}</span>
                </div>

                <div class="showcase-author">
                  <el-avatar :size="24" :src="tutorial.author_avatar" />
                  <span class="author-name">{{ tutorial.author_name }}</span>
                  <span class="author-tag">金牌导师</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. 成功案例区 -->
    <section class="success-section">
      <div class="container">
        <h2 class="section-title">🌟 学员成功故事</h2>
        <p class="section-subtitle">听听他们是如何通过直播学院实现梦想的</p>

        <div class="success-stories">
          <div class="story-card">
            <div class="story-header">
              <el-avatar :size="60" src="https://api.dicebear.com/7.x/avataaars/svg?seed=lily" />
              <div class="story-info">
                <h4>莉莉酱</h4>
                <p>美食主播</p>
              </div>
            </div>
            <div class="story-content">
              <p>"学习了美食直播的技巧后，我的直播间从几十人涨到平均2000+在线，月收入翻了10倍！"</p>
            </div>
            <div class="story-stats">
              <div class="stat-item">
                <span class="stat-value">2000+</span>
                <span class="stat-label">场均在线</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">10倍</span>
                <span class="stat-label">收入增长</span>
              </div>
            </div>
          </div>

          <div class="story-card">
            <div class="story-header">
              <el-avatar :size="60" src="https://api.dicebear.com/7.x/avataaars/svg?seed=mike" />
              <div class="story-info">
                <h4>麦克队长</h4>
                <p>游戏主播</p>
              </div>
            </div>
            <div class="story-content">
              <p>"互动话术和气氛调动技巧真的很有用，现在直播间礼物不断，粉丝粘性大大提高！"</p>
            </div>
            <div class="story-stats">
              <div class="stat-item">
                <span class="stat-value">85%</span>
                <span class="stat-label">互动率</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">500%</span>
                <span class="stat-label">礼物增长</span>
              </div>
            </div>
          </div>

          <div class="story-card">
            <div class="story-header">
              <el-avatar :size="60" src="https://api.dicebear.com/7.x/avataaars/svg?seed=anna" />
              <div class="story-info">
                <h4>安娜学姐</h4>
                <p>知识主播</p>
              </div>
            </div>
            <div class="story-content">
              <p>"从不知道如何开播到拥有稳定的粉丝群体，直播学院给了我系统的指导和方法论。"</p>
            </div>
            <div class="story-stats">
              <div class="stat-item">
                <span class="stat-value">10w+</span>
                <span class="stat-label">粉丝增长</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">3个</span>
                <span class="stat-label">品牌合作</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. CTA行动号召区 -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">准备好开启你的直播事业了吗？</h2>
          <p class="cta-description">立即加入直播学院，开启你的主播成长之旅</p>

          <div class="cta-actions">
            <el-button type="primary" size="large" @click="startFreeTrial">
              <el-icon><VideoCamera /></el-icon>
              免费试学7天
            </el-button>
            <el-button type="success" size="large" @click="bookConsultation">
              <el-icon><ChatDotSquare /></el-icon>
              预约导师咨询
            </el-button>
          </div>

          <div class="cta-features">
            <div class="feature">
              <el-icon><Check /></el-icon>
              <span>7天免费试学</span>
            </div>
            <div class="feature">
              <el-icon><Check /></el-icon>
              <span>30天无理由退款</span>
            </div>
            <div class="feature">
              <el-icon><Check /></el-icon>
              <span>永久课程更新</span>
            </div>
            <div class="feature">
              <el-icon><Check /></el-icon>
              <span>导师终身答疑</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import HeroCarousel from '@/components/HeroCarousel.vue'

const router = useRouter()

// 标签页状态
const tabs = ref([
  { id: 'all', name: '全部热门', icon: '🔥' },
  { id: 'new', name: '最新发布', icon: '🆕' },
  { id: 'rising', name: '急速上升', icon: '📈' },
  { id: 'free', name: '免费精选', icon: '🎁' },
  { id: 'advanced', name: '高阶技巧', icon: '⭐' },
])
const activeTab = ref('all')

// 教程数据（模拟）
const tutorials = ref([
  {
    id: 1,
    title: '直播间场景布置终极指南',
    description: '从零打造专业直播间，让你的画面秒杀99%主播',
    category_id: 2,
    difficulty: 2,
    estimated_time: 60,
    views: 12543,
    likes: 892,
    rating: 4.8,
    is_free: true,
    thumbnail_url:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop',
    author_name: '场景设计大师',
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design',
    tags: ['场景', '灯光', '背景'],
  },
  {
    id: 2,
    title: '美颜参数精细调节秘籍',
    description: '告别网红脸，打造自然又上镜的直播美颜参数',
    category_id: 3,
    difficulty: 3,
    estimated_time: 45,
    views: 23456,
    likes: 1567,
    rating: 4.9,
    is_free: true,
    thumbnail_url:
      'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=600&auto=format&fit=crop',
    author_name: '美颜研究员',
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beauty',
    tags: ['美颜', '参数', '颜值'],
  },
  {
    id: 3,
    title: '电商直播转化率翻倍技巧',
    description: '单场直播GMV提升300%的秘密武器',
    category_id: 5,
    difficulty: 4,
    estimated_time: 90,
    views: 18976,
    likes: 1345,
    rating: 4.7,
    is_free: false,
    thumbnail_url:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop',
    author_name: '带货王导师',
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sales',
    tags: ['电商', '转化', '带货'],
  },
])

// 计算过滤后的教程
const filteredTutorials = computed(() => {
  let filtered = [...tutorials.value]

  if (activeTab.value === 'new') {
    // 按ID倒序，模拟最新发布
    filtered.sort((a, b) => b.id - a.id)
  } else if (activeTab.value === 'rising') {
    // 按浏览量排序，模拟上升趋势
    filtered.sort((a, b) => b.views - a.views)
  } else if (activeTab.value === 'free') {
    filtered = filtered.filter((t) => t.is_free)
  } else if (activeTab.value === 'advanced') {
    filtered = filtered.filter((t) => t.difficulty >= 4)
  }

  return filtered
})

// 工具函数
const getDefaultThumbnail = (id) => {
  const thumbnails = [
    'https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=600&auto=format&fit=crop',
  ]
  return thumbnails[(id - 1) % thumbnails.length]
}

const getBadgeClass = (difficulty) => {
  if (difficulty <= 2) return 'badge-beginner'
  if (difficulty === 3) return 'badge-intermediate'
  return 'badge-advanced'
}

const getDifficultyText = (difficulty) => {
  const texts = ['入门', '简单', '中等', '进阶', '专家']
  return texts[difficulty - 1] || '入门'
}

// 导航函数
const goToCategory = (categoryId) => {
  router.push(`/tutorials?category=${categoryId}`)
}

const goToTutorial = (tutorialId) => {
  router.push(`/tutorial/${tutorialId}`)
}

const startFreeTrial = () => {
  ElMessage.success('已为您开启7天免费试学，现在开始学习吧！')
}

const bookConsultation = () => {
  ElMessage.info('预约导师咨询功能即将开放，敬请期待！')
}
</script>

<style scoped>
.home-page {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 15px;
  text-align: center;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #718096;
  text-align: center;
  margin-bottom: 50px;
}

/* ===== 英雄轮播区 ===== */
.hero-section {
  margin: 20px 0 40px;
}

/* ===== 快速导航区 ===== */
.quick-nav-section {
  padding: 80px 0;
  background: white;
}

.quick-nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-top: 50px;
}

.nav-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s;
  border: 2px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s;
}

.nav-card:hover {
  transform: translateY(-10px);
  border-color: #667eea;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
}

.nav-card:hover::before {
  opacity: 1;
}

.nav-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 32px;
}

.nav-card h3 {
  font-size: 1.4rem;
  color: #2d3748;
  margin-bottom: 10px;
}

.nav-card > p {
  color: #718096;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.nav-stats {
  display: flex;
  justify-content: center;
  gap: 10px;
  color: #a0aec0;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.nav-progress {
  margin-top: 20px;
}

.nav-progress span {
  display: block;
  margin-top: 8px;
  color: #4a5568;
  font-size: 0.85rem;
}

/* ===== 特色优势区 ===== */
.features-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 50px;
}

.feature-item {
  background: white;
  border-radius: 20px;
  padding: 35px 25px;
  position: relative;
  transition: all 0.4s;
  border: 1px solid #e2e8f0;
}

.feature-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  color: white;
  font-size: 28px;
}

.feature-item h3 {
  font-size: 1.4rem;
  color: #2d3748;
  margin-bottom: 15px;
}

.feature-item > p {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  color: #4a5568;
  margin-bottom: 10px;
  font-size: 0.9rem;
  padding-left: 20px;
  position: relative;
}

.feature-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #48bb78;
  font-weight: bold;
}

/* ===== 热门教程区 ===== */
.popular-section {
  padding: 80px 0;
  background: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.header-left {
  flex: 1;
}

.header-right {
  flex-shrink: 0;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.view-all:hover {
  color: #764ba2;
  transform: translateX(5px);
}

/* 标签页 */
.popular-tabs {
  margin-bottom: 40px;
}

.tab-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tab-item {
  padding: 12px 25px;
  background: white;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s;
  font-weight: 500;
  color: #4a5568;
}

.tab-item:hover {
  border-color: #667eea;
  color: #667eea;
}

.tab-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.tab-icon {
  font-size: 1.2rem;
}

/* 教程展示 */
.tutorials-showcase {
  margin-top: 30px;
}

.showcase-main {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.showcase-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s;
  border: 1px solid #e2e8f0;
  position: relative;
}

.showcase-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.showcase-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.showcase-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.showcase-card:hover .showcase-image img {
  transform: scale(1.1);
}

.showcase-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}

.badge-beginner {
  background: #48bb78;
}

.badge-intermediate {
  background: #ed8936;
}

.badge-advanced {
  background: #f56565;
}

.free-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #38a169;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.showcase-card:hover .hover-overlay {
  opacity: 1;
}

.showcase-content {
  padding: 25px;
}

.showcase-title {
  font-size: 1.3rem;
  color: #2d3748;
  margin-bottom: 12px;
  line-height: 1.4;
}

.showcase-description {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.95rem;
  height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.showcase-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #a0aec0;
  font-size: 0.9rem;
}

.meta-item .el-icon {
  font-size: 16px;
}

.showcase-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.rating-text {
  font-weight: 700;
  color: #ed8936;
  font-size: 1.1rem;
}

.showcase-author {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.author-name {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
}

.author-tag {
  background: #fffaf0;
  color: #d69e2e;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: auto;
}

/* ===== 成功案例区 ===== */
.success-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
}

.success-stories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
}

.story-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  transition: all 0.4s;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.story-card::before {
  content: '"';
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 80px;
  color: #e2e8f0;
  font-family: serif;
  line-height: 1;
}

.story-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.story-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.story-info h4 {
  font-size: 1.2rem;
  color: #2d3748;
  margin-bottom: 5px;
}

.story-info p {
  color: #718096;
  font-size: 0.9rem;
}

.story-content {
  margin-bottom: 25px;
}

.story-content p {
  color: #4a5568;
  line-height: 1.7;
  font-style: italic;
  font-size: 1.05rem;
}

.story-stats {
  display: flex;
  gap: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  color: #a0aec0;
  font-size: 0.9rem;
}

/* ===== CTA行动号召区 ===== */
.cta-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=1600&auto=format&fit=crop&q=80&blur=100');
  background-size: cover;
  opacity: 0.1;
}

.cta-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
}

.cta-description {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 50px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
}

.cta-actions .el-button {
  padding: 20px 40px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.cta-actions .el-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.cta-actions .el-button:first-child {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}

.cta-actions .el-button:last-child {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.cta-features {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
}

.feature .el-icon {
  color: #ffd700;
}

/* ===== 响应式设计 ===== */
@media (max-width: 1200px) {
  .quick-nav-grid,
  .features-grid,
  .showcase-main,
  .success-stories {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1.1rem;
  }

  .quick-nav-grid,
  .features-grid,
  .showcase-main,
  .success-stories {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .tab-list {
    justify-content: center;
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta-actions .el-button {
    width: 100%;
    max-width: 300px;
  }

  .cta-title {
    font-size: 2rem;
  }

  .cta-description {
    font-size: 1.1rem;
  }

  .cta-features {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .tab-list {
    flex-direction: column;
  }

  .tab-item {
    justify-content: center;
  }

  .showcase-card {
    margin: 0 10px;
  }
}
</style>
