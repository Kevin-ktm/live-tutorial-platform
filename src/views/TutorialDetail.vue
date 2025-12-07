<template>
  <div class="tutorial-detail-page">
    <div class="container">
      <!-- 返回按钮 -->
      <div class="back-button" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回教程库</span>
      </div>

      <!-- 教程头部 -->
      <div class="tutorial-header">
        <div class="header-left">
          <div class="breadcrumb">
            <router-link to="/tutorials" class="breadcrumb-link"> 教程库 </router-link>
            <el-icon><ArrowRight /></el-icon>
            <span>{{ getCategoryName(tutorial.category_id) }}</span>
          </div>

          <h1 class="tutorial-title">{{ tutorial.title }}</h1>

          <div class="tutorial-meta">
            <div class="meta-item">
              <el-icon><User /></el-icon>
              <span>{{ tutorial.author_name || '直播学院' }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Calendar /></el-icon>
              <span>{{ formatDate(tutorial.created_at) }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Timer /></el-icon>
              <span>{{ tutorial.estimated_time }}分钟</span>
            </div>
            <div class="meta-item">
              <el-icon><View /></el-icon>
              <span>{{ tutorial.views }} 浏览</span>
            </div>
          </div>

          <div class="tutorial-tags">
            <el-tag size="large" :type="getDifficultyType(tutorial.difficulty)">
              {{ getDifficultyText(tutorial.difficulty) }}
            </el-tag>
            <el-tag v-if="tutorial.is_free" type="success" size="large"> 免费 </el-tag>
            <el-tag type="info" size="large">
              {{ getCategoryName(tutorial.category_id) }}
            </el-tag>
          </div>

          <div class="tutorial-actions">
            <el-button type="primary" size="large" @click="startLearning">
              <el-icon><VideoPlay /></el-icon>
              开始学习
            </el-button>
            <el-button type="default" size="large" @click="toggleFavorite">
              <el-icon :class="{ 'is-favorite': isFavorite }">
                {{ isFavorite ? 'StarFilled' : 'Star' }}
              </el-icon>
              {{ isFavorite ? '已收藏' : '收藏' }}
            </el-button>
            <el-button type="info" size="large" @click="shareTutorial">
              <el-icon><Share /></el-icon>
              分享
            </el-button>
          </div>
        </div>

        <div class="header-right">
          <div class="tutorial-thumbnail">
            <img
              :src="tutorial.thumbnail_url"
              :alt="tutorial.title"
              @error="handleImageError($event, tutorial.id, tutorial.category_id)"
            />
            <div class="thumbnail-overlay">
              <div class="overlay-content">
                <el-icon><ZoomIn /></el-icon>
                <span>查看大图</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 教程内容 -->
      <div class="tutorial-content">
        <div class="content-left">
          <!-- 学习目标 -->
          <div class="learning-objectives section-card">
            <h2>
              <el-icon><Target /></el-icon> 学习目标
            </h2>
            <ul class="objectives-list">
              <li v-for="(objective, index) in tutorial.content.objectives" :key="index">
                <el-icon><Check /></el-icon>
                <span>{{ objective }}</span>
              </li>
            </ul>
          </div>

          <!-- 章节内容 -->
          <div class="sections-container">
            <div
              v-for="(section, index) in tutorial.content.sections"
              :key="index"
              class="section-card"
            >
              <div class="section-header">
                <h3>
                  <span class="section-number">{{ index + 1 }}</span>
                  {{ section.title }}
                </h3>
                <el-button type="text" size="small" @click="toggleSection(index)">
                  <el-icon>
                    {{ expandedSections.includes(index) ? 'ArrowDown' : 'ArrowRight' }}
                  </el-icon>
                  {{ expandedSections.includes(index) ? '收起' : '展开' }}
                </el-button>
              </div>

              <el-collapse-transition>
                <div v-show="expandedSections.includes(index)" class="section-content">
                  <div class="content-text" v-html="formatContent(section.content)"></div>

                  <!-- 技巧提示 -->
                  <div v-if="section.tips && section.tips.length" class="tips-section">
                    <h4>
                      <el-icon><Lightbulb /></el-icon> 技巧提示
                    </h4>
                    <div class="tips-list">
                      <div v-for="(tip, tipIndex) in section.tips" :key="tipIndex" class="tip-item">
                        <el-icon><Star /></el-icon>
                        <span>{{ tip }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 练习任务 -->
                  <div v-if="section.practice" class="practice-section">
                    <h4>
                      <el-icon><Edit /></el-icon> 练习任务
                    </h4>
                    <p>{{ section.practice }}</p>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </div>

          <!-- 常见问题 -->
          <div
            v-if="tutorial.content.faqs && tutorial.content.faqs.length"
            class="faq-container section-card"
          >
            <h2>
              <el-icon><QuestionFilled /></el-icon> 常见问题
            </h2>
            <div class="faq-list">
              <div v-for="(faq, index) in tutorial.content.faqs" :key="index" class="faq-item">
                <div class="faq-question" @click="toggleFaq(index)">
                  <span class="faq-number">Q{{ index + 1 }}</span>
                  <span class="faq-text">{{ faq.question }}</span>
                  <el-icon>
                    {{ expandedFaqs.includes(index) ? 'ArrowDown' : 'ArrowRight' }}
                  </el-icon>
                </div>
                <el-collapse-transition>
                  <div v-show="expandedFaqs.includes(index)" class="faq-answer">
                    <p>{{ faq.answer }}</p>
                  </div>
                </el-collapse-transition>
              </div>
            </div>
          </div>

          <!-- 学习笔记 -->
          <div class="notes-container section-card">
            <h2>
              <el-icon><Notebook /></el-icon> 学习笔记
            </h2>
            <div class="notes-editor">
              <el-input
                v-model="noteContent"
                type="textarea"
                :rows="4"
                placeholder="在这里记录你的学习心得..."
                maxlength="500"
                show-word-limit
              />
              <div class="notes-actions">
                <el-button type="primary" size="small" @click="saveNote"> 保存笔记 </el-button>
                <el-button size="small" @click="clearNote"> 清空 </el-button>
              </div>
            </div>
            <div v-if="tutorialNotes.length > 0" class="notes-history">
              <h4>历史笔记</h4>
              <div v-for="note in tutorialNotes" :key="note.id" class="note-item">
                <p>{{ note.content }}</p>
                <div class="note-meta">
                  <span>{{ formatDate(note.created_at) }}</span>
                  <el-button type="text" size="small" @click="deleteNote(note.id)">
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-right">
          <!-- 学习进度 -->
          <div class="progress-card">
            <h3>
              <el-icon><DataLine /></el-icon> 学习进度
            </h3>
            <el-progress
              :percentage="learningProgress"
              :stroke-width="12"
              :color="getProgressColor(learningProgress)"
            />
            <div class="progress-info">
              <span>{{ learningProgress }}% 已学习</span>
              <span>{{ tutorial.estimated_time }}分钟</span>
            </div>
            <el-button type="primary" size="small" class="continue-btn" @click="continueLearning">
              {{ learningProgress > 0 ? '继续学习' : '开始学习' }}
            </el-button>
          </div>

          <!-- 相关教程 -->
          <div class="related-tutorials">
            <h3>
              <el-icon><Collection /></el-icon> 相关教程
            </h3>
            <div class="related-list">
              <div
                v-for="related in relatedTutorials"
                :key="related.id"
                class="related-item"
                @click="goToTutorial(related.id)"
              >
                <div class="related-image">
                  <img
                    :src="related.thumbnail_url"
                    :alt="related.title"
                    @error="handleImageError($event, related.id, related.category_id)"
                  />
                </div>
                <div class="related-info">
                  <h4>{{ related.title }}</h4>
                  <div class="related-meta">
                    <span>{{ getDifficultyText(related.difficulty) }}</span>
                    <span>{{ related.estimated_time }}分钟</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 下载资料 -->
          <div class="downloads-card">
            <h3>
              <el-icon><Download /></el-icon> 学习资料
            </h3>
            <div class="downloads-list">
              <div class="download-item">
                <el-icon><Document /></el-icon>
                <span>课程讲义.pdf</span>
                <el-button type="text" size="small" @click="downloadMaterial('讲义')">
                  下载
                </el-button>
              </div>
              <div class="download-item">
                <el-icon><VideoCamera /></el-icon>
                <span>演示视频.mp4</span>
                <el-button type="text" size="small" @click="downloadMaterial('视频')">
                  下载
                </el-button>
              </div>
              <div class="download-item">
                <el-icon><Picture /></el-icon>
                <span>参考素材.zip</span>
                <el-button type="text" size="small" @click="downloadMaterial('素材')">
                  下载
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 获取教程ID
const tutorialId = computed(() => {
  const id = parseInt(route.params.id)
  return isNaN(id) ? 1 : id
})

// 教程数据（模拟）
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
    author_name: '设备专家',
    content: {
      objectives: [
        '了解直播必备的硬件设备',
        '学会根据预算选择合适设备',
        '掌握设备连接和设置方法',
        '学会调试设备以达到最佳效果',
      ],
      sections: [
        {
          title: '摄像头选择',
          content:
            '摄像头是直播的核心设备，直接影响画面质量。建议选择1080p或更高分辨率的摄像头，支持自动对焦和光线调节功能。\n\n推荐品牌：Logitech C920、Razer Kiyo、Insta360 Link等。',
          tips: [
            '预算充足建议选择4K摄像头',
            '注意检查兼容性，支持USB 3.0',
            '考虑购买配套的三脚架或支架',
          ],
          practice: '测试你的摄像头在不同光线下的表现',
        },
        {
          title: '麦克风选购',
          content:
            '好的声音质量同样重要。电容麦克风比动圈麦克风更适合室内直播，能够捕捉更多声音细节。',
          tips: [
            '考虑购买防喷罩减少爆破音',
            'USB麦克风更方便，XLR接口更专业',
            '注意房间的声学环境',
          ],
          practice: '录制一段声音，检查是否有杂音',
        },
        {
          title: '灯光设备',
          content: '灯光能够显著提升画面质量。环形灯适合美妆直播，柔光箱适合整体照明。',
          tips: ['建议使用至少两盏灯', '色温控制在5600K左右', '注意避免产生阴影'],
        },
      ],
      faqs: [
        {
          question: '预算有限优先买什么？',
          answer: '建议优先购买一个好麦克风，声音质量比画面质量更重要',
        },
        {
          question: '手机直播需要哪些设备？',
          answer: '手机支架、外接麦克风、补光灯即可',
        },
      ],
    },
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
    author_name: '场景设计师',
    content: {
      objectives: [
        '掌握直播间布置的基本原则',
        '学会选择合适的背景和道具',
        '了解不同直播类型的场景需求',
      ],
      sections: [
        {
          title: '背景布置',
          content: '直播背景要简洁、专业，避免杂乱。可以使用纯色背景布或定制主题背景。',
          tips: ['背景与主播服装要有对比度', '避免使用反光材质', '保持背景整洁有序'],
        },
      ],
      faqs: [],
    },
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
    author_name: '美颜专家',
    content: {
      objectives: ['了解美颜参数的作用', '掌握自然美颜的参数设置', '学会针对不同场景调整美颜'],
      sections: [
        {
          title: '磨皮设置',
          content: '磨皮参数控制在30-50之间最自然，避免过度磨皮导致塑料感。',
          tips: ['夜间直播适当提高磨皮', '保留皮肤自然纹理', '配合美白参数使用'],
        },
      ],
      faqs: [],
    },
  },
])

