<template>
  <div class="search-page">
    <div class="container">
      <!-- 搜索框 -->
      <div class="search-header">
        <h1>搜索教程</h1>
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="输入关键词搜索教程..."
            size="large"
            @keyup.enter="performSearch"
            @clear="handleClear"
            clearable
          >
            <template #append>
              <el-button @click="performSearch" type="primary">
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
            </template>
          </el-input>
        </div>

        <!-- 热门搜索标签 -->
        <div class="popular-tags">
          <span class="tags-label">热门搜索：</span>
          <div class="tags-list">
            <el-tag
              v-for="tag in popularTags"
              :key="tag"
              class="tag-item"
              @click="searchByTag(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 搜索条件 -->
      <div v-if="showResults" class="search-conditions">
        <div class="conditions-row">
          <div class="condition-group">
            <span>分类：</span>
            <el-select v-model="selectedCategory" placeholder="全部分类" clearable size="small">
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </div>

          <div class="condition-group">
            <span>难度：</span>
            <el-select v-model="selectedDifficulty" placeholder="全部难度" clearable size="small">
              <el-option label="入门" value="1" />
              <el-option label="简单" value="2" />
              <el-option label="中等" value="3" />
              <el-option label="进阶" value="4" />
              <el-option label="专家" value="5" />
            </el-select>
          </div>

          <div class="condition-group">
            <span>排序：</span>
            <el-select v-model="sortBy" size="small">
              <el-option label="相关性" value="relevance" />
              <el-option label="最新发布" value="newest" />
              <el-option label="最多浏览" value="popular" />
              <el-option label="学习时长" value="duration" />
            </el-select>
          </div>

          <el-button @click="resetFilters" plain size="small">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-if="showResults" class="search-results">
        <div class="results-header">
          <h2>搜索结果</h2>
          <span class="results-count">共 {{ searchResults.length }} 个相关教程</span>
        </div>

        <div v-if="loading" class="loading-state">
          <el-skeleton :rows="5" animated />
        </div>

        <div v-else-if="searchResults.length > 0" class="results-list">
          <div
            v-for="result in searchResults"
            :key="result.id"
            class="result-item"
            @click="goToTutorial(result.id)"
          >
            <div class="result-content">
              <h3>{{ highlightKeywords(result.title) }}</h3>
              <p class="result-description">{{ highlightKeywords(result.description) }}</p>

              <div class="result-meta">
                <el-tag size="small" :type="getDifficultyType(result.difficulty)">
                  {{ getDifficultyText(result.difficulty) }}
                </el-tag>
                <span class="meta-item">
                  <el-icon><Folder /></el-icon>
                  {{ getCategoryName(result.category_id) }}
                </span>
                <span class="meta-item">
                  <el-icon><Timer /></el-icon>
                  {{ result.estimated_time }}分钟
                </span>
                <span class="meta-item">
                  <el-icon><View /></el-icon>
                  {{ result.views }} 浏览
                </span>
                <span v-if="result.is_free" class="free-badge">
                  <el-icon><PriceTag /></el-icon>
                  免费
                </span>
              </div>
            </div>

            <div class="result-actions">
              <el-button type="primary" size="small"> 查看详情 </el-button>
            </div>
          </div>
        </div>

        <div v-else class="empty-results">
          <el-empty description="没有找到相关教程">
            <template #image>
              <el-icon size="80"><Search /></el-icon>
            </template>
            <p class="empty-tips">尝试其他关键词，或者浏览<a href="/tutorials">所有教程</a></p>
          </el-empty>
        </div>
      </div>

      <!-- 推荐内容 -->
      <div v-else class="recommendations">
        <h2>热门推荐</h2>
        <div class="recommend-grid">
          <div
            v-for="item in recommendedTutorials"
            :key="item.id"
            class="recommend-item"
            @click="goToTutorial(item.id)"
          >
            <div class="recommend-thumb">
              <img :src="item.thumbnail" alt="教程封面" />
            </div>
            <div class="recommend-info">
              <h4>{{ item.title }}</h4>
              <p>{{ item.description }}</p>
              <div class="recommend-meta">
                <el-tag size="small">{{ getDifficultyText(item.difficulty) }}</el-tag>
                <span>{{ item.estimated_time }}分钟</span>
                <span>{{ item.views }} 浏览</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 搜索状态
const searchKeyword = ref('')
const showResults = ref(false)
const loading = ref(false)

// 筛选条件
const selectedCategory = ref(null)
const selectedDifficulty = ref(null)
const sortBy = ref('relevance')

