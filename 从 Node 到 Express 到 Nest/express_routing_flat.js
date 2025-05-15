// app.js (一种路由管理方式)
const express = require('express')
const app = express()
const PORT = 3004 // 使用不同端口避免冲突

app.get('/users', (req, res) => {
  res.send('获取用户列表 (扁平化路由)')
})

app.post('/users', (req, res) => {
  res.send('创建新用户 (扁平化路由)')
})

app.get('/products', (req, res) => {
  res.send('获取产品列表 (扁平化路由)')
})

app.post('/products', (req, res) => {
  res.send('创建新产品 (扁平化路由)')
})

// ... 可以有无数个路由

app.listen(PORT, () => {
  console.log(`Express 扁平化路由服务器跑起来啦，在 http://localhost:${PORT}`)
})
