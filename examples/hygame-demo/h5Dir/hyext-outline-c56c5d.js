
    if (typeof window.process === 'undefined') {
      window.process = {}
    }
    if (typeof window.process.env === 'undefined') {
      window.process.env = {}
    }

    window.process.env.HYEXT_BUILD_ENV = 'dev'
    window.process.env.HYEXT_EXT_UUID = '0'
    window.process.env.HYEXT_BUILD_EXT_TYPE = 'web' === 'app' ? 'rn' : 'h5'
  