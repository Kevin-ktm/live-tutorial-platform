# check-deployment.ps1 - 部署后检查
Write-Host "🔍 部署后检查脚本" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan

# 1. 获取部署URL
Write-Host "`n🌐 获取部署URL..." -ForegroundColor Cyan
$vercelUrl = "https://live-tutorial-platform-ot9a313f8-kevin-ys-projects.vercel.app"
Write-Host "部署URL: $vercelUrl" -ForegroundColor Yellow

# 2. 检查是否可以访问
Write-Host "`n📡 检查网络连通性..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $vercelUrl -Method Head -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ 网站可访问 (状态码: $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "⚠️ 网站返回状态码: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ 无法访问网站: $_" -ForegroundColor Red
}

# 3. 检查主要页面
Write-Host "`n📄 检查主要页面..." -ForegroundColor Cyan
$pages = @(
    "/",
    "/tutorials",
    "/tutorial/1",
    "/categories",
    "/community",
    "/search",
    "/login",
    "/register",
    "/profile"
)

foreach ($page in $pages) {
    $url = "$vercelUrl$page"
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $page 可访问" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $page 返回 $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ $page 无法访问" -ForegroundColor Red
    }
}

# 4. 性能建议
Write-Host "`n⚡ 性能优化建议:" -ForegroundColor Yellow
Write-Host "1. element-plus 库较大 (1.1MB)，可以考虑按需导入" -ForegroundColor White
Write-Host "2. 图片可以考虑使用 WebP 格式" -ForegroundColor White
Write-Host "3. 可以使用 CDN 加速静态资源" -ForegroundColor White
Write-Host "4. 启用 Gzip/Brotli 压缩" -ForegroundColor White

# 5. 用户体验建议
Write-Host "`n👥 用户体验建议:" -ForegroundColor Yellow
Write-Host "1. 添加页面加载动画" -ForegroundColor White
Write-Host "2. 添加错误边界处理" -ForegroundColor White
Write-Host "3. 添加离线支持 (PWA)" -ForegroundColor White
Write-Host "4. 添加用户反馈机制" -ForegroundColor White

# 6. 下一步行动
Write-Host "`n🚀 下一步行动:" -ForegroundColor Cyan
Write-Host "1. 分享给朋友测试: $vercelUrl" -ForegroundColor White
Write-Host "2. 收集用户反馈" -ForegroundColor White
Write-Host "3. 监控网站性能" -ForegroundColor White
Write-Host "4. 定期更新内容" -ForegroundColor White

Write-Host "`n✨ 检查完成！" -ForegroundColor Green
Write-Host "你的直播学院项目已经成功部署！" -ForegroundColor Cyan