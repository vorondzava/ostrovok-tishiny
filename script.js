// ===== ФРАЗЫ =====
const phrases = [
    "Ты справлялась раньше. Ты справишься и сейчас. Не сразу, но справишься.",
    "Знаешь, ты очень дорога тем, кто тебя знает. Даже если ты сейчас этого не чувствуешь.",
    "Твоя улыбка — она настоящая. И кто-то прямо сейчас улыбнулся, вспомнив о тебе.",
    "Ты не обязана быть сильной. Можно просто быть. И этого достаточно.",
    "Иногда самое смелое, что можно сделать — это просто прожить ещё один день.",
    "Ты важна. Не за что-то. Просто потому что ты есть.",
    "Твои чувства имеют значение. Даже те, которые ты не можешь объяснить.",
    "Есть люди, которые знают тебя настоящую. И они не отвернулись.",
    "Ты не сломлена. Ты просто устала бороться. Это можно.",
    "Разреши себе отдых. Настоящий. Без чувства вины.",
    "Сегодня можно ничего не решать. Можно просто прожить этот день.",
    "То, что ты чувствуешь — не «слишком». Это просто твои чувства. Они настоящие.",
    "Ты заслуживаешь покоя. Прямо сейчас, в эту минуту.",
    "Твоё «нет» имеет значение. Твои границы важны.",
    "Ты не одна. Даже когда кажется иначе.",
    "Твоя усталость понятна. Ты так долго держалась.",
    "Ничего страшного, если сегодня ты не продуктивна. Ты человек, а не машина.",
    "Кто-то прямо сейчас думает о тебе с теплотой. Даже если ты об этом не знаешь.",
    "Ты уже проходила через тёмные дни. Этот — просто ещё один. Он тоже пройдёт.",
    "Иногда полезно просто переключиться на что-то другое. На котиков, например.",
    "Ты имеешь право на паузу. Без объяснений.",
    "Ты делаешь достаточно. Даже если кажется, что нет.",
    "Ты не обязана соответствовать чьим-то ожиданиям. Даже своим собственным.",
    "В тебе есть свет. Даже в самые тёмные дни он никуда не девается.",
    "Ты выжила. Это уже победа. Помни об этом.",
    "Ты можешь просто быть. И это уже ценно.",
    "Твоя душа знает дорогу к свету. Даже если сейчас не видно пути.",
    "Ты не бремя. Ты — подарок для тех, кто тебя знает.",
    "Иногда нужно просто выдохнуть. И напомнить себе: я справлюсь.",
    "Ты достойна любви. Не идеальной. Настоящей.",
    "Твоя чувствительность — это не слабость. Это твоя суперсила.",
    "Ты не потеряна. Ты просто ещё в пути.",
    "Сегодня можно быть не в порядке. Завтра будет новый день.",
    "Ты намного сильнее, чем тебе кажется.",
    "Просто знай: есть люди, которым ты нужна. Именно такая, какая есть."
];

let usedPhrases = [];

const catImages = [
    "images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg",
    "images/6.jpg", "images/7.jpg", "images/8.jpg", "images/9.jpg", "images/10.jpg"
];

let deleteMode = false;

