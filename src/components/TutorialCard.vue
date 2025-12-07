<template>
  <div class="tutorial-card" @click="goToDetail">
    <div class="card-image">
      <img
        :src="tutorial.thumbnail_url || images.getTutorialCover(tutorial.id, tutorial.category_id)"
        :alt="tutorial.title"
        @error="imageFallback"
      />
      <div class="card-badge" :class="getDifficultyClass">
        {{ getDifficultyText }}
      </div>
      <div v-if="tutorial.is_free" class="free-badge">免费</div>
    </div>

    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ tutorial.title }}</h3>
        <el-button
          v-if="userStore.user"
          :icon="isFavorite ? StarFilled : Star"
          circle
          size="small"
          @click.stop="toggleFavorite"
        />
      </div>

      <p class="card-description">{{ truncateDescription(tutorial.description) }}</p>

      <div class="card-footer">
        <div class="card-meta">
          <span class="meta-item">
            <el-icon><Timer /></el-icon>
            {{ tutorial.estimated_time || 30 }}分钟
          </span>
          <span class="meta-item">
            <el-icon><View /></el-icon>
            {{ tutorial.views || 0 }}
          </span>
        </div>

        <div class="progress-indicator" v-if="progress > 0">
          <el-progress :percentage="progress" :show-text="false" />
          <span class="progress-text">{{ progress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/utils/supabase'
import { images, imageFallback } from '@/utils/images'
import { ElMessage } from 'element-plus'

const props = defineProps({
  tutorial: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const userStore = useUserStore()
const isFavorite = ref(false)
const progress = ref(0)

const getDifficultyClass = computed(() => {
  const difficulty = props.tutorial.difficulty || 1
  return {
    'badge-easy': difficulty <= 2,
    'badge-medium': difficulty === 3,
    'badge-hard': difficulty >= 4,
  }
})

const getDifficultyText = computed(() => {
  const difficulty = props.tutorial.difficulty || 1
  const texts = ['入门', '简单', '中等', '进阶', '专家']
  return texts[difficulty - 1] || '入门'
})

const truncateDescription = (text) => {
  if (!text) return ''
  return text.length > 80 ? text.substring(0, 80) + '...' : text
}

const handleImageError = (event) => {
  imageFallback(event, images.getTutorialCover(props.tutorial.id, props.tutorial.category_id))
}

const goToDetail = () => {
  router.push(`/tutorial/${props.tutorial.id}`)
}

const toggleFavorite = async () => {
  if (!userStore.user) {
    router.push('/login')
    return
  }

  try {
    if (isFavorite.value) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userStore.user.id)
        .eq('tutorial_id', props.tutorial.id)
      ElMessage.success('已取消收藏')
    } else {
      await supabase.from('favorites').insert({
        user_id: userStore.user.id,
        tutorial_id: props.tutorial.id,
      })
      ElMessage.success('已收藏')
    }
    isFavorite.value = !isFavorite.value
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 检查是否已收藏
const checkFavorite = async () => {
  if (!userStore.user) return

  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userStore.user.id)
    .eq('tutorial_id', props.tutorial.id)
    .single()

  isFavorite.value = !!data
}

// 获取学习进度
const getProgress = async () => {
  if (!userStore.user) return

  const { data } = await supabase
    .from('user_learning')
    .select('progress')
    .eq('user_id', userStore.user.id)
    .eq('tutorial_id', props.tutorial.id)
    .single()

  if (data) {
    progress.value = Math.round(data.progress * 100)
  }
}

checkFavorite()
getProgress()
</script>

<style scoped>
.tutorial-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tutorial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.tutorial-card:hover .card-image img {
  transform: scale(1.05);
}

.card-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.badge-easy {
  background: #52c41a;
}

.badge-medium {
  background: #faad14;
}

.badge-hard {
  background: #f5222d;
}

.free-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #409eff;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.card-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 20px;
  flex: 1;
}

.card-footer {
  margin-top: auto;
}

.card-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #999;
  font-size: 0.85rem;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-indicator :deep(.el-progress-bar) {
  flex: 1;
}

.progress-text {
  font-size: 0.85rem;
  color: #409eff;
  font-weight: 500;
}
</style>
