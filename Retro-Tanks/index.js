window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 500;

    class InputHandler {

    }

    class Player {

    }

    class Object {

    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.heigth = height;
        }
    }

    const game = new Game(canvas.width, canvas.height);
    console.log(game);
    
});