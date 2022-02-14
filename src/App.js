import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine';
import ImageGallery from 'react-image-gallery';

// Constants
const TWITTER_HANDLE = 'lailachima';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const images = [
    {
      original: 'https://i.imgur.com/yxAKAQX.png',
      thumbnail: 'https://i.imgur.com/yxAKAQX.png',
      originalHeight: 0,
      thumbnailHeight: 200,
      thumbnailClass: "thumbnail",
    },
    {
      original: 'https://i.imgur.com/9bGfUMc.png',
      thumbnail: 'https://i.imgur.com/9bGfUMc.png',
      originalHeight: 0,
      thumbnailHeight: 200,
      thumbnailClass: "thumbnail",

    },
    {
      original: 'https://i.imgur.com/Vd2ZlXU.png',
      thumbnail: 'https://i.imgur.com/Vd2ZlXU.png',
      originalHeight: 0,
      thumbnailHeight: 200,
      thumbnailClass: "thumbnail",
    },
    // {
    //   original: 'https://i.imgur.com/wlg3GlG.png',
    //   thumbnail: 'https://i.imgur.com/wlg3GlG.png',
    //   originalHeight: 0,
    //   thumbnailHeight: 200,
    //   thumbnailClass: "thumbnail",
    // },
    {
      original: 'https://i.imgur.com/ZS9NsrQ.png',
      thumbnail: 'https://i.imgur.com/ZS9NsrQ.png',
      originalHeight: 0,
      thumbnailHeight: 200,
      thumbnailClass: "thumbnail",
    },
    {
      original: 'https://i.imgur.com/YvJ7DWc.png',
      thumbnail: 'https://i.imgur.com/YvJ7DWc.png',
      originalHeight: 0,
      thumbnailHeight: 200,
      thumbnailClass: "thumbnail",
    },
    {
      original: 'https://i.imgur.com/cElwZTM.png',
      thumbnail: 'https://i.imgur.com/cElwZTM.png',
      originalHeight: 0,
      thumbnailHeight: 200,
      thumbnailClass: "thumbnail",
    },
  ];

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };


  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Pay with Bank Account
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <ImageGallery className="img-gallery" items={images} showNav={false} showFullscreenButton={false} showPlayButton={false} />
      <div className="container">
        <div className="header-container">
          <p className="header">✨ Lailaland</p>
          <p className="sub-text">Beautiful places I've seen and loved. Check out the checkout!</p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        {walletAddress && <CandyMachine walletAddress={window.solana} />}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;