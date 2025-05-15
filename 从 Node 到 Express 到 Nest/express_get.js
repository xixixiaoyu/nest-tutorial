// Express 处理请求 URL 示例
const express = require('express')
const app = express()
const PORT = 3002 // 使用不同端口避免冲突

app.get('/', (req, res) => {
  const path = req.path // 直接获取路径
  const queryParams = req.query // 直接获取查询参数
  res.send(`Express 说：你请求的路径是: ${path}, 查询参数是: ${JSON.stringify(queryParams)}`)
})

app.listen(PORT, () => {
  console.log(`Express GET 服务器跑起来啦，在 http://localhost:${PORT}`)
})
