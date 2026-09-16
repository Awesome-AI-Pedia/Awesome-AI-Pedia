
## 安装 node
```js
# 国内镜像安装 nvm（完全不走 GitHub，必成功）
export NVM_SOURCE="https://gitee.com/mirrors/nvm.git"
curl -fsSL https://gitee.com/mirrors/nvm/raw/master/install.sh | bash
```

然后执行：
```js
source ~/.bashrc
```

接下来安装 Node.js（国内加速）
```js
# 使用淘宝镜像安装 Node，速度飞快
NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node nvm install --lts

node -v
npm -v
```


或者国内服务器 手动安装node

```js
uname -m   # 确认架构：x86_64 或 aarch64

# x86_64 服务器（以 v24.10.0 为例，实际请去 https://npmmirror.com/mirrors/node/ 确认最新版本号）
cd /usr/local
sudo wget https://npmmirror.com/mirrors/node/v24.10.0/node-v24.10.0-linux-x64.tar.xz
sudo tar -xf node-v24.10.0-linux-x64.tar.xz
sudo mv node-v24.10.0-linux-x64 node

# 配置环境变量
echo 'export PATH=/usr/local/node/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

node -v
npm -v
```


最后安装 Claude Code（无 sudo）
```js

# 国内 npm 镜像
npm config set registry https://registry.npmmirror.com
```
# 安装
```js
npm install -g @anthropic-ai/claude-code
```

运行
```js
claude --version
```

echo 'export ANTHROPIC_AUTH_TOKEN="sk-你的密钥"' >> ~/.bashrc
echo 'export ANTHROPIC_BASE_URL="https://api.xxx.com"' >> ~/.bashrc

source ~/.bashrc