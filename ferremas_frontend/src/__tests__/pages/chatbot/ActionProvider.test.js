// src/__tests__/pages/chatbot/ActionProvider.test.js
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mocks generales
const mockCreateChatBotMessage = vi.fn((msg) => ({ type: 'bot', message: msg }));
const mockSetState = vi.fn();

// Mock inicial de Supabase con productos
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        ilike: () =>
          Promise.resolve({
            data: [
              { nombre: 'Pintura blanca', precio: 9500 },
              { nombre: 'Rodillo', precio: 2500 }
            ],
            error: null,
          }),
      }),
    }),
  }),
}));

// Mock global fetch válido por defecto
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      choices: [{ message: { content: 'pintura' } }]
    }),
    ok: true,
  })
);

describe('ActionProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería responder con productos de la categoría detectada', async () => {
    const { default: ActionProvider } = await import('../../../chatbot/ActionProvider');

    const provider = new ActionProvider(mockCreateChatBotMessage, mockSetState);
    await provider.handleUserMessage('quiero pintar una pared');

    expect(mockCreateChatBotMessage).toHaveBeenCalledWith(expect.stringContaining('Te recomiendo:'));
    expect(mockCreateChatBotMessage).toHaveBeenCalledWith(expect.stringContaining('Pintura blanca'));
  });

  it('debería manejar error si no se encuentra ninguna recomendación', async () => {
    // Cambia la respuesta para simular categoría desconocida
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          choices: [{ message: { content: 'categoría-desconocida' } }]
        }),
        ok: true,
      })
    );

    // Limpia la caché de módulos para reimportar con nuevo mock
    vi.resetModules();

    // Mock Supabase para que no retorne productos
    vi.doMock('@supabase/supabase-js', () => ({
      createClient: () => ({
        from: () => ({
          select: () => ({
            ilike: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      }),
    }));

    // Reimporta ActionProvider para que tome el nuevo mock de Supabase
    const { default: ActionProvider } = await import('../../../chatbot/ActionProvider');

    const provider = new ActionProvider(mockCreateChatBotMessage, mockSetState);
    await provider.handleUserMessage('hacer una tarea extraña');

    expect(mockCreateChatBotMessage).toHaveBeenCalledWith(expect.stringContaining('No encontré productos'));
  });
});

// Este test verifica que el ActionProvider maneje correctamente las respuestas del modelo y la búsqueda de productos en Supabase.
// También maneja casos de error, como cuando no se encuentra una categoría o productos relacionados.