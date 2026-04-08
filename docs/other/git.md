# Git 工具使用文档

> 一份面向专业开发者的 Git 实践指南

## Git 基础概念

### 四个关键区域

Git 的核心在于四个区域的文件流转：

```
工作区 (Working Directory)
    ↓ git add
暂存区 (Staging Area / Index)
    ↓ git commit
本地仓库 (Local Repository)
    ↓ git push
远程仓库 (Remote Repository)
```

| 区域 | 说明 | 查看状态命令 |
|------|------|-------------|
| 工作区 | 实际编辑文件的地方 | `git status` |
| 暂存区 | 下次提交的变更快照 | `git diff --staged` |
| 本地仓库 | 本地的完整版本历史 | `git log` |
| 远程仓库 | 团队协作的中心仓库 | `git remote -v` |

### 文件状态流转

```
Untracked → Unmodified → Modified → Staged
    ↑                        ↓          ↓
    └────────────────────────┘    git commit
           git checkout / git restore
```

**状态说明：**

- **Untracked**：新文件，未被 Git 追踪
- **Unmodified**：已追踪且未修改
- **Modified**：已追踪但被修改
- **Staged**：已暂存，准备提交

```bash
# 查看详细状态
git status

# 简洁模式
git status -s

# 显示分支信息
git status -sb
```

---

## 常用命令详解

### 初始化与克隆

#### `git init`

创建新的 Git 仓库。

```bash
# 在当前目录初始化
git init

# 在指定目录初始化
git init my-project

# 初始化裸仓库（用于服务器）
git init --bare
```

**注意**：裸仓库没有工作区，通常用于远程服务器或作为共享仓库。

#### `git clone`

克隆远程仓库到本地。

```bash
# HTTPS 方式（最常用）
git clone https://github.com/user/repo.git

# SSH 方式（需配置密钥）
git clone git@github.com:user/repo.git

# 克隆到指定目录
git clone https://github.com/user/repo.git my-repo

# 浅克隆（仅最近几次提交，节省空间）
git clone --depth 1 https://github.com/user/repo.git

# 克隆单个分支
git clone -b main --single-branch https://github.com/user/repo.git
```

**最佳实践**：
- 大型项目使用 `--depth 1` 进行浅克隆，减少下载时间
- 需要完整历史时（如代码考古、git bisect），不要使用浅克隆

---

### 暂存与提交

#### `git add`

将工作区的变更添加到暂存区。

```bash
# 添加单个文件
git add README.md

# 添加多个文件
git add file1.txt file2.txt

# 添加所有变更（包括新文件和修改）
git add .

# 添加所有变更（包括删除）
git add -A

# 交互式添加（按块选择）
git add -p

# 添加所有已追踪文件的修改（不含新文件）
git add -u
```

**交互式添加示例**：
```bash
git add -p
# 会逐块显示变更，可选择：
# y - 暂存此块
# n - 不暂存
# s - 拆分成更小块
# q - 退出
```

#### `git commit`

将暂存区内容提交到本地仓库。

```bash
# 提交并打开编辑器写消息
git commit

# 直接指定提交信息
git commit -m "feat: add user authentication"

# 添加所有已追踪文件的修改并提交
git commit -am "fix: resolve login timeout issue"

# 修改上次提交（未推送时）
git commit --amend -m "新的提交信息"

# 修改上次提交，追加文件
git add forgotten-file.txt
git commit --amend --no-edit
```

**警告**：
- `--amend` 会改变提交哈希，**仅限未推送的提交使用**
- 已推送的提交使用 `--amend` 后需要 `--force`，危险操作

---

### 远程操作

#### `git remote`

管理远程仓库。

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 修改远程仓库 URL
git remote set-url origin https://github.com/user/new-repo.git

# 删除远程仓库
git remote remove origin

# 查看远程仓库详情
git remote show origin
```

#### `git push`

将本地提交推送到远程仓库。

```bash
# 推送当前分支到对应远程分支
git push

# 首次推送并设置上游分支
git push -u origin main

# 推送所有分支
git push --all origin

# 推送标签
git push --tags

# 强制推送（危险！仅在自己分支使用）
git push --force

# 安全的强制推送（推荐）
git push --force-with-lease

