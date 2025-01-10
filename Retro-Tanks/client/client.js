window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 750;
  canvas.height = 500;

  const socket = io();
  let localPlayerID;

  class Player {
    constructor({ game, x, y, isLocalPlayer = false }) {
      this.game = game;
      this.width = 100;
      this.height = 100;
      this.x = x;
      this.y = y;
      this.isLocalPlayer = isLocalPlayer;
      this.speedX = 0;
      this.speedY = 0;
      this.maxSpeed = 3;
      this.direction = 'up';
      this.moveDirection = '';
      this.trackA = document.getElementById('track-1-A');
      this.trackB = document.getElementById('track-1-B');
      this.hullImage = document.getElementById(this.isLocalPlayer ? 'blue-hull' : 'red-hull');
      this.weaponImage = document.getElementById(this.isLocalPlayer ? 'blue-weapon' : 'red-weapon');
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
      // Rotate the tank
      context.rotate(this.rotateTankAngle);
      // Draw the hull, tracks and weapon, adjusting positions to account for rotation
      context.drawImage(this.currentTracks, - 36, - 50, 23, 103);
      context.drawImage(this.currentTracks, 13, - 50, 23, 103);
      context.drawImage(this.hullImage, - this.width / 2, - this.height / 2, this.width, this.height);

      // Rotate the weapon
      context.save();
      // In this case translation takes the center of the tank + 18 "y" coords.
      context.translate(0, 18);
      context.rotate(this.rotateWeaponAngle);
      context.drawImage(this.weaponImage, - this.width / 2 + 32, - this.height / 1.47, this.width - 64, this.height - 20);

      context.restore();
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
      this.movementCounterFrame += deltaTime;
      this.shootCounterFrame += deltaTime;
      this.tracksCounterFrame += deltaTime;

      // player shooting
      if (this.game.shoot == 'f') {
        if (this.shootCounterFrame > this.shootIntervalFrame) {
          this.game.lightShells.push(new LightShell(this.game));
          this.shootCounterFrame = 0;
        }
      }

      // update tracks
      if (this.game.lastKey.length > 0) {
        this.updateTracks();
      }

      // player movement
      this.moveDirection = this.game.lastKey.length > 0 ? this.game.lastKey[this.game.lastKey.length - 1] : '';
      if (this.moveDirection == 'ArrowLeft') {
        this.direction = 'left';
        this.rotateTankAngle = 3 * Math.PI / 2;
        this.setSpeed(- this.maxSpeed, 0);
      } else if (this.moveDirection == 'ArrowRight') {
        this.direction = 'right';
        this.rotateTankAngle = Math.PI / 2;
        this.setSpeed(this.maxSpeed, 0);
      } else if (this.moveDirection == 'ArrowUp') {
        this.direction = 'up';
        this.rotateTankAngle = 0;
        this.setSpeed(0, - this.maxSpeed);
      } else if (this.moveDirection == 'ArrowDown') {
        this.direction = 'down';
        this.rotateTankAngle = Math.PI;
        this.setSpeed(0, this.maxSpeed);
      } else {
        this.setSpeed(0, 0);
      }
      if (this.movementCounterFrame > this.movementIntervalFrame) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.movementCounterFrame = 0;
      }

      // player boundaries
      // For optimization may be update with ternary operator..
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

  class Game {
    constructor(width, height, players) {
      this.width = width;
      this.height = height;
      this.lastKey = [];
      this.shoot = undefined;
      // this.input = new InputHandler(this);
      this.numberOfObjects = 6;
      this.objects = [];
      this.lightShells = [];
      this.layerObjects = [];
    }
    render(context, deltaTime, players) {
      for (const id in players) {
        const player = players[id];
        player.draw(context);
        player.update(deltaTime);
      }
    }
  }

  const clientPlayers = {};

  socket.on('updatePlayers', (serverPlayers) => {
    localPlayerID = socket.id;

    for (const id in serverPlayers) {
      const serverPlayer = serverPlayers[id];

      if (!clientPlayers[id]) {
        clientPlayers[id] = new Player({ game, x: serverPlayer.x, y: serverPlayer.y, isLocalPlayer: id === localPlayerID });
      }
    }

    for (const id in clientPlayers) {
      if (!serverPlayers[id]) {
        delete clientPlayers[id];
      }
    }
    console.log(clientPlayers);
  })

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, deltaTime, clientPlayers);

    requestAnimationFrame(animate);
  }
  animate(0);

  window.addEventListener('keydown', (e) => {
    if (!clientPlayers[socket.id]) return;

    switch (e.key) {
      case 'ArrowUp':
        clientPlayers[socket.id].y -= 5
        break;
      case 'ArrowDown':
        clientPlayers[socket.id].y += 5
        break;
      case 'ArrowLeft':
        clientPlayers[socket.id].x -= 5
        break;
      case 'ArrowRight':
        clientPlayers[socket.id].x += 5
        break;
    }
  });
});

