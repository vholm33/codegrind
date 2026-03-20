import type { CodeQuestion } from '../shared/types';

addEventListener('DOMContentLoaded', async () => {
    console.log('fetch allQuestions');
    //! const allQuestions: CodeQuestion[] = await getAllQuestions();
    const allQuestions: CodeQuestion[] = await getAllQuestions();
    console.log('allQuestions:', allQuestions);

    const categoriesAmount = categoryQuestionAmount(allQuestions);

    // UI
    setCategoryAmount(categoriesAmount);
});

//! async function getAllQuestions(): Promise<CodeQuestion> {
async function getAllQuestions(): Promise<CodeQuestion[]> {
    const response = await fetch('http://localhost:3000/api/codeQuestions/all');
    const json = await response.json();
    console.debug('response:', response);


    //! const allQuestions: CodeQuestion = json.data;
    const allQuestions: CodeQuestion[] = json.data;

    return allQuestions;
}

// function categoryQuestionAmount(allQuestions: CodeQuestion): number { tror det är ett objekt
function categoryQuestionAmount(allQuestions: CodeQuestion[]): Record<string, number> {
    console.log('typeof param:', typeof allQuestions);
    console.log('is array?', Array.isArray(allQuestions));

    const counts: Record<string, number> = {
        Konstanter: 0,
        Loopar: 0,
        TypeScript: 0,
        Metoder: 0,
    };

    allQuestions.forEach((q) => {
        counts[q.categoryName] = (counts[q.categoryName] || 0) + 1;
    });
    /*   allQuestions.forEach((q) => {
        switch (q.categoryName) {
            case 'Konstanter':
                console.log('konstanter hittad');
                konstanterQuiz.push(q.categoryName)
                break;
            case 'Loopar':
                console.log('loopar hittad');
                break;
            case 'TypeScript':
                console.log('typescript hittad');
                break;
            case 'Metoder':
                console.log('metoder hittad');
                break;
            default:
                console.error('Ingen kategori hittad');
                break;
        }
    }); */

    console.log('counts:', counts);

    return counts;
}

function setCategoryAmount(categoriesAmount: Record<string, number>): void {
    const konstanterSpan = document.querySelector('#konstanter-amount') as HTMLSpanElement;
    const tsSpan = document.querySelector('#ts-amount') as HTMLSpanElement;
    const looparSpan = document.querySelector('#loopar-amount') as HTMLSpanElement;
    const metoderSpan = document.querySelector('#metoder-amount') as HTMLSpanElement;

    if (!konstanterSpan || !tsSpan || !looparSpan || !metoderSpan) {
        console.error('element hittas inte');
    }

    // console.log('Element finns');

    // Destructure
    const { Konstanter, Loopar, TypeScript, Metoder} = categoriesAmount;

    konstanterSpan.innerHTML = Konstanter.toString();
    tsSpan.innerHTML = TypeScript.toString();
    looparSpan.innerHTML = Loopar.toString();
    metoderSpan.innerHTML = Metoder.toString();
}
