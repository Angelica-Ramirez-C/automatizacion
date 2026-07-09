import { test, expect } from '@playwright/test';

// ============================================================
// API de práctica: https://jsonplaceholder.typicode.com
// 100% gratuita, sin registro, perfecta para aprender
// Simula una API REST real con usuarios, posts, etc.
// ============================================================

test.use({ baseURL: 'https://jsonplaceholder.typicode.com' });

// ============================================================
// PRUEBA 1: GET — Obtener lista de posts
// ============================================================

test('GET - Obtener lista de posts', async ({ request }) => {
  const response = await request.get('/posts');

  // Verificar que la respuesta es exitosa (código 200)
  expect(response.status()).toBe(200);

  const body = await response.json();

  // Verificar que recibimos un array con datos
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);

  // Verificar que cada post tiene la estructura correcta
  expect(body[0]).toHaveProperty('id');
  expect(body[0]).toHaveProperty('title');
  expect(body[0]).toHaveProperty('body');
  expect(body[0]).toHaveProperty('userId');

  console.log(`Total de posts recibidos: ${body.length}`);
});

// ============================================================
// PRUEBA 2: GET — Obtener un post específico por ID
// ============================================================

test('GET - Obtener post por ID', async ({ request }) => {
  const response = await request.get('/posts/1');

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.id).toBe(1);
  expect(body).toHaveProperty('title');
  expect(body).toHaveProperty('userId');

  console.log('Post encontrado:', body.title);
});

// ============================================================
// PRUEBA 3: GET — Recurso que no existe (404)
// ============================================================

test('GET - Post no encontrado devuelve 404', async ({ request }) => {
  const response = await request.get('/posts/9999');

  expect(response.status()).toBe(404);
  console.log('Código de respuesta:', response.status()); // Debería ser 404
});

// ============================================================
// PRUEBA 4: POST — Crear un recurso nuevo
// ============================================================

test('POST - Crear post nuevo', async ({ request }) => {
  const response = await request.post('/posts', {
    data: {
      title: 'Mi primer test de API',
      body: 'Aprendiendo automatización con Playwright',
      userId: 1,
    },
  });

  // Al crear un recurso, el código debe ser 201 (Created)
  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.title).toBe('Mi primer test de API');
  expect(body.userId).toBe(1);
  expect(body).toHaveProperty('id'); // La API nos asigna un ID

  console.log('Post creado con ID:', body.id);
});

// ============================================================
// PRUEBA 5: PUT — Actualizar un recurso completo
// ============================================================

test('PUT - Actualizar post completo', async ({ request }) => {
  const response = await request.put('/posts/1', {
    data: {
      id: 1,
      title: 'Título actualizado',
      body: 'Contenido actualizado',
      userId: 1,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.title).toBe('Título actualizado');
  console.log('Post actualizado:', body.title);
});

// ============================================================
// PRUEBA 6: PATCH — Actualizar un recurso parcialmente
// ============================================================

test('PATCH - Actualizar post parcialmente', async ({ request }) => {
  const response = await request.patch('/posts/1', {
    data: {
      title: 'Título actualizado Angelica',
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.title).toBe('Título actualizado Angelica');
  console.log('Post actualizado parcialmente:', body.title);
});

// ============================================================
// PRUEBA 7: DELETE — Eliminar un recurso
// ============================================================

test('DELETE - Eliminar post', async ({ request }) => {
  const response = await request.delete('/posts/1');

  // 200 = OK (JSONPlaceholder devuelve 200, no 204)
  expect(response.status()).toBe(200);
  console.log('Post eliminado correctamente');
});
