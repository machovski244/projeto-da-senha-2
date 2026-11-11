let currentLevel = 'dificil';
let currentStep = 0;
let currentAnswer = 0;
let generatedPasswordDigits = []; // Guarda os dígitos reais da senha
let unlockedPassword = [];        // Guarda as respostas do jogador

const levelBtns = document.querySelectorAll('.level-btn');
const digitBoxes = [
    document.getElementById('digit-1'),
    document.getElementById('digit-2'),
    document.getElementById('digit-3')
];

const stepTitle = document.getElementById('step-title');
const problemText = document.getElementById('problem-text');
const hintText = document.getElementById('hint-text');
const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const startBtn = document.getElementById('start-btn');
const feedbackMsg = document.getElementById('feedback-msg');

levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        levelBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLevel = btn.dataset.level;
    });
});

// Gera um problema matemático cuja resposta É o dígito targetDigit
function generateProblemForDigit(targetDigit, level) {
    let problem = "";
    let hint = "";
    const type = Math.floor(Math.random() * 4);

    if (level === 'medio') {
        if (type === 0) { // Logaritmos
            const base = 2;
            const arg = Math.pow(base, targetDigit);
            problem = `Calcule o resultado da conta: log₂(${arg})`;
            hint = `💡 O resultado desta conta é o dígito da senha!`;
        } else if (type === 1) { // Trigonometria
            if (targetDigit % 2 === 0) {
                problem = `Calcule: 2 · sen(90°) + ${targetDigit - 2}`;
                hint = `💡 Lembre-se: sen(90°) = 1.`;
            } else {
                problem = `Calcule: 5 · cos(0°) + ${targetDigit - 5}`;
                hint = `💡 Lembre-se: cos(0°) = 1.`;
            }
        } else if (type === 2) { // Função de 1º grau
            const b = 4;
            const res = targetDigit + b;
            problem = `Se f(x) = x + ${b}, qual o valor de x para f(x) = ${res}?`;
            hint = `💡 O valor de x é o dígito da senha!`;
        } else { // Potenciação
            const base = 3;
            const val = Math.pow(base, targetDigit);
            problem = `Determine x na equação exponencial: 3ˣ = ${val}`;
            hint = `💡 O expoente x é o dígito da senha!`;
        }
    } 
    else if (level === 'dificil') {
        if (type === 0) { // Matrizes (Determinante)
            const b = 2;
            const det = targetDigit * 3 - b * 4;
            problem = `Se det([[x, ${b}], [4, 3]]) = ${det}, qual é o valor de x?`;
            hint = `💡 O valor de x (a₁₁) será o dígito da senha!`;
        } else if (type === 1) { // Análise Combinatória
            if (targetDigit === 0) {
                problem = `Qual é o valor de 0! (fatorial de zero)?`;
                hint = `💡 Por definição, 0! = ?`;
            } else {
                problem = `Qual o número de combinações C(${targetDigit}, 1)?`;
                hint = `💡 C(n, 1) é igual a n.`;
            }
        } else if (type === 2) { // Progressão Aritmética (PA)
            const a1 = 2;
            const r = 3;
            const an = a1 + targetDigit * r;
            problem = `Em uma PA com a₁ = 2 e r = 3, qual a razão de (aₙ - 2) / 3 para aₙ = ${an}?`;
            hint = `💡 O resultado final é o dígito da senha.`;
        } else { // Raiz quadrada de quadrado perfeito
            const sqr = targetDigit * targetDigit;
            problem = `Calcule a raiz quadrada positiva: √${sqr}`;
            hint = `💡 O resultado é o dígito da senha.`;
        }
    } 
    else { // EXPERT
        if (type === 0) { // Polinômios (Relações de Girard)
            const soma = targetDigit + 2;
            problem = `Na equação x² - ${soma}x + 10 = 0, quanto é a soma das raízes menos 2?`;
            hint = `💡 A soma das raízes é -b/a. Subtraia 2 para obter o dígito.`;
        } else if (type === 1) { // Relação Fundamental da Trigonometria
            problem = `Calcule: [sen²(45°) + cos²(45°)] · ${targetDigit}`;
            hint = `💡 sen²(θ) + cos²(θ) = 1.`;
        } else if (type === 2) { // Mudança de Base em Logaritmos
            problem = `Resolva para x: log₂(x) = ${targetDigit} → Quanto é log₂(2ˣ)?`;
            hint = `💡 O resultado é o próprio número x!`;
        } else { // Equação de 2º Grau Simples
            const b = targetDigit;
            problem = `Qual é a maior raiz da equação x² - ${b}x = 0?`;
            hint = `💡 As raízes são 0 e o valor do dígito!`;
        }
    }

    return { problem, hint };
}

function startChallenge() {
    currentStep = 0;
    unlockedPassword = [];
    generatedPasswordDigits = [];

    // Sorteia os 3 dígitos da senha (de 0 a 9 cada)
    for (let i = 0; i < 3; i++) {
        generatedPasswordDigits.push(Math.floor(Math.random() * 10));
    }

    digitBoxes.forEach((box, index) => {
        box.textContent = "?";
        box.className = "digit-box";
        if (index === 0) box.classList.add("current");
    });

    feedbackMsg.textContent = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;
    startBtn.textContent = "Gerar Nova Senha";

    loadNextStep();
}

function loadNextStep() {
    // O objetivo desta etapa é calcular a resposta para revelar o dígito
    currentAnswer = generatedPasswordDigits[currentStep];
    const data = generateProblemForDigit(currentAnswer, currentLevel);

    stepTitle.textContent = `Conta para o Dígito ${currentStep + 1} de 3 (${currentLevel.toUpperCase()})`;
    problemText.textContent = data.problem;
    hintText.textContent = data.hint;
    guessInput.value = "";
    guessInput.focus();
}

function checkGuess() {
    const userGuess = parseInt(guessInput.value.trim());

    if (isNaN(userGuess)) return;

    if (userGuess === currentAnswer) {
        unlockedPassword.push(userGuess);
        const activeBox = digitBoxes[currentStep];
        activeBox.textContent = userGuess; // Revela o resultado na caixa do cofre
        activeBox.classList.remove("current");
        activeBox.classList.add("unlocked");

        currentStep++;

        if (currentStep < 3) {
            digitBoxes[currentStep].classList.add("current");
            feedbackMsg.textContent = "✔ Dígito correto! Gerando a próxima conta...";
            feedbackMsg.className = "feedback correct";
            loadNextStep();
        } else {
            // As 3 contas foram resolvidas e formaram a senha final
            const finalPassword = unlockedPassword.join('');
            stepTitle.textContent = "COFRE DESBLOQUEADO!";
            problemText.textContent = `A senha gerada pelas 3 contas é: ${finalPassword}`;
            hintText.textContent = "";
            feedbackMsg.textContent = `🎉 Parabéns! Os 3 resultados formaram a senha [ ${finalPassword} ]!`;
            feedbackMsg.className = "feedback correct";
            guessInput.disabled = true;
            guessBtn.disabled = true;
        }
    } else {
        feedbackMsg.textContent = "❌ Resposta incorreta! O dígito não é esse. Tente novamente.";
        feedbackMsg.className = "feedback wrong";
        guessInput.value = "";
        guessInput.focus();
    }
}

startBtn.addEventListener('click', startChallenge);
guessBtn.addEventListener('click', checkGuess);

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkGuess();
    }
});
