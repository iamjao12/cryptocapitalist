// --- Elementos do DOM ---
const moneyDisplay = document.getElementById('money');
const timerDisplay = document.getElementById('timer');
const cryptoListDiv = document.getElementById('crypto-list');
const upgradeListDiv = document.getElementById('upgrade-list');

// Elementos das Abas
const tabPanes = document.querySelectorAll('.tab-pane');
const tabButtons = document.querySelectorAll('.tab-button');

// Elementos do Modal de Evento
const eventModal = document.getElementById('event-modal');
const eventDescription = document.getElementById('event-description');
const eventChanceSpan = document.getElementById('event-chance');
const eventCostSpan = document.getElementById('event-cost');
const eventResultP = document.getElementById('event-result');
const eventChoicesDiv = document.getElementById('event-choices');
const eventChoice1Button = document.getElementById('event-choice-1');
const eventChoice2Button = document.getElementById('event-choice-2');

// Elementos do Modal de Fim de Jogo
const gameOverModal = document.getElementById('game-over-modal');
const finalAmountSpan = document.getElementById('final-amount');

// --- Estado do Jogo ---
let money = 10.00; // Dinheiro total na carteira
let gameTime = 20 * 60;
const gameTickInterval = 1000;
let eventInterval = 45;
let timeUntilNextEvent = eventInterval;
let currentEvent = null;
let mainInterval = null;

let cryptos = [
    { id: 1, name: 'BitDog', price: 0.50, owned: 0, baseIncomePerTick: 0.01, unlocked: true, priceChange: 0 },
    { id: 2, name: 'ShibaMoon', price: 5.00, owned: 0, baseIncomePerTick: 0.10, unlocked: false, unlockCost: 50, priceChange: 0 },
    { id: 3, name: 'EtheriumClassic', price: 50.00, owned: 0, baseIncomePerTick: 1.00, unlocked: false, unlockCost: 500, priceChange: 0 },
    { id: 4, name: 'DoniCoin', price: 250.00, owned: 0, baseIncomePerTick: 2.00, unlocked: false, unlockCost: 1000, priceChange: 0 },
    { id: 5, name: 'MegaCrypt', price: 1000.00, owned: 0, baseIncomePerTick: 4.00, unlocked: false, unlockCost: 2500, priceChange: 0 },
    { id: 6, name: 'SolanaSun', price: 150.00, owned: 0, baseIncomePerTick: 1.50, unlocked: false, unlockCost: 750, priceChange: 0 },
    { id: 7, name: 'CardanoChain', price: 75.00, owned: 0, baseIncomePerTick: 0.80, unlocked: false, unlockCost: 600, priceChange: 0 },
    { id: 8, name: 'QuantumCoin', price: 5000.00, owned: 0, baseIncomePerTick: 15.00, unlocked: false, unlockCost: 5000, priceChange: 0 },
    { id: 9, name: 'GalacticToken', price: 10000.00, owned: 0, baseIncomePerTick: 50.00, unlocked: false, unlockCost: 10000, priceChange: 0 },
    { id: 10, name: 'CosmoCash', price: 20000.00, owned: 0, baseIncomePerTick: 180.00, unlocked: false, unlockCost: 20000, priceChange: 0 }
];

let upgrades = [
    { id: 101, name: 'Cursinho BitDog', cost: 20, targetCryptoId: 1, incomeMultiplier: 2, purchased: false },
    { id: 102, name: 'Roteador ShibaMoon', cost: 100, targetCryptoId: 2, incomeMultiplier: 1.5, purchased: false },
    { id: 103, name: 'Coletador Inteligente Etherium', cost: 1000, targetCryptoId: 3, incomeMultiplier: 2, purchased: false },
    { id: 104, name: 'Aula MasterClass sobre DoniCoin', cost: 2500, targetCryptoId: 4, incomeMultiplier: 2.5, purchased: false },
    { id: 105, name: 'Cliente Vip da MegaCrypt', cost: 5000, targetCryptoId: 5, incomeMultiplier: 3.5, purchased: false },
    { id: 106, name: 'Óculos de Sol SolanaSun', cost: 1500, targetCryptoId: 6, incomeMultiplier: 1.8, purchased: false },
    { id: 107, name: 'Nó Validador Cardano', cost: 800, targetCryptoId: 7, incomeMultiplier: 1.6, purchased: false },
    { id: 108, name: 'Acelerador Quântico QuantumCoin', cost: 15000, targetCryptoId: 8, incomeMultiplier: 2.5, purchased: false },
    { id: 109, name: 'Navegador Interestelar GalacticToken', cost: 50000, targetCryptoId: 9, incomeMultiplier: 2.0, purchased: false },
    { id: 110, name: 'Cofre CosmoCash Seguro ', cost: 150000, targetCryptoId: 10, incomeMultiplier: 2.2, purchased: false }
];

