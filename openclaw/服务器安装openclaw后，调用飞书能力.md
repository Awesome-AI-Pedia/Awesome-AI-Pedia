# 服务器安装openclaw后，调用飞书的一些能力



在你的服务器上，安装一下飞书cli
```js
 npx @larksuite/cli@latest install
```

或
```js
 npm install -g @larksuite/cli
```

然后 普通用户 访问飞书文档相关的时候，调用@larksuite/cli，并把这个规则放到全局的agent.md 里面，并且身份都是用机器人的身份去操作

