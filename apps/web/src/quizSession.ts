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
const progBarPercentageEl = document.querySelector('#progress-percentage') as HTMLSpanElement;
const progressXN = document.querySelector('#progress-xn');

type Attempts = 0 | 1 | 2 | 3;
const MAX_ATTEMPTS: number = 3;

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

let canSubmit: boolean = true;
let attempts: Attempts = 0;
let points: number = 0;
let questionResults: QuestionResult[] = [];

//====== STATE ======
let currentIndex: number = 0;
let resolveNext: (() => void) | null = null;

let editor: CodeEditor | null = null;

// [x] 1. INIT CodeEditor
// [x] 2. FETCH codeQuestions for quizSession
// [x] 3. RENDER codeQuestions
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Quiz session börjar');

    // [x] 1. Initiera CodeEditor
    editor = initEditor();

    // [x] 2. FETCH codeQuestions
    const codeQuestions = await fetchCodeQuestions();

    /* form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmit(e, resolveNext);
    }); */
    //? behövdes inte "quiz:submit"
    document.addEventListener('submit', (e) => {
        handleSubmit(e, resolveNext);
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSubmit(e, resolveNext);
        }
    });

    // [x] 3. RENDER codeQuestions
    renderCodeQuestion(codeQuestions); // OK
});

// [x] 1. Init Editor
function initEditor(): CodeEditor | null {
    if (editorContainerEl) {
        editor = new CodeEditor(editorContainerEl);
        console.log(`CodeEditor initialised`);
        return editor;
    } else {
        console.error(`‼️ editor contaner not found`);
        return null;
    }
}

// [x] 2. FETCH codeQuestions
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
        return questions.data;
    } catch (error) {
        console.error('Error när hämtar frågor:', error);
        return [];
    } finally {
        console.groupEnd();
    }
}

// [x] 3. RENDER codeQuestions
async function renderCodeQuestion(codeQuestions: CodeQuestion[]) {
    console.log(`renderCodeQuestion()...`); // OK

    //! const codeQuestionEl = document.querySelector('#code-question');
    if (!categoryEl || !codeQuestionEl) {
        console.error(`Element saknas`);
        return;
    }

    console.log('codeQuestions: ', codeQuestions);

    // Randomise order
    const shuffledQuestions = [...codeQuestions].sort(() => Math.random() - 0.5);

    await quizLoop(shuffledQuestions);

    // 0. Ränsa fråge-paragraf
    /*    console.log(`writing test in paragraph`);
    console.log(codeQuestionEl.innerHTML);
    codeQuestionEl.innerHTML = 'test';
    console.log(codeQuestionEl.innerHTML); */

    // 1. Visa första frågan
    // 2. Ränsa fråge-paragraf
    //codeQuestionEl.innerHTML = '';

    /* codeQuestions.forEach((q) => {
        console.log(q.codeQuestion);
        console.log(q.codeAnswer);
    }); */
    /*  // Iterate questions
    for (const question in codeQuestions) {
        console.log('question:', question);
    } */
}

async function quizLoop(shuffledQuestions: CodeQuestion[]) {
    loadQuestion(shuffledQuestions, 0);
}
function loadQuestion(questions: CodeQuestion[], index: number) {
    console.group(`loadQuestion`);

    let questionsLength = questions.length;

    // Om quiz är slut
    if (index >= questionsLength) {
        return;
    }

    currentQuestion = questions[index] ?? null; // Blir null om undefined
    // currentQuestionIndex = question
    attempts = 0;
    canSubmit = true;
    updateQuestionUI(currentQuestion!, questionsLength, index); // Är inte null
    setTimeout(() => editor?.focus(), 150);
    resolveNext = () => loadQuestion(questions, index + 1);
    console.groupEnd();
}

// ====== QUIZ LOOP =====
/* async function quizLoop(shuffledQuestions: CodeQuestion[]) {
    console.group(`quizLoop`);

    for (const [index, question] of shuffledQuestions.entries()) {
        console.group(`Fråga ${index + 1}/${shuffledQuestions.length}`);

        //! const categoryName = getCategoryName(question.categoryId);
        console.log(question);
        // console.log(codeQuestions[questions]); for in

        // Förbered nästa fråga
        console.info(`FÖRBEREDER nästa fråga...`);
        currentQuestion = question; // Sätt frågan
        attempts = 0; // Ställ om till 0
        canSubmit = true;
        console.info(`SPARA aktuell fråga i currentQuestion`);
        console.info(`NOLSTÄLL räknare`);
        console.info(`TILLÅT inlämning`);

        updateQuestionUI(question);

        let resolveNext: (() => void) | null = null; // spara resolve-funktionen

        await new Promise<void>((resolve) => {
            resolveNext = resolve;

            const submitHandler = (event: Event) => {
                event.preventDefault();

                if (!canSubmit) return;

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
        console.groupEnd();
    }
    console.groupEnd();
} */

