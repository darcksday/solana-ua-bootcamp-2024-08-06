import "dotenv/config";

import { createMint } from "@solana/spl-token";
import "dotenv/config";
import {Connection, clusterApiUrl, Keypair} from "@solana/web3.js";
import {
    getExplorerLink
} from "@solana-developers/helpers";
// function getExplorerLink(linkType, id, cluster = "mainnet-beta") {
//     const baseUrl = `https://explorer.solana.com/${linkType}/${id}?cluster=${cluster}`;
//     return baseUrl;
// }

let prt_key=process.env['PRT_KEY']
if (!prt_key){
console.log(`Please provide a private key`);
process.exit(1);
}


const asArray=Uint8Array.from(JSON.parse(prt_key));
const keypair=Keypair.fromSecretKey(asArray)
const connection= new Connection(clusterApiUrl('devnet'))

console.log(`Public key is: ${keypair.publicKey.toBase58()}`)


const tokenMint= await createMint(
    connection,
    keypair,
    keypair.publicKey,
    null,
    2
)

const link = getExplorerLink("address", tokenMint.toString(), "devnet");

console.log(`Token mint: ${link}`)











