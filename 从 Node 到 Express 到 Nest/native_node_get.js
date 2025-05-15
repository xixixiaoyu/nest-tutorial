// 原生 Node 处理请求 URL 示例
const http = require('http')
const url = require('url')

const server = http.createServer((req, res) => {
  // 解析请求的 URL
  const parsedUrl = url.parse(req.url, true)
  // 获取路径和查询参数
  const path = parsedUrl.pathname
  const queryParams = parsedUrl.query

  // 设置响应头
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }) // 加上 charset=utf-8 避免中文乱码
  res.end(`你请求的路径是: ${path}, 查询参数是: ${JSON.stringify(queryParams)}`)
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`服务器跑起来啦，在 http://localhost:${PORT}`)
})
