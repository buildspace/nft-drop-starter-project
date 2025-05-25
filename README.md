# 🍭 Candy Drop

A React-based application that functions as an NFT drop machine with fair minting on the Solana blockchain. Users can connect their Solana wallets to mint unique NFTs.

## Features

- Connect to a Solana wallet (e.g., Phantom).
- Mint NFTs from the Candy Machine.
- Fair minting process.
- View transaction status.

## Technologies Used

- React
- Solana (using @solana/web3.js)
- Anchor framework
- Metaplex Program Library
- JavaScript
- CSS

## Setup and Installation

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the `app` directory: `cd app`
3. Install dependencies: `npm install`
4. Set up environment variables (see Configuration section below).
5. Start the development server: `npm start`

## Configuration

The application requires certain environment variables to be set. Create a `.env` file in the `app` directory and add the following variables:

- `REACT_APP_SOLANA_RPC_HOST`: The RPC host URL for the Solana cluster (e.g., https://api.devnet.solana.com).
- `REACT_APP_CANDY_MACHINE_CONFIG`: The public key of the Candy Machine configuration.
- `REACT_APP_CANDY_MACHINE_ID`: The public key of the Candy Machine program.
- `REACT_APP_TREASURY_ADDRESS`: The public key of the treasury wallet that will receive the funds from the mint.

## Usage

1. Ensure you have a Solana wallet browser extension (like Phantom) installed and set up.
2. Navigate to the application in your browser (usually `http://localhost:3000` for local development).
3. The application will prompt you to connect your wallet.
4. Once connected, you should see details about the NFT drop (e.g., drop date, items minted/available).
5. If the minting period is active and NFTs are available, click the "Mint NFT" button.
6. Approve the transaction in your wallet popup.
7. Wait for the transaction to be confirmed on the Solana blockchain.
8. Upon success, the newly minted NFT will be sent to your wallet.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request. For major changes, please open an issue first to discuss what you would like to change.
