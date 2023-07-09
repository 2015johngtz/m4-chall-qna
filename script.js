const startButton = document.getElementById('start-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const resultsContainer = document.getElementById('results-container')
const quizContainer = document.getElementById('quiz-container')
const scoreElement = document.getElementById('score')
const initialsInput = document.getElementById('initials')
const saveButton = document.getElementById('save-btn')
const resetButton = document.getElementById('start-over-btn')
const timerElement = document.getElementById('timer')
const answerStatusElement = document.getElementById('answer-status')
const scoreTrackerElement = document.getElementById('score-tracker')
const statusContainerElement = document.getElementById('status-container')
const highScoresButton = document.getElementById('view-high-scores-btn')
const highScoresContainer = document.getElementById('high-scores-container')
const highScoresList = document.getElementById('high-scores-list')
const backButton = document.getElementById('back-btn')
const INITIAL_TIME = 60

let timerInterval

function init() {
    resultsContainer.style.display = 'none'
    highScoresContainer.style.display = 'none'
}

const questions = [
    {
        question: 'What is the output of the following code snippet? console.log(2 + "2");',
        answers: [
            { text: '22', correct: true },
            { text: '4', correct: false },
            { text: 'NaN', correct: false },
            { text: 'Error', correct: false }
        ]
    },
    {
        question: 'Which of the following is a JavaScript data type?',
        answers: [
            { text: 'String', correct: false },
            { text: 'Boolean', correct: false },
            { text: 'Object', correct: false },
            { text: 'All of the above', correct: true }
        ]
    },
    {
        question: 'What is the result of the following expression? "5" + 2',
        answers: [
            { text: '52', correct: true },
            { text: '7', correct: false },
            { text: 'NaN', correct: false },
            { text: 'Error', correct: false }
        ]
    },
    {
        question: 'What is the purpose of the "return" statement in a function?',
        answers: [
            { text: 'To terminate the execution of a function', correct: false },
            { text: 'To assign a value to a variable', correct: false },
            { text: 'To specify the value that a function should return', correct: true },
            { text: 'To define a new variable', correct: false }
        ]
    },
    {
        question: 'Which built-in method removes the last element from an array and returns it?',
        answers: [
            { text: 'pop()', correct: true },
            { text: 'push()', correct: false },
            { text: 'shift()', correct: false },
            { text: 'unshift()', correct: false }
        ]
    },
];


let shuffledQuestions, currentQuestionIndex
let score = 0
let timeLeft = 60

startButton.addEventListener('click', startGame)
saveButton.addEventListener('click', saveScore)

function startGame() {
    resetState()
    statusContainerElement.style.display = 'block'
    questionElement.innerText = ''
    startButton.classList.add('hide')
    resetButton.classList.add('hide')
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    score = 0
    timeLeft = 60
    questionContainerElement.classList.remove('hide')
    setNextQuestion()
    timer()
}

function timer() {
    timerInterval = setInterval(function() {
        timerElement.innerText = `Time Left: ${timeLeft}`
        timeLeft--
        
        if (timeLeft <= 0 || shuffledQuestions.length === currentQuestionIndex) {
            timeLeft = 0
            timerElement.innerText = `Time Left: ${timeLeft}`
            clearInterval(timerInterval)
            endGame()
        }
    }, 1000)
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
    questionElement.innerText = question.question
    questionElement.style.textAlign = 'center'
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        answerButtonsElement.appendChild(button)
    })
}

function resetState() {
    startButton.classList.add('hide')
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    if (correct) {
        score++
        answerStatusElement.innerText = 'Correct!'
    } else {
        timeLeft -= 10
        answerStatusElement.innerText = 'Wrong!'
    }
    scoreTrackerElement.innerText = `Score: ${score}`
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        currentQuestionIndex++
        setNextQuestion()
    } else {
        endGame()
    }
}

function endGame() {
    resetState()
    clearInterval(timerInterval)
    quizContainer.style.display = 'none'
    resultsContainer.style.display = 'flex'
    questionElement.innerText = ''
    resultsContainer.classList.remove('hide')
    resetButton.classList.remove('hide')
    scoreElement.innerText = score
    statusContainerElement.style.display = 'none'
    scoreTrackerElement.innerText = ''
    answerStatusElement.innerText = ''
}

resetButton.addEventListener('click', resetGame)

function resetGame() {
    clearInterval(timerInterval)
    resultsContainer.style.display = 'none'
    quizContainer.style.display = 'flex'
    startButton.classList.remove('hide')
    resetButton.classList.add('hide')
    resultsContainer.classList.add('hide')
    score = 0
    currentQuestionIndex = 0
    timeLeft = INITIAL_TIME
    setNextQuestion()
    statusContainerElement.style.display = 'none'
    startGame()
}

function saveScore() {
    const initials = initialsInput.value
    const highscores = JSON.parse(localStorage.getItem('highscores')) || []
    const newScore = { score, initials }
    highscores.push(newScore)
    localStorage.setItem('highscores', JSON.stringify(highscores))
}

highScoresButton.addEventListener('click', showHighScores)
backButton.addEventListener('click', backToStart)

function showHighScores() {
    statusContainerElement.style.display = 'none'
    resultsContainer.style.display = 'none'
    quizContainer.style.display = 'none'
    highScoresContainer.style.display = 'flex'
    backButton.classList.remove('hide')

    const highscores = JSON.parse(localStorage.getItem('highscores')) || []
    
    highScoresList.innerHTML = ''
    
    highscores.sort((a, b) => b.score - a.score)

    highscores.slice(0, 10).forEach((scoreItem) => {
        const li = document.createElement('li')
        li.textContent = `${scoreItem.initials} - ${scoreItem.score}`
        highScoresList.appendChild(li)
    })
}

function backToStart() {
    location.reload()
}

init()