// ===== ЭКРАНЫ =====
function showScreen(id) {
    const music = document.getElementById('silence-music');
    if (music && id !== 'silence') {
        music.pause();
        music.currentTime = 0;
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
    if (id === 'cats') renderUserPhotos();
    if (id === 'home') renderMemoryPreview();
    if (id === 'game') {
        document.getElementById('game-menu').style.display = 'block';
        document.getElementById('game-area').style.display = 'none';
        stopGame();
    }

    if (id === 'silence' && music) {
        const slider = document.getElementById('volume-slider');
        music.volume = slider ? slider.value / 100 : 0.5;
        music.play().catch(() => {});
    }

    // Сбрасываем режим удаления при уходе
    deleteMode = false;
    updateDeleteButton();
}

// ===== ГРОМКОСТЬ =====
function changeVolume(val) {
    const music = document.getElementById('silence-music');
    if (music) music.volume = val / 100;
}

// ===== ФРАЗЫ =====
function newPhrase() {
    if (usedPhrases.length >= phrases.length) usedPhrases = [];
    const available = phrases.filter(p => !usedPhrases.includes(p));
    const random = available[Math.floor(Math.random() * available.length)];
    usedPhrases.push(random);
    document.getElementById('phrase-text').textContent = random;
}

// ===== ДНЕВНИК =====
function saveDiary() {
    const text = document.getElementById('diary-input').value.trim();
    if (!text) return;
    const entries = JSON.parse(localStorage.getItem('diary') || '[]');
    entries.push({ text, date: new Date().toLocaleString('ru-RU') });
    localStorage.setItem('diary', JSON.stringify(entries));
    document.getElementById('diary-input').value = '';
    renderDiary();
}

function burnDiary() {
    if (confirm('Удалить все записи навсегда?')) {
        localStorage.removeItem('diary');
        renderDiary();
    }
}

function renderDiary() {
    const entries = JSON.parse(localStorage.getItem('diary') || '[]');
    document.getElementById('diary-entries').innerHTML = entries.map(e =>
        `<div class="diary-entry"><div class="date">${e.date}</div><div>${e.text}</div></div>`
    ).join('');
}

// ===== КОТИКИ =====
function newCat() {
    const img = document.getElementById('cat-image');
    img.src = catImages[Math.floor(Math.random() * catImages.length)];
}

// ===== СВОИ ФОТО =====
let photos = JSON.parse(localStorage.getItem('photos') || '[]');

function savePhotos() {
    localStorage.setItem('photos', JSON.stringify(photos));
}

function uploadPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        photos.push(e.target.result);
        savePhotos();
        renderUserPhotos();
        renderMemoryPreview();
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function deletePhoto(index) {
    photos.splice(index, 1);
    savePhotos();
    renderUserPhotos();
    renderMemoryPreview();
}

function openPhotoViewer(src) {
    if (deleteMode) return;
    document.getElementById('photo-viewer-img').src = src;
    document.getElementById('photo-viewer').classList.add('active');
}

function closePhotoViewer() {
    document.getElementById('photo-viewer').classList.remove('active');
}

function toggleDeleteMode() {
    deleteMode = !deleteMode;
    updateDeleteButton();
    renderUserPhotos();
}

function updateDeleteButton() {
    const btn = document.getElementById('delete-mode-btn');
    if (deleteMode) {
        btn.textContent = '✅ Готово';
        btn.classList.add('active-delete');
    } else {
        btn.textContent = '🗑️ Удалить фото';
        btn.classList.remove('active-delete');
    }
}

function renderUserPhotos() {
    const container = document.getElementById('user-photos');
    container.innerHTML = photos.map((p, i) =>
        `<div class="photo-item" onclick="${deleteMode ? `deletePhoto(${i})` : `openPhotoViewer('${p}')`}">
            <img src="${p}" alt="моё фото">
            <div class="delete-badge" onclick="event.stopPropagation(); deletePhoto(${i})">✕</div>
        </div>`
    ).join('');

    if (deleteMode) {
        container.classList.add('delete-mode');
    } else {
        container.classList.remove('delete-mode');
    }
}

function renderMemoryPreview() {
    const preview = document.getElementById('memory-preview');
    if (!preview) return;
    preview.innerHTML = '';
    if (photos.length === 0) return;
    const three = [...photos].sort(() => Math.random() - 0.5).slice(0, 3);
    three.forEach(p => {
        const img = document.createElement('img');
        img.src = p;
        img.onclick = () => openPhotoViewer(p);
        preview.appendChild(img);
    });
}

// ===== ИГРА =====
let score = 0;
let gameInterval = null;
let gameTimer = null;
let gameMode = '';
let gameTimeLeft = 0;
let fallSpeed = 3000;

const bestScores = JSON.parse(localStorage.getItem('bestScores') || '{}');

function updateBestScoreUI() {
    document.getElementById('best-score').innerHTML =
        `🏆 Лучший счёт — Свободный: ${bestScores['free']||0} | На время: ${bestScores['timed']||0} | Бесконечный: ${bestScores['endless']||0}`;
}

function updateBestScore(mode, s) {
    if (!bestScores[mode] || s > bestScores[mode]) {
        bestScores[mode] = s;
        localStorage.setItem('bestScores', JSON.stringify(bestScores));
    }
    updateBestScoreUI();
}

function stopGame() {
    if (gameInterval) { clearInterval(gameInterval); gameInterval = null; }
    if (gameTimer) { clearInterval(gameTimer); gameTimer = null; }
}

function startGameMode(mode) {
    stopGame();
    gameMode = mode;
    score = 0;
    fallSpeed = 3000;
    document.getElementById('game-menu').style.display = 'none';
    const area = document.getElementById('game-area');
    area.style.display = 'block';
    area.innerHTML = '<div id="game-hud"><span id="game-score">0</span><span id="game-timer"></span></div>';

    if (mode === 'timed') {
        gameTimeLeft = 30;
        document.getElementById('game-timer').textContent = '30с';
        gameTimer = setInterval(() => {
            gameTimeLeft--;
            document.getElementById('game-timer').textContent = gameTimeLeft + 'с';
            if (gameTimeLeft <= 0) endGame();
        }, 1000);
    } else if (mode === 'endless') {
        document.getElementById('game-timer').textContent = '∞';
        gameTimer = setInterval(() => {
            fallSpeed = Math.max(500, fallSpeed - 200);
        }, 10000);
    }

    gameInterval = setInterval(spawnItem, mode === 'endless' ? 600 : 900);
}

function endGame() {
    stopGame();
    updateBestScore(gameMode, score);
    alert(`Игра окончена! Твой счёт: ${score}`);
    document.getElementById('game-menu').style.display = 'block';
    document.getElementById('game-area').style.display = 'none';
}

function stopGameAndBack() {
    if (gameMode) updateBestScore(gameMode, score);
    stopGame();
    document.getElementById('game-menu').style.display = 'block';
    document.getElementById('game-area').style.display = 'none';
    showScreen('wall');
}

function spawnItem() {
    const area = document.getElementById('game-area');
    if (!area || area.style.display === 'none') return;
    const isBeer = Math.random() < 0.2;
    const el = document.createElement('div');
    el.className = isBeer ? 'beer' : 'star';
    el.textContent = isBeer ? '🍺' : '⭐';
    el.style.left = Math.random() * (area.clientWidth - 30) + 'px';
    el.style.animationDuration = (fallSpeed / 1000) + 's';
    el.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isBeer) {
            score = Math.max(0, score - 3);
        } else {
            score++;
        }
        document.getElementById('game-score').textContent = score;
        el.remove();
    });
    el.addEventListener('animationend', () => el.remove());
    area.appendChild(el);
}

// ===== ТРЕВОЖНАЯ КНОПКА =====
let panicTimer;
function togglePanic() {
    const overlay = document.getElementById('panic-overlay');
    overlay.classList.toggle('active');
    if (overlay.classList.contains('active')) {
        let time = 60;
        document.getElementById('panic-timer').textContent = time;
        panicTimer = setInterval(() => {
            time--;
            document.getElementById('panic-timer').textContent = time;
            if (time <= 0) {
                clearInterval(panicTimer);
                overlay.classList.remove('active');
            }
        }, 1000);
    } else {
        clearInterval(panicTimer);
    }
}

// ===== СТАРТ =====
renderDiary();
updateBestScoreUI();
renderUserPhotos();