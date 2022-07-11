import axios from 'axios';
import { clusterApiUrl, Connection as Connection$1, SystemProgram, PublicKey, TransactionInstruction, SYSVAR_RENT_PUBKEY, Keypair, Transaction as Transaction$1 } from '@solana/web3.js';
import { sha256 } from 'crypto-hash';
import { Buffer as Buffer$1 } from 'buffer';
import { MintLayout, TOKEN_PROGRAM_ID, Token, AccountLayout, ASSOCIATED_TOKEN_PROGRAM_ID, NATIVE_MINT } from '@solana/spl-token';
import * as mplTokenVault from '@metaplex-foundation/mpl-token-vault';
import { Vault, SafetyDepositBox, AddTokenToInactiveVault, ActivateVault, CombineVault, ExternalPriceAccountData, VaultProgram, UpdateExternalPriceAccount, InitVault } from '@metaplex-foundation/mpl-token-vault';
import * as mplCore from '@metaplex-foundation/mpl-core';
import { Transaction, config, Account } from '@metaplex-foundation/mpl-core';
import BN from 'bn.js';
import * as mplMetaplex from '@metaplex-foundation/mpl-metaplex';
import { Store, SetStore, StoreConfig, SetStoreV2, AuctionManager, MetaplexProgram, SafetyDepositConfig, RedeemFullRightsTransferBid, PrizeTrackingTicket, RedeemPrintingV2Bid, RedeemParticipationBidV3, WinningConstraint, NonWinningConstraint, ClaimBid, WinningConfigType } from '@metaplex-foundation/mpl-metaplex';
import * as mplTokenMetadata from '@metaplex-foundation/mpl-token-metadata';
import { Metadata, MasterEdition, Creator, MetadataDataData, CreateMetadata, CreateMasterEdition, EditionMarker, Edition, MintNewEditionFromMasterEditionViaToken, SignMetadata, UpdateMetadata, UpdatePrimarySaleHappenedViaToken } from '@metaplex-foundation/mpl-token-metadata';
import * as mplAuction from '@metaplex-foundation/mpl-auction';
import { AuctionExtended, BidderPot, BidderMetadata, CancelBid, PlaceBid, Auction, CreateAuctionArgs, CreateAuction } from '@metaplex-foundation/mpl-auction';

var Currency;
(function (Currency) {
    Currency["USD"] = "usd";
    Currency["EUR"] = "eur";
    Currency["AR"] = "ar";
    Currency["SOL"] = "sol";
})(Currency || (Currency = {}));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class Coingecko {
    static translateCurrency(currency) {
        switch (currency) {
            case Currency.AR:
                return 'arweave';
            case Currency.SOL:
                return 'solana';
            case Currency.USD:
                return 'usd';
            case Currency.EUR:
                return 'eur';
            default:
                throw new Error('Invalid currency supplied to Coingecko conversion rate provider');
        }
    }
    getRate(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromArray = typeof from === 'string' ? [from] : from;
            const toArray = typeof to === 'string' ? [to] : to;
            const fromIds = fromArray.map((currency) => Coingecko.translateCurrency(currency)).join(',');
            const toIds = toArray.map((currency) => Coingecko.translateCurrency(currency)).join(',');
            const url = `https://api.coingecko.com/api/v3/simple/price?ids=${fromIds}&vs_currencies=${toIds}`;
            const response = yield axios(url);
            const data = yield response.data;
            return fromArray.reduce((previousPairs, fromCurrency) => {
                return [
                    ...previousPairs,
                    ...toArray.map((toCurrency) => ({
                        from: fromCurrency,
                        to: toCurrency,
                        rate: data[Coingecko.translateCurrency(fromCurrency)][Coingecko.translateCurrency(toCurrency)],
                    })),
                ];
            }, []);
        });
    }
}

/* eslint-env browser */

var browser = typeof self == 'object' ? self.FormData : window.FormData;

const ARWEAVE_URL = 'https://arweave.net';
const LAMPORT_MULTIPLIER = Math.pow(10, 9);
const WINSTON_MULTIPLIER = Math.pow(10, 12);
class ArweaveStorage {
    constructor({ endpoint, env }) {
        this.endpoint = endpoint;
        this.env = env;
    }
    getAssetCostToStore(files, arweaveRate, solanaRate) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffers = Array.from(files.values());
            const totalBytes = buffers.reduce((sum, f) => (sum += f.byteLength), 0);
            const txnFeeInWinstons = parseInt(yield (yield axios(`${ARWEAVE_URL}/price/0`)).data);
            const byteCostInWinstons = parseInt(yield (yield axios(`${ARWEAVE_URL}/price/${totalBytes.toString()}`)).data);
            const totalArCost = (txnFeeInWinstons * buffers.length + byteCostInWinstons) / WINSTON_MULTIPLIER;
            const arMultiplier = arweaveRate / solanaRate;
            return LAMPORT_MULTIPLIER * totalArCost * arMultiplier * 1.1;
        });
    }
    upload(files, mintKey, txid) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileEntries = Array.from(files.entries());
            const tags = fileEntries.reduce((acc, [fileName]) => {
                acc[fileName] = [{ name: 'mint', value: mintKey }];
                return acc;
            }, {});
            const body = new browser();
            body.append('tags', JSON.stringify(tags));
            body.append('transaction', txid);
            body.append('env', this.env);
            fileEntries.map(([, file]) => {
                body.append('file[]', file);
            });
            const response = yield axios.post(this.endpoint, body);
            if (response.data.error) {
                return Promise.reject(new Error(response.data.error));
            }
            return response.data;
        });
    }
}

class Storage {
}

var Storage$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Storage: Storage
});

var ChainId;
(function (ChainId) {
    ChainId[ChainId["MainnetBeta"] = 101] = "MainnetBeta";
    ChainId[ChainId["Testnet"] = 102] = "Testnet";
    ChainId[ChainId["Devnet"] = 103] = "Devnet";
})(ChainId || (ChainId = {}));
const ENV = {
    devnet: {
        endpoint: clusterApiUrl('devnet'),
        ChainId: ChainId.Devnet,
    },
    'mainnet-beta': {
        endpoint: 'https://api.metaplex.solana.com/',
        ChainId: ChainId.MainnetBeta,
    },
    'mainnet-beta (Solana)': {
        endpoint: 'https://api.mainnet-beta.solana.com',
        ChainId: ChainId.MainnetBeta,
    },
    'mainnet-beta (Serum)': {
        endpoint: 'https://solana-api.projectserum.com/',
        ChainId: ChainId.MainnetBeta,
    },
    testnet: {
        endpoint: clusterApiUrl('testnet'),
        ChainId: ChainId.Testnet,
    },
};
class Connection extends Connection$1 {
    constructor(endpoint = 'mainnet-beta', commitment) {
        if (endpoint in ENV)
            endpoint = ENV[endpoint].endpoint;
        super(endpoint, commitment);
    }
}

class NodeWallet {
    constructor(payer) {
        this.payer = payer;
    }
    signTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            tx.partialSign(this.payer);
            return tx;
        });
    }
    signAllTransactions(txs) {
        return __awaiter(this, void 0, void 0, function* () {
            return txs.map((tx) => {
                tx.partialSign(this.payer);
                return tx;
            });
        });
    }
    get publicKey() {
        return this.payer.publicKey;
    }
}

const getFileHash = (file) => __awaiter(void 0, void 0, void 0, function* () { return Buffer$1.from(yield sha256(file.toString())); });

var crypto = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getFileHash: getFileHash
});

const lookup = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios.get(url);
        return data;
    }
    catch (_a) {
        throw new Error(`unable to get metadata json from url ${url}`);
    }
});

