export default {
    e2e: {
      baseUrl: 'http://localhost:5173', // 设置基础 URL
      specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // 指定测试用例文件路径
      supportFile: 'cypress/support/e2e.js', // 指定支持文件路径
      setupNodeEvents(on, config) {
        // 在此处添加自定义事件监听器或插件配置
        return config;
      },
    },
    video: false, // 是否录制运行视频
    retries: {
      runMode: 2, // 在运行模式下重试次数
      openMode: 0, // 在交互模式下重试次数
    },
  };