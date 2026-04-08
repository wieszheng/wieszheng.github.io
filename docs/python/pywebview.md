# pywebview

`pywebview` 是一个轻量级的跨平台 Python GUI 库，可以让你用 HTML、CSS、JavaScript 构建桌面应用。它本质上是一个原生窗口，内嵌浏览器渲染网页，支持与 Python 代码双向通信，适合快速开发桌面工具、管理后台等。

---

## 1. 安装

```bash
pip install pywebview
```

> 部分平台可能需要额外依赖，详见[官方安装文档](https://pywebview.flowrl.com/guide/installation.html)。

---

## 2. 快速上手

最简单的用法如下：

```python
import webview

webview.create_window('Hello pywebview', 'https://www.example.com')
webview.start()
```

- `create_window` 创建窗口，第一个参数为标题，第二个为网址或本地 html 文件。
- `start` 启动 GUI 消息循环。

加载本地 HTML 文件：

```python
webview.create_window('本地页面', 'index.html')
webview.start()
```

加载 HTML 字符串：

```python
webview.create_window('HTML 示例', html='<h1>Hello pywebview!</h1>')
webview.start()
```

### 2.1 自定义窗口参数

```python
import webview

# 设置窗口大小、初始位置、是否可调整、是否全屏
webview.create_window(
    '自定义窗口',
    'https://www.example.com',
    width=900, height=600, x=100, y=100,
    resizable=False, fullscreen=False, min_size=(400, 300)
)
webview.start()
```

### 2.2 无边框窗口与置顶

```python
import webview

webview.create_window('无边框窗口', 'https://www.example.com', frameless=True, on_top=True)
webview.start()
```

### 2.3 多窗口管理

```python
import webview

win1 = webview.create_window('窗口1', html='<h2>第一个窗口</h2>')
win2 = webview.create_window('窗口2', html='<h2>第二个窗口</h2>')
webview.start()
# 可通过 webview.windows 访问所有窗口
```

---

## 3. 常用 API

`Window` 对象常用方法：

- `window.load_url(url)` 加载新网址
- `window.load_html(content)` 加载 HTML 字符串
- `window.evaluate_js(js_code)` 执行 JS 代码并返回结果
- `window.toggle_fullscreen()` 切换全屏
- `window.resize(width, height)` 调整窗口大小
- `window.move(x, y)` 移动窗口
- `window.hide()` 隐藏窗口
- `window.show()` 显示窗口
- `window.minimize()` 最小化
- `window.restore()` 还原
- `window.destroy()` 关闭窗口

完整 API 见[官方文档](https://pywebview.flowrl.com/api.html)。

---

## 4. 前后端通信

### 4.1 Python 调用 JS

```python
import webview

def run_js(window):
    result = window.evaluate_js('2 + 2')
    print('JS 结果:', result)

window = webview.create_window('JS 调用', html='<h1>JS 调用</h1>')
webview.start(run_js, window)
```

### 4.2 处理异步 JS（Promise）

```python
import webview
import time

def run_js(window):
    # JS 返回 Promise，需用回调
    def callback(result):
        print('异步 JS 结果:', result)
    window.evaluate_js('new Promise(r=>setTimeout(()=>r(42),1000))', callback)
    # 主线程不能退出，否则回调不会执行
    time.sleep(2)

window = webview.create_window('异步 JS', html='<h1>异步 JS</h1>')
webview.start(run_js, window)
```

### 4.3 JS 调用 Python

```python
import webview

class Api:
    def hello(self, name):
        return f'你好, {name}!'

api = Api()
window = webview.create_window('API 示例', html='''<button onclick="callPython()">调用 Python</button>
<script>
function callPython() {
    window.pywebview.api.hello('pywebview').then(alert)
}
</script>''', js_api=api)
webview.start()
```

### 4.4 复杂数据交互

```python
import webview
import json

class Api:
    def add(self, data):
        obj = json.loads(data)
        return obj['a'] + obj['b']

api = Api()
window = webview.create_window('复杂数据', html='''<button onclick="add()">加法</button>
<script>
function add() {
    const data = JSON.stringify({a: 3, b: 5});
    window.pywebview.api.add(data).then(res => alert('结果: ' + res));
}
</script>''', js_api=api)
webview.start()
```

---

## 5. 加载本地静态资源

假设有 `static/index.html`、`static/app.js`、`static/style.css`，可这样加载：

```python
import webview

window = webview.create_window('本地静态资源', url='static/index.html', http_server=True)
webview.start()
```

- `http_server=True` 可让 pywebview 内置服务器支持本地资源的 JS/CSS 加载。

---

## 6. 文件选择与消息框

```python
import webview

window = webview.create_window('文件对话框', html='<h3>文件选择示例</h3>')
webview.start()

# 在 Python 代码中弹出文件选择框
file_path = window.create_file_dialog(webview.OPEN_DIALOG)
print('选择的文件:', file_path)

# 消息框
webview.windows[0].show_message('提示', '操作完成！')
```

---

## 7. 菜单与原生对话框

```python
import webview

menu = [
    {
        'label': '文件',
        'submenu': [
            {'label': '退出', 'click': lambda: webview.windows[0].destroy()}
        ]
    }
]
window = webview.create_window('菜单示例', html='<h2>菜单</h2>')
webview.start(menu=menu)
```

---

## 8. 窗口事件

可以监听窗口事件，如关闭、加载完成等：

```python
import webview

def on_closing():
    print('窗口即将关闭')

window = webview.create_window('事件示例', 'https://www.example.com')
window.events.closing += on_closing
webview.start()
```

常用事件有：`closed`, `closing`, `loaded`, `shown`, `minimized`, `maximized`, `restored`, `resized`, `moved`。

---

## 9. 打包桌面应用

推荐使用 [PyInstaller](https://pyinstaller.org/) 打包：

```bash
pip install pyinstaller
pyinstaller -F your_script.py
```

### 9.1 spec 文件包含静态资源

```python
# 在 .spec 文件 datas 里添加：
datas=[('static', 'static')]
```

如需包含静态文件或前端资源，需在 spec 文件中配置 datas 选项。

---

## 10. 常见问题

- **窗口白屏/打不开**：请确保依赖已安装，Windows 下建议安装 [WebView2 Runtime](https://developer.microsoft.com/zh-cn/microsoft-edge/webview2/)。
- **本地文件加载失败**：检查路径是否正确，建议使用绝对路径。
- **JS 与 Python 通信无响应**：确认 js_api 正确传递，前端调用 window.pywebview.api。

---

## 11. 参考链接

- [pywebview 中文文档](https://pywebview.idepy.com/)
- [pywebview 官方文档](https://pywebview.flowrl.com/)
- [GitHub 示例项目](https://github.com/pangao1990/vue-pywebview-pyinstaller) 