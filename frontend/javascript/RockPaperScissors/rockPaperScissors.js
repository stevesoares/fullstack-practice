let playerScore = 0;
let computerScore = 0;
const tieScore = document.getElementById("tie-score");
let ties = 0;

const getComputerChoice = () => {
  const choices = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * 3);
  return choices[randomIndex];
};

const determineWinner = (userChoice, computerChoice) => {
  if (userChoice === computerChoice) {
    ties++;
    tieScore.textContent = ties;
    return { result: "Tie!", status: "tie" };
  }

  const winConditions = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper",
  };

  if (winConditions[userChoice] === computerChoice) {
    playerScore++;
    return { result: "You Win!", status: "win" };
  } else {
    computerScore++;
    return { result: "You Lose!", status: "lose" };
  }
};

const updateScore = () => {
  document.getElementById("player-score").textContent = playerScore;
  document.getElementById("computer-score").textContent = computerScore;
};

const choiceEmojis = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};

const updateMoves = (playerChoice, computerChoice) => {
  document.getElementById(
    "player-move"
  ).textContent = `You: ${choiceEmojis[playerChoice]}`;
  document.getElementById(
    "computer-move"
  ).textContent = `Computer: ${choiceEmojis[computerChoice]}`;
};

const updateResult = (result, status) => {
  const resultDiv = document.getElementById('result');
  
  // Always include the play again prompt after the first game
  resultDiv.innerHTML = `
    ${result}<br>
    <span class="play-again">Select an option to play again!</span>
  `;
  
  resultDiv.className = `result ${status}`;
};

const playGame = (playerChoice) => {
  const computerChoice = getComputerChoice();
  const { result, status } = determineWinner(playerChoice, computerChoice);

  updateScore();
  updateMoves(playerChoice, computerChoice);
  updateResult(result, status);
};

// Event Listeners
document.querySelectorAll(".choice").forEach((button) => {
  let isProcessing = false;

  button.addEventListener("click", (e) => {
    if (isProcessing) return;
    
    isProcessing = true;
    playGame(e.target.dataset.choice);
    
    // Reset the processing flag after a short delay
    setTimeout(() => {
      isProcessing = false;
    }, 300); // 300ms debounce
  });

  // Prevent default touch behavior
  button.addEventListener("touchstart", (e) => {
    e.preventDefault();
  }, { passive: false });
});

// Update the result display function
function displayResult(playerChoice, computerChoice, result) {
  const resultDiv = document.getElementById('result');
  const movesDiv = document.querySelector('.moves');
  
  // Set the result text with play again prompt
  resultDiv.innerHTML = `
    ${result}<br>
    <span class="play-again">Select an option to play again!</span>
  `;
  
  // Set appropriate class for coloring
  if (result.includes('Win')) {
    resultDiv.className = 'result win';
  } else if (result.includes('Lose')) {
    resultDiv.className = 'result lose';
  } else {
    resultDiv.className = 'result tie';
  }

  // Show the moves
  movesDiv.innerHTML = `
    <span>${choiceEmojis[playerChoice]}</span>
    <span>vs</span>
    <span>${choiceEmojis[computerChoice]}</span>
  `;
}
