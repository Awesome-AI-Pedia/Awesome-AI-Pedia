# Git worktree 是什么，为什么开发效率能翻倍 - 总结

## 一句话核心
**git worktree = 一份 Git 仓库对象库 + 多个独立工作目录**，每个目录可绑定不同分支，并行存在互不干扰。

- 传统 Git：1 个 `.git` + 1 个工作目录，同时只能签出一个分支
- worktree：主仓库 `.git` 只有一份，附加目录只是很小的指针，**共享对象库、极省磁盘**

## 核心命令
```bash
git worktree add ../hotfix-v2 v2-hotfix   # 新建worktree并绑定分支
git worktree list                          # 查看所有worktree
git worktree remove ../hotfix-v2           # 删除（必须用这个，不要手动删文件夹）
git worktree prune                         # 清理残留记录
```

## 不用 worktree 的传统痛点
场景：正写 feature/a 到一半，紧急要切 hotfix 改 bug。三种旧方案都难受：
1. `git stash` → 容易乱、冲突、忘记
2. `git commit --wip` → 产生垃圾提交
3. 完整 clone 第二份仓库 → 双倍磁盘、克隆慢、同步麻烦

## 效率翻倍的四大原因

### 1. 多分支同时可见，免切换免重编译
- 不用 `checkout` 来回切，两个 IDE 各开一个分支
- **大项目编译一次十几分钟，避免反复编译 = 效率暴涨最大来源**

### 2. 共享 git 对象，几乎不占磁盘
只复制工作文件，`.git` 对象复用主仓库，远比二次 clone 轻量

### 3. 跨分支对比、移植代码方便
两个目录并排开，直接文件对比、复制粘贴，不用来回 `git diff`

### 4. 完美适配并行多任务
- 新需求 + 紧急 hotfix 并行
- 多版本维护（v1/v2/v3 各一个 worktree）
- 拉别人 PR 评审，不污染自己工作区
- 一边写功能，一边跑自动化测试

## 三个必知的坑
1. **同一分支不能被多个 worktree 同时签出**（防冲突）
2. 子模块不自动同步，需单独处理
3. **不要手动删文件夹**！必须 `git worktree remove`，否则残留记录，需 `git worktree prune` 清理

## 一句话记住
**worktree = 让你在一个仓库里"平行宇宙"般同时活在多个分支上**，特别适合：写新功能被打断修 bug、并行维护多版本、评审 PR 不打扰自己代码。


举个例子：
比如 我现在 feature-1 分枝上，开发了一半， 然后我想在 master 上拉一个新的分支 hotfix-1 去改个 bug，用 worktree 是什么流程


## 完整流程
### 1、在你当前仓库（feature‑1 这个目录）执行
```bash
# 基于master创建新分支hotfix‑1，同时生成worktree文件夹 ../hotfix‑1
git worktree add ../hotfix‑1 -b hotfix‑1 master
```
解释这条命令：
- `../hotfix‑1`：新的工作目录，放在仓库外面同级；**你原来的目录一点不会改动**
- `-b hotfix‑1`：创建新分支叫 hotfix‑1
- `master`：新分支的父分支，从 master 切出来

执行完磁盘结构：
```
./my-project      ← 原来目录，依旧在 feature‑1，写一半代码原样保留，IDE不用关
../hotfix‑1       ← 全新文件夹，worktree，已经处于 hotfix‑1 分支
```

### 2、去hotfix目录改bug
```bash
cd ../hotfix‑1
# 这里就是master切出来的hotfix‑1代码，直接改bug、编译、提交
git add .
git commit -m "fix: xxx线上bug"
git push origin hotfix‑1
```
> ✨ 此时，回到你的老项目目录，还是 feature‑1，写了一半的代码还在，完全不受任何影响。

### 3、bug处理完，用完清理 worktree（重要）
修复完成、合并完PR之后，删掉这个worktree工作目录：
```bash
# 回到主仓库目录执行
cd ./my-project
git worktree remove ../hotfix‑1
```
> ⚠️ 不要手动去rm删除文件夹，要用 `git worktree remove`，git内部记录才会清理干净。

## 补充常用查看命令
```bash
# 查看全部worktree，看哪些目录绑定哪个分支
git worktree list
```

## 变种场景：如果hotfix‑1分支已经提前存在
那就不需要 `-b` 参数：
```bash
git worktree add ../hotfix‑1 hotfix‑1
```

## 和传统方式对比，感受差异
### 不用worktree的老流程
1. `git stash` 把feature‑1半成品存起来
2. `git switch master`
3. `git switch -c hotfix‑1`
4. 改bug提交push
5. `git switch feature‑1`
6. `git stash pop` 恢复代码

缺点：来回切分支，项目文件全部重写，需要重新编译；stash多了容易搞丢、冲突。

### worktree流程
原目录原地躺平不动，新开一个文件夹做hotfix，**零切换，不用动当前IDE、不用动未提交代码**。

## 容易踩的坑
1. ❌ 不要跑到hotfix目录去修改feature‑1的代码，每个worktree只管自己绑定的分支。
2. ❌ 不要手动rm -rf ../hotfix‑1，会留下git内部残留记录；真手动删了，执行 `git worktree prune` 清理。
3. fetch 在主仓库执行一次即可，所有worktree都能看到新远程分支，不用每个目录都pull。

## 极简记忆版
> 当前在feature‑1写一半不动 → `git worktree add ../hotfix‑1 -b hotfix‑1 master` → 切到新目录改bug提交push → 完事 `git worktree remove ../hotfix‑1`。
