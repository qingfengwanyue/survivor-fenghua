import { NextResponse } from 'next/server'

export async function middleware(request) {
  // 1. 构造目标URL
  const targetUrl = `https://sio-tools.vercel.app${request.nextUrl.pathname}${request.nextUrl.search}`
  
  // 2. 发起请求
  const response = await fetch(targetUrl, {
    headers: {
      // 传递重要请求头
      'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
      'Accept': request.headers.get('accept') || '*/*',
      'Host': 'sio-tools.vercel.app',
    }
  })
  
  // 3. 检查是否是HTML响应
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) {
    // 非HTML直接返回
    return response
  }
  
  // 4. 读取并修改HTML
  let html = await response.text()
  
  // 替换图标链接
  html = html.replace(
    /https:\/\/awerc\.github\.io\/sio-cdn\/icons\//g,
    'https://survivor-qing-1258241359.cos.ap-guangzhou.myqcloud.com/icons/'
  )
  
  // 注入你的JS脚本
  html = html.replace(
    '</head>',
    '<script src="/translate-fh.js"></script></head>'
  )
  
  // 5. 返回修改后的响应
  const newResponse = new NextResponse(html, {
    status: response.status,
    headers: response.headers
  })
  
  // 移除可能影响的内容长度头
  newResponse.headers.delete('content-length')
  
  return newResponse
}

// 配置匹配所有路由
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了：
     * - api 路由
     * - 静态文件
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ]
}