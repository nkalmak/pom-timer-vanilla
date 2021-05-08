const timer = {
    pomodoro: 1,
    shortBreak: .1,
    longBreak: .2,
    longBreakInterval: 4,
    sessions: 0,

}

let counter;

const mainButton = document.getElementById('main-btn');

mainButton.addEventListener('click', () => {
    const { action } = mainButton.dataset;
    if (action == 'start') {
        startTimer();
    } else {
        stopTimer();
    }
})

function startTimer() {
    console.log('starting timer')
    let { total } = timer.remainingTime
    const endTime = Date.parse(new Date()) + total * 1000;


    counter = setInterval(function () {
        timer.remainingTime = getRemainingTime(endTime)
        updateClock()

        total = timer.remainingTime.total

        if (total <= 0) {
            clearInterval(counter)
            if (timer.mode === 'pomodoro') timer.sessions++;

            switch (timer.mode) {
                case 'pomodoro':
                    if (timer.sessions % timer.longBreakInterval === 0) {
                        switchMode('longBreak')
                    } else {
                        switchMode('shortBreak')
                    }
                    break
                default:
                    switchMode('pomodoro')
            }
            startTimer()
        }
    }, 1000)

    mainButton.dataset.action = 'stop'
    mainButton.innerHTML = 'Pause'
}

function stopTimer() {
    clearInterval(counter)
    console.log('stopping timer')
    mainButton.dataset.action = 'start';
    mainButton.innerHTML = 'Start'
}

function updateClock() {
    const { remainingTime } = timer

    minutes = remainingTime.minutes
    seconds = remainingTime.seconds

    // minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.querySelector('#time').textContent = minutes + ":" + seconds;
    const percentage = (timer.remainingTime.total / (timer[timer.mode] * 60))
    console.log(percentage * 100)
    setProgress(percentage * 100);

}

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
    const total = Number.parseInt(difference / 1000, 10)
    const minutes = Number.parseInt((total / 60) % 60, 10)
    const seconds = Number.parseInt(total % 60, 10)

    return {
        total,
        minutes,
        seconds,
    }
}

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    }
    document.body.style.backgroundColor = `var(--${mode})`;

    updateClock()
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('loaded')
    switchMode('pomodoro');
});

var circle = document.querySelector('circle');
var radius = circle.r.baseVal.value;
var circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
    const offset = -(circumference - (percent / 100) * circumference);
    // const offset = timer.remainingTime.total - percent;
    circle.style.strokeDashoffset = offset;
}