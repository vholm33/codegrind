interface Categories {
    name: string;
    handout: string;
}

// [x]  1. Fetch categories
// [x]  2. Render #sidebar-container
// [ ]  3. Render button in #sidebar-container

export async function initSidebar() {
    // console.groupCollapsed('Sidebar Init()');
    try {
        const categories = await fetchCategories();
       // console.log(categories);

        const sidebar = document.querySelector('#sidebar-container');

        sidebar?.addEventListener('mouseenter', () => {
            // Only expand if currently collapsed
            if (sidebar.classList.contains('w-14')) {
                toggleSidebar();
            }
        });

        sidebar?.addEventListener('mouseleave', () => {
            // Only collapse if currently expanded
            if (sidebar.classList.contains('w-64')) {
                toggleSidebar();
            }
        });

        toggleSidebar; // om () öppnas direkt. Funkar med bara onClick från button?

        // console.log('Creating NAV');

        const catBtnContainer = document.createElement('nav');
        // console.log('nav:', catBtnContainer);

        catBtnContainer.innerHTML = `
        <a href="/src/handouts/handouts.html?category=Konstanter" class="flex items-center px-4 py-3 hover:bg-gray-700">
            <span class="mr-3 text-xl"
                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.499 8.248h15m-15 7.501h15" />
                </svg>
            </span>
            <span data-sidebar-text class="hidden">Konstanter</span>
        </a>
        <a href="/src/handouts/handouts.html?category=TypeScript" class="flex items-center px-4 py-3 hover:bg-gray-700">
            <span class="mr-3 text-xl"
                ><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                        <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12"/>
                        <path d="M18 12h-1.8a1.2 1.2 0 0 0-1.2 1.2v.6a1.2 1.2 0 0 0 1.2 1.2h.6a1.2 1.2 0 0 1 1.2 1.2v.6a1.2 1.2 0 0 1-1.2 1.2H15m-6.5-6h2m2 0h-2m0 0v6"/>
                    </g>
                </svg>
            </span>
            <span data-sidebar-text class="hidden">TypeScript</span>
        </a>
        <a href="/src/handouts/handouts.html?category=Loopar" class="flex items-center px-4 py-3 hover:bg-gray-700">
            <span class="mr-3 text-xl"
                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                </svg>
            </span>
            <span data-sidebar-text class="hidden">Loopar</span>
        </a>
        <a href="/src/handouts/handouts.html?category=Metoder" class="flex items-center px-4 py-3 hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
            <span data-sidebar-text class="hidden">Metoder</span>
        </a>
    `;
        sidebar?.appendChild(catBtnContainer);
        // renderCategories(categories)
    } finally {
        // console.groupEnd();
    }
};

// [x] 1. Fetch categories
async function fetchCategories(): Promise<Categories[]> {
    // console.group(`fetchCategories()`);

    try {
        const url = 'http://localhost:3000/api/categories/get';

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        // console.log(result);

        return result.data || result;
    } catch (error) {
        console.error('Error:', error);
        return [];
    } finally {
        // console.groupEnd();
    }
}

// [x] 2. Render #sidebar-container
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

/* function renderCategories(categories: Categories[]) {
    const catContainer = document.querySelector('#cat-container');
} */

// Gör global
(window as any).toggleSidebar = toggleSidebar;
