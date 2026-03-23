/* FORM SUBMIT to login user */
addEventListener('DOMContentLoaded', (event) => {
    const form = document.querySelector('form');
    const usernameInput = document.querySelector<HTMLInputElement>('input#username');
    const passwordInput = document.querySelector<HTMLInputElement>('input#password');
    const feedbackEl = document.querySelector<HTMLElement>('#feedback');

    form?.addEventListener('submit', async (event) => {
        event.preventDefault();

        console.log('usernameInput:', usernameInput);
        console.log(`password: ${passwordInput}`);

        const username = usernameInput?.value;
        const password = passwordInput?.value;

        console.table({
            username: username,
            password: password,
        });

        // Ta bort tidigare feedback
        if (feedbackEl) {
            feedbackEl.innerHTML = '';
            // Återställ styling
            feedbackEl.className = '';
        }

        if (!username || !password) {
            console.error(`‼️ email, username or password is missing`);
            showFeedback(feedbackEl as HTMLElement, 'Användarnamn och lösenord krävs', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            /* if (!response.ok) {
                throw new Error('Registrering misslyckades');
            } */

            const result = await response.json();

            if (response.status === 401) {
                showFeedback(feedbackEl as HTMLElement, 'Fel användarnamn eller lösenord', 'error');
                return;
            }

            console.log('Login SUCCESS', JSON.stringify(result, null, 2));
            console.info(`Sparar user och token i localStorage`);
            // Spara användare och token i localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            // Omdirigera till hem
            window.location.href = '../../../index.html';
        } catch (error) {
            console.error('Error:', error);
        }
        console.log(`All input OK`);
    });
});

function showFeedback(element: HTMLElement, message: string, type: 'success' | 'error') {
    element.innerHTML = message;

    if (type === 'success') {
        element.className = 'text-center text-sm text-green-400 bg-green-900/50 p-2 rounded';
    } else {
        element.className = 'text-center text-sm text-red-400 bg-red-900/50 p-2 rounded';
    }

    /* Borde feedback försvinna egentligen?
    if (type === 'error') {
        setTimeout(() => {
            if (element.innerHTML === message) {
                element.innerHTML = '';
                element.className = 'mt-4 text-center text-sm';
            }
        }, 3000);
    } */
}
