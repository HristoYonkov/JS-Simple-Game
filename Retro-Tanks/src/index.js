window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 750;
    canvas.height = 500;

    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', (e) => {
                if (e.key == 'ArrowLeft' || e.key == 'ArrowRight' || e.key == 'ArrowUp' || e.key == 'ArrowDown') {
                    if (this.game.lastKey.length < 4 && !this.game.lastKey.includes(e.key)) {
                        this.game.lastKey.push(e.key);
                    }
                }
                if (e.key == 'f') this.game.shoot = 'f';
            });

            window.addEventListener('keyup', (e) => {
                if (e.key == 'ArrowLeft') {
                    const index = this.game.lastKey.indexOf('ArrowLeft');
                    this.game.lastKey.splice(index, 1);
                } else if (e.key == 'ArrowRight') {
                    const index = this.game.lastKey.indexOf('ArrowRight');
                    this.game.lastKey.splice(index, 1);
                } else if (e.key == 'ArrowUp') {
                    const index = this.game.lastKey.indexOf('ArrowUp');
                    this.game.lastKey.splice(index, 1);
                } else if (e.key == 'ArrowDown') {
                    const index = this.game.lastKey.indexOf('ArrowDown');
                    this.game.lastKey.splice(index, 1);
                }
            if (e.key == 'f') this.game.shoot = undefined;
        });
        }
    }

class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.x = 200;
        this.y = 200;
        this.speedX = 0;
        this.speedY = 0;
        this.maxSpeed = 3;
        this.moveDirection = '';
        this.trackA = document.getElementById('track-1-A');
        this.trackB = document.getElementById('track-1-B');
        this.hullImage = document.getElementById('hull');
        this.weaponImage = document.getElementById('weapon');
        this.rotateTankAngle = 0;
        this.rotateWeaponAngle = 0;
        this.currentTracks = this.trackA;
        this.frameCount = 0;
        this.trackSwapInterval = 4;

        // control tracks FPS
        this.tracksFps = 10;
        this.tracksIntervalFrame = 1000 / this.tracksFps;
        this.tracksCounterFrame = 0;

        // control shoot FPS
        this.shootFps = 1;
        this.shootIntervalFrame = 1000 / this.shootFps;
        this.shootCounterFrame = 0;

        // control movement FPS
        this.movementFps = 61;
        this.movementIntervalFrame = 1000 / this.movementFps;
        this.movementCounterFrame = 0;
    }

    draw(context) {
        // Draw the player Tank
        context.save();
        // Translate to the center of the tank before rotating
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        // Apply the rotation
        context.rotate(this.rotateTankAngle);
        // Draw the hull, tracks and weapon, adjusting positions to account for rotation
        context.drawImage(this.currentTracks, - 36, - 50, 23, 103);
        context.drawImage(this.currentTracks, 13, - 50, 23, 103);
        context.drawImage(this.hullImage, - this.width / 2, - this.height / 2, this.width, this.height);
        context.drawImage(this.weaponImage, - this.width / 2 + 32, - this.height / 2, this.width - 64, this.height - 20);

        context.restore();
    }

    updateTracks() {
        if (this.tracksCounterFrame > this.tracksIntervalFrame) {
            this.currentTracks === this.trackA
                ? this.currentTracks = this.trackB
                : this.currentTracks = this.trackA;
                this.tracksCounterFrame = 0;
        }
    }

    setSpeed(speedX, speedY) {
        this.speedX = speedX;
        this.speedY = speedY;
    }

    update(deltaTime) {
        // player shooting
        if (this.game.shoot == 'f') {
            if (this.shootCounterFrame > this.shootIntervalFrame) {
                this.game.lightShells.push(new LightShell(this.game));
                this.shootCounterFrame = 0;
            }
        }
        this.shootCounterFrame += deltaTime;

        // update tracks
        if (this.game.lastKey.length > 0) {
            this.updateTracks(deltaTime);
        }
        this.tracksCounterFrame += deltaTime;
        
        // player movement
        this.moveDirection = this.game.lastKey.length > 0 ? this.game.lastKey[this.game.lastKey.length - 1] : '';
        if (this.moveDirection == 'ArrowLeft') {
            this.rotateTankAngle = 3 * Math.PI / 2;
            this.setSpeed(- this.maxSpeed, 0);
        } else if (this.moveDirection == 'ArrowRight') {
            this.rotateTankAngle = Math.PI / 2;
            this.setSpeed(this.maxSpeed, 0);
        } else if (this.moveDirection == 'ArrowUp') {
            this.rotateTankAngle = 0;
            this.setSpeed(0, - this.maxSpeed);
        } else if (this.moveDirection == 'ArrowDown') {
            this.rotateTankAngle = Math.PI;
            this.setSpeed(0, this.maxSpeed);
        } else {
            this.setSpeed(0, 0);
        }
        if (this.movementCounterFrame > this.movementIntervalFrame) {
            this.movementCounterFrame = 0;
            this.x += this.speedX;
            this.y += this.speedY;
        }
        this.movementCounterFrame += deltaTime;


        // player boundaries
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > this.game.width - this.width) {
            this.x = this.game.width - this.width
        }
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y > this.game.height - this.height) {
            this.y = this.game.height - this.height;
        }
    }
}

