// =========
// Types
// =========

type UserProfile = {
    id: number;
    username: string;
    email: string;
};

type EditableField = 'username' | 'email' | 'password';

// =========
// State
// =========

const editableFields: EditableField[] = ['username', 'email', 'password'];

// =========
// Local helpers
// =========

async function removeAccount(): Promise<void> {
    console.log('Ta bort konto...');
    const token = getToken();
    const response = await fetch('http://localhost:3000/api/users/profile/me', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const result = await response.json();
    console.log('result:', result);

    console.log('Omdirigerar till register');
    window.location.href = '/src/pages/register/register.html';
}

function getElement<T extends HTMLElement>(selector: string): T | null {
    return document.querySelector(selector);
}

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

function getToken(): string | null {
    return localStorage.getItem('token');
}

function showStatus(message: string, type: 'success' | 'error'): void {
    const statusEl = getElement<HTMLDivElement>('#profile-status');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className =
        type === 'success'
            ? 'mt-5 rounded border border-green-500 bg-green-950 p-3 text-sm text-green-300'
            : 'mt-5 rounded border border-red-500 bg-red-950 p-3 text-sm text-red-300';
}

function getFieldInput(field: EditableField): HTMLInputElement | null {
    return getElement<HTMLInputElement>(`#${field}`);
}

function getFieldDisplay(field: EditableField): HTMLElement | null {
    return getElement<HTMLElement>(`#${field}-display`);
}

function getFieldPanel(field: EditableField): HTMLElement | null {
    return document.querySelector<HTMLElement>(`[data-edit-panel="${field}"]`);
}

function getFieldCard(field: EditableField): HTMLElement | null {
    return document.querySelector<HTMLElement>(`[data-field-card="${field}"]`);
}

function setFieldEditing(field: EditableField, isEditing: boolean): void {
    const panel = getFieldPanel(field);
    const card = getFieldCard(field);
    const button = document.querySelector<HTMLButtonElement>(`[data-edit-button="${field}"]`);

    if (!panel || !card || !button) return;

    panel.classList.toggle('hidden', !isEditing);
    card.classList.toggle('border-blue-500', isEditing);
    card.classList.toggle('bg-gray-900', isEditing);
    button.textContent = isEditing ? 'Editing' : 'Edit';
    button.classList.toggle('border-blue-500', isEditing);
    button.classList.toggle('text-blue-300', isEditing);

    if (isEditing) {
        console.debug('🪳 Focus isEditing...');
        getFieldInput(field)?.focus();
    }
}

function resetField(field: EditableField): void {
    const input = getFieldInput(field);
    if (!input) return;

    if (field === 'password') {
        input.value = '';
    }

    setFieldEditing(field, false);
}

function maskPassword(password: string): string {
    return password.length > 0 ? '•'.repeat(Math.min(password.length, 12)) : '••••••••';
}

function updateFieldDisplays(profile: { username: string; email: string; password?: string }): void {
    const usernameDisplay = getFieldDisplay('username');
    const emailDisplay = getFieldDisplay('email');
    const passwordDisplay = getFieldDisplay('password');

    if (usernameDisplay) usernameDisplay.textContent = profile.username || 'No username set';
    if (emailDisplay) emailDisplay.textContent = profile.email || 'No email set';
    if (passwordDisplay) passwordDisplay.textContent = profile.password ? maskPassword(profile.password) : '••••••••';
}

function setUpEditButtons(): void {
    editableFields.forEach((field) => {
        const editButton = document.querySelector<HTMLButtonElement>(`[data-edit-button="${field}"]`);
        const cancelButton = document.querySelector<HTMLButtonElement>(`[data-cancel-button="${field}"]`);

        editButton?.addEventListener('click', () => {
            setFieldEditing(field, true);
        });

        cancelButton?.addEventListener('click', () => {
            resetField(field);
        });
    });
}

// =========
// API
// =========

async function fetchUserProfile(): Promise<UserProfile | null> {
    try {
        const token = getToken();
        const response = await fetch(`http://localhost:3000/api/users/profile/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const result = await response.json();
        return result.user ?? null;
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return null;
    }
}

async function updateUserProfile(profile: { username: string; email: string; password: string }) {
    const token = getToken();
    const response = await fetch(`http://localhost:3000/api/users/profile/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Could not update profile');
    }

    return result.user as UserProfile;
}

// =========
// Render
// =========

function fillForm(profile: UserProfile): void {
    const usernameEl = getElement<HTMLInputElement>('#username');
    const emailEl = getElement<HTMLInputElement>('#email');
    const passwordEl = getElement<HTMLInputElement>('#password');

    if (!usernameEl || !emailEl || !passwordEl) return;

    usernameEl.value = profile.username;
    emailEl.value = profile.email;
    passwordEl.value = '';

    updateFieldDisplays({
        username: profile.username,
        email: profile.email,
    });
}

async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const usernameEl = getElement<HTMLInputElement>('#username');
    const emailEl = getElement<HTMLInputElement>('#email');
    const passwordEl = getElement<HTMLInputElement>('#password');

    if (!usernameEl || !emailEl || !passwordEl) return;

    try {
        const updatedUser = await updateUserProfile({
            username: usernameEl.value.trim(),
            email: emailEl.value.trim(),
            password: passwordEl.value,
        });

        localStorage.setItem(
            'user',
            JSON.stringify({
                ...(JSON.parse(localStorage.getItem('user') || '{}') as object),
                id: updatedUser.id,
                username: updatedUser.username,
            }),
        );

        updateFieldDisplays({
            username: updatedUser.username,
            email: updatedUser.email,
        });

        passwordEl.value = '';
        editableFields.forEach((field) => setFieldEditing(field, false));
        showStatus('Profile updated.', 'success');
        window.location.href = '../../../index.html';
    } catch (error: any) {
        showStatus(error.message, 'error');
    }
}

// =========
// App start
// =========

async function initEditProfilePage(): Promise<void> {
    const form = getElement<HTMLFormElement>('#edit-profile-form');
    const token = getToken();

    if (!token) {
        showStatus('You must be logged in to update your profile.', 'error');
        return;
    }

    if (form) {
        form.addEventListener('submit', (event) => {
            console.debug('🪳 Form submit');
            void handleSubmit(event);
        });
    }

    setUpEditButtons();

    const profile = await fetchUserProfile();
    if (!profile) {
        showStatus('Could not fetch user profile.', 'error');
        return;
    }

    fillForm(profile);
}

document.addEventListener('DOMContentLoaded', () => {
    void initEditProfilePage();

    const removeAccountBtn = document.querySelector('#remove-profile-btn');
    if (removeAccountBtn) {
        removeAccountBtn.addEventListener('click', removeAccount);
    }
    // Onclick knapp
    removeAccount;
});
