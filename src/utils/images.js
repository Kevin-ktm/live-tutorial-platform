// 图片工具函数
export const images = {
  // 教程封面图片
  tutorials: {
    device:
      'https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=800&auto=format&fit=crop&q=80',
    scene:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    beauty:
      'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=800&auto=format&fit=crop&q=80',
    audio:
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
    lighting:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&auto=format&fit=crop&q=80',
  },

  // 用户头像生成器（使用DiceBear）
  avatar: (seed) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed || 'default'}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`
  },

  // 分类图标（使用Emoji或FontAwesome）
  categoryIcons: {
    1: '🎯', // 入门基础
    2: '🏠', // 场景搭建
    3: '⚙️', // 技术调试
    4: '✍️', // 内容创作
    5: '💬', // 话术沟通
    6: '📈', // 运营进阶
    7: '💰', // 商业转化
    8: '👥', // 团播专题
  },

  // 获取教程封面图
  getTutorialCover: (tutorialId, categoryId) => {
    const covers = [
      'https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&auto=format&fit=crop&q=80',
    ]
    return covers[(tutorialId || categoryId || 0) % covers.length]
  },
}

// 图片预加载
export const preloadImages = (urls) => {
  urls.forEach((url) => {
    const img = new Image()
    img.src = url
  })
}

// 图片加载失败处理
export const imageFallback = (event, fallbackUrl) => {
  event.target.src = fallbackUrl || images.getTutorialCover(1, 1)
}

export default images