const possibleEvents = [
    { description: "Rumor de grande exchange listando BitDog! Investir agora pode dar um grande retorno, mas é arriscado.", investCost: 15, successChance: 0.7, successMessage: "BOOM! O rumor era real! Seus BitDogs valorizaram!", successBonus: 50, failureMessage: "Ah não! Era notícia falsa. Você perdeu seu investimento no rumor.", failurePenalty: 15 },
    { description: "Hackers atacaram a rede ShibaMoon! Ajudar a reforçar a segurança custa dinheiro, mas pode proteger seus ativos.", investCost: 30, successChance: 0.8, successMessage: "Por pouco! A segurança foi reforçada a tempo. Você protegeu seus ativos!", successBonus: 0, failureMessage: "Droga! Os hackers foram mais rápidos. Uma pequena parte dos seus ShibaMoon foi perdida.", failurePenalty: 45 },
    { description: "Um hacker está manipulando o preço do EtheriumClassic! Aproveitar a brecha pode ser lucrativo ou desastroso.", investCost: 100, successChance: 0.4, successMessage: "Você conseguiu! Pegou a alta no momento certo e lucrou!", successBonus: 250, failureMessage: "Que pena! O hacker vendeu tudo e o preço despencou. Você perdeu dinheiro.", failurePenalty: 100 },
    { description: "Rumor de nova moeda no mercado! Mas ela só irá existir por 1 DIA! Essa é a CryptoX! Investir nela pode dar um grande retorno, mas é muito arriscado, pois pode ser uma fraude.", investCost: 500, successChance: 0.15, successMessage: "INACREDITÁVEL! A CryptoX foi um sucesso de hype! Sua carteira valorizou muito!", successBonus: 1500, failureMessage: "Como esperado! Era notícia falsa, uma fraude. Você perdeu seu investimento.", failurePenalty: 500 },
    { description: "Um patrocinador anônimo promete dobrar seus lucros em 5 minutos! Confiar cegamente nele é arriscado.", investCost: 300, successChance: 0.5, successMessage: "Uau! O patrocinador misterioso cumpriu a promessa!", successBonus: 600, failureMessage: "Era bom demais para ser verdade. O 'patrocinador' sumiu com seu dinheiro.", failurePenalty: 300 },
    { description: "Reguladores estão de olho no mercado! Uma taxa inesperada pode ser aplicada sobre seus ganhos recentes.", investCost: 50, successChance: 0.7, successMessage: "Ufa! Parece que pagar a taxa acalmou os reguladores por enquanto.", successBonus: 0, failureMessage: "Mesmo pagando a taxa, os reguladores congelaram parte dos seus ativos temporariamente!", failurePenalty: 75 },
    { description: "Falha técnica em uma pool de mineração de DoniCoin! Investir em reparos pode restaurar a produção rapidamente.", investCost: 200, successChance: 0.75, successMessage: "Reparos concluídos! A mineração de DoniCoin voltou ao normal mais rápido.", successBonus: 350, failureMessage: "Os reparos foram mais complicados que o esperado. O custo aumentou e a produção demorou.", failurePenalty: 200 },
    { description: "Grande empresa anuncia interesse em SolanaSun! Investir agora pode gerar lucros rápidos.", investCost: 750, successChance: 0.6, successMessage: "Ótima jogada! O preço da SolanaSun disparou!", successBonus: 1200, failureMessage: "Era apenas especulação... O preço da SolanaSun voltou ao normal.", failurePenalty: 750 },
    { description: "Influenciador famoso começa a falar sobre CardanoChain! Aumento repentino de investidores previstos.", investCost: 1500, successChance: 0.85, successMessage: "Como previsto! A popularidade da CardanoChain explodiu!", successBonus: 2500, failureMessage: "O hype foi passageiro. O mercado de CardanoChain se estabilizou rapidamente.", failurePenalty: 1500 }
];

// --- Funções Auxiliares ---

function formatMoney(amount) {
    return amount.toFixed(2).replace('.', ',');
}

