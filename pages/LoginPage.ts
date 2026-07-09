import {Page} from '@playwright/test';

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async abrirPagina() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(nombre: string, contraseña: string) {
    await this.page.fill('#user-name', nombre);
    await this.page.fill('#password', contraseña);
    await this.page.click('#login-button');
  }

  get loginLogo() {
    return this.page.locator('.login_logo');
  }

  async clicLoginSinDatos() {
    await this.page.click('#login-button');
  }
}