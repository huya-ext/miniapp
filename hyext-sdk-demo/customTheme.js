import { Modules } from '@hyext/hy-ui'
const { helper } = Modules

// 获取自定义主题的变量
// 以下是示例
const customTheme = {
  mtdBrandPrimary: '#ffd800',
  mtdBrandPrimaryDark: '#FFA000',
  mtdBrandSuccess: '#61cb28',
  mtdBrandSuccessLight: '#eaffd6',
  mtdBrandSuccessDark: '#45a619',
  mtdBrandWarning: '#ff8400',
  mtdBrandDanger: '#f23244',
  mtdBrandInfo: '#188afa'
}

const tmp = helper.useTheme(customTheme)
export default tmp
