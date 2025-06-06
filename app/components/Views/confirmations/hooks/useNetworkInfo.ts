import { useSelector } from 'react-redux';
import { toHex } from '@metamask/controller-utils';

import { getNetworkImageSource } from '../../../../util/networks';
import { selectEvmNetworkConfigurationsByChainId } from '../../../../selectors/networkController';
import { isNonEvmChainId } from '../../../../core/Multichain/utils';

const useNetworkInfo = (chainId?: string) => {
  const networkConfigurations = useSelector(
    selectEvmNetworkConfigurationsByChainId,
  );

  if (!chainId) {
    return {};
  }

  if (isNonEvmChainId(chainId)) {
    return {};
  }

  const networkConfiguration = networkConfigurations[toHex(chainId)];
  if (!networkConfiguration) {
    return {};
  }

  const {
    name: nickname,
    rpcEndpoints,
    defaultRpcEndpointIndex,
  } = networkConfiguration;

  const rpcUrl = rpcEndpoints[defaultRpcEndpointIndex].url;
  const rpcName = rpcEndpoints[defaultRpcEndpointIndex].name ?? rpcUrl;
  const networkNativeCurrency = networkConfiguration.nativeCurrency;

  const networkName = nickname || rpcName;

  const networkImage = getNetworkImageSource({ chainId: chainId?.toString() });

  return {
    networkName,
    networkImage,
    networkNativeCurrency,
  };
};

export default useNetworkInfo;
