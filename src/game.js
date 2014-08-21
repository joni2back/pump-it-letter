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

    this.letters = [];
};

PumpItLetter.prototype.init = function (div) {
    var self = this;

    self.containerDiv = div;
    self.width = window.innerWidth;
    self.height = window.innerHeight;

    window.onresize = function (event) {
        self.width = window.innerWidth;
        self.height = window.innerHeight;
        self.canvas.width = self.width;
        self.canvas.height = self.height;
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

    for (var item in self.letters) {
        var letter = self.letters[item];

        if (keyPressed === letter.getKeyCode()) {
            letter.color = 'red';
        }
    }
};

PumpItLetter.prototype.draw = function () {
    var ctx = this.canvas.getContext("2d");

    //Draw the background.
    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, this.width, this.height);

    var self = this;

    self.drawLetters(ctx);
    self.drawLine(ctx);
};

////////////////////////////////////////////////////////////////////////////////

PumpItLetter.prototype.workLetters = function (ctx) {
    var self = this;
    if (self.letters.length < 20) {
        self.letters.push(
            Letter.prototype.buildRandom(
                Math.fromto(0, self.canvas.width) - 50,
                0
            )
        );
    }
};

PumpItLetter.prototype.drawLetters = function (ctx) {
    var self = this;

    for (var item in self.letters) {
        var letter = self.letters[item];
        letter.y += 5;

        if (letter.y > self.canvas.height) {
            letter.y = 0;
        }

        self.drawLetter(letter, ctx);
    }
};

PumpItLetter.prototype.drawLetter = function (Letter, ctx) {
    ctx.fillStyle = Letter.color;
    ctx.font = "bold 56px Arial";
    ctx.fillText(Letter.value, Letter.x, Letter.y);
};

PumpItLetter.prototype.drawLine = function (ctx) {
    var self = this;
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#8ED6FF';
    ctx.beginPath();
    ctx.moveTo(0, self.canvas.height * 75 / 100);
    ctx.lineTo(self.canvas.width, self.canvas.height * 75 / 100);
    ctx.stroke();
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Letter = function(value, x, y) {
    this.value = value || '';
    this.color = 'white';
    this.size = '';
    this.x = x || 0;
    this.y = y || 0;
};

Letter.prototype.getKeyCode = function(value) {
    return this.value.charCodeAt();
};

Letter.prototype.buildFromKeyCode = function(value) {
    return new Letter(String.fromCharCode(value));
};

Letter.prototype.buildRandom = function(x, y) {
    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var randomPoz = Math.floor(Math.random() * charSet.length);
    var word = charSet.substring(randomPoz,randomPoz + 1);
    return new Letter(word, x, y);
};