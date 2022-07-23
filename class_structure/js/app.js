const clock = new Circle();
let counter;
let savedTimer;

const timer = {
  pomodoro: 2,
  shortBreak: 1,
  longBreak: 3,
  longBreakInterval: 4,
  sessions: 0,
};

const mainButton = document.getElementById("main-btn");

mainButton.addEventListener("click", () => {
  const { action } = mainButton.dataset;
  if (action == "start") {
    startTimer();
  } else {
    stopTimer();
  }
});

function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  counter = setInterval(function () {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;

    if (total <= 0) {
      clearInterval(counter);
      if (timer.mode === "pomodoro") timer.sessions++;

      switch (timer.mode) {
        case "pomodoro":
          if (timer.sessions % timer.longBreakInterval === 0) {
            switchMode("longBreak");
          } else {
            switchMode("shortBreak");
          }
          break;
        default:
          switchMode("pomodoro");
      }
      startTimer();
    }
  }, 1000);

  mainButton.dataset.action = "stop";
  mainButton.innerHTML = "Pause";
}

function stopTimer() {
  clearInterval(counter);
  mainButton.dataset.action = "start";
  mainButton.innerHTML = "Start";
}

function updateClock() {
  const { remainingTime } = timer;

  minutes = remainingTime.minutes;
  seconds = remainingTime.seconds;

  seconds = seconds < 10 ? "0" + seconds : seconds;

  document.querySelector("#time").textContent = minutes + ":" + seconds;
  const percentage = timer.remainingTime.total / (timer[timer.mode] * 60);

  clock.setProgress(percentage * 100);
  localStorage.setItem("timer", JSON.stringify(timer));
}

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;
  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
}

function switchMode(mode) {
  if (mode === savedTimer) {
    console.log(savedTimer);
    timer.mode = savedTimer.mode;
    timer.remainingTime = {
      total: savedTimer.remainingTime.total,
      minutes: savedTimer.remainingTime.minutes,
      seconds: savedTimer.remainingTime.seconds,
    };
    timer.sessions = savedTimer.sessions;
  } else {
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };
  }

  document.body.style.backgroundColor = `var(--${timer.mode})`;

  updateClock();
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("timer")) {
    savedTimer = JSON.parse(localStorage.getItem("timer"));
    switchMode(savedTimer);
  } else {
    switchMode("pomodoro");
  }
});
