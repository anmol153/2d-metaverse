import { createWorker as createMediasoupWorker } from 'mediasoup';

let worker;
const createWorker = async () => {
  worker = await createMediasoupWorker({
    logLevel: 'warn',
    rtcMinPort: 40000,
    rtcMaxPort: 49999,
  });

  console.log('✅ Mediasoup worker created');
  worker.on('died', () => {
    console.error('❌ Mediasoup worker died, exiting in 2 seconds...');
    setTimeout(() => process.exit(1), 2000);
  });
  return worker;
};
export { createWorker, worker };
