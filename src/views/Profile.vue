<template>
  <div class="profile-page">
    <!-- 用户信息头部 -->
    <div class="profile-header">
      <div class="container">
        <div class="header-content">
          <div class="user-avatar-section">
            <div class="avatar-wrapper">
              <el-avatar :size="120" :src="userProfile.avatar_url" />
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :on-change="handleAvatarChange"
                :auto-upload="false"
              >
                <el-icon class="upload-icon"><Camera /></el-icon>
              </el-upload>
            </div>
            <div class="user-basic-info">
              <h1 class="user-name">{{ userProfile.username || '未设置用户名' }}</h1>
              <p class="user-email">{{ userStore.user?.email }}</p>
              <div class="user-tags">
                <el-tag type="primary" size="small">初级主播</el-tag>
                <el-tag type="success" size="small" v-if="userProfile.is_vip">VIP会员</el-tag>
                <el-tag type="warning" size="small" v-if="userProfile.is_verified">已认证</el-tag>
              </div>
            </div>
          </div>

          <div class="user-stats">
            <div class="stat-card">
              <div class="stat-number">{{ stats.completedTutorials }}</div>
              <div class="stat-label">已完成教程</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ stats.learningHours }}</div>
              <div class="stat-label">学习时长(小时)</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ stats.favorites }}</div>
              <div class="stat-label">收藏数量</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ stats.streakDays }}</div>
              <div class="stat-label">连续学习(天)</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="profile-main">
      <div class="container">
        <div class="profile-layout">
          <!-- 侧边栏菜单 -->
          <div class="sidebar-menu">
            <div
              v-for="item in menuItems"
              :key="item.id"
              :class="['menu-item', { active: activeMenu === item.id }]"
              @click="activeMenu = item.id"
            >
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.label }}</span>
            </div>
          </div>

          <!-- 主要内容区域 -->
          <div class="main-content">
            <!-- 学习进度 -->
            <div v-if="activeMenu === 'progress'" class="section-card">
              <div class="section-header">
                <h2>
                  <el-icon><DataLine /></el-icon> 我的学习进度
                </h2>
                <el-button type="primary" size="small" @click="exportProgress">
                  <el-icon><Download /></el-icon> 导出报告
                </el-button>
              </div>

              <div class="learning-progress">
                <!-- 总体进度 -->
                <div class="overall-progress">
                  <h3>整体学习进度</h3>
                  <el-progress
                    :percentage="overallProgress"
                    :stroke-width="16"
                    :color="getProgressColor(overallProgress)"
                    :show-text="false"
                  />
                  <div class="progress-info">
                    <span class="progress-text">{{ overallProgress }}% 已学习</span>
                    <span class="progress-target">目标: 100%</span>
                  </div>
                </div>

                <!-- 分类进度 -->
                <div class="category-progress">
                  <h3>各分类学习进度</h3>
                  <div class="category-list">
                    <div
                      v-for="category in categoryProgress"
                      :key="category.id"
                      class="category-item"
                    >
                      <div class="category-header">
                        <span class="category-name">{{ category.name }}</span>
                        <span class="category-percent">{{ category.progress }}%</span>
                      </div>
                      <el-progress
                        :percentage="category.progress"
                        :stroke-width="6"
                        :color="getProgressColor(category.progress)"
                      />
                      <div class="category-meta">
                        <span>{{ category.completed }}/{{ category.total }} 个教程</span>
                        <el-button type="text" size="small" @click="continueLearning(category.id)">
                          继续学习
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 最近学习 -->
                <div class="recent-learning">
                  <h3>最近学习</h3>
                  <div class="recent-list">
                    <div
                      v-for="item in recentLearning"
                      :key="item.id"
                      class="recent-item"
                      @click="continueTutorial(item.tutorial_id)"
                    >
                      <div class="recent-info">
                        <h4>{{ item.title }}</h4>
                        <p>上次学习: {{ formatDate(item.last_visited) }}</p>
                        <div class="recent-progress">
                          <el-progress
                            :percentage="item.progress * 100"
                            :stroke-width="4"
                            :show-text="false"
                          />
                          <span class="progress-text">{{ Math.round(item.progress * 100) }}%</span>
                        </div>
                      </div>
                      <div class="recent-actions">
                        <el-button
                          v-if="item.progress < 1"
                          type="primary"
                          size="small"
                          @click.stop="continueTutorial(item.tutorial_id)"
                        >
                          继续
                        </el-button>
                        <el-button v-else type="success" size="small" disabled> 已完成 </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 收藏夹 -->
            <div v-else-if="activeMenu === 'favorites'" class="section-card">
              <div class="section-header">
                <h2>
                  <el-icon><Star /></el-icon> 我的收藏
                </h2>
                <div class="filter-options">
                  <el-select v-model="favoritesFilter" placeholder="筛选" size="small">
                    <el-option label="全部收藏" value="all" />
                    <el-option label="免费教程" value="free" />
                    <el-option label="进阶教程" value="advanced" />
                    <el-option label="最近收藏" value="recent" />
                  </el-select>
                </div>
              </div>

              <div class="favorites-list">
                <div v-if="filteredFavorites.length > 0" class="favorites-grid">
                  <div
                    v-for="favorite in filteredFavorites"
                    :key="favorite.id"
                    class="favorite-item"
                    @click="goToTutorial(favorite.tutorial_id)"
                  >
                    <div class="favorite-image">
                      <img
                        :src="favorite.thumbnail_url || getDefaultThumbnail(favorite.tutorial_id)"
                        :alt="favorite.title"
                      />
                      <div class="favorite-badge" :class="getDifficultyClass(favorite.difficulty)">
                        {{ getDifficultyText(favorite.difficulty) }}
                      </div>
                    </div>
                    <div class="favorite-content">
                      <h4>{{ favorite.title }}</h4>
                      <p>{{ favorite.description }}</p>
                      <div class="favorite-meta">
                        <span
                          ><el-icon><Folder /></el-icon> {{ favorite.category_name }}</span
                        >
                        <span
                          ><el-icon><Timer /></el-icon> {{ favorite.estimated_time }}分钟</span
                        >
                        <span
                          ><el-icon><View /></el-icon> {{ favorite.views }} 浏览</span
                        >
                      </div>
                      <div class="favorite-actions">
                        <el-button
                          type="text"
                          size="small"
                          @click.stop="removeFavorite(favorite.tutorial_id)"
                        >
                          <el-icon><StarFilled /></el-icon> 取消收藏
                        </el-button>
                        <el-button
                          type="primary"
                          size="small"
                          @click.stop="goToTutorial(favorite.tutorial_id)"
                        >
                          开始学习
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <el-empty description="暂无收藏">
                    <template #image>
                      <el-icon size="80"><Star /></el-icon>
                    </template>
                    <el-button type="primary" @click="$router.push('/tutorials')">
                      去发现教程
                    </el-button>
                  </el-empty>
                </div>
              </div>
            </div>

            <!-- 学习笔记 -->
            <div v-else-if="activeMenu === 'notes'" class="section-card">
              <div class="section-header">
                <h2>
                  <el-icon><Notebook /></el-icon> 我的笔记
                </h2>
                <el-button type="primary" size="small" @click="addNewNote">
                  <el-icon><Plus /></el-icon> 添加笔记
                </el-button>
              </div>

              <div class="notes-container">
                <!-- 笔记编辑器 -->
                <div v-if="editingNote" class="note-editor">
                  <div class="editor-header">
                    <el-input
                      v-model="editingNote.title"
                      placeholder="笔记标题"
                      maxlength="50"
                      show-word-limit
                    />
                    <div class="editor-actions">
                      <el-button type="primary" size="small" @click="saveNote"> 保存 </el-button>
                      <el-button size="small" @click="cancelEdit"> 取消 </el-button>
                    </div>
                  </div>
                  <el-input
                    v-model="editingNote.content"
                    type="textarea"
                    :rows="8"
                    placeholder="在这里记录你的学习心得..."
                    maxlength="2000"
                    show-word-limit
                  />
                  <div class="note-tags">
                    <el-tag
                      v-for="tag in editingNote.tags"
                      :key="tag"
                      closable
                      @close="removeTag(tag)"
                    >
                      {{ tag }}
                    </el-tag>
                    <el-input
                      v-if="inputTagVisible"
                      ref="tagInputRef"
                      v-model="inputTagValue"
                      size="small"
                      @keyup.enter="handleTagInputConfirm"
                      @blur="handleTagInputConfirm"
                    />
                    <el-button v-else size="small" @click="showTagInput"> + 添加标签 </el-button>
                  </div>
                </div>

                <!-- 笔记列表 -->
                <div v-else class="notes-list">
                  <div v-for="note in notes" :key="note.id" class="note-item">
                    <div class="note-header">
                      <h4>{{ note.title }}</h4>
                      <div class="note-actions">
                        <el-button type="text" size="small" @click="editNote(note)">
                          <el-icon><Edit /></el-icon>
                        </el-button>
                        <el-button type="text" size="small" @click="deleteNote(note.id)">
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </div>
                    </div>
                    <div class="note-content">
                      <p>{{ note.content }}</p>
                    </div>
                    <div class="note-footer">
                      <div class="note-tags">
                        <el-tag v-for="tag in note.tags" :key="tag" size="small">
                          {{ tag }}
                        </el-tag>
                      </div>
                      <div class="note-meta">
                        <span>{{ formatDate(note.created_at) }}</span>
                        <span>来自: {{ note.tutorial_title || '个人笔记' }}</span>
                      </div>
                    </div>
                  </div>

                  <div v-if="notes.length === 0" class="empty-notes">
                    <el-empty description="暂无笔记">
                      <template #image>
                        <el-icon size="80"><Notebook /></el-icon>
                      </template>
                      <el-button type="primary" @click="addNewNote"> 创建第一份笔记 </el-button>
                    </el-empty>
                  </div>
                </div>
              </div>
            </div>

            <!-- 学习统计 -->
            <div v-else-if="activeMenu === 'stats'" class="section-card">
              <div class="section-header">
                <h2>
                  <el-icon><TrendCharts /></el-icon> 学习统计
                </h2>
                <el-select v-model="statsPeriod" size="small">
                  <el-option label="最近7天" value="7d" />
                  <el-option label="最近30天" value="30d" />
                  <el-option label="最近90天" value="90d" />
                  <el-option label="全部时间" value="all" />
                </el-select>
              </div>

              <div class="stats-container">
                <!-- 学习趋势 -->
                <div class="stats-chart">
                  <h3>学习时长趋势</h3>
                  <div class="chart-placeholder">
                    <!-- 这里可以集成ECharts图表 -->
                    <div class="chart-mock">
                      <div class="mock-line"></div>
                      <div class="mock-data">
                        <div
                          v-for="i in 7"
                          :key="i"
                          class="mock-bar"
                          :style="{ height: Math.random() * 60 + 20 + 'px' }"
                        ></div>
                      </div>
                    </div>
                    <p class="chart-note">此处将显示您的学习时长趋势图表</p>
                  </div>
                </div>

                <!-- 学习习惯 -->
                <div class="learning-habits">
                  <h3>学习习惯分析</h3>
                  <div class="habits-list">
                    <div class="habit-item">
                      <div class="habit-icon">
                        <el-icon><Timer /></el-icon>
                      </div>
                      <div class="habit-info">
                        <div class="habit-name">平均学习时长</div>
                        <div class="habit-value">45分钟/次</div>
                      </div>
                    </div>
                    <div class="habit-item">
                      <div class="habit-icon">
                        <el-icon><Calendar /></el-icon>
                      </div>
                      <div class="habit-info">
                        <div class="habit-name">最佳学习时间</div>
                        <div class="habit-value">20:00-22:00</div>
                      </div>
                    </div>
                    <div class="habit-item">
                      <div class="habit-icon">
                        <el-icon><Star /></el-icon>
                      </div>
                      <div class="habit-info">
                        <div class="habit-name">最喜欢分类</div>
                        <div class="habit-value">话术沟通</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 学习成就 -->
                <div class="learning-achievements">
                  <h3>学习成就</h3>
                  <div class="achievements-list">
                    <div
                      v-for="achievement in achievements"
                      :key="achievement.id"
                      :class="['achievement-item', { unlocked: achievement.unlocked }]"
                    >
                      <div class="achievement-icon">
                        <el-icon><component :is="achievement.icon" /></el-icon>
                      </div>
                      <div class="achievement-info">
                        <div class="achievement-name">{{ achievement.name }}</div>
                        <div class="achievement-desc">{{ achievement.description }}</div>
                      </div>
                      <div class="achievement-progress">
                        <el-progress
                          :percentage="achievement.progress"
                          :stroke-width="6"
                          :show-text="false"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 账户设置 -->
            <div v-else-if="activeMenu === 'settings'" class="section-card">
              <div class="section-header">
                <h2>
                  <el-icon><Setting /></el-icon> 账户设置
                </h2>
              </div>

              <div class="settings-container">
                <!-- 基本信息 -->
                <el-form :model="settingsForm" label-width="100px" class="settings-form">
                  <div class="settings-section">
                    <h3>基本信息</h3>
                    <el-form-item label="用户名">
                      <el-input v-model="settingsForm.username" />
                    </el-form-item>
                    <el-form-item label="个人简介">
                      <el-input
                        v-model="settingsForm.bio"
                        type="textarea"
                        :rows="3"
                        placeholder="介绍一下你自己..."
                      />
                    </el-form-item>
                    <el-form-item label="手机号码">
                      <el-input v-model="settingsForm.phone" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="updateProfile"> 保存更改 </el-button>
                    </el-form-item>
                  </div>

                  <!-- 学习设置 -->
                  <div class="settings-section">
                    <h3>学习设置</h3>
                    <el-form-item label="每日目标">
                      <el-slider
                        v-model="settingsForm.daily_goal"
                        :min="15"
                        :max="120"
                        :step="15"
                        show-input
                      />
                      <span class="slider-label">{{ settingsForm.daily_goal }} 分钟/天</span>
                    </el-form-item>
                    <el-form-item label="学习提醒">
                      <el-switch v-model="settingsForm.learning_reminder" />
                      <span class="switch-label">开启每日学习提醒</span>
                    </el-form-item>
                    <el-form-item label="提醒时间">
                      <el-time-select
                        v-model="settingsForm.reminder_time"
                        :disabled="!settingsForm.learning_reminder"
                        placeholder="选择提醒时间"
                      />
                    </el-form-item>
                  </div>

                  <!-- 隐私设置 -->
                  <div class="settings-section">
                    <h3>隐私设置</h3>
                    <el-form-item label="学习记录">
                      <el-radio-group v-model="settingsForm.privacy_learning">
                        <el-radio label="public">公开</el-radio>
                        <el-radio label="friends">仅好友可见</el-radio>
                        <el-radio label="private">仅自己可见</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="收藏公开">
                      <el-switch v-model="settingsForm.show_favorites" />
                    </el-form-item>
                  </div>

                  <!-- 账户安全 -->
                  <div class="settings-section">
                    <h3>账户安全</h3>
                    <el-form-item label="修改密码">
                      <el-button type="primary" @click="showChangePassword = true">
                        修改密码
                      </el-button>
                    </el-form-item>
                    <el-form-item label="账号绑定">
                      <AccountBinding />
                    </el-form-item>
                  </div>

                  <!-- 危险区域 -->
                  <div class="settings-section danger-section">
                    <h3>
                      <el-icon><Warning /></el-icon> 危险操作
                    </h3>
                    <el-form-item label="注销账号">
                      <el-button type="danger" plain @click="showDeleteConfirm">
                        注销账号
                      </el-button>
                      <p class="danger-tip">注意：注销后将无法恢复您的数据和信息</p>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <ChangePassword v-model:visible="showChangePassword" @success="handlePasswordChangeSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import ChangePassword from '@/components/ChangePassword.vue'
