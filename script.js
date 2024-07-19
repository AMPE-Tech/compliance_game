document.addEventListener("DOMContentLoaded", () => {
    const correctGroups = {
        "fraude": ["prevenção", "investigação"],
        "ética": ["conduta", "integridade"],
        "segurança": ["dados", "proteção"],
        "auditoria": ["transparência", "controle"]
    };

    let selectedWords = [];
    let attempts = 0;
    let correctCount = 0;
    let errorCount = 0;
    const gameBoard = document.getElementById("game-board");
    const messageDiv = document.getElementById("message");
    const attemptsSpan = document.getElementById("attempts");
    const correctSpan = document.getElementById("correct");
    const errorsSpan = document.getElementById("errors");
    const startButton = document.getElementById("start-button");

    startButton.addEventListener("click", startGame);

    function startGame() {
        startButton.style.display = 'none';
        gameBoard.style.display = 'grid';
        createButtons();
    }

    function createButtons() {
        const words = [];
        Object.entries(correctGroups).forEach(([key, values]) => {
            words.push(key, ...values);
        });

        words.sort(() => Math.random() - 0.5);

        words.forEach(word => createButton(word));
    }

    function createButton(word) {
        const button = document.createElement("button");
        button.textContent = word;
        button.addEventListener("click", () => onButtonClick(word, button));
        gameBoard.appendChild(button);
    }

    function onButtonClick(word, button) {
        if (button.classList.contains("correct")) return;

        if (selectedWords.length < 3) {
            button.classList.add("selected");
            selectedWords.push({ word, button });
        }

        if (selectedWords.length === 3) {
            checkGroup();
        }
    }

    function checkGroup() {
        attempts++;
        attemptsSpan.textContent = attempts;

        const [first, second, third] = selectedWords;

        const isCorrectGroup = Object.entries(correctGroups).some(([key, values]) => 
            (first.word === key && values.includes(second.word) && values.includes(third.word)) ||
            (second.word === key && values.includes(first.word) && values.includes(third.word)) ||
            (third.word === key && values.includes(first.word) && values.includes(second.word))
        );

        if (isCorrectGroup) {
            correctCount++;
            correctSpan.textContent = correctCount;
            markCorrect([first, second, third]);
            showMessage("Correto!", "success");
            checkGameCompletion();
        } else {
            errorCount++;
            errorsSpan.textContent = errorCount;
            markIncorrect([first, second, third]);
            showMessage("Incorreto. Tente novamente.", "error");
            setTimeout(resetSelectedWords, 1000);
        }
        selectedWords = [];
    }

    function markCorrect(buttons) {
        buttons.forEach(({ button }) => {
            button.classList.add("correct");
            button.classList.remove("selected");
            button.disabled = true;
        });
    }

    function markIncorrect(buttons) {
        buttons.forEach(({ button }) => {
            button.classList.add("incorrect");
        });
    }

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
    }

    function resetSelectedWords() {
        selectedWords.forEach(({ button }) => button.classList.remove("incorrect", "selected"));
    }

    function checkGameCompletion() {
        if (correctCount === Object.keys(correctGroups).length * 2) {
            gameBoard.style.display = 'none';
            let finalMessage = "Finalizado! ";
            if (errorCount === 0) {
                finalMessage += "Excelente!";
            } else if (errorCount <= 5) {
                finalMessage += "Bom!";
            } else if (errorCount <= 10) {
                finalMessage += "Regular. Tente novamente.";
            } else {
                finalMessage += "Ruim. Passe no RH.";
            }
            showMessage(finalMessage, "success");
        }
    }
});
