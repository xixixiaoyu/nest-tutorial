const http = require('http')

const server = http.createServer((req, res) => {
  // 只处理POST请求
  if (req.method === 'POST') {
    // 存储接收到的数据片段
    let body = ''

    // 监听数据片段到达事件
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    // 监听数据接收完成事件
    req.on('end', () => {
      let parsedBody

      // 根据Content-Type解析数据
      const contentType = req.headers['content-type']

      if (contentType === 'application/json') {
        try {
          parsedBody = JSON.parse(body)
        } catch (error) {
          res.statusCode = 400
          res.end('Invalid JSON')
          return
        }
      } else if (contentType === 'application/x-www-form-urlencoded') {
        // 解析表单数据
        parsedBody = {}
        body.split('&').forEach((item) => {
          const [key, value] = item.split('=')
          parsedBody[decodeURIComponent(key)] = decodeURIComponent(value)
        })
      } else {
        // 其他类型的数据，可能需要其他解析方法
        parsedBody = body
      }

      // 现在可以使用解析后的请求体数据
      console.log('请求体数据:', parsedBody)

      // 返回响应
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ message: '数据接收成功', data: parsedBody }))
    })
  } else {
    res.statusCode = 405
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('只接受POST请求')
  }
})

const PORT = 3001 // 使用不同端口避免与 native_node_get.js 冲突
server.listen(PORT, () => {
  console.log(`原生 Node POST 服务器运行在 http://localhost:${PORT}/`)
})