import AccountBinding from '@/components/AccountBinding.vue'

const router = useRouter()
const userStore = useUserStore()

// 菜单项
const menuItems = [
  { id: 'progress', label: '学习进度', icon: 'DataLine' },
  { id: 'favorites', label: '我的收藏', icon: 'Star' },
  { id: 'notes', label: '学习笔记', icon: 'Notebook' },
  { id: 'stats', label: '学习统计', icon: 'TrendCharts' },
  { id: 'settings', label: '账户设置', icon: 'Setting' },
]

const activeMenu = ref('progress')

// 修改密码对话框
const showChangePassword = ref(false)

// 用户资料
const userProfile = ref({
  username: userStore.profile?.username || '用户',
  avatar_url:
    userStore.profile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
  bio: userStore.profile?.bio || '',
  is_vip: false,
  is_verified: true,
})

// 统计数据
const stats = ref({
  completedTutorials: 8,
  learningHours: 42,
  favorites: 12,
  streakDays: 7,
})

// 学习进度
const overallProgress = ref(65)
const categoryProgress = ref([
  { id: 1, name: '入门基础', progress: 80, completed: 4, total: 5 },
  { id: 2, name: '场景搭建', progress: 60, completed: 3, total: 5 },
  { id: 3, name: '技术调试', progress: 40, completed: 2, total: 5 },
  { id: 4, name: '话术沟通', progress: 75, completed: 3, total: 4 },
  { id: 5, name: '运营进阶', progress: 30, completed: 1, total: 3 },
])

