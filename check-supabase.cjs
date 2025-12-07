const https = require('https')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log('=== Supabase连接诊断工具 ===\n')

rl.question('请输入你的Supabase URL（以https://开头）: ', (url) => {
  rl.question('请输入你的Supabase匿名密钥: ', (key) => {
    testConnection(url.trim(), key.trim())
    rl.close()
  })
})

function testConnection(url, key) {
  console.log('\n开始测试连接...')

  // 测试1: 检查URL格式
  if (!url.startsWith('https://')) {
    console.log('❌ URL格式错误，必须以https://开头')
    return
  }

  // 测试2: 检查是否能访问REST API
  const apiUrl = `${url}/rest/v1/`
  const options = {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  }

  console.log(`\n1. 测试API连接: ${apiUrl}`)

  const req = https.request(apiUrl, options, (res) => {
    console.log(`   状态码: ${res.statusCode}`)

    let data = ''
    res.on('data', (chunk) => (data += chunk))
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('   ✅ API连接成功')
        testTables(url, key)
      } else {
        console.log('   ❌ API连接失败')
        console.log('   响应:', data)
      }
    })
  })

  req.on('error', (error) => {
    console.log('   ❌ 请求失败:', error.message)
  })

  req.end()
}

function testTables(url, key) {
  const tables = ['tutorials', 'categories']

  tables.forEach((table, index) => {
    setTimeout(() => {
      console.log(`\n${index + 2}. 测试表: ${table}`)

      const tableUrl = `${url}/rest/v1/${table}?limit=1`
      const options = {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      }

      const req = https.request(tableUrl, options, (res) => {
        console.log(`   状态码: ${res.statusCode}`)

        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log(`   ✅ ${table}表访问成功`)
            try {
              const jsonData = JSON.parse(data)
              console.log(`   数据条数: ${jsonData.length}`)
            } catch (e) {
              console.log('   响应格式:', data.substring(0, 100))
            }
          } else if (res.statusCode === 401) {
            console.log(`   ❌ ${table}表: 认证失败，请检查密钥`)
          } else if (res.statusCode === 404) {
            console.log(`   ❌ ${table}表: 表不存在，需要创建表`)
          } else if (res.statusCode === 500) {
            console.log(`   ❌ ${table}表: 服务器错误，可能是RLS策略问题`)
            console.log('   建议: 在Supabase控制台关闭该表的RLS')
          } else {
            console.log(`   ❌ ${table}表: 未知错误`)
            console.log('   响应:', data.substring(0, 200))
          }
        })
      })

      req.on('error', (error) => {
        console.log('   请求失败:', error.message)
      })

      req.end()
    }, index * 1000)
  })
}
