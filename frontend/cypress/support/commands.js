// 添加全局登录命令
Cypress.Commands.add('login', (username, password) => {
    cy.visit('auth/login');
    cy.get('input[placeholder="用户名"]').type(username);
    cy.get('input[placeholder="密码"]').type(password);
    cy.get('button[type="submit"]').click();
  });