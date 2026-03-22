/* eslint-disable max-len */
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Card } from '@byte-design/ui'
// import Store from '@/models';
import './index.less'

const initialInfo = `
# 🎉欢迎，你的新项目初始化成功。

## 更多使用 \`bcg\` 的方法

### bcg serve

\`$ bcg serve [entry]\` 命令会启动一个开发服务器 (基于 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) ) 并附带开箱即用的模块热重载 (Hot-Module-Replacement)。

并且，我们支持所有 \`webpack-dev-server\` 的参数透传。

### bcg build 

\`$ bcg build [entry]\` 命令会执行项目的构建逻辑。

开发者可以在项目的根目录下新建一个 \`webpack.config.js\`  文件（或使用 CLI 提供的 \`—config\` 参数传递自定义配置文件的路径）自定义构建逻辑。

### 参与进来

项目设计文档：[Byted CG CLI 设计](https://bytedance.feishu.cn/space/doc/doccnsdD9h2FwlMrcgQMpy#BdXobW)

新版 antx 使用文档：[使用文档](https://code.byted.org/cg/byted-antx/blob/develop/README.md)
`

const HomeView = () => {
  // const { state } = Store.useModel('home');
  return (
    <div styleName="home-view">
      <Card>
        <ReactMarkdown source={initialInfo} />
      </Card>
    </div>
  )
}

export default HomeView
