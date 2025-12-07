<template>
  <div class="community-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>
          <el-icon><ChatDotSquare /></el-icon> 直播社区
        </h1>
        <p class="page-subtitle">与主播同行交流经验，共同成长</p>
      </div>

      <!-- 功能预告 -->
      <div class="coming-soon-section">
        <div class="coming-soon-content">
          <div class="icon-wrapper">
            <el-icon size="80"><Tools /></el-icon>
          </div>
          <h2>功能正在开发中</h2>
          <p class="coming-soon-text">
            社区功能正在紧张开发中，预计将在下一版本上线。<br />
            届时将包含问答讨论、经验分享、直播连麦等功能。
          </p>

          <div class="features-preview">
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><ChatLineRound /></el-icon>
              </div>
              <h3>问答讨论</h3>
              <p>提出疑问，获得专业解答</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><Share /></el-icon>
              </div>
              <h3>经验分享</h3>
              <p>分享直播心得和成功经验</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><User /></el-icon>
              </div>
              <h3>主播连麦</h3>
              <p>与资深主播在线交流学习</p>
            </div>
          </div>

          <div class="action-buttons">
            <el-button type="primary" size="large" @click="goToTutorials">
              <el-icon><Notebook /></el-icon>
              先学习教程
            </el-button>
            <el-button size="large" @click="showSubscribe">
              <el-icon><Bell /></el-icon>
              订阅通知
            </el-button>
          </div>

          <div class="countdown-section">
            <p class="countdown-text">预计上线时间：2024年3月</p>
            <div class="progress-container">
              <el-progress :percentage="65" :stroke-width="8" color="#409EFF" />
              <p class="progress-text">开发进度：65%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 临时替代内容 -->
      <div class="alternative-section">
        <h2>💡 现在你可以：</h2>
        <div class="alternative-grid">
          <div class="alternative-card">
            <h3>学习完整教程</h3>
            <p>访问教程库，系统学习直播知识</p>
            <el-button type="primary" @click="goToTutorials"> 前往教程库 </el-button>
          </div>

          <div class="alternative-card">
            <h3>按分类学习</h3>
            <p>根据你的需求选择学习方向</p>
            <el-button @click="goToCategories"> 浏览分类 </el-button>
          </div>

          <div class="alternative-card">
            <h3>联系我们</h3>
            <p>有任何建议或问题？联系我们</p>
            <el-button type="info" @click="contactUs"> 联系客服 </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const goToTutorials = () => {
  router.push('/tutorials')
}

const goToCategories = () => {
  router.push('/categories')
}

const showSubscribe = () => {
  ElMessageBox.prompt('请输入您的邮箱，功能上线时将通知您', '订阅通知', {
    confirmButtonText: '订阅',
    cancelButtonText: '取消',
    inputPlaceholder: 'your-email@example.com',
    inputPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    inputErrorMessage: '请输入有效的邮箱地址',
  })
    .then(({ value }) => {
      ElMessage.success(`订阅成功！我们将在功能上线时通知 ${value}`)
    })
    .catch(() => {
      // 用户取消了操作
    })
}

const contactUs = () => {
  ElMessageBox.alert(
    '📧 邮箱：community@liveacademy.com\n' +
      '📞 客服热线：400-123-4567\n' +
      '⏰ 服务时间：9:00-18:00\n\n' +
      '欢迎您对社区功能提出宝贵建议！',
    '联系我们',
    {
      confirmButtonText: '好的',
      customClass: 'contact-dialog',
    },
  )
}
</script>

<style scoped>
.community-page {
  padding: 40px 0;
  min-height: 70vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 2.8rem;
  color: #333;
  margin-bottom: 15px;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 功能预告区域 */
.coming-soon-section {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  margin-bottom: 60px;
  border: 2px dashed #e4e7ed;
}

.icon-wrapper {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f7ff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  color: #409eff;
}

.coming-soon-content h2 {
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 20px;
}

.coming-soon-text {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

/* 功能预览 */
.features-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin: 40px 0;
}

.feature-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 30px 20px;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.feature-card:hover {
  border-color: #409eff;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(64, 158, 255, 0.1);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 24px;
}

.feature-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.feature-card p {
  color: #666;
  font-size: 0.95rem;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 40px 0;
}

/* 倒计时区域 */
.countdown-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #f0f7ff;
}

.countdown-text {
  font-size: 1.1rem;
  color: #409eff;
  font-weight: 600;
  margin-bottom: 15px;
}

.progress-container {
  max-width: 500px;
  margin: 0 auto;
}

.progress-text {
  margin-top: 10px;
  color: #666;
  font-size: 0.95rem;
}

/* 替代内容区域 */
.alternative-section {
  margin-top: 60px;
}

.alternative-section h2 {
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 40px;
}

.alternative-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.alternative-card {
  background: white;
  border-radius: 15px;
  padding: 35px 25px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.alternative-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

.alternative-card h3 {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 15px;
}

.alternative-card p {
  color: #666;
  margin-bottom: 25px;
  line-height: 1.6;
}

.alternative-card .el-button {
  min-width: 140px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .features-preview {
    grid-template-columns: repeat(2, 1fr);
  }

  .alternative-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2.2rem;
  }

  .coming-soon-section {
    padding: 40px 20px;
  }

  .features-preview {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .action-buttons .el-button {
    width: 100%;
    max-width: 300px;
  }

  .alternative-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.8rem;
  }

  .coming-soon-content h2 {
    font-size: 1.8rem;
  }
}
</style>

<style>
.contact-dialog {
  max-width: 500px;
}

.contact-dialog .el-message-box__content {
  white-space: pre-line;
  line-height: 1.8;
  font-size: 15px;
}
</style>
