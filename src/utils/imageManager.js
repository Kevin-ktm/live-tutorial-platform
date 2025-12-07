// 图片资源管理器
export const imageManager = {
  // 教程分类封面图
  categoryCovers: {
    1: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    2: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop&q=80',
    3: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
    4: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&auto=format&fit=crop&q=80',
    5: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop&q=80',
    6: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    7: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80',
    8: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80',
  },

  // 教程详细封面图
  tutorialCovers: [
    // 设备相关
    'https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80',

    // 场景相关
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&auto=format&fit=crop&q=80',

    // 美颜/技术相关
    'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80',

    // 电商/话术相关
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80',
  ],

  // 用户头像
  avatars: [
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  ],

  // 获取教程封面图
  getTutorialCover: (tutorialId, categoryId) => {
    const covers = imageManager.tutorialCovers
    const index = ((tutorialId || 0) * 13 + (categoryId || 0) * 7) % covers.length
    return covers[index]
  },

  // 获取分类封面图
  getCategoryCover: (categoryId) => {
    return imageManager.categoryCovers[categoryId] || imageManager.categoryCovers[1]
  },

  // 获取随机用户头像
  getRandomAvatar: () => {
    const index = Math.floor(Math.random() * imageManager.avatars.length)
    return imageManager.avatars[index]
  },

  // 图片加载失败处理
  handleImageError: (event, fallbackUrl) => {
    const img = event.target
    if (img.src && !img.src.includes('default')) {
      img.src = fallbackUrl || imageManager.getTutorialCover(1, 1)
      img.onerror = null // 防止循环
    }
  },

  // 预加载图片
  preloadImages: (urls) => {
    urls.forEach((url) => {
      const img = new Image()
      img.src = url
    })
  },
}

export default imageManager
