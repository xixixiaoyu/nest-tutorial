// routes/users.js
const express = require('express')
const router = express.Router()

// 用户相关的路由
router.get('/', (req, res) => {
  res.send('获取用户列表 (模块化路由)')
})

router.post('/', (req, res) => {
  res.send('创建新用户 (模块化路由)')
})

module.exports = router
