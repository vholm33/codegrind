function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const textElements = document.querySelectorAll('[data-sidebar-text]');

    // w-14 is start-size
    if (sidebar.classList.contains('w-14')) {
        // Expand
        sidebar.classList.remove('w-14');
        sidebar.classList.add('w-64');

        textElements.forEach((el) => {
            el.classList.remove('hidden');
        });
    } else {
        // Collapse
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-14');

        textElements.forEach((el) => {
            el.classList.add('hidden');
        });
    }
}

// Gör global
window.toggleSidebar = toggleSidebar;
