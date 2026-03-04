// addProblem.ts
import { CodeEditor } from './components/Editor.js';

async function loadCategories() {
    try {
        const response = await fetch('http://localhost:3000/api/categories/get');
        const result = await response.json();
        console.log('Result:', result);

        if (result.success && result.data) {
            const select = document.getElementById('code-category') as HTMLSelectElement;
            /* if (!select) {
                console.error(`‼️ Select element finns inte`);
                return;
            } */
            select.innerHTML = '<option value="">Välj kategori...</option>';

            // Display each category from result.data
            result.data.forEach((category: any) => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name; // Display name
                select.appendChild(option);
            });

            console.log('Categories loaded:', result.data);
        }
    } catch (error) {
        console.error(`‼️ Error: ${error}`);
    }
}

loadCategories();

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize code editor
    const editorContainer = document.getElementById('code-editor-container');

    if (!editorContainer) {
        console.error('Editor container not found');
        return;
    }

    // Create editor instance
    const editor = new CodeEditor(editorContainer);

    // Handle form submission
    const form = document.querySelector('form');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get values directly from elements
        const categoryId = (document.getElementById('code-category') as HTMLSelectElement).value;
        const codeTitle = (document.getElementById('code-title') as HTMLInputElement).value;
        const codeQuestion = (document.getElementById('code-question') as HTMLInputElement).value;
        const codeAnswer = editor.getValue();

        if (!categoryId || !codeTitle || !codeQuestion || !codeAnswer) {
            alert('All fields are required!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/codeQuestions/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codeTitle,
                    codeQuestion,
                    codeAnswer,
                    categoryId: parseInt(categoryId),
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Problem created successfully!');
                form.reset();
                editor.setValue('// Skriv din lösning här...'); // Reset editor
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create problem');
        }
    });
});
