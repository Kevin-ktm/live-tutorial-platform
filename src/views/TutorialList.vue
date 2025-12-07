<template>
  <div class="tutorial-list-page">
    <div class="container">
      <!-- 页面标题和筛选 -->
      <div class="page-header">
        <div class="header-left">
          <h1>
            <el-icon><Notebook /></el-icon> 教程库
          </h1>
          <p>这里有{{ totalTutorials }}个精心准备的直播教学教程</p>
        </div>
        <div class="header-right">
          <div class="view-controls">
            <el-tooltip content="网格视图" placement="top">
              <el-button
                :type="viewMode === 'grid' ? 'primary' : 'default'"
                size="small"
                @click="viewMode = 'grid'"
              >
                <el-icon><Grid /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="列表视图" placement="top">
              <el-button
                :type="viewMode === 'list' ? 'primary' : 'default'"
                size="small"
                @click="viewMode = 'list'"
              >
                <el-icon><List /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </div>

      <!-- 筛选工具栏 -->
      <div class="filter-toolbar">
        <div class="filter-group">
          <span class="filter-label">分类：</span>
          <el-select v-model="selectedCategory" placeholder="全部分类" clearable size="small">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </div>

        <div class="filter-group">
          <span class="filter-label">难度：</span>
          <el-select v-model="selectedDifficulty" placeholder="全部难度" clearable size="small">
            <el-option label="入门" value="1" />
            <el-option label="简单" value="2" />
            <el-option label="中等" value="3" />
            <el-option label="进阶" value="4" />
            <el-option label="专家" value="5" />
          </el-select>
        </div>

        <div class="filter-group">
          <span class="filter-label">排序：</span>
          <el-select v-model="sortBy" size="small">
            <el-option label="最新发布" value="newest" />
            <el-option label="最多浏览" value="popular" />
            <el-option label="最多收藏" value="favorites" />
            <el-option label="学习时长" value="duration" />
          </el-select>
        </div>

        <div class="filter-group">
          <el-checkbox v-model="showFreeOnly">仅显示免费</el-checkbox>
        </div>

        <div class="filter-group">
          <el-button type="primary" size="small" @click="resetFilters">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </div>

      <!-- 教程列表 -->
      <div class="tutorials-container">
        <!-- 网格视图 -->
        <div v-if="viewMode === 'grid'" class="tutorials-grid">
          <div
            v-for="tutorial in filteredTutorials"
            :key="tutorial.id"
            class="tutorial-card"
            @click="goToTutorial(tutorial.id)"
          >
            <div class="card-image">
              <img
                :src="tutorial.thumbnail_url"
                :alt="tutorial.title"
                @error="handleImageError($event, tutorial.id, tutorial.category_id)"
              />
              <div class="image-overlay">
                <div class="image-badges">
                  <span class="difficulty-badge" :class="getDifficultyClass(tutorial.difficulty)">
                    {{ getDifficultyText(tutorial.difficulty) }}
                  </span>
                  <span v-if="tutorial.is_free" class="free-badge">免费</span>
                </div>
                <div class="play-button">
                  <el-icon><VideoPlay /></el-icon>
                </div>
              </div>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ tutorial.title }}</h3>
              <p class="card-description">{{ tutorial.description }}</p>
              <div class="card-meta">
                <span
                  ><el-icon><Folder /></el-icon> {{ getCategoryName(tutorial.category_id) }}</span
                >
                <span
                  ><el-icon><Timer /></el-icon> {{ tutorial.estimated_time }}分钟</span
                >
                <span
                  ><el-icon><View /></el-icon> {{ tutorial.views }}</span
                >
              </div>
              <div class="card-actions">
                <el-button type="primary" size="small" @click.stop="goToTutorial(tutorial.id)">
                  立即学习
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click.stop="toggleFavorite(tutorial.id)"
                  class="favorite-btn"
                >
                  <el-icon :class="{ 'is-favorite': isFavorite(tutorial.id) }">
                    {{ isFavorite(tutorial.id) ? 'StarFilled' : 'Star' }}
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 列表视图 -->
        <div v-else class="tutorials-list">
          <div
            v-for="tutorial in filteredTutorials"
            :key="tutorial.id"
            class="tutorial-item"
            @click="goToTutorial(tutorial.id)"
          >
            <div class="item-image">
              <img
                :src="tutorial.thumbnail_url"
                :alt="tutorial.title"
                @error="handleImageError($event, tutorial.id, tutorial.category_id)"
              />
              <div class="image-badges">
                <span class="difficulty-badge" :class="getDifficultyClass(tutorial.difficulty)">
                  {{ getDifficultyText(tutorial.difficulty) }}
                </span>
                <span v-if="tutorial.is_free" class="free-badge">免费</span>
              </div>
            </div>
            <div class="item-content">
              <h3 class="item-title">{{ tutorial.title }}</h3>
              <p class="item-description">{{ tutorial.description }}</p>
              <div class="item-meta">
                <span
                  ><el-icon><Folder /></el-icon> {{ getCategoryName(tutorial.category_id) }}</span
                >
                <span
                  ><el-icon><Timer /></el-icon> {{ tutorial.estimated_time }}分钟</span
                >
                <span
                  ><el-icon><View /></el-icon> {{ tutorial.views }} 浏览</span
                >
                <span
                  ><el-icon><Star /></el-icon> {{ tutorial.likes }} 喜欢</span
                >
              </div>
              <div class="item-actions">
                <el-button type="primary" size="small" @click.stop="goToTutorial(tutorial.id)">
                  开始学习
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click.stop="toggleFavorite(tutorial.id)"
                  class="favorite-btn"
                >
                  <el-icon :class="{ 'is-favorite': isFavorite(tutorial.id) }">
                    {{ isFavorite(tutorial.id) ? 'StarFilled' : 'Star' }}
                  </el-icon>
                  {{ isFavorite(tutorial.id) ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredTutorials.length === 0" class="empty-state">
          <el-empty description="没有找到符合条件的教程">
            <template #image>
              <el-icon size="80"><Search /></el-icon>
            </template>
            <el-button type="primary" @click="resetFilters"> 重置筛选条件 </el-button>
          </el-empty>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="filteredTutorials.length > 0" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 48, 96]"
          :total="totalTutorials"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 视图模式
const viewMode = ref('grid')

// 筛选条件
const selectedCategory = ref(null)
const selectedDifficulty = ref(null)
const sortBy = ref('newest')
const showFreeOnly = ref(false)

// 分页
const currentPage = ref(1)
const pageSize = ref(12)

// 模拟数据
const tutorials = ref([
  {
    id: 1,
    title: '直播设备选购指南',
    description: '全面讲解直播设备的选择要点，从入门级到专业级设备',
    category_id: 1,
    difficulty: 2,
    estimated_time: 45,
    views: 1234,
    likes: 89,
    is_free: true,
    thumbnail_url:
      'https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=600&auto=format&fit=crop&q=80',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: '娱乐直播场景布置技巧',
    description: '打造专业又温馨的直播间环境，让你的直播画面更具吸引力',
    category_id: 2,
    difficulty: 3,
    estimated_time: 60,
    views: 2345,
    likes: 156,
    is_free: true,
    thumbnail_url:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    created_at: '2024-01-10T14:30:00Z',
  },
  {
    id: 3,
    title: '直播美颜参数精细调节',
    description: '从基础到高级，一步步教你调节美颜参数，展现最佳直播形象',
    category_id: 3,
    difficulty: 2,
    estimated_time: 40,
    views: 1876,
    likes: 95,
    is_free: true,
    thumbnail_url:
      'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=600&auto=format&fit=crop&q=80',
    created_at: '2024-01-08T09:15:00Z',
  },
  {
    id: 4,
    title: '电商直播转化率翻倍技巧',
    description: '单场直播GMV提升300%的秘密武器，全面解析电商直播变现方法',
    category_id: 5,
    difficulty: 4,
    estimated_time: 90,
    views: 3124,
    likes: 234,
    is_free: false,
    thumbnail_url:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop&q=80',
    created_at: '2024-01-05T11:20:00Z',
  },
  {
    id: 5,
    title: '直播互动话术大全',
    description: '掌握与观众互动的艺术，提升直播间活跃度和礼物收入',
    category_id: 5,
    difficulty: 3,
    estimated_time: 50,
    views: 2789,
    likes: 187,
    is_free: true,
    thumbnail_url:
      'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&auto=format&fit=crop&q=80',
    created_at: '2024-01-03T16:45:00Z',
  },
  {
    id: 6,
    title: '直播间运营数据分析',
    description: '学习如何分析直播数据，优化直播内容和时间安排',
    category_id: 6,
    difficulty: 4,
    estimated_time: 75,
    views: 1567,
    likes: 123,
    is_free: false,
    thumbnail_url:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    created_at: '2024-01-01T09:00:00Z',
  },
])

const categories = ref([
  { id: 1, name: '入门基础' },
  { id: 2, name: '场景搭建' },
  { id: 3, name: '技术调试' },
  { id: 4, name: '内容创作' },
  { id: 5, name: '话术沟通' },
  { id: 6, name: '运营进阶' },
  { id: 7, name: '商业转化' },
  { id: 8, name: '团播专题' },
])

const favorites = ref([1, 3, 5]) // 模拟收藏的教程ID

// 计算属性
const filteredTutorials = computed(() => {
  let result = [...tutorials.value]

  // 分类筛选
  if (selectedCategory.value) {
    result = result.filter((t) => t.category_id === selectedCategory.value)
  }

  // 难度筛选
  if (selectedDifficulty.value) {
    result = result.filter((t) => t.difficulty === parseInt(selectedDifficulty.value))
  }

  // 免费筛选
  if (showFreeOnly.value) {
    result = result.filter((t) => t.is_free)
  }

  // 排序
  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (sortBy.value === 'popular') {
    result.sort((a, b) => b.views - a.views)
  } else if (sortBy.value === 'favorites') {
    result.sort((a, b) => b.likes - a.likes)
  } else if (sortBy.value === 'duration') {
    result.sort((a, b) => b.estimated_time - a.estimated_time)
  }

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

const totalTutorials = computed(() => tutorials.value.length)

// 工具函数
const getCategoryName = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId)
  return category ? category.name : '未分类'
}

const getDifficultyClass = (difficulty) => {
  if (difficulty <= 2) return 'difficulty-beginner'
  if (difficulty === 3) return 'difficulty-intermediate'
  return 'difficulty-advanced'
}

const getDifficultyText = (difficulty) => {
  const texts = ['入门', '简单', '中等', '进阶', '专家']
  return texts[difficulty - 1] || '入门'
}

const isFavorite = (tutorialId) => {
  return favorites.value.includes(tutorialId)
}

// 图片错误处理
const handleImageError = (event, tutorialId, categoryId) => {
  const img = event.target
  // 使用默认图片
  const defaultImages = [
    'https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=600&auto=format&fit=crop&q=80',
  ]
  const index = (tutorialId || 1) % defaultImages.length
  img.src = defaultImages[index]
  img.onerror = null // 防止循环
}

// 方法
const goToTutorial = (tutorialId) => {
  console.log('跳转到教程:', tutorialId)
  router.push(`/tutorial/${tutorialId}`)
}

const toggleFavorite = (tutorialId) => {
  const index = favorites.value.indexOf(tutorialId)
  if (index > -1) {
    favorites.value.splice(index, 1)
    ElMessage.success('已取消收藏')
  } else {
    favorites.value.push(tutorialId)
    ElMessage.success('已添加到收藏')
  }
}

const resetFilters = () => {
  selectedCategory.value = null
  selectedDifficulty.value = null
  sortBy.value = 'newest'
  showFreeOnly.value = false
  currentPage.value = 1
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 初始化
onMounted(() => {
  // 可以在这里调用API获取数据
})
</script>

<style scoped>
.tutorial-list-page {
  padding: 40px 0;
  min-height: 80vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.header-left h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left p {
  color: #666;
  font-size: 1.1rem;
}

.view-controls {
  display: flex;
  gap: 10px;
}

/* 筛选工具栏 */
.filter-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

/* 教程容器 */
.tutorials-container {
  margin-bottom: 40px;
}

/* 网格视图 */
.tutorials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.tutorial-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.tutorial-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow:
    0 20px 60px rgba(64, 158, 255, 0.15),
    0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(64, 158, 255, 0.3);
}

.card-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.tutorial-card:hover .card-image img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
}

.tutorial-card:hover .image-overlay {
  opacity: 1;
}

.image-badges {
  display: flex;
  gap: 8px;
}

.difficulty-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.difficulty-beginner {
  background: linear-gradient(135deg, #48bb78, #38a169);
}

.difficulty-intermediate {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
}

.difficulty-advanced {
  background: linear-gradient(135deg, #f56565, #e53e3e);
}

.free-badge {
  background: linear-gradient(135deg, #9f7aea, #805ad5);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.play-button {
  align-self: center;
  background: rgba(255, 255, 255, 0.9);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409eff;
  font-size: 20px;
  transform: scale(0.8);
  transition: all 0.3s;
}

.tutorial-card:hover .play-button {
  transform: scale(1);
}

.card-content {
  padding: 20px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-description {
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #a0aec0;
  font-size: 0.85rem;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf2f7;
}

.card-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-btn .el-icon {
  transition: all 0.3s;
}

.favorite-btn .el-icon.is-favorite {
  color: #fbbf24;
  animation: heartBeat 0.5s;
}

@keyframes heartBeat {
  0%,
  100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(1.2);
  }
}

/* 列表视图 */
.tutorials-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tutorial-item {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e4e7ed;
}

.tutorial-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.item-image {
  width: 250px;
  height: 180px;
  position: relative;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-badges {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  gap: 8px;
}

.item-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
}

.item-description {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 15px;
  flex: 1;
}

.item-meta {
  display: flex;
  gap: 25px;
  color: #a0aec0;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.item-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-actions {
  display: flex;
  gap: 15px;
}

/* 空状态 */
.empty-state {
  padding: 60px 0;
  text-align: center;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .filter-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .tutorials-grid {
    grid-template-columns: 1fr;
  }

  .tutorial-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .item-meta {
    flex-wrap: wrap;
    gap: 15px;
  }
}
</style>