# 删除远程分支
git push origin --delete feature/old-feature
```

**最佳实践**：
- 优先使用 `--force-with-lease` 而非 `--force`
- 强制推送前确认团队其他人没有新提交

#### `git pull`

拉取远程更新并合并到当前分支。

```bash
# 拉取当前分支的远程更新
git pull

# 拉取并使用 rebase 方式合并
git pull --rebase

# 拉取指定远程分支
git pull origin main
```

**推荐**：使用 `git pull --rebase` 保持提交历史线性。

#### `git fetch`

获取远程更新但不合并。

```bash
# 获取所有远程分支的更新
git fetch --all

# 获取特定远程的更新
git fetch origin

# 获取并清理已删除的远程分支引用
git fetch --prune

# 查看远程分支详情
git branch -r
```

**fetch vs pull**：
- `fetch`：只下载，不合并，安全
- `pull`：下载 + 合并，等同于 `fetch` + `merge`

---

### 分支操作

#### `git branch`

管理分支。

```bash
# 列出本地分支
git branch

# 列出所有分支（本地+远程）
git branch -a

# 创建分支
git branch feature/login

# 删除分支（已合并）
git branch -d feature/login

# 强制删除分支（未合并）
git branch -D feature/login

# 重命名分支
git branch -m old-name new-name

# 查看分支追踪关系
git branch -vv

# 查看分支详细信息（包含提交）
git branch -v
```

#### `git checkout` / `git switch`

切换分支或恢复文件。

```bash
# 切换到已存在的分支
git checkout main
git switch main

# 创建并切换到新分支
git checkout -b feature/login
git switch -c feature/login

# 基于远程分支创建本地分支
git checkout -b feature/login origin/feature/login

# 切换到上一个分支
git checkout -
git switch -

# 切换到特定提交（游离状态）
git checkout abc123
```

**注意**：Git 2.23+ 推荐使用 `switch` 切换分支，`restore` 恢复文件，分离 `checkout` 的职责。

#### `git restore`

恢复文件到指定状态。

```bash
# 恢复工作区文件到暂存区状态
git restore README.md

# 恢复工作区文件到最新提交
git restore --source=HEAD README.md

# 恢复暂存区文件到最新提交（取消暂存）
git restore --staged README.md

# 同时恢复工作区和暂存区
git restore --source=HEAD --staged --worktree README.md
```

---

### 合并与变基

#### `git merge`

合并分支。

```bash
# 合并指定分支到当前分支
git merge feature/login

# 合并并生成合并提交
git merge --no-ff feature/login

# 合并但压缩为单个提交
git merge --squash feature/login

# 中止合并（冲突时）
git merge --abort

# 继续合并（解决冲突后）
git merge --continue
```

**合并策略选择**：

| 策略 | 命令 | 适用场景 |
|------|------|---------|
| Fast-forward | 默认（无冲突时） | 功能分支落后主线 |
| No-fast-forward | `--no-ff` | 保留分支历史，便于回滚 |
| Squash | `--squash` | 压缩多个提交为一个 |

#### `git rebase`

变基操作，重新应用提交。

```bash
# 将当前分支变基到 main
git rebase main

# 交互式变基（最近 3 次提交）
git rebase -i HEAD~3

# 中止变基
git rebase --abort

# 继续变基
git rebase --continue

# 跳过当前提交
git rebase --skip
```

**交互式变基常用操作**：
```
pick abc1234 feat: add feature A
squash def5678 fix: typo in feature A
reword ghi9012 docs: update README
```

- `pick`：保留提交
- `squash`：合并到前一个提交
- `reword`：修改提交信息
- `drop`：删除提交
- `edit`：暂停以修改提交

**警告**：
- **不要对已推送的公共分支执行 rebase**
- rebase 会改变提交哈希，破坏协作者的提交历史

**merge vs rebase**：

| 维度 | merge | rebase |
|------|-------|--------|
| 历史 | 保留分支历史 | 线性历史 |
| 冲突处理 | 一次性解决 | 逐提交解决 |
| 安全性 | 安全，不改变历史 | 风险，改变历史 |
| 适用场景 | 公共分支 | 本地私有分支 |

---

### 撤销与回退

#### `git reset`

重置当前分支到指定状态。

```bash
# 软重置：保留工作区和暂存区
git reset --soft HEAD~1

