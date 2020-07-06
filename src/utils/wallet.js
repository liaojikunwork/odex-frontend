import { toWif, getChash160 } from 'byteball/lib/utils';
import Mnemonic from 'bitcore-mnemonic';
import { DEFAULT_NETWORK_ID } from '../config/environment'

const testnet = DEFAULT_NETWORK_ID === 'testnet'; // Change to "true" to generate testnet wallet
const path = testnet ? "m/44'/1'/0'/0/0" : "m/44'/0'/0'/0/0";


export const generateWallet = () => {
  let mnemonic = new Mnemonic();

  while (!Mnemonic.isValid(mnemonic.toString())) {
    mnemonic = new Mnemonic();
  }

  const xPrivKey = mnemonic.toHDPrivateKey();
  const { privateKey } = xPrivKey.derive(path);
  const privKeyBuf = privateKey.bn.toBuffer({ size: 32 });
  const wif = toWif(privKeyBuf, testnet);
  const pubkey = privateKey.publicKey.toBuffer().toString('base64');
  const definition = ['sig', { pubkey }];
  const address = getChash160(definition);

  return {
    address
  }
}

