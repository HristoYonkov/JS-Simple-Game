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
            this.trackA = document.getElementById('track-1-A');
            this.trackB = document.getElementById('track-1-B');
            this.hullImage = document.getElementById('hull');
            this.weaponImage = document.getElementById('weapon');
            this.rotateTankAngle = 0;
            this.rotateWeaponAngle = 0;
            this.currentTracks = this.trackA;
            this.frameCount = 0;
            this.trackSwapInterval = 2;
        }

        draw(context) {
            // Draw the player Tank
            // Save the current canvas state
            context.save();
            // Translate to the center of the tank before rotating
            context.translate(this.x + this.width / 2, this.y + this.height / 2);
            // Apply the rotation
            context.rotate(this.rotateTankAngle);
            // Draw the hull, tracks and weapon, adjusting positions to account for rotation
            context.drawImage(this.currentTracks, - 36, - 50, 23, 103);
            context.drawImage(this.currentTracks, 13, - 50, 23, 103);
            context.drawImage(this.hullImage, -this.width / 2, -this.height / 2, this.width, this.height);
            context.drawImage(this.weaponImage, -this.width / 2 + 32, -this.height / 2, this.width - 64, this.height - 20);
            context.restore();
        }

        updateTracks() {
            this.frameCount++;
            if (this.frameCount % this.trackSwapInterval === 0) {
                // Swap tracks
                this.currentTracks === this.trackA
                    ? this.currentTracks = this.trackB
                    : this.currentTracks = this.trackA
            }
        }

        setSpeed(speedX, speedY) {
            this.speedX = speedX;
            this.speedY = speedY;
        }

        // player movement
        update() {
            if (this.game.lastKey === 'PArrowLeft' || this.game.lastKey === 'PArrowRight' ||
                this.game.lastKey === 'PArrowUp' || this.game.lastKey === 'PArrowDown') {
                this.updateTracks();
            }

            if (this.game.lastKey == 'PArrowLeft') {
                this.rotateTankAngle = 3 * Math.PI / 2;
                this.setSpeed(- this.maxSpeed, 0);
            } else if (this.game.lastKey == 'RArrowLeft' && this.speedX < 0) {
                this.rotateTankAngle = 3 * Math.PI / 2;
                this.setSpeed(0, 0);
            } else if (this.game.lastKey == 'PArrowRight') {
                this.rotateTankAngle = Math.PI / 2;
                this.setSpeed(this.maxSpeed, 0);
            } else if (this.game.lastKey == 'RArrowRight' && this.speedX > 0) {
                this.rotateTankAngle = Math.PI / 2;
                this.setSpeed(0, 0);
            } else if (this.game.lastKey == 'PArrowUp') {
                this.rotateTankAngle = 0;
                this.setSpeed(0, - this.maxSpeed);
            } else if (this.game.lastKey == 'RArrowUp' && this.speedY < 0) {
                this.rotateTankAngle = 0;
                this.setSpeed(0, 0);
            } else if (this.game.lastKey == 'PArrowDown') {
                this.rotateTankAngle = Math.PI;
                this.setSpeed(0, this.maxSpeed);
            } else if (this.game.lastKey == 'RArrowDown' && this.speedY > 0) {
                this.rotateTankAngle = Math.PI;
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
        render(context, deltaTime) {
            this.player.draw(context);
            this.player.update();
        }
    }

    const game = new Game(canvas.width, canvas.height);
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