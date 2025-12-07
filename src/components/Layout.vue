<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-container">
        <!-- Logo区域 -->
        <div class="logo-wrapper">
          <router-link to="/" class="logo-link">
            <div class="logo-container">
              <div class="logo-icon">
                <el-icon><VideoCameraFilled /></el-icon>
              </div>
              <div class="logo-text">
                <div class="logo-main">
                  <span class="chinese">直播学院</span>
                  <span class="english">Live Academy</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <!-- 主导航 -->
        <nav class="main-nav">
          <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
            <el-icon><HomeFilled /></el-icon>
            <span class="nav-text">首页</span>
          </router-link>

          <router-link
            to="/tutorials"
            class="nav-item"
            :class="{ active: $route.path.startsWith('/tutorial') }"
          >
            <el-icon><Notebook /></el-icon>
            <span class="nav-text">教程库</span>
          </router-link>

          <router-link
            to="/categories"
            class="nav-item"
            :class="{ active: $route.path === '/categories' }"
          >
            <el-icon><Folder /></el-icon>
            <span class="nav-text">分类</span>
          </router-link>

          <router-link
            to="/community"
            class="nav-item"
            :class="{ active: $route.path === '/community' }"
          >
            <el-icon><ChatDotRound /></el-icon>
            <span class="nav-text">社区</span>
          </router-link>
        </nav>

        <!-- 搜索框 -->
        <div class="search-wrapper">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索教程..."
            clearable
            class="search-input"
            @keyup.enter="handleSearch"
            @clear="clearSearch"
            size="small"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 用户区域 -->
        <div class="user-wrapper">
          <div v-if="!isLoggedIn" class="auth-buttons">
            <el-button
              type="primary"
              size="small"
              @click="router.push('/login')"
              class="login-btn"
              round
            >
              登录
            </el-button>
            <el-button
              type="default"
              size="small"
              @click="router.push('/register')"
              class="register-btn"
              round
            >
              注册
            </el-button>
          </div>

          <div v-else class="user-info">
            <el-dropdown trigger="click">
              <div class="user-dropdown-trigger">
                <el-avatar
                  :size="32"
                  :src="
                    userStore.profile?.avatar_url ||
                    'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
                  "
                  class="user-avatar"
                />
                <span class="user-name">{{ userStore.profile?.username || '用户' }}</span>
                <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="router.push('/profile')">
                    <el-icon><User /></el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item @click="router.push('/profile?tab=favorites')">
                    <el-icon><Star /></el-icon>
                    我的收藏
                  </el-dropdown-item>
                  <el-dropdown-item @click="router.push('/profile?tab=progress')">
                    <el-icon><DataLine /></el-icon>
                    学习进度
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="app-main">
      <router-view />
    </main>

    <!-- 底部信息 -->
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-main">
          <div class="footer-section">
            <h3 class="footer-title">
              <span class="logo-icon">🎥</span>
              直播学院
            </h3>
            <p class="footer-description">
              一站式直播教学平台，从入门到专业<br />
              助你成为直播达人
            </p>
            <div class="social-links">
              <a href="#" class="social-link" title="微信公众号">
                <el-icon><ChatDotSquare /></el-icon>
              </a>
              <a href="#" class="social-link" title="微博">
                <el-icon><Comment /></el-icon>
              </a>
              <a href="#" class="social-link" title="抖音">
                <el-icon><VideoPlay /></el-icon>
              </a>
            </div>
          </div>

          <div class="footer-section">
            <h4 class="section-title">学习资源</h4>
            <ul class="footer-links">
              <li><router-link to="/tutorials">全部教程</router-link></li>
              <li><router-link to="/categories">分类浏览</router-link></li>
              <li><router-link to="/search">搜索教程</router-link></li>
              <li><a href="#" @click.prevent="showComingSoon">热门专题</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="section-title">平台支持</h4>
            <ul class="footer-links">
              <li><a href="#" @click.prevent="showAbout">关于我们</a></li>
              <li><a href="#" @click.prevent="showContact">联系我们</a></li>
              <li><a href="#" @click.prevent="showHelp">帮助中心</a></li>
              <li><a href="#" @click.prevent="showPrivacy">隐私政策</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="section-title">联系方式</h4>
            <div class="contact-info">
              <p>
                <el-icon><Message /></el-icon> support@liveacademy.com
              </p>
              <p>
                <el-icon><Phone /></el-icon> 400-123-4567
              </p>
              <p>
                <el-icon><Location /></el-icon> 北京市朝阳区直播大厦
              </p>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="copyright">
            <p>&copy; 2024 直播学院. 保留所有权利.</p>
            <p class="footer-extra">
              <span>京ICP备12345678号</span>
              <span class="divider">|</span>
              <span>京公网安备11010502030001号</span>
            </p>
          </div>

          <div class="footer-notice">
            <p>
              <el-icon><InfoFilled /></el-icon>
              温馨提示：本平台内容仅供参考，实际直播请遵守相关法律法规
            </p>
          </div>
        </div>
      </div>
    </footer>

    <!-- 回到顶部按钮 -->
    <el-backtop :right="40" :bottom="40" target=".app-main">
      <div class="backtop-content">
        <el-icon><ArrowUp /></el-icon>
      </div>
    </el-backtop>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')

