document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplayQuestions();
});

async function loadAndDisplayQuestions() {
    try {
        const data = await window.electronAPI.loadQuestions();
        displayQuestions(JSON.parse(data));
    } catch (err) {
        console.error("Error loading questions from JSON file:", err.message);
    }
}

function displayQuestions(questions) {
    const container = document.getElementById('question-container');
    questions.forEach(question => {
        const questionBlock = document.createElement('div');
        questionBlock.className = 'question';

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = question.question;
        questionBlock.appendChild(questionTitle);

        const answerInput = document.createElement('textarea');
        answerInput.id = 'answer-' + question.id;
        questionBlock.appendChild(answerInput);

        container.appendChild(questionBlock);
    });
}

// Setup IPC listeners for save actions
setupSaveListeners();

function setupSaveListeners() {
    window.electronAPI.on('save-current-file', async () => {
        const answers = collectAnswers();
        try {
            const filePath = await window.electronAPI.showSaveDialog();
            if (filePath) {
                await window.electronAPI.saveAnswers(filePath, answers);
                console.log("Data saved successfully!");
            }
        } catch (err) {
            console.error("Failed to save data:", err.message);
        }
    });

    window.electronAPI.on('save-new-file', async () => {
        const answers = collectAnswers();
        try {
            const filePath = await window.electronAPI.showSaveDialog();
            if (filePath) {
                await window.electronAPI.saveAnswers(filePath, answers);
                console.log("Data saved successfully!");
            }
        } catch (err) {
            console.error("Failed to save data:", err.message);
        }
    });
}

function collectAnswers() {
    const answers = [];
    document.querySelectorAll('.question textarea').forEach((textarea, index) => {
        answers.push({
            questionId: index + 1,
            answer: textarea.value
        });
    });
    return answers;
}

