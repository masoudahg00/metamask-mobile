import BN from 'bnjs4';
import TransactionTypes from '../core/TransactionTypes';
import { ORIGIN_METAMASK } from '@metamask/controller-utils';

// Transaction Status
export const TX_UNAPPROVED = 'unapproved';
export const TX_SUBMITTED = 'submitted';
export const TX_SIGNED = 'signed';
export const TX_PENDING = 'pending';
export const TX_CONFIRMED = 'confirmed';
export const TX_CANCELLED = 'cancelled';
export const TX_APPROVED = 'approved';
export const TX_FAILED = 'failed';
export const TX_REJECTED = 'rejected';

// Values
export const UINT256_BN_MAX_VALUE = new BN(2).pow(new BN(256)).sub(new BN(1));
export const UINT256_HEX_MAX_VALUE =
  'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

// https://github.com/ethjs/ethjs-ens/blob/8ea29591ae545a5da243b0f071b5676ff95aa647/index.js#L13
export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
export const PREFIX_HEX_STRING = '0x';

export const INTERNAL_ORIGINS = [
  process.env.MM_FOX_CODE,
  TransactionTypes.MMM,
  ORIGIN_METAMASK,
];

export enum EIP5792ErrorCode {
  UnsupportedNonOptionalCapability = 5700,
  UnsupportedChainId = 5710,
  UnknownBundleId = 5730,
  RejectedUpgrade = 5750,
}