# 混合重置：保留工作区，清空暂存区（默认）
git reset --mixed HEAD~1
git reset HEAD~1

# 硬重置：丢弃所有更改（危险！）
git reset --hard HEAD~1

# 重置到特定提交
git reset --hard abc123

# 重置暂存区（取消暂存）
git reset README.md
```

**reset 模式对比**：

| 模式 | 工作区 | 暂存区 | 提交历史 |
|------|--------|--------|----------|
| --soft | 保留 | 保留 | 回退 |
| --mixed（默认） | 保留 | 清空 | 回退 |
| --hard | 清空 | 清空 | 回退 |

**危险操作警告**：`--hard` 会永久丢失未提交的更改！

#### `git revert`

创建新提交来撤销历史提交（安全回退）。

```bash
# 撤销最近一次提交
git revert HEAD

# 撤销指定提交
git revert abc123

# 撤销多个提交
git revert abc123 def456

# 撤销但不自动提交
git revert --no-commit abc123
```

**reset vs revert**：

| 操作 | 特点 | 适用场景 |
|------|------|---------|
| reset | 回退历史，不创建新提交 | 本地未推送的提交 |
| revert | 创建新提交撤销更改 | 已推送的公共提交 |

**最佳实践**：
- 本地私有分支：用 `reset`
- 公共分支/已推送：用 `revert`

---

### 暂存与挑选

#### `git stash`

临时保存工作进度。

```bash
# 暂存当前工作
git stash

# 暂存并添加描述
git stash push -m "WIP: feature login"

# 查看暂存列表
git stash list

# 恢复最近的暂存
git stash pop

# 恢复暂存但不删除
git stash apply

# 恢复指定暂存
git stash apply stash@{2}

# 删除指定暂存
git stash drop stash@{0}

# 清空所有暂存
git stash clear

# 查看暂存内容
git stash show -p stash@{0}
```

**典型使用场景**：
```bash
# 场景：正在开发 feature A，需要紧急修复 bug
git stash -m "WIP: feature A"
git checkout -b hotfix/urgent-bug
# ... 修复 bug ...
git commit -m "fix: urgent bug"
git checkout main
git merge hotfix/urgent-bug
git checkout feature-a
git stash pop
```

#### `git cherry-pick`

挑选特定提交应用到当前分支。

```bash
# 应用指定提交
git cherry-pick abc123

# 应用多个提交
git cherry-pick abc123 def456

# 应用提交范围
git cherry-pick abc123..def456

# 应用但不自动提交
git cherry-pick --no-commit abc123

# 继续挑选（解决冲突后）
git cherry-pick --continue

# 放弃挑选
git cherry-pick --abort
```

**典型使用场景**：
```bash
# 场景：将 hotfix 提交同步到多个版本分支
git checkout release/v1.2
git cherry-pick abc123  # hotfix commit
git checkout release/v1.1
git cherry-pick abc123
```

---

## 分支管理策略

### Git Flow

**适用项目**：有明确发布周期的项目、版本号管理严格的项目。

**分支结构**：

```
master (main)    ──●────────●────────●──  生产环境
                 /          \
release/v1.0    ●────●────●──┘              发布准备
                |
develop    ●────●────●────●────●────●────    开发主线
           /         \
feature/A ●────●────●──┘                     功能开发
                    \
feature/B           ●────●────●              并行功能
```

**分支类型**：

| 分支类型 | 命名规范 | 生命周期 | 说明 |
|---------|---------|---------|------|
| master/main | master / main | 永久 | 生产环境代码 |
| develop | develop | 永久 | 开发主线 |
| feature | feature/* | 临时 | 新功能开发 |
| release | release/* | 临时 | 发布准备 |
| hotfix | hotfix/* | 临时 | 紧急修复 |

**工作流程**：

```bash
# 1. 从 develop 创建功能分支
git checkout develop
git checkout -b feature/user-auth

# 2. 开发完成后合并回 develop
git checkout develop
git merge --no-ff feature/user-auth

# 3. 创建发布分支
git checkout -b release/v1.0

# 4. 发布分支测试、修复，合并到 master 和 develop
git checkout master
git merge --no-ff release/v1.0
git tag -a v1.0 -m "Release version 1.0"
git checkout develop
git merge --no-ff release/v1.0

