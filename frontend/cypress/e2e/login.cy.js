describe('用户登录', () => {
    it('应成功登录并跳转到主页', () => {
      cy.visit('/login'); // 访问登录页面
  
      // 输入用户名和密码
      cy.get('input[placeholder="用户名"]').type('testuser');
      cy.get('input[placeholder="密码"]').type('password123');
  
      // 提交登录表单
      cy.get('button[type="submit"]').click();
  
      // 验证跳转到主页
      cy.url().should('include', '/home');
      cy.contains('欢迎回来，testuser');
    });
  
    it('应显示登录失败的错误信息', () => {
      cy.visit('/login');
  
      // 输入错误的用户名或密码
      cy.get('input[placeholder="用户名"]').type('wronguser');
      cy.get('input[placeholder="密码"]').type('wrongpassword');
  
      cy.get('button[type="submit"]').click();
  
      // 验证错误信息
      cy.contains('用户名或密码错误');
    });
  });