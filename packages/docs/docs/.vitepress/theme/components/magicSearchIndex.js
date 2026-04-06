const pageModules = import.meta.glob("../../../**/*.md", {
  eager: true,
  as: "raw",
});

function normalizeText(source = "") {
  return source.replace(/\r/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

function getFrontmatterBlock(source = "") {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : "";
}

function getFrontmatterValue(frontmatter = "", key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  if (!match) {
    return "";
  }

  return match[1].trim().replace(/^['"]|['"]$/g, "");
}

function stripFrontmatter(source = "") {
  return source.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

function stripMarkdown(source = "") {
  return stripFrontmatter(source)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\|/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\r/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(source = "") {
  const headings = [];
  const content = stripFrontmatter(source);
  const regex = /^#{2,6}\s+(.+)$/gm;
  let match = regex.exec(content);

  while (match) {
    headings.push(match[1].trim());
    match = regex.exec(content);
  }

  return headings;
}

function getTitleFromMarkdown(relativePath, source = "") {
  const frontmatter = getFrontmatterBlock(source);
  const heroText = getFrontmatterValue(frontmatter, "heroText");
  const title = getFrontmatterValue(frontmatter, "title");

  if (heroText) {
    return heroText;
  }

  if (title) {
    return title;
  }

  const headingMatch = stripFrontmatter(source).match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  const basename = relativePath.split("/").pop() || "";
  return basename.replace(/\.md$/, "");
}

function toPageLink(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, "/");

  if (normalizedPath === "index.md") {
    return "/";
  }

  if (normalizedPath.endsWith("/index.md")) {
    return `/${normalizedPath.replace(/\/index\.md$/, "/")}`;
  }

  return `/${normalizedPath.replace(/\.md$/, "")}`;
}

function createExcerpt(text, queryTokens) {
  if (!text) {
    return "";
  }

  const normalizedText = normalizeText(text);
  const firstMatchIndex = queryTokens.reduce((currentIndex, token) => {
    const nextIndex = normalizedText.indexOf(token);
    if (nextIndex === -1) {
      return currentIndex;
    }

    if (currentIndex === -1 || nextIndex < currentIndex) {
      return nextIndex;
    }

    return currentIndex;
  }, -1);

  if (firstMatchIndex === -1) {
    return text.slice(0, 140);
  }

  const start = Math.max(0, firstMatchIndex - 36);
  const end = Math.min(text.length, firstMatchIndex + 104);
  const excerpt = text.slice(start, end).trim();

  if (start > 0 && end < text.length) {
    return `…${excerpt}…`;
  }

  if (start > 0) {
    return `…${excerpt}`;
  }

  if (end < text.length) {
    return `${excerpt}…`;
  }

  return excerpt;
}

function scoreDocument(document, queryTokens) {
  let score = 0;
  const title = normalizeText(document.title);
  const headings = normalizeText(document.headings.join(" "));
  const content = normalizeText(document.content);
  const searchableText = `${title} ${headings} ${content}`;

  if (!queryTokens.every((token) => searchableText.includes(token))) {
    return -1;
  }

  queryTokens.forEach((token) => {
    if (title.includes(token)) {
      score += 80;
    }

    if (headings.includes(token)) {
      score += 30;
    }

    if (content.includes(token)) {
      score += 10;
    }
  });

  return score;
}

const searchDocuments = Object.entries(pageModules)
  .map(([path, rawModule]) => {
    const rawContent =
      typeof rawModule === "string" ? rawModule : rawModule?.default || "";
    const relativePath = path.replace(/^(\.\.\/)+/, "").replace(/^\.\//, "");
    const link = toPageLink(relativePath);

    if (link === "/search/" || link === "/en/search/") {
      return null;
    }

    return {
      locale: relativePath.startsWith("en/") ? "en" : "zh",
      link,
      title: getTitleFromMarkdown(relativePath, rawContent),
      headings: extractHeadings(rawContent),
      content: stripMarkdown(rawContent),
    };
  })
  .filter(Boolean);

export function searchMagicDocs(query, locale) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return [];
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);

  return searchDocuments
    .filter((document) => document.locale === locale)
    .map((document) => {
      const score = scoreDocument(document, queryTokens);

      return {
        ...document,
        score,
        excerpt: createExcerpt(document.content, queryTokens),
      };
    })
    .filter((document) => document.score >= 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 12);
}