const recentLearning = ref([
  {
    id: 1,
    tutorial_id: 1,
    title: '直播设备选购指南',
    progress: 0.65,
    last_visited: new Date().toISOString(),
  },
  {
    id: 2,
    tutorial_id: 2,
    title: '娱乐直播场景布置',
    progress: 0.9,
    last_visited: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    tutorial_id: 3,
    title: '直播美颜参数调节',
    progress: 0.3,
    last_visited: new Date(Date.now() - 172800000).toISOString(),
  },
])

// 收藏功能
const favoritesFilter = ref('all')
const favoritesList = ref([
  {
    id: 1,
    tutorial_id: 1,
    title: '直播设备选购指南',
    description: '全面讲解直播设备的选择要点',
    difficulty: 2,
    category_name: '入门基础',
    estimated_time: 45,
    views: 1234,
    thumbnail_url:
      'https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    tutorial_id: 2,
    title: '直播互动话术技巧',
    description: '提升直播间互动效果的实用话术',
    difficulty: 3,
    category_name: '话术沟通',
    estimated_time: 60,
    views: 2345,
    thumbnail_url:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    tutorial_id: 3,
    title: '美颜参数精细调节',
    description: '打造完美直播形象的参数设置',
    difficulty: 2,
    category_name: '技术调试',
    estimated_time: 40,
    views: 1876,
    thumbnail_url:
      'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=600&auto=format&fit=crop',
  },
])

