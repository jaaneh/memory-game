window.addEventListener('load', initGame);

const allCards = document.querySelectorAll('.card'),
  playerScore = document.querySelector('.score-amount'),
  playerAttempts = document.querySelector('.attempts-amount');

let cardFlipped = false,
  boardLocked = false,
  score = 0,
  attempts = 0,
  firstCard,
  secondCard;

function flipSingleCard() {
  if (boardLocked) return;
  if (this === firstCard) return;

  this.classList.add('flipped');

  if (!cardFlipped) {
    cardFlipped = true;
    firstCard = this;
    return;
  }

  cardFlipped = false;
  secondCard = this;

  attempts++;
  playerAttempts.textContent = attempts;

  checkIfCardsMatch();
}

function checkIfCardsMatch() {
  const isMatch = firstCard.dataset.num === secondCard.dataset.num;
  isMatch ? disableMatchedAddScore() : unflipCards();
}

function resetLogic() {
  [ cardFlipped, boardLocked ] = [ false, false ];
  [ firstCard, secondCard ] = [ null, null ];
}

function disableMatchedAddScore() {
  firstCard.removeEventListener('click', flipSingleCard);
  secondCard.removeEventListener('click', flipSingleCard);

  score++;
  playerScore.textContent = score;

  if (score === 8) {
    setTimeout(() => {
      announceWinner('Jan', attempts);
    }, 500);
  }

  resetLogic();
}

function announceWinner(name, moves) {
  return alert(`Congratulations ${name}, you beat the game in ${moves} moves!`);
}

function resetGame() {
  [ score, attempts ] = [ 0, 0 ];
  playerScore.textContent = score;
  playerAttempts.textContent = attempts;

  allCards.forEach(card => card.classList.remove('flipped'));

  // setting a timeout to allow cards to be flipped back before resetting.
  setTimeout(() => {
    initGame();
  }, 500);
}

function unflipCards() {
  boardLocked = true;

  // timeout to allow time for flip animation, and realize it's not a match.
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetLogic();
  }, 1500);
}

function initGame() {
  const numbers = [ 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8 ];

  allCards.forEach(card => card.addEventListener('click', flipSingleCard));

  for (let i = 0; i < allCards.length; i++) {
    allCards[i].dataset.num = numbers[i];
  }

  allCards.forEach(card => {
    const rand = Math.floor(Math.random() * 16);
    card.style.order = rand;
  });
}