# 5. hotfix 流程
git checkout -b hotfix/critical-bug master
# ... 修复 ...
git checkout master
git merge --no-ff hotfix/critical-bug
git checkout develop
git merge --no-ff hotfix/critical-bug
```

### GitHub Flow

**适用项目**：持续部署的项目、Web 应用、SaaS 产品。

**分支结构**：

```
main  ●────●────●────●────●────  持续部署
        \   /      \
feature/A ●●────●   \           功能分支
                   \
feature/B          ●────●────●
```

**核心原则**：

1. `main` 分支始终可部署
2. 功能分支从 `main` 创建
3. 通过 Pull Request 合并
4. 合并后立即部署

**工作流程**：

```bash
# 1. 创建功能分支
git checkout main
git pull
git checkout -b feature/new-api

# 2. 开发并推送
git add .
git commit -m "feat: implement new API"
git push -u origin feature/new-api

# 3. 在 GitHub 创建 Pull Request
# 4. Code Review 通过后合并
# 5. 合并后自动部署到生产环境
```

### GitLab Flow

**适用项目**：需要环境隔离的企业项目。

**分支结构**：

```
production    ●────────●────────●────  生产环境
              ↑        ↑
pre-production ●────●──┘              预发布环境
              ↑
staging       ●────●────●────         测试环境
              ↑
main          ●────●────●────●────    开发主线
              /         \
feature/A     ●────●────●             功能分支
```

**环境分支**：

| 分支 | 对应环境 | 保护级别 |
|------|---------|---------|
| production | 生产环境 | 最高 |
| pre-production | 预发布环境 | 中 |
| staging | 测试环境 | 低 |
| main | 开发环境 | 无 |

**工作流程**：

```bash
# 1. 功能开发 → main
git checkout -b feature/new-feature main
# 开发完成后 PR 合并到 main

# 2. main → staging（测试）
git checkout staging
git merge main

# 3. staging → pre-production（预发布）
git checkout pre-production
git merge staging

# 4. pre-production → production（生产）
git checkout production
git merge pre-production
```

**策略选择建议**：

| 项目类型 | 推荐策略 | 理由 |
|---------|---------|------|
| 开源项目 | GitHub Flow | 简单透明，PR 驱动 |
| 企业内部项目 | GitLab Flow | 环境隔离清晰 |
| 有版本号的产品 | Git Flow | 版本管理规范 |
| 持续部署的 Web 应用 | GitHub Flow | 快速迭代 |

---

## Commit 规范

### Conventional Commits

**格式**：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型**：

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(auth): add OAuth2 login` |
| `fix` | Bug 修复 | `fix(api): resolve timeout issue` |
| `docs` | 文档更新 | `docs(readme): update installation guide` |
| `style` | 代码格式（不影响逻辑） | `style: format code with prettier` |
| `refactor` | 重构 | `refactor(user): extract validation logic` |
| `perf` | 性能优化 | `perf(db): optimize query performance` |
| `test` | 测试相关 | `test(auth): add unit tests for login` |
| `chore` | 构建/工具相关 | `chore(deps): update dependencies` |
| `ci` | CI/CD 相关 | `ci: add GitHub Actions workflow` |
| `revert` | 回退提交 | `revert: revert "feat: add feature"` |

**Scope（可选）**：影响范围，如 `auth`、`api`、`ui`、`db`。

**Subject**：
- 使用祈使句，首字母小写
- 不以句号结尾
- 简洁明了（50 字符以内）

**Body（可选）**：
- 详细说明改动原因
- 使用祈使句
- 与 subject 空一行

**Footer（可选）**：
- 关闭 Issue：`Closes #123`
- 破坏性变更：`BREAKING CHANGE: xxx`

**完整示例**：

```
feat(auth): add OAuth2 login support

Implement OAuth2 authentication flow for Google and GitHub providers.
This allows users to login without creating a new account.

- Add OAuth2 provider configuration
- Implement authorization code flow
- Add callback endpoint handling
- Store OAuth tokens securely

Closes #456
```

**破坏性变更示例**：

