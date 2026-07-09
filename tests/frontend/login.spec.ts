import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

if (!process.env.USUARIO) {
  throw new Error('Falta la variable USUARIO en el archivo .env');
}
if (!process.env.CONTRASENA) {
  throw new Error('Falta la variable CONTRASENA en el archivo .env');
}

const usuarioValido = {
  nombre: process.env.USUARIO ?? '', 
  contraseña: process.env.CONTRASENA ?? '', 
};

const usuarioBloqueado = {
  nombre: 'locked_out_user',
  contraseña: 'secret_sauce',
};

const usuarioContrasenaIncorrecta = {
  nombre: 'error_user',
  contraseña: 'contraseña_incorrecta_111',
};

// ============================================================
// PRUEBA 1: Login exitoso
// Sitio de práctica: https://www.saucedemo.com
// Usuario: standard_user | Contraseña: secret_sauce
// ============================================================

test('Login exitoso con usuario válido', async ({ page }) => {
  const loginPage = new LoginPage(page);
  // 1. Abrir la página
  await loginPage.abrirPagina();

  // 2. Verificar que el título del login existe
  await expect(loginPage.loginLogo).toBeVisible();

  // 3. Escribir usuario y contraseña
  await loginPage.login(usuarioValido.nombre, usuarioValido.contraseña);

  // 5. Verificar que entramos al inventario (login exitoso)
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.title')).toHaveText('Products');
});

// ============================================================
// PRUEBA 2: Login fallido con contraseña incorrecta
// ============================================================

test('Login fallido con contraseña incorrecta', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.abrirPagina();

  await loginPage.login(usuarioContrasenaIncorrecta.nombre, usuarioContrasenaIncorrecta.contraseña);

  // Verificar que aparece mensaje de error
  const errorMsg = page.locator('[data-test="error"]');
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toContainText('Username and password do not match');
});

// ============================================================
// PRUEBA 3: Login con campos vacíos
// ============================================================

test('Login fallido con campos vacíos', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.abrirPagina();

  // Hacer clic sin llenar nada
  await loginPage.clicLoginSinDatos();

  const errorMsg = page.locator('[data-test="error"]');
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toContainText('Username is required');
});

// ============================================================
// PRUEBA 4: Login fallido con usuario bloqueado
// ============================================================

test('Login fallido con usuario bloqueado', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.abrirPagina();
  await loginPage.login(usuarioBloqueado.nombre, usuarioBloqueado.contraseña);

  const errorMsg = page.locator('[data-test="error"]');
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toContainText('Sorry, this user has been locked out.');
});