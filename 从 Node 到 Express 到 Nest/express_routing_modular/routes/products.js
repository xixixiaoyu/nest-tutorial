// routes/products.js
const express = require('express')
const router = express.Router()

// 产品相关的路由
router.get('/', (req, res) => {
  res.send('获取产品列表 (模块化路由)')
})

router.post('/', (req, res) => {
  res.send('创建新产品 (模块化路由)')
})

module.exports = router