```
refactor(api)!: change user endpoint response format

BREAKING CHANGE: The `/api/user` endpoint now returns `userId` instead of `id`.
All clients need to update their response handling.
```

### Commit Message 最佳实践

**DO**：
```bash
git commit -m "feat(dashboard): add real-time analytics widget"
git commit -m "fix: resolve memory leak in WebSocket handler"
git commit -m "docs: clarify deployment process"
```

**DON'T**：
```bash
git commit -m "update code"           # 太模糊
git commit -m "fix bug"               # 没说修了什么
git commit -m "WIP"                   # WIP 不应该提交到 main
git commit -m "Add feature A and B and fix C and update D"  # 提交太多内容
```

### 工具配置

**Commitlint**（提交信息校验）：

```json
// package.json
{
  "devDependencies": {
    "@commitlint/cli": "^17.0.0",
    "@commitlint/config-conventional": "^17.0.0"
  }
}
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```

**Husky**（Git Hooks）：

```bash
# 安装 husky
npm install husky --save-dev
npx husky install

# 添加 commit-msg hook
npx husky add .husky/commit-msg 'npx commitlint --edit $1'
```

---

## 冲突解决

### 冲突产生原因

当两个分支修改了同一文件的同一位置，Git 无法自动合并，产生冲突。

```
<<<<<<< HEAD
当前分支的内容
=======
合并分支的内容
>>>>>>> feature-branch
```

### 解决流程

#### 1. 识别冲突文件

```bash
git status
# 输出：
# Unmerged paths:
#   both modified:      src/auth.js
```

#### 2. 查看冲突内容

```bash
# 查看冲突标记
git diff

# 使用图形化工具
git mergetool
```

#### 3. 解决冲突

**手动解决**：
```javascript
// 冲突代码
<<<<<<< HEAD
function login(username) {
  console.log('Login:', username);
}
=======
function login(user) {
  console.log('User login:', user.name);
}
>>>>>>> feature-branch

// 解决后
function login(user) {
  console.log('User login:', user.name);
}
```

**使用工具**：
```bash
# VS Code
# 点击 "Accept Current Change" / "Accept Incoming Change" / "Accept Both Changes"

# 使用 checkout 选择版本
git checkout --ours src/auth.js     # 使用当前分支版本
git checkout --theirs src/auth.js   # 使用合并分支版本
```

#### 4. 标记已解决

```bash
# 添加解决后的文件
git add src/auth.js

# 继续合并
git commit  # 或 git merge --continue

# 或继续变基
git rebase --continue
```

### 冲突预防策略

1. **频繁同步**：定期 `git pull --rebase` 保持分支最新
2. **小步提交**：每个提交专注于单一功能
3. **清晰分工**：团队成员避免修改同一文件
4. **及时沟通**：重构前通知团队

### 复杂冲突处理

**三方合并工具**：

```bash
# 配置 mergetool
git config --global merge.tool vscode

# VS Code 配置
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# 使用工具解决
git mergetool
```

**查看合并基础版本**：

```bash
# 查看共同祖先
git merge-base HEAD feature-branch

# 查看三方版本
git show :2:src/auth.js  # 当前版本
git show :3:src/auth.js  # 合并版本
git show :1:src/auth.js  # 基础版本
```

---

## 常见问题与解决方案

### 1. 撤销最后一次提交（未推送）

```bash
# 保留更改
git reset --soft HEAD~1

# 丢弃更改
git reset --hard HEAD~1
```

### 2. 撤销最后一次提交（已推送）

```bash
# 安全方式：创建反向提交
git revert HEAD
git push
```

### 3. 提交到了错误的分支

```bash
# 在 feature 分支误提交到 main
git checkout main
git reset --hard HEAD~1          # 回退 main
git checkout feature
git cherry-pick <commit-hash>    # 挑选提交到 feature
```

### 4. 需要修改历史提交信息

```bash
# 修改最近一次
git commit --amend -m "新消息"

# 修改历史提交
git rebase -i HEAD~3
# 将要修改的提交标记为 reword
```

### 5. 合并分支时保留了不需要的文件

```bash
# 使用 ours 策略保留当前分支版本
git merge -X ours feature-branch

# 使用 theirs 策略使用合并分支版本
git merge -X theirs feature-branch
```

### 6. 恢复已删除的分支