var metadata = /*#__PURE__*/Object.freeze({
  __proto__: null,
  lookup: lookup
});

var index$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Crypto: crypto,
  metadata: metadata
});

class PayForFiles extends Transaction {
    constructor(options, params) {
        const { feePayer } = options;
        const { lamports, fileHashes, arweaveWallet } = params;
        super(options);
        this.add(SystemProgram.transfer({
            fromPubkey: feePayer,
            toPubkey: arweaveWallet !== null && arweaveWallet !== void 0 ? arweaveWallet : new PublicKey(config.arweaveWallet),
            lamports,
        }));
        fileHashes.forEach((data) => {
            this.add(new TransactionInstruction({
                keys: [],
                programId: new PublicKey(config.programs.memo),
                data,
            }));
        });
    }
}

class CreateMint extends Transaction {
    constructor(options, params) {
        const { feePayer } = options;
        const { newAccountPubkey, lamports, decimals, owner, freezeAuthority } = params;
        super(options);
        this.add(SystemProgram.createAccount({
            fromPubkey: feePayer,
            newAccountPubkey,
            lamports,
            space: MintLayout.span,
            programId: TOKEN_PROGRAM_ID,
        }));
        this.add(Token.createInitMintInstruction(TOKEN_PROGRAM_ID, newAccountPubkey, decimals !== null && decimals !== void 0 ? decimals : 0, owner !== null && owner !== void 0 ? owner : feePayer, freezeAuthority !== null && freezeAuthority !== void 0 ? freezeAuthority : feePayer));
    }
}

class CreateTokenAccount extends Transaction {
    constructor(options, params) {
        const { feePayer } = options;
        const { newAccountPubkey, lamports, mint, owner } = params;
        super(options);
        this.add(SystemProgram.createAccount({
            fromPubkey: feePayer,
            newAccountPubkey,
            lamports,
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
        }));
        this.add(Token.createInitAccountInstruction(TOKEN_PROGRAM_ID, mint, newAccountPubkey, owner !== null && owner !== void 0 ? owner : feePayer));
    }
}

class CreateAssociatedTokenAccount extends Transaction {
    constructor(options, params) {
        const { feePayer } = options;
        const { associatedTokenAddress, walletAddress, splTokenMintAddress } = params;
        super(options);
        this.add(new TransactionInstruction({
            keys: [
                {
                    pubkey: feePayer,
                    isSigner: true,
                    isWritable: true,
                },
                {
                    pubkey: associatedTokenAddress,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: walletAddress !== null && walletAddress !== void 0 ? walletAddress : feePayer,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: splTokenMintAddress,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: SystemProgram.programId,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: SYSVAR_RENT_PUBKEY,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: ASSOCIATED_TOKEN_PROGRAM_ID,
            data: Buffer$1.from([]),
        }));
    }
}

class MintTo extends Transaction {
    constructor(options, params) {
        const { feePayer } = options;
        const { mint, dest, authority, amount } = params;
        super(options);
        this.add(Token.createMintToInstruction(TOKEN_PROGRAM_ID, mint, dest, authority !== null && authority !== void 0 ? authority : feePayer, [], new BN(amount).toNumber()));
    }
}

var index$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  PayForFiles: PayForFiles,
  CreateMint: CreateMint,
  CreateTokenAccount: CreateTokenAccount,
  CreateAssociatedTokenAccount: CreateAssociatedTokenAccount,
  MintTo: MintTo
});

function prepareTokenAccountAndMintTxs(connection, owner) {
    return __awaiter(this, void 0, void 0, function* () {
        const mint = Keypair.generate();
        const mintRent = yield connection.getMinimumBalanceForRentExemption(MintLayout.span);
        const createMintTx = new CreateMint({ feePayer: owner }, {
            newAccountPubkey: mint.publicKey,
            lamports: mintRent,
        });
        const recipient = yield Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mint.publicKey, owner);
        const createAssociatedTokenAccountTx = new CreateAssociatedTokenAccount({ feePayer: owner }, {
            associatedTokenAddress: recipient,
            splTokenMintAddress: mint.publicKey,
        });
        const mintToTx = new MintTo({ feePayer: owner }, {
            mint: mint.publicKey,
            dest: recipient,
            amount: 1,
        });
        return { mint, createMintTx, createAssociatedTokenAccountTx, mintToTx, recipient };
    });
}

function createWrappedAccountTxs(connection, owner, amount = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = Keypair.generate();
        const accountRentExempt = yield connection.getMinimumBalanceForRentExemption(AccountLayout.span);
        const createTokenAccountTx = new CreateTokenAccount({ feePayer: owner }, {
            newAccountPubkey: account.publicKey,
            lamports: amount + accountRentExempt,
            mint: NATIVE_MINT,
        });
        const closeTokenAccountTx = new Transaction().add(Token.createCloseAccountInstruction(TOKEN_PROGRAM_ID, account.publicKey, owner, owner, []));
        return { account, createTokenAccountTx, closeTokenAccountTx };
    });
}

function createApproveTxs(args) {
    const { authority = Keypair.generate(), account, owner, amount } = args;
    const createApproveTx = new Transaction$1().add(Token.createApproveInstruction(TOKEN_PROGRAM_ID, account, authority.publicKey, owner, [], amount));
    const createRevokeTx = new Transaction$1().add(Token.createRevokeInstruction(TOKEN_PROGRAM_ID, account, owner, []));
    return { authority, createApproveTx, createRevokeTx };
}

const sendTransaction = ({ connection, wallet, txs, signers = [], options, }) => __awaiter(void 0, void 0, void 0, function* () {
    let tx = Transaction.fromCombined(txs, { feePayer: wallet.publicKey });
    tx.recentBlockhash = (yield connection.getRecentBlockhash()).blockhash;
    if (signers.length) {
        tx.partialSign(...signers);
    }
    tx = yield wallet.signTransaction(tx);
    return connection.sendRawTransaction(tx.serialize(), options);
});

class TransactionsBatch {
    constructor({ beforeTransactions = [], transactions, afterTransactions = [], }) {
        this.signers = [];
        this.beforeTransactions = beforeTransactions;
        this.transactions = transactions;
        this.afterTransactions = afterTransactions;
    }
    addSigner(signer) {
        this.signers.push(signer);
    }
    addBeforeTransaction(transaction) {
        this.beforeTransactions.push(transaction);
    }
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }
    addAfterTransaction(transaction) {
        this.afterTransactions.push(transaction);
    }
    toTransactions() {
        return [...this.beforeTransactions, ...this.transactions, ...this.afterTransactions];
    }
    toInstructions() {
        return this.toTransactions().flatMap((t) => t.instructions);
    }
}

