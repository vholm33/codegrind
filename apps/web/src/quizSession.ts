import type { CodeQuestion } from '@shared/types.js';

import { CodeEditor } from './components/Editor.js';
/* Hantera quiz-sessionen */

// 0. GET DOM elements
// 1. FETCH to get random codeQuestion from random category -- make form to choose too
// 2. LOAD and RENDER codeQuestion in #codeQuestion
// 3. LISTEN for userInput in IDE
// 4. COMPARE userAnswer with the stored codeAnswer
// 5. STYLE correct part's BG GREEN
// 5. STYLE incorrect part's BG RED
// LAST: after quiz-session --> user gets to rate the problems with stars. Show average?

// DOM elements
const codeQuestionEl = document.querySelector('#code-question') as HTMLParagraphElement;
const form = document.querySelector('form') as HTMLFormElement;
const editorContainerEl = document.querySelector('#code-editor-container') as HTMLElement | null;
// const categorySelect = document.getElementById('code-category') as HTMLSelectElement;
// const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;

// Editor state ?
let editor: CodeEditor | null = null;

if (editorContainerEl) {
    editor = new CodeEditor(editorContainerEl);
    console.log(`CodeEditor initialised`);
} else {
    console.error(`‼️ editor contaner not found`);
}

async function fetchCodeQuestions(): Promise<CodeQuestion[]> {
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

        console.log('Questions.data :', questions.data);

        // questions.forEach((q) => console.log(q.codeQuestion));
        /* data.forEach((question) => {
            console.log(question.codeTitle);
            console.log(question.codeQuestion);
        }); */

        return questions.data;
    } catch (error) {
        console.error('Error när hämtar frågor:', error);
        return [];
    }
}

async function renderCodeQuestion(questionData: CodeQuestion[]) {
    console.log(`renderCodeQuestion()...`); // OK

    const codeQuestionEl = document.querySelector('#code-question');
    if (!codeQuestionEl) {
        console.error('codeQuestion element finns inte');
        return; // behövs för att TS ska veta att är safe
    }

    console.log('questionData: ', questionData);

    // ====== QUIZ LOOP =====
    for (const questions of questionData) {
        console.log(questions);
        // console.log(questionData[questions]); for in

        // Display Question
        codeQuestionEl.innerHTML = `${questions.codeQuestion}`;

        // WAIT for answer
        // get answer from

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Hämta värde från Editor
            console.log('IDE gotten value', editor?.getValue());

        });
    }

    // 0. Ränsa fråge-paragraf
    /*    console.log(`writing test in paragraph`);
    console.log(codeQuestionEl.innerHTML);
    codeQuestionEl.innerHTML = 'test';
    console.log(codeQuestionEl.innerHTML); */

    // 1. Visa första frågan
    // 2. Ränsa fråge-paragraf
    //codeQuestionEl.innerHTML = '';

    /* questionData.forEach((q) => {
        console.log(q.codeQuestion);
        console.log(q.codeAnswer);
    }); */
    /*  // Iterate questions
    for (const question in questionData) {
        console.log('question:', question);
    } */
}

/* function handleSubmit(event: Event) {
    event.preventDefault()
    if (!)
} */

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Quiz session börjar');
    // initEditor?

    const questionData = await fetchCodeQuestions();
    console.log(`calling renderCodeQuestion with questionData`);
    renderCodeQuestion(questionData); // OK

    // form.addEventListener('submit', handleSubmit);
});
