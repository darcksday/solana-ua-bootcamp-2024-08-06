use solana_client::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use solana_sdk::signature::{Keypair, Signer};

use dotenv::dotenv;
use std::env;

fn main() {


    dotenv().ok();



    let prt_key=env::var("PRT_KEY").expect("PRT_KEY must be set");
    let secret_bytes: Vec<u8> = serde_json::from_str(&prt_key).expect("Invalid PRT_KEY format");

    let client = RpcClient::new("https://api.devnet.solana.com");

    let keypair = Keypair::from_bytes(&secret_bytes).expect("Failed to create Keypair");
    let pubkey: Pubkey = keypair.pubkey();
    // //
    let balance = client.get_balance(&pubkey).unwrap();
    let balance_sol = balance as f64 / 1_000_000_000.0;

    // //
    println!("Balance: {} Lamports", balance);
    println!("Balance: {} sol", balance_sol);
}
