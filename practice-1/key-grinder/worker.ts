import { parentPort, workerData } from 'worker_threads';
import { Keypair } from '@solana/web3.js';

function generateWalletWithPrefix(prefix){

    while (true){
        let keypair = Keypair.generate();
        if (keypair.publicKey.toBase58().startsWith(prefix)){



            return {
                publicKey: keypair.publicKey.toBase58(),
                secretKey: Buffer.from(keypair.secretKey).toString('hex')
            };


        }

    }


}

const prefix = workerData;
const result = generateWalletWithPrefix(prefix);
parentPort?.postMessage(result);