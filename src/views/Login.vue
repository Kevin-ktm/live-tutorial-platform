<template>
  <div class="login-page">
    <div class="container">
      <div class="login-wrapper">
        <div class="login-left">
          <div class="login-header">
            <h1>登录直播学院</h1>
            <p>开启你的直播学习之旅</p>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <el-form-item prop="email">
              <el-input
                v-model="loginForm.email"
                placeholder="请输入邮箱"
                size="large"
                :prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <div class="login-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <router-link to="/forgot-password" class="forgot-link"> 忘记密码？ </router-link>
            </div>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                class="login-button"
                @click="handleLogin"
              >
                {{ loading ? '登录中...' : '登录' }}
              </el-button>
            </el-form-item>

            <div class="demo-account">
              <p class="demo-title">演示账号</p>
              <p class="demo-info">
                <span>邮箱：demo@example.com</span>
                <span>密码：demo123</span>
              </p>
              <el-button type="text" @click="useDemoAccount"> 使用演示账号登录 </el-button>
            </div>
          </el-form>

          <div class="register-link">
            还没有账号？
            <router-link to="/register">立即注册</router-link>
          </div>
        </div>

        <div class="login-right">
          <div class="features-list">
            <div class="feature-item">
              <el-icon><VideoCamera /></el-icon>
              <h3>500+ 专业教程</h3>
              <p>涵盖直播全流程教学</p>
            </div>
            <div class="feature-item">
              <el-icon><User /></el-icon>
              <h3>导师1对1指导</h3>
              <p>专业导师解答疑惑</p>
            </div>
            <div class="feature-item">
              <el-icon><Star /></el-icon>
              <h3>学习进度跟踪</h3>
              <p>可视化学习成果</p>
            </div>
            <div class="feature-item">
              <el-icon><Medal /></el-icon>
              <h3>主播认证体系</h3>
              <p>获得官方认证证书</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { Message, Lock, VideoCamera, User, Star, Medal } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref()
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = ref({
  email: '',
  password: '',
})

const loginRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  try {
    // 验证表单
    await loginFormRef.value.validate()

    loading.value = true

    // 调用用户登录
    const { error } = await userStore.signIn(loginForm.value.email, loginForm.value.password)

    if (error) {
      ElMessage.error('登录失败：' + error)
    } else {
      ElMessage.success('登录成功！')
      // 跳转到首页
      router.push('/')
    }
  } catch (error) {
    console.error('登录错误:', error)
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    loading.value = false
  }
}

const useDemoAccount = () => {
  loginForm.value.email = 'demo@example.com'
  loginForm.value.password = 'demo123'
  handleLogin()
}

// 检查是否已登录
onMounted(() => {
  if (userStore.isLoggedIn()) {
    ElMessage.info('您已登录，正在跳转...')
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.login-wrapper {
  display: flex;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-left {
  flex: 1;
  padding: 60px 50px;
}

.login-right {
  width: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 40px;
  color: white;
}

.login-header {
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 1.1rem;
}

.login-form {
  margin-bottom: 30px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.forgot-link {
  color: #409eff;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.login-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.demo-account {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  text-align: center;
}

.demo-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.demo-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.register-link {
  text-align: center;
  color: #666;
  font-size: 0.95rem;
}

.register-link a {
  color: #409eff;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
}

.register-link a:hover {
  text-decoration: underline;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.feature-item {
  text-align: center;
}

.feature-item .el-icon {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.9;
}

.feature-item h3 {
  font-size: 1.3rem;
  margin-bottom: 8px;
}

.feature-item p {
  opacity: 0.8;
  font-size: 0.95rem;
}

@media (max-width: 992px) {
  .login-wrapper {
    flex-direction: column;
  }

  .login-right {
    width: 100%;
    padding: 40px 20px;
  }

  .login-left {
    padding: 40px 30px;
  }
}

@media (max-width: 768px) {
  .login-header h1 {
    font-size: 2rem;
  }

  .login-left {
    padding: 30px 20px;
  }

  .login-right {
    padding: 30px 20px;
  }
}
</style>
