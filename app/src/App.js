import React, {useEffect, useState} from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  //State
  const [walletAddress, setWalletAddress] = useState(null);

  //Actions
    //Declare check for Phantom Wallet function
  const checkIfWalletIsConnected = async () => {
    try {
      const {solana} = window;

      if(solana && solana.isPhantom){
        console.log('Phantom Wallet Found!');

        //connect wallet and confirm with pubkey
        const response = await solana.connect({onIfTrusted: true})
        console.log(
          'Connected with Public Key: ',
          response.publicKey.toString()
        );

        //set the users pubkey into walletAddress
        setWalletAddress(response.publicKey.toString());
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const connectWallet = async() => {
    const {solana} = window;

    if(solana){
      const response = await solana.connect();
      console.log('Connected with Public Key: ', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderWhenNotConnected = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}>
        Connect to Wallet
      </button>
  )

  function butthead(poop){
    console.log(poop)
  }


  //When our component first mounts, check if we have connected Phantom Wallet
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    }
    butthead('poop2')

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad)
  }, [])


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {!walletAddress && renderWhenNotConnected()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
