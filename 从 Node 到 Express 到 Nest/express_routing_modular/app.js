// app.js (另一种模块化路由管理方式)
const express = require('express')
const app = express()
const PORT = 3005 // 使用不同端口避免冲突

const usersRoutes = require('./routes/users')
const productsRoutes = require('./routes/products')

app.use('/users', usersRoutes)
app.use('/products', productsRoutes)

app.listen(PORT, () => {
  console.log(`Express 模块化路由服务器跑起来啦，在 http://localhost:${PORT}`)
})
