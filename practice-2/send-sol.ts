import "dotenv/config";
import {
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    clusterApiUrl,
    Connection,
    sendAndConfirmTransaction, TransactionInstruction
} from "@solana/web3.js";

let prt_key=process.env['PRT_KEY']
let send_to=process.env['SEND_TO']


if (!prt_key){
    console.log(`Please provide a private key`);
    process.exit(1);
}

if (!send_to){
    console.log(`Please provide a public key to send to`);
    process.exit(1);
}


const asArray=Uint8Array.from(JSON.parse(prt_key));
const keypair=Keypair.fromSecretKey(asArray)
const connection= new Connection(clusterApiUrl('devnet'))

const tx= new Transaction();
const amount='0.01'*LAMPORTS_PER_SOL;
send_to= new PublicKey(send_to)

const sendSolInstruction= SystemProgram.transfer({
    fromPubkey:keypair.publicKey,
    toPubkey:send_to,
    lamports:amount
});


const memoText='Hello World!'
const addMemoInstruction= new TransactionInstruction({
    keys: [{ pubkey: keypair.publicKey, isSigner: true, isWritable: true }],
    data: Buffer.from(memoText, "utf-8"),
    programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
})


tx.add(addMemoInstruction,sendSolInstruction)


const signature = await sendAndConfirmTransaction(connection, tx, [
    keypair,
]);

console.log(
    `💸 Finished! Sent ${amount} to the address ${send_to}. `,
);

console.log(`tx hash:${signature}`)




