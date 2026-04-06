const fs = require("fs");
const path = require("path");

const defaultRepository = "jerryOnlyZRJ/magic-microservices";
const repository = process.env.GITHUB_REPOSITORY || defaultRepository;
const repositoryOwner = repository.split("/")[0] || "jerryOnlyZRJ";
const repoName = repository.split("/")[1] || "magic-microservices";
const isUserPagesRepository = repoName.endsWith(".github.io");
const siteUrl =
  process.env.SITE_URL ||
  `https://${repositoryOwner.toLowerCase()}.github.io${
    isUserPagesRepository ? "" : `/${repoName}`
  }`;

const docsRoot = path.resolve(__dirname, "../docs");
const publicDir = path.resolve(docsRoot, ".vitepress/public");
const sitemapPath = path.join(publicDir, "sitemap.xml");
const robotsPath = path.join(publicDir, "robots.txt");
const excludedPages = new Set([
  "search/index.md",
  "en/search/index.md",
  "guide/ecosystem-expansion.md",
  "en/guide/ecosystem-expansion.md",
]);

function walkMarkdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === ".vitepress") {
        return [];
      }

      return walkMarkdownFiles(absolutePath);
    }

    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      return [];
    }

    return [absolutePath];
  });
}

function toRelativePath(absolutePath) {
  return path.relative(docsRoot, absolutePath).split(path.sep).join("/");
}

function toRoutePath(relativePath) {
  if (relativePath === "index.md") {
    return "/";
  }

  if (relativePath.endsWith("/index.md")) {
    return `/${relativePath.slice(0, -"/index.md".length)}/`;
  }

  return `/${relativePath.replace(/\.md$/, "")}`;
}

function buildSitemapXml(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const body = routes
    .map((route) => {
      return `  <url><loc>${siteUrl}${route}</loc><lastmod>${today}</lastmod></url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function buildRobotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

function main() {
  fs.mkdirSync(publicDir, { recursive: true });

  const routes = walkMarkdownFiles(docsRoot)
    .map(toRelativePath)
    .filter((relativePath) => !excludedPages.has(relativePath))
    .map(toRoutePath)
    .sort((left, right) => left.localeCompare(right));

  fs.writeFileSync(sitemapPath, buildSitemapXml(routes), "utf8");
  fs.writeFileSync(robotsPath, buildRobotsTxt(), "utf8");
}

main();
