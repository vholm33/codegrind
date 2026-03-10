interface Categories {
    name: string;
    handout: string;
}

async function fetchCategories(): Promise<Categories[]> {
    try {
        const url = 'http://localhost:3000/api/categories/all';
        //! get behövs väl inte specifieras?

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        console.log(result);

        return result.data || result;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

addEventListener('DOMContentLoaded', () => {
    toggleSidebar; // om () öppnas direkt
    //renderCategories(categories)
});

function renderCategories(categories: Categories[]) {
    const catContainer = document.querySelector('#cat-container');
}
function toggleSidebar() {
    const sidebarContainer = document.querySelector('#sidebar-container') as HTMLDivElement;
    const textElements = document.querySelectorAll('[data-sidebar-text]');

    // w-14 is start-size
    if (sidebarContainer.classList.contains('w-14')) {
        // Expand
        sidebarContainer.classList.remove('w-14');
        sidebarContainer.classList.add('w-64');

        textElements.forEach((el) => {
            el.classList.remove('hidden');
        });
    } else {
        // Collapse
        sidebarContainer.classList.remove('w-64');
        sidebarContainer.classList.add('w-14');

        textElements.forEach((el) => {
            el.classList.add('hidden');
        });
    }
}

// Gör global
(window as any).toggleSidebar = toggleSidebar;
