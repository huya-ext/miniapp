const fs = require('fs-extra')
const { spawn } = require('child_process')
const path = require('path')
const Handlebars = require('handlebars')
const rimraf = require('rimraf')

/*
 * extVersionType: 扩展版本类型（1：开发版本，2：灰度版本，3：正式版本）,1：开发版本不打离线包
 * extType: 'app_panel' 等等
 * hypFileType: 1/2/3 //1:离线包加密地址,2:离线版明文地址,3:本地在线启动地址
*/
function createLauncher({ extVersionType, extType, engineType, entryJs = 'hy-main.js', hygFileList, hygFileType, outputDir, onBeforeInstallation, silent }) {
  fs.ensureDirSync(outputDir)

  console.log('game launcher: 拷贝文件')
  fs.copySync(path.resolve(__dirname, 'template'), outputDir)


  const hygCfgTemplate = fs.readFileSync(path.resolve(__dirname, 'template', 'hygConfig.js'), { encoding: 'utf8' }).toString()

  const context = {
    HYG_CFG_EXT_VERSION_TYPE: extVersionType,
    // HYG_CFG_EXT_TYPE: extType,
    HYG_CFG_ENGINE: engineType,
    HYG_CFG_ENTRY: entryJs,
    HYG_CFG_HYGFILE_LIST: JSON.stringify(hygFileList),
    HYG_CFG_FILE_TYPE: hygFileType,
  }

  console.log('game launcher: 生成模板')
  fs.outputFileSync(path.resolve(outputDir, 'hygConfig.js'), Handlebars.compile(hygCfgTemplate)(context))

  if (typeof onBeforeInstallation === 'function') {
    /*
     * 让调用者执行一些逻辑, 比如
     * 1. 更换 sdk 的版本(rn升级)
     */
    onBeforeInstallation({
      outputDir,
    })
  }

  return new Promise((resolve, reject) => {
    console.log('game launcher: 安装依赖')
    const installation = spawn(
      'npm',
      [
        'install',
        '--only=production',
        '--prefer-offline',
        '--no-save',
        '--no-audit',
        '--no-fund',
      ],
      {
        cwd: outputDir,
        stdio: silent ? 'ignore' : 'inherit',
        shell: process.platform === 'win32',
      },
    )

    installation.on('close', code => {
      if (code === 0) {
        // 入口文件的配置
        resolve({
          entries: {
            default: {
              entry: 'app_panel.js',
              registerComponent: 'App',
            },
            app_panel: {
              entry: 'app_panel.js',
              registerComponent: 'App',
            },
            app_popup: {
              entry: 'app_popup.js',
              registerComponent: 'App',
            },
            zs_anchor_panel: {
              entry: 'zs_anchor_panel.js',
              registerComponent: 'App',
            },
            zs_anchor_popup: {
              entry: 'zs_anchor_popup.js',
              registerComponent: 'App',
            },
          },
          SDK: {
            kiwi: '2.0.0',
            streamer: '2.0.0',
          },
        })

        return
      }

      reject(`install launcher dependencies failed, exit with code: ${code}`)
    })
  })
}

function deleteLauncher(outputDir) {
  return new Promise((resolve, reject) => {
    rimraf(outputDir, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = {
  createLauncher,
  deleteLauncher,
}