// 笔记功能
const editingNote = ref(null)
const notes = ref([
  {
    id: 1,
    title: '美颜参数心得',
    content: '磨皮参数设置在30左右最自然，配合适当的美白效果最佳。',
    tags: ['美颜', '参数', '技巧'],
    created_at: new Date().toISOString(),
    tutorial_title: '直播美颜参数调节',
  },
  {
    id: 2,
    title: '设备选购要点',
    content: '摄像头要选自动对焦的，麦克风要选有防喷罩的。',
    tags: ['设备', '选购'],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    tutorial_title: '直播设备选购指南',
  },
])

const inputTagVisible = ref(false)
const inputTagValue = ref('')
const tagInputRef = ref()

// 统计功能
const statsPeriod = ref('7d')
const achievements = ref([
  {
    id: 1,
    name: '新手起步',
    description: '完成第一个教程',
    progress: 100,
    unlocked: true,
    icon: 'Star',
  },
  {
    id: 2,
    name: '学习达人',
    description: '连续学习7天',
    progress: 100,
    unlocked: true,
    icon: 'Medal',
  },
  {
    id: 3,
    name: '知识探索者',
    description: '学习5个分类以上',
    progress: 80,
    unlocked: false,
    icon: 'Compass',
  },
  {
    id: 4,
    name: '时间管理大师',
    description: '累计学习100小时',
    progress: 42,
    unlocked: false,
    icon: 'Timer',
  },
])

