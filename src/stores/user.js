import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref(null)
    const profile = ref(null)
    const loading = ref(false)

    // 初始化用户
    const initialize = async () => {
      loading.value = true
      try {
        // 检查本地存储
        const storedUser = localStorage.getItem('user')
        const storedProfile = localStorage.getItem('user_profile')

        if (storedUser && storedProfile) {
          user.value = JSON.parse(storedUser)
          profile.value = JSON.parse(storedProfile)
        }
      } catch (error) {
        console.error('用户初始化失败:', error)
        user.value = mockUser
        profile.value = mockProfile
      } finally {
        loading.value = false
      }
    }

    // 登录
    const signIn = async (email, password) => {
      loading.value = true
      try {
        // 模拟登录验证
        if (email && password) {
          // 创建用户对象
          const newUser = {
            id: `user-${Date.now()}`,
            email: email,
            username: email.split('@')[0] || '新用户',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          }

          const newProfile = {
            id: newUser.id,
            username: newUser.username,
            avatar_url: newUser.avatar,
            bio: '',
            level: 1,
            learning_progress: {},
          }

          // 保存到状态
          user.value = newUser
          profile.value = newProfile

          // 保存到本地存储
          localStorage.setItem('user', JSON.stringify(newUser))
          localStorage.setItem('user_profile', JSON.stringify(newProfile))

          return { data: { user: user.value }, error: null }
        } else {
          throw new Error('邮箱和密码不能为空')
        }
      } catch (error) {
        console.error('登录失败:', error)
        return { data: null, error: error.message }
      } finally {
        loading.value = false
      }
    }

    // 注册
    const signUp = async (email, password, username) => {
      loading.value = true
      try {
        // 模拟注册
        const newUser = {
          id: `new-user-${Date.now()}`,
          email: email,
          username: username || email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        }

        const newProfile = {
          id: newUser.id,
          username: newUser.username,
          avatar_url: newUser.avatar,
          bio: '',
          level: 1,
          learning_progress: {},
        }

        // 保存到状态
        user.value = newUser
        profile.value = newProfile

        // 保存到本地存储
        localStorage.setItem('user', JSON.stringify(newUser))
        localStorage.setItem('user_profile', JSON.stringify(newProfile))

        return { data: { user: newUser }, error: null }
      } catch (error) {
        console.error('注册失败:', error)
        return { data: null, error: error.message }
      } finally {
        loading.value = false
      }
    }

    // 登出
    const logout = async () => {
      try {
        // 清除状态
        user.value = null
        profile.value = null

        // 清除本地存储
        localStorage.removeItem('user')
        localStorage.removeItem('user_profile')

        // 清除其他相关存储
        localStorage.removeItem('favorites')
        localStorage.removeItem('pinia')

        console.log('用户已登出')
      } catch (error) {
        console.error('登出失败:', error)
      }
    }

    // 检查是否已登录
    const isLoggedIn = () => {
      return !!user.value
    }

    return {
      user,
      profile,
      loading,
      initialize,
      signIn,
      signUp,
      logout,
      isLoggedIn,
    }
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage,
      paths: ['user', 'profile'],
    },
  },
)
