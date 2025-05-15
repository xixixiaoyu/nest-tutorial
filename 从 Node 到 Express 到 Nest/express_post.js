// Express 处理请求体示例
const express = require('express')
const app = express()
const PORT = 3003 // 使用不同端口避免冲突

// 使用中间件来解析 JSON 和 URL 编码的请求体
app.use(express.json()) // 解析 application/json
app.use(express.urlencoded({ extended: true })) // 解析 application/x-www-form-urlencoded

app.post('/submit', (req, res) => {
  const bodyData = req.body // 直接获取解析后的请求体数据
  res.send(`Express 说：收到了你的 POST 数据: ${JSON.stringify(bodyData)}`)
})

app.listen(PORT, () => {
  console.log(`Express POST 服务器跑起来啦，在 http://localhost:${PORT}`)
})
