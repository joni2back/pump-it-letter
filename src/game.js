/**
 * @author Jonas Sciangula Street <joni2back@gmail.com>
 */

Math.fromto = function (from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
};

var PumpItLetter = function() {
    this.fps = 60;
    this.canvas = null;
    this.width = 0;
    this.height = 0;
    this.minVelocity = 60;
    this.maxVelocity = 150;
    this.maxLetters = 10;
    this.intervalId = 0;
    this.background = '#000';

    this.score = 0;
    this.losed = 0;
    this.letters = [];
    this.collisionBar;
};

PumpItLetter.prototype.init = function (div) {
    var self = this;

    self.containerDiv = div;
    self.width = window.innerWidth;
    self.height = window.innerHeight;
    self.collisionBar = new CollisionBar(self.height * 75 / 100);

    window.onresize = function (event) {
        self.width = window.innerWidth;
        self.height = window.innerHeight;
        self.canvas.width = self.width;
        self.canvas.height = self.height;
        self.collisionBar.y = self.height * 75 / 100;
        self.draw();
    };

    var canvas = document.createElement('canvas');
    div.appendChild(canvas);
    self.canvas = canvas;
    self.canvas.width = self.width;
    self.canvas.height = self.height;

    document.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    }, false);

    document.addEventListener("keydown", function (e) {
        var key = e.which || e.keyCode;
        self.parseKeys(key);
    }, true);
};

PumpItLetter.prototype.start = function () {
    var xCenter = this.canvas.width / 2;
    var yCenter = this.canvas.height / 2;
    this.run();
};

PumpItLetter.prototype.pause = function () {
    clearInterval(this.intervalId);
};

PumpItLetter.prototype.run = function () {
    var self = this;
    this.intervalId = setInterval(function () {
        self.draw();
    }, 1000 / this.fps);

    setInterval(function () {
        self.workLetters();
    }, 2000);
};

PumpItLetter.prototype.parseKeys = function(keyPressed) {
    var self = this;
    for (var itemKey in self.letters) {
        var letter = self.letters[itemKey];
        if (keyPressed === letter.getKeyCode()) {
            if (self.collisionBar.checkCollision(letter)) { //collision
                return self.onLetterAssertion(itemKey);
            }
        }
    }
};

PumpItLetter.prototype.onLetterAssertion = function(itemKey) {
    var self = this;
    var letter = self.letters[itemKey];
    var temp;

    new Audio('happy.wav').play();
    self.score += 1;
    letter.color = 'red'; //dissapear effect
    temp = setInterval(function () {
        letter.visible = false;
        clearInterval(temp);
    }, 60);
};

PumpItLetter.prototype.draw = function () {
    var self = this;
    var ctx = this.canvas.getContext("2d");
    var scoreSprite = new Letter('Score: ' + self.score.toString(), 10, 30, 'yellow');
    var losedSprite = new Letter('Losed: ' + self.losed.toString(), 150, 30, 'red');
    scoreSprite.size = losedSprite.size = 25;

    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, this.width, this.height);

    self.drawLine(self.collisionBar, ctx);
    self.drawLetters(ctx);
    self.drawLetter(scoreSprite, ctx);
    self.drawLetter(losedSprite, ctx);
};

PumpItLetter.prototype.workLetters = function (ctx) {
    var self = this;
    if (self.letters.length < self.maxLetters) {
        self.letters.push(
            Letter.prototype.buildRandom(
                Math.fromto(50, self.canvas.width) - 50, 0
            )
        );
    }
};

PumpItLetter.prototype.drawLetters = function (ctx) {
    var self = this;

    for (var item in self.letters) {
        var letter = self.letters[item];
        var threshold = letter.size;
        letter.y += 2;
        if (letter.y > self.canvas.height + threshold / 2) {;
            letter.regenerate(Math.fromto(threshold, self.canvas.width) - threshold);
            self.losed += 1;
        }
        letter.visible ? self.drawLetter(letter, ctx) : void(0);
    }
};

PumpItLetter.prototype.drawLetter = function (Letter, ctx) {
    ctx.fillStyle = Letter.color;
    ctx.font = Letter.getStyleForCanvas();
    ctx.fillText(Letter.value, Letter.x, Letter.y);
};

PumpItLetter.prototype.drawLine = function (CollisionBar, ctx) {
    ctx.lineWidth = CollisionBar.height || 50;
    ctx.strokeStyle = CollisionBar.color;
    ctx.beginPath();
    ctx.moveTo(0, CollisionBar.y);
    ctx.lineTo(this.canvas.width, CollisionBar.y);
    ctx.stroke();
};

var CollisionBar = function(y, height, color) {
    this.color = color || '#fff';
    this.height = height || 50;
    this.y = y || 0;
};

CollisionBar.prototype.checkCollision = function(Letter, threshold) {
    threshold = threshold || 10;
    return Letter.y + threshold >= this.y &&
           Letter.y - threshold <= this.height + this.y;
};

var Letter = function(value, x, y, color) {
    this.value = value || '';
    this.color = color || '#fff';
    this.size = 45;
    this.bold = true;
    this.italic = false;
    this.family = 'Architects Daughter';
    this.visible = true;
    this.x = x || 0;
    this.y = y || 0;
};

Letter.prototype.regenerate = function(x) {
    this.y = 0;
    this.x = x;
    this.value = this.getRandomLetter();
    this.color = '#fff';
    this.visible = true;
    return this;
};

Letter.prototype.getKeyCode = function() {
    return this.value.charCodeAt();
};

Letter.prototype.getStyleForCanvas = function() {
    var fontString = '';
    fontString += this.bold ? 'bold ' : ' ';
    fontString += this.size ? this.size + 'px ' : '45px ';
    fontString += this.family ? this.family : 'Arial';
    return fontString;
};

Letter.prototype.buildFromKeyCode = function(value) {
    return new Letter(String.fromCharCode(value));
};
Letter.prototype.getRandomLetter = function() {
    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var randomPoz = Math.floor(Math.random() * charSet.length);
    var letter = charSet.substring(randomPoz,randomPoz + 1);
    return letter;
};

Letter.prototype.buildRandom = function(x, y, color) {
    return new Letter(this.getRandomLetter(), x, y, color);
};
