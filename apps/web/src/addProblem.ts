addEventListener('DOMContentLoaded', (event) => {
    const form = document.querySelector('form');

    form?.addEventListener('submit', async (event) => {
        event.preventDefault(); // Annars ränsas innehållet

        const codeTitleInput = document.querySelector<HTMLInputElement>('#code-title');
        const codeDescriptionInput = document.querySelector<HTMLInputElement>('#code-description');
        const codeQuestionInput = document.querySelector<HTMLInputElement>('#code-question');
        const codeAnswerInput = document.querySelector<HTMLInputElement>('#code-answer');

        if (!codeQuestionInput || !codeAnswerInput || !codeTitleInput || !codeDescriptionInput) {
            console.error(`‼️ Element för (titel, beskrivning, fråga, svar) finns inte`);
        }

        const codeTitle = codeTitleInput?.value;
        const codeDescription = codeDescriptionInput?.value;
        const codeQuestion = codeQuestionInput?.value;
        const codeAnswer = codeAnswerInput?.value;
        console.table({ codeQuestion, codeAnswer });

        try {
            const response = await fetch('http://localhost:3000/api/codeQuestions/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codeTitle,
                    codeDescription,
                    codeQuestion,
                    codeAnswer,
                }),
            });

            const result = await response.json();
            console.log('result:', result);
            console.log('Kod-problem tillaggt!');
        } catch (error) {
            console.error(`‼️ Error: ${error}`);
        }
    });
});