```bash
# 找到分支的最后一个提交
git reflog
# 输出：abc123 HEAD@{5}: checkout: moving from feature to main

# 重建分支
git checkout -b feature abc123
```

### 7. 恢复已删除的提交

```bash
# 查看历史操作
git reflog

# 恢复到指定状态
git reset --hard abc123
```

### 8. 清理未追踪的文件

```bash
# 预览将删除的文件
git clean -n

# 删除未追踪的文件
git clean -f

# 删除未追踪的文件和目录
git clean -fd

# 包括被 .gitignore 忽略的文件
git clean -fdx
```

### 9. 只下载特定文件

```bash
# Git 不支持直接下载单个文件
# 但可以使用稀疏检出

git clone --filter=blob:none --sparse https://github.com/user/repo.git
cd repo
git sparse-checkout set path/to/file
```

### 10. 大文件处理

**问题**：Git 不适合管理大文件（视频、数据集等）。

**解决方案**：使用 Git LFS

```bash
# 安装 Git LFS
git lfs install

# 追踪大文件类型
git lfs track "*.psd"
git lfs track "*.mp4"

# 查看追踪规则
git lfs track

# 克隆包含 LFS 的仓库
git lfs clone https://github.com/user/repo.git
```

### 11. 拉取失败：unrelated histories

```bash
# 错误：fatal: refusing to merge unrelated histories
git pull origin main --allow-unrelated-histories
```

### 12. 分支名与文件名冲突

```bash
# 错误：pathspec 'feature' did not match any file(s) known to git
# 原因：存在同名文件或目录

# 解决：明确指定分支
git switch --detach feature  # 先切换到游离状态
git switch -c feature-branch feature  # 再创建分支
```

---

## 进阶技巧

### `git bisect` - 二分查找定位 Bug

```bash
# 开始二分查找
git bisect start

# 标记当前版本有问题
git bisect bad

# 标记已知正常的版本
git bisect good v1.0.0

# Git 会自动切换到中间提交
# 测试后标记
git bisect good  # 或 git bisect bad

# 重复直到找到问题提交
# Git 会显示：xxx is the first bad commit

# 结束二分查找
git bisect reset
```

**自动化脚本**：

```bash
# 自动运行测试脚本
git bisect start HEAD v1.0.0
git bisect run npm test
```

### `git reflog` - 引用日志

记录所有 HEAD 移动历史，即使提交被删除也能恢复。

```bash
# 查看操作历史
git reflog

# 输出示例：
# abc123 HEAD@{0}: reset: moving to HEAD~1
# def456 HEAD@{1}: commit: feat: add feature
# ghi789 HEAD@{2}: checkout: moving from main to feature

# 恢复到任意历史状态
git reset --hard HEAD@{5}

# 恢复被删除的提交
git cherry-pick def456
```

**注意**：reflog 默认保留 90 天，可通过 `gc.reflogExpire` 配置。

### `git blame` - 追踪代码变更

```bash
# 查看文件每一行的修改信息
git blame README.md

# 指定行范围
git blame -L 10,20 README.md

# 显示邮箱
git blame -e README.md

# 忽略空白变化
git blame -w README.md
```

### `git log` 高级用法

```bash
# 图形化显示分支历史
git log --oneline --graph --all

# 查看文件的修改历史
git log -p README.md

# 查看特定作者的提交
git log --author="John"

# 查看特定时间范围
git log --since="2024-01-01" --until="2024-12-31"

# 查看修改了特定字符串的提交
git log -S "function name"

# 自定义格式
git log --pretty=format:"%h %an %s" --date=short

# 查看每次提交的文件变更统计
git log --stat
```

### `git diff` 高级用法

```bash
# 查看工作区与暂存区差异
git diff

# 查看暂存区与最新提交差异
git diff --staged

# 查看两个提交之间的差异
git diff abc123..def456

# 查看两个分支之间的差异
git diff main..feature

# 只显示文件名
git diff --name-only

# 忽略空白变化
git diff -w

# 显示函数级别的差异
git diff --word-diff
```

### `git worktree` - 多工作目录

