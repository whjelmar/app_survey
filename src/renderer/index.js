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

let simpleMDEInstances = {};

function displayQuestions(questions) {
    const container = document.getElementById('question-container');
    questions.forEach(question => {
        const questionBlock = document.createElement('div');
        questionBlock.className = 'question';

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = question.question;
        questionTitle.classList.add('block', 'mb-2', 'text-sm', 'font-medium' ,'text-gray-900', 'dark:text-white');
        questionBlock.appendChild(questionTitle);
        
        const answerInput = document.createElement('textarea');
        answerInput.id = 'answer-' + question.id;
        answerInput.classList.add('block', 'p-2.5', 'w-full', 'text-sm', 'text-gray-900', 'bg-gray-50', 
            'rounded-lg', 'border', 'border-gray-300', 'focus:ring-blue-500', 
            'focus:border-blue-500', 'dark:bg-gray-700', 'dark:border-gray-600',
            'dark:placeholder-gray-400', 'dark:text-white', 'dark:focus:ring-blue-500' ,
            'dark:focus:border-blue-500');
        questionBlock.appendChild(answerInput);
        container.appendChild(questionBlock);

        // Initialize SimpleMDE on this textarea and store the instance
        simpleMDEInstances[question.id] = new SimpleMDE({ element: answerInput });
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
    Object.keys(simpleMDEInstances).forEach(questionId => {
        const editor = simpleMDEInstances[questionId];
        answers.push({
            questionId: questionId,
            answer: editor.value()  // This retrieves the Markdown content from the editor
        });
    });
    return answers;
}