class LightShell {
    constructor(game) {
        this.game = game;
        this.image = document.getElementById('Light-Shell');
        this.player = this.game.player;
        this.x = this.player.x + this.player.width / 2;
        this.y = this.player.y + this.player.height / 2;
        this.speed = 10;
        this.rotateAngle = this.game.player.rotateTankAngle - Math.PI / 2;

        // Control travel FPS
        this.travelFps = 61;
        this.travelIntervalFrame = 1000 / this.travelFps;
        this.travelCounterFrame = 0;
    }
    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotateAngle + Math.PI / 2);
        context.drawImage(this.image, -40, -80, 80, 80);
        context.restore();
    }
    update(deltaTime) {
        if (this.travelCounterFrame > this.travelIntervalFrame) {
            this.x += this.speed * Math.cos(this.rotateAngle);
            this.y += this.speed * Math.sin(this.rotateAngle);
            this.travelCounterFrame = 0;
        }
        this.travelCounterFrame += deltaTime;
    }
}

class Object {
    constructor(game) {
        this.game = game;
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update() {

    }
}

class Skull extends Object {
    constructor(game) {
        super(game);
        this.game = game;
        this.image = document.getElementById('skull');
        this.width = 100;
        this.height = 100;
        this.x = Math.random() * (this.game.width - this.width);
        this.y = Math.random() * (this.game.height - this.height);
    }
}
class Tree extends Object {
    constructor(game) {
        super(game);
        this.game = game;
        this.image = document.getElementById('tree');
        this.width = 100;
        this.height = 100;
        this.x = Math.random() * (this.game.width - this.width);
        this.y = Math.random() * (this.game.height - this.height);
    }
}
class Cactus extends Object {
    constructor(game) {
        super(game);
        this.game = game;
        this.image = document.getElementById('cactus');
        this.width = 100;
        this.height = 100;
        this.x = Math.random() * (this.game.width - this.width);
        this.y = Math.random() * (this.game.height - this.height);
    }
}

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.lastKey = [];
        this.shoot = undefined;
        this.input = new InputHandler(this);
        this.player = new Player(this);
        this.numberOfObjects = 6;
        this.objects = [];
        this.lightShells = [];
        this.layerObjects = [];
    }
    render(context, deltaTime) {
        this.lightShells.forEach(shell => {
            if (shell.x > this.width || shell.y > this.height) {
                this.lightShells.shift();
            }
        });
        this.lightShells.forEach(shell => shell.draw(context));
        this.lightShells.forEach(shell => shell.update(deltaTime));

        this.layerObjects = [this.player, ...this.objects];
        this.layerObjects.sort((a, b) => {
            return (a.y + a.height) - (b.y + b.height);
        });
        this.layerObjects.forEach(object => {
            object.draw(context);
            object.update(deltaTime);
        });

        // this.player.draw(context);
        // this.player.update();
        // this.objects.forEach(obj => obj.draw(context));
    }
    initObjects() {
        for (let i = 0; i < this.numberOfObjects; i++) {
            if (i < this.numberOfObjects / 3) this.objects.push(new Skull(this))
            else if (i < this.numberOfObjects / 3 + this.numberOfObjects / 3) this.objects.push(new Cactus(this))
            else this.objects.push(new Tree(this))
        }
    }
}

const game = new Game(canvas.width, canvas.height);
game.initObjects();

let lastTime = 0;

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, deltaTime);

    requestAnimationFrame(animate);
}
animate(0);
});

console.log('hello game');