const addTokensToVault = ({ connection, wallet, vault, nfts, }) => __awaiter(void 0, void 0, void 0, function* () {
    const txOptions = { feePayer: wallet.publicKey };
    const safetyDepositTokenStores = [];
    const vaultAuthority = yield Vault.getPDA(vault);
    const accountRent = yield connection.getMinimumBalanceForRentExemption(AccountLayout.span);
    for (const nft of nfts) {
        const tokenTxBatch = new TransactionsBatch({ transactions: [] });
        const safetyDepositBox = yield SafetyDepositBox.getPDA(vault, nft.tokenMint);
        const tokenStoreAccount = Keypair.generate();
        const tokenStoreAccountTx = new CreateTokenAccount(txOptions, {
            newAccountPubkey: tokenStoreAccount.publicKey,
            lamports: accountRent,
            mint: nft.tokenMint,
            owner: vaultAuthority,
        });
        tokenTxBatch.addTransaction(tokenStoreAccountTx);
        tokenTxBatch.addSigner(tokenStoreAccount);
        const { authority: transferAuthority, createApproveTx } = createApproveTxs({
            account: nft.tokenAccount,
            owner: wallet.publicKey,
            amount: nft.amount.toNumber(),
        });
        tokenTxBatch.addTransaction(createApproveTx);
        tokenTxBatch.addSigner(transferAuthority);
        const addTokenTx = new AddTokenToInactiveVault(txOptions, {
            vault,
            vaultAuthority: wallet.publicKey,
            tokenAccount: nft.tokenAccount,
            tokenStoreAccount: tokenStoreAccount.publicKey,
            transferAuthority: transferAuthority.publicKey,
            safetyDepositBox: safetyDepositBox,
            amount: nft.amount,
        });
        tokenTxBatch.addTransaction(addTokenTx);
        const txId = yield sendTransaction({
            connection,
            wallet,
            txs: tokenTxBatch.transactions,
            signers: tokenTxBatch.signers,
        });
        safetyDepositTokenStores.push({
            txId,
            tokenStoreAccount: tokenStoreAccount.publicKey,
            tokenMint: nft.tokenMint,
            tokenAccount: nft.tokenAccount,
        });
    }
    return { safetyDepositTokenStores };
});

const initStore = ({ connection, wallet, isPublic = true, }) => __awaiter(void 0, void 0, void 0, function* () {
    const storeId = yield Store.getPDA(wallet.publicKey);
    const tx = new SetStore({ feePayer: wallet.publicKey }, {
        admin: new PublicKey(wallet.publicKey),
        store: storeId,
        isPublic,
    });
    const txId = yield sendTransaction({ connection, wallet, txs: [tx] });
    return { storeId, txId };
});

const initStoreV2 = ({ connection, wallet, settingsUri = null, isPublic = true, }) => __awaiter(void 0, void 0, void 0, function* () {
    const storeId = yield Store.getPDA(wallet.publicKey);
    const configId = yield StoreConfig.getPDA(storeId);
    const tx = new SetStoreV2({ feePayer: wallet.publicKey }, {
        admin: new PublicKey(wallet.publicKey),
        store: storeId,
        config: configId,
        isPublic,
        settingsUri,
    });
    const txId = yield sendTransaction({ connection, wallet, txs: [tx] });
    return { storeId, configId, txId };
});

const mintNFT = ({ connection, wallet, uri, maxSupply, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { mint, createMintTx, createAssociatedTokenAccountTx, mintToTx } = yield prepareTokenAccountAndMintTxs(connection, wallet.publicKey);
    const metadataPDA = yield Metadata.getPDA(mint.publicKey);
    const editionPDA = yield MasterEdition.getPDA(mint.publicKey);
    const { name, symbol, seller_fee_basis_points, properties: { creators }, } = yield lookup(uri);
    const creatorsData = creators.reduce((memo, { address, share }) => {
        const verified = address === wallet.publicKey.toString();
        const creator = new Creator({
            address,
            share,
            verified,
        });
        memo = [...memo, creator];
        return memo;
    }, []);
    const metadataData = new MetadataDataData({
        name,
        symbol,
        uri,
        sellerFeeBasisPoints: seller_fee_basis_points,
        creators: creatorsData,
    });
    const createMetadataTx = new CreateMetadata({
        feePayer: wallet.publicKey,
    }, {
        metadata: metadataPDA,
        metadataData,
        updateAuthority: wallet.publicKey,
        mint: mint.publicKey,
        mintAuthority: wallet.publicKey,
    });
    const masterEditionTx = new CreateMasterEdition({ feePayer: wallet.publicKey }, {
        edition: editionPDA,
        metadata: metadataPDA,
        updateAuthority: wallet.publicKey,
        mint: mint.publicKey,
        mintAuthority: wallet.publicKey,
        maxSupply: maxSupply || maxSupply === 0 ? new BN(maxSupply) : null,
    });
    const txId = yield sendTransaction({
        connection,
        signers: [mint],
        txs: [
            createMintTx,
            createMetadataTx,
            createAssociatedTokenAccountTx,
            mintToTx,
            masterEditionTx,
        ],
        wallet,
    });
    return {
        txId,
        mint: mint.publicKey,
        metadata: metadataPDA,
        edition: editionPDA,
    };
});

const mintEditionFromMaster = ({ connection, wallet, masterEditionMint, updateAuthority } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const masterPDA = yield MasterEdition.getPDA(masterEditionMint);
    const masterMetaPDA = yield Metadata.getPDA(masterEditionMint);
    const masterInfo = yield Account.getInfo(connection, masterPDA);
    const masterData = new MasterEdition(masterPDA, masterInfo).data;
    const editionValue = masterData.supply.add(new BN(1));
    const { mint, createMintTx, createAssociatedTokenAccountTx, mintToTx } = yield prepareTokenAccountAndMintTxs(connection, wallet.publicKey);
    const tokenAccount = yield Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, masterEditionMint, wallet.publicKey);
    const metadataPDA = yield Metadata.getPDA(mint.publicKey);
    const editionMarker = yield EditionMarker.getPDA(masterEditionMint, editionValue);
    const editionPDA = yield Edition.getPDA(mint.publicKey);
    const newEditionFromMasterTx = new MintNewEditionFromMasterEditionViaToken({ feePayer: wallet.publicKey }, {
        edition: editionPDA,
        metadata: metadataPDA,
        updateAuthority: updateAuthority !== null && updateAuthority !== void 0 ? updateAuthority : wallet.publicKey,
        mint: mint.publicKey,
        mintAuthority: wallet.publicKey,
        masterEdition: masterPDA,
        masterMetadata: masterMetaPDA,
        editionMarker,
        tokenOwner: wallet.publicKey,
        tokenAccount,
        editionValue,
    });
    const txId = yield sendTransaction({
        connection,
        signers: [mint],
        txs: [createMintTx, createAssociatedTokenAccountTx, mintToTx, newEditionFromMasterTx],
        wallet,
    });
    return {
        txId,
        mint: mint.publicKey,
        metadata: metadataPDA,
        edition: editionPDA,
    };
});

const createMetadata = ({ connection, wallet, editionMint, metadataData, updateAuthority } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const metadata = yield Metadata.getPDA(editionMint);
    const createMetadataTx = new CreateMetadata({ feePayer: wallet.publicKey }, {
        metadata,
        metadataData,
        updateAuthority: updateAuthority !== null && updateAuthority !== void 0 ? updateAuthority : wallet.publicKey,
        mint: editionMint,
        mintAuthority: wallet.publicKey,
    });
    return sendTransaction({
        connection,
        signers: [],
        txs: [createMetadataTx],
        wallet,
    });
});

const createMasterEdition = ({ connection, wallet, editionMint, updateAuthority, maxSupply } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const metadata = yield Metadata.getPDA(editionMint);
    const edition = yield MasterEdition.getPDA(editionMint);
    const createMetadataTx = new CreateMasterEdition({ feePayer: wallet.publicKey }, {
        edition,
        metadata,
        updateAuthority: updateAuthority !== null && updateAuthority !== void 0 ? updateAuthority : wallet.publicKey,
        mint: editionMint,
        mintAuthority: wallet.publicKey,
        maxSupply,
    });
    return sendTransaction({
        connection,
        signers: [],
        txs: [createMetadataTx],
        wallet,
    });
});

const signMetadata = ({ connection, wallet, editionMint, signer } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const metadata = yield Metadata.getPDA(editionMint);
    const signTx = new SignMetadata({ feePayer: wallet.publicKey }, {
        metadata,
        creator: signer ? signer.publicKey : wallet.publicKey,
    });
    return yield sendTransaction({
        connection,
        signers: signer ? [signer] : [],
        txs: [signTx],
        wallet,
    });
});