function formatTime(seconds) {
    if (seconds < 0) seconds = 0;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// --- Funções de Atualização da Interface ---

function updateDisplay() {
    moneyDisplay.textContent = formatMoney(money);
    timerDisplay.textContent = formatTime(gameTime);

    cryptoListDiv.innerHTML = '';
    cryptos.forEach(crypto => {
        if (crypto.unlocked) {
            const cryptoDiv = document.createElement('div');
            cryptoDiv.classList.add('crypto-item');

            const cryptoInfoDiv = document.createElement('div');
            cryptoInfoDiv.classList.add('crypto-info');

            const nameSpan = document.createElement('span');
            nameSpan.classList.add('crypto-name');
            nameSpan.textContent = crypto.name;

            const priceSpan = document.createElement('span');
            priceSpan.textContent = `Preço: R$ ${formatMoney(crypto.price)}`;
            priceSpan.classList.add('crypto-price');

            const ownedSpan = document.createElement('span');
            ownedSpan.textContent = `Comprados: ${crypto.owned}`;
            ownedSpan.classList.add('crypto-owned');

            cryptoInfoDiv.appendChild(nameSpan);
            cryptoInfoDiv.appendChild(document.createElement('br'));
            cryptoInfoDiv.appendChild(priceSpan);
            cryptoInfoDiv.appendChild(document.createTextNode(' | ')); // Adiciona um separador
            cryptoInfoDiv.appendChild(ownedSpan);

            const cryptoActionsDiv = document.createElement('div');
            cryptoActionsDiv.classList.add('crypto-actions');

            const selectAmount = document.createElement('select');
            selectAmount.id = `buy-sell-amount-${crypto.id}`;
            const amounts = [1, 10, 50];
            amounts.forEach(amount => {
                const option = document.createElement('option');
                option.value = amount;
                option.textContent = `${amount}x`;
                selectAmount.appendChild(option);
            });

            const buyButton = document.createElement('button');
            buyButton.textContent = 'Comprar';
            buyButton.onclick = () => buyCrypto(crypto.id, parseInt(selectAmount.value));
            buyButton.disabled = money < crypto.price;

            const sellButton = document.createElement('button');
            sellButton.textContent = 'Vender';
            sellButton.onclick = () => sellCrypto(crypto.id, parseInt(selectAmount.value));
            sellButton.disabled = crypto.owned === 0;

            cryptoActionsDiv.appendChild(selectAmount);
            cryptoActionsDiv.appendChild(buyButton);
            cryptoActionsDiv.appendChild(sellButton);

            cryptoDiv.appendChild(cryptoInfoDiv);
            cryptoDiv.appendChild(cryptoActionsDiv);
            cryptoListDiv.appendChild(cryptoDiv);
        } else if (!crypto.unlocked && money >= crypto.unlockCost * 0.75) {
            const unlockDiv = document.createElement('div');
            unlockDiv.classList.add('crypto-item', 'locked-market');

            const lockedInfoDiv = document.createElement('div');
            lockedInfoDiv.classList.add('locked-info');

            const lockedTextStrong = document.createElement('strong');
            lockedTextStrong.classList.add('locked-keyword');
            lockedTextStrong.textContent = 'Bloqueado:';

            const lockedNameSpan = document.createElement('span');
            lockedNameSpan.classList.add('locked-text');
            lockedNameSpan.textContent = crypto.name;

            const unlockCostSpan = document.createElement('span');
            unlockCostSpan.classList.add('locked-text');
            unlockCostSpan.textContent = `Custo para Desbloquear: R$ ${formatMoney(crypto.unlockCost)}`;

            lockedInfoDiv.appendChild(lockedTextStrong);
            lockedInfoDiv.appendChild(lockedNameSpan);
            lockedInfoDiv.appendChild(document.createElement('br'));
            lockedInfoDiv.appendChild(unlockCostSpan);

            const unlockButton = document.createElement('button');
            unlockButton.textContent = 'Desbloquear';
            unlockButton.onclick = () => unlockCrypto(crypto.id);
            unlockButton.disabled = money < crypto.unlockCost;

            unlockDiv.appendChild(lockedInfoDiv);
            unlockDiv.appendChild(unlockButton);
            cryptoListDiv.appendChild(unlockDiv);
        }
    });

    upgradeListDiv.innerHTML = '';
    let upgradesAvailable = false;

    upgrades.forEach(upgrade => {
        const targetCrypto = cryptos.find(c => c.id === upgrade.targetCryptoId);
        if (targetCrypto && targetCrypto.unlocked && !upgrade.purchased) {
            upgradesAvailable = true;
            const upgradeDiv = document.createElement('div');
            upgradeDiv.classList.add('upgrade-item');

            const upgradeInfoDiv = document.createElement('div');
            upgradeInfoDiv.classList.add('upgrade-info');

            const upgradeNameSpan = document.createElement('span');
            upgradeNameSpan.classList.add('upgrade-name');
            upgradeNameSpan.textContent = upgrade.name;

            const upgradeCostSpan = document.createElement('span');
            upgradeCostSpan.textContent = ` Custo: R$ ${formatMoney(upgrade.cost)}`;
            upgradeCostSpan.classList.add('upgrade-cost');

            const upgradeEffectSpan = document.createElement('span');
            upgradeEffectSpan.textContent = ` (x${upgrade.incomeMultiplier} Renda ${targetCrypto.name})`;

            upgradeInfoDiv.appendChild(upgradeNameSpan);
            upgradeInfoDiv.appendChild(document.createElement('br'));
            upgradeInfoDiv.appendChild(upgradeCostSpan);
            upgradeInfoDiv.appendChild(upgradeEffectSpan);

            const buyUpgradeButton = document.createElement('button');
            buyUpgradeButton.textContent = 'Comprar';
            buyUpgradeButton.onclick = () => buyUpgrade(upgrade.id);
            buyUpgradeButton.disabled = money < upgrade.cost;

            upgradeDiv.appendChild(upgradeInfoDiv);
            upgradeDiv.appendChild(buyUpgradeButton);
            upgradeListDiv.appendChild(upgradeDiv);
        }
    });

    if (!upgradesAvailable) {
        const emptyMessage = document.createElement('p');
        emptyMessage.classList.add('empty-list-message');
        emptyMessage.textContent = 'Nenhuma melhoria disponível no momento.';
        upgradeListDiv.appendChild(emptyMessage);
    }
}

// --- Funções de Lógica do Jogo ---

function buyCrypto(id, quantity) {
    const crypto = cryptos.find(c => c.id === id);
    const cost = crypto.price * quantity;
    if (crypto && money >= cost) {
        money -= cost;
        crypto.owned += quantity;
        updateDisplay();
    }
}

function sellCrypto(id, quantity) {
    const crypto = cryptos.find(c => c.id === id);
    if (crypto && crypto.owned >= quantity) {
        const saleValue = crypto.price * quantity;
        money += saleValue;
        crypto.owned -= quantity;
        updateDisplay();
    }
}

function unlockCrypto(id) {
    const crypto = cryptos.find(c => c.id === id);
    if (crypto && !crypto.unlocked && money >= crypto.unlockCost) {
        money -= crypto.unlockCost;
        crypto.unlocked = true;
        console.log(`Criptomoeda ${crypto.name} desbloqueada!`);
        updateDisplay();
    }
}

function buyUpgrade(id) {
    const upgrade = upgrades.find(u => u.id === id);
    if (upgrade && !upgrade.purchased && money >= upgrade.cost) {
        money -= upgrade.cost;
        upgrade.purchased = true;
        console.log(`Upgrade ${upgrade.name} comprado!`);
        updateDisplay();
    }
}

function fluctuatePrices() {
    cryptos.forEach(crypto => {
        if (crypto.unlocked) {
            let changePercent = 0;
            const volatility = 0.05; // Ajuste este valor para maior ou menor volatilidade
            const trendFactor = 0.01; // Pequena tendência de alta ou baixa

            // Adiciona uma chance de inverter a tendência
            if (Math.random() < 0.1) {
                crypto.priceChange *= -1; // Inverte a tendência
            }

            changePercent = crypto.priceChange + (Math.random() * 2 - 1) * volatility;

            let newPrice = crypto.price * (1 + changePercent);
            crypto.price = Math.max(0.01, newPrice); // Garante que o preço não caia abaixo de 0.01

            // Amortece um pouco as mudanças para não serem tão bruscas
            crypto.priceChange = changePercent * 0.2;
        }
    });
}

function calculateIncome() {
    cryptos.forEach(crypto => {
        if (crypto.owned > 0) {
            let incomeMultiplier = 1;
            upgrades.forEach(upgrade => {
                if (upgrade.purchased && upgrade.targetCryptoId === crypto.id) {
                    incomeMultiplier *= upgrade.incomeMultiplier;
                }
            });
            money += crypto.owned * crypto.baseIncomePerTick * incomeMultiplier * (gameTickInterval / 1000); // Renda por segundo
        }
    });
}

// --- Lógica de Eventos ---

function triggerRandomEvent() {
    const eventModal = document.getElementById('event-modal');
    const gameOverModal = document.getElementById('game-over-modal');
    const eventDescription = document.getElementById('event-description');
    const eventChanceSpan = document.getElementById('event-chance');
    const eventCostSpan = document.getElementById('event-cost');
    const eventResultP = document.getElementById('event-result');
    const eventChoicesDiv = document.getElementById('event-choices');
    const eventChoice1Button = document.getElementById('event-choice-1');
    const eventChoice2Button = document.getElementById('event-choice-2');

    if (!eventModal || eventModal.style.display === 'flex' || !gameOverModal || gameOverModal.style.display === 'flex') return;

    const affordableEvents = possibleEvents.filter(e => money >= e.investCost);
    if (affordableEvents.length === 0) {
        timeUntilNextEvent = eventInterval;
        return;
    }

    const currentEvent = affordableEvents[Math.floor(Math.random() * affordableEvents.length)];

    // *** NOVO: Armazena currentEvent no elemento do modal ***
    eventModal.currentEvent = currentEvent;

    if (eventDescription) eventDescription.textContent = currentEvent.description;
    if (eventChanceSpan) eventChanceSpan.textContent = (currentEvent.successChance * 100).toFixed(0);
    if (eventCostSpan) eventCostSpan.textContent = formatMoney(currentEvent.investCost);
    if (eventResultP) eventResultP.textContent = '';
    if (eventResultP) eventResultP.className = 'event-feedback';
    if (eventChoice1Button) eventChoice1Button.textContent = `Investir R$ ${formatMoney(currentEvent.investCost)}`;
    if (eventChoice2Button) eventChoice2Button.textContent = 'Ignorar Evento';
    if (eventChoice1Button) eventChoice1Button.disabled = money < currentEvent.investCost;
    if (eventChoicesDiv) eventChoicesDiv.style.display = 'block';
    if (eventModal) eventModal.style.display = 'flex';
}

function handleEventChoice(choiceIndex) {
    const eventModal = document.getElementById('event-modal');
    const eventChoicesDiv = document.getElementById('event-choices');
    const eventResultP = document.getElementById('event-result');

    // *** NOVO: Recupera currentEvent do elemento do modal ***
    const currentEvent = eventModal ? eventModal.currentEvent : null;

    if (!currentEvent) {
        console.log("currentEvent é nulo, retornando.");
        return;
    }

    if (eventChoicesDiv) eventChoicesDiv.style.display = 'none';

    if (choiceIndex === 1) {
        if (money < currentEvent.investCost) {
            if (eventResultP) {
                eventResultP.textContent = "Você não tem dinheiro suficiente para investir!";
                eventResultP.className = 'event-feedback event-failure';
            }
            setTimeout(closeEventModal, 2500);
            return;
        }

        money -= currentEvent.investCost;

        const success = Math.random() < currentEvent.successChance;

        if (success) {
            if (eventResultP) {
                eventResultP.innerHTML = `${currentEvent.successMessage} (+ R$ ${formatMoney(currentEvent.successBonus)})`;
                eventResultP.className = 'event-feedback event-success';
            }
        } else {
            if (eventResultP) {
                eventResultP.innerHTML = `${currentEvent.failureMessage} (- R$ ${formatMoney(currentEvent.failurePenalty)})`;
                eventResultP.className = 'event-feedback event-failure';
            }
            money -= currentEvent.failurePenalty;
        }
    } else {
        if (eventResultP) {
            eventResultP.textContent = "Você decidiu não participar do evento.";
            eventResultP.className = 'event-feedback';
        }
    }

    updateDisplay();
    setTimeout(closeEventModal, 3000);
}

function closeEventModal() {
    const eventModal = document.getElementById('event-modal');
    currentEvent = null;
    timeUntilNextEvent = eventInterval;
    if (eventModal) eventModal.style.display = 'none';
}

// --- Lógica das Abas ---
function showTab(tabIdToShow) {
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });

    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(tabIdToShow + '-content').classList.add('active');

    const activeButton = Array.from(tabButtons).find(button => button.getAttribute('onclick') === `showTab('${tabIdToShow}')`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}


// --- Fim de Jogo ---
function endGame() {
    clearInterval(mainInterval);
    console.log("Fim de jogo!");

    finalAmountSpan.textContent = formatMoney(money); // Apenas o money agora
    gameOverModal.style.display = 'flex';
}

// --- Game Loop Principal ---
function gameLoop() {
    if (gameTime <= 0) {
        endGame();
        return;
    }

    gameTime--;
    timeUntilNextEvent--;

    fluctuatePrices();
    calculateIncome();

    if (timeUntilNextEvent <= 0) {
        triggerRandomEvent();
        if (eventModal.style.display !== 'flex') {
            timeUntilNextEvent = eventInterval;
        }
    }

    updateDisplay(); // Garante que a tela seja atualizada a cada tick
}

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    showTab('markets');
    updateDisplay();
    mainInterval = setInterval(gameLoop, gameTickInterval);
});