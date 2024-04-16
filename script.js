const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const scoreElement = document.getElementById('score');
let score = 0;
let maxPossibleScore = 0;
let incorrectAnswersRemaining = 4;

let gameSettings = {
    currentDifficulty: 'easy',
    operations: {
        '+': { enabled: true, min: 1, max: 10 },
        '-': { enabled: true, min: 1, max: 10 },
        '×': { enabled: false, min: 1, max: 10 },
        '÷': { enabled: false, min: 1, max: 10 }
    },
    customSettings: {
        '+': { enabled: true, min: 1, max: 10 },
        '-': { enabled: true, min: 1, max: 10 },
        '×': { enabled: false, min: 1, max: 10 },
        '÷': { enabled: false, min: 1, max: 10 }
    }
};

//let operationSettings = {}; // Holds min and max for each operation

function startGame() {
  // Reset game state
  score = 0;
  scoreElement.innerText = 'Score: 0';

  // Ensure at least one operation is selected
  //if (Object.keys(operationSettings).length === 0) {
  //  alert('Please select at least one operation.');
  //  return;
  //}

  generateQuestion();
}

function generateQuestion() {
    // Filter out disabled operations and select a random one from those enabled
    const enabledOperations = Object.keys(gameSettings.operations).filter(op => gameSettings.operations[op].enabled);
    const operation = enabledOperations[Math.floor(Math.random() * enabledOperations.length)];

    // Get the min and max range for the selected operation
    const min = gameSettings.operations[operation].min;
    const max = gameSettings.operations[operation].max;

    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;

    let correctAnswer;
    switch (operation) {
        case '+':
            correctAnswer = num1 + num2;
            break;
        case '-':
		    // Ensure num1 is always greater than or equal to num2 for subtraction
			if (num1 < num2) {
			  [num1, num2] = [num2, num1]; // Swap num1 and num2 if num1 is smaller than num2
			}
            correctAnswer = num1 - num2;
            break;
        case '×':
            correctAnswer = num1 * num2;
            break;
        case '÷':
			// Ensuring integer division
		    num2 = num1 !== 0 ? num2 : 2; // Avoid division by zero -- default to 2 instead
		    correctAnswer = Math.floor(num1 / num2); // Ensure result is an integer
		    num1 = correctAnswer * num2; // Adjust so division is clean
            break;
        default:
            correctAnswer = 0;
			alert("Error! Unknown mathematical operation requested.");
    }

    const question = `What is ${num1} ${operation} ${num2}?`;
	questionElement.innerText = question;
    console.log(question); // Output the question to the console for now
  
  maxPossibleScore += 4;  

  generateAnswers(correctAnswer);
}

function generateAnswers(correctAnswer) {
    const answersElement = document.getElementById('answers'); // Assuming an element to display answers
    answersElement.innerHTML = ''; // Clear previous answers

    const correctPosition = Math.floor(Math.random() * 5); // Position for the correct answer among 5 possibilities
    let answers = new Set([correctAnswer]); // Ensure all answers are unique

    for (let i = 0; i < 5; i++) {
        const button = document.createElement('button');
        if (i === correctPosition) {
            button.innerText = correctAnswer;
        } else {
            let incorrectAnswer;
            do {
				if ( correctAnswer < 10 ) {
					incorrectAnswer = correctAnswer + Math.floor((Math.random() * 10 )) - 5;
				}
				else {
					const offset = Math.floor(Math.random() * (correctAnswer * 0.15 + 1)); // Max 15% of correctAnswer
					incorrectAnswer = correctAnswer + (Math.random() < 0.5 ? -offset : offset); // Adjust up or down
                }
				// Ensure incorrect answers are positive
				if (incorrectAnswer < 0) incorrectAnswer = Math.abs(incorrectAnswer);
			} while (answers.has(incorrectAnswer));
            button.innerText = incorrectAnswer;
            answers.add(incorrectAnswer);
        }
        button.addEventListener('click', function() {
            if (parseInt(this.innerText) === correctAnswer) {
                console.log('Correct!');
		// Increment score for correct answer
		score += incorrectAnswersRemaining;
		scoreElement.innerText = `Score: ${score}`;
                generateQuestion(); // Generate next question on correct answer
            } else {
                this.remove(); // Remove incorrect answer from view
            }
        });
        answersElement.appendChild(button);
    }
}



/**********************
 * CONTROL PANEL CODE *
 **********************/

function updateSettings(difficulty) {
    if (difficulty !== 'custom') {
        gameSettings.currentDifficulty = difficulty;
        switch (difficulty) {
            case "easy":
                updateOperationSettings(true, true, false, false, 1, 10, 1, 10);
                break;
            case "medium":
                updateOperationSettings(true, true, true, true, 1, 10, 1, 10);
                break;
            case "hard":
                updateOperationSettings(true, true, true, true, 1, 99, 1, 12);
                break;
        }
    } else {
        //restoreCustomSettings();
    }
    //updateFormUI();
}

function updateOperationSettings(add, subtract, multiply, divide, minAddSub, maxAddSub, minMulDiv, maxMulDiv) {
    gameSettings.operations['+'].enabled = add;
    gameSettings.operations['-'].enabled = subtract;
    gameSettings.operations['×'].enabled = multiply;
    gameSettings.operations['÷'].enabled = divide;
    gameSettings.operations['+'].min = minAddSub;
    gameSettings.operations['-'].min = minAddSub;
    gameSettings.operations['×'].min = minMulDiv;
    gameSettings.operations['÷'].min = minMulDiv;
    gameSettings.operations['+'].max = maxAddSub;
    gameSettings.operations['-'].max = maxAddSub;
    gameSettings.operations['×'].max = maxMulDiv;
    gameSettings.operations['÷'].max = maxMulDiv;
}

/*
function restoreCustomSettings() {
    for (const op in gameSettings.customSettings) {
        gameSettings.operations[op] = {...gameSettings.customSettings[op]};
    }
}

function updateFormUI() {
    for (const op in gameSettings.operations) {
        const operation = gameSettings.operations[op];
        document.getElementById(op).checked = operation.enabled;
        document.querySelector(`.${op}-min`).value = operation.min;
        document.querySelector(`.${op}-max`).value = operation.max;
    }
}
*/

document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
    radio.addEventListener('change', function() {
		const customSettings = document.getElementById('custom-settings');
        updateSettings(this.value);
        if (this.value === 'custom') {
            customSettings.style.display = 'block';
        } else {
            customSettings.style.display = 'none';
        }
    });
});



/***********************
 * INITIALIZE THE GAME *
 ***********************/

startGame(); // Initialize the first question
