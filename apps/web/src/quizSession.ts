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
const feedbackEl = document.querySelector('#feedback') as HTMLElement;
const categoryEl = document.querySelector('#category-name') as HTMLElement;
// const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
const progressbarEl = document.querySelector('#status') as HTMLProgressElement;

type Attempts = 0 | 1 | 2 | 3;
const MAX_ATTEMPTS: number = 3;

// State
let currentQuestion: CodeQuestion | null = null;
let canSubmit: boolean = true;
let attempts: Attempts = 0;
let points: number = 0;
let questionResults: QuestionResult[] = [];

// Editor state ?
let editor: CodeEditor | null = null;

if (editorContainerEl) {
    editor = new CodeEditor(editorContainerEl);
    console.log(`CodeEditor initialised`);
} else {
    console.error(`‼️ editor contaner not found`);
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Quiz session börjar');
    // initEditor?

    const questionData = await fetchCodeQuestions();

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
    if (!categoryEl || !codeQuestionEl || !progressbarEl) {
        console.error(`Element saknas`);
        return;
    }

    console.log('questionData: ', questionData);

    const totalQuestions = questionData.length;
    progressbarEl.max = totalQuestions;
    progressbarEl.value = 5;

    // Randomise order
    const shuffledQuestions = [...questionData].sort(() => Math.random() - 0.5);

    // ====== QUIZ LOOP =====
    for (const question of shuffledQuestions) {
        //! const categoryName = getCategoryName(question.categoryId);

        console.log(question);
        // console.log(questionData[questions]); for in

        console.debug(`SET currentQuestion`);
        console.debug(`SET attempts = 0`);
        console.debug(`SET canSubmit = true`);
        currentQuestion = question; // Sätt frågan
        attempts = 0; // Ställ om till 0
        canSubmit = true;

        categoryEl.innerHTML = question.categoryName;
        // Display Question
        codeQuestionEl.innerHTML = question.codeQuestion;
        console.log(`currentQuestion:`, currentQuestion);

        console.warn(`nollställ CodeEditor...`);
        console.log(`ta bort highlights och sätt text till ''`);
        editor?.clearHighlights();
        editor?.setValue('');
        console.log(`hide feedback...`);
        feedbackEl?.classList.add('hidden');

        //! (not yet) editor?.setValue(''); // Nollställ CodeEditor
        // ska visa kvar vad som blev fel

        let resolveNext: (() => void) | null = null; // spara resolvefunktionen

        await new Promise<void>((resolve) => {
            resolveNext = resolve;

            const submitHandler = (event: Event) => {
                event.preventDefault();
                if (!canSubmit) return;

                /*

                */
                handleSubmit(event, resolveNext);

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
}

interface FeedbackItem {
    text: string;
    isCorrect: boolean;
    startIndex: number;
    endIndex: number;
}

interface QuestionResult {
    questionId: number;
    categoryId?: number;
    points: number;
    attempts: number;
    isCorrect: boolean;
}



function showSuccessFeedback(feedbackEl: HTMLElement | null, points: number): void {
    if (feedbackEl) {
        editorContainerEl?.classList.add('bg-cyan-500');
        feedbackEl.innerHTML = `
            <div class="flex gap-4">
                <div class="shrink-0 bg-green-500 p-2 border rounded-md text-white">
                    Rätt!
                </div>
                <div class="flex-1 rounded-md border bg-green-900 py-2 text-center text-green-400 p-2">
                    Du fick ${points} poäng!
                </div>
            </div>
            `;

        feedbackEl.classList.remove('hidden');
    }
}

function handleSubmit(event: Event, nextQuestion: (() => void) | null): 'correct' | 'incorrect' | 'max-tries' {
    event.preventDefault();

    if (!canSubmit) return 'max-tries';

    if (attempts >= MAX_ATTEMPTS) {
        canSubmit = false;
    }

    attempts++;
    console.log(`=========( Attempt: ${attempts}/${MAX_ATTEMPTS} )==========`);

    const userAnswer = normaliseCode(editor?.getValue() ?? '');
    const correctAnswer = normaliseCode(currentQuestion?.codeAnswer ?? '');
    const isCorrect = userAnswer === correctAnswer;

    // Om användarens svar är för kort
    const isTooShort = userAnswer.length < correctAnswer.length;
    const missingChars = isTooShort ? correctAnswer.length - userAnswer.length : 0;

    // 1. CORRECT
    if (isCorrect) {
        if (attempts === 1) points = 5;
        else if (attempts === 2) points = 3;
        else if (attempts === 3) points = 1;

        if (currentQuestion) {
            questionResults.push({
                questionId: currentQuestion.id,
                points: points,
                attempts: attempts,
                isCorrect: true,
            });
        }

        console.log(`RÄTT! Du fick ${points} poäng`);
        // Show success message
        showSuccessFeedback(feedbackEl, points);

        canSubmit = false;

        // Move to next question after delay
        setTimeout(() => {
            editorContainerEl?.classList.remove('bg-lime-500');
            if (nextQuestion) nextQuestion();
        }, 3000);

        return 'correct';
    }

    // 2. MAX TRIES
    // Handle incorrect answer (show feedback, highlight, etc.)
    const ranges = compareAnswers(userAnswer, correctAnswer);
    editor?.highlightText(ranges);

    // Check if max attempts reached
    if (attempts >= MAX_ATTEMPTS) {
        canSubmit = false;

        if (feedbackEl) {
            editor?.setValue(correctAnswer);
            editorContainerEl?.classList.add('bg-lime-500');

            feedbackEl.innerHTML = `
            <div class="flex gap-4">
                <div class="shrink-0 bg-red-500 p-2 border rounded-md text-white">
                    Inga fler försök
                </div>
                <div class="flex-1 rounded-md border bg-red-900 py-2 text-center text-red-400 p-2">
                    Rätt svar nedan:
                </div>
            </div>
            `;
            feedbackEl.classList.remove('hidden');
        }

        setTimeout(() => {
            editorContainerEl?.classList.remove('bg-lime-500');
            if (nextQuestion) nextQuestion();
        }, 8000);

        return 'max-tries';
    }

    // 3. INCORRET
    // Show remaining attempts
    if (feedbackEl) {
        if (isTooShort) {
            // Hur många karaktärer saknas?
            feedbackEl.innerHTML = `
            <div class="flex gap-4">
                <div class="shrink-0 bg-cyan-500 p-2 border rounded-md text-white">
                    Försök kvar: ${MAX_ATTEMPTS - attempts}
                </div>
                <div class="flex-1 rounded-md border bg-yellow-900 py-2 text-center text-yellow-400 p-2">
                    Ditt svar är för kort. Det saknas <span class="text-red-500 rounded-xl bg-red-950 p-1 font-bold">${missingChars}</span> ${missingChars === 1 ? 'karaktär' : 'karaktärer'}
                </div>
            </div>
        `;
        } else {
            // Vanligt felmeddelande
            feedbackEl.innerHTML = `
                <div class="flex gap-4">
                    <div class="shrink-0 bg-red-500 p-2 border rounded-md text-white">
                        Försök kvar: ${MAX_ATTEMPTS - attempts}
                    </div>
                    <div class="flex-1 rounded-md border bg-yellow-900 py-2 text-center text-yellow-400 p-2">
                        Det saknas
                    </div>
                </div>
            `;
        }
        feedbackEl.classList.remove('hidden');
        editor?.focus();
    }
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

// Rendera feedback med funktion
