
    // -------------------- DOM elements --------------------
    const timerDisplay = document.getElementById('timerDisplay');
    const targetTimeDisplay = document.getElementById('targetTimeDisplay');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const stoppedTimeSpan = document.getElementById('stoppedTimeSpan');
    const diffSpan = document.getElementById('diffSpan');
    const roundScoreSpan = document.getElementById('roundScoreSpan');
    const totalScoreSpan = document.getElementById('totalScoreSpan');
    const timerArea = document.getElementById('timerArea');
    const levelBtns = document.querySelectorAll('.level-btn');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // -------------------- Estado do jogo --------------------
    let targetTime = 0.0;
    let currentElapsed = 0.0;
    let timerInterval = null;
    let isRunning = false;
    let roundFinished = false;
    let totalScore = 0;
    
    // Histórico de rodadas
    let history = []; // cada entry: { round, target, stopped, diff, points }
    let roundCounter = 1;
    
    // Configuração de dificuldade
    let currentMin = 8;
    let currentMax = 15;
    
    // -------------------- Função de pontuação --------------------
    function calculatePoints(diffSeconds) {
        if (diffSeconds <= 0.10) return 100;
        if (diffSeconds <= 0.20) return 95;
        if (diffSeconds <= 0.50) return 80;
        if (diffSeconds <= 1.00) return 50;
        if (diffSeconds <= 2.50) return 10;
        return 0;
    }
    
    // Gera um tempo aleatório
    function generateRandomTarget() {
        const randomSec = currentMin + (Math.random() * (currentMax - currentMin));
        return Math.round(randomSec * 100) / 100;
    }
    
    // Atualiza classe do cronômetro
    function setInvisibleMode(active) {
        if (active) {
            timerArea.classList.add('invisible-mode');
            timerDisplay.classList.remove('result-visible');
        } else {
            timerArea.classList.remove('invisible-mode');
            timerDisplay.classList.add('result-visible');
        }
    }
    
    function updateTimerDisplay() {
        timerDisplay.textContent = currentElapsed.toFixed(2);
    }
    
    function stopTimerInternal() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        isRunning = false;
    }
    
    function generateAndShowNewTarget() {
        targetTime = generateRandomTarget();
        targetTimeDisplay.textContent = targetTime.toFixed(2);
    }
    
    // Adiciona rodada ao histórico e atualiza a lista visual
    function addToHistory(stopped, diff, points) {
        const roundNumber = roundCounter;
        history.unshift({ // adiciona no início (mais recente primeiro)
            round: roundNumber,
            target: targetTime,
            stopped: stopped,
            diff: diff,
            points: points
        });
        
        // Limita o histórico a 30 rodadas para não sobrecarregar
        if (history.length > 30) history.pop();
        
        renderHistory();
    }
    
    // Renderiza a lista de histórico
    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = '<div class="empty-history">Nenhuma rodada completada ainda. Clique em COMEÇAR e depois PARAR!</div>';
            return;
        }
        
        historyList.innerHTML = '';
        history.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            
            // Define classe de cor baseada na pontuação
            if (item.points === 100) div.classList.add('perfect');
            else if (item.points === 95) div.classList.add('excellent');
            else if (item.points >= 80) div.classList.add('good');
            else if (item.points >= 50) div.classList.add('fair');
            else if (item.points >= 10) div.classList.add('poor');
            else div.classList.add('terrible');
            
            let pointsClass = 'history-points';
            if (item.points >= 95) pointsClass += ' high';
            else if (item.points >= 80) pointsClass += ' medium';
            else pointsClass += ' low';
            
            div.innerHTML = `
                <span class="history-round">#${item.round}</span>
                <span class="history-target">🎯 ${item.target.toFixed(2)}s</span>
                <span class="history-stopped">⏱️ ${item.stopped.toFixed(2)}s</span>
                <span class="history-diff">📊 ${item.diff.toFixed(3)}s</span>
                <span class="${pointsClass}">⭐ ${item.points}</span>
            `;
            historyList.appendChild(div);
        });
    }
    
    // Limpa todo o histórico
    function clearHistory() {
        history = [];
        renderHistory();
    }
    
    // Inicia uma nova rodada
    function startNewRound() {
        if (timerInterval) {
            stopTimerInternal();
        }
        
        generateAndShowNewTarget();
        currentElapsed = 0.0;
        updateTimerDisplay();
        roundFinished = false;
        
        stoppedTimeSpan.textContent = '—';
        diffSpan.textContent = '—';
        roundScoreSpan.innerHTML = '🏆 Pontos nesta rodada: —';
        
        setInvisibleMode(true);
        
        isRunning = true;
        timerInterval = setInterval(() => {
            if (isRunning) {
                currentElapsed += 0.01;
                currentElapsed = Math.round(currentElapsed * 100) / 100;
                updateTimerDisplay();
            }
        }, 10);
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
    }
    
    // Para o cronômetro e calcula
    function stopAndCalculate() {
        if (!isRunning || roundFinished) return;
        
        stopTimerInternal();
        
        const stoppedValue = currentElapsed;
        const diff = Math.abs(stoppedValue - targetTime);
        const points = calculatePoints(diff);
        
        stoppedTimeSpan.textContent = stoppedValue.toFixed(2) + ' s';
        diffSpan.textContent = diff.toFixed(3) + ' s';
        
        let feedback = '';
        if (points === 100) feedback = '🎉 PERFEITO! +100 ⭐⭐⭐';
        else if (points === 95) feedback = '✨ EXCELENTE! +95 ⭐';
        else if (points === 80) feedback = '👍 MUITO BOM! +80';
        else if (points === 50) feedback = '⚡ BOM! +50';
        else if (points === 10) feedback = '🕒 ACEITÁVEL +10';
        else feedback = '💀 ERROU MUITO +0';
        
        roundScoreSpan.innerHTML = `🏆 Pontos nesta rodada: ${points} &nbsp;&nbsp; ${feedback}`;
        
        // Adiciona ao histórico ANTES de atualizar total e incrementar round
        addToHistory(stoppedValue, diff, points);
        
        totalScore += points;
        totalScoreSpan.textContent = totalScore;
        
        roundCounter++;
        roundFinished = true;
        
        setInvisibleMode(false);
        timerDisplay.classList.add('result-visible');
        
        stopBtn.disabled = true;
        startBtn.disabled = false;
    }
    
    // Reset total (zera pontuação e histórico)
    function fullReset() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        isRunning = false;
        roundFinished = false;
        
        totalScore = 0;
        roundCounter = 1;
        totalScoreSpan.textContent = '0';
        
        // Limpa histórico
        clearHistory();
        
        stoppedTimeSpan.textContent = '—';
        diffSpan.textContent = '—';
        roundScoreSpan.innerHTML = '🏆 Pontos nesta rodada: —';
        
        currentElapsed = 0.0;
        updateTimerDisplay();
        generateAndShowNewTarget();
        
        setInvisibleMode(false);
        timerDisplay.classList.add('result-visible');
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
    
    // Reseta apenas a rodada atual (sem perder pontuação total nem histórico)
    function resetCurrentRound() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        isRunning = false;
        
        if (roundFinished) {
            roundCounter++;
            roundFinished = false;
        }
        
        generateAndShowNewTarget();
        currentElapsed = 0.0;
        updateTimerDisplay();
        
        stoppedTimeSpan.textContent = '—';
        diffSpan.textContent = '—';
        roundScoreSpan.innerHTML = '🏆 Pontos nesta rodada: —';
        
        setInvisibleMode(false);
        timerDisplay.classList.add('result-visible');
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
        roundFinished = false;
    }
    
    // Mudar dificuldade
    function setDifficulty(minSec, maxSec) {
        currentMin = minSec;
        currentMax = maxSec;
        fullReset(); // zera tudo ao mudar dificuldade
        
        levelBtns.forEach(btn => {
            const btnMin = parseFloat(btn.getAttribute('data-min'));
            const btnMax = parseFloat(btn.getAttribute('data-max'));
            if (btnMin === minSec && btnMax === maxSec) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // -------------------- Event Listeners --------------------
    startBtn.addEventListener('click', () => {
        if (isRunning) return;
        if (roundFinished) {
            roundCounter++;
            roundFinished = false;
        }
        startNewRound();
    });
    
    stopBtn.addEventListener('click', () => {
        if (isRunning && !roundFinished) {
            stopAndCalculate();
        }
    });
    
    clearHistoryBtn.addEventListener('click', () => {
        clearHistory();
    });
    
    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const minVal = parseFloat(btn.getAttribute('data-min'));
            const maxVal = parseFloat(btn.getAttribute('data-max'));
            if (!isNaN(minVal) && !isNaN(maxVal)) {
                setDifficulty(minVal, maxVal);
            }
        });
    });
    
    // Inicialização
    function init() {
        currentMin = 8;
        currentMax = 15;
        targetTime = generateRandomTarget();
        targetTimeDisplay.textContent = targetTime.toFixed(2);
        currentElapsed = 0.0;
        updateTimerDisplay();
        totalScore = 0;
        roundCounter = 1;
        totalScoreSpan.textContent = '0';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        setInvisibleMode(false);
        timerDisplay.classList.add('result-visible');
        roundFinished = false;
        if (timerInterval) clearInterval(timerInterval);
        isRunning = false;
        history = [];
        renderHistory();
        
        const medioBtn = Array.from(levelBtns).find(btn => btn.getAttribute('data-min') === '8' && btn.getAttribute('data-max') === '15');
        if (medioBtn) medioBtn.classList.add('active');
    }
    
    init();
