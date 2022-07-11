/// <reference types="node" />
import { Idl } from "../idl";
/**
 * Number of bytes of the account discriminator.
 */
export declare const ACCOUNT_DISCRIMINATOR_SIZE = 8;
/**
 * Encodes and decodes account objects.
 */
export declare class AccountsCoder<A extends string = string> {
    /**
     * Maps account type identifier to a layout.
     */
    private accountLayouts;
    constructor(idl: Idl);
    encode<T = any>(accountName: A, account: T): Promise<Buffer>;
    decode<T = any>(accountName: A, ix: Buffer): T;
    /**
     * Calculates and returns a unique 8 byte discriminator prepended to all anchor accounts.
     *
     * @param name The name of the account to calculate the discriminator.
     */
    static accountDiscriminator(name: string): Buffer;
}
//# sourceMappingURL=accounts.d.ts.map