function updateQuestionUI(question: CodeQuestion, questionsLength: number, index: number) {
    if (!categoryEl || !codeQuestionEl || !feedbackEl || !editor || !progressbarEl || !progBarPercentageEl || !progressXN) return;
    // 1. Progress x/n
    progressXN.innerHTML = `${index+1}/${questionsLength}`;

    // 2. Progress Bar
    console.info(`updateQuestionUI - question`, question);
    progressbarEl.max = questionsLength;
    progressbarEl.value = index;

    // 3. Progressbar Percentage
    console.info('progBarPercentageEl:', progBarPercentageEl);
    const percentage = Math.round((index / questionsLength) * 100);
    progBarPercentageEl.innerHTML = `${percentage}%`;

    categoryEl.innerHTML = question.categoryName;
    // Display Question
    codeQuestionEl.innerHTML = question.codeQuestion;
    console.info('codeQuestionEl.innerHTML', codeQuestionEl.innerHTML);
    console.log(`currentQuestion:`, currentQuestion);

    console.info(`nollställ CodeEditor...`);
    console.info(`ta bort highlights och sätt text till ''`);
    editor?.clearHighlights();
    editor?.setValue('');
    console.info(`hide feedback...`);
    feedbackEl?.classList.add('hidden');

    //! (not yet) editor?.setValue(''); // Nollställ CodeEditor
    // ska visa kvar vad som blev fel
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

// ?
function calculatePoints(attempts: number): number {
    switch (attempts) {
        case 1:
            return 5;
        case 2:
            return 3;
        case 3:
            return 1;
        default:
            return 0;
    }
}

/**======( handleSubmit )======
 *
 * FUNCTIONS:
 *  1. normaliseCode() # from userInput and correctAnswer
 *  2. compareAnswers(userAnswer, correctAnswer) >> ranges
 *  3. >> EDITOR.highlightText(ranges)
 *
 * IF CORRECT       --> handleCorrectAnswer(nextQuestion)                   --> showSuccessFeedback(feedbackEl, points)
 * IF MAX-TRIES     --> handleMaxAttempts(correctAnswer, nextQuestion)
 * IF INCORRECT     --> hanleIncorrectAnswer(isTooShort, missingChars)
 */
function handleSubmit(event: Event, nextQuestion: (() => void) | null): 'correct' | 'incorrect' | 'max-tries' {
    event.preventDefault();
    console.group(`handleSubmit(event)`);

    try {
        if (!canSubmit) return 'max-tries';

        // Tar bort submittion
        if (attempts >= MAX_ATTEMPTS) {
            canSubmit = false;
        }

        attempts++;
        console.log(`=========( Attempt: ${attempts}/${MAX_ATTEMPTS} )==========`);

        const userAnswer = normaliseCode(editor?.getValue() ?? '');
        const correctAnswer = normaliseCode(currentQuestion?.codeAnswer ?? '');
        const isCorrect = userAnswer === correctAnswer;

        // Om användarens svar är för kort
        const isTooShort: boolean = userAnswer.length < correctAnswer.length;
        const missingChars: number = isTooShort ? correctAnswer.length - userAnswer.length : 0;

        // 2. MAX TRIES
        // Handle incorrect answer (show feedback, highlight, etc.)
        const ranges = compareAnswers(userAnswer, correctAnswer);
        editor?.highlightText(ranges);

        // 1. CORRECT
        if (isCorrect) {
            return handleCorrectAnswer(nextQuestion);
        }

        // 2. MAX-TRIES, samma IF: hanterar UI logik
        if (attempts >= MAX_ATTEMPTS) {
            return handleMaxAttempts(correctAnswer, nextQuestion); // RETURNS: 'max-tries'
        }

        // 3. INCORRET
        if (feedbackEl) {
            // Show remaining attempts
            return handleIncorrectAnswer(isTooShort, missingChars); // RETURNS: 'incorrect'
        } else {
            console.error('Returning feedback even though feedbackEl does nott exist');
            return 'incorrect';
        }
    } finally {
        console.groupEnd();
    }
}
// 1. CORRECT
function handleCorrectAnswer(nextQuestion: (() => void) | null): 'correct' {
    points = calculatePoints(attempts);

    if (currentQuestion) {
        questionResults.push({
            questionId: currentQuestion.id,
            points: points,
            attempts: attempts,
            isCorrect: true,
        });
        console.info('Pushed to questionResults:', questionResults);
    }

    console.log(`RÄTT! Du fick ${points} poäng`);

    // Show success message
    showSuccessFeedback(feedbackEl, points);

    console.info('canSubmit satt till ', (canSubmit = false));

    // Move to next question after delay
    setTimeout(() => {
        editorContainerEl?.classList.remove('bg-lime-500');
        if (nextQuestion) nextQuestion();
    }, 3000);

    return 'correct';
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

// 2. MAX-TRIES
function handleMaxAttempts(correctAnswer: string, nextQuestion: (() => void) | null): 'max-tries' {
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
function handleIncorrectAnswer(isTooShort: boolean, missingChars: number): 'incorrect' {
    // Show remaining attempts
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
    return (
        code
            .replace(/\s+/g, ' ') // Gör om alla mellanrum till ett ' '
            .replace(/\s*:\s*/g, ':') // Normalisera space runt ':'
            .replace(/\s*;\s*/g, ';') // Normalisera space runt ';'
            .replace(/\s*,\s*/g, ',') // Normalisera space runt ','
            .replace(/\s*=>\s*/g, '=>') // Normalisera space runt '=>'
            .replace(/\s*=\s*/g, '=') // Normalisera space runt '='
            .replace(/\s*==\s*/g, '==') // Normalisera space runt '=='
            .replace(/\s*===\s*/g, '===') // Normalisera space runt '==='
            .replace(/\s*{\s*/g, '{') // Normalisera space runt {'
            .replace(/\s*}\s*/g, '}') // Normalisera space runt }'
            // OPERATORS
            .replace(/\s*\+\s*/g, '+') // Normalisera space runt '+'
            .replace(/\s*-\s*/g, '-') // Normalisera space runt '-'
            .replace(/\s*\/\s*/g, '/') // Normalisera space runt '/'
            .trim()
    );
}

// Rendera feedback med funktion