const updateMetadata = ({ connection, wallet, editionMint, newMetadataData, newUpdateAuthority, primarySaleHappened, } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const metadata = yield Metadata.getPDA(editionMint);
    const updateTx = new UpdateMetadata({ feePayer: wallet.publicKey }, {
        metadata,
        updateAuthority: wallet.publicKey,
        metadataData: newMetadataData,
        newUpdateAuthority,
        primarySaleHappened,
    });
    return sendTransaction({
        connection,
        signers: [],
        txs: [updateTx],
        wallet,
    });
});

const cancelBid = ({ connection, wallet, auction, bidderPotToken, destAccount, }) => __awaiter(void 0, void 0, void 0, function* () {
    const bidder = wallet.publicKey;
    const auctionManager = yield AuctionManager.getPDA(auction);
    const manager = yield AuctionManager.load(connection, auctionManager);
    const { data: { tokenMint }, } = yield manager.getAuction(connection);
    const auctionTokenMint = new PublicKey(tokenMint);
    const vault = new PublicKey(manager.data.vault);
    const auctionExtended = yield AuctionExtended.getPDA(vault);
    const bidderPot = yield BidderPot.getPDA(auction, bidder);
    const bidderMeta = yield BidderMetadata.getPDA(auction, bidder);
    const accountRentExempt = yield connection.getMinimumBalanceForRentExemption(AccountLayout.span);
    const txBatch = yield getCancelBidTransactions({
        destAccount,
        bidder,
        accountRentExempt,
        bidderPot,
        bidderPotToken,
        bidderMeta,
        auction,
        auctionExtended,
        auctionTokenMint,
        vault,
    });
    const txId = yield sendTransaction({
        connection,
        wallet,
        txs: txBatch.toTransactions(),
        signers: txBatch.signers,
    });
    return { txId };
});
const getCancelBidTransactions = ({ destAccount, bidder, accountRentExempt, bidderPot, bidderPotToken, bidderMeta, auction, auctionExtended, auctionTokenMint, vault, }) => __awaiter(void 0, void 0, void 0, function* () {
    const txBatch = new TransactionsBatch({ transactions: [] });
    if (!destAccount) {
        const account = Keypair.generate();
        const createTokenAccountTransaction = new CreateTokenAccount({ feePayer: bidder }, {
            newAccountPubkey: account.publicKey,
            lamports: accountRentExempt,
            mint: NATIVE_MINT,
        });
        const closeTokenAccountInstruction = new Transaction().add(Token.createCloseAccountInstruction(TOKEN_PROGRAM_ID, account.publicKey, bidder, bidder, []));
        txBatch.addTransaction(createTokenAccountTransaction);
        txBatch.addAfterTransaction(closeTokenAccountInstruction);
        txBatch.addSigner(account);
        destAccount = account.publicKey;
    }
    const cancelBidTransaction = new CancelBid({ feePayer: bidder }, {
        bidder,
        bidderToken: destAccount,
        bidderPot,
        bidderPotToken,
        bidderMeta,
        auction,
        auctionExtended,
        tokenMint: auctionTokenMint,
        resource: vault,
    });
    txBatch.addTransaction(cancelBidTransaction);
    return txBatch;
});

const placeBid = ({ connection, wallet, amount, auction, bidderPotToken, }) => __awaiter(void 0, void 0, void 0, function* () {
    const bidder = wallet.publicKey;
    const accountRentExempt = yield connection.getMinimumBalanceForRentExemption(AccountLayout.span);
    const auctionManager = yield AuctionManager.getPDA(auction);
    const manager = yield AuctionManager.load(connection, auctionManager);
    const { data: { tokenMint }, } = yield manager.getAuction(connection);
    const auctionTokenMint = new PublicKey(tokenMint);
    const vault = new PublicKey(manager.data.vault);
    const auctionExtended = yield AuctionExtended.getPDA(vault);
    const bidderPot = yield BidderPot.getPDA(auction, bidder);
    const bidderMeta = yield BidderMetadata.getPDA(auction, bidder);
    let txBatch = new TransactionsBatch({ transactions: [] });
    if (bidderPotToken) {
        txBatch = yield getCancelBidTransactions({
            destAccount: null,
            bidder,
            accountRentExempt,
            bidderPot,
            bidderPotToken,
            bidderMeta,
            auction,
            auctionExtended,
            auctionTokenMint,
            vault,
        });
    }
    else {
        const account = Keypair.generate();
        const createBidderPotTransaction = new CreateTokenAccount({ feePayer: bidder }, {
            newAccountPubkey: account.publicKey,
            lamports: accountRentExempt,
            mint: auctionTokenMint,
            owner: auction,
        });
        txBatch.addSigner(account);
        txBatch.addTransaction(createBidderPotTransaction);
        bidderPotToken = account.publicKey;
    }
    const { account: payingAccount, createTokenAccountTx, closeTokenAccountTx, } = yield createWrappedAccountTxs(connection, bidder, amount.toNumber() + accountRentExempt * 2);
    txBatch.addTransaction(createTokenAccountTx);
    txBatch.addAfterTransaction(closeTokenAccountTx);
    txBatch.addSigner(payingAccount);
    const { authority: transferAuthority, createApproveTx, createRevokeTx, } = createApproveTxs({
        account: payingAccount.publicKey,
        owner: bidder,
        amount: amount.toNumber(),
    });
    txBatch.addTransaction(createApproveTx);
    txBatch.addAfterTransaction(createRevokeTx);
    txBatch.addSigner(transferAuthority);
    const placeBidTransaction = new PlaceBid({ feePayer: bidder }, {
        bidder,
        bidderToken: payingAccount.publicKey,
        bidderPot,
        bidderPotToken,
        bidderMeta,
        auction,
        auctionExtended,
        tokenMint: auctionTokenMint,
        transferAuthority: transferAuthority.publicKey,
        amount,
        resource: vault,
    });
    txBatch.addTransaction(placeBidTransaction);
    const txId = yield sendTransaction({
        connection,
        wallet,
        txs: txBatch.toTransactions(),
        signers: txBatch.signers,
    });
    return { txId, bidderPotToken, bidderMeta };
});

