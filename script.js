const cards = document.querySelectorAll('.card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
    if(lockBoard) return;
    if(this === firstCard) return;

    this.classList.add('flip');

    if(!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;

    checkForMatch();
}

function checkForMatch() {
    // ИСПРАВЛЕНО: Удалена лишняя буква S, которая ломала скрипт
    let isMatch = firstCard.dataset.pair === secondCard.dataset.pair;

    // ИСПРАВЛЕНО: Регистр имени функции изменен на unFlipCards (с большой F)
    isMatch ? disableCards() : unFlipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // Добавляем класс совпадения
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    resetBoard();
    
    // Запускаем проверку победы
    checkWinCondition(); 
}

function unFlipCards() {
    lockBoard = true;

    // Сразу добавляем класс тряски для обеих карточек
    firstCard.classList.add('shake-error');
    secondCard.classList.add('shake-error');

    setTimeout(() => {
        // Через 1 секунду убираем тряску и переворачиваем обратно
        firstCard.classList.remove('shake-error', 'flip');
        secondCard.classList.remove('shake-error', 'flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Вешаем клики на карточки
cards.forEach(card => card.addEventListener('click', flipCard));

// --- ЛОГИКА ПРОВЕРКИ И ПОБЕДЫ ---

function checkWinCondition() {
  // 1. Проверяем первый уровень (если он еще не скрыт)
  const board1 = document.getElementById('game-board1');
  if (board1 && !board1.classList.contains('hidden')) {
    const totalLvl1 = board1.querySelectorAll('.card').length;
    const matchedLvl1 = board1.querySelectorAll('.card.matched').length;

    if (totalLvl1 > 0 && matchedLvl1 === totalLvl1) {
      setTimeout(goToLevelTwo, 800); 
    }
    return; 
  }

  // 2. Проверяем второй уровень
  const board2 = document.getElementById('game-board2');
  if (board2 && !board2.classList.contains('hidden')) {
    const totalLvl2 = board2.querySelectorAll('.card').length;
    const matchedLvl2 = board2.querySelectorAll('.card.matched').length;

    if (totalLvl2 > 0 && matchedLvl2 === totalLvl2) {
      setTimeout(showGameComplete, 800); 
    }
  }
}

// Функция перехода на 2 уровень
function goToLevelTwo() {
  const board1 = document.getElementById('game-board1');
  const header1 = document.getElementById('game-header1');
  if (board1) board1.classList.add('hidden');
  if (header1) header1.classList.add('hidden');

  const board2 = document.getElementById('game-board2');
  const header2 = document.getElementById('game-header2');
  if (board2) board2.classList.remove('hidden');
  if (header2) header2.classList.remove('hidden');
}

// Функция финальной победы в игре
function showGameComplete() {
  const board2 = document.getElementById('game-board2');
  const header2 = document.getElementById('game-header2');
  if (board2) board2.classList.add('hidden');
  if (header2) header2.classList.add('hidden');

  // Блокируем прокрутку всей страницы
  document.body.style.overflow = 'hidden';

  // Показываем окно победы
  const modal = document.getElementById('win-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}
