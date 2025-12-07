import { createClient } from '@supabase/supabase-js'

// 模拟数据
const mockData = {
  tutorials: [
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
      created_at: '2024-01-15T10:00:00Z',
      thumbnail_url:
        'https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=800&auto=format&fit=crop',
      content: {
        objectives: ['了解直播必备的硬件设备'],
        sections: [
          {
            title: '摄像头选择',
            content: '摄像头是直播的核心设备...',
            tips: ['选择1080p或更高分辨率'],
          },
        ],
        faqs: [
          {
            question: '预算有限优先买什么？',
            answer: '建议优先购买一个好麦克风',
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
      created_at: '2024-01-10T14:30:00Z',
      thumbnail_url:
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop',
      content: {
        objectives: ['掌握背景布置原则'],
        sections: [
          {
            title: '背景选择',
            content: '直播背景要简洁、整洁...',
          },
        ],
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
      created_at: '2024-01-08T09:15:00Z',
      thumbnail_url:
        'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=800&auto=format&fit=crop',
      content: {
        objectives: ['了解美颜参数的作用'],
        sections: [
          {
            title: '基础参数调节',
            content: '磨皮、美白、瘦脸的基本调节...',
          },
        ],
      },
    },
  ],
  categories: [
    {
      id: 1,
      name: '入门基础',
      icon: 'School',
      description: '从零开始的直播入门指南',
      sort_order: 1,
    },
    { id: 2, name: '场景搭建', icon: 'Picture', description: '打造专业直播间环境', sort_order: 2 },
    { id: 3, name: '技术调试', icon: 'Setting', description: '设备与软件设置教程', sort_order: 3 },
    { id: 4, name: '内容创作', icon: 'Edit', description: '直播内容策划与制作', sort_order: 4 },
    {
      id: 5,
      name: '话术沟通',
      icon: 'ChatDotRound',
      description: '互动与销售话术技巧',
      sort_order: 5,
    },
    {
      id: 6,
      name: '运营进阶',
      icon: 'TrendCharts',
      description: '流量获取与数据分析',
      sort_order: 6,
    },
    { id: 7, name: '商业转化', icon: 'Money', description: '变现模式与品牌建设', sort_order: 7 },
    { id: 8, name: '团播专题', icon: 'UserFilled', description: '团队协作直播指南', sort_order: 8 },
  ],
}

// 创建模拟Supabase客户端
const createMockClient = () => {
  return {
    from: (tableName) => {
      console.log(`📦 使用模拟数据: ${tableName}`)

      return {
        select: (columns = '*') => {
          return {
            order: (column, options = { ascending: false }) => {
              return {
                limit: (count) => {
                  const data = mockData[tableName]?.slice(0, count) || []
                  return Promise.resolve({ data, error: null })
                },
                range: (from, to) => {
                  const data = mockData[tableName]?.slice(from, to + 1) || []
                  const count = mockData[tableName]?.length || 0
                  return Promise.resolve({ data, error: null, count })
                },
                single: () => {
                  const data = mockData[tableName]?.[0] || null
                  return Promise.resolve({ data, error: null })
                },
                eq: (col, val) => {
                  if (col === 'id') {
                    const data = mockData[tableName]?.find((item) => item.id === val) || null
                    return Promise.resolve({ data, error: null })
                  }
                  return Promise.resolve({ data: mockData[tableName] || [], error: null })
                },
              }
            },
            eq: (column, value) => {
              if (column === 'category_id') {
                const data = mockData[tableName]?.filter((item) => item.category_id === value) || []
                return Promise.resolve({ data, error: null })
              }
              return Promise.resolve({ data: mockData[tableName] || [], error: null })
            },
            or: (condition) => {
              return Promise.resolve({ data: mockData[tableName] || [], error: null })
            },
            single: () => {
              const data = mockData[tableName]?.[0] || null
              return Promise.resolve({ data, error: null })
            },
          }
        },
        insert: (data) => Promise.resolve({ data, error: null }),
        update: (data) => Promise.resolve({ data, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
          signUp: () => Promise.resolve({ data: { user: null }, error: null }),
          signOut: () => Promise.resolve({ error: null }),
          onAuthStateChange: () => ({}),
        },
      }
    },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({}),
    },
  }
}

// 检查环境变量，决定使用真实客户端还是模拟客户端
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase

if (supabaseUrl && supabaseKey) {
  console.log('🔗 使用真实Supabase连接')
  try {
    supabase = createClient(supabaseUrl, supabaseKey)

    // 测试连接
    supabase
      .from('tutorials')
      .select('count', { count: 'exact', head: true })
      .then(() => console.log('✅ Supabase连接成功'))
      .catch(() => {
        console.log('❌ Supabase连接失败，切换到模拟数据')
        supabase = createMockClient()
      })
  } catch (error) {
    console.log('❌ Supabase初始化失败，使用模拟数据')
    supabase = createMockClient()
  }
} else {
  console.log('🎭 使用模拟数据模式')
  supabase = createMockClient()
}

export { supabase }
