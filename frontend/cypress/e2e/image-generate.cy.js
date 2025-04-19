describe('图片生成', () => {
    it('应成功生成图片并显示在界面上', () => {
      cy.login('testuser', 'password123'); // 自定义命令，模拟登录
  
      cy.visit('/home'); // 访问主页
  
      // 输入图片描述
      cy.get('textarea[placeholder="请输入图片描述"]').type('日式木制建筑');
  
      // 提交生成请求
      cy.get('button.generate-image').click();
  
      // 验证加载状态
      cy.contains('生成中...');
  
      // 模拟后端返回图片 URL
      cy.intercept('POST', '/api/generate', {
        body: { success: true, image_url: 'https://example.com/image.jpg' },
      });
  
      // 验证图片显示
      cy.get('.message-bubble img').should('have.attr', 'src', 'https://example.com/image.jpg');
    });
  
    it('应显示生成失败的错误信息', () => {
      cy.login('testuser', 'password123');
  
      cy.visit('/home');
  
      // 输入图片描述
      cy.get('textarea[placeholder="请输入图片描述"]').type('无效的描述');
  
      // 提交生成请求
      cy.get('button.generate-image').click();
  
      // 模拟后端返回错误
      cy.intercept('POST', '/api/generate', {
        statusCode: 400,
        body: { message: '生成失败' },
      });
  
      // 验证错误信息
      cy.contains('抱歉，生成失败');
    });
  });