import type { CodeQuestion } from '@shared/types.js';

import { CodeEditor } from '../../components/Editor.js';

let editor: CodeEditor | null = null;

addEventListener('DOMContentLoaded', async () => {
    // GET category from url
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    console.log('cat:', category);

    const questionData = await fetchCodeQuestions();
    console.log(questionData);

    const filteredQuestions = category ? questionData.filter((q) => q.categoryName === category) : questionData;
    console.log(`Filtrerade frågor för ${category || 'alla kategorier'}`, filteredQuestions);

    // Grid Layout
    renderAllQuestions(filteredQuestions);
    //? RENDER stars to click as ratings
    renderRatingStars(questionData.length);
});

function renderAllQuestions(questionData: CodeQuestion[]): void {
    const questionContainer = document.querySelector('#question-container');

    if (questionContainer) {
        const questionsHTML = questionData
            /* make cards */
            .map(
                (q, index) => `
                <div class="bg-slate-900 border my-2">
                    <!-- <div>${q.categoryName}</div> -->
                    <div class="text-center p-4">${q.codeQuestion}</div>
                    <div data-editor-index="${index}"></div>
                    <div rating-stars-index="${index}"></div
                </div>
        `,
            )
            .join(''); // Annars blir map till array och inte string

        // Då kan inte renderas
        questionContainer.innerHTML = `
                <div>
                    ${questionsHTML}
                </div>

            `;
        // Nu initiera editor för varje container
        questionData.forEach((q, index) => {
            const editorContainer = document.querySelector(`[data-editor-index="${index}"]`);
            if (editorContainer) {
                editor = new CodeEditor(editorContainer as HTMLDivElement, q.codeAnswer);
            }
        });
    }
}

function renderRatingStars(questionLength: number): void {
    console.log('questionLength', questionLength);

    for (let i = 0; i < questionLength; i++) {
        let ratingStarsContainer = document.querySelector(`[rating-stars-index="${i}"]`);

        console.log(ratingStarsContainer);
        if (ratingStarsContainer) {
            ratingStarsContainer.innerHTML = `
                <div class="flex justify-center gap-10">
                    <div data-rating="1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                    </div>
                    <div data-rating="2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                    </div>
                    <div data-rating="3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                    </div>
                    <div data-rating="4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                    </div>
                    <div data-rating="5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg></div>
                    </div>
                `;
        }
    }
}

async function fetchCodeQuestions(): Promise<CodeQuestion[]> {
    console.groupCollapsed(`fetchCodeQuestions()`);

    try {
        const url = 'http://localhost:3000/api/codeQuestions/all';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Hämta bara datan
        const questions: { data: CodeQuestion[] } = await response.json(); // # blir assertion, och typen görs om utan errors

        console.log('questions.data :', questions.data);

        // questions.forEach((q) => console.log(q.codeQuestion));
        /* data.forEach((question) => {
            console.log(question.codeTitle);
            console.log(question.codeQuestion);
        }); */
        console.groupEnd();

        return questions.data;
    } catch (error) {
        console.error('Error när hämtar frågor:', error);
        return [];
    }
}