// 计算登录状态
const isLoggedIn = computed(() => {
  return !!userStore.user
})

// 初始化用户状态
onMounted(() => {
  userStore.initialize()
})

// 搜索功能
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`)
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '确认退出', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/')
  } catch (error) {
    // 用户取消了操作
  }
}

// 底部链接功能
const showComingSoon = () => {
  ElMessage.info('该功能正在开发中，敬请期待！')
}

const showAbout = () => {
  ElMessageBox.alert(
    '直播学院 - 一站式直播教学平台\n\n我们致力于为直播爱好者提供最全面、最实用的教学内容，涵盖从入门到专业的全流程指导。',
    '关于我们',
    {
      confirmButtonText: '知道了',
    },
  )
}

const showContact = () => {
  ElMessageBox.alert(
    '📧 邮箱：support@liveacademy.com\n📞 电话：400-123-4567\n📍 地址：北京市朝阳区直播大厦\n⏰ 工作时间：周一至周五 9:00-18:00',
    '联系我们',
    {
      confirmButtonText: '好的',
    },
  )
}

const showHelp = () => {
  ElMessage.info('帮助中心功能正在开发中')
}

const showPrivacy = () => {
  ElMessageBox.alert(
    '隐私政策\n\n我们非常重视您的隐私，将严格保护您的个人信息。详细政策请访问我们的官网查看完整文档。',
    '隐私政策',
    {
      confirmButtonText: '知道了',
    },
  )
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== 顶部导航栏样式 ===== */
.app-header {
  background: white;
  border-bottom: 1px solid #f0f2f5;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo区域 */
.logo-wrapper {
  flex-shrink: 0;
  margin-right: 30px;
}

.logo-link {
  text-decoration: none;
  display: block;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

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
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
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

/* 主导航 */
.main-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  text-decoration: none;
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s;
  white-space: nowrap;
}

.nav-item:hover {
  background: #f5f7fa;
  color: #409eff;
}

.nav-item.active {
  background: #f0f7ff;
  color: #409eff;
}

.nav-item .el-icon {
  font-size: 16px;
}

/* 搜索框 */
.search-wrapper {
  flex: 1;
  max-width: 280px;
  margin: 0 20px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
}

/* 用户区域 */
.user-wrapper {
  flex-shrink: 0;
  margin-left: 20px;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.login-btn {
  padding: 8px 20px;
  font-weight: 500;
}

.register-btn {
  padding: 8px 20px;
  font-weight: 500;
}

/* 用户信息 */
.user-info {
  cursor: pointer;
}

.user-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  transition: background 0.3s;
}

.user-dropdown-trigger:hover {
  background: #f5f7fa;
}

.user-avatar {
  border: 2px solid #f0f7ff;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  font-size: 12px;
  color: #909399;
}

/* 底部信息 */
.app-footer {
  background: linear-gradient(180deg, #1a202c 0%, #2d3748 100%);
  color: #cbd5e0;
  padding: 60px 0 20px;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-main {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section {
  margin-bottom: 20px;
}

.footer-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
}

.footer-description {
  line-height: 1.6;
  margin-bottom: 20px;
  color: #a0aec0;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #cbd5e0;
  text-decoration: none;
  transition: all 0.3s;
}

.social-link:hover {
  background: #409eff;
  color: white;
  transform: translateY(-2px);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(64, 158, 255, 0.3);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #cbd5e0;
  text-decoration: none;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-links a:hover {
  color: #409eff;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 14px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.copyright {
  text-align: center;
  font-size: 14px;
  color: #a0aec0;
}

.footer-extra {
  font-size: 12px;
  color: #718096;
}

.divider {
  margin: 0 12px;
  color: #4a5568;
}

.footer-notice {
  text-align: center;
  font-size: 12px;
  color: #718096;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 回到顶部按钮 */
.backtop-content {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s;
}

.backtop-content:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-container {
    padding: 0 16px;
  }

  .search-wrapper {
    max-width: 240px;
  }
}

@media (max-width: 768px) {
  .main-nav {
    display: none;
  }

  .search-wrapper {
    display: none;
  }

  .logo-wrapper {
    margin-right: auto;
  }

  .user-wrapper {
    margin-left: auto;
  }

  .user-name {
    display: none;
  }

  .dropdown-icon {
    display: none;
  }

  .user-dropdown-trigger {
    padding: 4px;
  }

  .footer-main {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .auth-buttons {
    gap: 8px;
  }

  .login-btn,
  .register-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .footer-main {
    grid-template-columns: 1fr;
  }
}
</style>

<!-- 全局样式 -->
<style>
/* Element Plus 组件优化 */
.el-dropdown-menu {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
}

.el-dropdown-menu__item {
  border-radius: 4px;
  margin: 2px 8px;
}

.el-dropdown-menu__item:hover {
  background: #f0f7ff;
  color: #409eff;
}

.el-backtop {
  z-index: 999;
}

/* 滚动条优化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