const redeemFullRightsTransferBid = ({ connection, wallet, store, auction, }) => __awaiter(void 0, void 0, void 0, function* () {
    const bidder = wallet.publicKey;
    const accountRentExempt = yield connection.getMinimumBalanceForRentExemption(AccountLayout.span);
    const auctionManager = yield AuctionManager.getPDA(auction);
    const manager = yield AuctionManager.load(connection, auctionManager);
    const vault = yield Vault.load(connection, manager.data.vault);
    const fractionMint = new PublicKey(vault.data.fractionMint);
    const auctionExtended = yield AuctionExtended.getPDA(vault.pubkey);
    const [safetyDepositBox] = yield vault.getSafetyDepositBoxes(connection);
    const tokenMint = new PublicKey(safetyDepositBox.data.tokenMint);
    const safetyDepositTokenStore = new PublicKey(safetyDepositBox.data.store);
    const bidderMeta = yield BidderMetadata.getPDA(auction, bidder);
    const bidRedemption = yield getBidRedemptionPDA(auction, bidderMeta);
    const safetyDepositConfig = yield SafetyDepositConfig.getPDA(auctionManager, safetyDepositBox.pubkey);
    const transferAuthority = yield Vault.getPDA(vault.pubkey);
    const metadata = yield Metadata.getPDA(tokenMint);
    const txBatch = yield getRedeemFRTBidTransactions({
        accountRentExempt,
        tokenMint,
        bidder,
        bidderMeta,
        store,
        vault: vault.pubkey,
        auction,
        auctionExtended,
        auctionManager,
        fractionMint,
        safetyDepositTokenStore,
        safetyDeposit: safetyDepositBox.pubkey,
        bidRedemption,
        safetyDepositConfig,
        transferAuthority,
        metadata,
    });
    const txId = yield sendTransaction({
        connection,
        wallet,
        txs: txBatch.toTransactions(),
        signers: txBatch.signers,
    });
    return { txId };
});
const getRedeemFRTBidTransactions = ({ accountRentExempt, bidder, tokenMint, store, vault, auction, auctionManager, auctionExtended, bidRedemption, bidderMeta: bidMetadata, safetyDepositTokenStore, safetyDeposit, fractionMint, safetyDepositConfig, transferAuthority, metadata, }) => __awaiter(void 0, void 0, void 0, function* () {
    const txBatch = new TransactionsBatch({ transactions: [] });
    const account = Keypair.generate();
    const createDestinationTransaction = new CreateTokenAccount({ feePayer: bidder }, {
        newAccountPubkey: account.publicKey,
        lamports: accountRentExempt,
        mint: tokenMint,
    });
    txBatch.addSigner(account);
    txBatch.addTransaction(createDestinationTransaction);
    const redeemBidTransaction = new RedeemFullRightsTransferBid({ feePayer: bidder }, {
        store,
        vault,
        auction,
        auctionManager,
        bidRedemption,
        bidMetadata,
        safetyDepositTokenStore,
        destination: account.publicKey,
        safetyDeposit,
        fractionMint,
        bidder,
        safetyDepositConfig,
        auctionExtended,
        transferAuthority,
        newAuthority: bidder,
        masterMetadata: metadata,
    });
    txBatch.addTransaction(redeemBidTransaction);
    const updatePrimarySaleHappenedViaTokenTransaction = new UpdatePrimarySaleHappenedViaToken({ feePayer: bidder }, {
        metadata,
        owner: bidder,
        tokenAccount: account.publicKey,
    });
    txBatch.addTransaction(updatePrimarySaleHappenedViaTokenTransaction);
    return txBatch;
});
const getBidRedemptionPDA = (auction, bidderMeta) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield PublicKey.findProgramAddress([Buffer.from(MetaplexProgram.PREFIX), auction.toBuffer(), bidderMeta.toBuffer()], MetaplexProgram.PUBKEY))[0];
});

const redeemPrintingV2Bid = ({ connection, wallet, store, auction, }) => __awaiter(void 0, void 0, void 0, function* () {
    const bidder = wallet.publicKey;
    const { data: { bidState }, } = yield Auction.load(connection, auction);
    const auctionManagerPDA = yield AuctionManager.getPDA(auction);
    const manager = yield AuctionManager.load(connection, auctionManagerPDA);
    const vault = yield Vault.load(connection, manager.data.vault);
    const auctionExtendedPDA = yield AuctionExtended.getPDA(vault.pubkey);
    const [safetyDepositBox] = yield vault.getSafetyDepositBoxes(connection);
    const originalMint = new PublicKey(safetyDepositBox.data.tokenMint);
    const safetyDepositTokenStore = new PublicKey(safetyDepositBox.data.store);
    const bidderMetaPDA = yield BidderMetadata.getPDA(auction, bidder);
    const bidRedemptionPDA = yield getBidRedemptionPDA(auction, bidderMetaPDA);
    const safetyDepositConfigPDA = yield SafetyDepositConfig.getPDA(auctionManagerPDA, safetyDepositBox.pubkey);
    const { mint, createMintTx, createAssociatedTokenAccountTx, mintToTx, recipient } = yield prepareTokenAccountAndMintTxs(connection, wallet.publicKey);
    const newMint = mint.publicKey;
    const newMetadataPDA = yield Metadata.getPDA(newMint);
    const newEditionPDA = yield Edition.getPDA(newMint);
    const metadataPDA = yield Metadata.getPDA(originalMint);
    const masterEditionPDA = yield MasterEdition.getPDA(originalMint);
    const masterEdition = yield MasterEdition.load(connection, masterEditionPDA);
    const prizeTrackingTicketPDA = yield PrizeTrackingTicket.getPDA(auctionManagerPDA, originalMint);
    let prizeTrackingTicket;
    try {
        prizeTrackingTicket = yield PrizeTrackingTicket.load(connection, prizeTrackingTicketPDA);
    }
    catch (e) {
        prizeTrackingTicket = null;
    }
    const winIndex = bidState.getWinnerIndex(bidder.toBase58()) || 0;
    const editionOffset = getEditionOffset(winIndex);
    const editionBase = (prizeTrackingTicket === null || prizeTrackingTicket === void 0 ? void 0 : prizeTrackingTicket.data.supplySnapshot) || masterEdition.data.supply;
    const desiredEdition = editionBase.add(editionOffset);
    const editionMarkerPDA = yield EditionMarker.getPDA(originalMint, desiredEdition);
    try {
        const editionMarker = yield EditionMarker.load(connection, editionMarkerPDA);
        const isEditionTaken = editionMarker.data.editionTaken(desiredEdition.toNumber());
        if (isEditionTaken) {
            throw new Error('The edition is already taken');
        }
    }
    catch (e) {
    }
    const txBatch = yield getRedeemPrintingV2BidTransactions({
        bidder,
        bidderMeta: bidderMetaPDA,
        store,
        vault: vault.pubkey,
        destination: recipient,
        auction,
        auctionExtended: auctionExtendedPDA,
        auctionManager: auctionManagerPDA,
        safetyDepositTokenStore,
        safetyDeposit: safetyDepositBox.pubkey,
        bidRedemption: bidRedemptionPDA,
        safetyDepositConfig: safetyDepositConfigPDA,
        metadata: metadataPDA,
        newMint,
        newMetadata: newMetadataPDA,
        newEdition: newEditionPDA,
        masterEdition: masterEditionPDA,
        editionMarker: editionMarkerPDA,
        prizeTrackingTicket: prizeTrackingTicketPDA,
        editionOffset,
        winIndex: new BN(winIndex),
    });
    txBatch.addSigner(mint);
    txBatch.addBeforeTransaction(createMintTx);
    txBatch.addBeforeTransaction(createAssociatedTokenAccountTx);
    txBatch.addBeforeTransaction(mintToTx);
    const txId = yield sendTransaction({
        connection,
        wallet,
        txs: txBatch.toTransactions(),
        signers: txBatch.signers,
    });
    return { txId };
});
const getRedeemPrintingV2BidTransactions = ({ bidder, destination, store, vault, auction, auctionManager, auctionExtended, bidRedemption, bidderMeta: bidMetadata, safetyDepositTokenStore, safetyDeposit, safetyDepositConfig, metadata, newMint, newMetadata, newEdition, masterEdition, editionMarker: editionMark, prizeTrackingTicket, winIndex, editionOffset, }) => __awaiter(void 0, void 0, void 0, function* () {
    const txBatch = new TransactionsBatch({ transactions: [] });
    const redeemPrintingV2BidTx = new RedeemPrintingV2Bid({ feePayer: bidder }, {
        store,
        vault,
        auction,
        auctionManager,
        bidRedemption,
        bidMetadata,
        safetyDepositTokenStore,
        destination,
        safetyDeposit,
        bidder,
        safetyDepositConfig,
        auctionExtended,
        newMint,
        newEdition,
        newMetadata,
        metadata,
        masterEdition,
        editionMark,
        prizeTrackingTicket,
        winIndex,
        editionOffset,
    });
    txBatch.addTransaction(redeemPrintingV2BidTx);
    const updatePrimarySaleHappenedViaTokenTx = new UpdatePrimarySaleHappenedViaToken({ feePayer: bidder }, {
        metadata: newMetadata,
        owner: bidder,
        tokenAccount: destination,
    });
    txBatch.addTransaction(updatePrimarySaleHappenedViaTokenTx);
    return txBatch;
});
function getEditionOffset(winIndex) {
    const offset = new BN(1);
    return offset.add(new BN(winIndex));
}

