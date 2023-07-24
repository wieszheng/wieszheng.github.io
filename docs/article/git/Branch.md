# Branch 简介
几乎所有的版本控制系统都以某种形式支持分支。 使用分支意味着你可以把你的工作从开发主线上分离开来，以免影响开发主线。 在很多版本控制系统中，这是一个略微低效的过程——常常需要完全创建一个源代码目录的副本

## 命令规范

> **master**
>
> > 主分支，用于部署生产环境，不能直接在该分支上开发

> **develop**
>
> > 开发分支，feature 分支都是基于 develop 分支下创建的

> **feature/xxx**
>
> > 功能开发分支，从 develop 分支创建，开发完成后合并回 develop 分支

> **release/xxx**
>
> > 预发布分支，在合并好 feature 分支的 develop 分支上创建

> **bugfix/xxx**
>
> > 功能 bug 修复分支

> **hotfix/xxx**
>
> > 紧急 bug 修改分支

## 分支操作

#### 查看分支

```bash
# 查看分支
git branch

# 查看远程分支
git branch -r

# 查看所有分支
git branch -a
```
#### 操作分支

```bash
# 切换分支
git checkout 分支名

# 创建分支
git branch 分支名

# 创建并切换分支
git checkout -b 分支名

# 将分支推送到远程
git push origin 分支名

# 将本地分支与远程分支关联（关联后才可进行 git pull 和 git push 操作）
git push --set-upstream origin 分支名

# 将远程分支同步到本地（在此之前需要 git pull 拉取远程仓库最新分支信息）
git checkout origin/分支名 --track

# 合并分支
git merge 分支名

# 删除本地分支
git branch -d 分支名

# 删除远程分支
git push origin --delete 分支名

# git 从某个commit拉出一个新的分支
git checkout <commitId> -b <branchName>

# 合并某个分支的某一次commit提交
git cherry-pick <commitId>
```