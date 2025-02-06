import '@testing-library/jest-dom';

// Mock TextEncoder/TextDecoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock IntersectionObserver
class IntersectionObserver {
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
}

global.IntersectionObserver = IntersectionObserver;

// Mock localStorage and sessionStorage
const mockStorage = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = value.toString();
  },
  removeItem: function(key) {
    delete this.store[key];
  },
  clear: function() {
    this.store = {};
  }
};

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
  writable: true
});

Object.defineProperty(window, 'sessionStorage', {
  value: mockStorage,
  writable: true
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.history
const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

Object.defineProperty(window, 'history', {
  writable: true,
  value: {
    ...window.history,
    pushState: mockHistoryPush,
    replaceState: mockHistoryReplace,
  },
});

// Mock fetch
global.fetch = jest.fn();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  mockStorage.clear();
});
