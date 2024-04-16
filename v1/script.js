const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const scoreElement = document.getElementById('score');
let score = 0;
let incorrectAnswersRemaining = 5; // New variable to track remaining incorrect answers

let selectedOperations = ['+', '-', '×', '÷'];
let minNumber = 1;
let maxNumber = 10;

let operationSettings = {}; // Holds min and max for each operation

function startGame() {
  // Reset game state
  score = 0;
  scoreElement.innerText = 'Score: 0';

  // Collect and update operation settings
  operationSettings = {};
  document.querySelectorAll('.operation').forEach(opDiv => {
    const op = opDiv.dataset.operation;
    const isChecked = opDiv.querySelector('input[type="checkbox"]').checked;
    if (isChecked) {
      const min = parseInt(opDiv.querySelector('.min-number').value, 10);
      const max = parseInt(opDiv.querySelector('.max-number').value, 10);
      operationSettings[op] = { min, max };
    }
  });

  // Ensure at least one operation is selected
  if (Object.keys(operationSettings).length === 0) {
    alert('Please select at least one operation.');
    return;
  }

  generateQuestion();
}

function generateQuestion() {


  // Filter out unchecked operations
  const possibleOperations = Object.keys(operationSettings).filter(op => operationSettings[op] != null);
  const operation = possibleOperations[Math.floor(Math.random() * possibleOperations.length)];
  const settings = operationSettings[operation];
  
  // Generate question
  let num1 = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
  let num2 = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
 
  let correctAnswer;

	switch (operation) {
	  case '+':
		correctAnswer = num1 + num2;
		break;
	  case '-':
	    if ( num1 < num2 ) {
			// Swap num1 and num2 if num1 is smaller than num2
			[num1, num2] = [num2, num1];
		}
		correctAnswer = num1 - num2;
		break;
	  case '×':
		correctAnswer = num1 * num2;
		break;
	  case '÷':
		// Ensuring integer division
		num2 = num1 !== 0 ? num2 : 1; // Avoid division by zero
		correctAnswer = Math.floor(num1 / num2); // Ensure result is an integer
		num1 = correctAnswer * num2; // Adjust so division is clean
		break;
	}

  const question = `What is ${num1} ${operation} ${num2}?`;
  questionElement.innerText = question;

  generateAnswers(correctAnswer);
}


function generateAnswers(correctAnswer) {
  answersElement.innerHTML = ''; // Clear previous answers
  const correctPosition = Math.floor(Math.random() * 5);
  incorrectAnswersRemaining = 4; // Reset for each new question, 4 incorrect answers
  let answersSet = new Set([correctAnswer]); // Initialize set with correct answer to ensure uniqueness

  for (let i = 0; i < 5; i++) {
    const button = document.createElement('button');
    if (i === correctPosition) {
      button.innerText = correctAnswer;
    } else {
      // Generate unique, random incorrect answers
      let incorrectAnswer;
      do {
        incorrectAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
        // Ensure incorrect answers are positive
        if (incorrectAnswer < 0) incorrectAnswer = Math.abs(incorrectAnswer);
      } while (answersSet.has(incorrectAnswer)); // Check set for uniqueness
      answersSet.add(incorrectAnswer); // Add new unique incorrect answer to set
      button.innerText = incorrectAnswer;
    }
	button.onclick = function() {
	  if (parseInt(this.innerText) === correctAnswer) {
		// Increment score for correct answer
		score += incorrectAnswersRemaining;
		scoreElement.innerText = `Score: ${score}`;
		generateQuestion();
		
			// Check if score is 100 or more, then show a pop-up
			//if (score >= 20) {
			//  alert("You Win! Congratulations! Press 'OK' to start over!");
			//  startGame();
			//}
	  } else {
		this.remove();
		incorrectAnswersRemaining--; // Decrease count for each removed incorrect answer
	  }
	};

    answersElement.appendChild(button);
  }
}


startGame(); // Initialize the first question
