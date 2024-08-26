import "dotenv/config";

import {createMint, getOrCreateAssociatedTokenAccount, mintTo} from "@solana/spl-token";
import "dotenv/config";
import {Connection, clusterApiUrl, Keypair, PublicKey, Transaction, sendAndConfirmTransaction} from "@solana/web3.js";
import {
    getExplorerLink
} from "@solana-developers/helpers";
import {createCreateMetadataAccountV3Instruction} from "@metaplex-foundation/mpl-token-metadata";

let prt_key=process.env['PRT_KEY']
if (!prt_key){
console.log(`Please provide a private key`);
process.exit(1);
}


const asArray=Uint8Array.from(JSON.parse(prt_key));
const keypair=Keypair.fromSecretKey(asArray)
const connection= new Connection(clusterApiUrl('devnet'))

const TOKEN_METADATA_PROGRAM_ID=new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

const tokenMintAccount= new PublicKey('9BY6Tcs3fpkHzttt8oB7V1seYRKQ6XtXUWDR83ud9CTf')

const metadataData={
    name:'My Custom Token',
    symbol:'MCT',
    uri:'https://www.google.com/',
    sellerFeeBasisPoints:0,
    creators:null,
    collection:null,
    uses:null


}

const [metadataPDA,_metadaraBumb]=PublicKey.findProgramAddressSync(
    [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        tokenMintAccount.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
)
const transaction= new Transaction();
const createMetadataAccountInstruction=createCreateMetadataAccountV3Instruction(
    {
        metadata:metadataPDA,
        mint:tokenMintAccount,
        mintAuthority:keypair.publicKey,
        payer:keypair.publicKey,
        updateAuthority:keypair.publicKey,
    },
    {
       createMetadataAccountArgsV3:{
           collectionDetails:null,
           data:metadataData,
           isMutable:true
       }
    }
)

transaction.add(createMetadataAccountInstruction)
await sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair]
)






const link = getExplorerLink("address", tokenMintAccount.toString(), "devnet");

console.log(`Token metadata updated ${link}`)











