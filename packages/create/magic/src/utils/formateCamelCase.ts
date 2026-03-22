/**
 * @description 格式化驼峰命名：magic-react-component -> MagicReactComponent
 * @param string
 */
function formateCamelCase(string = ''): string {
    return string
        .replace(/^(\w)/, (match, $1) => $1.toUpperCase())
        .replace(/_(\w)/g, (match, $1) => {
            return $1.toUpperCase()
        })
        .replace(/-(\w)/g, (match, $1) => {
            return $1.toUpperCase()
        })
}

export default formateCamelCase
