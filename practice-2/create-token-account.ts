import "dotenv/config";

import {createMint, getOrCreateAssociatedTokenAccount} from "@solana/spl-token";
import "dotenv/config";
import {Connection, clusterApiUrl, Keypair, PublicKey} from "@solana/web3.js";
import {
    getExplorerLink
} from "@solana-developers/helpers";

let prt_key=process.env['PRT_KEY']
if (!prt_key){
console.log(`Please provide a private key`);
process.exit(1);
}


const asArray=Uint8Array.from(JSON.parse(prt_key));
const keypair=Keypair.fromSecretKey(asArray)
const connection= new Connection(clusterApiUrl('devnet'))

console.log(`Public key is: ${keypair.publicKey.toBase58()}`)


const tokenMintAcc= new PublicKey('9BY6Tcs3fpkHzttt8oB7V1seYRKQ6XtXUWDR83ud9CTf')
const recipient= keypair.publicKey

const tokenAccount=await getOrCreateAssociatedTokenAccount(
    connection,
    keypair,
    tokenMintAcc,
    recipient

)

console.log(`Token Account: ${tokenAccount.address.toBase58()}`)


const link = getExplorerLink("address", tokenAccount.address.toBase58(), "devnet");

console.log(`Created token  account: ${link}`)











