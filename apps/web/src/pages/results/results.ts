// =========
// Types
// =========

type QuizAnswer = {
    questionId: number;
    categoryName: string;
    attempts: number;
    points: number;
    isCorrect: boolean;
};

type QuizSession = {
    id: number;
    userId: number;
    userName: string;
    totalQuestions: number;
    questionsAnswered: number;
    totalPoints: number;
    answers: QuizAnswer[];
};

type CategoryStat = {
    name: string;
    points: number;
    total: number;
    correct: number;
};

type MetricCard = {
    label: string;
    value: string;
    note: string;
};

type HighlightCard = {
    title: string;
    text: string;
};

// =========
// State
// =========

let sessionData: QuizSession | null = null;

// =========
// Data helpers
// =========

function getCurrentUserId(): number {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return 2;

    try {
        const parsedUser = JSON.parse(storedUser);
        return Number(parsedUser?.id) || 2;
    } catch {
        return 2;
    }
}

async function fetchLatestSession(userId: number): Promise<QuizSession | null> {
    try {
        const response = await fetch(`http://localhost:3000/api/quiz-stats/session/${userId}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const result = await response.json();
        return result.data ?? null;
    } catch (error) {
        console.error('Failed to fetch latest session:', error);
        return null;
    }
}

function getCorrectAnswersCount(data: QuizSession): number {
    return data.answers.filter((answer) => answer.isCorrect).length;
}

function getFirstTryCount(data: QuizSession): number {
    return data.answers.filter((answer) => answer.isCorrect && answer.attempts === 1).length;
}

// =========
// Calculations
// =========

function getAverageAttempts(answers: QuizAnswer[]): string {
    const totalAttempts = answers.reduce((sum, answer) => sum + answer.attempts, 0);
    return (totalAttempts / answers.length).toFixed(1);
}

function getCategoryStats(answers: QuizAnswer[]): CategoryStat[] {
    const categoryMap = answers.reduce((map, answer) => {
        const currentCategory = map.get(answer.categoryName) ?? {
            name: answer.categoryName,
            points: 0,
            total: 0,
            correct: 0,
        };

        currentCategory.points += answer.points;
        currentCategory.total += 1;
        currentCategory.correct += answer.isCorrect ? 1 : 0;

        map.set(answer.categoryName, currentCategory);
        return map;
    }, new Map<string, CategoryStat>());

    return Array.from(categoryMap.values()).sort((a, b) => b.points - a.points);
}

function getMetricCards(data: QuizSession): MetricCard[] {
    const correctAnswers = getCorrectAnswersCount(data);
    const answeredRate = Math.round((data.questionsAnswered / data.totalQuestions) * 100);
    const accuracyRate = Math.round((correctAnswers / data.questionsAnswered) * 100);
    const averageAttempts = getAverageAttempts(data.answers);
    const firstTryCount = getFirstTryCount(data);

    return [
        { label: 'Answered', value: `${answeredRate}%`, note: `${data.questionsAnswered}/${data.totalQuestions} questions` },
        { label: 'Accuracy', value: `${accuracyRate}%`, note: `${correctAnswers}/${data.questionsAnswered} correct` },
        { label: 'Average attempts per question', value: averageAttempts, note: '' },
        { label: 'First try wins', value: `${firstTryCount}`, note: 'Questions' },
    ];
}

function getHighlightCards(data: QuizSession): HighlightCard[] {
    const categoryStats = getCategoryStats(data.answers);
    const bestCategory = categoryStats[0];
    const lowestAccuracyCategory = [...categoryStats].sort((a, b) => a.correct / a.total - b.correct / b.total)[0];
    const firstTryCount = getFirstTryCount(data);

    return [
        { title: 'Best category', text: `${bestCategory.name} · ${bestCategory.points} points` },
        { title: 'Lowest accuracy', text: lowestAccuracyCategory.name },
        { title: 'Correct on first try', text: `${firstTryCount} questions` },
    ];
}

// =========
// DOM helpers
// =========

function getElement(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

function renderHTML(selector: string, html: string): void {
    const element = getElement(selector);
    if (!element) return;

    element.innerHTML = html;
}

// =========
// Renderers
// =========

function renderHeader(data: QuizSession): void {
    const sessionTagEl = getElement('#session-tag');
    const scoreValueEl = getElement('#score-value');

    if (!sessionTagEl || !scoreValueEl) return;

    sessionTagEl.textContent = data.userName;
    scoreValueEl.textContent = `${data.totalPoints}`;
}

function renderMetrics(data: QuizSession): void {
    const metricsHTML = getMetricCards(data)
        .map(
            (metric) => `
                <article class="rounded-md border bg-gray-900 p-5">
                    <p class="text-sm uppercase tracking-[0.18em] text-gray-400">${metric.label}</p>
                    <p class="mt-3 text-4xl font-semibold leading-none text-white">${metric.value}</p>
                    <p class="mt-2 text-sm text-gray-400">${metric.note}</p>
                </article>
            `,
        )
        .join('');

    renderHTML('#session-metrics', metricsHTML);
}

function renderHighlights(data: QuizSession): void {
    const highlightsHTML = getHighlightCards(data)
        .map(
            (card) => `
                <article class="rounded-md border bg-gray-900 p-4">
                    <p class="text-sm uppercase tracking-[0.18em] text-gray-400">${card.title}</p>
                    <p class="mt-2 text-xl font-semibold text-white">${card.text}</p>
                </article>
            `,
        )
        .join('');

    renderHTML('#session-highlights', highlightsHTML);
}

function renderCategories(data: QuizSession): void {
    const categoryStats = getCategoryStats(data.answers);
    const highestCategoryScore = Math.max(...categoryStats.map((category) => category.points), 1);

    const categoriesHTML = categoryStats
        .map((category) => {
            const barWidth = Math.round((category.points / highestCategoryScore) * 100);
            const categoryAccuracy = Math.round((category.correct / category.total) * 100);

            return `
                <article class="grid gap-3">
                    <div class="flex items-end justify-between gap-4">
                        <div>
                            <p class="text-lg text-white">${category.name}</p>
                            <p class="text-sm text-gray-400">${category.correct}/${category.total} correct · ${categoryAccuracy}% accuracy</p>
                        </div>
                        <span class="text-lg text-gray-200">${category.points}p</span>
                    </div>
                    <div class="h-3 overflow-hidden rounded-full bg-gray-700">
                        <div class="h-full rounded-full bg-cyan-400" style="width: ${barWidth}%"></div>
                    </div>
                </article>
            `;
        })
        .join('');

    renderHTML('#category-breakdown', categoriesHTML);
}

function renderQuestionResults(data: QuizSession): void {
    const questionResultsHTML = data.answers
        .map((answer, index) => {
            const borderColor = answer.isCorrect ? 'border-lime-400/30' : 'border-red-400/30';
            const resultLabel = answer.isCorrect ? 'Correct' : 'Incorrect';

            return `
                <article class="rounded-md border bg-gray-900 p-4 ${borderColor}">
                    <div class="flex flex-wrap gap-2">
                        <span class="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs uppercase tracking-[0.08em] text-gray-200">Question ${index + 1}</span>
                        <span class="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs uppercase tracking-[0.08em] text-gray-400">${answer.categoryName}</span>
                    </div>
                    <p class="mt-5 text-lg font-semibold text-white">${answer.points} points</p>
                    <p class="mt-1 text-sm text-gray-400">${resultLabel} · ${answer.attempts} attempts</p>
                </article>
            `;
        })
        .join('');

    renderHTML('#question-timeline', questionResultsHTML);
}

function renderEmptyState(): void {
    renderHTML(
        '#question-timeline',
        `<article class="rounded-md border bg-gray-900 p-4 text-gray-300">No quiz data found for this user.</article>`,
    );
}

// =========
// App start
// =========

async function initResultsPage(): Promise<void> {
    const userId = getCurrentUserId();
    sessionData = await fetchLatestSession(userId);

    if (!sessionData) {
        renderEmptyState();
        return;
    }

    renderHeader(sessionData);
    renderMetrics(sessionData);
    renderHighlights(sessionData);
    renderCategories(sessionData);
    renderQuestionResults(sessionData);
}

document.addEventListener('DOMContentLoaded', () => {
    void initResultsPage();
});
