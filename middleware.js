import { NextResponse } from 'next/server'

export async function middleware(request) {
  const targetUrl = `https://sio-tools.vercel.app${request.nextUrl.pathname}${request.nextUrl.search}`
  
  const response = await fetch(targetUrl)
  
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) {
    return response
  }
  
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
  
  return new NextResponse(html, {
    status: response.status,
    headers: response.headers
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|translate-fh\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ]
}