// 数据
const popularTags = ref([
  '直播设备',
  '场景布置',
  '美颜参数',
  '话术技巧',
  '互动方法',
  '涨粉策略',
  '变现技巧',
  '团播',
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

// 模拟搜索结果
const searchResults = ref([])

// 推荐教程
const recommendedTutorials = ref([
  {
    id: 1,
    title: '直播设备选购指南',
    description: '全面讲解直播设备的选择要点',
    difficulty: 2,
    estimated_time: 45,
    views: 1234,
    thumbnail:
      'https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=400&auto=format&fit=crop',
    category_id: 1,
  },
  {
    id: 2,
    title: '娱乐直播场景布置技巧',
    description: '打造专业又温馨的直播间环境',
    difficulty: 3,
    estimated_time: 60,
    views: 2345,
    thumbnail:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop',
    category_id: 2,
  },
  {
    id: 3,
    title: '直播美颜参数精细调节',
    description: '从基础到高级，一步步教你调节美颜参数',
    difficulty: 2,
    estimated_time: 40,
    views: 1876,
    thumbnail:
      'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=400&auto=format&fit=crop',
    category_id: 3,
  },
])

// 搜索功能
const performSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  showResults.value = true
  loading.value = true

  // 模拟搜索延迟
  setTimeout(() => {
    // 这里应该是API调用，暂时使用模拟数据
    searchResults.value = getMockSearchResults(searchKeyword.value)
    loading.value = false
  }, 500)
}

const searchByTag = (tag) => {
  searchKeyword.value = tag
  performSearch()
}

const handleClear = () => {
  searchResults.value = []
  showResults.value = false
}

const resetFilters = () => {
  selectedCategory.value = null
  selectedDifficulty.value = null
  sortBy.value = 'relevance'
  performSearch()
}

// 工具函数
const getMockSearchResults = (keyword) => {
  const allTutorials = [
    {
      id: 1,
      title: '直播设备选购指南',
      description: '全面讲解直播设备的选择要点，从入门级到专业级设备',
      category_id: 1,
      difficulty: 2,
      estimated_time: 45,
      views: 1234,
      is_free: true,
    },
    {
      id: 2,
      title: '娱乐直播场景布置技巧',
      description: '打造专业又温馨的直播间环境，让你的直播画面更具吸引力',
      category_id: 2,
      difficulty: 3,
      estimated_time: 60,
      views: 2345,
      is_free: true,
    },
    {
      id: 3,
      title: '直播美颜参数精细调节',
      description: '从基础到高级，一步步教你调节美颜参数，展现最佳直播形象',
      category_id: 3,
      difficulty: 2,
      estimated_time: 40,
      views: 1876,
      is_free: true,
    },
    {
      id: 4,
      title: '直播互动话术技巧',
      description: '学会与观众有效互动，提升直播间活跃度',
      category_id: 5,
      difficulty: 3,
      estimated_time: 50,
      views: 3124,
      is_free: false,
    },
  ]

  if (!keyword) return allTutorials

  const lowerKeyword = keyword.toLowerCase()
  return allTutorials.filter(
    (tutorial) =>
      tutorial.title.toLowerCase().includes(lowerKeyword) ||
      tutorial.description.toLowerCase().includes(lowerKeyword),
  )
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId)
  return category ? category.name : '未分类'
}

const getDifficultyType = (difficulty) => {
  if (difficulty <= 2) return 'success'
  if (difficulty === 3) return 'warning'
  return 'danger'
}

const getDifficultyText = (difficulty) => {
  const texts = ['入门', '简单', '中等', '进阶', '专家']
  return texts[difficulty - 1] || '入门'
}

const highlightKeywords = (text) => {
  if (!searchKeyword.value || !text) return text

  const regex = new RegExp(`(${searchKeyword.value})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

const goToTutorial = (tutorialId) => {
  router.push(`/tutorial/${tutorialId}`)
}

// 监听URL参数
onMounted(() => {
  if (route.query.q) {
    searchKeyword.value = route.query.q
    performSearch()
  }
})

// 监听筛选条件变化
watch([selectedCategory, selectedDifficulty, sortBy], () => {
  if (showResults.value) {
    performSearch()
  }
})
</script>

<style scoped>
.search-page {
  padding: 40px 0;
  min-height: 80vh;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
}

.search-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
}

.search-box {
  max-width: 600px;
  margin: 0 auto 20px;
}

.popular-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}

.tags-label {
  color: #666;
  font-weight: 500;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s;
}

.tag-item:hover {
  transform: translateY(-2px);
}

.search-conditions {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.conditions-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.condition-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.condition-group span {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.search-results {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f7ff;
}

.results-header h2 {
  font-size: 1.8rem;
  color: #333;
}

.results-count {
  color: #666;
  font-size: 0.9rem;
}

.loading-state {
  padding: 40px 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 25px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.result-item:hover {
  border-color: #409eff;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.result-content {
  flex: 1;
}

.result-content h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.result-content h3 :deep(.highlight) {
  background: #fff2e8;
  color: #e6a23c;
  padding: 2px 5px;
  border-radius: 4px;
}

.result-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.result-description :deep(.highlight) {
  background: #f0f9ff;
  color: #409eff;
  padding: 2px 5px;
  border-radius: 4px;
}

.result-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #999;
  font-size: 0.85rem;
}

.free-badge {
  background: #52c41a;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.result-actions {
  flex-shrink: 0;
  margin-left: 20px;
}

.empty-results {
  padding: 60px 0;
  text-align: center;
}

.empty-tips {
  margin-top: 15px;
  color: #666;
}

.empty-tips a {
  color: #409eff;
  text-decoration: underline;
}

.recommendations {
  margin-top: 40px;
}

.recommendations h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.recommend-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.recommend-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.recommend-thumb {
  height: 160px;
  overflow: hidden;
}

.recommend-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.recommend-item:hover .recommend-thumb img {
  transform: scale(1.05);
}

.recommend-info {
  padding: 20px;
}

.recommend-info h4 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
}

.recommend-info p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.5;
}

.recommend-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #999;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .conditions-row {
    flex-direction: column;
    align-items: stretch;
  }

  .condition-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .result-item {
    flex-direction: column;
  }

  .result-actions {
    margin-left: 0;
    margin-top: 15px;
    width: 100%;
  }

  .result-actions .el-button {
    width: 100%;
  }

  .recommend-grid {
    grid-template-columns: 1fr;
  }
}
</style>
