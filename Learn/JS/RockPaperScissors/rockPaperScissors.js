const getUserChoice = (userInput) => {
  userInput = userInput.toLowerCase("rock");
  if (
    userInput === "rock" ||
    userInput === "paper" ||
    userInput === "scissors"
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
};

console.log(determineWinner(getUserChoice("paper"), getComputerChoice()));
