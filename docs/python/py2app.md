# py2app

`py2app` 是 macOS 下将 Python 脚本（如 PyQt、Tkinter、pywebview 等 GUI 应用）打包为原生 .app 应用的官方工具，适合纯 Python 项目分发。

---

## 1. 安装

建议用 pip 安装：

```bash
pip install py2app
```

---

## 2. 基本用法

1. 准备你的主程序（如 main.py）
2. 新建 setup.py 配置文件
3. 运行 py2app 打包命令

---

## 3. setup.py 配置示例

```python
from setuptools import setup

APP = ['main.py']  # 主程序入口
DATA_FILES = ['icon.icns', 'config.json']  # 需包含的资源文件
OPTIONS = {
    'argv_emulation': True,  # 支持命令行参数
    'iconfile': 'icon.icns', # 应用图标
    'packages': ['requests'], # 额外依赖包
    'includes': [],           # 强制包含的模块
    'excludes': [],           # 排除的模块
    'resources': ['assets'],  # 额外资源文件夹
    'plist': {
        'CFBundleName': 'YourAppName',
        'CFBundleShortVersionString': '1.0.0',
        'CFBundleIdentifier': 'com.example.yourapp',
        'NSHighResolutionCapable': True,  # 支持 Retina 屏
    },
}

setup(
    app=APP,
    data_files=DATA_FILES,
    options={'py2app': OPTIONS},
    setup_requires=['py2app'],
)
```

---

## 4. 打包命令

```bash
python setup.py py2app
```

- 生成的 .app 在 dist/ 目录下，可直接运行或配合 dmgbuild 打包 DMG

---

## 5. 资源文件与依赖打包技巧

- `data_files` 可指定单个文件或 (目标目录, [文件列表]) 形式批量添加
- `resources` 可递归包含整个文件夹（如 assets、static）
- 如需包含非 Python 文件（如图片、字体、配置），建议统一放在 resources 文件夹
- `includes`/`excludes` 可强制包含/排除特定模块，解决自动分析遗漏问题

---

## 6. 常见问题与解决方法

- **依赖丢失**：如遇第三方库未被打包，需在 OPTIONS['packages'] 或 'includes' 中手动添加
- **图标不显示**：iconfile 路径需为 .icns 格式，且文件存在
- **中文路径问题**：建议避免中文路径和文件名
- **PyQt/Matplotlib 等 C 扩展兼容性**：如遇启动崩溃，尝试在 setup.py 中添加 'frameworks': ['QtCore', 'QtGui', ...]
- **Apple Silicon 适配**：建议在目标架构下打包，或用通用 Python 解释器（如 miniforge、官方 universal2）
- **应用沙盒/权限**：如需访问网络、文件系统等，需在 plist 中声明相关权限
- **启动慢/首次运行卡顿**：py2app 打包的 .app 首次运行会解压依赖，属正常现象

---

## 7. 自动化打包脚本片段

可用 shell 脚本自动化打包流程：

```bash
#!/bin/bash
python3 setup.py py2app
cp -r assets dist/YourAppName.app/Contents/Resources/
# 可选：用 dmgbuild 打包 DMG
# dmgbuild -s settings.py "YourAppName" YourAppName.dmg
```

---

## 8. 与 PyInstaller/dmgbuild 区别

- py2app 生成 .app，适合 macOS 原生体验，配置灵活
- PyInstaller 跨平台，支持更多依赖和复杂场景
- dmgbuild 仅用于将 .app 或文件夹打包为 DMG 安装镜像

---

## 9. 参考链接

- [py2app 官方文档](https://py2app.readthedocs.io/en/latest/)
- [py2app GitHub](https://github.com/ronaldoussoren/py2app)
