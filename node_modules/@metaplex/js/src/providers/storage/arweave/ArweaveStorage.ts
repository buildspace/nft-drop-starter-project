import { Storage, UploadResult } from '../Storage';
import { Buffer } from 'buffer';
import axios from 'axios';
import FormData from 'form-data';

const ARWEAVE_URL = 'https://arweave.net';
const LAMPORT_MULTIPLIER = 10 ** 9;
const WINSTON_MULTIPLIER = 10 ** 12;

export interface ArweaveUploadResult extends UploadResult {
  messages?: {
    filename: string;
    status: 'success' | 'fail';
    transactionId?: string;
    error?: string;
  }[];
}

export interface ArweaveStorageCtorFields {
  endpoint: string;
  env: 'mainnet-beta' | 'testnet' | 'devnet';
}

export class ArweaveStorage implements Storage {
  readonly endpoint: string;
  readonly env: string;

  constructor({ endpoint, env }: ArweaveStorageCtorFields) {
    this.endpoint = endpoint;
    this.env = env;
  }

  async getAssetCostToStore(files: Map<string, Buffer>, arweaveRate: number, solanaRate: number) {
    const buffers = Array.from(files.values());
    const totalBytes = buffers.reduce((sum, f) => (sum += f.byteLength), 0);
    const txnFeeInWinstons = parseInt(await (await axios(`${ARWEAVE_URL}/price/0`)).data);
    const byteCostInWinstons = parseInt(
      await (
        await axios(`${ARWEAVE_URL}/price/${totalBytes.toString()}`)
      ).data,
    );
    const totalArCost =
      (txnFeeInWinstons * buffers.length + byteCostInWinstons) / WINSTON_MULTIPLIER;
    // To figure out how many lamports are required, multiply ar byte cost by this number
    const arMultiplier = arweaveRate / solanaRate;
    // We also always make a manifest file, which, though tiny, needs payment.
    return LAMPORT_MULTIPLIER * totalArCost * arMultiplier * 1.1;
  }

  async upload(
    files: Map<string, Buffer>,
    mintKey: string,
    txid: string,
  ): Promise<ArweaveUploadResult> {
    const fileEntries = Array.from(files.entries());
    const tags = fileEntries.reduce(
      (acc: Record<string, Array<{ name: string; value: string }>>, [fileName]) => {
        acc[fileName] = [{ name: 'mint', value: mintKey }];
        return acc;
      },
      {},
    );

    const body = new FormData();

    body.append('tags', JSON.stringify(tags));
    body.append('transaction', txid);
    body.append('env', this.env);
    fileEntries.map(([, file]) => {
      body.append('file[]', file);
    });

    // TODO: I hate to do this, but it seems to be like an upstream problem:
    // https://github.com/jimmywarting/FormData/issues/133
    // I'll make sure to track it. - Danny
    const response = await axios.post(this.endpoint, body);

    if (response.data.error) {
      return Promise.reject(new Error(response.data.error));
    }

    return response.data;
  }
}
