import type { CodeQuestion, Rating } from '@shared/types.js';

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
    renderRatingStars(filteredQuestions);
});

function renderAllQuestions(questionData: CodeQuestion[]): void {
    const questionContainer = document.querySelector('#question-container');

    if (questionContainer) {
        const questionsHTML = questionData
            /* make cards */
            .map(
                (q, index) => `
                <div class="mb-6">
                    <!-- <div>${q.categoryName}</div> -->
                    <div class="text-center mt-2 p-4">${q.codeQuestion}</div>
                    <div data-editor-index="${index}"></div>
                    <div rating-stars-index="${index}"></div
                </div>
        `,
            )
            .join(''); // Annars blir map till array och inte string

        // Då kan inte renderas
        questionContainer.innerHTML = `
                <div class="w-full h-full  border my-2 rounded-xl mb-4">
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

/* interface Rating {
    userId: number;
    questionId: number;
    rating: number;
} */

function renderRatingStars(questions: CodeQuestion[]): void {
    console.groupCollapsed(`renderRatingStars()`);

    console.log('renderRatingStars(questions):', questions);

    const token = localStorage.getItem('token');
    console.log('token', token);

    const userObj = localStorage.getItem('user');
    console.log('user', userObj);

    const user = userObj ? JSON.parse(userObj) : null;
    console.log('user:', user);

    const isLoggedIn = !!token && !!user; // hur skillnad token && user?
    if (!isLoggedIn) console.error('Användare inte inloggad. Visar ej ratings');

    const userRatings = new Map<number, number>();

    if (isLoggedIn) {
        fetchUserRatings(
            user.id,
            questions.map((q) => q.id),
        ).then((ratings) => {
            ratings.forEach((r) => userRatings.set(r.sqlQuestionId, r.userRating));

            // Update stars with rating
            updateAllStarDisplays(questions, userRatings);
        });
    }

    questions.forEach((question, index) => {
        const ratingStarsContainer = document.querySelector(`[rating-stars-index="${index}"]`);
        if (ratingStarsContainer) {
            ratingStarsContainer.setAttribute('data-question-id', question.id.toString());

            ratingStarsContainer.innerHTML = `
                <div class="flex justify-center gap-2">
                    ${[1, 2, 3, 4, 5]
                        .map(
                            (rating) => `
                        <div
                            data-rating="${rating}"
                            class="cursor-pointer hover:scale-110 transition-transform ${!isLoggedIn ? 'opacity-50 pointer-events-none' : ''}"
                            role="button"
                            aria-label="Rate ${rating} stars"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                        </div>
                    `,
                        )
                        .join('')}
                </div>
                ${!isLoggedIn ? '<p class="text-xs text-gray-400 text-center mt-1">Logga in för att betygsätta</p>' : ''}
            `;

            // Clickhanterare om inloggad
            if (isLoggedIn) {
                const stars = ratingStarsContainer.querySelectorAll('[data-rating]');
                stars.forEach((star) => {
                    star.addEventListener('click', async (e) => {
                        const rating = (e.currentTarget as HTMLElement).getAttribute('data-rating');
                        const questionId = parseInt(ratingStarsContainer.getAttribute('data-question-id') || '0');

                        if (!rating || !questionId) return;

                        const ratingValue = parseInt(rating);

                        try {
                            const response = await fetch('http://localhost:3000/api/ratings', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                    userId: user.id,
                                    questionId: questionId,
                                    rating: ratingValue,
                                }),
                            });

                            if (!response.ok) {
                                throw new Error('Failed to save rating');
                            }

                            // Update star colors
                            colorStars(ratingStarsContainer, ratingValue);

                            console.log(`Rated question ${questionId} with ${ratingValue} stars`);
                        } catch (error) {
                            console.error('Error saving rating:', error);
                            alert(error);
                        }
                    });
                });
            }
        }
    });

    console.groupEnd();
}



function colorStars(container: Element, userRating: number) {
    const stars = container.querySelectorAll('[data-rating]');
    stars.forEach((star) => {
        const starRating = parseInt((star as HTMLElement).getAttribute('data-rating') || '0');
        const svg = star.querySelector('svg');
        if (svg) {
            svg.setAttribute('fill', starRating <= userRating ? 'yellow' : 'none');
        }
    });
}

// Uppdatera fetchade stjärnor
function updateAllStarDisplays(questions: CodeQuestion[], userRatings: Map<number, number>) {
    questions.forEach((question, index) => {
        const container = document.querySelector(`[rating-stars-index="${index}"]`);
        if (container) {
            const rating = userRatings.get(question.id) || 0;
            colorStars(container, rating);
        }
    });
}

async function fetchUserRatings(userId: number, questionIds: number[]): Promise<Rating[]> {
    console.groupCollapsed(`fetchUserRatings(userId, questionIds)`);
    try {
        console.log('fetchUserRatings()');
        const token = localStorage.getItem('token');

        const queryParams = new URLSearchParams();
        queryParams.append('userId', userId.toString())
        questionIds.forEach((id) => queryParams.append('questionId', id.toString()));

        const response = await fetch(`http://localhost:3000/api/ratings/?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error(`Failed to get ratings : HTTP error! status: ${response.status}`);

        const result = await response.json();
        console.log('result:', result);
        return result.data || [];
    } catch (error: any) {
        console.error('Error:', error);
        return [];
    } finally {
        console.groupEnd();
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
