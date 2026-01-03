import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react','@wxt-dev/auto-icons'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: 'Rumia ai',
    description: 'A browser extension that uses ai to explain new words with context.',
    version: '1.0.0',
    permissions: ['storage', 'contextMenus', 'scripting', 'tabs'],
    host_permissions: ['<all_urls>'],
  },
  autoIcons: {
    baseIconPath: 'assets/icon.png',
    sizes: [16, 48, 96, 128],
  }
});
