import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom no implementa scrollIntoView, pero el Navbar lo usa al buscar.
// Lo reemplazamos por una función vacía (mock) para que no falle.
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Cada prueba parte con localStorage vacío y sin restos de la anterior.
beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});