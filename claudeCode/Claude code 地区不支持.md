在您的主文件夹中打开您的.claude.json；
将以下行添加到 json 中并保存；
```js
"hasCompletedOnboarding": true
```

如：
修改后的完整json如下：
```js
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "userID": "[your_user_id]",
  "firstStartTime": "[time]",
  "projects": {
    "/Users/[your_home_folder]": {
      "allowedTools": [],
      "history": [],
      "mcpContextUris": [],
      "mcpServers": {},
      "enabledMcpjsonServers": [],
      "disabledMcpjsonServers": [],
      "hasTrustDialogAccepted": false,
      "projectOnboardingSeenCount": 0,
      "hasClaudeMdExternalIncludesApproved": false,
      "hasClaudeMdExternalIncludesWarningShown": false
    }
  },
  "hasCompletedOnboarding": true
}
```
重新启动 Claude，问题就消失了。

