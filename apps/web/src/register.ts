/* FORM SUBMIT to register user */
addEventListener('DOMContentLoaded', (event) => {
    const form = document.querySelector('form');

    form?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const emailInput = document.querySelector<HTMLInputElement>('input#email');
        console.log('emailInput:', emailInput);

        const usernameInput = document.querySelector<HTMLInputElement>('input#username');
        console.log('usernameInput:', usernameInput);

        const passwordInput = document.querySelector<HTMLInputElement>('input#password');
        console.log(`password: ${passwordInput}`);

        const email = emailInput?.value;
        const username = usernameInput?.value;
        const password = passwordInput?.value;

        console.table({
            email: email,
            username: username,
            password: password,
        });

        if (!email || !username || !password) {
            console.error(`‼️ email, username or password is missing`);
            return;
        }

        console.table({
            username: username,
            email: email,
            password: password,
        });

        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                }),
            });

            /* if (!response.ok) {
                throw new Error('Registrering misslyckades');
            } */

            const result = await response.json();
            console.log('Registrering lyckades:', result);

            //? Borde autofylla genom datan här?
            // Omdirigeras till login direkt efter registrering
            window.location.href = './login.html';
        } catch (error) {
            console.error('Error:', error);
        }
        console.log(`All input OK`);
    });
});
