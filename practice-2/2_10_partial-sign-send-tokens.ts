import "dotenv/config";

import {createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer,createTransferInstruction} from "@solana/spl-token";
import "dotenv/config";
import {
    Connection,
    clusterApiUrl,
    Keypair,
    PublicKey,
    Transaction,
} from "@solana/web3.js";
import {
    getExplorerLink
} from "@solana-developers/helpers";

let prt_key=process.env['PRT_KEY']
let prt_key_receiver=process.env['PRT_KEY_RECEIVER']

if (!prt_key){
    console.log(`Please provide PRT_KEY key`);
    process.exit(1);
}

if (!prt_key_receiver){
    console.log(`Please provide  PRT_KEY_RECEIVER key`);
    process.exit(1);
}


const asArray=Uint8Array.from(JSON.parse(prt_key));
const keypair=Keypair.fromSecretKey(asArray)
const connection= new Connection(clusterApiUrl('devnet'))
const receiverKeypair=Keypair.fromSecretKey(Uint8Array.from(JSON.parse(prt_key_receiver)))
console.log(`Sender public key is: ${keypair.publicKey.toBase58()}`)
console.log(`Receiver public key is: ${receiverKeypair.publicKey.toBase58()}`)

const tokenMintAccount= await createMint(
    connection,
    keypair,
    keypair.publicKey,
    null,
    2
)


console.log(`Token account: ${tokenMintAccount.toString()}`)
//Sleep
await new Promise(resolve => setTimeout(resolve, 20000));

const fromTokenAccount=await getOrCreateAssociatedTokenAccount(
    connection,
    keypair,
    tokenMintAccount,
    keypair.publicKey

)
console.log(`Sender Token Account: ${fromTokenAccount.address.toBase58()}`);


const toTokenAccount=await getOrCreateAssociatedTokenAccount(
    connection,
    keypair,
    tokenMintAccount,
    receiverKeypair.publicKey

)
console.log(`Receiver Token Account: ${toTokenAccount.address.toBase58()}`);



const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const txSignature=await mintTo(
    connection,
    keypair,
    tokenMintAccount,
    fromTokenAccount.address,
    keypair,
    1000*MINOR_UNITS_PER_MAJOR_UNITS
)



const link = getExplorerLink("tx", txSignature, "devnet");

console.log(`Success! Minted ${1000} tokens ${link}`)

const  { blockhash }  = await connection.getLatestBlockhash();
const tx= new Transaction({recentBlockhash:blockhash});

const transferAmount=50*MINOR_UNITS_PER_MAJOR_UNITS
const signature =  createTransferInstruction(
    fromTokenAccount.address,
    toTokenAccount.address,
    keypair.publicKey,
    transferAmount)


tx.add(signature)
tx.feePayer=receiverKeypair.publicKey

console.log('Sign by sender')
tx.partialSign(keypair)
console.log('Partial Sign by receiver')
tx.partialSign(receiverKeypair)


const serializeTx=tx.serialize()


const sendTx = await connection.sendRawTransaction(serializeTx)

const transferLink = getExplorerLink("tx", sendTx, "devnet");

console.log(`Success! Transfered ${transferLink} tokens. Transaction payer ${tx.feePayer}`)