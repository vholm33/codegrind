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
const feedbackEl = document.querySelector('#feedback');
const categoryEl = document.querySelector('#category-name') as HTMLElement;
// const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;

// 1. Kopplar till varje HEL quiz session
interface QuizSessions {
    userId: number; // Användaren som kört quiz
    totalQuestions: number; // Totalt antal frågor
    questionsAnswered: number; // Antal besvarade frågor
    totalPoints: number; // Antal poäng för hela quiz-sessionen
}

// 2. Kopplas till varje fråga i quiz-sessionen
interface QuizAnswers {
    sessionId: number; // Användarens quiz-session
    questionId: number; // Användarens fråga i sessionen
    attempts: number; // Användarens försök per fråga
    points: number; // Användarens poäng per fråga
    isCorrect: boolean; // Lyckades användaren få rätt?
}

let quizSessions: QuizSessions[] = []; // Array med sessioner
let quizAnswers: QuizAnswers[] = []; // Array med svar

let currentQuestion: CodeQuestion | null = null;
let attempts: number = 0;
const MAX_ATTEMPTS: number = 3;
let canSubmit: boolean = true;

// Editor state ?
let editor: CodeEditor | null = null;

if (editorContainerEl) {
    editor = new CodeEditor(editorContainerEl);
    console.log(`CodeEditor initialised`);
} else {
    console.error(`‼️ editor contaner not found`);
}

// 1. FETCH codeQuestions for quizSession
// 2. RENDER codeQuestions

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Quiz session börjar');
    // initEditor?

    const questionData = await fetchCodeQuestions();
    // console.log(`calling renderCodeQuestion with questionData`);

    //! form.addEventListener('submit', handleSubmit);

    renderCodeQuestion(questionData); // OK

    // Vänta kort
    setTimeout(() => {
        editor?.focus();
    }, 100);
});


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