const redeemParticipationBidV3 = ({ connection, wallet, store, auction, }) => __awaiter(void 0, void 0, void 0, function* () {
    const txInitBatch = new TransactionsBatch({ transactions: [] });
    const txMainBatch = new TransactionsBatch({ transactions: [] });
    const bidder = wallet.publicKey;
    const { data: { bidState, tokenMint: auctionTokenMint }, } = yield Auction.load(connection, auction);
    const auctionManagerPDA = yield AuctionManager.getPDA(auction);
    const manager = yield AuctionManager.load(connection, auctionManagerPDA);
    const vault = yield Vault.load(connection, manager.data.vault);
    const auctionExtendedPDA = yield AuctionExtended.getPDA(vault.pubkey);
    const [safetyDepositBox] = yield vault.getSafetyDepositBoxes(connection);
    const originalMint = new PublicKey(safetyDepositBox.data.tokenMint);
    const safetyDepositTokenStore = new PublicKey(safetyDepositBox.data.store);
    const bidderMetaPDA = yield BidderMetadata.getPDA(auction, bidder);
    const bidRedemptionPDA = yield getBidRedemptionPDA(auction, bidderMetaPDA);
    const safetyDepositConfigPDA = yield SafetyDepositConfig.getPDA(auctionManagerPDA, safetyDepositBox.pubkey);
    const { data: { participationConfig: { fixedPrice }, }, } = yield SafetyDepositConfig.load(connection, safetyDepositConfigPDA);
    const acceptPaymentAccount = new PublicKey(manager.data.acceptPayment);
    const { mint, createMintTx, createAssociatedTokenAccountTx, mintToTx, recipient } = yield prepareTokenAccountAndMintTxs(connection, wallet.publicKey);
    txInitBatch.addSigner(mint);
    txInitBatch.addTransaction(createMintTx);
    txInitBatch.addTransaction(createAssociatedTokenAccountTx);
    txInitBatch.addTransaction(mintToTx);
    const newMint = mint.publicKey;
    const newMetadataPDA = yield Metadata.getPDA(newMint);
    const newEditionPDA = yield Edition.getPDA(newMint);
    const metadataPDA = yield Metadata.getPDA(originalMint);
    const masterEditionPDA = yield MasterEdition.getPDA(originalMint);
    const masterEdition = yield MasterEdition.load(connection, masterEditionPDA);
    const prizeTrackingTicketPDA = yield PrizeTrackingTicket.getPDA(auctionManagerPDA, originalMint);
    const winIndex = bidState.getWinnerIndex(bidder.toBase58());
    const desiredEdition = masterEdition.data.supply.add(new BN(1));
    const editionMarkerPDA = yield EditionMarker.getPDA(originalMint, desiredEdition);
    let tokenPaymentAccount;
    if (auctionTokenMint === NATIVE_MINT.toBase58()) {
        const { account, createTokenAccountTx, closeTokenAccountTx } = yield createWrappedAccountTxs(connection, bidder, fixedPrice.toNumber());
        tokenPaymentAccount = account.publicKey;
        txInitBatch.addTransaction(createTokenAccountTx);
        txInitBatch.addSigner(account);
        txMainBatch.addAfterTransaction(closeTokenAccountTx);
    }
    else {
        tokenPaymentAccount = yield Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, new PublicKey(auctionTokenMint), bidder);
    }
    const { authority, createApproveTx, createRevokeTx } = createApproveTxs({
        account: tokenPaymentAccount,
        owner: bidder,
        amount: fixedPrice.toNumber(),
    });
    txMainBatch.addTransaction(createApproveTx);
    txMainBatch.addAfterTransaction(createRevokeTx);
    txMainBatch.addSigner(authority);
    const redeemParticipationBidV3Tx = new RedeemParticipationBidV3({ feePayer: bidder }, {
        store,
        vault: vault.pubkey,
        auction,
        auctionManager: auctionManagerPDA,
        bidRedemption: bidRedemptionPDA,
        bidMetadata: bidderMetaPDA,
        safetyDepositTokenStore,
        destination: recipient,
        safetyDeposit: safetyDepositBox.pubkey,
        bidder,
        safetyDepositConfig: safetyDepositConfigPDA,
        auctionExtended: auctionExtendedPDA,
        newMint,
        newEdition: newEditionPDA,
        newMetadata: newMetadataPDA,
        metadata: metadataPDA,
        masterEdition: masterEditionPDA,
        editionMark: editionMarkerPDA,
        prizeTrackingTicket: prizeTrackingTicketPDA,
        winIndex: winIndex !== null ? new BN(winIndex) : null,
        transferAuthority: authority.publicKey,
        tokenPaymentAccount,
        acceptPaymentAccount,
    });
    txMainBatch.addTransaction(redeemParticipationBidV3Tx);
    const updatePrimarySaleHappenedViaTokenTx = new UpdatePrimarySaleHappenedViaToken({ feePayer: bidder }, {
        metadata: newMetadataPDA,
        owner: bidder,
        tokenAccount: recipient,
    });
    txMainBatch.addTransaction(updatePrimarySaleHappenedViaTokenTx);
    const initTxId = yield sendTransaction({
        connection,
        wallet,
        txs: txInitBatch.toTransactions(),
        signers: txInitBatch.signers,
    });
    yield connection.confirmTransaction(initTxId, 'finalized');
    const mainTxId = yield sendTransaction({
        connection,
        wallet,
        txs: txMainBatch.toTransactions(),
        signers: txMainBatch.signers,
    });
    return { txIds: [initTxId, mainTxId] };
});
function isEligibleForParticipationPrize(winIndex, { nonWinningConstraint, winnerConstraint } = {}) {
    const noWinnerConstraints = winnerConstraint !== WinningConstraint.NoParticipationPrize;
    const noNonWinnerConstraints = nonWinningConstraint !== NonWinningConstraint.NoParticipationPrize;
    return ((winIndex === null && noNonWinnerConstraints) || (winIndex !== null && noWinnerConstraints));
}

const claimBid = ({ connection, wallet, store, auction, bidderPotToken, }) => __awaiter(void 0, void 0, void 0, function* () {
    const bidder = wallet.publicKey;
    const auctionManager = yield AuctionManager.getPDA(auction);
    const manager = yield AuctionManager.load(connection, auctionManager);
    const vault = new PublicKey(manager.data.vault);
    const { data: { tokenMint }, } = yield Auction.load(connection, auction);
    const acceptPayment = new PublicKey(manager.data.acceptPayment);
    const auctionExtended = yield AuctionExtended.getPDA(vault);
    const auctionTokenMint = new PublicKey(tokenMint);
    const bidderPot = yield BidderPot.getPDA(auction, bidder);
    const txBatch = yield getClaimBidTransactions({
        auctionTokenMint,
        bidder,
        store,
        vault,
        auction,
        auctionExtended,
        auctionManager,
        acceptPayment,
        bidderPot,
        bidderPotToken,
    });
    const txId = yield sendTransaction({
        connection,
        wallet,
        txs: txBatch.toTransactions(),
        signers: txBatch.signers,
    });
    return { txId };
});
const getClaimBidTransactions = ({ bidder, auctionTokenMint, store, vault, auction, auctionManager, auctionExtended, acceptPayment, bidderPot, bidderPotToken, }) => __awaiter(void 0, void 0, void 0, function* () {
    const txBatch = new TransactionsBatch({ transactions: [] });
    const claimBidTransaction = new ClaimBid({ feePayer: bidder }, {
        store,
        vault,
        auction,
        auctionExtended,
        auctionManager,
        bidder,
        tokenMint: auctionTokenMint,
        acceptPayment,
        bidderPot,
        bidderPotToken,
    });
    txBatch.addTransaction(claimBidTransaction);
    return txBatch;
});

