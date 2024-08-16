use solana_sdk::pubkey::Pubkey;
use solana_sdk::signature::{Keypair, Signer};

use dotenv::dotenv;
use std::env;

fn main() {


    dotenv().ok();



    let prt_key=env::var("PRT_KEY").expect("PRT_KEY must be set");
    let secret_bytes: Vec<u8> = serde_json::from_str(&prt_key).expect("Invalid PRT_KEY format");
    let keypair = Keypair::from_bytes(&secret_bytes).expect("Failed to create Keypair");
    let pubkey: Pubkey = keypair.pubkey();

    println!("Public key: {}", pubkey);
}
