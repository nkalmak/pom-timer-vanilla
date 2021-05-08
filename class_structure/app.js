// Storage Controller

const StorageCtrl = (function () {

})()

// UI Controller

const UICtrl = (function () {
    const UISelectors = {
        focusLevel: '#focusSlider',
        difficultyLevel: '#difficultySlider',
        startTimerBtn: '#startTimerBtn'
    }

    return {
        getSelectors: function () {
            return UISelectors
        },

        getTimerSetValues: function () {
            const timerValues = {
                focus: document.querySelector(UISelectors.focusLevel).value,
                difficulty: document.querySelector(UISelectors.difficultyLevel).value
            }
            return timerValues
        }

    }
})()

// Timer Controller

const TimerCtrl = (function () {

    // Timer Constructor
    const Timer = function (focus, difficulty) {

    }

    const UISelectors = UICtrl.getSelectors()

    const clock = function (duration) {
        return new Promise((resolve, reject) => {
            const button = document.querySelector(UISelectors.startTimerBtn)
            button.classList.add("hidden")
            var counter = setInterval(function () {

                minutes = parseInt(duration / 60, 10);
                seconds = parseInt(duration % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                document.querySelector('#time').textContent = minutes + ":" + seconds;

                if (--duration < 0) {
                    clearInterval(counter)
                    button.classList.remove("hidden")
                    document.querySelector('#time').textContent = ''
                    resolve(1)
                }
            }, 1000)
        })
    }

    const breakTimer = function (breakDuration, count) {
        document.body.style.backgroundColor = "#add8e6"
        clock(breakDuration).then(() => {
            console.log(count)
            return count + 1
        })
    }

    const activeTimer = function (activeDuration, breakDuration, count) {
        return new Promise((resolve, reject) => {
            document.body.style.backgroundColor = "white"
            clock(activeDuration).then(() => {
                breakTimer(breakDuration, count)
            })
            console.log('active timer')
            resolve(1)
        })
    }

    return {
        startCycle: function (focus, difficulty) {
            var activeDuration = (focus * (1 - (difficulty * .1))) * 100
            var breakDuration = 5
            let count = 0;

            activeTimer(activeDuration, breakDuration, count).then(() => {
                console.log('returning')
            })
            console.log('final return')
        },

        // getFocusMultiplier: function () {
        //     return 100
        // }
    }

})()

// App Controller

const App = (function (TimerCtrl, StorageCtrl, UICtrl) {
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors()

        document.querySelector(UISelectors.startTimerBtn).addEventListener('click', startTimerSubmit)

    }

    const startTimerSubmit = function (e) {
        const timerValues = UICtrl.getTimerSetValues()
        // const multiplier = TimerCtrl.getFocusMultiplier()

        TimerCtrl.startCycle(timerValues.focus, timerValues.difficulty)

        e.preventDefault()
    }

    return {
        init: function () {
            loadEventListeners()
        }
    }

})(TimerCtrl, StorageCtrl, UICtrl)

App.init()

