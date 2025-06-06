import { Json, hasProperty, isObject } from '@metamask/utils';
import { createSelector } from 'reselect';
import { selectRemoteFeatureFlags } from '..';
import { getFeatureFlagValue } from '../env';

// A type predicate's type must be assignable to its parameter's type
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ConfirmationRedesignRemoteFlags = {
  signatures: boolean;
  staking_confirmations: boolean;
  contract_interaction: boolean;
  transfer: boolean;
};

const isRemoteFeatureFlagValuesValid = (
  obj: Json,
): obj is ConfirmationRedesignRemoteFlags =>
  isObject(obj) &&
  hasProperty(obj, 'signatures') &&
  hasProperty(obj, 'staking_confirmations') &&
  hasProperty(obj, 'contract_interaction') &&
  hasProperty(obj, 'transfer');

const confirmationRedesignFlagsDefaultValues: ConfirmationRedesignRemoteFlags =
  {
    signatures: true,
    staking_confirmations: false,
    contract_interaction: false,
    transfer: false,
  };

export const selectConfirmationRedesignFlagsFromRemoteFeatureFlags = (
  remoteFeatureFlags: ReturnType<typeof selectRemoteFeatureFlags>,
) => {
  const remoteValues = remoteFeatureFlags.confirmation_redesign;

    const confirmationRedesignFlags = isRemoteFeatureFlagValuesValid(
      remoteValues,
    )
      ? remoteValues
      : confirmationRedesignFlagsDefaultValues;

  const isSignaturesEnabled = getFeatureFlagValue(
    process.env.FEATURE_FLAG_REDESIGNED_SIGNATURES,
    confirmationRedesignFlags.signatures,
  );

  const isStakingConfirmationsEnabled = getFeatureFlagValue(
    process.env.FEATURE_FLAG_REDESIGNED_STAKING_TRANSACTIONS,
    confirmationRedesignFlags.staking_confirmations,
  );

  const isContractInteractionEnabled = getFeatureFlagValue(
    process.env.FEATURE_FLAG_REDESIGNED_CONTRACT_INTERACTION,
    confirmationRedesignFlags.contract_interaction,
  );

  const isTransferEnabled = getFeatureFlagValue(
    process.env.FEATURE_FLAG_REDESIGNED_TRANSFER,
    confirmationRedesignFlags.transfer,
  );

  return {
    signatures: isSignaturesEnabled,
    staking_confirmations: isStakingConfirmationsEnabled,
    contract_interaction: isContractInteractionEnabled,
    transfer: isTransferEnabled,
  };
};

export const selectConfirmationRedesignFlags = createSelector(
  selectRemoteFeatureFlags,
  selectConfirmationRedesignFlagsFromRemoteFeatureFlags,
);
