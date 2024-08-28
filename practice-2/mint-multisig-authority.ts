import "dotenv/config";
import { createMint, createMultisig, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import bs58 from 'bs58';
import { getExplorerLink } from "@solana-developers/helpers";

const prtKey = process.env['PRT_KEY'];
if (!prtKey) {
    console.error(`Please provide a private key`);
    process.exit(1);
}

const asArray = Uint8Array.from(JSON.parse(prtKey));
const keypair = Keypair.fromSecretKey(asArray);
const connection = new Connection(clusterApiUrl('devnet'));

// Проверяем переменную окружения для мульти-подписей
const mutisigPrtKeys = process.env['MUTISIG_PRIVATE_KEYS'];
if (!mutisigPrtKeys) {
    console.error('MUTISIG_PRIVATE_KEYS environment variable is not set.');
    process.exit(1);
}

const multisigPrtKeys: string[] = JSON.parse(mutisigPrtKeys);
const multisigKeypairs: Keypair[] = [];
const multisigPubKeys: PublicKey[] = [];

multisigPrtKeys.forEach((v) => {
    const privateKeyBytes = bs58.decode(v);
    const mutisigKeypair = Keypair.fromSecretKey(privateKeyBytes);
    multisigKeypairs.push(mutisigKeypair);
    multisigPubKeys.push(mutisigKeypair.publicKey);
});

const reqSigners = JSON.parse(process.env['REQUIRED_SIGNERS'] || '0');
const multisigAccount = await createMultisig(
    connection,
    keypair,
    multisigPubKeys,
    reqSigners,
);

console.log(`Multisig Account: ${multisigAccount.toBase58()}`);
console.log(`Signers: [${multisigPubKeys}]`);
console.log(`Min required signers: ${reqSigners}`);

const tokenMint = await createMint(
    connection,
    keypair,
    multisigAccount,
    null,
    2
);

console.log(`Token mint-account: ${tokenMint.toBase58()}`);

//Sleep
await new Promise(resolve => setTimeout(resolve, 20000));

const associationTokenAcc = await getOrCreateAssociatedTokenAccount(
    connection,
    keypair,
    tokenMint,
    keypair.publicKey
);

console.log(`Associated Token Account: ${associationTokenAcc.address.toBase58()} for public key: ${keypair.publicKey.toBase58()}`);

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);
const amount = 1000 * MINOR_UNITS_PER_MAJOR_UNITS;

const mintTokenTx = await mintTo(
    connection,
    keypair,
    tokenMint,
    associationTokenAcc.address,
    multisigAccount,
    amount,
    multisigKeypairs
);

const link = getExplorerLink("tx", mintTokenTx, "devnet");

console.log(`Success! Minted ${amount} tokens ${link} with signers: [${multisigPubKeys}]`);
