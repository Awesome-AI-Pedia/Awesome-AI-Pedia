import fs from 'fs'
import path from 'path'

const aiDir = 'docs/ai'

// 递归查找所有缺少 index.md 的目录
function findDirsWithoutIndex(dir: string): string[] {
  const result: string[] = []
  
  if (!fs.existsSync(dir)) return result
  
  const items = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const item of items) {
    if (item.isDirectory()) {
      const subDir = path.join(dir, item.name)
      const indexPath = path.join(subDir, 'index.md')
      
      // 检查目录是否有内容（排除空目录）
      const subItems = fs.readdirSync(subDir)
      const hasMdFiles = subItems.some(f => f.endsWith('.md') && f !== 'index.md')
      
      if (!fs.existsSync(indexPath) && hasMdFiles) {
        result.push(subDir)
      }
      
      // 递归检查子目录
      result.push(...findDirsWithoutIndex(subDir))
    }
  }
  
  return result
}

// 生成 index.md 内容
function generateIndexContent(dirPath: string): string {
  const dirName = path.basename(dirPath)
  const parentDirName = path.basename(path.dirname(dirPath))
  
  // 获取目录中的 md 文件
  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.md') && f !== 'index.md')
    .sort()
  
  // 构建相对路径
  const relativePath = dirPath.replace('docs/', '')
  
  // 生成文章列表
  const articleItems = files.map(file => {
    const fileName = file.replace(/\.md$/, '')
    return `  <div class="article-item">
    <div class="article-item-title">
      <a href="/Awesome-AI-Pedia/${relativePath}/${fileName}">${fileName}</a>
    </div>
  </div>`
  }).join('\n')
  
  // 获取显示名称
  const displayName = dirName
  // const displayName = getDisplayName(dirName)
  
  return `---
layout: doc
title: ${displayName}
---

# ${displayName}

本分类包含以下内容：

<div class="article-list">

${articleItems}
</div>

<style>
.article-list {
  margin-top: 2rem;
}
.article-item {
  padding: 1rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.article-item-title {
  font-size: 1.2rem;
  font-weight: 500;
}
.article-item-title a {
  color: var(--vp-c-brand);
  text-decoration: none;
}
.article-item-title a:hover {
  text-decoration: underline;
}
</style>
`
}

// 获取中文显示名称
// function getDisplayName(dir: string): string {
//   const nameMap: Record<string, string> = {
//     'antigravity': 'Antigravity',
//     'claudecode': 'Claude Code',
//     'cursor': 'Cursor',
//     'mcp': 'MCP',
//     'openclaw': 'openclaw',
//     'prompt': 'Prompt',
//     'rules': 'Rules',
//     'skills': 'Skills',
//     'hao-de-rules': '好的Rules',
//     'chang-yong-skills': '常用Skills',
//     'bu-shu-ai': '部署AI',
//     'shi-yong-ai-ji-qiao': '使用AI技巧',
//     'kai-fa-ai-ying-yong': '开发AI应用',
//     'bu-ke-bu-zhi-de-ai-zhi-shi': '不可不知的AI知识',
//     '图片': '图片',
//     '常用类提示词': '常用类提示词',
//     '开发类提示词': '开发类提示词',
//     '提示词': '提示词',
//     '项目初始化': '项目初始化'
//   }
//   return nameMap[dir] || dir
// }

// 主函数
function main() {
  const dirsWithoutIndex = findDirsWithoutIndex(aiDir)
  
  console.log('缺少 index.md 的目录:')
  console.log(dirsWithoutIndex)
  
  for (const dir of dirsWithoutIndex) {
    const content = generateIndexContent(dir)
    const indexPath = path.join(dir, 'index.md')
    fs.writeFileSync(indexPath, content)
    console.log(`已创建: ${indexPath}`)
  }
}

main()
