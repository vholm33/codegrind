// =========
// Types
// =========

type SessionRow = {
    id: number;
    totalQuestions: number;
    questionsAnswered: number;
    totalPoints: number;
    accuracy: number;
};

type CategoryRow = {
    categoryName: string;
    sessionsSeen: number;
    accuracy: number;
    averagePoints: number;
};

type ProfileData = {
    userName: string;
    levelTitle?: string;
    sessions: SessionRow[];
    categories: CategoryRow[];
};

type MetricCard = {
    label: string;
    value: string;
    note: string;
};

// =========
// State
// =========

let profileData: ProfileData | null = null;

// =========
// Data helpers
// =========

function getCurrentUser(): { id: number; username: string } | null {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    try {
        const parsedUser = JSON.parse(storedUser);
        const id = Number(parsedUser?.id);
        const username = String(parsedUser?.username ?? '').trim();

        if (!Number.isInteger(id) || !username) {
            return null;
        }

        return { id, username };
    } catch {
        return null;
    }
}

function getCurrentUserId(): number {
    return getCurrentUser()?.id ?? 2;
}

function getNumber(value: number | string): number {
    return Number(value);
}

async function fetchProfileData(userId: number): Promise<ProfileData | null> {
    try {
        const response = await fetch(`http://localhost:3000/api/quiz-stats/profile/${userId}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const result = await response.json();
        return result.data ?? null;
    } catch (error) {
        console.error('Failed to fetch profile stats:', error);
        return null;
    }
}

// =========
// Calculations
// =========

function getBestSession(sessions: SessionRow[]): SessionRow {
    return sessions.reduce((best, session) => (session.totalPoints > best.totalPoints ? session : best));
}

function getAverageScore(sessions: SessionRow[]): number {
    const totalScore = sessions.reduce((sum, session) => sum + session.totalPoints, 0);
    return Math.round(totalScore / sessions.length);
}

function getAverageAccuracy(sessions: SessionRow[]): number {
    const totalAccuracy = sessions.reduce((sum, session) => sum + getNumber(session.accuracy), 0);
    return Math.round(totalAccuracy / sessions.length);
}

function getMetricCards(data: ProfileData): MetricCard[] {
    const totalSessions = data.sessions.length;
    const averageScore = getAverageScore(data.sessions);
    const averageAccuracy = getAverageAccuracy(data.sessions);
    const totalAnsweredQuestions = data.sessions.reduce((sum, session) => sum + session.questionsAnswered, 0);

    return [
        { label: 'Sessions', value: `${totalSessions}`, note: '' },
        { label: 'Average score', value: `${averageScore}`, note: '' },
        { label: 'Average accuracy', value: `${averageAccuracy}%`, note: '' },
        { label: 'Answered questions', value: `${totalAnsweredQuestions}`, note: '' },
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

function renderHeader(data: ProfileData): void {
    const bestSession = getBestSession(data.sessions);
    const profileTagEl = getElement('#profile-tag');
    const bestScoreEl = getElement('#profile-best-score');

    if (!profileTagEl || !bestScoreEl) return;

    profileTagEl.textContent = data.userName;
    bestScoreEl.textContent = `${bestSession.totalPoints}p`;
}

function renderHeaderFallback(): void {
    const profileTagEl = getElement('#profile-tag');
    if (!profileTagEl) return;

    profileTagEl.textContent = getCurrentUser()?.username ?? 'Profile';
}

function renderMetrics(data: ProfileData): void {
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

    renderHTML('#profile-metrics', metricsHTML);
}

function getTrendPoints(sessions: SessionRow[], chartWidth: number, chartHeight: number, padding: number) {
    const highestScore = Math.max(...sessions.map((session) => session.totalPoints), 1);

    return {
        highestScore,
        points: sessions.map((session, index) => {
            const x =
                sessions.length === 1
                    ? chartWidth / 2
                    : padding + (index * (chartWidth - padding * 2)) / (sessions.length - 1);
            const y = chartHeight - padding - (session.totalPoints / highestScore) * (chartHeight - padding * 2);

            return {
                x: Math.round(x * 100) / 100,
                y: Math.round(y * 100) / 100,
                score: session.totalPoints,
                id: session.id,
            };
        }),
    };
}

function renderScoreTrend(data: ProfileData): void {
    const chartWidth = 640;
    const chartHeight = 220;
    const padding = 28;
    const { highestScore, points } = getTrendPoints(data.sessions, chartWidth, chartHeight, padding);

    const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(' ');
    const areaPoints = [
        `${padding},${chartHeight - padding}`,
        ...points.map((point) => `${point.x},${point.y}`),
        `${chartWidth - padding},${chartHeight - padding}`,
    ].join(' ');

    const gridLines = Array.from({ length: 4 }, (_, index) => {
        const value = Math.round((highestScore / 4) * (4 - index));
        const y = padding + ((chartHeight - padding * 2) / 4) * index;

        return `
            <line x1="${padding}" y1="${y}" x2="${chartWidth - padding}" y2="${y}" stroke="rgba(148, 163, 184, 0.18)" stroke-dasharray="4 6" />
            <text x="${padding - 8}" y="${y + 4}" fill="rgba(148, 163, 184, 0.8)" font-size="12" text-anchor="end">${value}</text>
        `;
    }).join('');

    const pointMarkers = points
        .map(
            (point) => `
                <g>
                    <circle cx="${point.x}" cy="${point.y}" r="5" fill="#38bdf8" />
                    <circle cx="${point.x}" cy="${point.y}" r="10" fill="rgba(56, 189, 248, 0.14)" />
                    <text x="${point.x}" y="${chartHeight - 6}" fill="rgba(148, 163, 184, 0.9)" font-size="12" text-anchor="middle">S${point.id}</text>
                    <text x="${point.x}" y="${point.y - 14}" fill="#f8fafc" font-size="12" font-weight="600" text-anchor="middle">${point.score}</text>
                </g>
            `,
        )
        .join('');

    const trendHTML = `
        <div class="grid gap-4">
            <svg viewBox="0 0 ${chartWidth} ${chartHeight}" class="w-full overflow-visible rounded-md border border-gray-700 bg-gray-900 p-3">
                <defs>
                    <linearGradient id="score-area" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stop-color="rgba(59, 130, 246, 0.45)"></stop>
                        <stop offset="100%" stop-color="rgba(59, 130, 246, 0.02)"></stop>
                    </linearGradient>
                </defs>
                ${gridLines}
                <polygon points="${areaPoints}" fill="url(#score-area)"></polygon>
                <polyline
                    points="${polylinePoints}"
                    fill="none"
                    stroke="#60a5fa"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></polyline>
                ${pointMarkers}
            </svg>
        </div>
    `;

    renderHTML('#score-trend', trendHTML);
}

function renderCategories(data: ProfileData): void {
    const categoriesHTML = data.categories
        .map((category) => {
            const barWidth = getNumber(category.accuracy);
            const averagePoints = getNumber(category.averagePoints);
            const sessionsSeen = getNumber(category.sessionsSeen);

            return `
                <article class="grid gap-3">
                    <div class="flex items-end justify-between gap-4">
                        <div>
                            <p class="text-lg text-white">${category.categoryName}</p>
                            <p class="text-sm text-gray-400">${sessionsSeen} sessions · ${averagePoints.toFixed(1)} avg points</p>
                        </div>
                        <span class="text-lg text-gray-200">${barWidth}%</span>
                    </div>
                    <div class="h-3 overflow-hidden rounded-full bg-gray-700">
                        <div class="h-full rounded-full bg-blue-500" style="width: ${barWidth}%"></div>
                    </div>
                    <p class="text-xs uppercase tracking-[0.08em] text-gray-500">Accuracy</p>
                </article>
            `;
        })
        .join('');

    renderHTML('#profile-categories', categoriesHTML);
}

function renderHistory(data: ProfileData): void {
    const historyRowsHTML = data.sessions
        .slice()
        .reverse()
        .map(
            (session) => `
                <div class="grid grid-cols-2 gap-3 border-b border-gray-800 py-4 text-gray-300 md:grid-cols-4">
                    <span>#${session.id}</span>
                    <span>${session.totalPoints}p</span>
                    <span>${session.questionsAnswered}/${session.totalQuestions}</span>
                    <span>${session.accuracy}%</span>
                </div>
            `,
        )
        .join('');

    const historyHTML = `
        <div class="grid grid-cols-2 gap-3 border-b border-gray-700 pb-3 text-xs uppercase tracking-[0.08em] text-gray-400 md:grid-cols-4">
            <span>Session</span>
            <span>Points</span>
            <span>Answered</span>
            <span>Accuracy</span>
        </div>
        ${historyRowsHTML}
    `;

    renderHTML('#profile-history', historyHTML);
}

function renderEmptyState(): void {
    renderHTML(
        '#profile-history',
        `<article class="rounded-md border bg-gray-900 p-4 text-gray-300">No profile stats found for this user.</article>`,
    );
}

// =========
// App start
// =========

async function initProfilePage(): Promise<void> {
    renderHeaderFallback();

    const userId = getCurrentUserId();
    profileData = await fetchProfileData(userId);

    if (!profileData) {
        renderEmptyState();
        return;
    }

    renderHeader(profileData);
    renderMetrics(profileData);
    renderScoreTrend(profileData);
    renderCategories(profileData);
    renderHistory(profileData);
}

document.addEventListener('DOMContentLoaded', () => {
    void initProfilePage();
});
