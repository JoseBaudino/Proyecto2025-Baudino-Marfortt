// Configuración de Jest + React Testing Library
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    [/\.(css|scss)$/.source]: 'identity-obj-proxy',
    [/\.(png|jpe?g|gif|svg|webp)$/.source]: '<rootDir>/src/__tests__/__mocks__/archivoMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Se usa testRegex (y no testMatch) porque la ruta del proyecto tiene carpetas que empiezan con punto
  testRegex: /src[/\\]__tests__[/\\].*\.test\.jsx?$/.source,
};
