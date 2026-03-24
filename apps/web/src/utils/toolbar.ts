export async function initToolbar() {
    console.group(`Toolbar Init()`);
    try {
        const toolbar = document.querySelector('#toolbar');
        const baseUrl = window.location.origin;

        console.info('baseUrl:', baseUrl);

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
                <div class="justify-self-end">
                    <button id="login-btn" class="text-md w-24 rounded-md bg-blue-500 font-semibold">
                        <a id="login-btn-anchor" href="${baseUrl}/src/register.html">Register</a>
                    </button>
                    <button id="profile-btn" class="text-md w-14 rounded-md bg-blue-500 font-semibold">
                        <a id="profile-btn-anchor" href="${baseUrl}/src/pages/profile/profile.html">Profil</a>
                    </button>
                </div>
            `;
        }
        console.info('await isLoggedIn()');

        const isLoggedIn: boolean = await isUserLoggedIn();
        console.debug('🪳 isLoggedIn() result:', isLoggedIn);
        if (isLoggedIn) {
            console.warn(`Användare är inloggad`);
            await renderLogout(baseUrl);
        } else {
            console.warn(`Användare är inte inloggad!`);
            await renderLogin(baseUrl);
        }
    } finally {
        console.groupEnd();
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
    console.log('token:', token);
    console.log('userJson:', userJson);

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
        console.debug('Omdirigerar till login?');
        //? window.location.href = 'src/pages/login/login.html';
        return true;
    } catch (error: any) {
        console.error('Error vid verifiering:', error);
        return false;
    } finally {
        // console.groupEnd();
    }
}

// IF isLogggedIn
async function renderLogout(baseUrl: string) {
    console.group(`renderLogout()`);
    try {
        const loginBtn = document.querySelector('#login-btn') as HTMLButtonElement;
        const loginBtnAnchor = document.querySelector('#login-btn-anchor') as HTMLAnchorElement;
        const profileBtn = document.querySelector('#profile-btn') as HTMLButtonElement;
        const profileBtnAnchor = document.querySelector('#profile-btn-anchor') as HTMLAnchorElement;

        if (!loginBtn || !loginBtnAnchor) {
            console.error('loginBtn', loginBtn);
            console.error('loginAnchor', loginBtnAnchor);
        }
        if (!profileBtn || !profileBtnAnchor) {
            console.error('profileBtn', profileBtn);
            console.error('profileAnchor', profileBtnAnchor);
        }

        if (loginBtn) {
            // Color change
            loginBtn.classList.remove('bg-blue-500');
            loginBtn.classList.add('bg-red-500');
            // onClick function
            loginBtn.onclick = logout; // utan () ska bara anropas när knappen clickas
        }
        if (loginBtnAnchor) {
            // profileBtnAnchor.href = `${baseUrl}/src/pages/re`
            loginBtnAnchor.textContent = 'Logout';
            loginBtnAnchor.href = `${baseUrl}/src/pages/register/register.html`;
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        console.groupEnd();
    }
}

// IF isn't logged in
async function renderLogin(baseUrl: string) {
    console.log(`renderLogin()`);
    const loginBtn = document.querySelector('#login-btn') as HTMLButtonElement;
    const loginBtnAnchor = document.querySelector('#login-btn-anchor') as HTMLAnchorElement;

    const isOnLogin: boolean = document.URL.includes('login.html') || false;
    console.debug('🪳 isOnLogin:', isOnLogin);

    // IF on login.html render register btn
    if (loginBtn) {
        // Color change
        loginBtn.classList.remove('bg-red-500');
        loginBtn.classList.add('bg-blue-500');

        // onClick function
        loginBtn.onclick = null; // utan () ska bara anropas när knappen clickas
    }
    if (loginBtnAnchor) {
        if (isOnLogin) {
            console.debug('🪳 Är på login.html --> då visa register');
            loginBtnAnchor.textContent = 'Register';
            loginBtnAnchor.href = `${baseUrl}/src/pages/register/register.html`;
        } else {
            console.debug('Är inte på login.html --> då visa login');
            loginBtnAnchor.textContent = 'Login';
            loginBtnAnchor.href = `${baseUrl}/src/pages/login/login.html`;
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
}
