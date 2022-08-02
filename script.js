const round = document.getElementById("round");
const simonBtns = document.querySelectorAll(".square");
const startBtn = document.getElementById("startBtn");

class Simon {
  constructor(simonBtns, startBtn, round) {
    this.round = 0;
    this.userPosition = 0;
    this.totalRounds = 7;
    this.sequence = [];
    this.speed = 1000;
    this.blockedBtns = true;
    this.buttons = Array.from(simonBtns);
    this.display = {
      startBtn,
      round,
    };
    this.errorSound = new Audio("./sounds/sounds_error.wav");
    this.btnSounds = [
      new Audio("./sounds/sounds_1.mp3"),
      new Audio("./sounds/sounds_2.mp3"),
      new Audio("./sounds/sounds_3.mp3"),
      new Audio("./sounds/sounds_4.mp3"),
    ];
  }

  init() {
    this.display.startBtn.onclick = () => this.startGame();
  }

  startGame() {
    this.display.startBtn.disabled = true;
    this.updateRound(0);
    this.userPosition = 0;
    this.sequence = this.createSequence();
    this.buttons.forEach((elem, i) => {
      elem.classList.remove("winner");
      elem.onclick = () => this.buttonClick(i);
    });
    this.showSequence();
  }

  updateRound(value) {
    this.round = value;
    this.display.round.textContent = `Round: ${this.round}`;
  }

  createSequence() {
    return Array.from({ length: this.totalRounds }, () =>
      this.getRandomColor()
    );
  }

  getRandomColor() {
    return Math.floor(Math.random() * 4);
  }

  buttonClick(value) {
    !this.blockedBtns && this.validateChosenColor(value);
  }

  validateChosenColor(value) {
    if (this.sequence[this.userPosition] === value) {
      this.btnSounds[value].play();
      if (this.round === this.userPosition) {
        this.updateRound(this.round + 1);
        this.speed /= 1.02;
        this.isGameOver();
      } else {
        this.userPosition++;
      }
    } else {
      this.gameLost();
    }
  }

  isGameOver() {
    if (this.round === this.totalRounds) {
      this.gameWon();
    } else {
      this.userPosition = 0;
      this.showSequence();
    }
  }

  showSequence() {
    this.blockedBtns = true;
    let sequenceIndex = 0;

    let timer = setInterval(() => {
      const button = this.buttons[this.sequence[sequenceIndex]];

      this.btnSounds[this.sequence[sequenceIndex]].play();

      this.toggleButtonStyle(button);

      setTimeout(() => this.toggleButtonStyle(button), this.speed / 2);

      sequenceIndex++;

      if (sequenceIndex > this.round) {
        this.blockedBtns = false;
        clearInterval(timer);
      }
    }, this.speed);
  }

  toggleButtonStyle(button) {
    button.classList.toggle("active");
  }

  gameLost() {
    this.errorSound.play();
    this.display.startBtn.disabled = false;
    this.blockedBtns = true;
  }

  gameWon() {
    this.display.startBtn.disabled = false;
    this.blockedBtns = true;
    this.buttons.forEach((elem) => {
      elem.classList.add("winner");
    });
    this.updateRound("🏆");
  }
}

const simon = new Simon(simonBtns, startBtn, round);

simon.init();
