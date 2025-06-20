import { AccessToken, RoomServiceClient, } from 'livekit-server-sdk';
import express from 'express';

const router = express.Router();
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const wsUrl = 'http://localhost:7880';

const livekit = new RoomServiceClient(wsUrl,apiKey,apiSecret);
router.get('/get-token', async(req, res) => {
  const { room, name } = req.query;
  const at = new AccessToken(apiKey, apiSecret, {
    identity: name,
  });
  at.addGrant({ roomJoin: true, room });

  const token = await at.toJwt();
  console.log(token);
  res.json({ token });
});

router.get('/create-room', async (req, res) => {
  const { name } = req.query;
  try {
    await livekit.createRoom({ name });
    res.send({ message: 'Room created' });
  } catch (err) {
    if (err.message.includes('exists')) {
      res.send({ message: 'Room already exists' });
    } else {
      res.status(500).send({ error: err.message });
    }
  }
});

router.get('/rooms', async (req, res) => {
  const rooms = await livekit.listRooms();
  res.send({ rooms });
});

export default router;