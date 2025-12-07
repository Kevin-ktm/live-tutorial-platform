<template>
  <div class="categories-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>分类浏览</h1>
        <p>按分类系统学习直播知识</p>
      </div>

      <!-- 分类网格 -->
      <div class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          @click="goToCategory(category.id)"
        >
          <div class="category-icon">
            <el-icon><component :is="category.icon" /></el-icon>
          </div>
          <h3>{{ category.name }}</h3>
          <p>{{ category.description }}</p>
          <div class="category-stats">
            <span>{{ category.tutorialCount }} 个教程</span>
            <span>{{ category.totalTime }} 分钟</span>
          </div>
          <el-button type="primary" plain class="explore-btn"> 探索 </el-button>
        </div>
      </div>

      <!-- 分类详情 -->
      <div v-if="selectedCategory" class="category-detail">
        <h2>{{ selectedCategory.name }}</h2>
        <p>{{ selectedCategory.description }}</p>

        <div class="tutorials-list">
          <div
            v-for="tutorial in categoryTutorials"
            :key="tutorial.id"
            class="tutorial-item"
            @click="goToTutorial(tutorial.id)"
          >
            <div class="tutorial-info">
              <h4>{{ tutorial.title }}</h4>
              <p>{{ tutorial.description }}</p>
              <div class="tutorial-meta">
                <el-tag size="small" :type="getDifficultyType(tutorial.difficulty)">
                  {{ getDifficultyText(tutorial.difficulty) }}
                </el-tag>
                <span>{{ tutorial.estimated_time }}分钟</span>
                <span>{{ tutorial.views }} 浏览</span>
              </div>
            </div>
            <div class="tutorial-actions">
              <el-button v-if="tutorial.is_free" type="success" size="small" plain>
                免费
              </el-button>
              <el-button type="primary" size="small"> 开始学习 </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 分类数据
const categories = ref([
  {
    id: 1,
    name: '入门基础',
    icon: 'School',
    description: '从零开始的直播入门指南',
    tutorialCount: 8,
    totalTime: 360,
  },
  {
    id: 2,
    name: '场景搭建',
    icon: 'Picture',
    description: '打造专业直播间环境',
    tutorialCount: 6,
    totalTime: 280,
  },
  {
    id: 3,
    name: '技术调试',
    icon: 'Setting',
    description: '设备与软件设置教程',
    tutorialCount: 10,
    totalTime: 420,
  },
  {
    id: 4,
    name: '内容创作',
    icon: 'Edit',
    description: '直播内容策划与制作',
    tutorialCount: 7,
    totalTime: 320,
  },
  {
    id: 5,
    name: '话术沟通',
    icon: 'ChatDotRound',
    description: '互动与销售话术技巧',
    tutorialCount: 9,
    totalTime: 380,
  },
  {
    id: 6,
    name: '运营进阶',
    icon: 'TrendCharts',
    description: '流量获取与数据分析',
    tutorialCount: 5,
    totalTime: 240,
  },
  {
    id: 7,
    name: '商业转化',
    icon: 'Money',
    description: '变现模式与品牌建设',
    tutorialCount: 6,
    totalTime: 300,
  },
  {
    id: 8,
    name: '团播专题',
    icon: 'UserFilled',
    description: '团队协作直播指南',
    tutorialCount: 4,
    totalTime: 200,
  },
])

// 模拟教程数据
const categoryTutorials = ref([
  {
    id: 1,
    title: '直播设备选购指南',
    description: '全面讲解直播设备的选择要点，从入门级到专业级设备',
    difficulty: 2,
    estimated_time: 45,
    views: 1234,
    is_free: true,
    category_id: 1,
  },
  {
    id: 2,
    title: '首次开播全流程',
    description: '手把手教你完成第一次直播的所有准备工作',
    difficulty: 1,
    estimated_time: 30,
    views: 890,
    is_free: true,
    category_id: 1,
  },
])

const selectedCategory = ref(null)

// 工具函数
const getDifficultyType = (difficulty) => {
  if (difficulty <= 2) return 'success'
  if (difficulty === 3) return 'warning'
  return 'danger'
}

const getDifficultyText = (difficulty) => {
  const texts = ['入门', '简单', '中等', '进阶', '专家']
  return texts[difficulty - 1] || '入门'
}

const goToCategory = (categoryId) => {
  selectedCategory.value = categories.value.find((c) => c.id === categoryId)
  // 模拟加载该分类的教程
  categoryTutorials.value = [
    {
      id: categoryId * 10 + 1,
      title: `${selectedCategory.value.name} - 基础教程`,
      description: '掌握基础知识和操作流程',
      difficulty: 1,
      estimated_time: 30,
      views: 500 + categoryId * 100,
      is_free: true,
      category_id: categoryId,
    },
    {
      id: categoryId * 10 + 2,
      title: `${selectedCategory.value.name} - 进阶技巧`,
      description: '深入学习高级技巧和方法',
      difficulty: 3,
      estimated_time: 45,
      views: 300 + categoryId * 80,
      is_free: true,
      category_id: categoryId,
    },
  ]

  // 滚动到分类详情
  setTimeout(() => {
    const element = document.querySelector('.category-detail')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

const goToTutorial = (tutorialId) => {
  router.push(`/tutorial/${tutorialId}`)
}

// 初始化
onMounted(() => {
  // 如果URL中有category参数，自动选择
  const categoryId = route.query.category
  if (categoryId) {
    goToCategory(parseInt(categoryId))
  }
})
</script>

<style scoped>
.categories-page {
  padding: 40px 0;
  min-height: 80vh;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 60px;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.category-card:hover {
  border-color: #409eff;
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(64, 158, 255, 0.1);
}

.category-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 28px;
}

.category-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.category-card p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 15px;
  min-height: 40px;
}

.category-stats {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  font-size: 0.85rem;
  color: #666;
}

.explore-btn {
  margin-top: 15px;
  width: 100%;
}

.category-detail {
  background: white;
  border-radius: 12px;
  padding: 40px;
  margin-top: 40px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.category-detail h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
}

.category-detail > p {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.tutorials-list {
  margin-top: 30px;
}

.tutorial-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.tutorial-item:hover {
  border-color: #409eff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.tutorial-info {
  flex: 1;
}

.tutorial-info h4 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
}

.tutorial-info p {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.tutorial-meta {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 0.9rem;
}

.tutorial-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .tutorial-item {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .tutorial-actions {
    justify-content: flex-end;
  }
}
</style>
