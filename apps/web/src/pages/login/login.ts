/* FORM SUBMIT to login user */
addEventListener('DOMContentLoaded', (event) => {
    const form = document.querySelector('form');

    form?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const usernameInput = document.querySelector<HTMLInputElement>('input#username');
        console.log('usernameInput:', usernameInput);

        const passwordInput = document.querySelector<HTMLInputElement>('input#password');
        console.log(`password: ${passwordInput}`);

        const username = usernameInput?.value;
        const password = passwordInput?.value;

        console.table({
            username: username,
            password: password,
        });

        if (!username || !password) {
            console.error(`‼️ email, username or password is missing`);
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
