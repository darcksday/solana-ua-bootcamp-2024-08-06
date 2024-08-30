import "dotenv/config";
import {
    clusterApiUrl,
    Connection,
    Keypair,
    NONCE_ACCOUNT_LENGTH,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction
} from "@solana/web3.js";

const prtKey = process.env['PRT_KEY'];
if (!prtKey) {
    console.error(`Please provide a private key`);
    process.exit(1);
}

const asArray = Uint8Array.from(JSON.parse(prtKey));
const keypair = Keypair.fromSecretKey(asArray);
const connection = new Connection(clusterApiUrl('devnet'));


const minimumAmount = await connection.getMinimumBalanceForRentExemption(
    NONCE_ACCOUNT_LENGTH,
);
const nonceKeypair = Keypair.generate()
const tx= new Transaction()
tx.add(SystemProgram.createNonceAccount({
    fromPubkey:keypair.publicKey,
    noncePubkey:nonceKeypair.publicKey,
    authorizedPubkey:keypair.publicKey,
    lamports:minimumAmount


}))

await sendAndConfirmTransaction(connection,tx,[keypair,nonceKeypair])
console.log(`Nonce Account PublicKey:${nonceKeypair.publicKey}`)

