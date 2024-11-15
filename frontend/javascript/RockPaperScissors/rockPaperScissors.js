let playerScore = 0;
let computerScore = 0;
const tieScore = document.getElementById('tie-score');
let ties = 0;

const getComputerChoice = () => {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
};

const determineWinner = (userChoice, computerChoice) => {
    if (userChoice === computerChoice) {
        ties++;
        tieScore.textContent = ties;
        return { result: "Tie!", status: 'tie' };
    }

    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };

    if (winConditions[userChoice] === computerChoice) {
        playerScore++;
        return { result: "You Win!", status: 'win' };
    } else {
        computerScore++;
        return { result: "You Lose!", status: 'lose' };
    }
};

const updateScore = () => {
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
};

const choiceEmojis = {
    'rock': '✊',
    'paper': '✋',
    'scissors': '✌️'
};

const updateMoves = (playerChoice, computerChoice) => {
    document.getElementById('player-move').textContent = `You: ${choiceEmojis[playerChoice]}`;
    document.getElementById('computer-move').textContent = `Computer: ${choiceEmojis[computerChoice]}`;
};

const updateResult = (result, status) => {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = result;
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
document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', (e) => {
        playGame(e.target.dataset.choice);
    });
});

// Update the result display function
function displayResult(playerChoice, computerChoice, result) {
    const resultDiv = document.getElementById('result');
    const movesDiv = document.querySelector('.moves');
    
    // Set the result text with appropriate color class
    resultDiv.textContent = result;
    if (result.includes('Win')) {
        resultDiv.className = 'result win';
    } else if (result.includes('Lose')) {
        resultDiv.className = 'result lose';
    } else {
        resultDiv.className = 'result tie';
    }

    // Show the emoji choices below
    movesDiv.innerHTML = `
        <span>${choiceEmojis[playerChoice]}</span>
        <span>vs</span>
        <span>${choiceEmojis[computerChoice]}</span>
    `;
}