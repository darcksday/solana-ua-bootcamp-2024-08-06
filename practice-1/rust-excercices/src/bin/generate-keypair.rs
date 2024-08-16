use solana_sdk::pubkey::Pubkey;
use solana_sdk::signature::{Keypair, Signer};


fn main() {



    let keypair = Keypair::new();
    let pubkey: Pubkey = keypair.pubkey();

    println!("✅ Finished!");
    println!("Public key: {}", pubkey);
    println!("Private key: {:?}", keypair.to_bytes());
}
