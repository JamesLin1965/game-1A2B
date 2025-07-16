let hiddenNumber = [];
let history = [];
let guessCount = 0;
const maxGuesses = 10; // 最大猜題次數
let startTime = null; // 遊戲開始時間
let timerInterval = null; // 計時器間隔

function createFirework(x, y, color) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = x + 'px';
    firework.style.top = y + 'px';
    firework.style.backgroundColor = color;
    document.getElementById('fireworks-container').appendChild(firework);
    
    // 移除煙火元素
    setTimeout(() => {
        firework.remove();
    }, 1000);
}

function showFireworks() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const fireworksInterval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const color = colors[Math.floor(Math.random() * colors.length)];
            createFirework(x, y, color);
        }
    }, 200);

    // 5秒後停止煙火
    setTimeout(() => {
        clearInterval(fireworksInterval);
        document.getElementById('fireworks-container').innerHTML = '';
    }, 5000);
}

function generateNumber() {
    const digits = Array.from({ length: 10 }, (_, i) => i);
    hiddenNumber = [];
    while (hiddenNumber.length < 4) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        hiddenNumber.push(digits.splice(randomIndex, 1)[0]);
    }
    // 更新隱藏答案
    document.getElementById('hidden-answer').textContent = `答案：${hiddenNumber.join('')}`;
}

function validateInput(input) {
    if (input.length !== 4 || new Set(input).size !== 4 || !/^\d{4}$/.test(input)) {
        return false;
    }
    return true;
}

function calculateHint(input) {
    let A = 0, B = 0;
    for (let i = 0; i < 4; i++) {
        if (input[i] == hiddenNumber[i]) {
            A++;
        } else if (hiddenNumber.includes(Number(input[i]))) {
            B++;
        }
    }
    return `${A}A${B}B`;
}

function updateGuessCount() {
    document.getElementById('guess-count').textContent = `猜題次數：${guessCount}`;
}

function startTimer() {
    if (!startTime) {
        startTime = new Date();
        const elapsedTimeElement = document.getElementById('elapsed-time');
        elapsedTimeElement.style.display = 'block';
        timerInterval = setInterval(() => {
            const currentTime = new Date();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            elapsedTimeElement.textContent = `花費時間：${elapsedSeconds} 秒`;
        }, 1000);
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        const elapsedTimeElement = document.getElementById('elapsed-time');
        elapsedTimeElement.textContent = `花費時間：${elapsedSeconds} 秒`;
    }
}

function restartGame() {
    generateNumber();
    history = [];
    guessCount = 0;
    updateGuessCount();
    document.getElementById('result').textContent = '';
    document.getElementById('history').textContent = '';
    document.getElementById('guess-input').value = ''; // 清除輸入框內容
    document.getElementById('guess-input').disabled = false;
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('show-answer-btn').disabled = true; // 禁用顯示答案按鈕
    document.getElementById('elapsed-time').style.display = 'none'; // 隱藏計時器
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    startTime = null;
    // 更新隱藏答案
    document.getElementById('hidden-answer').textContent = `答案：${hiddenNumber.join('')}`;
}

function checkAnswer(userGuess) {
    const hint = calculateHint(userGuess);
    if (hint === '4A0B') {
        document.getElementById('correct-sound').play();
        showFireworks(); // 添加煙火效果
        stopTimer(); // 停止計時
    }
    return hint;
}

document.getElementById('submit-btn').addEventListener('click', () => {
    const input = document.getElementById('guess-input').value;
    if (!validateInput(input)) {
        document.getElementById('result').textContent = '請輸入不重複的四位數字！';
        return;
    }
    
    // 開始計時（僅在第一次猜測時開始）
    startTimer();
    
    guessCount++;
    updateGuessCount();
    const hint = checkAnswer(input);
    history.push(`${input} - ${hint}`);
    document.getElementById('result').textContent = hint;
    document.getElementById('history').textContent = history.join('\n');
    if (hint === '4A0B') {
        document.getElementById('result').textContent = '恭喜你猜中了！';
        document.getElementById('guess-input').disabled = true;
        document.getElementById('submit-btn').disabled = true;
        document.getElementById('show-answer-btn').disabled = false; // 啟用顯示答案按鈕
    } else if (guessCount >= maxGuesses) {
        const resultElement = document.getElementById('result');
        resultElement.textContent = '猜題已達10次，挑戰失敗';
        resultElement.style.color = 'red'; // 設定紅色字體
        resultElement.style.fontSize = '24px'; // 放大字體
        document.getElementById('guess-input').disabled = true;
        document.getElementById('submit-btn').disabled = true;
        document.getElementById('show-answer-btn').disabled = false; // 啟用顯示答案按鈕
        stopTimer(); // 停止計時
        const gameOverSound = new Audio('game-over-sound.mp3');
        gameOverSound.play();
    }
});

document.getElementById('restart-btn').addEventListener('click', restartGame);

document.getElementById('show-answer-btn').addEventListener('click', () => {
    if (!document.getElementById('show-answer-btn').disabled) {
        document.getElementById('result').textContent = `標準答案是：${hiddenNumber.join('')}`;
    }
});

// 防止答案被複製
document.getElementById('hidden-answer').addEventListener('copy', (e) => {
    e.preventDefault();
});

restartGame();