const instantSale = ({ connection, wallet, store, auction, }) => __awaiter(void 0, void 0, void 0, function* () {
    const txIds = [];
    const auctionManagerPDA = yield AuctionManager.getPDA(auction);
    const manager = yield AuctionManager.load(connection, auctionManagerPDA);
    const vault = yield Vault.load(connection, manager.data.vault);
    const auctionExtendedPDA = yield AuctionExtended.getPDA(vault.pubkey);
    const { data: { instantSalePrice }, } = yield AuctionExtended.load(connection, auctionExtendedPDA);
    const [safetyDepositBox] = yield vault.getSafetyDepositBoxes(connection);
    const safetyDepositConfigPDA = yield SafetyDepositConfig.getPDA(auctionManagerPDA, safetyDepositBox.pubkey);
    const { data: { winningConfigType, participationConfig }, } = yield SafetyDepositConfig.load(connection, safetyDepositConfigPDA);
    const { txId: placeBidTxId, bidderPotToken } = yield placeBid({
        connection,
        wallet,
        amount: instantSalePrice,
        auction,
    });
    txIds.push(placeBidTxId);
    yield connection.confirmTransaction(placeBidTxId, 'finalized');
    const { data: { bidState }, } = yield Auction.load(connection, auction);
    const winIndex = bidState.getWinnerIndex(wallet.publicKey.toBase58());
    const hasWinner = winIndex !== null;
    if (hasWinner) {
        switch (winningConfigType) {
            case WinningConfigType.FullRightsTransfer: {
                const { txId } = yield redeemFullRightsTransferBid({ connection, wallet, store, auction });
                txIds.push(txId);
                break;
            }
            case WinningConfigType.PrintingV2: {
                const { txId } = yield redeemPrintingV2Bid({ connection, wallet, store, auction });
                txIds.push(txId);
                break;
            }
            default:
                throw new Error(`${winningConfigType} winning type isn't supported yet`);
        }
        const { txId: claimBidTxId } = yield claimBid({
            connection,
            wallet,
            store,
            auction,
            bidderPotToken,
        });
        txIds.push(claimBidTxId);
    }
    else {
        const { txId } = yield cancelBid({ connection, wallet, auction, bidderPotToken });
        txIds.push(txId);
    }
    const hasWonParticipationPrize = isEligibleForParticipationPrize(winIndex, participationConfig);
    if (hasWonParticipationPrize) {
        const { txIds } = yield redeemParticipationBidV3({ connection, wallet, store, auction });
        txIds.push(...txIds);
    }
    return { txIds: txIds };
});

const burnToken = ({ connection, wallet, token, mint, amount, owner, close = true, }) => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new Transaction({ feePayer: wallet.publicKey }).add(Token.createBurnInstruction(TOKEN_PROGRAM_ID, mint, token, owner !== null && owner !== void 0 ? owner : wallet.publicKey, [], amount));
    if (close) {
        tx.add(Token.createCloseAccountInstruction(TOKEN_PROGRAM_ID, token, wallet.publicKey, owner !== null && owner !== void 0 ? owner : wallet.publicKey, []));
    }
    const txId = yield sendTransaction({ connection, wallet, txs: [tx] });
    return { txId };
});

const sendToken = ({ connection, wallet, source, destination, mint, amount, }) => __awaiter(void 0, void 0, void 0, function* () {
    const txs = [];
    const destAta = yield Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mint, destination);
    const transactionCtorFields = {
        feePayer: wallet.publicKey,
    };
    try {
        yield Account.load(connection, destAta);
    }
    catch (_a) {
        txs.push(new CreateAssociatedTokenAccount(transactionCtorFields, {
            associatedTokenAddress: destAta,
            splTokenMintAddress: mint,
            walletAddress: destination,
        }));
    }
    txs.push(new Transaction(transactionCtorFields).add(Token.createTransferInstruction(TOKEN_PROGRAM_ID, source, destAta, wallet.publicKey, [], amount)));
    const txId = yield sendTransaction({ connection, wallet, txs });
    return { txId };
});

const closeVault = ({ connection, wallet, vault, priceMint, }) => __awaiter(void 0, void 0, void 0, function* () {
    const accountRent = yield connection.getMinimumBalanceForRentExemption(AccountLayout.span);
    const fractionMintAuthority = yield Vault.getPDA(vault);
    const txBatch = new TransactionsBatch({ transactions: [] });
    const txOptions = { feePayer: wallet.publicKey };
    const { data: { fractionMint, fractionTreasury, redeemTreasury, pricingLookupAddress }, } = yield Vault.load(connection, vault);
    const fractionMintKey = new PublicKey(fractionMint);
    const fractionTreasuryKey = new PublicKey(fractionTreasury);
    const redeemTreasuryKey = new PublicKey(redeemTreasury);
    const pricingLookupAddressKey = new PublicKey(pricingLookupAddress);
    const activateVaultTx = new ActivateVault(txOptions, {
        vault,
        numberOfShares: new BN(0),
        fractionMint: fractionMintKey,
        fractionTreasury: fractionTreasuryKey,
        fractionMintAuthority,
        vaultAuthority: wallet.publicKey,
    });
    txBatch.addTransaction(activateVaultTx);
    const outstandingShareAccount = Keypair.generate();
    const outstandingShareAccountTx = new CreateTokenAccount(txOptions, {
        newAccountPubkey: outstandingShareAccount.publicKey,
        lamports: accountRent,
        mint: fractionMintKey,
        owner: wallet.publicKey,
    });
    txBatch.addTransaction(outstandingShareAccountTx);
    txBatch.addSigner(outstandingShareAccount);
    const payingTokenAccount = Keypair.generate();
    const payingTokenAccountTx = new CreateTokenAccount(txOptions, {
        newAccountPubkey: payingTokenAccount.publicKey,
        lamports: accountRent,
        mint: priceMint,
        owner: wallet.publicKey,
    });
    txBatch.addTransaction(payingTokenAccountTx);
    txBatch.addSigner(payingTokenAccount);
    const transferAuthority = Keypair.generate();
    const createApproveTx = (account) => new Transaction().add(Token.createApproveInstruction(TOKEN_PROGRAM_ID, account.publicKey, transferAuthority.publicKey, wallet.publicKey, [], 0));
    txBatch.addTransaction(createApproveTx(payingTokenAccount));
    txBatch.addTransaction(createApproveTx(outstandingShareAccount));
    txBatch.addSigner(transferAuthority);
    const combineVaultTx = new CombineVault(txOptions, {
        vault,
        outstandingShareTokenAccount: outstandingShareAccount.publicKey,
        payingTokenAccount: payingTokenAccount.publicKey,
        fractionMint: fractionMintKey,
        fractionTreasury: fractionTreasuryKey,
        redeemTreasury: redeemTreasuryKey,
        burnAuthority: fractionMintAuthority,
        externalPriceAccount: pricingLookupAddressKey,
        transferAuthority: transferAuthority.publicKey,
        vaultAuthority: wallet.publicKey,
        newVaultAuthority: wallet.publicKey,
    });
    txBatch.addTransaction(combineVaultTx);
    const txId = yield sendTransaction({
        connection,
        signers: txBatch.signers,
        txs: txBatch.transactions,
        wallet,
    });
    return { txId };
});

