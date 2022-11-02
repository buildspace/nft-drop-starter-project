import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const Home = () => {
    const wallet = useWallet();
    // Actions
    const renderNotConnectedContainer = () => (
        <div>
            <img
                src='https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif'
                alt='emoji'
            />

            <div className='button-container'>
                <WalletMultiButton className='cta-button connect-wallet-button' />
            </div>
        </div>
    );

    useEffect(() => {
        console.log('Public key', wallet.publicKey?.toString());
    }, [wallet.publicKey]);

    return (
        <div className='App'>
            <div className='container'>
                <div className='header-container'>
                    <p className='header'>🍭 Candy Drop</p>
                    <p className='sub-text'>NFT drop machine with fair mint</p>
                    {/* Render your connect to wallet button right here */}
                    {wallet.publicKey ? 'Hello' : renderNotConnectedContainer()}
                </div>

                <div className='footer-container'>
                    <img
                        alt='Twitter Logo'
                        className='twitter-logo'
                        src='twitter-logo.svg'
                    />
                    <a
                        className='footer-text'
                        href={TWITTER_LINK}
                        target='_blank'
                        rel='noreferrer'
                    >{`built on @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default Home;