async function renderCodeQuestion(questionData: CodeQuestion[]) {
    console.log(`renderCodeQuestion()...`); // OK

    //! const codeQuestionEl = document.querySelector('#code-question');
    if (!categoryEl) {
        console.error(`categoryEl finns inte`);
        return;
    }
    if (!codeQuestionEl) {
        console.error('codeQuestion element finns inte');
        return; // behövs för att TS ska veta att är safe
    }

    console.log(`hide feedback...`);
    feedbackEl?.classList.add('hidden');

    console.log('questionData: ', questionData);

    // ====== QUIZ LOOP =====
    for (const question of questionData) {
        //! const categoryName = getCategoryName(question.categoryId);

        console.log(question);
        // console.log(questionData[questions]); for in

        currentQuestion = question; // Sätt frågan
        attempts = 0;
        canSubmit = true;

        categoryEl.innerHTML = question.categoryName;
        codeQuestionEl.innerHTML = question.codeQuestion;
        console.log(`currentQuestion:`, currentQuestion);

        console.warn(`nollställ CodeEditor...`);
        console.log(`ta bort highlights och sätt text till ''`);
        editor?.clearHighlights();
        editor?.setValue('');

        //! (not yet) editor?.setValue(''); // Nollställ CodeEditor
        // ska visa kvar vad som blev fel

        // Display Question
        codeQuestionEl.innerHTML = `${question.codeQuestion}`;

        // WAIT for answer
        // get answer from

        await new Promise<void>((resolve) => {
            const submitHandler = (event: Event) => {
                event.preventDefault();

                if (!canSubmit) return;

                handleSubmit(event);

                const keyHandler = (e: KeyboardEvent) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        document.removeEventListener('keydown', keyHandler);
                        form.removeEventListener('submit', submitHandler);
                        resolve();
                    }
                };
                document.addEventListener('keydown', keyHandler);
            };
            //! form.addEventListener('submit', submitHandler, { once: true });
            // once, true removes more attempts listeners
            form.addEventListener('submit', submitHandler);
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

interface FeedbackItem {
    text: string;
    isCorrect: boolean;
    startIndex: number;
    endIndex: number;
}
/* function analyseAnswer(): FeedbackItem[] {
    const feedback: FeedbackItem[] = [];

    // 1. COMPARE userInput with stored answer

    // 2.
} */


/*
1. STOP IF (max-tries)
2. GET userInput & correctAnswer
3. COMPARE userInput & correctAnswer
4. ---In Editor--- << COLOUR correct/incorrect characters
5. 
*/
function handleSubmit(event: Event): 'correct' | 'incorrect' | 'max-tries' {
    event.preventDefault();

    if (!canSubmit) return 'max-tries';
    attempts++;
    console.info(`attempts++`);

    console.log(`=========( Handle Submit: Attempt: ${attempts}/${MAX_ATTEMPTS} )==========`);

    // När submit --> hämtar userInput från Editor
    const userAnswer = normaliseCode(editor?.getValue() ?? '');
    const correctAnswer = normaliseCode(currentQuestion?.codeAnswer ?? '');

    // Check if answer is too short
    if (userAnswer.length < correctAnswer.length) {
        if (feedbackEl) {
            feedbackEl.textContent = `Ditt svar är för kort. Det saknas (${correctAnswer.length - userAnswer.length}) karaktärer`;
            console.log('feedback remove "hidden"');
            feedbackEl.classList.remove('hidden'); // Visa
        }

        //! alert(`Svar för kort! Du har ${MAX_ATTEMPTS - attempts} försök kvar.`);
    }

    const ranges = compareAnswers(userAnswer, correctAnswer);

    console.info(`ranges AFTER comparison:`, ranges);

    // ranges kopplar karaktär med CSS till editor
    // 1. RÄTT "cm-correct-highlight"
    // 1. FEL "cm-incorrect-highlight"
    if (editor) {
        console.log(`trying to clearHighlights()...`);
        editor.clearHighlights();
        console.log(`CALL highlight text ranges in editor class`);
        console.log(`highlightText(ranges) --> ranges:`, ranges);
        editor.highlightText(ranges);

        console.debug(`🪳 Focus in editor again for next attempt`);
        editor.focus();
    }

    // IF correct but characters missing


    // Focus i editor efter submit
    setTimeout(() => {
        editor?.focus();
    }, 100);

    return 'incorrect';
}

function compareAnswers(userAnswer: string, correctAnswer: string) {
    console.groupCollapsed(`compareAnswers(userAnswer, correctAnswer)`);

    console.log(`compareAnswers(userAnswer, correctAnswer)`);
    console.log(`userAnswer.length: ${userAnswer.length}`);
    console.log(`correctAnswer.length: ${correctAnswer.length}`);

    const ranges = [];
    const maxLength = Math.max(userAnswer.length, correctAnswer.length);

    for (let i = 0; i < maxLength; i++) {
        if (i >= userAnswer.length) {
            // User input is shorter - mark missing characters as incorrect
            console.groupCollapsed(`userInput too short`);
            console.warn(`userInput too short: ${userAnswer}`);
            console.warn(`userAnswer.length: ${userAnswer.length}`);
            console.warn(`correctAnswer.length: ${correctAnswer.length}`);
            console.warn(`${correctAnswer.length - userAnswer.length} --> characters missing from userInput`);
            console.groupEnd();
            ranges.push({
                from: i,
                to: i + 1,
                className: 'cm-incorrect-highlight',
            });
        } else if (i >= correctAnswer.length) {
            // User has extra characters - mark as incorrect
            ranges.push({
                from: i,
                to: i + 1,
                className: 'cm-incorrect-highlight',
            });
        } else if (userAnswer[i] === correctAnswer[i]) {
            console.log(`[MATCH] - character matches! --> ${userAnswer[i]} === ${correctAnswer[i]}`);
            // Character matches
            ranges.push({
                from: i,
                to: i + 1,
                className: 'cm-correct-highlight',
            });
        } else {
            console.log(`[NO match] character doesnt match`);
            // Character doesn't match
            ranges.push({
                from: i,
                to: i + 1,
                className: 'cm-incorrect-highlight',
            });
        }
    }

    console.groupEnd();
    return ranges;
}

// Normalisera kodsvaret från användaren
function normaliseCode(code: string): string {
    return code
        .replace(/\s+/g, ' ') // Gör om alla nya rader till ' '
        .trim();
}
