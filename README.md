# Cycle.js + chai-virtual-dom 测试项目

## 项目概述

这是一个探索如何使用 `chai-virtual-dom` 库在 Cycle.js 项目中进行虚拟 DOM 测试的示例项目。

## 技术栈

- **Cycle.js** - 响应式前端框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的开发服务器和构建工具
- **Mocha + Chai** - 测试框架
- **chai-virtual-dom** - 虚拟 DOM 断言库

## 安装

\`\`\`bash
npm install
\`\`\`

## 运行

\`\`\`bash
# 开发模式
npm run dev

# 构建
npm run build

# 测试
npm test

# 代码检查
npm run lint

# 代码格式化
npm run format
\`\`\`

## 项目结构

\`\`\`
chai-test/
├── src/              # 源代码目录
├── test/             # 测试文件
│   ├── vdom.spec.ts           # 虚拟 DOM 测试示例
│   └── chai-virtual-dom.d.ts  # 类型定义
├── BEST_PRACTICES.md  # 最佳实践指南
└── package.json
\`\`\`

## chai-virtual-dom 探索结果

### 核心发现

1. **松散匹配 vs 精确匹配**
   - `look.like()` - 只验证指定的属性和子元素（推荐）
   - `look.exactly.like()` - 要求完全匹配（脆弱）

2. **最佳实践**
   - 优先使用松散匹配，使测试更健壮
   - 只断言关键属性，忽略实现细节
   - 利用部分子元素匹配来简化测试

3. **注意事项**
   - 需要自定义类型定义以支持 TypeScript
   - 空属性仍会被检查（避免使用空对象）
   - 错误消息以 HTML 格式显示，易于理解

### 示例测试

\`\`\`typescript
// 基本用法
expect(actualVTree).to.look.like(expectedVTree);

// 精确匹配
expect(actualVTree).to.look.exactly.like(expectedVTree);

// 嵌套结构
expect(component).to.look.like({
  tagName: "div",
  properties: { className: "container" },
  children: [
    { type: "VirtualText", text: "Hello" }
  ]
});
\`\`\`

## 参考资料

- [chai-virtual-dom GitHub](https://github.com/staltz/chai-virtual-dom)
- [Cycle.js 官方文档](https://cycle.js.org/)
- [详细最佳实践指南](./BEST_PRACTICES.md)

## 探索过程中的学习

1. **类型定义挑战**
   - chai-virtual-dom 没有官方类型定义
   - 需要创建自定义的 `.d.ts` 文件
   - 建议使用 CommonJS `require()` 语法

2. **测试策略**
   - 使用 jsdom-global 提供浏览器环境
   - Mocha 作为测试运行器
   - TypeScript 配置需要单独的测试配置文件

3. **项目初始化**
   - 使用 cyclejs-env skill 的初始化脚本
   - 自动配置 Vite + TypeScript + 测试框架
   - 预配置了 Biome 用于代码检查和格式化

## 结论

chai-virtual-dom 是测试 Cycle.js 应用中虚拟 DOM 输出的强大工具。通过理解其松散匹配特性并遵循最佳实践，可以编写出既健壮又易维护的测试。
