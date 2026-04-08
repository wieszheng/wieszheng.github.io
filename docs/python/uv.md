# UV

`uv`

---
## 1. **安装 `uv` 方式**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```
```bash
brew install uv
```
```bash
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```
```bash
pip install uv
```
---

## 2. **常用命令**

```bash
uv --version
```
### **创建项目**

```bash
uv init example
cd example
#或者
uv venv --python 3.14.0 example4

```

### **运行脚本**

```bash
uv run main.py
```

### **激活环境**
```bash
source .venv/bin/activate
或者
.venv/bin/activate.bat
```

### **安装依赖**
```bash
uv add requests
```
```bash
uv add  "selenium == 4.33.0"
```

### **升级依赖**
```bash
uv lock --upgrade-package requests
```

### **删除依赖**
```bash
uv remove selenium
```

### **安装项目依赖**
```bash
uv pip install -e .
```
---

## 3. **版本相关**
```bash
# 安装 Python 版本
uv python install

# 查看可用的 Python 版本
uv python list

# 找到已安装的 Python 版本
uv python find

# 将当前项目固定为使用特定的 Python 版本
uv python pin

# 卸载一个 Python 版本
uv python uninstall

# 查看可以使用的python版本
uv python list
```

### **安装新的Python版本**
```bash
uv python install 3.14
```

### **当前目录使用该版本**
```bash
uv python pin 3.14
```
```bash
uv venv --python 3.14
```
---
## 4. **项目相关**
```bash
- `uv init`: 创建一个新的 Python 项目
- `uv add`: 在项目中添加一个依赖项。
- `uv remove`: 从项目中移除一个依赖项。
- `uv sync`: 将项目的依赖项与环境同步。
- `uv lock`: 为项目的依赖项创建一个锁定文件。
- `uv run`: 在项目环境中运行一个命令。
- `uv tree`: 查看项目的依赖关系树。
- `uv build`: 将项目构建为发行归档文件。
- `uv publish`: 将项目发布到软件包索引。
```