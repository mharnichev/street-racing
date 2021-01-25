const score = document.querySelector('.score'),
	  start = document.querySelector('.start'),
	  gameArea = document.querySelector('.gameArea'),
	  car = document.createElement('div'),
	  music = document.createElement('embed');
	  
	//   music = document.createElement('audio'); менее кроссбраузерный способ вставки музыки

	music.setAttribute('src', '../song/02-Get Up (I Feel Like Being A) Sex Machine (Pt. 1 & 2).flac');
	music.setAttribute('type', '../song/flac');
	music.classList.add('music')

	car.classList.add('car');

start.addEventListener('click', startGame );
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false,   // дефаулт значения кнопок
};

const setting = {
	start: false,
	score: 0,
	speed: 10,
	traffic: 3, // другие машины на дороге
};

function getQuantityElements(heightElement){ // Создаем функц для проверки скок элементов можем вместить на экран
	return Math.floor(gameArea.offsetHeight / heightElement) + 1; // высота нашего окна  делим на высоту нашего элемента
};

function startGame() {
	start.classList.add('hide');
	gameArea.innerHTML = ''; // затираем все чтоб при уварии и новой игре все начиналась сначла

	for (let i = 0; i < getQuantityElements(100)+ 1; i++) { // цикл для создание полос на дороге
		const line = document.createElement('div'); // добавляем див
		line.classList.add('line'); // добавляем этому диву класс где описанные полоски
		line.style.top = ( i * 100 ) + 'px'; // расстояние между этими линиями
		line.y = i * 100; // создаем условие чтоб после им манипулировать, начнем изменять его чтоб придать эффект движения машины по дороге
		gameArea.appendChild(line); // добавляем сами линии уже на сому дорогу 	
	}; 
	for ( let i = 0; i < getQuantityElements(100 * setting.traffic); i++){ // создаем припятствия умнажая элементы на наш траффик
		const enemy = document.createElement('div'); // создаю обычный див 
		enemy.classList.add('enemy'); // добавляем диву класс
		let enemyImg = Math.floor(Math.random() * 2) + 1; // рандом картинок с машинками 
		enemy.y = -100 * setting.traffic * (i + 1); // создаем сам объект 
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'; // рандомное появления автомобилей
		enemy.style.top = enemy.y + 'px'; // расстояние от верха игры 
		enemy.style.background = `transparent url(./image/enemy${enemyImg}.png) center / cover no-repeat`; // новая обертка для других тачек 
		gameArea.appendChild(enemy); // добавляем олько собраные пак автомобиля
	};
	setting.score = 0;
	setting.start = true;
	gameArea.appendChild(car);
	car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2; // делам так, чтоб всегда старт были по серидине снизу
	car.style.top = 'auto';
	car.style.bottom = '10px'; // всегда снизу 
	gameArea.appendChild(music);
	// music.setAttribute('autoplay', true); // создаем музыку, и так же нужно передать что-то 2м параметром, передаем буевное значение 
	// music.setAttribute('src', '../song/02-Get Up (I Feel Like Being A) Sex Machine (Pt. 1 & 2).flac');
	// music.setAttribute('controls', true); // добавляем панель управления звуком
	gameArea.appendChild(music); // вставляем в наш ДОМ плашку с музыкой
	setting.y = car.offsetTop; // создаем значение движения вверх
	setting.x = car.offsetLeft;	 // создаем значение движение влево
	requestAnimationFrame(playGame);
};

function playGame() {
	if (setting.start){
		setting.score += setting.speed; // умножаем счетчик на скорость в игре
		score.innerHTML = 'SCORE<br>' + setting.score; // счетчик 
		moveRoad();
		moveEnemy();
		if(keys.ArrowLeft && setting.x > 0){ // после && setting.x > 0 - чтоб машинка не заезжала за край
			setting.x -= setting.speed; // если двигаем влево, то уменьшаем значение + изменяем его взависимости от переменной скорости
		}
		if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){ // setting.x < ширины дороги минус ширина машины
			setting.x += setting.speed; //а если вправа - то просто увеличиваем значение + изменяем скорость автомобиля от режима скорости в setting.speed
		}
		if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){ // setting.y < высоты нашей дороги минус ширина машины
			setting.y += setting.speed;
		}
		if (keys.ArrowUp && setting.y > 0){ 
			setting.y -= setting.speed;
		};
		car.style.top = setting.y + 'px'; // добавляем изменения положения машины по оси 'Y'
		car.style.left = setting.x + 'px'; // обращаюсь к стилям моей машины и изменяю ее положение 
		requestAnimationFrame(playGame); // отслеживает постоянное изменения значения 
	};
};

function startRun(event) {
	event.preventDefault();	
	if (keys.hasOwnProperty(event.key)){
		keys[event.key] = true; // присваеваем новое значение после нажатия с массива кейс
	};
};

function stopRun(event) {
	event.preventDefault();
	if (keys.hasOwnProperty(event.key)){ // Проверка, только нужные кнопки получают новые свойства те, что указанны ArrowLeft/Right/Up/Down
		keys[event.key] = false; // когда отпускаю кнопку, меняю значения на false
	};
};

function moveRoad() {
	let lines = document.querySelectorAll('.line'); // получили все линии с классом line 
	lines.forEach(function(line){ // line - наши полоски 
		line.y += setting.speed; // движения полосок согласовано с скоростью режима 
		line.style.top = line.y + 'px';  // прибавдяем к статичному положение новое значение цикла Y и тем самым, он меняется
		if (line.y >= gameArea.offsetHeight) { // мы получаем высоту дороги и позиции полосок
			line.y = -100; // как только полоска опускается ниже gameArea, возвращаем ее обратно меняя значение Y на 0
		}
	});
};


function moveEnemy(){ // Заставим  наши тачки выезжать нам на встреч
	let enemy = document.querySelectorAll('.enemy'); // они уже есть в ДОМе, теперь берем их все
	enemy.forEach(function (item) { // перебираем нашиполученные машинки
		let carRect = car.getBoundingClientRect(); // Данное расположение нашей машины 
		let enemyRect = item.getBoundingClientRect(); // Данное расположение рандомных машин 
		if (carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left    // условия столкновения машины пользователя с другими
			&& carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top) {
				setting.start = false; // game over
				console.warn('D-T-P');
				start.classList.remove('hide');
				score.style.top = start.offsetHeight;
		};
		item.y += setting.speed / 2; // так же соизмеримо скорости, меняем полежение наших тачек
		item.style.top = item.y + 'px'; // снова добавлчем в клас постоянное изменение положения наших тачек
		if (item.y >=  gameArea.offsetHeight){  
			item.y = -100 * setting.traffic; 
			item.style.left - Math.floor(Math.random() * (gameArea .offsetWidth - 50)) + 'px';
		};
	});
 };