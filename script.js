const guessInput = document.getElementById('guessInput');
const guessBtn = document.getElementById('guessBtn');
const resetBtn = document.getElementById('resetBtn');
const attemptsLeftEl = document.getElementById('attemptsLeft');
const feedbackEl = document.getElementById('feedback');
const hotColdEl = document.getElementById('hotCold');
const historyList = document.getElementById('historyList');
const difficultySelect = document.getElementById('difficulty');

let secretNumber = null;
let maxAttempts = 10;
let attemptsLeft = 10;
let history = [];
let finished = false;

function pickNumber(){
	return Math.floor(Math.random()*101);
}

function initGame(){
	maxAttempts = parseInt(difficultySelect.value, 10) || 10;
	attemptsLeft = maxAttempts;
	secretNumber = pickNumber();
	history = [];
	finished = false;
	attemptsLeftEl.textContent = attemptsLeft;
	feedbackEl.textContent = 'Bonne chance !';
	feedbackEl.className = 'feedback';
	hotColdEl.textContent = '';
	historyList.innerHTML = '';
	guessInput.disabled = false;
	guessBtn.disabled = false;
	guessInput.value = '';
	guessInput.focus();
}

function updateAttempts(){
	attemptsLeftEl.textContent = attemptsLeft;
}

function clampGuess(v){
	if (Number.isNaN(v)) return null;
	return Math.max(0, Math.min(100, Math.round(v)));
}

function showHistory(){
	historyList.innerHTML = '';
	history.forEach(item=>{
		const li = document.createElement('li');
		// show guess and hint without leading dashes
		li.textContent = `${item.guess} ${item.hint}`;
		historyList.appendChild(li);
	});
}

function hotColdIndicator(diff){
	if (diff === 0) return 'Parfait';
	if (diff <= 2) return 'Brûlant';
	if (diff <= 6) return 'Très chaud';
	if (diff <= 12) return 'Chaud';
	if (diff <= 25) return 'Tiède';
	if (diff <= 40) return 'Froid';
	return 'Très froid';
}

function endGame(won){
	finished = true;
	guessInput.disabled = true;
	guessBtn.disabled = true;
	if (won){
		feedbackEl.textContent = `Félicitations ! Vous avez trouvé ${secretNumber}`;
		feedbackEl.classList.add('win');
	} else {
		feedbackEl.textContent = `Partie terminée : le nombre était ${secretNumber}`;
		feedbackEl.classList.add('lose');
	}
}

function numberCompare(){
	if (finished) return;
	const raw = Number(guessInput.value);
	const value = clampGuess(raw);
	if (value === null){
		feedbackEl.textContent = 'Veuillez entrer un nombre entre 0 et 100.';
		return;
	}

	attemptsLeft -= 1;
	updateAttempts();

	if (value === secretNumber){
		history.unshift({guess:value,hint:'Correct'});
		showHistory();
		hotColdEl.textContent = hotColdIndicator(0);
		endGame(true);
		return;
	}

	const hint = value < secretNumber ? 'Plus haut' : 'Plus bas';
	const diff = Math.abs(value - secretNumber);
	const hotcold = hotColdIndicator(diff);

	feedbackEl.textContent = hint;
	hotColdEl.textContent = `${hotcold} (écart ${diff})`;
	history.unshift({guess:value,hint:hint});
	showHistory();

	if (attemptsLeft <= 0){
		endGame(false);
	}
}

guessBtn.addEventListener('click', numberCompare);
guessInput.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') numberCompare(); });
resetBtn.addEventListener('click', initGame);
difficultySelect.addEventListener('change', ()=>{
	initGame();
});
initGame();

