import { useEffect, useRef } from 'react';
import { collusion } from '../data/collusion';
// import afad from "../../public/"
const MapCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const offset = { x: -750, y: -600 };
    const collusionMap = [];
    for (let i = 0; i < collusion.length; i += 70) {
      const x = collusion.slice(i, i + 70);
      collusionMap.push(x);
    }

    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    const image = new Image();
    image.src = '/Pellet Town.png';
    const foreimage = new Image();
    foreimage.src = '/Pellet Town_fore.png';
    console.log(foreimage.src)
    const playerImage = new Image();
    playerImage.src = '/playerDown.png';
    const playerUpImage = new Image();
    playerUpImage.src = '/playerUp.png';
    const playerLeftImage = new Image();
    playerLeftImage.src = '/playerLeft.png';
    const playerRightImage = new Image();
    playerRightImage.src = '/playerRight.png';

    const velocity = 3;
    class Spirite {
      constructor({ position, velocity, image, frames = { max: 1 }, spirites }) {
        this.position = position;
        this.velocity = velocity;
        this.frames = { val: 0, ...frames, elapsed: 0 };
        this.width = 0;
        this.moving = false;
        this.keys = 's';
        this.spirites = spirites;
        this.image = image;
        this.image.onload = () => {
          this.width = this.image.width / this.frames.max;
          this.height = this.image.height;
        };
      }
      draw() {
        if (this.frames.max > 0 && this.moving) {
          if (this.keys === 's') this.image = this.spirites.down;
          if (this.keys === 'a') this.image = this.spirites.left;
          if (this.keys === 'd') this.image = this.spirites.right;
          if (this.keys === 'w') this.image = this.spirites.up;
        }
        c.drawImage(
          this.image,
          this.frames.max === 0 ? 0 : this.frames.val * this.width,
          0,
          this.image.width / this.frames.max,
          this.image.height,
          this.position.x,
          this.position.y,
          this.image.width / this.frames.max,
          this.image.height
        );

        if (this.moving) {
          if (this.frames.max > 0) this.frames.elapsed++;
          if (this.frames.elapsed % 10 === 0)
            this.frames.val = this.frames.val < this.frames.max - 1 ? this.frames.val + 1 : 0;
        } else {
          this.frames.val = 0;
        }
      }
    }

    class Boundary {
      static width = 65;
      static height = 65;
      constructor(position) {
        this.position = position;
        this.width = 65;
        this.height = 65;
      }
      draw(offset) {
        c.fillStyle = 'rgba(255, 0, 0, 0)';
        c.fillRect(
          this.position.x - offset.x + 20,
          this.position.y - offset.y,
          this.width,
          this.height
        );
      }
    }

    const boundaries = [];
    collusionMap.forEach((row, i) => {
      row.forEach((symbol, j) => {
        if (symbol === 1025) {
          const position = {
            x: j * Boundary.width,
            y: i * Boundary.height,
          };
          boundaries.push(new Boundary(position));
        }
      });
    });

    const background = new Spirite({ position: offset, velocity: 0, image });
    const foreground = new Spirite({ position: offset, velocity: 0, image: foreimage });

    const keys = { w: { pressed: false }, a: { pressed: false }, s: { pressed: false }, d: { pressed: false } };

    const player = new Spirite({
      position: {
        x: canvas.width / 2 - canvas.width * 0.13,
        y: canvas.height / 2 - canvas.height * 0.1,
      },
      image: playerImage,
      frames: { max: 4 },
      spirites: {
        up: playerUpImage,
        down: playerImage,
        left: playerLeftImage,
        right: playerRightImage,
      },
    });

    const collusionCheck = ({ background, boundary, key }) => {
      let testX = -background.position.x + 0.35 * canvas.width;
      let testY = -background.position.y + 0.45 * canvas.height;
      const padding = 5;
      if (key === 'w') testY -= padding;
      if (key === 's') testY += padding;
      if (key === 'a') testX -= padding;
      if (key === 'd') testX += padding;

      return (
        boundary.position.x - player.width <= testX &&
        boundary.position.x + player.width >= testX &&
        boundary.position.y + player.height > testY &&
        boundary.position.y <= testY
      );
    };

    function animate() {
      window.requestAnimationFrame(animate);
      background.draw();
      boundaries.forEach((boundary) => {
        boundary.draw({ x: -background.position.x, y: -background.position.y });
      });
      player.draw();
      foreground.draw();

      if (keys.w.pressed) {
        let move = true;
        player.moving = true;
        player.keys = 'w';
        boundaries.forEach((boundary) => {
          if (collusionCheck({ background, boundary, key: 'w' })) move = false;
        });
        if (move) {
          background.position.y += velocity;
          foreground.position.y += velocity;
        }
      } else if (keys.s.pressed) {
        let move = true;
        player.moving = true;
        player.keys = 's';
        boundaries.forEach((boundary) => {
          if (collusionCheck({ background, boundary, key: 's' })) move = false;
        });
        if (move) {
          background.position.y -= velocity;
          foreground.position.y -= velocity;
        }
      } else if (keys.a.pressed) {
        let move = true;
        player.moving = true;
        player.keys = 'a';
        boundaries.forEach((boundary) => {
          if (collusionCheck({ background, boundary, key: 'a' })) move = false;
        });
        if (move) {
          background.position.x += velocity;
          foreground.position.x += velocity;
        }
      } else if (keys.d.pressed) {
        let move = true;
        player.moving = true;
        player.keys = 'd';
        boundaries.forEach((boundary) => {
          if (collusionCheck({ background, boundary, key: 'd' })) move = false;
        });
        if (move) {
          background.position.x -= velocity;
          foreground.position.x -= velocity;
        }
      } else {
        player.moving = false;
        player.keys = 's';
      }
    }

    const keyDownHandler = (e) => {
      switch (e.key) {
        case 'w':
          keys.w.pressed = true;
          break;
        case 's':
          keys.s.pressed = true;
          break;
        case 'a':
          keys.a.pressed = true;
          break;
        case 'd':
          keys.d.pressed = true;
          break;
      }
    };
    const keyUpHandler = (e) => {
      switch (e.key) {
        case 'w':
          keys.w.pressed = false;
          break;
        case 's':
          keys.s.pressed = false;
          break;
        case 'a':
          keys.a.pressed = false;
          break;
        case 'd':
          keys.d.pressed = false;
          break;
      }
    };

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    image.onload = () => {
      animate();
    };

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  return (
        <>
            <canvas ref={canvasRef} className="w-full h-full" />
        </>);
};

export default MapCanvas;
