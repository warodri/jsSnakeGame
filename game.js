
function setup() {
	canvasWidth = windowWidth;
	canvasHeight = 300;
	createCanvas(canvasWidth, canvasHeight);
	setFrameRate(initialFps)
	f.createRandomFood();
}

function draw() {
	background(51)
	f.draw();
	s.update();
	s.draw();
	if (isDeadth() || s.isAutoCollission()) {
		console.log("DIE!");
		setFrameRate(initialFps)
		s = null; s = new Snake();
	}
	if (eaten()) {
		f.createRandomFood();
		s.increaseTailSize();
		totalEatens ++;
		if (totalEatens >= 5) {
			fps ++
			setFrameRate(fps);
			totalEatens = 0;
		}
	}
}

function keyPressed() {
	if (keyCode === UP_ARROW) s.move(0, -1);
	if (keyCode === DOWN_ARROW) s.move(0, 1);
	if (keyCode === RIGHT_ARROW) s.move(1, 0);
	if (keyCode === LEFT_ARROW) s.move(-1, 0);
}

class Food {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.w = 20;
		this.h = 20;
	}
	createRandomFood() {
		this.x = random(canvasWidth); this.y = random(canvasHeight);
		if (this.x + this.w > canvasWidth) this.createRandomFood();
		if (this.y + this.h > canvasHeight) this.createRandomFood();
	}
	draw() {
		fill(200, 0, 100);
		rect(this.x, this.y, this.w, this.h);
	}
	getX() { return this.x; }
	getY() { return this.y; }
}

class Snake {
	constructor() {
		this.x = 0; this.y = 0; this.w = 20; this.h = 20;
		this.speedx = 1; this.speedy = 0;
		this.arrTail = [{x:this.x, y:this.y}];
		this.tailContent = 1;
	}
	update() {
		this.x = this.x + this.speedx * this.w;
		this.y = this.y + this.speedy * this.h;
		this.addToTail(this.x, this.y);
	}
	draw() {
		let startSlice = this.arrTail.length - this.tailContent;
		let arrSize = this.arrTail.length;
		this.arrTail = this.arrTail.slice(startSlice, arrSize);
		for (let i=0; i < this.arrTail.length; i++) {
			fill(255);
			rect(this.arrTail[i].x, this.arrTail[i].y, this.w, this.h);
		}
	}
	addToTail(x,y) {
		this.arrTail.push({x:x, y:y});
	}
	move(x, y) {
		this.speedx = x; this.speedy = y;
	}
	getHeadPos() {
		return this.arrTail[this.arrTail.length - 1];
	}
	increaseTailSize() {
		this.tailContent ++;
	}
	isAutoCollission() {
		if (this.tailContent == 1) return false;
		let headPos = this.getHeadPos();
		for (let i=0; i < this.arrTail.length - 1; i++) {
			let e = this.arrTail[i];
			let d = dist(headPos.x, headPos.y, e.x, e.y);
			if (d < 1) return true;
		}
		return false;
	}
}


function isDeadth() {
	let x = s.getHeadPos().x; let y = s.getHeadPos().y;
	if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) return true;
	return false;
}

function eaten() {
	let snakeX = s.getHeadPos().x; let snakeY = s.getHeadPos().y;
	let d = dist(snakeX ,snakeY, f.getX(), f.getY());
	return d < 20;
}


var canvasWidth;
var canvasHeight;
var initialFps = 5;
var fps = initialFps;
var totalEatens = 0;

var f = new Food();
var s = new Snake();
