import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Расширяем expect с матчерами testing-library
expect.extend(matchers);

// Очищаем после каждого теста
afterEach(() => {
  cleanup();
}); 