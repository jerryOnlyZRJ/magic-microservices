<template>
  <section class="magic-playground">
    <header class="magic-playground__header">
      <div>
        <p class="magic-playground__eyebrow">{{ messages.liveDemo }}</p>
        <h3>{{ presetTitle }}</h3>
        <p class="magic-playground__description">{{ presetDescription }}</p>
      </div>
      <div class="magic-playground__actions">
        <button type="button" @click="resetSources">
          {{ messages.reset }}
        </button>
        <button type="button" @click="openInCodePen">
          {{ messages.openInCodePen }}
        </button>
      </div>
    </header>

    <div class="magic-playground__layout">
      <section class="magic-playground__editor">
        <div class="magic-playground__tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            :class="{ 'is-active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
        <label class="magic-playground__textarea">
          <span>{{ currentTabLabel }}</span>
          <textarea v-model="currentSource"></textarea>
        </label>
      </section>

      <section class="magic-playground__preview">
        <div class="magic-playground__preview-header">
          <span>{{ messages.preview }}</span>
          <span class="magic-playground__preview-note">
            {{ messages.previewNote }}
          </span>
        </div>
        <iframe
          :srcdoc="iframeDocument"
          sandbox="allow-scripts"
          loading="lazy"
          title="Magic live playground"
        />
      </section>
    </div>
  </section>
</template>

<script>
import { computed, defineComponent, ref, watch } from "vue";
import { getMagicPlaygroundPreset } from "./magicPlaygroundPresets";

const tabs = [
  { key: "html", label: "HTML" },
  { key: "css", label: "CSS" },
  { key: "js", label: "JavaScript" },
];

const localeMessages = {
  zh: {
    liveDemo: "Live Demo",
    reset: "重置",
    openInCodePen: "在 CodePen 中打开",
    preview: "Preview",
    previewNote: "保存不需要刷新，编辑后即时预览",
  },
  en: {
    liveDemo: "Live Demo",
    reset: "Reset",
    openInCodePen: "Open in CodePen",
    preview: "Preview",
    previewNote: "No reload needed. Preview updates as you edit.",
  },
};

function escapeScriptContent(source) {
  return source.replace(/<\/script>/gi, "<\\/script>");
}

function createExternalScriptTags(urls = []) {
  return urls
    .map((url) => {
      return "<scr" + `ipt src="${url}"></scr` + "ipt>";
    })
    .join("\n    ");
}

function createIframeDocument({
  html,
  css,
  js,
  externalScripts = [],
  scriptMode = "classic",
}) {
  const scriptOpen = "<scr" + "ipt>";
  const scriptClose = "</scr" + "ipt>";
  const moduleScriptOpen = "<scr" + 'ipt type="module">';
  const magicScriptOpen =
    "<scr" +
    'ipt src="https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js">';
  const externalScriptTags = createExternalScriptTags(externalScripts);

  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html,
      body {
        margin: 0;
        min-height: 100%;
      }

      body {
        background: #f8fafc;
      }

      #magic-console {
        margin: 0;
        padding: 12px 16px;
        border-top: 1px solid rgba(148, 163, 184, 0.24);
        background: #0f172a;
        color: #e2e8f0;
        font: 12px/1.6 "SFMono-Regular", Consolas, monospace;
        white-space: pre-wrap;
      }

      ${css}
    </style>
  </head>
  <body>
    <div id="magic-app">${html}</div>
    <pre id="magic-console">Console ready.</pre>
    ${scriptOpen}
      (function() {
        const output = document.getElementById("magic-console");
        const append = (level, args) => {
          output.textContent += "\\n[" + level + "] " + args.map((item) => {
            if (typeof item === "string") {
              return item;
            }

            try {
              return JSON.stringify(item);
            } catch (error) {
              return String(item);
            }
          }).join(" ");
        };

        ["log", "warn", "error"].forEach((level) => {
          const original = console[level];
          console[level] = (...args) => {
            append(level, args);
            original.apply(console, args);
          };
        });

        window.addEventListener("error", (event) => {
          append("error", [event.message]);
        });
      })();
    ${scriptClose}
    ${magicScriptOpen}${scriptClose}
    ${externalScriptTags}
    ${scriptMode === "module" ? moduleScriptOpen : scriptOpen}
      ${escapeScriptContent(js)}
    ${scriptClose}
  </body>
</html>`;
}

export default defineComponent({
  name: "MagicPlayground",
  props: {
    demo: {
      type: String,
      required: true,
    },
    locale: {
      type: String,
      default: "auto",
    },
  },
  setup(props) {
    const preset = computed(() => getMagicPlaygroundPreset(props.demo));
    const localeKey = computed(() => {
      if (props.locale && props.locale !== "auto") {
        return props.locale;
      }

      if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/en/")
      ) {
        return "en";
      }

      return "zh";
    });
    const messages = computed(() => {
      return localeMessages[localeKey.value] || localeMessages.zh;
    });
    const presetTitle = computed(() => {
      if (typeof preset.value.title === "string") {
        return preset.value.title;
      }

      return (
        preset.value.title?.[localeKey.value] || preset.value.title?.zh || ""
      );
    });
    const presetDescription = computed(() => {
      if (typeof preset.value.description === "string") {
        return preset.value.description;
      }

      return (
        preset.value.description?.[localeKey.value] ||
        preset.value.description?.zh ||
        ""
      );
    });
    const activeTab = ref("js");
    const htmlSource = ref(preset.value.html);
    const cssSource = ref(preset.value.css);
    const jsSource = ref(preset.value.js);

    watch(
      preset,
      (value) => {
        htmlSource.value = value.html;
        cssSource.value = value.css;
        jsSource.value = value.js;
      },
      { immediate: true },
    );

    const currentTabLabel = computed(() => {
      return (
        tabs.find((tab) => tab.key === activeTab.value)?.label || "JavaScript"
      );
    });

    const currentSource = computed({
      get() {
        if (activeTab.value === "html") {
          return htmlSource.value;
        }

        if (activeTab.value === "css") {
          return cssSource.value;
        }

        return jsSource.value;
      },
      set(value) {
        if (activeTab.value === "html") {
          htmlSource.value = value;
          return;
        }

        if (activeTab.value === "css") {
          cssSource.value = value;
          return;
        }

        jsSource.value = value;
      },
    });

    const iframeDocument = computed(() => {
      return createIframeDocument({
        html: htmlSource.value,
        css: cssSource.value,
        js: jsSource.value,
        externalScripts: preset.value.externalScripts || [],
        scriptMode: preset.value.scriptMode || "classic",
      });
    });

    function resetSources() {
      htmlSource.value = preset.value.html;
      cssSource.value = preset.value.css;
      jsSource.value = preset.value.js;
    }

    function openInCodePen() {
      const payload = {
        title: `Magic Playground - ${presetTitle.value}`,
        html: htmlSource.value,
        css: cssSource.value,
        js: jsSource.value,
        editors: "101",
      };

      if ((preset.value.scriptMode || "classic") === "classic") {
        payload.js_external = [
          "https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js",
          ...(preset.value.externalScripts || []),
        ].join(";");
      } else {
        payload.js_pre_processor = "babel";
      }

      const form = document.createElement("form");
      const input = document.createElement("input");

      form.action = "https://codepen.io/pen/define";
      form.method = "POST";
      form.target = "_blank";
      input.name = "data";
      input.value = JSON.stringify(payload);

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    }

    return {
      activeTab,
      currentSource,
      currentTabLabel,
      iframeDocument,
      messages,
      openInCodePen,
      presetDescription,
      preset,
      presetTitle,
      resetSources,
      tabs,
    };
  },
});
</script>

<style scoped>
.magic-playground {
  margin: 28px 0;
  border: 1px solid rgba(91, 108, 255, 0.16);
  border-radius: 24px;
  background: linear-gradient(
    180deg,
    rgba(248, 250, 252, 0.92),
    rgba(255, 255, 255, 0.98)
  );
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.magic-playground__header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 24px 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.magic-playground__header h3 {
  margin: 0;
  font-size: 22px;
}

.magic-playground__eyebrow {
  margin: 0 0 8px;
  color: #5b6cff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.magic-playground__description {
  margin: 8px 0 0;
  color: #475569;
  line-height: 1.7;
}

.magic-playground__actions {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.magic-playground__actions button,
.magic-playground__tabs button {
  border: 0;
  border-radius: 999px;
  background: rgba(91, 108, 255, 0.1);
  color: #334155;
  cursor: pointer;
  font-weight: 600;
}

.magic-playground__actions button {
  padding: 10px 14px;
}

.magic-playground__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

.magic-playground__editor,
.magic-playground__preview {
  min-width: 0;
}

.magic-playground__editor {
  border-right: 1px solid rgba(148, 163, 184, 0.18);
}

.magic-playground__tabs {
  display: flex;
  gap: 10px;
  padding: 18px 18px 0;
}

.magic-playground__tabs button {
  padding: 8px 12px;
}

.magic-playground__tabs .is-active {
  background: #5b6cff;
  color: #ffffff;
}

.magic-playground__textarea {
  display: block;
  padding: 18px;
}

.magic-playground__textarea span,
.magic-playground__preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
}

.magic-playground__textarea textarea {
  width: 100%;
  min-height: 420px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 18px;
  background: #0f172a;
  color: #e2e8f0;
  padding: 16px;
  resize: vertical;
  font:
    13px/1.7 "SFMono-Regular",
    Consolas,
    monospace;
  box-sizing: border-box;
}

.magic-playground__preview {
  padding: 18px;
}

.magic-playground__preview-note {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
}

.magic-playground__preview iframe {
  width: 100%;
  min-height: 520px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 18px;
  background: #ffffff;
}

@media (max-width: 959px) {
  .magic-playground__header,
  .magic-playground__layout {
    display: block;
  }

  .magic-playground__actions {
    margin-top: 16px;
    flex-wrap: wrap;
  }

  .magic-playground__editor {
    border-right: 0;
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  }
}
</style>
