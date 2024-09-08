window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 750;
    canvas.height = 500;

    class InputHandler {
        constructor(game) {
            this.game = game
            window.addEventListener('keydown', (e) => {
                this.game.lastKey = 'P' + e.key;
            });
            window.addEventListener('keyup', (e) => {
                this.game.lastKey = 'R' + e.key;
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
            this.hullImage = document.getElementById('hull');
            this.weaponImage = document.getElementById('weapon');
            this.weaponRotation = 0;  // Rotation angle of the weapon
        }
        draw(context) {
            // Draw the player Tank
            context.drawImage(this.hullImage, this.x, this.y, this.width, this.height);
            context.drawImage(this.weaponImage, this.x + 30, this.y, this.width - 60, this.height - 20);
        }

        setSpeed(speedX, speedY) {
            this.speedX = speedX;
            this.speedY = speedY;
        }

        // player movement
        update() {
            if (this.game.lastKey == 'PArrowLeft') {
                this.setSpeed(- this.maxSpeed, 0);
            } else if (this.game.lastKey == 'PArrowRight') {
                this.setSpeed(this.maxSpeed, 0);
            } else if (this.game.lastKey == 'PArrowUp') {
                this.setSpeed(0, - this.maxSpeed);
            } else if (this.game.lastKey == 'PArrowDown') {
                this.setSpeed(0, this.maxSpeed);
            } else {
                this.setSpeed(0, 0);
            }

            this.x += this.speedX;
            this.y += this.speedY;

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

    class Object {

    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.lastKey = undefined;
            this.input = new InputHandler(this);
            this.player = new Player(this)
        }
        render(context) {
            this.player.draw(context);
            this.player.update();
        }
    }

    const game = new Game(canvas.width, canvas.height);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});