import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface Handout {
    name: string;
    handout: string;
}
document.addEventListener('DOMContentLoaded', async () => {
    const title = document.getElementById('handout-title') as HTMLElement;
    const handout = document.getElementById('handout-content') as HTMLElement;
    const startQuizLink = document.querySelector('#start-quiz-link') as HTMLAnchorElement;

    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get('category');

    const response = await fetch('http://localhost:3000/api/categories/get');
    const json = await response.json();
    const categories: Handout[] = json.data;
    const category = categories.find((c: Handout) => c.name === selectedCategory);

    console.debug('🪳 response:', categories);

    if (!selectedCategory || startQuizLink) {
        console.debug('🪳 Uppdaterar starta quiz länk');
        changeQuizLink(selectedCategory, startQuizLink);
    }

    if (category) {
        title.innerText = category.name;
        console.debug('🪳 RAW markdown start');
        console.debug('🪳 category.handout:', category.handout);
        console.debug('🪳 RAW markdown end');

        console.debug('🪳 Awaiting promise from marked.parse ...');
        const html = (await marked.parse(category.handout)) as string;

        console.debug('🪳 PARSED HTML:', html);
        // console.debug('🪳 html:', html);
        handout.innerHTML = html;
        handout.querySelectorAll('pre code').forEach((block) => {
            console.debug('🪳 Code blocks:', block);
            hljs.highlightElement(block as HTMLElement);
        });
    }
    console.log('category from url', selectedCategory);
});

function changeQuizLink(category: string | null, startQuizLink: HTMLAnchorElement): void {
    console.debug('changeQuizLink()');

    console.debug('🪳 category:', category);
    console.debug('🪳 startQuizLink:', startQuizLink);

    if (!category || !startQuizLink) {
        console.error('Hittar inte category eller startQuizLink');
    }
    if (startQuizLink && category) {
        startQuizLink.href = `../pages/quizSession/quizSession.html?category=${encodeURIComponent(category)}`;
        console.debug('🪳 startQuizLink:', startQuizLink);
        // console.debug('🪳 startQuizLink.href:', startQuizLink.href);
    } else if (startQuizLink) {
        startQuizLink.href = '../pages/quizSession/quizSession.html';
    }
}
