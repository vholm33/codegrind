import { initSidebar } from './sidebar.js';
import { initToolbar } from './toolbar.js';

addEventListener('DOMContentLoaded', async () => {
    await initToolbar();
    await initSidebar();
});