const createExternalPriceAccount = ({ connection, wallet, }) => __awaiter(void 0, void 0, void 0, function* () {
    const txBatch = new TransactionsBatch({ transactions: [] });
    const txOptions = { feePayer: wallet.publicKey };
    const epaRentExempt = yield connection.getMinimumBalanceForRentExemption(Vault.MAX_EXTERNAL_ACCOUNT_SIZE);
    const externalPriceAccount = Keypair.generate();
    const externalPriceAccountData = new ExternalPriceAccountData({
        pricePerShare: new BN(0),
        priceMint: NATIVE_MINT.toBase58(),
        allowedToCombine: true,
    });
    const uninitializedEPA = new Transaction().add(SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: externalPriceAccount.publicKey,
        lamports: epaRentExempt,
        space: Vault.MAX_EXTERNAL_ACCOUNT_SIZE,
        programId: VaultProgram.PUBKEY,
    }));
    txBatch.addTransaction(uninitializedEPA);
    txBatch.addSigner(externalPriceAccount);
    const updateEPA = new UpdateExternalPriceAccount(txOptions, {
        externalPriceAccount: externalPriceAccount.publicKey,
        externalPriceAccountData,
    });
    txBatch.addTransaction(updateEPA);
    const txId = yield sendTransaction({
        connection,
        signers: txBatch.signers,
        txs: txBatch.transactions,
        wallet,
    });
    return {
        txId,
        externalPriceAccount: externalPriceAccount.publicKey,
        priceMint: NATIVE_MINT,
    };
});

const createVault = ({ connection, wallet, priceMint = NATIVE_MINT, externalPriceAccount, }) => __awaiter(void 0, void 0, void 0, function* () {
    const accountRent = yield connection.getMinimumBalanceForRentExemption(AccountLayout.span);
    const mintRent = yield connection.getMinimumBalanceForRentExemption(MintLayout.span);
    const vaultRent = yield connection.getMinimumBalanceForRentExemption(Vault.MAX_VAULT_SIZE);
    const vault = Keypair.generate();
    const vaultAuthority = yield Vault.getPDA(vault.publicKey);
    const txBatch = new TransactionsBatch({ transactions: [] });
    const fractionMint = Keypair.generate();
    const fractionMintTx = new CreateMint({ feePayer: wallet.publicKey }, {
        newAccountPubkey: fractionMint.publicKey,
        lamports: mintRent,
        owner: vaultAuthority,
        freezeAuthority: vaultAuthority,
    });
    txBatch.addTransaction(fractionMintTx);
    txBatch.addSigner(fractionMint);
    const redeemTreasury = Keypair.generate();
    const redeemTreasuryTx = new CreateTokenAccount({ feePayer: wallet.publicKey }, {
        newAccountPubkey: redeemTreasury.publicKey,
        lamports: accountRent,
        mint: priceMint,
        owner: vaultAuthority,
    });
    txBatch.addTransaction(redeemTreasuryTx);
    txBatch.addSigner(redeemTreasury);
    const fractionTreasury = Keypair.generate();
    const fractionTreasuryTx = new CreateTokenAccount({ feePayer: wallet.publicKey }, {
        newAccountPubkey: fractionTreasury.publicKey,
        lamports: accountRent,
        mint: fractionMint.publicKey,
        owner: vaultAuthority,
    });
    txBatch.addTransaction(fractionTreasuryTx);
    txBatch.addSigner(fractionTreasury);
    const uninitializedVaultTx = new Transaction().add(SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: vault.publicKey,
        lamports: vaultRent,
        space: Vault.MAX_VAULT_SIZE,
        programId: VaultProgram.PUBKEY,
    }));
    txBatch.addTransaction(uninitializedVaultTx);
    txBatch.addSigner(vault);
    const initVaultTx = new InitVault({ feePayer: wallet.publicKey }, {
        vault: vault.publicKey,
        vaultAuthority: wallet.publicKey,
        fractionalTreasury: fractionTreasury.publicKey,
        pricingLookupAddress: externalPriceAccount,
        redeemTreasury: redeemTreasury.publicKey,
        fractionalMint: fractionMint.publicKey,
        allowFurtherShareCreation: true,
    });
    txBatch.addTransaction(initVaultTx);
    const txId = yield sendTransaction({
        connection,
        signers: txBatch.signers,
        txs: txBatch.transactions,
        wallet,
    });
    return {
        txId,
        vault: vault.publicKey,
        fractionMint: fractionMint.publicKey,
        redeemTreasury: redeemTreasury.publicKey,
        fractionTreasury: fractionTreasury.publicKey,
    };
});

const initAuction = ({ connection, wallet, vault, auctionSettings, }) => __awaiter(void 0, void 0, void 0, function* () {
    const txOptions = { feePayer: wallet.publicKey };
    const [auctionKey, auctionExtended] = yield Promise.all([
        Auction.getPDA(vault),
        AuctionExtended.getPDA(vault),
    ]);
    const fullSettings = new CreateAuctionArgs(Object.assign(Object.assign({}, auctionSettings), { authority: wallet.publicKey.toBase58(), resource: vault.toBase58() }));
    const auctionTx = new CreateAuction(txOptions, {
        args: fullSettings,
        auction: auctionKey,
        creator: wallet.publicKey,
        auctionExtended,
    });
    const txId = yield sendTransaction({
        connection,
        signers: [],
        txs: [auctionTx],
        wallet,
    });
    return { txId, auction: auctionKey };
});

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  addTokensToVault: addTokensToVault,
  sendTransaction: sendTransaction,
  initStore: initStore,
  initStoreV2: initStoreV2,
  mintNFT: mintNFT,
  mintEditionFromMaster: mintEditionFromMaster,
  createMetadata: createMetadata,
  createMasterEdition: createMasterEdition,
  signMetadata: signMetadata,
  updateMetadata: updateMetadata,
  cancelBid: cancelBid,
  getCancelBidTransactions: getCancelBidTransactions,
  placeBid: placeBid,
  redeemFullRightsTransferBid: redeemFullRightsTransferBid,
  getRedeemFRTBidTransactions: getRedeemFRTBidTransactions,
  getBidRedemptionPDA: getBidRedemptionPDA,
  redeemPrintingV2Bid: redeemPrintingV2Bid,
  getRedeemPrintingV2BidTransactions: getRedeemPrintingV2BidTransactions,
  getEditionOffset: getEditionOffset,
  redeemParticipationBidV3: redeemParticipationBidV3,
  isEligibleForParticipationPrize: isEligibleForParticipationPrize,
  claimBid: claimBid,
  getClaimBidTransactions: getClaimBidTransactions,
  instantSale: instantSale,
  burnToken: burnToken,
  sendToken: sendToken,
  prepareTokenAccountAndMintTxs: prepareTokenAccountAndMintTxs,
  createWrappedAccountTxs: createWrappedAccountTxs,
  createApproveTxs: createApproveTxs,
  closeVault: closeVault,
  createExternalPriceAccount: createExternalPriceAccount,
  createVault: createVault,
  initAuction: initAuction
});

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  transactions: index$2,
  auction: mplAuction,
  core: mplCore,
  metaplex: mplMetaplex,
  metadata: mplTokenMetadata,
  vault: mplTokenVault
});

export { ArweaveStorage, ChainId, Coingecko, Connection, Currency, ENV, NodeWallet, index$1 as actions, index as programs, Storage$1 as storage, index$2 as transactions, index$3 as utils };
//# sourceMappingURL=index.browser.esm.js.map
