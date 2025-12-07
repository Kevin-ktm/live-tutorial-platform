<template>
  <div class="change-password-dialog">
    <el-dialog
      v-model="dialogVisible"
      title="修改密码"
      width="500px"
      :before-close="handleClose"
      @open="resetForm"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
        class="password-form"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="passwordForm.currentPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
            clearable
          />
          <div class="password-strength">
            <div
              :class="['strength-bar', getStrengthClass(passwordForm.newPassword)]"
              :style="{ width: getPasswordStrength(passwordForm.newPassword) + '%' }"
            ></div>
          </div>
          <div class="password-tips">
            <p :class="{ valid: isPasswordValid(passwordForm.newPassword, 'length') }">
              ✓ 至少8个字符
            </p>
            <p :class="{ valid: isPasswordValid(passwordForm.newPassword, 'letter') }">
              ✓ 包含字母
            </p>
            <p :class="{ valid: isPasswordValid(passwordForm.newPassword, 'number') }">
              ✓ 包含数字
            </p>
            <p :class="{ valid: isPasswordValid(passwordForm.newPassword, 'special') }">
              ✓ 包含特殊字符
            </p>
          </div>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            clearable
          />
        </el-form-item>

        <!-- 安全提示 -->
        <div class="security-tips">
          <h4>
            <el-icon><Lock /></el-icon> 安全提示
          </h4>
          <ul>
            <li>密码应至少8个字符，包含字母、数字和特殊字符</li>
            <li>不要使用生日、电话号码等容易被猜到的密码</li>
            <li>定期更换密码可以增加账号安全性</li>
            <li>不要在多处使用相同密码</li>
          </ul>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
            :disabled="!formValid"
          >
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible', 'success'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const passwordFormRef = ref()
const submitting = ref(false)

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 密码强度检查
const checkPasswordStrength = (password) => {
  if (!password) return 0

  let strength = 0
  if (password.length >= 8) strength += 20
  if (/[a-zA-Z]/.test(password)) strength += 20
  if (/[0-9]/.test(password)) strength += 20
  if (/[^a-zA-Z0-9]/.test(password)) strength += 20
  if (password.length >= 12) strength += 20

  return Math.min(strength, 100)
}

// 密码验证规则
const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 8) {
    callback(new Error('密码长度不能少于8位'))
  } else if (!/[a-zA-Z]/.test(value)) {
    callback(new Error('密码必须包含字母'))
  } else if (!/[0-9]/.test(value)) {
    callback(new Error('密码必须包含数字'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== passwordForm.value.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
}

// 计算属性
const getPasswordStrength = (password) => {
  return checkPasswordStrength(password)
}

const getStrengthClass = (password) => {
  const strength = checkPasswordStrength(password)
  if (strength < 40) return 'strength-weak'
  if (strength < 70) return 'strength-medium'
  return 'strength-strong'
}

const isPasswordValid = (password, type) => {
  if (!password) return false

  switch (type) {
    case 'length':
      return password.length >= 8
    case 'letter':
      return /[a-zA-Z]/.test(password)
    case 'number':
      return /[0-9]/.test(password)
    case 'special':
      return /[^a-zA-Z0-9]/.test(password)
    default:
      return false
  }
}

const formValid = computed(() => {
  return (
    passwordForm.value.currentPassword &&
    passwordForm.value.newPassword &&
    passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword
  )
})

// 方法
const resetForm = () => {
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  try {
    await passwordFormRef.value.validate()

    submitting.value = true

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    ElMessage.success('密码修改成功！请重新登录')
    emit('success')
    handleClose()
  } catch (error) {
    ElMessage.error('修改密码失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 监听密码变化
watch(
  () => passwordForm.value.newPassword,
  (newVal) => {
    if (newVal === passwordForm.value.currentPassword) {
      ElMessage.warning('新密码不能与当前密码相同')
    }
  },
)
</script>

<style scoped>
.password-form {
  padding: 10px 20px 0;
}

.password-strength {
  height: 6px;
  background: #e4e7ed;
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  border-radius: 3px;
  transition: all 0.3s;
}

.strength-weak {
  background: linear-gradient(90deg, #f56565, #e53e3e);
}

.strength-medium {
  background: linear-gradient(90deg, #ed8936, #dd6b20);
}

.strength-strong {
  background: linear-gradient(90deg, #48bb78, #38a169);
}

.password-tips {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.password-tips p {
  font-size: 12px;
  color: #a0aec0;
  margin: 2px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.password-tips p:before {
  content: '○';
  font-size: 8px;
}

.password-tips p.valid {
  color: #48bb78;
}

.password-tips p.valid:before {
  content: '✓';
}

.security-tips {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4299e1;
}

.security-tips h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2d3748;
  margin-bottom: 10px;
  font-size: 14px;
}

.security-tips ul {
  margin: 0;
  padding-left: 20px;
}

.security-tips li {
  color: #718096;
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
