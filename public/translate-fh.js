(setTimeout(function() {
    const translations = {
        "Support me": "支持原作者"
        //取消翻译Support me
    };
    
    // 添加youtube访问检测函数
    function canAccessGoogle() {
        return new Promise((resolve) => {
            const img = new Image();
            const timeout = 3000; // 3秒超时
            
            const timeoutId = setTimeout(() => {
                img.onload = null;
                img.onerror = null;
                resolve(false);
            }, timeout);
            
            img.onload = function() {
                clearTimeout(timeoutId);
                resolve(true);
            };
            
            img.onerror = function() {
                clearTimeout(timeoutId);
                resolve(false);
            };
            
            // 尝试加载youtube的 favicon 来检测是否可以访问
            img.src = 'https://www.youtube.com/favicon.ico?' + new Date().getTime();
        });
    }
    
    // 检测并跳转函数
    async function checkAndRedirect() {
        try {
            const canAccess = await canAccessGoogle();
            if (canAccess) {
                window.location.href = 'https://sio-tools.vercel.app/';
            }
        } catch (error) {
            // 无法访问youtube或发生错误时不执行任何操作
        }
    }

    function addFloatingConfigButton() {
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .config-float-btn {
                position: fixed !important;
                bottom: 30px !important;
                right: 30px !important;
                width: 60px !important;
                height: 60px !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, #1F1F1F, #333543) !important;
                color: white !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                font-size: 24px !important;
                cursor: pointer !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
                z-index: 10002 !important;
                transition: all 0.3s ease !important;
                border: none !important;
                opacity: 1 !important;
            }
            
            .config-float-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0,0,0,0.4);
            }
            
            .config-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #313341, #313341);
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                z-index: 10003;
                min-width: 400px;
                max-width: 500px;
                color: white;
                font-family: 'Arial', sans-serif;
                border: 2px solid #20212B;
                backdrop-filter: blur(10px);
            }
            
            .config-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 10002;
                backdrop-filter: blur(5px);
            }
            
            .config-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .config-modal-title {
                font-size: 20px;
                font-weight: bold;
                color: #fff;
            }
            
            .config-modal-close {
                background: none;
                border: none;
                color: rgba(255,255,255,0.7);
                font-size: 24px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                transition: background 0.3s;
            }
            
            .config-modal-close:hover {
                background: rgba(255,255,255,0.1);
            }
            
            .config-tabs {
                display: flex;
                margin-bottom: 20px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .config-tab {
                padding: 10px 20px;
                cursor: pointer;
                font-weight: bold;
                opacity: 0.6;
                transition: all 0.3s;
            }
            
            .config-tab.active {
                opacity: 1;
                border-bottom: 2px solid #1F1F1F;
            }
            
            .config-tab-content {
                display: none;
            }
            
            .config-tab-content.active {
                display: block;
            }
            
            .config-form-group {
                margin-bottom: 20px;
            }
            
            .config-form-label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
            }
            
            .config-form-input {
                width: 100%;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.2);
                background: rgba(0,0,0,0.2);
                color: white;
                box-sizing: border-box;
            }
            
            .config-form-input:focus {
                outline: none;
                border-color: #1F2029;
            }
            
            .config-form-tip {
                width: 100%;
                padding: 12px;
                border-radius: 8px;
                font-size: 12px;
                border: 1px solid rgba(255,255,255,0.2);
                background: rgba(0,0,0,0.2);
                color: white;
                box-sizing: border-box;
            }
            
            
            .config-form-tip:focus {
                outline: none;
                border-color: #1F2029;
            }
            
            .config-form-button {
                width: 100%;
                padding: 12px;
                border-radius: 8px;
                border: none;
                background: linear-gradient(135deg, #1F2029, #1F1F1F);
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .config-form-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            
            .config-form-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            
            .config-message {
                padding: 12px;
                border-radius: 8px;
                margin-top: 15px;
                text-align: center;
                display: none;
            }
            
            .config-message.success {
                background: rgba(46, 204, 113, 0.2);
                border: 1px solid rgba(46, 204, 113, 0.5);
                display: block;
            }
            
            .config-message.error {
                background: rgba(231, 76, 60, 0.2);
                border: 1px solid rgba(231, 76, 60, 0.5);
                display: block;
            }
        `;
        document.head.appendChild(style);
        
        // 创建浮动按钮
        const floatBtn = document.createElement('button');
        floatBtn.className = 'config-float-btn';
        floatBtn.innerHTML = '⚙️';
        floatBtn.title = '配置中心';
        document.body.appendChild(floatBtn);
        
        
        // 创建配置中心模态框
        function createConfigModal() {
            if (document.querySelector('.config-modal')) {
                return;
            }
            
            const overlay = document.createElement('div');
            overlay.className = 'config-modal-overlay';
            
            const modal = document.createElement('div');
            modal.className = 'config-modal';
            modal.innerHTML = `
                <div class="config-modal-header">
                    <div class="config-modal-title">云配置</div>
                    <button class="config-modal-close">&times;</button>
                </div>
                <div class="config-tabs">
                    <div class="config-tab active" data-tab="save">存储</div>
                    <div class="config-tab" data-tab="load">读取</div>
                </div>
                <div class="config-tab-content active" id="save-tab">
                <div class="config-form-tip">将您导出的游戏配置存储在云中，后续若您缓存丢失或更换设备您也可以随时取出！</div>
                    <div class="config-form-group">
                        <label class="config-form-label">游戏ID</label>
                        <input type="number" class="config-form-input" id="save-game-id" placeholder="请输入游戏ID">
                    </div>
                    <div class="config-form-group">
                        <label class="config-form-label">配置字符串</label>
                        <input type="text" class="config-form-input" id="save-config-str" placeholder="请输入配置字符串">
                    </div>
                    <button class="config-form-button" id="save-config-btn">保存</button>
                    <div class="config-message" id="save-message"></div>
                </div>
                <div class="config-tab-content" id="load-tab">
                <div class="config-form-tip">输入您的游戏ID将配置字符串从云中取出！</div>
                    <div class="config-form-group">
                    <div class="config-form-group">
                        <label class="config-form-label">游戏ID</label>
                        <input type="number" class="config-form-input" id="load-game-id" placeholder="请输入游戏ID">
                    </div>
                    <button class="config-form-button" id="load-config-btn">取出配置</button>
                    <div class="config-message" id="load-message"></div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            document.body.appendChild(modal);
            
            // 绑定事件
            bindConfigModalEvents(overlay, modal);
        }
        
        // 绑定模态框事件
        function bindConfigModalEvents(overlay, modal) {
            // 关闭按钮事件
            const closeBtn = modal.querySelector('.config-modal-close');
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(overlay);
                document.body.removeChild(modal);
            });
            
            // 点击背景关闭
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    document.body.removeChild(modal);
                }
            });
            
            // Tab切换事件
            const tabs = modal.querySelectorAll('.config-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // 移除所有active类
                    tabs.forEach(t => t.classList.remove('active'));
                    modal.querySelectorAll('.config-tab-content').forEach(c => c.classList.remove('active'));
                    
                    // 添加active类到当前项
                    this.classList.add('active');
                    const tabId = this.getAttribute('data-tab');
                    modal.querySelector(`#${tabId}-tab`).classList.add('active');
                    
                    // 隐藏消息
                    modal.querySelector('#save-message').style.display = 'none';
                    modal.querySelector('#load-message').style.display = 'none';
                });
            });
            // 保存配置按钮事件
            const saveBtn = modal.querySelector('#save-config-btn');
            saveBtn.addEventListener('click', function() {
                const gameId = modal.querySelector('#save-game-id').value;
                const configStr = modal.querySelector('#save-config-str').value;
                const messageEl = modal.querySelector('#save-message');
                
                if (!gameId) {
                    showMessage(messageEl, '请输入游戏ID', 'error');
                    return;
                }
                
                if (!configStr) {
                    showMessage(messageEl, '请输入配置字符串', 'error');
                    return;
                }
                
                saveBtn.disabled = true;
                saveBtn.textContent = '保存中...';
                
                // 调用保存接口
                saveConfig(gameId, configStr)
                    .then(result => {
                        if (result.success) {
                            showMessage(messageEl, '配置保存成功', 'success');
                            modal.querySelector('#save-game-id').value = '';
                            modal.querySelector('#save-config-str').value = '';
                        } else {
                            showMessage(messageEl, result.message || '保存失败', 'error');
                        }
                    })
                    .catch(error => {
                        showMessage(messageEl, '保存失败: ' + error.message, 'error');
                    })
                    .finally(() => {
                        saveBtn.disabled = false;
                        saveBtn.textContent = '保存';
                    });
            });
            
            // 读取配置按钮事件
            const loadBtn = modal.querySelector('#load-config-btn');
            loadBtn.addEventListener('click', function() {
                const gameId = modal.querySelector('#load-game-id').value;
                const messageEl = modal.querySelector('#load-message');
                
                if (!gameId) {
                    showMessage(messageEl, '请输入游戏ID', 'error');
                    return;
                }
                
                loadBtn.disabled = true;
                loadBtn.textContent = '正在读取...';
                
                // 调用读取接口
                loadConfig(gameId)
                    .then(result => {
                        if (result.success) {
                            if (result.data && result.data.game_zfc) {
                                // 复制到剪贴板
                                copyToClipboard(result.data.game_zfc)
                                    .then(() => {
                                        showMessage(messageEl, '配置已复制到剪贴板', 'success');
                                    })
                                    .catch(() => {
                                        showMessage(messageEl, '配置获取成功，但复制失败，请手动复制: ' + result.data.game_zfc, 'success');
                                    });
                            } else {
                                showMessage(messageEl, '找不到该ID的配置', 'error');
                            }
                        } else {
                            showMessage(messageEl, result.message || '读取失败', 'error');
                        }
                    })
                    .catch(error => {
                        showMessage(messageEl, '读取失败: ' + error.message, 'error');
                    })
                    .finally(() => {
                        loadBtn.disabled = false;
                        loadBtn.textContent = '读取配置';
                    });
            });
        }
        
        // 显示消息
        function showMessage(element, message, type) {
            element.textContent = message;
            element.className = 'config-message ' + type;
            element.style.display = 'block';
            
            // 3秒后自动隐藏
            setTimeout(() => {
                element.style.display = 'none';
            }, 3000);
        }
        
        // 保存配置到服务器
        function saveConfig(gameId, configStr) {
            return new Promise((resolve, reject) => {
                const targetUrl = '/apis/save_config.php';
                const xhr = new XMLHttpRequest();
                xhr.open('POST', targetUrl, true);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            try {
                                const response = JSON.parse(xhr.responseText);
                                resolve(response);
                            } catch (e) {
                                reject(new Error('服务器响应格式错误'));
                            }
                        } else {
                            reject(new Error('服务器请求失败: ' + xhr.status + ' ' + xhr.statusText));
                        }
                    }
                };
                
                xhr.onerror = function() {
                    reject(new Error('网络错误，请检查网络连接'));
                };
                
                const data = {
                    game_id: parseInt(gameId),
                    game_zfc: configStr
                };
                
                xhr.send(JSON.stringify(data));
            });
        }
        
        // 从服务器读取配置
        function loadConfig(gameId) {
            return new Promise((resolve, reject) => {
                const targetUrl = `/apis/load_config.php?game_id=${parseInt(gameId)}`;
                const xhr = new XMLHttpRequest();
                xhr.open('GET', targetUrl, true);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            try {
                                const response = JSON.parse(xhr.responseText);
                                resolve(response);
                            } catch (e) {
                                reject(new Error('服务器响应格式错误'));
                            }
                        } else {
                            reject(new Error('服务器请求失败: ' + xhr.status + ' ' + xhr.statusText));
                        }
                    }
                };
                
                xhr.onerror = function() {
                    reject(new Error('网络错误，请检查网络连接'));
                };
                
                xhr.send();
            });
        }
        
        // 复制到剪贴板 - iOS专用复制按钮方案（修复层级问题）
        function copyToClipboard(text) {
            return new Promise((resolve, reject) => {
                // 检测是否为iOS设备
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                
                if (isIOS) {
                    // iOS设备显示复制按钮让用户点击
                    showIOSCopyModal(text, resolve, reject);
                } else {
                    // 非iOS设备使用原来的方法
                    if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard.writeText(text)
                            .then(resolve)
                            .catch(() => {
                                fallbackCopyTextToClipboard(text, resolve, reject);
                            });
                    } else {
                        fallbackCopyTextToClipboard(text, resolve, reject);
                    }
                }
                
                function fallbackCopyTextToClipboard(text, resolve, reject) {
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    
                    try {
                        const successful = document.execCommand('copy');
                        if (successful) {
                            resolve();
                        } else {
                            reject(new Error('复制失败'));
                        }
                    } catch (err) {
                        reject(err);
                    } finally {
                        document.body.removeChild(textArea);
                    }
                }
                
                // iOS专用复制模态框 - 修复层级问题
                function showIOSCopyModal(text, resolve, reject) {
                    const modal = document.createElement('div');
                    modal.className = 'ios-copy-modal';
                    modal.innerHTML = `
                        <div class="ios-copy-overlay"></div>
                        <div class="ios-copy-content">
                            <div class="ios-copy-header">
                                <h3>游戏配置</h3>
                                <button class="ios-copy-close">&times;</button>
                            </div>
                            <div class="ios-copy-body">
                                <p>因IOS限制，请双击下方按钮复制内容:</p>
                                <textarea readonly class="ios-copy-textarea" id="ios-copy-text">${text}</textarea>
                                <button class="ios-copy-btn" id="ios-copy-button">双击复制</button>
                            </div>
                        </div>
                    `;
                    
                    // 添加样式 - 修复层级问题
                    if (!document.getElementById('ios-copy-styles')) {
                        const style = document.createElement('style');
                        style.id = 'ios-copy-styles';
                        style.textContent = `
                            .ios-copy-modal {
                                position: fixed !important;
                                top: 0 !important;
                                left: 0 !important;
                                width: 100% !important;
                                height: 100% !important;
                                z-index: 999999 !important;
                            }
                            .ios-copy-overlay {
                                position: absolute !important;
                                top: 0 !important;
                                left: 0 !important;
                                width: 100% !important;
                                height: 100% !important;
                                background: rgba(0,0,0,0.8) !important;
                                z-index: 999998 !important;
                            }
                            .ios-copy-content {
                                position: absolute !important;
                                top: 50% !important;
                                left: 50% !important;
                                transform: translate(-50%, -50%) !important;
                                background: #313341 !important;
                                border-radius: 12px !important;
                                max-width: 90% !important;
                                width: 350px !important;
                                box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
                                z-index: 999999 !important;
                            }
                            .ios-copy-header {
                                display: flex !important;
                                justify-content: space-between !important;
                                align-items: center !important;
                                padding: 15px 20px !important;
                                border-bottom: 1px solid #eee !important;
                            }
                            .ios-copy-header h3 {
                                margin: 0 !important;
                                color: white !important;
                            }
                            .ios-copy-close {
                                background: none !important;
                                border: none !important;
                                font-size: 24px !important;
                                color: white !important;
                                cursor: pointer !important;
                            }
                            .ios-copy-body {
                                padding: 20px !important;
                                text-align: center !important;
                            }
                            .ios-copy-body p {
                                margin: 0 0 15px 0 !important;
                                color: white !important;
                            }
                            .ios-copy-textarea {
                                width: 100% !important;
                                height: 100px !important;
                                margin: 10px 0 !important;
                                padding: 10px !important;
                                border: 1px solid #555 !important;
                                border-radius: 6px !important;
                                resize: none !important;
                                font-family: monospace !important;
                                font-size: 12px !important;
                                box-sizing: border-box !important;
                                background: #2a2b38 !important;
                                color: white !important;
                            }
                            .ios-copy-btn {
                                background: #1f1f21 !important;
                                color: white !important;
                                border: none !important;
                                padding: 12px 30px !important;
                                border-radius: 25px !important;
                                font-size: 16px !important;
                                font-weight: 600 !important;
                                cursor: pointer !important;
                                width: 100% !important;
                                margin-top: 10px !important;
                            }
                            .ios-copy-btn:active {
                                background: #3a3a3f !important;
                            }
                            .ios-copy-success {
                                background: #3a3a3f !important;
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    document.body.appendChild(modal);
                    
                    // 绑定事件
                    const closeBtn = modal.querySelector('.ios-copy-close');
                    const overlay = modal.querySelector('.ios-copy-overlay');
                    const copyBtn = modal.querySelector('#ios-copy-button');
                    const textarea = modal.querySelector('#ios-copy-text');
                    
                    function closeModal() {
                        document.body.removeChild(modal);
                        reject(new Error('用户取消复制'));
                    }
                    
                    closeBtn.addEventListener('click', closeModal);
                    overlay.addEventListener('click', closeModal);
                    
                    copyBtn.addEventListener('click', function() {
                        textarea.select();
                        textarea.setSelectionRange(0, 99999);
                        
                        try {
                            const successful = document.execCommand('copy');
                            if (successful) {
                                copyBtn.textContent = '复制成功!';
                                copyBtn.classList.add('ios-copy-success');
                                setTimeout(() => {
                                    document.body.removeChild(modal);
                                    resolve();
                                }, 1000);
                            } else {
                                copyBtn.textContent = '复制失败，请手动复制';
                            }
                        } catch (err) {
                            copyBtn.textContent = '复制失败，请手动复制';
                        }
                    });
                    
                    // 自动选中文本
                    setTimeout(() => {
                        textarea.focus();
                        textarea.select();
                    }, 100);
                }
            });
        }
        
        // 浮动按钮点击事件
        floatBtn.addEventListener('click', function() {
            createConfigModal();
        });
    }

    // 图片URL替换映射
    const urlTranslations = {
        "https://awerc.github.io/sio-cdn/icons/": "https://survivor-qing-1258241359.cos.ap-guangzhou.myqcloud.com/icons/",
        "https://awerc.github.io/sio-cdn/stats/": "https://survivor-qing-1258241359.cos.ap-guangzhou.myqcloud.com/stats/",
        "http://awerc.github.io/sio-cdn/icons/": "https://survivor-qing-1258241359.cos.ap-guangzhou.myqcloud.com/icons/",
        "https://hatscripts.github.io/circle-flags/flags/gb.svg": "https://survivor-qing-1258241359.cos.ap-guangzhou.myqcloud.com/gb.svg",
        "https://hatscripts.github.io/circle-flags/flags/cn.svg": "https://survivor-qing-1258241359.cos.ap-guangzhou.myqcloud.com/cn.svg",
        "https://hatscripts.github.io/circle-flags/flags/jp.svg": "https://survivor-qing-1258241359.cos.ap-guangzhou.myqcloud.com/jp.svg",
        "https://awerc.github.io/sio-cdn/icons/resonance.webp": "https://survivor-qing-1258241359.cos.ap-guangzhou.myqcloud.com/resonance.webp"
    };

    // 原始可用性
    let isOriginalAvailable = false;
    let networkCheckCompleted = false;

    // 检查原始URL是否可用
    function checkOriginalAvailability() {
        return new Promise((resolve) => {
            const testUrl = "https://awerc.github.io/sio-cdn/icons/talent_slot_normal_bg_gray.webp";
            const timeout = 3000; // 3秒超时
            
            // 用Image对象测试
            const testImage = new Image();
            let timedOut = false;
            
            const timeoutId = setTimeout(() => {
                timedOut = true;
                testImage.onload = null;
                testImage.onerror = null;
                resolve(false);
            }, timeout);
            
            testImage.onload = function() {
                if (!timedOut) {
                    clearTimeout(timeoutId);
                    resolve(true);
                }
            };
            
            testImage.onerror = function() {
                if (!timedOut) {
                    clearTimeout(timeoutId);
                    resolve(false);
                }
            };
            
            testImage.src = testUrl + '?t=' + new Date().getTime(); // 添加时间戳避免缓存
        });
    }

    // 创建模态对话框
    function createModalDialog() {
        // 检查是否已经存在模态框，避免重复创建
        if (document.querySelector('.custom-modal')) {
            return;
        }
        
        // 创建模态框样式
        const style = document.createElement('style');
        style.textContent = `
            .custom-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #313341, #313341);
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                min-width: 300px;
                max-width: 500px;
                color: white;
                font-family: 'Arial', sans-serif;
                border: 2px solid #20212B;
                backdrop-filter: blur(10px);
            }
            
            .modal-content {
                text-align: center;
                line-height: 1.6;
            }
            
            .modal-title {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 15px;
                color: #fff;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            
            .contact-info {
                font-size: 12px;
                margin-top: 15px;
                opacity: 0.8;
                line-height: 1.4;
            }
            
            .modal-message {
                font-size: 16px;
                margin-bottom: 20px;
            }
            
            .modal-close {
                background: rgba(255,255,255,0.2);
                border: none;
                padding: 10px 25px;
                border-radius: 25px;
                color: white;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
            
            .guild-link {
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .guild-link:hover {
                color: #a0c1ff;
            }
            
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 9999;
                backdrop-filter: blur(5px);
            }
        `;
        document.head.appendChild(style);
        
        // 创建模态框HTML
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-title">⚠️声明 Announcement</div>
                <div class="modal-message">
                    本计算器作者为Kuith<br>
                    如您的网络条件允许请访问<br>
                    原站点：sio-tools.vercel.app<br>
                    <br>
                    The author of this calculator is Kuith<br>
                    If your network allows<br>
                    please visit the original site: sio-tools.vercel.app<br>
                <div class="contact-info">
                    若发现您的网络环境允许<br>
                    我们将会为您跳转至原站点<br>
                    If our system detects that your network environment allows access<br>
                    you will be automatically redirected to the original site<br>
                </div>
                <button class="modal-close">OK</button>
            </div>
        `;
        
        // 添加关闭事件
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        });
        
        // 点击背景也关闭模态框
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
                document.body.removeChild(modal);
            }
        });
        
        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }
    
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\\\$&");
    }
    
    function translatePage() {
        function replaceTextInNode(node) {
            if (node.nodeType === 3) {
                let text = node.textContent;
                Object.keys(translations).forEach(english => {
                    const regex = new RegExp(escapeRegExp(english), "g");
                    text = text.replace(regex, translations[english]);
                });
                node.textContent = text;
            } else if (node.nodeType === 1 && node.childNodes && 
                       !["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(node.tagName)) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    replaceTextInNode(node.childNodes[i]);
                }
            }
        }
        
        replaceTextInNode(document.body);
    }
    
    function replaceImageUrls() {
        if (isOriginalAvailable) {
            return 0;
        }
        
        let replacedCount = 0;
        
        // 替换图片 src & srcset
        document.querySelectorAll('img').forEach(img => {
            // 替换 src
            if (img.src) {
                let originalSrc = img.src;
                Object.keys(urlTranslations).forEach(oldUrl => {
                    if (originalSrc.includes(oldUrl)) {
                        const newSrc = originalSrc.replace(oldUrl, urlTranslations[oldUrl]);
                        img.src = newSrc;
                        replacedCount++;
                        
                        // 处理加载错误
                        img.onload = function() {
                            // console.log('图片加载成功: ', newSrc);
                        };
                        img.onerror = function() {
                            // console.error('图片加载失败: ', newSrc);
                        };
                    }
                });
            }
            
            // 替换 srcset
            if (img.srcset) {
                let originalSrcset = img.srcset;
                Object.keys(urlTranslations).forEach(oldUrl => {
                    if (originalSrcset.includes(oldUrl)) {
                        const newSrcset = originalSrcset.replace(new RegExp(oldUrl, 'g'), urlTranslations[oldUrl]);
                        img.srcset = newSrcset;
                        replacedCount++;
                    }
                });
            }
            
            // 处理 data-src 懒加载图片
            if (img.dataset.src) {
                let originalDataSrc = img.dataset.src;
                Object.keys(urlTranslations).forEach(oldUrl => {
                    if (originalDataSrc.includes(oldUrl)) {
                        const newDataSrc = originalDataSrc.replace(oldUrl, urlTranslations[oldUrl]);
                        img.dataset.src = newDataSrc;
                        replacedCount++;
                    }
                });
            }
        });

        // 替换图标链接
        document.querySelectorAll('link[rel*="icon"], link[rel*="apple-touch-icon"]').forEach(link => {
            if (link.href) {
                let originalHref = link.href;
                Object.keys(urlTranslations).forEach(oldUrl => {
                    if (originalHref.includes(oldUrl)) {
                        const newHref = originalHref.replace(oldUrl, urlTranslations[oldUrl]);
                        link.href = newHref;
                        replacedCount++;
                    }
                });
            }
        });

        return replacedCount;
    }

    // 重新加载图片
    function reloadAllImages() {
        if (isOriginalAvailable) return;
        
        document.querySelectorAll('img').forEach(img => {
            if (img.src && !img.complete) {
                const originalSrc = img.src;
                img.src = '';
                setTimeout(() => {
                    img.src = originalSrc;
                }, 100);
            }
        });
    }
    
    async function init() {
        // 首先检测是否可以访问谷歌并决定是否跳转
        await checkAndRedirect();
        
        // 翻译页面
        translatePage();
        
        // 检查原始URL是否可用
        try {
            isOriginalAvailable = await checkOriginalAvailability();
            networkCheckCompleted = true;
        } catch (error) {
            isOriginalAvailable = false;
            networkCheckCompleted = true;
        }
        
        // 替换图片URL
        setTimeout(() => {
            replaceImageUrls();
            
            // 2秒后再次检查并替换新动态加载的内容
            setTimeout(() => {
                const count = replaceImageUrls();
                if (count > 0) {
                    // console.log('第二轮检查替换了额外的图片内容');
                }
                
                // 处理重新加载图片
                setTimeout(reloadAllImages, 500);
            }, 2000);
        }, 1000);
        
        // 添加浮动按钮
        setTimeout(() => {
            addFloatingConfigButton();
        }, 2000);
        
        // MutationObserver 监视动态内容
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    setTimeout(() => {
                        translatePage();
                        const newCount = replaceImageUrls();
                        if (newCount > 0) {
                            reloadAllImages();
                        }
                    }, 100);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'srcset', 'data-src']
        });
        
        // 添加页面加载检查函数
        function checkPageLoaded() {
            // 检查页面是否已经有内容
            if (document.body && document.body.children.length > 0) {
                // 显示创建模态对话框
                setTimeout(createModalDialog, 1000);
                return true;
            }
            return false;
        }
        
        // 尝试检查页面
        if (!checkPageLoaded()) {
            // 如果页面还没加载完成，定时检查
            const checkInterval = setInterval(() => {
                if (checkPageLoaded()) {
                    clearInterval(checkInterval);
                }
            }, 500);
            
            // 10秒后强制显示
            setTimeout(() => {
                clearInterval(checkInterval);
                createModalDialog();
            }, 10000);
        }
        
        document.addEventListener("click", function(event) {
            if (!event.target.matches("input, textarea, select, button")) {
                translatePage();
                // 只有当网络检查完成后再处理图片替换
                if (networkCheckCompleted) {
                    replaceImageUrls();
                    reloadAllImages();
                }
            }
        });
        
        // 添加错误处理
        window.addEventListener('error', function(e) {
            const target = e.target;
            if (target && target.tagName === 'IMG' && target.src) {
                // 只有当原始不可用时才替换
                if (!isOriginalAvailable) {
                    Object.keys(urlTranslations).forEach(oldUrl => {
                        if (target.src.includes(oldUrl)) {
                            const newSrc = target.src.replace(oldUrl, urlTranslations[oldUrl]);
                            target.src = newSrc;
                        }
                    });
                }
            }
        }, true);
    }
    
    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // 如果DOM已经加载完成，直接启动
        setTimeout(init, 100);
    }
    
    // 错误处理
    window.addEventListener('error', function(e) {
        // console.error('translate.js 错误: ', e.error);
    });
}, 3000))();