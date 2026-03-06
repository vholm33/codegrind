import type { CodeQuestion } from '@shared/types.js';
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
// const categorySelect = document.getElementById('code-category') as HTMLSelectElement;
// const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;

// Editor state ?

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
        const questions = (await response.json()) as CodeQuestion;

        console.log('Questions:', questions);

        questions.forEach((q) => console.log(q.codeQuestion));
        /* data.forEach((question) => {
            console.log(question.codeTitle);
            console.log(question.codeQuestion);
        }); */

        return questions;
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
    }

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