// 设置功能
const settingsForm = ref({
  username: userProfile.value.username,
  bio: userProfile.value.bio,
  phone: '',
  daily_goal: 60,
  learning_reminder: true,
  reminder_time: '20:00',
  privacy_learning: 'friends',
  show_favorites: true,
})

// 计算属性
const filteredFavorites = computed(() => {
  const list = favoritesList.value

  switch (favoritesFilter.value) {
    case 'free':
      return list.filter((item) => item.difficulty <= 2)
    case 'advanced':
      return list.filter((item) => item.difficulty >= 4)
    case 'recent':
      return list.slice(0, 2)
    default:
      return list
  }
})

// 工具函数
const getDefaultThumbnail = (tutorialId) => {
  const thumbnails = [
    'https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=600&auto=format&fit=crop',
  ]
  return thumbnails[(tutorialId - 1) % thumbnails.length]
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

const getProgressColor = (progress) => {
  if (progress < 30) return '#f56c6c'
  if (progress < 70) return '#e6a23c'
  return '#67c23a'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  if (diff < 86400000) {
    return '今天'
  } else if (diff < 172800000) {
    return '昨天'
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

// 方法函数
const handleAvatarChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    userProfile.value.avatar_url = e.target.result
    ElMessage.success('头像已更新')
  }
  reader.readAsDataURL(file.raw)
}

const exportProgress = () => {
  ElNotification({
    title: '导出成功',
    message: '学习进度报告已生成，可下载查看',
    type: 'success',
    duration: 2000,
  })
}

const continueLearning = (categoryId) => {
  router.push(`/tutorials?category=${categoryId}`)
}

const continueTutorial = (tutorialId) => {
  router.push(`/tutorial/${tutorialId}`)
}

const goToTutorial = (tutorialId) => {
  router.push(`/tutorial/${tutorialId}`)
}

const removeFavorite = (tutorialId) => {
  const index = favoritesList.value.findIndex((item) => item.tutorial_id === tutorialId)
  if (index > -1) {
    favoritesList.value.splice(index, 1)
    ElMessage.success('已取消收藏')
  }
}

// 笔记相关方法
const addNewNote = () => {
  editingNote.value = {
    id: null,
    title: '',
    content: '',
    tags: [],
    created_at: new Date().toISOString(),
  }
}

const editNote = (note) => {
  editingNote.value = { ...note }
}

const saveNote = () => {
  if (!editingNote.value.title.trim()) {
    ElMessage.warning('请输入笔记标题')
    return
  }

  if (editingNote.value.id) {
    // 更新现有笔记
    const index = notes.value.findIndex((n) => n.id === editingNote.value.id)
    if (index > -1) {
      notes.value[index] = { ...editingNote.value }
    }
  } else {
    // 添加新笔记
    editingNote.value.id = notes.value.length + 1
    notes.value.unshift({ ...editingNote.value })
  }

  editingNote.value = null
  ElMessage.success('笔记已保存')
}

const cancelEdit = () => {
  editingNote.value = null
}

const deleteNote = (noteId) => {
  ElMessageBox.confirm('确定要删除这份笔记吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const index = notes.value.findIndex((n) => n.id === noteId)
    if (index > -1) {
      notes.value.splice(index, 1)
      ElMessage.success('笔记已删除')
    }
  })
}

