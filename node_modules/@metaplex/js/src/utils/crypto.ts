import { sha256 } from 'crypto-hash';
import { Buffer } from 'buffer';

export const getFileHash = async (file: Buffer) => Buffer.from(await sha256(file.toString()));
