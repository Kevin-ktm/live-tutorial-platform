<template>
  <div class="not-found-page">
    <div class="container">
      <div class="error-content">
        <!-- 错误代码 -->
        <div class="error-code">
          <div class="code">404</div>
          <div class="text">页面未找到</div>
        </div>

        <!-- 错误信息 -->
        <div class="error-message">
          <h1>哎呀！您访问的页面走丢了</h1>
          <p class="description">
            可能是链接地址有误，或者页面已被移除。<br />
            您可以检查URL是否正确，或返回首页继续浏览。
          </p>

          <!-- 搜索框 -->
          <div class="search-section">
            <p class="search-hint">或者搜索您想要的内容：</p>
            <div class="search-box">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索教程、分类、社区..."
                size="large"
                @keyup.enter="handleSearch"
              >
                <template #append>
                  <el-button @click="handleSearch">
                    <el-icon><Search /></el-icon>
                    搜索
                  </el-button>
                </template>
              </el-input>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="goHome">
              <el-icon><HomeFilled /></el-icon>
              返回首页
            </el-button>

            <el-button type="default" size="large" @click="goBack">
              <el-icon><ArrowLeft /></el-icon>
              返回上一页
            </el-button>

            <el-button type="info" size="large" @click="goToTutorials">
              <el-icon><Notebook /></el-icon>
              浏览教程
            </el-button>
          </div>

          <!-- 热门推荐 -->
          <div class="recommendations">
            <h3>热门推荐</h3>
            <div class="recommendation-list">
              <div
                v-for="item in recommendations"
                :key="item.id"
                class="recommendation-item"
                @click="goTo(item.path)"
              >
                <el-icon class="item-icon"><component :is="item.icon" /></el-icon>
                <div class="item-content">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 趣味插画 -->
        <div class="error-illustration">
          <div class="illustration-container">
            <div class="book-shelf">
              <div class="book book-1"></div>
              <div class="book book-2"></div>
              <div class="book book-3"></div>
              <div class="book book-4"></div>
            </div>
            <div class="magnifying-glass">
              <div class="glass"></div>
              <div class="handle"></div>
            </div>
            <div class="glow"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const searchKeyword = ref('')

// 推荐内容
const recommendations = ref([
  {
    id: 1,
    title: '直播设备选购指南',
    description: '从入门到专业，全面讲解直播设备选择',
    path: '/tutorial/1',
    icon: 'VideoCamera',
  },
  {
    id: 2,
    title: '场景布置技巧',
    description: '打造专业又温馨的直播间环境',
    path: '/tutorial/2',
    icon: 'Picture',
  },
  {
    id: 3,
    title: '美颜参数调节',
    description: '展现最佳直播形象的参数设置',
    path: '/tutorial/3',
    icon: 'Brush',
  },
  {
    id: 4,
    title: '社区交流',
    description: '与其他主播交流心得和经验',
    path: '/community',
    icon: 'ChatDotRound',
  },
])

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到教程库
const goToTutorials = () => {
  router.push('/tutorials')
}

// 搜索功能
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`)
  } else {
    ElMessage.warning('请输入搜索关键词')
  }
}

// 跳转到推荐内容
const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  padding: 60px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.error-content {
  display: flex;
  gap: 80px;
  align-items: center;
  justify-content: space-between;
}

/* 错误代码样式 */
.error-code {
  text-align: center;
  flex-shrink: 0;
}

.code {
  font-size: 10rem;
  font-weight: 900;
  color: #667eea;
  line-height: 1;
  text-shadow:
    3px 3px 0 rgba(102, 126, 234, 0.2),
    6px 6px 0 rgba(102, 126, 234, 0.1);
  margin-bottom: 10px;
}

.text {
  font-size: 1.8rem;
  font-weight: 600;
  color: #4a5568;
  letter-spacing: 2px;
}

/* 错误信息样式 */
.error-message {
  flex: 1;
}

.error-message h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 20px;
  line-height: 1.2;
}

.description {
  font-size: 1.1rem;
  color: #718096;
  line-height: 1.6;
  margin-bottom: 40px;
}

/* 搜索框样式 */
.search-section {
  margin-bottom: 40px;
}

.search-hint {
  font-size: 0.95rem;
  color: #4a5568;
  margin-bottom: 15px;
}

.search-box {
  max-width: 500px;
}

.search-box :deep(.el-input-group__append) {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.search-box :deep(.el-input-group__append .el-button) {
  background: transparent;
  border: none;
  color: white;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 50px;
}

.action-buttons .el-button {
  padding: 12px 30px;
  font-weight: 600;
}

/* 推荐内容样式 */
.recommendations h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
}

.recommendation-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.recommendation-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.recommendation-item:hover {
  transform: translateY(-5px);
  border-color: #667eea;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.15);
}

.item-icon {
  font-size: 28px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 12px;
  border-radius: 10px;
  flex-shrink: 0;
}

.item-content h4 {
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 8px;
}

.item-content p {
  font-size: 0.9rem;
  color: #718096;
  line-height: 1.4;
}

/* 插画样式 */
.error-illustration {
  flex-shrink: 0;
  width: 300px;
}

.illustration-container {
  position: relative;
  width: 300px;
  height: 300px;
}

.book-shelf {
  position: absolute;
  bottom: 0;
  left: 50px;
  width: 200px;
  height: 80px;
  background: #a78bfa;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  padding: 10px;
  gap: 8px;
}

.book {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 4px;
  flex: 1;
}

.book-1 {
  height: 60px;
}
.book-2 {
  height: 50px;
}
.book-3 {
  height: 70px;
}
.book-4 {
  height: 40px;
}

.magnifying-glass {
  position: absolute;
  top: 40px;
  right: 40px;
  transform: rotate(-15deg);
}

.glass {
  width: 80px;
  height: 80px;
  border: 8px solid #667eea;
  border-radius: 50%;
  position: relative;
}

.glass:before {
  content: '';
  position: absolute;
  bottom: -25px;
  right: -25px;
  width: 40px;
  height: 8px;
  background: #667eea;
  border-radius: 4px;
  transform: rotate(45deg);
}

.handle {
  position: absolute;
  bottom: -40px;
  right: -40px;
  width: 60px;
  height: 8px;
  background: #667eea;
  border-radius: 4px;
  transform: rotate(45deg);
}

.glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, rgba(102, 126, 234, 0) 70%);
  border-radius: 50%;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .error-content {
    flex-direction: column;
    gap: 40px;
  }

  .error-illustration {
    width: 250px;
  }

  .illustration-container {
    width: 250px;
    height: 250px;
  }
}

@media (max-width: 768px) {
  .code {
    font-size: 8rem;
  }

  .error-message h1 {
    font-size: 2rem;
  }

  .recommendation-list {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .book-shelf {
    width: 150px;
    left: 20px;
  }

  .glass {
    width: 60px;
    height: 60px;
    border-width: 6px;
  }
}

@media (max-width: 480px) {
  .error-content {
    gap: 30px;
  }

  .code {
    font-size: 6rem;
  }

  .text {
    font-size: 1.4rem;
  }

  .error-message h1 {
    font-size: 1.8rem;
  }

  .error-illustration {
    width: 200px;
  }

  .illustration-container {
    width: 200px;
    height: 200px;
  }
}
</style>
