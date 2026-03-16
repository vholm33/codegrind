export async function initToolbar() {
    // console.groupCollapsed(`Toolbar Init()`);
    try {
        const toolbar = document.querySelector('#toolbar');
        const baseUrl = window.location.origin;

        // console.info('baseUrl:', baseUrl);

        if (toolbar) {
            toolbar.innerHTML = `
        <a href="${baseUrl}/">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
            </svg>
        </a>
        <h1 class="text-center text-2xl font-semibold">CodeGrind</h1>
        <!-- Register: om inte har inlogg  -->
        <button id="login-btn" class="text-md w-24 justify-self-end rounded-md bg-blue-500 font-semibold">
            <a id="login-btn-anchor" href="${baseUrl}/src/register.html">Register</a>
            <!-- <a href="${baseUrl}/src/register.html">Login</a> -->
            <!-- <a href="${baseUrl}/src/register.html">Logout</a> -->
        </button>
    `;
        }
        // console.info('await isLoggedIn()');

        const isLoggedIn: boolean = await isUserLoggedIn();

        if (isLoggedIn) {
            console.warn(`Användare är inloggad`);
            await renderLogout();
        } else {
            console.warn(`Användare är inte inloggad!`);
            await renderLogin(baseUrl);
        }
    } finally {
        // console.groupEnd();
    }
}

/* Conditional
IF not logged in    --> register/login
IF logged in        --> logout (red)
*/

async function isUserLoggedIn(): Promise<boolean> {
    // console.group(`isUserLoggedIn()`);

    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    // console.log('token:', token);
    // console.log('userJson:', userJson);

    if (!token || !userJson) {
        // console.groupEnd();
        return false;
    }

    try {
        const response = await fetch('http://localhost:3000/api/users/verify', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            console.error(`Ogiltig/utgången token. Ränsar localStorage.`);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.error('Användare inte inloggad!');
            return false;
        }
        console.info(`Användare är inloggad: ${result.user?.username}`);
        return true;
    } catch (error: any) {
        console.error('Error vid verifiering:', error);
        return false;
    } finally {
        // console.groupEnd();
    }
}

async function renderLogout() {
    console.group(`renderLogout()`);
    try {
        const loginBtn = document.querySelector('#login-btn') as HTMLButtonElement;
        const loginBtnAnchor = document.querySelector('#login-btn-anchor') as HTMLAnchorElement;

        if (!loginBtn || !loginBtnAnchor) {
            console.error('loginBtn', loginBtn);
            console.error('loginAnchor', loginBtnAnchor);
        }

        if (loginBtn) {
            // Color change
            loginBtn.classList.remove('bg-blue-500');
            loginBtn.classList.add('bg-red-500');

            // onClick function
            loginBtn.onclick = logout; // utan () ska bara anropas när knappen clickas
        }
        if (loginBtnAnchor) {
            loginBtnAnchor.textContent = 'Logout';
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        console.groupEnd();
    }
}

async function renderLogin(baseUrl: string) {
    // console.log(`renderLogin()`);
    const loginBtn = document.querySelector('#login-btn') as HTMLButtonElement;
    const loginBtnAnchor = document.querySelector('#login-btn-anchor') as HTMLAnchorElement;

    if (loginBtn) {
        // Color change
        loginBtn.classList.remove('bg-red-500');
        loginBtn.classList.add('bg-blue-500');

        // onClick function
        loginBtn.onclick = null; // utan () ska bara anropas när knappen clickas
    }
    if (loginBtnAnchor) {
        // console.log(`href SET to login.html`);
        loginBtnAnchor.textContent = 'Login';
        loginBtnAnchor.href = `${baseUrl}/src/login.html`;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
}
