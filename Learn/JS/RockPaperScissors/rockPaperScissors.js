const getUserChoice = (userInput) => {
    userInput = userInput.toLowerCase();
    if (
      userInput === "rock" ||
      userInput === "paper" ||
      userInput === "scissors" ||
      userInput === 'bomb'
    ) {
      return userInput;
    } else {
      console.log("Error, please type: rock, paper, or scissors.");
    }
  };
  
  const getComputerChoice = () => {
    const randomNumber = Math.floor(Math.random() * 3);
    switch (randomNumber) {
      case 0:
        return "rock";
      case 1:
        return "paper";
      case 2:
        return "scissors";
    }
  };
  
  const determineWinner = (userChoice, computerChoice) => {
    if (userChoice === computerChoice) {
      return "Tie!";
    }
    if (userChoice === 'bomb') {
      return 'You annihilated your opponent!';
    }
    if (userChoice === "rock") {
      if (computerChoice === "paper") {
        return "You Lose!";
      } else {
        return "You Win!";
      }
    }
    if (userChoice === "paper") {
      if (computerChoice === "scissors") {
        return "You Lose!";
      } else {
        return "You Win!";
      }
    }
    if (userChoice === 'scissors') {
      if (computerChoice === 'rock') {
        return 'You Lose!';
      } else {
        return 'You Win!';
      }
    }
  };
  
  const playGame = () => {
    const userChoice = getUserChoice('rock');
    const computerChoice = getComputerChoice();
    console.log('You threw ' + userChoice + '!');
    console.log('The PC threw ' + computerChoice + '!');
    console.log(determineWinner(userChoice, computerChoice));
  }
  
  playGame();

