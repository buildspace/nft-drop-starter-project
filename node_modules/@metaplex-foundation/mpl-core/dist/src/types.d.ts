import { Connection, PublicKey } from '@solana/web3.js';
export declare type StringPublicKey = string;
export declare type AnyPublicKey = StringPublicKey | PublicKey;
export declare type RpcRequest = (methodName: string, args: Array<any>) => any;
export declare type ConnnectionWithRpcRequest = Connection & {
    _rpcRequest: RpcRequest;
};
