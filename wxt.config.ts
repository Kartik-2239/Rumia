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
    description: 'Rumia is an ai powered extension that gives explanations of words with context without interrupting your reading flow.',
    version: '1.0.0',
    permissions: ['storage', 'contextMenus', 'scripting', 'tabs', 'activeTab'],
    // host_permissions: ['<all_urls>'],
  },
  autoIcons: {
    baseIconPath: 'assets/icon.png',
    sizes: [16, 48, 96, 128],
  }
});
