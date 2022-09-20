/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        REACT_APP_CANDY_MACHINE_ID: "YOUR_CANDY_MACHINE_ID",
        REACT_APP_SOLANA_NETWORK: "devnet",
        REACT_APP_SOLANA_RPC_HOST: "https://metaplex.devnet.rpcpool.com/",
    },
};

module.exports = nextConfig;
