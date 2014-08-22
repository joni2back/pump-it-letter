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
    this.intervalId = 0;
    this.background = '#000';

    this.score = 0;
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
    }, 1000);
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
    letter.color = 'red';//dissapear effect

    temp = setInterval(function () {
        self.letters.splice(itemKey, 1);
        clearInterval(temp);
    }, 60);
};

PumpItLetter.prototype.draw = function () {
    var self = this;
    var ctx = this.canvas.getContext("2d");

    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, this.width, this.height);

    self.drawLine(self.collisionBar, ctx);
    self.drawLetters(ctx);
    self.drawLetter(new Letter('Score: ' + self.score.toString(), 10, 50, 'yellow'), ctx);
};

PumpItLetter.prototype.workLetters = function (ctx) {
    var self = this;
    if (self.letters.length < 20) {
        self.letters.push(
            Letter.prototype.buildRandom(
                Math.fromto(20, self.canvas.width) - 50, 0
            )
        );
    }
};

PumpItLetter.prototype.drawLetters = function (ctx) {
    var self = this;
    for (var item in self.letters) {
        var letter = self.letters[item];
        letter.y += 3;
        if (letter.y > self.canvas.height) {
            //new Audio('sad.wav').play();
            letter.y = 0;
        }
        self.drawLetter(letter, ctx);
    }
};

PumpItLetter.prototype.drawLetter = function (Letter, ctx) {
    ctx.fillStyle = Letter.color;
    ctx.font = "bold 46px Arial";
    ctx.fillText(Letter.value, Letter.x, Letter.y);
};

PumpItLetter.prototype.drawLine = function (CollisionBar, ctx) {
    var self = this;
    ctx.lineWidth = CollisionBar.height || 50;
    ctx.strokeStyle = CollisionBar.color;
    ctx.beginPath();
    ctx.moveTo(0, CollisionBar.y);
    ctx.lineTo(self.canvas.width, CollisionBar.y);
    ctx.stroke();
};

var CollisionBar = function(y, height, color) {
    this.color = color || 'white';
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
    this.color = color || 'white';
    this.size = '';
    this.x = x || 0;
    this.y = y || 0;
};

Letter.prototype.getKeyCode = function() {
    return this.value.charCodeAt();
};

Letter.prototype.buildFromKeyCode = function(value) {
    return new Letter(String.fromCharCode(value));
};

Letter.prototype.buildRandom = function(x, y, color) {
    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var randomPoz = Math.floor(Math.random() * charSet.length);
    var word = charSet.substring(randomPoz,randomPoz + 1);
    return new Letter(word, x, y, color);
};