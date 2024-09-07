window.addEventListener('load', function() {
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

    }

    class Object {

    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.heigth = height;
            this.lastKey = undefined;
            this.input = new InputHandler(this);
        }
    }

    const game = new Game(canvas.width, canvas.height);
    
});