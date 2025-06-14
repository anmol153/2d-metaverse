import { useEffect, useRef, useState } from 'react';
import { collusion } from '../data/collusion';
import socket from '../socket';
import { useAuthStore } from '../store/useAuthStore';
import { MessageCircleCode,  X } from 'lucide-react';
import HomeLay from './HomeLay';
import { useChatStore } from '../store/useChatStore';

class Spirite {
  constructor({ position, velocity, image, frames = { max: 1 }, spirites, id }) {
    this.position = position;
    this.velocity = velocity;
    this.frames = { val: 0, ...frames, elapsed: 0 };
    this.width = 0;
    this.moving = false;
    this.keys = 's';
    this.spirites = spirites;
    this.image = image;
    this.offx = 0;
    this.offy = 0;
    this.id = id;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  draw(c) {
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
      this.position.x - this.offx,
      this.position.y - this.offy,
      this.image.width / this.frames.max,
      this.image.height
    );
    const text = String(this.id);
    const padding = 8;
    const fontSize = 14;
    const textX = this.position.x - this.offx;
    const textY = this.position.y - this.offy - 30;
    const textWidth = c.measureText(this.id).width;
    const textHeight = fontSize + 4;

    c.font = `bold ${fontSize}px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';

    c.fillStyle = 'rgba(0, 0, 0, 0.6)';
    const radius = 6;
    const bgX = textX - textWidth / 2 - padding / 2;
    const bgY = textY - textHeight / 2;
    const bgWidth = textWidth + padding;
    const bgHeight = textHeight;

    c.beginPath();
    c.moveTo(bgX + radius, bgY);
    c.lineTo(bgX + bgWidth - radius, bgY);
    c.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + radius);
    c.lineTo(bgX + bgWidth, bgY + bgHeight - radius);
    c.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - radius, bgY + bgHeight);
    c.lineTo(bgX + radius, bgY + bgHeight);
    c.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - radius);
    c.lineTo(bgX, bgY + radius);
    c.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
    c.closePath();
    c.fill();

    c.fillStyle = 'white';
    c.fillText(this.id, textX, textY);

    if (this.moving) {
      if (this.frames.max > 0) this.frames.elapsed++;
      if (this.frames.elapsed % 10 === 0) {
        this.frames.val = this.frames.val < this.frames.max - 1 ? this.frames.val + 1 : 0;
        this.frames.elapsed = 0;
      }
    } else {
      this.frames.val = 0;
    }
  }
}

let otherplayer = [];

const MapCanvas = () => {
  const {authUser,setonlineUser} = useAuthStore();
  const myId = authUser.username;
  const canvasRef = useRef(null);
  const [playerposition, setPlayer] = useState({});
  const lastUpdateRef = useRef(Date.now());
  const [lastKeypressed, setlastKeypressed] = useState('s');
  const [velocity,setVelocity] = useState(2);
  const velocityRef = useRef(velocity);
  const {selectedUser}  = useChatStore();
  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);


  useEffect(() => {
    socket.emit('player-position', { id: myId, position: playerposition, keys: lastKeypressed });
  }, [playerposition]);

  const [messages,setMessaged] = useState(true);
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
    const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = ''; 
    };
    const image = new Image();
    image.src = '/Pellet Town.png';
    const foreimage = new Image();
    foreimage.src = '/Pellet Town_fore.png';

    const playerImage = new Image();
    playerImage.src = '/playerDown.png';
    const playerUpImage = new Image();
    playerUpImage.src = '/playerUp.png';
    const playerLeftImage = new Image();
    playerLeftImage.src = '/playerLeft.png';
    const playerRightImage = new Image();
    playerRightImage.src = '/playerRight.png';

    socket.connect();
    socket.emit("connected",{userId:authUser.username});

    socket.on('existing_users', (data) => {
      console.log(data);
      data.forEach((id) => {
        if (id === myId) return;

        const other = new Spirite({
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
          id: id,
        });

        otherplayer.push({ id, player: other, lastUpdated: Date.now() });
      });
    });

    socket.on('new-user-connected', ({ id }) => {
      if (id === myId) return;

      console.log(id);
      const other = new Spirite({
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
        id: id,
      });

      otherplayer.push({ id, player: other, lastUpdated: Date.now() });
    });

  socket.on("getOnlineUser",(user)=>{
      setonlineUser(user)
  });

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
          const position = { x: j * Boundary.width, y: i * Boundary.height };
          boundaries.push(new Boundary(position));
        }
      });
    });

    const background = new Spirite({ position: offset, velocity: 0, image });
    const foreground = new Spirite({ position: offset, velocity: 0, image: foreimage });

    const keys = {
      w: { pressed: false },
      a: { pressed: false },
      s: { pressed: false },
      d: { pressed: false },
    };

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
      id: myId,
    });

    socket.on('player-position', (content) => {
      let otherpl = otherplayer.find((player) => player.id === content.id);
      let other = otherpl?.player;

      if (other) {
        other.position.x = canvas.width / 2 - canvas.width * 0.13 + content.position.x;
        other.position.y = canvas.height / 2 - canvas.height * 0.1 + content.position.y;
        other.keys = content.keys;
        otherpl.lastUpdated = Date.now();
        other.moving = true;
      }
    });

    socket.on('user-disconnected', ({ id }) => {
      otherplayer = otherplayer.filter((entry) => entry.id !== id);
    });

    const collusionCheck = ({ background, boundary, key }) => {
      let testX = -background.position.x + 0.35 * canvas.width;
      let testY = -background.position.y + 0.45 * canvas.height;
      const padding = velocity;

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
    console.log(velocity);
    function animate() {
      window.requestAnimationFrame(animate);
      const now = Date.now();
      background.draw(c);

      boundaries.forEach((boundary) => {
        boundary.draw({ x: -background.position.x, y: -background.position.y });
      });

      player.draw(c);

      for (let entry of otherplayer) {
        let other = entry.player;
        other.offx = -background.position.x - 750;
        other.offy = -background.position.y - 600;

        if (Date.now() - entry.lastUpdated < 200) {
          other.moving = true;
        } else {
          other.moving = false;
        }

        other.draw(c);
      }

      foreground.draw(c);

      const updateMovement = (key, adjust) => {
        setlastKeypressed(key);
        let move = true;
        player.moving = true;
        player.keys = key;

        boundaries.forEach((boundary) => {
          if (collusionCheck({ background, boundary, key })) move = false;
        });

        if (move) {
          background.position[adjust.axis] += adjust.value;
          foreground.position[adjust.axis] += adjust.value;
        }
      };
      const currentVelocity = velocityRef.current;
      if (keys.w.pressed) updateMovement('w', { axis: 'y', value: currentVelocity });
      else if (keys.s.pressed) updateMovement('s', { axis: 'y', value: -currentVelocity });
      else if (keys.a.pressed) updateMovement('a', { axis: 'x', value: currentVelocity });
      else if (keys.d.pressed) updateMovement('d', { axis: 'x', value: -currentVelocity });
      else {
        player.moving = false;
        player.keys = 's';
      }

      if (player.moving && now - lastUpdateRef.current > 100) {
        setPlayer({
          x: -background.position.x - 750,
          y: -background.position.y - 600,
        });
        lastUpdateRef.current = now;
      }
    }

    const keyDownHandler = (e) => {
      if (keys[e.key]) keys[e.key].pressed = true;
    };

    const keyUpHandler = (e) => {
      if (keys[e.key]) keys[e.key].pressed = false;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    image.onload = () => {
      animate();
    };

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

 return (
  <div>
    <canvas ref={canvasRef} className="w-full h-full" />

    <button onClick={() => setMessaged(prev => !prev)} className="z-10 cursor-pointer absolute right-15 bottom-10">
      {messages ? (
        <MessageCircleCode className="size-15 text-primary" />
      ) : !selectedUser ? (
        <X className="size-15 text-primary" />
      ) : null}
    </button>

    {!messages && <HomeLay />}

    <div className="absolute left-15 bottom-10">
      <h4 className="font-semibold text-xl py-2 pl-5">Speed</h4>
      <input
        type="range"
        className="range text-primary w-50 h-5 cursor-pointer"
        min={1}
        max={10}
        defaultValue={5}
        onChange={(e) => setVelocity(Number(e.target.value))}
      />
    </div>
  </div>
);
}

export default MapCanvas;
