import { NextResponse } from 'next/server'

export async function middleware(request) {
  const url = request.nextUrl
  
  // ========== 1. 跳过不需要处理的请求 ==========
  // 静态文件直接返回，不经过中间件处理
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/public/') ||
    url.pathname === '/translate-fh.js' ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif|json|map)$/)
  ) {
    return NextResponse.next()
  }
  
  // ========== 2. 代理到目标网站 ==========
  const targetUrl = `https://sio-tools.vercel.app${url.pathname}${url.search}`
  
  console.log(`[Middleware] 代理请求: ${url.pathname} -> ${targetUrl}`)
  
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Referer': `https://sio-tools.vercel.app`,
        'Host': 'sio-tools.vercel.app'
      }
    })
    
    // ========== 3. 只处理HTML响应 ==========
    const contentType = response.headers.get('content-type') || ''
    
    if (!contentType.includes('text/html')) {
      console.log(`[Middleware] 非HTML响应，直接返回: ${contentType}`)
      return response
    }
    
    // ========== 4. 读取并修改HTML ==========
    let html = await response.text()
    console.log(`[Middleware] 读取HTML成功，长度: ${html.length}`)
    
    // 调试：检查原始HTML中是否有目标内容
    const hasOriginalIcons = html.includes('awerc.github.io/sio-cdn/icons/')
    const hasHeadTag = html.includes('</head>')
    console.log(`[Middleware] 原始HTML检查: 有图标链接=${hasOriginalIcons}, 有</head>标签=${hasHeadTag}`)
    
    // 替换图标链接 - 更全面的匹配
    const iconReplacements = [
      // GitHub原始地址
      'https://awerc.github.io/sio-cdn/icons/',
      'http://awerc.github.io/sio-cdn/icons/',
      '//awerc.github.io/sio-cdn/icons/',
      'awerc.github.io/sio-cdn/icons/',
      
      // 可能的其他变体
      'https://github.com/awerc/sio-cdn/icons/',
      'awerc/sio-cdn/icons/'
    ]
    
    let replacementCount = 0
    iconReplacements.forEach(pattern => {
      const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      const matches = html.match(regex)
      if (matches) {
        replacementCount += matches.length
        html = html.replace(regex, 'https://survivor-qing-1258241359.cos.ap-guangzhou.myqcloud.com/icons/')
      }
    })
    console.log(`[Middleware] 替换图标链接: ${replacementCount} 处`)
    
    // 注入JS脚本 - 确保在</head>之前
    if (html.includes('</head>')) {
      html = html.replace(
        '</head>',
        '<script src="/translate-fh.js"></script>\n</head>'
      )
      console.log('[Middleware] JS脚本注入成功')
    } else if (html.includes('</HEAD>')) {
      html = html.replace(
        '</HEAD>',
        '<script src="/translate-fh.js"></script>\n</HEAD>'
      )
      console.log('[Middleware] JS脚本注入成功(大写标签)')
    } else {
      // 如果没有找到</head>，在<body>前插入
      if (html.includes('<body')) {
        const bodyIndex = html.indexOf('<body')
        const headCloseIndex = html.lastIndexOf('</head>', bodyIndex)
        if (headCloseIndex > -1) {
          html = html.slice(0, headCloseIndex) + 
                 '<script src="/translate-fh.js"></script>' + 
                 html.slice(headCloseIndex)
        } else {
          // 在<body>标签后插入
          html = html.replace('<body', '<body><script src="/translate-fh.js"></script>')
        }
        console.log('[Middleware] JS脚本注入成功(在body标签处)')
      } else {
        console.log('[Middleware] 警告：未找到</head>或<body>标签')
      }
    }
    
    // ========== 5. 创建新响应 ==========
    const newResponse = new NextResponse(html, {
      status: response.status,
      headers: response.headers
    })
    
    // 移除可能影响的内容长度头
    newResponse.headers.delete('content-length')
    
    // 添加调试头
    newResponse.headers.set('X-Middleware-Processed', 'true')
    newResponse.headers.set('X-Icon-Replacements', replacementCount.toString())
    
    console.log(`[Middleware] 处理完成，返回修改后的响应`)
    return newResponse
    
  } catch (error) {
    console.error('[Middleware] 代理请求失败:', error)
    return new NextResponse('代理服务暂时不可用', { status: 502 })
  }
}

// ========== 配置中间件匹配规则 ==========
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * 1. 静态文件
     * 2. API路由
     * 3. 已知文件扩展名
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|translate-fh\\.js|.*\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif|json|map)$).*)',
  ]
}
