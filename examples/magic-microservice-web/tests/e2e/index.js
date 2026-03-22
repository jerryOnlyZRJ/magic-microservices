const Rize = require("rize");
// 开启可视化e2e测试;
const rize = new Rize({
  headless: JSON.parse(process.env.E2E_HEADLESS)
});

/**
 * @description case 1
 */
rize
  .goto("https://github.com/")
  .type("input.header-search-input", "node")
  .press("Enter")
  .waitForNavigation()
  // .saveScreenshot('searching-node.png')
  .assertSee("Node.js")
  .end();