```bash
# 创建新的工作目录
git worktree add ../feature-branch feature

# 基于新分支创建工作目录
git worktree add ../hotfix -b hotfix/urgent

# 列出所有工作目录
git worktree list

# 删除工作目录
git worktree remove ../feature-branch

# 清理已删除的工作目录引用
git worktree prune
```

**使用场景**：
- 同时在多个分支工作
- 快速切换上下文而不需要 stash
- 在一个分支跑测试的同时在另一个分支开发

### 子模块管理

```bash
# 添加子模块
git submodule add https://github.com/user/lib.git libs/lib

# 克隆包含子模块的仓库
git clone --recursive https://github.com/user/repo.git

# 更新子模块
git submodule update --init --recursive

# 拉取子模块更新
git submodule update --remote

# 删除子模块
git submodule deinit libs/lib
git rm libs/lib
```

### `.gitignore` 模式

```gitignore
# 忽略特定文件
.DS_Store
*.log

# 忽略目录
node_modules/
dist/

# 忽略特定目录下的文件
build/*.js

# 不忽略（例外）
!important.log
!lib/*.js

# 双星号匹配任意层级目录
**/temp

# 只匹配当前目录
/TODO
```

**常用模板**：

```gitignore
# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env

# Build
dist/
build/
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
```

### Git 别名配置

```bash
# 设置别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.unstage "reset HEAD --"
git config --global alias.last "log -1 HEAD"
git config --global alias.visual "log --graph --oneline --decorate --all"

# 使用别名
git co main
git lg
git unstage file.txt
```

---

## 最佳实践清单

### 提交习惯

- [ ] 每个提交只做一件事
- [ ] 提交前检查 `git status` 和 `git diff`
- [ ] 使用规范的提交信息格式
- [ ] 提交信息用祈使句
- [ ] 提交前运行测试
- [ ] 不提交敏感信息

### 分支管理

- [ ] 保持分支短小精悍
- [ ] 及时删除已合并的分支
- [ ] 分支命名清晰：`feature/`、`fix/`、`hotfix/`
- [ ] 主分支禁用 force push
- [ ] 使用 PR 进行代码审查

### 协作流程

- [ ] 推送前先拉取最新代码
- [ ] 使用 `git pull --rebase` 避免不必要的合并提交
- [ ] 冲突解决后及时沟通
- [ ] 大改动拆分成多个小提交
- [ ] 重要操作前先备份

### 安全习惯

- [ ] 避免在公共电脑保存凭据
- [ ] 定期更新 Git 版本
- [ ] 使用 SSH 密钥而非 HTTPS 密码
- [ ] 审查 `.gitignore` 是否完整
- [ ] 检查是否有密钥泄漏

### 性能优化

- [ ] 大仓库使用浅克隆
- [ ] 定期运行 `git gc`
- [ ] 大文件使用 Git LFS
- [ ] 避免提交不必要的文件

---

## 快速参考

### 最常用命令

```bash
# 克隆仓库
git clone <url>

# 查看状态
git status

# 添加到暂存区
git add <file>
git add .

# 提交
git commit -m "message"

# 推送
git push

# 拉取
git pull --rebase

# 切换分支
git switch <branch>

# 创建分支
git switch -c <new-branch>

# 合并分支
git merge <branch>

# 查看历史
git log --oneline --graph
```

### 紧急救援

```bash
# 撤销最后一次提交（未推送）
git reset --soft HEAD~1

# 恢复误删的分支/提交
git reflog
git reset --hard <hash>

# 暂存当前工作
git stash
git stash pop

# 查看谁修改了这行代码
git blame -L <start>,<end> <file>
```

---

## 附录：Git 配置推荐

```bash
# 用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 默认分支名
git config --global init.defaultBranch main

# 默认使用 rebase
git config --global pull.rebase true

# 自动设置上游分支
git config --global push.autoSetupRemote true

# 编辑器
git config --global core.editor "code --wait"

# 差异工具
git config --global diff.tool vscode

# 换行符处理（Windows）
git config --global core.autocrlf true

# 换行符处理（Mac/Linux）
git config --global core.autocrlf input

# 彩色输出
git config --global color.ui auto

# 凭据缓存
git config --global credential.helper cache --timeout=3600
```

---

> **文档版本**：v1.0  
> **最后更新**：2026-03-29  
> **适用对象**：中级及以上开发者  
> **维护者**：Doodle
