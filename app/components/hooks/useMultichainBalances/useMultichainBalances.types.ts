import { InternalAccount } from '@metamask/keyring-internal-api';
import { AggregatedPercentageProps } from '../../../component-library/components-temp/Price/AggregatedPercentage/AggregatedPercentage.types';
import { AggregatedPercentageCrossChainsProps } from '../../../component-library/components-temp/Price/AggregatedPercentage/AggregatedPercentageCrossChains.types';

export interface MultichainBalancesData {
  displayBalance?: string;
  displayCurrency: string;
  tokenFiatBalancesCrossChains: AggregatedPercentageCrossChainsProps['tokenFiatBalancesCrossChains'];
  totalFiatBalance: number | undefined;
  totalNativeTokenBalance: string | undefined;
  nativeTokenUnit: string;
  shouldShowAggregatedPercentage: boolean;
  isPortfolioVieEnabled: boolean;
  aggregatedBalance: AggregatedPercentageProps;
  isLoadingAccount: boolean;
}

export interface UseAllAccountsMultichainBalancesHook {
  multichainBalancesForAllAccounts: Record<
    InternalAccount['id'],
    MultichainBalancesData
  >;
}

export interface UseSelectedAccountMultichainBalancesHook {
  selectedAccountMultichainBalance?: MultichainBalancesData;
}
