<template>
  <div class="account-binding">
    <div class="binding-header">
      <h3>
        <el-icon><Link /></el-icon> 账号绑定
      </h3>
      <p class="subtitle">绑定其他账号，方便快速登录和同步数据</p>
    </div>

    <div class="binding-list">
      <!-- 邮箱绑定 -->
      <div class="binding-item" :class="{ bound: isEmailBound }">
        <div class="item-icon">
          <div class="icon-wrapper email-icon">
            <el-icon><Message /></el-icon>
          </div>
        </div>
        <div class="item-info">
          <div class="item-title">
            <h4>邮箱账号</h4>
            <el-tag v-if="isEmailBound" type="success" size="small">已绑定</el-tag>
            <el-tag v-else type="info" size="small">未绑定</el-tag>
          </div>
          <p class="item-desc">用于登录、找回密码、接收通知</p>
          <div v-if="isEmailBound" class="bound-info">
            <span class="bound-value">{{ email }}</span>
            <el-button type="text" size="small" @click="unbindEmail"> 解绑 </el-button>
          </div>
        </div>
        <div class="item-actions">
          <el-button v-if="!isEmailBound" type="primary" size="small" @click="showEmailDialog">
            绑定
          </el-button>
          <el-button v-else type="text" size="small" @click="changeEmail"> 更换 </el-button>
        </div>
      </div>

      <!-- 手机绑定 -->
      <div class="binding-item" :class="{ bound: isPhoneBound }">
        <div class="item-icon">
          <div class="icon-wrapper phone-icon">
            <el-icon><Phone /></el-icon>
          </div>
        </div>
        <div class="item-info">
          <div class="item-title">
            <h4>手机号</h4>
            <el-tag v-if="isPhoneBound" type="success" size="small">已绑定</el-tag>
            <el-tag v-else type="info" size="small">未绑定</el-tag>
          </div>
          <p class="item-desc">用于手机号登录、接收验证码</p>
          <div v-if="isPhoneBound" class="bound-info">
            <span class="bound-value">{{ phone }}</span>
            <el-button type="text" size="small" @click="unbindPhone"> 解绑 </el-button>
          </div>
        </div>
        <div class="item-actions">
          <el-button v-if="!isPhoneBound" type="primary" size="small" @click="showPhoneDialog">
            绑定
          </el-button>
          <el-button v-else type="text" size="small" @click="changePhone"> 更换 </el-button>
        </div>
      </div>

      <!-- 微信绑定 -->
      <div class="binding-item" :class="{ bound: isWechatBound }">
        <div class="item-icon">
          <div class="icon-wrapper wechat-icon">
            <el-icon><ChatDotSquare /></el-icon>
          </div>
        </div>
        <div class="item-info">
          <div class="item-title">
            <h4>微信账号</h4>
            <el-tag v-if="isWechatBound" type="success" size="small">已绑定</el-tag>
            <el-tag v-else type="info" size="small">未绑定</el-tag>
          </div>
          <p class="item-desc">使用微信快速登录和分享内容</p>
          <div v-if="isWechatBound" class="bound-info">
            <span class="bound-value">{{ wechatInfo.nickname }}</span>
            <el-button type="text" size="small" @click="unbindWechat"> 解绑 </el-button>
          </div>
        </div>
        <div class="item-actions">
          <el-button v-if="!isWechatBound" type="success" size="small" @click="bindWechat">
            <el-icon><ChatDotSquare /></el-icon>
            绑定微信
          </el-button>
          <el-button v-else type="text" size="small" @click="unbindWechat"> 解绑 </el-button>
        </div>
      </div>

      <!-- QQ绑定 -->
      <div class="binding-item" :class="{ bound: isQQBound }">
        <div class="item-icon">
          <div class="icon-wrapper qq-icon">
            <el-icon><ChatLineSquare /></el-icon>
          </div>
        </div>
        <div class="item-info">
          <div class="item-title">
            <h4>QQ账号</h4>
            <el-tag v-if="isQQBound" type="success" size="small">已绑定</el-tag>
            <el-tag v-else type="info" size="small">未绑定</el-tag>
          </div>
          <p class="item-desc">使用QQ快速登录和同步好友</p>
          <div v-if="isQQBound" class="bound-info">
            <span class="bound-value">{{ qqInfo.nickname }}</span>
            <el-button type="text" size="small" @click="unbindQQ"> 解绑 </el-button>
          </div>
        </div>
        <div class="item-actions">
          <el-button v-if="!isQQBound" type="primary" size="small" @click="bindQQ">
            <el-icon><ChatLineSquare /></el-icon>
            绑定QQ
          </el-button>
          <el-button v-else type="text" size="small" @click="unbindQQ"> 解绑 </el-button>
        </div>
      </div>

      <!-- 微博绑定 -->
      <div class="binding-item" :class="{ bound: isWeiboBound }">
        <div class="item-icon">
          <div class="icon-wrapper weibo-icon">
            <el-icon><Comment /></el-icon>
          </div>
        </div>
        <div class="item-info">
          <div class="item-title">
            <h4>微博账号</h4>
            <el-tag v-if="isWeiboBound" type="success" size="small">已绑定</el-tag>
            <el-tag v-else type="info" size="small">未绑定</el-tag>
          </div>
          <p class="item-desc">同步微博内容，快速分享直播动态</p>
          <div v-if="isWeiboBound" class="bound-info">
            <span class="bound-value">{{ weiboInfo.nickname }}</span>
            <el-button type="text" size="small" @click="unbindWeibo"> 解绑 </el-button>
          </div>
        </div>
        <div class="item-actions">
          <el-button v-if="!isWeiboBound" type="warning" size="small" @click="bindWeibo">
            <el-icon><Comment /></el-icon>
            绑定微博
          </el-button>
          <el-button v-else type="text" size="small" @click="unbindWeibo"> 解绑 </el-button>
        </div>
      </div>
    </div>

    <!-- 绑定统计 -->
    <div class="binding-stats">
      <div class="stat-item">
        <div class="stat-number">{{ boundCount }}</div>
        <div class="stat-label">已绑定账号</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ totalCount - boundCount }}</div>
        <div class="stat-label">可绑定账号</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ totalCount }}</div>
        <div class="stat-label">总账号数</div>
      </div>
    </div>

    <!-- 邮箱绑定对话框 -->
    <el-dialog v-model="showEmailBinding" title="绑定邮箱" width="400px">
      <el-form :model="emailForm" label-width="80px">
        <el-form-item label="邮箱地址">
          <el-input v-model="emailForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>
        <el-form-item label="验证码">
          <div class="captcha-input">
            <el-input v-model="emailForm.captcha" placeholder="请输入验证码" />
            <el-button
              type="primary"
              size="small"
              :disabled="captchaCountdown > 0"
              @click="sendEmailCaptcha"
            >
              {{ captchaCountdown > 0 ? `${captchaCountdown}秒后重试` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEmailBinding = false">取消</el-button>
        <el-button type="primary" @click="confirmBindEmail">确认绑定</el-button>
      </template>
    </el-dialog>

    <!-- 手机绑定对话框 -->
    <el-dialog v-model="showPhoneBinding" title="绑定手机" width="400px">
      <el-form :model="phoneForm" label-width="80px">
        <el-form-item label="手机号">
          <el-input v-model="phoneForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="验证码">
          <div class="captcha-input">
            <el-input v-model="phoneForm.captcha" placeholder="请输入验证码" />
            <el-button
              type="primary"
              size="small"
              :disabled="captchaCountdown > 0"
              @click="sendPhoneCaptcha"
            >
              {{ captchaCountdown > 0 ? `${captchaCountdown}秒后重试` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPhoneBinding = false">取消</el-button>
        <el-button type="primary" @click="confirmBindPhone">确认绑定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 绑定状态
const isEmailBound = ref(true)
const isPhoneBound = ref(false)
const isWechatBound = ref(true)
const isQQBound = ref(false)
const isWeiboBound = ref(false)

// 绑定信息
const email = ref('user@example.com')
const phone = ref('138****5678')
const wechatInfo = ref({
  nickname: '微信用户',
  avatar: '',
})
const qqInfo = ref({
  nickname: 'QQ用户',
  avatar: '',
})
const weiboInfo = ref({
  nickname: '微博用户',
  avatar: '',
})

// 对话框控制
const showEmailBinding = ref(false)
const showPhoneBinding = ref(false)
const captchaCountdown = ref(0)

// 表单数据
const emailForm = ref({
  email: '',
  captcha: '',
})

const phoneForm = ref({
  phone: '',
  captcha: '',
})

// 计算属性
const boundCount = computed(() => {
  let count = 0
  if (isEmailBound.value) count++
  if (isPhoneBound.value) count++
  if (isWechatBound.value) count++
  if (isQQBound.value) count++
  if (isWeiboBound.value) count++
  return count
})

const totalCount = computed(() => 5)

// 方法
const showEmailDialog = () => {
  emailForm.value = { email: '', captcha: '' }
  showEmailBinding.value = true
}

const showPhoneDialog = () => {
  phoneForm.value = { phone: '', captcha: '' }
  showPhoneBinding.value = true
}

const sendEmailCaptcha = () => {
  if (!emailForm.value.email) {
    ElMessage.warning('请输入邮箱地址')
    return
  }

  // 模拟发送验证码
  captchaCountdown.value = 60
  const timer = setInterval(() => {
    captchaCountdown.value--
    if (captchaCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  ElMessage.success('验证码已发送到邮箱，请注意查收')
}

const sendPhoneCaptcha = () => {
  if (!phoneForm.value.phone) {
    ElMessage.warning('请输入手机号')
    return
  }

  // 模拟发送验证码
  captchaCountdown.value = 60
  const timer = setInterval(() => {
    captchaCountdown.value--
    if (captchaCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  ElMessage.success('验证码已发送到手机，请注意查收')
}

const confirmBindEmail = () => {
  if (!emailForm.value.email || !emailForm.value.captcha) {
    ElMessage.warning('请填写完整信息')
    return
  }

  // 模拟绑定
  isEmailBound.value = true
  email.value = emailForm.value.email
  showEmailBinding.value = false
  ElMessage.success('邮箱绑定成功')
}

const confirmBindPhone = () => {
  if (!phoneForm.value.phone || !phoneForm.value.captcha) {
    ElMessage.warning('请填写完整信息')
    return
  }

  // 模拟绑定
  isPhoneBound.value = true
  phone.value = phoneForm.value.phone
  showPhoneBinding.value = false
  ElMessage.success('手机绑定成功')
}

const changeEmail = () => {
  emailForm.value.email = email.value
  showEmailBinding.value = true
}

const changePhone = () => {
  phoneForm.value.phone = phone.value
  showPhoneBinding.value = true
}

const bindWechat = () => {
  ElMessageBox.confirm('即将跳转到微信进行授权绑定，确认继续吗？', '微信授权', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info',
  }).then(() => {
    // 模拟微信绑定
    isWechatBound.value = true
    ElMessage.success('微信绑定成功')
  })
}

const bindQQ = () => {
  ElMessageBox.confirm('即将跳转到QQ进行授权绑定，确认继续吗？', 'QQ授权', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info',
  }).then(() => {
    // 模拟QQ绑定
    isQQBound.value = true
    ElMessage.success('QQ绑定成功')
  })
}

const bindWeibo = () => {
  ElMessageBox.confirm('即将跳转到微博进行授权绑定，确认继续吗？', '微博授权', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info',
  }).then(() => {
    // 模拟微博绑定
    isWeiboBound.value = true
    ElMessage.success('微博绑定成功')
  })
}

const unbindEmail = () => {
  ElMessageBox.confirm('解绑邮箱后将无法使用邮箱登录，确认解绑吗？', '确认解绑', {
    confirmButtonText: '确认解绑',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    isEmailBound.value = false
    email.value = ''
    ElMessage.success('邮箱解绑成功')
  })
}

const unbindPhone = () => {
  ElMessageBox.confirm('解绑手机后将无法使用手机号登录，确认解绑吗？', '确认解绑', {
    confirmButtonText: '确认解绑',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    isPhoneBound.value = false
    phone.value = ''
    ElMessage.success('手机解绑成功')
  })
}

const unbindWechat = () => {
  ElMessageBox.confirm('解绑微信后将无法使用微信快速登录，确认解绑吗？', '确认解绑', {
    confirmButtonText: '确认解绑',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    isWechatBound.value = false
    ElMessage.success('微信解绑成功')
  })
}

const unbindQQ = () => {
  ElMessageBox.confirm('解绑QQ后将无法使用QQ快速登录，确认解绑吗？', '确认解绑', {
    confirmButtonText: '确认解绑',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    isQQBound.value = false
    ElMessage.success('QQ解绑成功')
  })
}

const unbindWeibo = () => {
  ElMessageBox.confirm('解绑微博后将无法使用微博快速登录，确认解绑吗？', '确认解绑', {
    confirmButtonText: '确认解绑',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    isWeiboBound.value = false
    ElMessage.success('微博解绑成功')
  })
}
</script>

<style scoped>
.account-binding {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.binding-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f7ff;
}

.binding-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 0.95rem;
}

.binding-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.binding-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #edf2f7;
  transition: all 0.3s;
}

.binding-item:hover {
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.binding-item.bound {
  border-color: #c6f6d5;
  background: linear-gradient(90deg, #f0fff4, #ffffff);
}

.item-icon {
  flex-shrink: 0;
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.email-icon {
  background: linear-gradient(135deg, #4299e1, #3182ce);
}

.phone-icon {
  background: linear-gradient(135deg, #48bb78, #38a169);
}

.wechat-icon {
  background: linear-gradient(135deg, #38a169, #2f855a);
}

.qq-icon {
  background: linear-gradient(135deg, #4299e1, #3182ce);
}

.weibo-icon {
  background: linear-gradient(135deg, #e53e3e, #c53030);
}

.item-info {
  flex: 1;
}

.item-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.item-title h4 {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
}

.item-desc {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.bound-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.bound-value {
  color: #4a5568;
  font-weight: 500;
  font-size: 0.95rem;
}

.item-actions {
  flex-shrink: 0;
}

.binding-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
}

.captcha-input {
  display: flex;
  gap: 10px;
}

.captcha-input .el-input {
  flex: 1;
}

@media (max-width: 768px) {
  .binding-item {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .item-info {
    text-align: center;
  }

  .item-title {
    flex-direction: column;
    gap: 8px;
  }

  .bound-info {
    flex-direction: column;
    gap: 10px;
  }

  .binding-stats {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
