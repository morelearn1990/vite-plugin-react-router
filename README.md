# vite-plugin-react-router

[![npm version](https://badgen.net/npm/v/vite-plugin-react-router)](https://www.npmjs.com/package/vite-plugin-react-router)
[![monthly downloads](https://badgen.net/npm/dm/vite-plugin-react-router)](https://www.npmjs.com/package/vite-plugin-react-router)
[![types](https://badgen.net/npm/types/vite-plugin-react-router)](https://github.com/hannoeru/vite-plugin-react/blob/main/src/types.ts)
[![license](https://badgen.net/npm/license/vite-plugin-react-router)](https://github.com/hannoeru/vite-plugin-react-router/blob/main/LICENSE)

感谢来自 UMI 框架提供的灵感。

路由的生成规则部分借鉴于 UMI 框架，有部分区别就是：1、取消全局 Layout 想要使用不同的 Layout 请在 routesDir 配置的路径下面的 `_layout.tsx` 里面进行处理，方法和 UMI 框架里面的全局 Layout 一样。2、动态路由的匹配方式不使用 `[]` ，因为我发现 vscode 软件下对存在 `[]` 的路径下的文件没法进行搜索。

感谢 vite-plugin-pages 的作者 hannoeru 提供 vite 文件系统处理方面的灵感

## 使用方法

### 安装

```sh
# npm
npm install vite-plugin-react-router -D
# yarn
yarn add vite-plugin-react-router -D
```

### 配置

```ts

// 以下配置为默认配置
import RouterPlugin from "vite-plugin-react-router";
export default defineConfig({
    plugins: [
        RouterPlugin({
            routesDir: [{ baseRoute: "", dir: "src/pages" }],
            extensions: ["tsx"]
            exclude:[/components/]
        })
    ]
});
```

### 使用

```ts
import React from "react";
import ReactDOM from "react-dom";
import RouteRoot, { history, routes } from "virtual:generated-routes";
import "./index.css";
import App from "./App";

// 自定义 history
// console.log("history", history);
// 生成的 routes
// console.log("routes", routes);

ReactDOM.render(<RouteRoot />, document.getElementById("root"));
```

### 约定式路由规则

```js
// { baseRoute: "", dir: "src/pages" }
// 比如以下文件结构：
// └── pages
//     ├── index.tsx
//     └── users.tsx
// 会得到一下的路由配置
[
    { exact: true, path: "/", component: "/src/pages/index.tsx" },
    { exact: true, path: "/users", component: "/src/pages/users.tsx" }
];
```

-   仅匹配 extensions 配置里面的文件类型，默认是 `tsx`
-   不匹配 exclude 配置正则表达式匹配的内容，默认是 `[/components/]`

#### 动态路由和可选参数路由

-   文件或文件夹以 `$` 开头的为动态路由
-   文件或文件夹以 `$` 开头且以 `$` 结尾的为可选参数路由

```js
// { baseRoute: "", dir: "src/pages" }
// 比如以下文件结构：
// └── src
//     └── pages
//         └── article
//             └──$id$.tsx
//         └── user
//             └── $id
//                 └──edit.tsx
// 会得到一下的路由配置
[
    { exact: true, path: "/article/:id?", component: "/src/pages/article/$id$.tsx" },
    { exact: true, path: "/user/:id/edit", component: "/src/pages/user/$id/edit.tsx" }
];
```

### 嵌套路由

目录下有 \_layout.tsx 时会生成嵌套路由，以 \_layout.tsx 为该目录的 layout。layout 文件需要返回一个 React 组件，并通过 props.children 渲染子组件。

```js
// { baseRoute: "", dir: "src/pages" }
// 比如以下文件结构：
// └── src
//     └── pages
//         └── users
//             ├── _layout.tsx
//             ├── index.tsx
//             └── list.tsx
// 会得到一下的路由配置
[
    {
        exact: false,
        path: "/users",
        component: "/src/pages/users/_layout",
        routes: [
            { exact: true, path: "/users", component: "/src/pages/users/index" },
            { exact: true, path: "/users/list", component: "/src/pages/users/list" }
        ]
    }
];
```

### 404 路由

约定 src/pages/404.tsx 为 404 页面，需返回 React 组件。

```js
// { baseRoute: "", dir: "src/pages" }
// 比如以下文件结构：
// └── src
//     └── pages
//         ├── 404.tsx
//         ├── index.tsx
//         └── users.tsx
// 会得到一下的路由配置
[
    { exact: true, path: "/", component: "/src/pages/index" },
    { exact: true, path: "/users", component: "/src/pages/users" },
    { exact: false, path: "/*", component: "/src/pages/404" }
];

// 这样，如果访问 /foo，/ 和 /users 都不能匹配，会 fallback 到 404 路由，通过 src/pages/404.tsx 进行渲染。
```

### 常见问题

-   1、ts 提示：找不到模块“virtual:generated-routes”或其相应的类型声明。

    > tsconfig.json 配置，将 `vite-plugin-react-router/client` 放入到 tsconfig.json `types` 配置里面

-   2、eslint 提示：Unable to resolve path to module 'virtual:generated-routes'.eslintimport/no-unresolved。

    > 在 `import RouteRoot, { history, routes } from "virtual:generated-routes";` 这行上增加 `// eslint-disable-next-line import/no-unresolved`

## git 提交规范(Angular 规范)

> 1.  feat 新增一个功能
> 2.  fix 修复一个 Bug
> 3.  docs 文档变更
> 4.  style 代码格式（不影响功能，例如空格、分号等格式修正）
> 5.  refactor 代码重构
> 6.  perf 改善性能
> 7.  test 测试
> 8.  build 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等）
> 9.  ci 更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等
> 10. chore 开发工具变动(构建、脚手架工具等)
> 11. revert 代码回退

## License

MIT License © 2021 [morelearn1990](https://github.com/morelearn1990)
