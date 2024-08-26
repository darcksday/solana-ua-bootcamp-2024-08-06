import "dotenv/config";

import {createMint, getOrCreateAssociatedTokenAccount, mintTo} from "@solana/spl-token";
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


const MINOR_UNITS_PER_MAJOR_UNITS=Math.pow(10,2)

const tokenMintAccount= new PublicKey('9BY6Tcs3fpkHzttt8oB7V1seYRKQ6XtXUWDR83ud9CTf')
const recipientAssociatedTokenAccount= new PublicKey('6kY2smZMSKqixXhgKvXMFVPMrDyUrChygC6Ks6ZgaYiA')

const txSignature=await mintTo(
    connection,
    keypair,
    tokenMintAccount,
    recipientAssociatedTokenAccount,
    keypair,
    1000*MINOR_UNITS_PER_MAJOR_UNITS


)

console.log(`Public key is: ${keypair.publicKey.toBase58()}`)






const link = getExplorerLink("tx", txSignature, "devnet");

console.log(`Success! Minted ${1000*MINOR_UNITS_PER_MAJOR_UNITS} tokens ${link}`)











