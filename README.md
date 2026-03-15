# 个人网站

一个简洁、美观的个人网站模板，使用纯 HTML、CSS 和 JavaScript 构建，无需构建工具。

## 项目结构

```
Blog/
├── scripts/           # 构建脚本
│   └── build.js       # 将 posts/*.md 转为 articles/*.html
├── templates/         # 页面模板
│   └── article-template.html   # 单篇文章 HTML 模板
├── posts/             # Markdown 文章源文件（.md）
├── articles/          # 构建输出的文章 HTML（勿手改）
├── vendor/            # 构建时复制的 KaTeX、代码高亮等静态资源
├── CNAME              # 自定义域名（GitHub Pages 用）
├── index.html         # 首页
├── about.html / projects.html / blog.html / contact.html
├── styles.css / script.js
├── posts.json         # 构建生成的文章列表数据
├── package.json
└── README.md
```

## 功能

采用多页面结构，内容分散到独立页面：

- **首页** (`index.html`)：欢迎语与入口
- **关于** (`about.html`)：个人简介与技能标签
- **项目** (`projects.html`)：项目展示卡片
- **文章** (`blog.html`)：博客文章列表
- **联系** (`contact.html`)：联系方式与社交链接

## 使用方式

### 方式一：直接打开
双击 `index.html` 在浏览器中打开即可。

### 方式二：本地服务器（推荐）
使用本地服务器可避免部分浏览器的跨域限制：

```bash
# 使用 Python（如已安装）
python -m http.server 8080

# 或使用 Node.js
npx serve .
```

然后访问 http://localhost:8080

## 自定义

1. **修改个人信息**：编辑 `index.html` 中的「你的名字」、邮箱、GitHub 链接等
2. **调整配色**：在 `styles.css` 顶部的 `:root` 中修改 CSS 变量
3. **添加内容**：在对应区块中增加项目卡片或文章条目
4. **Markdown 文章**：将 `.md` 文件放入 `posts/` 目录，运行 `npm run build` 生成静态页面

## 文章构建

`posts/` 目录下的 Markdown 文章需经构建后才会出现在网站上：

```bash
# 首次使用需安装依赖（若遇权限问题可加 --cache .npm-cache）
# 依赖包含 markdown-it、KaTeX、highlight.js（代码高亮）
npm install

# 将 posts/*.md 转为 articles/*.html，并生成 posts.json
npm run build
```

构建后，文章会出现在「文章」页，每篇可单独访问 `articles/文章名.html`。

## 部署

可将整个文件夹部署到：
- **GitHub Pages**（见下方「部署到 GitHub Pages」）
- **Gitee Pages**（见下方详细步骤）
- Netlify
- Vercel
- 或任何静态网站托管服务

### 部署到 GitHub Pages

本项目需先执行 `npm run build` 生成文章页，因此使用 **GitHub Actions** 在云端构建后再部署：

1. **推送代码到 GitHub**
   - 在 GitHub 新建仓库，将本地项目推送上去（若已推送可跳过）。

2. **启用 Pages 并选择来源**
   - 打开仓库 → **Settings** → **Pages**
   - **Build and deployment** 下，Source 选择 **GitHub Actions**（不要选 “Deploy from a branch”）。

3. **自动部署**
   - 每次推送到 `main` 分支时，工作流会执行 `npm ci` 和 `npm run build`，再把构建结果部署到 GitHub Pages。
   - 部署完成后访问：`https://<你的用户名>.github.io/<仓库名>/`

4. **绑定自定义域名**（如 qianianxy.cn）
   - 项目根目录已包含 `CNAME` 文件，推送后 GitHub Pages 会自动识别。
   - 在域名服务商处添加 DNS 解析：
     - **A 记录**：`@` → `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`
     - **CNAME 记录**（若使用 www）：`www` → `<你的用户名>.github.io`
   - 在仓库 **Settings** → **Pages** → **Custom domain** 中填入 `qianianxy.cn`，勾选 **Enforce HTTPS**。
   - DNS 生效后（通常几分钟到 48 小时），即可通过 https://qianianxy.cn 访问。

若之前用的是默认的 “Deploy from a branch”，构建会按 Jekyll 执行导致失败；改为 **GitHub Actions** 后会用仓库里的 `.github/workflows/deploy-pages.yml` 正确构建并部署。

### 部署到 Gitee 并开启网站访问（Gitee Pages）

1. **在 Gitee 上新建仓库**
   - 登录 [gitee.com](https://gitee.com)，点击右上角「+」→「新建仓库」
   - 仓库名自定（如 `Blog`），选择「公开」，**不要**勾选「使用 Readme 文件初始化」
   - 创建后记下仓库地址，例如：`https://gitee.com/你的用户名/Blog.git`

2. **在本地把项目推送到 Gitee**
   ```bash
   cd d:\Projects\Blog
   git init
   git add .
   git commit -m "初始提交：个人网站"
   git remote add origin https://gitee.com/你的用户名/仓库名.git
   git branch -M main
   git push -u origin main
   ```
   将 `你的用户名`、`仓库名` 换成你在 Gitee 上的实际信息；若 Gitee 要求登录，按提示输入账号密码或配置 SSH。

3. **开启 Gitee Pages（这样才能用浏览器访问网站）**
   - 打开该仓库页面 → 点击「服务」→「Gitee Pages」
   - 若未开通，按页面提示开通
   - 部署来源选择「master」或「main」（与你上面推送的分支一致），目录选「根目录」
   - 点击「启动」或「更新」部署

4. **访问你的网站**
   - 部署成功后，在 Gitee Pages 页面会显示访问地址，一般为：
     **`https://你的用户名.gitee.io/仓库名/`**
   - 在浏览器中打开该地址即可访问你的个人网站。

**说明**：Gitee Pages 更新后，若页面未变，需到「Gitee Pages」里再点一次「更新」才会生效。
