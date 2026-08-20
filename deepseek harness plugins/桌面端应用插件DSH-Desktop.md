# DSH Desktop 桌面端应用总结

仓库地址：https://github.com/Awesome-AI-Pedia/dsh-plugin-desktop

## 定位

DeepSeek Harness（DSH）的桌面客户端应用。为 DSH 提供跨平台原生外壳，但业务界面仍复用官方 Web UI，避免重复实现。

## 核心功能

- **智能生命周期管理**：启动时探测 `127.0.0.1:3080`，若已有外部 DSH 则直接复用（不干扰），否则自行拉起子进程；只回收自己启动的进程
- **自动依赖下载**：首次运行自动拉取约 50MB Node.js runtime（v22.22.0）和约 200MB DSH 运行时包
- **端口策略**：优先 3080，被占用时回退到系统临时端口
- **系统集成**：系统托盘、关闭最小化到托盘、iframe shim 将 `window.open` 与 `Notification` 桥接到系统浏览器与原生通知
- **健康检查**：最长 30 秒轮询等待服务就绪
- **自动更新**：可选的 GitHub Release 自动更新

## 技术栈

- **外壳**：Tauri v2 + Rust（负责窗口 / 托盘 / 子进程 / 下载 / 更新）
- **前端**：React + TypeScript + Vite，通过 `<iframe>` 加载官方 DSH Web
- **通信**：Tauri IPC + 事件（如 `dsh://status`、`dsh://download`）
- **子进程**：`node bin.js web --host 127.0.0.1 --port <p>`
- **平台 kill 策略**：Unix 用 setsid + TERM/KILL，Windows 用 `taskkill /T /F`

## 使用方法

### 开发
```bash
npm install
npm run tauri:dev
```
前置：Rust stable、Node ≥ 18。

### 打包
```bash
npm run tauri:build
```
产物位于 `src-tauri/target/release/bundle/`，支持：
- **macOS**：`.app` / `.dmg`
- **Windows**：NSIS `.exe`
- **Linux**：`.AppImage` / `.deb`

### 数据目录
存放 `dsh-home`、依赖、runtime、日志：
- **macOS**：`~/Library/Application Support/com.dsh.desktop/`
- **Windows**：`%APPDATA%/com.dsh.desktop/`
- **Linux**：`~/.local/share/com.dsh.desktop/`

## Tauri Command API

Rust 侧通过 6 个 Tauri command 对外暴露能力：
- `launch_harness`
- `shutdown_harness`
- `restart_harness`
- `get_dsh_status`
- `install_dependencies`
- `get_runtime_info`
