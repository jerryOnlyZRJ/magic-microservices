import baseAPIs from './base.api'
import team from './team.api'

// 后续随 API 增加，可以考虑根据功能拆分成单独文件维护
// 拆分 API 在此处 assign 进来，如 Object.assign({}, baseAPIs, { moreAPIs })
export default Object.assign({}, baseAPIs, { team })