// 当前教程
const tutorial = computed(() => {
  const found = tutorials.value.find((t) => t.id === tutorialId.value)

  if (!found) {
    // 显示通知消息（会自动关闭）
    ElNotification({
      title: '教程不存在',
      message: `教程ID: ${tutorialId.value} 不存在，已为您跳转到可用教程`,
      type: 'error',
      duration: 3000,
      position: 'top-right',
    })

    // 延迟跳转，让用户看到提示
    setTimeout(() => {
      // 检查是否存在其他教程，如果都没有则跳转到首页
      if (tutorials.value.length > 0) {
        router.push(`/tutorial/${tutorials.value[0].id}`)
      } else {
        router.push('/')
      }
    }, 2000)

    return tutorials.value[0]
  }

  return found
})

// 状态管理
const isFavorite = ref(false)
const learningProgress = ref(0)
const expandedSections = ref([0])
const expandedFaqs = ref([])
const noteContent = ref('')
const tutorialNotes = ref([])

// 相关教程
const relatedTutorials = computed(() => {
  const currentCategory = tutorial.value.category_id
  return tutorials.value
    .filter((t) => t.id !== tutorialId.value && t.category_id === currentCategory)
    .slice(0, 3)
})

// 工具函数
const getCategoryName = (categoryId) => {
  const categories = {
    1: '入门基础',
    2: '场景搭建',
    3: '技术调试',
    4: '内容创作',
    5: '话术沟通',
    6: '运营进阶',
    7: '商业转化',
    8: '团播专题',
  }
  return categories[categoryId] || '未分类'
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

const getProgressColor = (progress) => {
  if (progress < 30) return '#f56c6c'
  if (progress < 70) return '#e6a23c'
  return '#67c23a'
}

const formatDate = (dateString) => {
  if (!dateString) return '未知日期'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const formatContent = (content) => {
  if (!content) return ''
  return content.replace(/\n/g, '<br>')
}

// 图片错误处理
const handleImageError = (event, tutorialId, categoryId) => {
  const img = event.target
  const defaultImages = [
    'https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=600&auto=format&fit=crop&q=80',
  ]
  const index = (tutorialId || 1) % defaultImages.length
  img.src = defaultImages[index]
  img.onerror = null
}

// 方法
const startLearning = () => {
  learningProgress.value = Math.min(learningProgress.value + 20, 100)
  ElNotification({
    title: '开始学习',
    message: '开始学习本教程',
    type: 'success',
    duration: 2000,
  })
}

const continueLearning = () => {
  if (learningProgress.value >= 100) {
    ElNotification({
      title: '恭喜',
      message: '你已经完成本教程的学习',
      type: 'success',
      duration: 3000,
    })
  } else {
    learningProgress.value = Math.min(learningProgress.value + 20, 100)
    ElNotification({
      title: '继续学习',
      message: '继续学习本教程',
      type: 'info',
      duration: 2000,
    })
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  ElNotification({
    title: isFavorite.value ? '已收藏' : '已取消收藏',
    message: isFavorite.value ? '教程已添加到收藏' : '教程已从收藏中移除',
    type: isFavorite.value ? 'success' : 'info',
    duration: 2000,
  })

  // 保存到本地存储
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  if (isFavorite.value) {
    if (!favorites.includes(tutorialId.value)) {
      favorites.push(tutorialId.value)
    }
  } else {
    favorites = favorites.filter((id) => id !== tutorialId.value)
  }
  localStorage.setItem('favorites', JSON.stringify(favorites))
}

const shareTutorial = () => {
  ElNotification({
    title: '分享功能',
    message: '分享功能即将开放',
    type: 'info',
    duration: 2000,
  })
}

const toggleSection = (index) => {
  const idx = expandedSections.value.indexOf(index)
  if (idx > -1) {
    expandedSections.value.splice(idx, 1)
  } else {
    expandedSections.value.push(index)
  }
}

const toggleFaq = (index) => {
  const idx = expandedFaqs.value.indexOf(index)
  if (idx > -1) {
    expandedFaqs.value.splice(idx, 1)
  } else {
    expandedFaqs.value.push(index)
  }
}

const saveNote = () => {
  if (!noteContent.value.trim()) {
    ElNotification({
      title: '提示',
      message: '请输入笔记内容',
      type: 'warning',
      duration: 2000,
    })
    return
  }

  const newNote = {
    id: tutorialNotes.value.length + 1,
    content: noteContent.value,
    created_at: new Date().toISOString(),
  }

  tutorialNotes.value.unshift(newNote)
  noteContent.value = ''

  ElNotification({
    title: '保存成功',
    message: '笔记已保存',
    type: 'success',
    duration: 2000,
  })

  // 保存到本地存储
  localStorage.setItem(`tutorial_${tutorialId.value}_notes`, JSON.stringify(tutorialNotes.value))
}

const clearNote = () => {
  noteContent.value = ''
}

const deleteNote = (noteId) => {
  const index = tutorialNotes.value.findIndex((note) => note.id === noteId)
  if (index > -1) {
    tutorialNotes.value.splice(index, 1)

    ElNotification({
      title: '删除成功',
      message: '笔记已删除',
      type: 'success',
      duration: 2000,
    })

    // 更新本地存储
    localStorage.setItem(`tutorial_${tutorialId.value}_notes`, JSON.stringify(tutorialNotes.value))
  }
}

const goBack = () => {
  router.back()
}

const goToTutorial = (id) => {
  router.push(`/tutorial/${id}`)
}

const downloadMaterial = (type) => {
  ElNotification({
    title: '下载中',
    message: `正在下载${type}资料...`,
    type: 'info',
    duration: 2000,
  })
}

// 初始化
onMounted(() => {
  console.log('加载教程ID:', tutorialId.value)

  if (!tutorialId.value || isNaN(tutorialId.value)) {
    ElNotification({
      title: '参数错误',
      message: '教程ID无效',
      type: 'error',
      duration: 3000,
    })
    router.push('/tutorials')
    return
  }

  // 加载学习进度
  const savedProgress = localStorage.getItem(`tutorial_${tutorialId.value}_progress`)
  if (savedProgress) {
    learningProgress.value = parseInt(savedProgress) || 0
  }

  // 加载收藏状态
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  isFavorite.value = favorites.includes(tutorialId.value)

  // 加载笔记
  const savedNotes = localStorage.getItem(`tutorial_${tutorialId.value}_notes`)
  if (savedNotes) {
    try {
      tutorialNotes.value = JSON.parse(savedNotes)
    } catch (e) {
      tutorialNotes.value = []
    }
  }
})

// 保存学习进度
const saveProgress = () => {
  localStorage.setItem(`tutorial_${tutorialId.value}_progress`, learningProgress.value)
}

// 监听变化
watch(learningProgress, saveProgress)

// 监听路由变化
watch(
  () => route.params.id,
  (newId) => {
    const id = parseInt(newId)
    if (id && !isNaN(id)) {
      // 重新加载数据
      const savedProgress = localStorage.getItem(`tutorial_${id}_progress`)
      learningProgress.value = savedProgress ? parseInt(savedProgress) : 0

      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      isFavorite.value = favorites.includes(id)

      const savedNotes = localStorage.getItem(`tutorial_${id}_notes`)
      tutorialNotes.value = savedNotes ? JSON.parse(savedNotes) : []

      expandedSections.value = [0]
      expandedFaqs.value = []
      noteContent.value = ''
    }
  },
)
</script>

<style scoped>
.tutorial-detail-page {
  padding: 40px 0;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 返回按钮 */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #409eff;
  font-weight: 500;
  transition: all 0.3s;
  border: 1px solid #e4e7ed;
}

.back-button:hover {
  background: #f5f7fa;
  border-color: #409eff;
  transform: translateX(-5px);
}

.back-button .el-icon {
  font-size: 18px;
}

/* 教程头部 */
.tutorial-header {
  display: flex;
  gap: 60px;
  margin-bottom: 50px;
}

.header-left {
  flex: 1;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  margin-bottom: 20px;
}

.breadcrumb-link {
  color: #409eff;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.tutorial-title {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 20px;
  line-height: 1.2;
}

.tutorial-meta {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
  font-size: 0.95rem;
}

.tutorial-tags {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tutorial-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.tutorial-actions .el-button {
  padding: 12px 30px;
  font-weight: 600;
}

.tutorial-actions .el-button .el-icon.is-favorite {
  color: #fbbf24;
}

/* 教程封面图 */
.header-right {
  flex-shrink: 0;
  width: 400px;
}

.tutorial-thumbnail {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
  position: relative;
}

.tutorial-thumbnail img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}

.thumbnail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px;
}

.tutorial-thumbnail:hover .thumbnail-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 12px 24px;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

/* 教程内容 */
.tutorial-content {
  display: flex;
  gap: 40px;
}

.content-left {
  flex: 1;
}

.content-right {
  width: 320px;
  flex-shrink: 0;
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.section-card h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f7ff;
}

/* 学习目标 */
.objectives-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.objectives-list li {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #409eff;
}

.objectives-list li:last-child {
  margin-bottom: 0;
}

.objectives-list .el-icon {
  color: #409eff;
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.objectives-list span {
  color: #333;
  line-height: 1.6;
}

/* 章节内容 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
}

.section-header h3 {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1.3rem;
  color: #333;
  margin: 0;
}

.section-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.1rem;
}

.section-content {
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.content-text {
  color: #555;
  line-height: 1.8;
  margin-bottom: 25px;
}

.tips-section,
.practice-section {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.tips-section h4,
.practice-section h4 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.tip-item .el-icon {
  color: #ed8936;
  flex-shrink: 0;
  margin-top: 3px;
}

.tip-item span {
  color: #555;
  line-height: 1.6;
}

.practice-section p {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* 常见问题 */
.faq-item {
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  margin-bottom: 15px;
  overflow: hidden;
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  cursor: pointer;
  background: #f8f9fa;
  transition: background 0.3s;
}

.faq-question:hover {
  background: #edf2f7;
}

.faq-number {
  background: #667eea;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.faq-text {
  flex: 1;
  font-weight: 600;
  color: #333;
}

.faq-answer {
  padding: 20px;
  border-top: 1px solid #e4e7ed;
  background: white;
}

.faq-answer p {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* 学习笔记 */
.notes-editor {
  margin-bottom: 30px;
}

.notes-actions {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.notes-history h4 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.note-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid #4299e1;
}

.note-item:last-child {
  margin-bottom: 0;
}

.note-item p {
  color: #333;
  line-height: 1.6;
  margin-bottom: 10px;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 0.9rem;
}

/* 右侧卡片 */
.progress-card,
.related-tutorials,
.downloads-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.progress-card h3,
.related-tutorials h3,
.downloads-card h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 20px;
  color: #666;
  font-size: 0.95rem;
}

.continue-btn {
  width: 100%;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.related-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.related-item:hover {
  border-color: #409eff;
  transform: translateX(5px);
}

.related-image {
  width: 80px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-info {
  flex: 1;
}

.related-info h4 {
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-meta {
  display: flex;
  gap: 15px;
  color: #999;
  font-size: 0.85rem;
}

.downloads-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.download-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.download-item .el-icon {
  color: #4299e1;
  font-size: 20px;
  flex-shrink: 0;
}

.download-item span {
  flex: 1;
  color: #333;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .tutorial-header {
    flex-direction: column;
    gap: 30px;
  }

  .header-right {
    width: 100%;
  }

  .tutorial-content {
    flex-direction: column;
  }

  .content-right {
    width: 100%;
  }

  .related-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .tutorial-title {
    font-size: 2rem;
  }

  .tutorial-meta {
    flex-direction: column;
    gap: 10px;
  }

  .tutorial-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>
