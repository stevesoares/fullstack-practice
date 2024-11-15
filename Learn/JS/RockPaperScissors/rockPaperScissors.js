let playerScore = 0;
let computerScore = 0;

const getComputerChoice = () => {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
};

const determineWinner = (userChoice, computerChoice) => {
    if (userChoice === computerChoice) {
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

const updateMoves = (playerChoice, computerChoice) => {
    document.getElementById('player-move').textContent = `You: ${playerChoice}`;
    document.getElementById('computer-move').textContent = `Computer: ${computerChoice}`;
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