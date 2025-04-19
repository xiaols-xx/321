describe('用户注册', () => {
  it('应成功注册新用户', () => {
    cy.visit('/register'); // 访问注册页面

    // 输入用户名和密码
    cy.get('input[placeholder="用户名"]').type('testuser');
    cy.get('input[placeholder="密码"]').type('password123');

    // 提交注册表单
    cy.get('button[type="submit"]').click();

    // 验证跳转到登录页面
    cy.url().should('include', '/login');
    cy.contains('注册成功，请登录');
  });

  it('应显示注册失败的错误信息', () => {
    cy.visit('/register');

    // 输入已存在的用户名
    cy.get('input[placeholder="用户名"]').type('existinguser');
    cy.get('input[placeholder="密码"]').type('password123');

    cy.get('button[type="submit"]').click();

    // 验证错误信息
    cy.contains('用户名已存在');
  });
});