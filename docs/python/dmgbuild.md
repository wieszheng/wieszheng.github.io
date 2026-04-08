# dmgbuild

`dmgbuild` 是 macOS 下用于将应用或文件夹打包为 DMG 安装镜像的 Python 工具，常用于 PyInstaller、pywebview 等 Python 应用的最终分发。

---

## 1. 安装

建议使用 pip 安装：

```bash
pip install dmgbuild
```

---

## 2. 基本用法

最简单的命令行用法：

```bash
dmgbuild -s settings.py "应用名" 应用名.dmg
```

- `settings.py`：dmgbuild 的配置脚本（Python 格式）
- `"应用名"`：DMG 卷名（显示在 Finder 左侧）
- `应用名.dmg`：输出的 DMG 文件名

---

## 3. 配置文件示例（settings.py）

```python
# settings.py 示例
import os

application = "YourAppName.app"

files = [
    os.path.join(os.getcwd(), application),  # 主程序
    # 还可以添加其他文件或文件夹
]

badge_icon = "icon.icns"  # DMG 图标（.icns 格式，可选）
background = "background.png"  # 背景图片，建议与 window_rect 匹配

volume_name = "YourAppName"  # 卷名，显示在 Finder 左侧
format = "UDBZ"  # 压缩格式，常用 UDBZ（压缩）或 UDRO（只读）

window_rect = ((200, 200), (600, 400))  # DMG 窗口位置和大小
icon_size = 128  # 图标大小
icon_locations = {
    application: (140, 180),  # 主程序图标位置
    "Applications": (400, 180),  # 应用程序快捷方式位置
}

symlinks = {"Applications": "/Applications"}  # 添加 Applications 快捷方式

show_status_bar = False  # 隐藏 Finder 状态栏
show_toolbar = False     # 隐藏 Finder 工具栏
show_pathbar = False     # 隐藏路径栏
arrange_by = None        # 图标排列方式（None 表示自由拖动）
text_size = 14           # Finder 字体大小

# 更多参数详见官方文档
```

### 3.1 常用参数详解

- `volume_name`：DMG 卷名，建议与应用名一致
- `format`：镜像格式，常用 `UDBZ`（压缩）或 `UDRO`（只读）
- `background`：背景图片，支持 PNG/JPG，建议尺寸与 window_rect 匹配
- `badge_icon`：DMG 图标，需为 .icns 格式
- `window_rect`：窗口位置和大小，((x, y), (width, height))
- `icon_size`：桌面图标大小
- `icon_locations`：每个文件/快捷方式的坐标
- `symlinks`：符号链接，通常添加 "Applications" 方便用户拖拽安装
- `files`：要包含的文件或文件夹
- `show_status_bar`：是否显示 Finder 状态栏
- `show_tab_view`：是否显示 Finder 标签栏
- `show_toolbar`：是否显示 Finder 工具栏
- `show_pathbar`：是否显示路径栏
- `arrange_by`：图标排列方式，如 `None`、`name`、`date` 等

---

## 4. 背景图片和图标注意事项

- 背景图片建议与 window_rect 的宽高一致，否则显示可能拉伸或错位
- badge_icon 必须为 .icns 格式，推荐用 Xcode 或在线工具生成
- background 路径可为相对或绝对路径，建议放在同一目录下
- 图标和图片文件需在打包命令执行目录下存在

---

## 5. 窗口美化技巧

- `arrange_by = None` 可让用户自由拖动图标
- `icon_size` 适当调大（如 128）更美观
- `window_rect` 设置为 ((200, 200), (600, 400)) 可让窗口居中且大小适中
- `show_status_bar = False`、`show_toolbar = False` 可隐藏 Finder 工具栏和状态栏
- `text_size` 可设置 Finder 显示字体大小
- `badge_icon` 设置后，DMG 文件在 Finder 中显示为自定义图标

---

## 6. 打包流程

1. 用 PyInstaller 打包出 .app 文件（如 dist/YourAppName.app）
2. 准备 settings.py 配置和可选的背景图片、图标等
3. 运行 dmgbuild 命令：

```bash
dmgbuild -s settings.py "YourAppName" YourAppName.dmg
```

4. 生成的 DMG 可直接分发给 macOS 用户

---

## 7. 常见问题与解决方法

- **权限问题**：如遇权限报错，尝试用 sudo 运行 dmgbuild
- **背景图片尺寸不符**：调整 background 图片尺寸与 window_rect 匹配
- **图标不显示**：badge_icon 路径需为 .icns 格式，且文件存在
- **Applications 链接无效**：symlinks 字段建议保留，且拼写大小写正确
- **中文路径问题**：尽量避免中文路径和文件名
- **Apple Silicon 适配**：如需同时支持 Intel 和 M1/M2，建议在 Intel 机器或 x86_64 环境下打包，或用通用二进制
- **Finder 不自动打开 DMG**：dmgbuild 不支持自动弹窗，需用户手动打开

---

## 8. 自动化打包脚本片段

可用 shell 脚本自动化打包流程：

```bash
#!/bin/bash
APP_NAME=YourAppName
DIST_PATH=dist/$APP_NAME.app
DMG_NAME=$APP_NAME.dmg

# 1. 用 PyInstaller 打包
pyinstaller main.py --windowed --name $APP_NAME

# 2. 生成 DMG
cp settings.py dist/
cd dist
cp ../background.png .
dmgbuild -s settings.py "$APP_NAME" "$DMG_NAME"
cd ..
```

---

## 9. 参考链接

- [dmgbuild 官方文档](https://dmgbuild.readthedocs.io/zh_CN/latest/)
- [pywebview 打包 Mac 应用参考](https://pywebview.flowrl.com/guide/packaging.html)