const showTagInput = () => {
  inputTagVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const handleTagInputConfirm = () => {
  if (inputTagValue.value) {
    if (!editingNote.value.tags.includes(inputTagValue.value)) {
      editingNote.value.tags.push(inputTagValue.value)
    }
  }
  inputTagVisible.value = false
  inputTagValue.value = ''
}

const removeTag = (tag) => {
  const index = editingNote.value.tags.indexOf(tag)
  if (index > -1) {
    editingNote.value.tags.splice(index, 1)
  }
}

// 设置相关方法
const updateProfile = () => {
  userProfile.value.username = settingsForm.value.username
  userProfile.value.bio = settingsForm.value.bio
  ElMessage.success('个人资料已更新')
}

const handlePasswordChangeSuccess = () => {
  ElMessage.success('密码修改成功！请重新登录')
}

const showDeleteConfirm = () => {
  ElMessageBox.confirm('此操作将永久删除您的账号，是否继续？', '警告', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'error',
    confirmButtonClass: 'el-button--danger',
  })
    .then(() => {
      ElMessage.info('账号注销功能正在开发中')
    })
    .catch(() => {
      // 用户取消了操作
    })
}

// 检查用户是否登录
onMounted(() => {
  if (!userStore.user) {
    ElMessage.warning('请先登录')
    router.push('/login')
  }
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 头部样式 */
.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
}

.user-avatar-section {
  display: flex;
  align-items: center;
  gap: 30px;
}

.avatar-wrapper {
  position: relative;
}

.avatar-uploader {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.upload-icon {
  color: #667eea;
  font-size: 16px;
}

.user-basic-info h1 {
  font-size: 2.2rem;
  margin-bottom: 8px;
}

.user-email {
  opacity: 0.9;
  margin-bottom: 15px;
}

.user-tags {
  display: flex;
  gap: 10px;
}

.user-stats {
  display: flex;
  gap: 30px;
}

.stat-card {
  text-align: center;
  min-width: 100px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 主体布局 */
.profile-main {
  padding: 40px 0;
}

.profile-layout {
  display: flex;
  gap: 30px;
}

/* 侧边栏菜单 */
.sidebar-menu {
  width: 220px;
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  padding: 20px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid transparent;
}

.menu-item:hover {
  background: #f5f7fa;
}

.menu-item.active {
  background: #f0f7ff;
  border-left-color: #409eff;
  color: #409eff;
}

.menu-item .el-icon {
  font-size: 18px;
}

/* 主要内容 */
.main-content {
  flex: 1;
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f7ff;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  color: #333;
}

/* 学习进度样式 */
.learning-progress > div {
  margin-bottom: 40px;
}

.learning-progress h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
}

.overall-progress .progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.progress-text {
  font-weight: 600;
  color: #409eff;
}

.progress-target {
  color: #999;
  font-size: 0.9rem;
}

.category-item {
  margin-bottom: 25px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.category-name {
  font-weight: 500;
  color: #333;
}

.category-percent {
  font-weight: 600;
  color: #409eff;
}

.category-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  color: #999;
  font-size: 0.9rem;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.recent-item:hover {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
}

.recent-info h4 {
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: #333;
}

.recent-info p {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.recent-progress {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 200px;
}

.recent-progress :deep(.el-progress-bar) {
  flex: 1;
}

/* 收藏样式 */
.favorites-list {
  margin-top: 20px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.favorite-item {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.favorite-item:hover {
  border-color: #409eff;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.favorite-image {
  height: 160px;
  position: relative;
  overflow: hidden;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.favorite-item:hover .favorite-image img {
  transform: scale(1.05);
}

.favorite-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}

.difficulty-beginner {
  background: #48bb78;
}

.difficulty-intermediate {
  background: #ed8936;
}

.difficulty-advanced {
  background: #f56565;
}

.favorite-content {
  padding: 20px;
}

.favorite-content h4 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #333;
}

.favorite-content p {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 15px;
  line-height: 1.5;
}

.favorite-meta {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.favorite-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.favorite-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}

/* 笔记样式 */
.notes-container {
  margin-top: 20px;
}

.note-editor {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
}

.editor-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.editor-header .el-input {
  flex: 1;
}

.editor-actions {
  display: flex;
  gap: 10px;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  align-items: center;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.note-item {
  background: white;
  border-radius: 10px;
  padding: 25px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.note-item:hover {
  border-color: #409eff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.note-header h4 {
  font-size: 1.2rem;
  color: #333;
  flex: 1;
}

.note-actions {
  display: flex;
  gap: 5px;
}

.note-content {
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.note-meta {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 0.9rem;
}

.empty-notes {
  padding: 60px 0;
  text-align: center;
}

/* 统计样式 */
.stats-container > div {
  margin-bottom: 40px;
}

.stats-chart {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
}

.chart-placeholder {
  text-align: center;
  padding: 40px 0;
}

.chart-mock {
  height: 200px;
  position: relative;
  margin-bottom: 20px;
}

.mock-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #e4e7ed;
}

.mock-data {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 100%;
  padding: 0 20px;
}

.mock-bar {
  width: 30px;
  background: linear-gradient(to top, #409eff, #66b1ff);
  border-radius: 4px 4px 0 0;
  min-height: 20px;
}

.chart-note {
  color: #999;
  font-size: 0.9rem;
}

.learning-habits {
  background: white;
  border-radius: 10px;
  padding: 25px;
  border: 1px solid #e4e7ed;
}

.habits-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.habit-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.habit-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.habit-info {
  flex: 1;
}

.habit-name {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.habit-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.learning-achievements {
  background: white;
  border-radius: 10px;
  padding: 25px;
  border: 1px solid #e4e7ed;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px solid transparent;
}

.achievement-item.unlocked {
  border-color: #409eff;
  background: #f0f7ff;
}

.achievement-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.achievement-desc {
  color: #666;
  font-size: 0.9rem;
}

.achievement-progress {
  width: 100px;
}

/* 设置样式 */
.settings-container {
  margin-top: 20px;
}

.settings-form {
  max-width: 800px;
}

.settings-section {
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 2px solid #f0f7ff;
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.settings-section h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-label {
  margin-left: 20px;
  color: #666;
}

.switch-label {
  margin-left: 10px;
  color: #666;
}

.danger-section h3 .el-icon {
  color: #f56c6c;
}

.danger-tip {
  color: #f56c6c;
  font-size: 0.9rem;
  margin-top: 10px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .profile-layout {
    flex-direction: column;
  }

  .sidebar-menu {
    width: 100%;
    display: flex;
    overflow-x: auto;
    padding: 0;
  }

  .menu-item {
    flex-shrink: 0;
    border-left: none;
    border-bottom: 4px solid transparent;
  }

  .menu-item.active {
    border-left: none;
    border-bottom-color: #409eff;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .user-avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .user-stats {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .editor-header {
    flex-direction: column;
  }

  .stat-card {
    min-width: 80px;
  }

  .stat-number {
    font-size: 2rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .section-header h2 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 30px 0;
  }

  .user-basic-info h1 {
    font-size: 1.8rem;
  }

  .user-stats {
    width: 100%;
    justify-content: space-between;
  }

  .stat-card {
    min-width: auto;
    flex: 1;
  }

  .recent-item {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .recent-progress {
    width: 100%;
  }
}
</style>
