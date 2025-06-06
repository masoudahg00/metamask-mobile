/* eslint-disable no-undef */

import { getGanachePort } from './utils';
import { merge } from 'lodash';
import { CustomNetworks, PopularNetworksList } from '../resources/networks.e2e';
import { CHAIN_IDS } from '@metamask/transaction-controller';
import { SolScope } from '@metamask/keyring-api';
import {
  Caip25CaveatType,
  Caip25EndowmentPermissionName,
  setEthAccounts,
  setPermittedEthChainIds,
} from '@metamask/chain-agnostic-permission';

export const DEFAULT_FIXTURE_ACCOUNT =
  '0x76cf1CdD1fcC252442b50D6e97207228aA4aefC3';

export const DEFAULT_FIXTURE_ACCOUNT_2 =
  '0xcdd74c6eb517f687aa2c786bc7484eb2f9bae1da';

export const DEFAULT_IMPORTED_FIXTURE_ACCOUNT =
  '0x43e1c289177ecfbe6ef34b5fb2b66ebce5a8e05b';

const DAPP_URL = 'localhost';

/**
 * FixtureBuilder class provides a fluent interface for building fixture data.
 */
class FixtureBuilder {
  /**
   * Create a new instance of FixtureBuilder.
   * @param {Object} options - Options for the fixture builder.
   * @param {boolean} options.onboarding - Flag indicating if onboarding fixture should be used.
   */
  constructor({ onboarding = false } = {}) {
    // Initialize the fixture based on the onboarding flag
    onboarding === true
      ? this.withOnboardingFixture()
      : this.withDefaultFixture();
  }

  /**
   * Set the asyncState property of the fixture.
   * @param {any} asyncState - The value to set for asyncState.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withAsyncState(asyncState) {
    this.fixture.asyncState = asyncState;
    return this;
  }

  /**
   * Set the state property of the fixture.
   * @param {any} state - The value to set for state.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withState(state) {
    this.fixture.state = state;
    return this;
  }

  /**
   * Ensures that the Solana feature modal is suppressed by adding the appropriate flag to asyncState.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  ensureSolanaModalSuppressed() {
    if (!this.fixture.asyncState) {
      this.fixture.asyncState = {};
    }
    this.fixture.asyncState['@MetaMask:solanaFeatureModalShown'] = 'true';
    return this;
  }

  withSolanaFeatureSheetDisplayed() {
    if (!this.fixture.asyncState) {
      this.fixture.asyncState = {};
    }
    this.fixture.asyncState = {
      '@MetaMask:existingUser': 'true',
      '@MetaMask:onboardingWizard': 'explored',
      '@MetaMask:UserTermsAcceptedv1.0': 'true',
      '@MetaMask:WhatsNewAppVersionSeen': '7.24.3',
      '@MetaMask:solanaFeatureModalShown': 'false'
    };
    return this;
  }

  /**
   * Set the default fixture values.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withDefaultFixture() {
    this.fixture = {
      state: {
        legalNotices: {
          newPrivacyPolicyToastClickedOrClosed: true,
          newPrivacyPolicyToastShownDate: Date.now(),
        },
        collectibles: {
          favorites: {},
        },
        engine: {
          backgroundState: {
            AccountTrackerController: {
              accountsByChainId: {
                64: {
                  [DEFAULT_FIXTURE_ACCOUNT]: {
                    balance: '0x0',
                  },
                },
                1: {
                  [DEFAULT_FIXTURE_ACCOUNT]: {
                    balance: '0x0',
                  },
                },
              },
            },
            AddressBookController: {
              addressBook: {},
            },
            NftController: {
              allNftContracts: {},
              allNfts: {},
              ignoredNfts: [],
            },
            TokenListController: {
              tokensChainsCache: {
                '0x1': {
                  data: [
                    {
                      '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': {
                        address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
                        symbol: 'SNX',
                        decimals: 18,
                        name: 'Synthetix Network Token',
                        iconUrl:
                          'https://static.cx.metamask.io/api/v1/tokenIcons/1/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.png',
                        type: 'erc20',
                        aggregators: [
                          'Aave',
                          'Bancor',
                          'CMC',
                          'Crypto.com',
                          'CoinGecko',
                          '1inch',
                          'PMM',
                          'Synthetix',
                          'Zerion',
                          'Lifi',
                        ],
                        occurrences: 10,
                        fees: {
                          '0x5fd79d46eba7f351fe49bff9e87cdea6c821ef9f': 0,
                          '0xda4ef8520b1a57d7d63f1e249606d1a459698876': 0,
                        },
                      },
                    },
                  ],
                },
              },
              preventPollingOnNetworkRestart: false,
            },
            CurrencyRateController: {
              currentCurrency: 'usd',
              currencyRates: {
                ETH: {
                  conversionDate: 1684232383.997,
                  conversionRate: 1815.41,
                  usdConversionRate: 1815.41,
                },
              },
            },
            KeyringController: {
              vault:
                '{"cipher":"ynNI8tAH4fcpmXo8S88A/3T3Dd1w0LY5ftpL59gW0ObYxovgFhrtKpRe/WD7WU42KwGBNKVicB9W9at4ePgOJGS6IMWr//C3jh0vKQTabkDzDy1ZfSvztRxGpVjmrnU3fC5B0eq/MBMSrgu8Bww309pk5jghyRfzp9YsG0ONo1CXUm2brQo/eRve7i9aDbiGXiEK0ch0BO7AvZPGMhHtYRrrOro4QrDVHGUgAF5SA1LD4dv/2AB8ctHwn4YbUmICieqlhJhprx3CNOJ086g7vPQOr21T4IbvtTumFaTibfoD3GWHQo11CvE04z3cN3rRERriP7bww/tZOe8OAMFGWANkmOJHwPPwEo1NBr6w3GD2VObEmqNhXeNc6rrM23Vm1JU40Hl+lVKubnbT1vujdGLmOpDY0GdekscQQrETEQJfhKlXIT0wwyPoLwR+Ja+GjyOhBr0nfWVoVoVrcTUwAk5pStBMt+5OwDRpP29L1+BL9eMwDgKpjVXRTh4MGagKYmFc6eKDf6jV0Yt9pG+jevv5IuyhwX0TRtfQCGgRTtS7oxhDQPxGqu01rr+aI7vGMfRQpaKEEXEWVmMaqCmktyUV35evK9h/xv1Yif00XBll55ShxN8t2/PnATvZxFKQfjJe5f/monbwf8rpfXHuFoh8M9hzjbcS5eh/TPYZZu1KltpeHSIAh5C+4aFyZw0e1DeAg/wdRO3PhBrVztsHSyISHlRdfEyw7QF4Lemr++2MVR1dTxS2I5mUEHjh+hmp64euH1Vb/RUppXlmE8t1RYYXfcsF2DlRwPswP739E/EpVtY3Syf/zOTyHyrOJBldzw22sauIzt8Q5Fe5qA/hGRWiejjK31P/P5j7wEKY7vrOJB1LWNXHSuSjffx9Ai9E","iv":"d5dc0252424ac0c08ca49ef320d09569","salt":"feAPSGdL4R2MVj2urJFl4A==","lib":"original"}',
              keyrings: [
                {
                  accounts: [DEFAULT_FIXTURE_ACCOUNT],
                  index: 0,
                  type: 'HD Key Tree',
                },
              ],
            },
            NetworkController: {
              selectedNetworkClientId: 'mainnet',
              networksMetadata: {
                mainnet: {
                  status: 'available',
                  EIPS: {
                    1559: true,
                  },
                },
                networkId1: {
                  status: 'available',
                  EIPS: {
                    1559: true,
                  },
                },
              },
              networkConfigurationsByChainId: {
                '0x1': {
                  chainId: '0x1',
                  rpcEndpoints: [
                    {
                      networkClientId: 'mainnet',
                      url: 'https://mainnet.infura.io/v3/{infuraProjectId}',
                      type: 'infura',
                      name: 'Ethereum Network default RPC',
                    },
                  ],
                  defaultRpcEndpointIndex: 0,
                  blockExplorerUrls: ['https://etherscan.io'],
                  defaultBlockExplorerUrlIndex: 0,
                  name: 'Ethereum Main Network',
                  nativeCurrency: 'ETH',
                },
                '0x539': {
                  chainId: '0x539',
                  rpcEndpoints: [
                    {
                      networkClientId: 'networkId1',
                      url: `http://localhost:${getGanachePort()}`,
                      type: 'custom',
                      name: 'Local RPC',
                    },
                  ],
                  defaultRpcEndpointIndex: 0,
                  defaultBlockExplorerUrlIndex: 0,
                  blockExplorerUrls: ['https://test.io'],
                  name: 'Localhost',
                  nativeCurrency: 'ETH',
                },
                '0xaa36a7': {
                  blockExplorerUrls: [],
                  chainId: '0xaa36a7',
                  defaultRpcEndpointIndex: 0,
                  name: 'Sepolia',
                  nativeCurrency: 'SepoliaETH',
                  rpcEndpoints: [
                    {
                      networkClientId: 'sepolia',
                      type: 'infura',
                      url: 'https://sepolia.infura.io/v3/{infuraProjectId}',
                    },
                  ],
                },
                '0xe705': {
                  blockExplorerUrls: [],
                  chainId: '0xe705',
                  defaultRpcEndpointIndex: 0,
                  name: 'Linea Sepolia',
                  nativeCurrency: 'LineaETH',
                  rpcEndpoints: [
                    {
                      networkClientId: 'linea-sepolia',
                      type: 'infura',
                      url: 'https://linea-sepolia.infura.io/v3/{infuraProjectId}',
                    },
                  ],
                },
              },
            },
            PhishingController: {
              listState: {
                allowlist: [],
                fuzzylist: [
                  'cryptokitties.co',
                  'launchpad.ethereum.org',
                  'etherscan.io',
                  'makerfoundation.com',
                  'metamask.io',
                  'myetherwallet.com',
                  'opensea.io',
                  'satoshilabs.com',
                ],
                version: 2,
                name: 'MetaMask',
                tolerance: 1,
                lastUpdated: 1684231917,
              },
              whitelist: [],
              hotlistLastFetched: 1684231917,
              stalelistLastFetched: 1684231917,
            },
            AccountsController: {
              internalAccounts: {
                accounts: {
                  '4d7a5e0b-b261-4aed-8126-43972b0fa0a1': {
                    address: DEFAULT_FIXTURE_ACCOUNT,
                    id: '4d7a5e0b-b261-4aed-8126-43972b0fa0a1',
                    metadata: {
                      name: 'Account 1',
                      importTime: 1684232000456,
                      keyring: {
                        type: 'HD Key Tree',
                      },
                    },
                    options: {},
                    methods: [
                      'personal_sign',
                      'eth_signTransaction',
                      'eth_signTypedData_v1',
                      'eth_signTypedData_v3',
                      'eth_signTypedData_v4',
                    ],
                    type: 'eip155:eoa',
                    scopes: ['eip155:0']
                  },
                },
                selectedAccount: '4d7a5e0b-b261-4aed-8126-43972b0fa0a1',
              },
            },
            PreferencesController: {
              featureFlags: {},
              identities: {
                [DEFAULT_FIXTURE_ACCOUNT]: {
                  address: DEFAULT_FIXTURE_ACCOUNT,
                  name: 'Account 1',
                  importTime: 1684232000456,
                },
              },
              ipfsGateway: 'https://dweb.link/ipfs/',
              lostIdentities: {},
              selectedAddress: DEFAULT_FIXTURE_ACCOUNT,
              useTokenDetection: true,
              useNftDetection: true,
              displayNftMedia: true,
              useSafeChainsListValidation: false,
              isMultiAccountBalancesEnabled: true,
              showTestNetworks: true,
            },
            TokenBalancesController: {
              tokenBalances: {},
            },
            TokenRatesController: {
              marketData: {},
            },
            TokensController: {
              allTokens: {},
              allIgnoredTokens: {},
              allDetectedTokens: {},
            },
            TransactionController: {
              methodData: {},
              transactions: [],
              swapsTransactions: {},
            },
            SwapsController: {
              quotes: {},
              quoteValues: {},
              fetchParams: {
                slippage: 0,
                sourceToken: '',
                sourceAmount: 0,
                destinationToken: '',
                walletAddress: '',
              },
              fetchParamsMetaData: {
                sourceTokenInfo: {
                  decimals: 0,
                  address: '',
                  symbol: '',
                },
                destinationTokenInfo: {
                  decimals: 0,
                  address: '',
                  symbol: '',
                },
              },
              topAggSavings: null,
              aggregatorMetadata: null,
              tokens: null,
              topAssets: null,
              approvalTransaction: null,
              aggregatorMetadataLastFetched: 0,
              quotesLastFetched: 0,
              error: {
                key: null,
                description: null,
              },
              topAggId: null,
              tokensLastFetched: 0,
              isInPolling: false,
              pollingCyclesLeft: 4,
              quoteRefreshSeconds: null,
              usedGasEstimate: null,
              usedCustomGas: null,
              chainCache: {
                '0x1': {
                  aggregatorMetadata: null,
                  tokens: null,
                  topAssets: null,
                  aggregatorMetadataLastFetched: 0,
                  topAssetsLastFetched: 0,
                  tokensLastFetched: 0,
                },
              },
            },
            GasFeeController: {
              gasFeeEstimates: {},
              estimatedGasFeeTimeBounds: {},
              gasEstimateType: 'none',
              gasFeeEstimatesByChainId: {},
              nonRPCGasFeeApisDisabled: false,
            },
            PermissionController: {
              subjects: {},
            },
            ApprovalController: {
              pendingApprovals: {},
              pendingApprovalCount: 0,
              approvalFlows: [],
            },
            UserStorageController: {},
            NotificationServicesController: {
              subscriptionAccountsSeen: [],
              isMetamaskNotificationsFeatureSeen: false,
              isNotificationServicesEnabled: false,
              isFeatureAnnouncementsEnabled: false,
              metamaskNotificationsList: [],
              metamaskNotificationsReadList: [],
              isUpdatingMetamaskNotifications: false,
              isFetchingMetamaskNotifications: false,
              isUpdatingMetamaskNotificationsAccount: [],
              isCheckingAccountsPresence: false,
            },
            MultichainNetworkController: {
              selectedMultichainNetworkChainId: SolScope.Mainnet,
              multichainNetworkConfigurationsByChainId: {},
              isEvmSelected: true,
              networksWithTransactionActivity: {},
            },
            MultichainAssetsController: {
              accountsAssets: {},
              assetsMetadata: {},
            },
            MultichainAssetsRatesController: {
              conversionRates: {},
            },
            CronJobController: {
              jobs: {},
              events: {},
            },
          },
        },
        privacy: {
          approvedHosts: {},
          revealSRPTimestamps: [],
        },
        bookmarks: [],
        browser: {
          history: [],
          whitelist: [],
          tabs: [
            {
              url: 'https://google.com',
              id: 1692550481062,
            },
          ],
          activeTab: 1692550481062,
        },
        modals: {
          networkModalVisible: false,
          shouldNetworkSwitchPopToWallet: true,
          collectibleContractModalVisible: false,
          receiveModalVisible: false,
          dappTransactionModalVisible: false,
          signMessageModalVisible: true,
        },
        settings: {
          searchEngine: 'Google',
          primaryCurrency: 'ETH',
          lockTime: 30000,
          useBlockieIcon: true,
          hideZeroBalanceTokens: false,
          basicFunctionalityEnabled: true,
        },
        alert: {
          isVisible: false,
          autodismiss: null,
          content: null,
          data: null,
        },
        transaction: {
          selectedAsset: {},
          transaction: {},
        },
        user: {
          loadingMsg: '',
          loadingSet: false,
          passwordSet: true,
          seedphraseBackedUp: true,
          backUpSeedphraseVisible: false,
          protectWalletModalVisible: false,
          gasEducationCarouselSeen: false,
          userLoggedIn: true,
          isAuthChecked: false,
          initialScreen: '',
          appTheme: 'os',
        },
        wizard: {
          step: 0,
        },
        onboarding: {
          events: [],
        },
        notification: {
          notifications: [],
        },
        swaps: {
          '0x1': {
            isLive: true,
          },
          isLive: true,
          hasOnboarded: false,
        },
        fiatOrders: {
          orders: [],
          customOrderIds: [],
          networks: [
            {
              active: true,
              chainId: 1,
              chainName: 'Ethereum Mainnet',
              shortName: 'Ethereum',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 10,
              chainName: 'Optimism Mainnet',
              shortName: 'Optimism',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 25,
              chainName: 'Cronos Mainnet',
              shortName: 'Cronos',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 56,
              chainName: 'BNB Chain Mainnet',
              shortName: 'BNB Chain',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 137,
              chainName: 'Polygon Mainnet',
              shortName: 'Polygon',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 250,
              chainName: 'Fantom Mainnet',
              shortName: 'Fantom',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 1284,
              chainName: 'Moonbeam Mainnet',
              shortName: 'Moonbeam',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 1285,
              chainName: 'Moonriver Mainnet',
              shortName: 'Moonriver',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 42161,
              chainName: 'Arbitrum Mainnet',
              shortName: 'Arbitrum',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 42220,
              chainName: 'Celo Mainnet',
              shortName: 'Celo',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 43114,
              chainName: 'Avalanche C-Chain Mainnet',
              shortName: 'Avalanche C-Chain',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 1313161554,
              chainName: 'Aurora Mainnet',
              shortName: 'Aurora',
              nativeTokenSupported: false,
            },
            {
              active: true,
              chainId: 1666600000,
              chainName: 'Harmony Mainnet (Shard 0)',
              shortName: 'Harmony  (Shard 0)',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 11297108109,
              chainName: 'Palm Mainnet',
              shortName: 'Palm',
              nativeTokenSupported: false,
            },
            {
              active: true,
              chainId: 1337,
              chainName: 'Localhost',
              shortName: 'Localhost',
              nativeTokenSupported: true,
            },
            {
              chainId: 1,
              chainName: 'Tenderly',
              shortName: 'Tenderly',
              nativeTokenSupported: true,
            },
          ],
          selectedRegionAgg: null,
          selectedPaymentMethodAgg: null,
          getStartedAgg: false,
          getStartedSell: false,
          authenticationUrls: [],
          activationKeys: [],
        },
        infuraAvailability: {
          isBlocked: false,
        },
        navigation: {
          currentRoute: 'AdvancedSettings',
          currentBottomNavRoute: 'Wallet',
        },
        networkOnboarded: {
          networkOnboardedState: {},
          networkState: {
            showNetworkOnboarding: false,
            nativeToken: '',
            networkType: '',
            networkUrl: '',
          },
          switchedNetwork: {
            networkUrl: '',
            networkStatus: false,
          },
        },
        security: {
          allowLoginWithRememberMe: false,
          automaticSecurityChecksEnabled: false,
          hasUserSelectedAutomaticSecurityCheckOption: true,
          isAutomaticSecurityChecksModalOpen: false,
        },
        experimentalSettings: {
          securityAlertsEnabled: true,
        },
        inpageProvider: {
          networkId: '1',
        },
      },
      asyncState: {
        '@MetaMask:existingUser': 'true',
        '@MetaMask:onboardingWizard': 'explored',
        '@MetaMask:UserTermsAcceptedv1.0': 'true',
        '@MetaMask:WhatsNewAppVersionSeen': '7.24.3',
        '@MetaMask:solanaFeatureModalShown': 'true',
      },
    };
    return this;
  }

  /**
   * Merges provided data into the background state of the PermissionController.
   * @param {object} data - Data to merge into the PermissionController's state.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withPermissionController(data) {
    merge(this.fixture.state.engine.backgroundState.PermissionController, data);
    return this;
  }

  /**
   * Merges provided data into the background state of the NetworkController.
   * @param {object} data - Data to merge into the NetworkController's state.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withNetworkController(data) {
    const networkController =
      this.fixture.state.engine.backgroundState.NetworkController;

    // Extract providerConfig data
    const { providerConfig } = data;

    // Generate a unique key for the new network client ID
    const newNetworkClientId = `networkClientId${
      Object.keys(networkController.networkConfigurationsByChainId).length + 1
    }`;

    // Define the network configuration
    const networkConfig = {
      chainId: providerConfig.chainId,
      rpcEndpoints: [
        {
          networkClientId: newNetworkClientId,
          url: providerConfig.rpcUrl,
          type: providerConfig.type,
          name: providerConfig.nickname,
        },
      ],
      defaultRpcEndpointIndex: 0,
      blockExplorerUrls: [],
      name: providerConfig.nickname,
      nativeCurrency: providerConfig.ticker,
    };

    // Add the new network configuration to the object
    networkController.networkConfigurationsByChainId[providerConfig.chainId] =
      networkConfig;

    // Update selectedNetworkClientId to the new network client ID
    networkController.selectedNetworkClientId = newNetworkClientId;
    return this;
  }

  /**
   * Private helper method to create permission controller configuration
   * @private
   * @param {Object} additionalPermissions - Additional permissions to merge with permission
   * @returns {Object} Permission controller configuration object
   */
  createPermissionControllerConfig(additionalPermissions = {}) {
    const caip25CaveatValue = additionalPermissions?.[
      Caip25EndowmentPermissionName
    ]?.caveats?.find((caveat) => caveat.type === Caip25CaveatType)?.value ?? {
      optionalScopes: {
        'eip155:1': { accounts: [] },
      },
      requiredScopes: {},
      sessionProperties: {},
      isMultichainOrigin: false,
    };

    const basePermissions = {
      [Caip25EndowmentPermissionName]: {
        id: 'ZaqPEWxyhNCJYACFw93jE',
        parentCapability: Caip25EndowmentPermissionName,
        invoker: DAPP_URL,
        caveats: [
          {
            type: Caip25CaveatType,
            value: setEthAccounts(caip25CaveatValue, [DEFAULT_FIXTURE_ACCOUNT]),
          },
        ],
        date: 1664388714636,
      },
    };

    return {
      subjects: {
        [DAPP_URL]: {
          origin: DAPP_URL,
          permissions: basePermissions,
        },
      },
    };
  }

  /**
   * Connects the PermissionController to a test dapp with specific accounts permissions and origins.
   * @param {Object} additionalPermissions - Additional permissions to merge.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withPermissionControllerConnectedToTestDapp(additionalPermissions = {}) {
    this.withPermissionController(
      this.createPermissionControllerConfig(additionalPermissions),
    );

    // Ensure Solana feature modal is suppressed
    return this.ensureSolanaModalSuppressed();
  }

  withRampsSelectedRegion(region = null) {
    const defaultRegion = {
      currencies: ['/currencies/fiat/xcd'],
      emoji: '🇱🇨',
      id: '/regions/lc',
      name: 'Saint Lucia',
      support: { buy: true, sell: true, recurringBuy: true },
      unsupported: false,
      recommended: false,
      detected: false,
    };

    // Use the provided region or fallback to the default
    this.fixture.state.fiatOrders.selectedRegionAgg = region ?? defaultRegion;
    return this;
  }
  withRampsSelectedPaymentMethod() {
    const paymentType = '/payments/debit-credit-card';

    // Use the provided region or fallback to the default
    this.fixture.state.fiatOrders.selectedPaymentMethodAgg = paymentType;
    return this;
  }

  /**
   * Adds chain switching permission for specific chains.
   * @param {string[]} chainIds - Array of chain IDs to permit (defaults to ['0x1']), other nexts like linea mainnet 0xe708
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withChainPermission(chainIds = ['0x1']) {
    const optionalScopes = chainIds
      .map((id) => ({
        [`eip155:${parseInt(id)}`]: { accounts: [] },
      }))
      .reduce((acc, obj) => ({ ...acc, ...obj }));

    const defaultCaip25CaveatValue = {
      optionalScopes,
      requiredScopes: {},
      sessionProperties: {},
      isMultichainOrigin: false,
    };

    const caip25CaveatValueWithChains = setPermittedEthChainIds(defaultCaip25CaveatValue, chainIds);
    const caip25CaveatValueWithDefaultAccount = setEthAccounts(caip25CaveatValueWithChains, [DEFAULT_FIXTURE_ACCOUNT]);
    const chainPermission = {
      [Caip25EndowmentPermissionName]: {
        id: 'Lde5rzDG2bUF6HbXl4xxT',
        parentCapability: Caip25EndowmentPermissionName,
        invoker: 'localhost',
        caveats: [
          {
            type: Caip25CaveatType,
            value: caip25CaveatValueWithDefaultAccount,
          },
        ],
        date: 1732715918637,
      },
    };

    this.withPermissionController(
      this.createPermissionControllerConfig(chainPermission),
    );
    return this;
  }

  /**
   * Set the fixture to an empty object for onboarding.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withOnboardingFixture() {
    this.fixture = {
      asyncState: {},
    };
    return this;
  }

  withGanacheNetwork(chainId = '0x539') {
    const fixtures = this.fixture.state.engine.backgroundState;

    // Generate a unique key for the new network client ID
    const newNetworkClientId = `networkClientId${
      Object.keys(fixtures.NetworkController.networkConfigurationsByChainId)
        .length + 1
    }`;

    // Define the Ganache network configuration
    const ganacheNetworkConfig = {
      chainId,
      rpcEndpoints: [
        {
          networkClientId: newNetworkClientId,
          url: `http://localhost:${getGanachePort()}`,
          type: 'custom',
          name: 'Localhost',
        },
      ],
      defaultRpcEndpointIndex: 0,
      defaultBlockExplorerUrlIndex: 0,
      blockExplorerUrls: ['https://test.io'],
      name: 'Localhost',
      nativeCurrency: 'ETH',
    };

    // Add the new Ganache network configuration
    fixtures.NetworkController.networkConfigurationsByChainId[chainId] =
      ganacheNetworkConfig;

    // Update selectedNetworkClientId to the new network client ID
    fixtures.NetworkController.selectedNetworkClientId = newNetworkClientId;

    // Ensure Solana feature modal is suppressed
    return this.ensureSolanaModalSuppressed();
  }

  withSepoliaNetwork() {
    const fixtures = this.fixture.state.engine.backgroundState;

    // Extract Sepolia network configuration from CustomNetworks
    const sepoliaConfig = CustomNetworks.Sepolia.providerConfig;

    // Generate a unique key for the new network client ID
    const newNetworkClientId = `networkClientId${
      Object.keys(fixtures.NetworkController.networkConfigurationsByChainId)
        .length + 1
    }`;

    // Define the Sepolia network configuration
    const sepoliaNetworkConfig = {
      chainId: sepoliaConfig.chainId,
      rpcEndpoints: [
        {
          networkClientId: newNetworkClientId,
          url: sepoliaConfig.rpcTarget,
          type: 'custom',
          name: sepoliaConfig.nickname,
        },
      ],
      defaultRpcEndpointIndex: 0,
      blockExplorerUrls: [],
      name: sepoliaConfig.nickname,
      nativeCurrency: sepoliaConfig.ticker,
    };

    // Add the new Sepolia network configuration
    fixtures.NetworkController.networkConfigurationsByChainId[
      sepoliaConfig.chainId
    ] = sepoliaNetworkConfig;

    // Update selectedNetworkClientId to the new network client ID
    fixtures.NetworkController.selectedNetworkClientId = newNetworkClientId;

    // Ensure Solana feature modal is suppressed
    return this.ensureSolanaModalSuppressed();
  }

  withPopularNetworks() {
    const fixtures = this.fixture.state.engine.backgroundState;
    const networkConfigurationsByChainId = {
      ...fixtures.NetworkController.networkConfigurationsByChainId,
    }; // Object to store network configurations

    // Loop through each network in PopularNetworksList
    for (const key in PopularNetworksList) {
      const network = PopularNetworksList[key];
      const {
        rpcUrl: rpcTarget,
        chainId,
        ticker,
        nickname,
      } = network.providerConfig;

      // Generate a unique key for the new network client ID
      const newNetworkClientId = `networkClientId${
        Object.keys(networkConfigurationsByChainId).length + 1
      }`;

      // Define the network configuration
      const networkConfig = {
        chainId,
        rpcEndpoints: [
          {
            networkClientId: newNetworkClientId,
            url: rpcTarget,
            type: 'custom',
            name: nickname,
          },
        ],
        defaultRpcEndpointIndex: 0,
        blockExplorerUrls: [],
        name: nickname,
        nativeCurrency: ticker,
      };

      // Add the new network configuration to the object
      networkConfigurationsByChainId[chainId] = networkConfig;
    }

    // Assign networkConfigurationsByChainId object to NetworkController in fixtures
    fixtures.NetworkController = {
      ...fixtures.NetworkController,
      networkConfigurationsByChainId,
    };

    // Ensure Solana feature modal is suppressed
    return this.ensureSolanaModalSuppressed();
  }

  withPreferencesController(data) {
    merge(
      this.fixture.state.engine.backgroundState.PreferencesController,
      data,
    );
    return this;
  }

  withKeyringController() {
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      keyrings: [
        {
          accounts: [DEFAULT_FIXTURE_ACCOUNT],
          type: 'HD Key Tree',
        },
        { type: 'QR Hardware Wallet Device', accounts: [] },
      ],
      vault:
        '{"cipher":"T+MXWPPwXOh8RLxpryUuoFCObwXqNQdwak7FafAoVeXOehhpuuUDbjWiHkeVs9slsy/uzG8z+4Va+qyz4dlRnd/Gvc/2RbHTAb/LG1ECk1rvLZW23JPGkBBVAu36FNGCTtT+xrF4gRzXPfIBVAAgg40YuLJWkcfVty6vGcHr3R3/9gpsqs3etrF5tF4tHYWPEhzhhx6HN6Tr4ts3G9sqgyEhyxTLCboAYWp4lsq2iTEl1vQ6T/UyBRNhfDj8RyQMF6hwkJ0TIq2V+aAYkr5NJguBBSi0YKPFI/SGLrin9/+d66gcOSFhIH0GhUbez3Yf54852mMtvOH8Vj7JZc664ukOvEdJIpvCw1CbtA9TItyVApkjQypLtE+IdV3sT5sy+v0mK7Xc054p6+YGiV8kTiTG5CdlI4HkKvCOlP9axwXP0aRwc4ffsvp5fKbnAVMf9+otqmOmlA5nCKdx4FOefTkr/jjhMlTGV8qUAJ2c6Soi5X02fMcrhAfdUtFxtUqHovOh3KzOe25XhjxZ6KCuix8OZZiGtbNDu3xJezPc3vzkTFwF75ubYozLDvw8HzwI+D5Ifn0S3q4/hiequ6NGiR3Dd0BIhWODSvFzbaD7BKdbgXhbJ9+3FXFF9Xkp74msFp6o7nLsx02ywv/pmUNqQhwtVBfoYhcFwqZZQlOPKcH8otguhSvZ7dPgt7VtUuf8gR23eAV4ffVsYK0Hll+5n0nZztpLX4jyFZiV/kSaBp+D2NZM2dnQbsWULKOkjo/1EpNBIjlzjXRBg5Ui3GgT3JXUDx/2GmJXceacrbMcos3HC2yfxwUTXC+yda4IrBx/81eYb7sIjEVNxDuoBxNdRLKoxwmAJztxoQLF3gRexS45QKoFZZ0kuQ9MqLyY6HDK","iv":"3271713c2b35a7c246a2a9b263365c3d","keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","salt":"l4e+sn/jdsaofDWIB/cuGQ=="}',
    });
    return this;
  }

  withImportedAccountKeyringController() {
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      keyrings: [
        {
          type: 'HD Key Tree',
          accounts: [DEFAULT_FIXTURE_ACCOUNT],
        },
        {
          type: 'Simple Key Pair',
          accounts: ['0xDDFFa077069E1d4d478c5967809f31294E24E674'],
        },
      ],
      vault:
        '{"cipher":"vxFqPMlClX2xjUidoCTiwazr43W59dKIBp6ihT2lX66q8qPTeBRwv7xgBaGDIwDfk4DpJ3r5FBety1kFpS9ni3HtcoNQsDN60Pa80L94gta0Fp4b1jVeP8EJ7Ho71mJ360aDFyIgxPBSCcHWs+l27L3WqF2VpEuaQonK1UTF7c3WQ4pyio4jMAH9x2WQtB11uzyOYiXWmiD3FMmWizqYZY4tHuRlzJZTWrgE7njJLaGMlMmw86+ZVkMf55jryaDtrBVAoqVzPsK0bvo1cSsonxpTa6B15A5N2ANyEjDAP1YVl17roouuVGVWZk0FgDpP82i0YqkSI9tMtOTwthi7/+muDPl7Oc7ppj9LU91JYH6uHGomU/pYj9ufrjWBfnEH/+ZDvPoXl00H1SmX8FWs9NvOg7DZDB6ULs4vAi2/5KGs7b+Td2PLmDf75NKqt03YS2XeRGbajZQ/jjmRt4AhnWgnwRzsSavzyjySWTWiAgn9Vp/kWpd70IgXWdCOakVf2TtKQ6cFQcAf4JzP+vqC0EzgkfbOPRetrovD8FHEFXQ+crNUJ7s41qRw2sketk7FtYUDCz/Junpy5YnYgkfcOTRBHAoOy6BfDFSncuY+08E6eiRHzXsXtbmVXenor15pfbEp/wtfV9/vZVN7ngMpkho3eGQjiTJbwIeA9apIZ+BtC5b7TXWLtGuxSZPhomVkKvNx/GNntjD7ieLHvzCWYmDt6BA9hdfOt1T3UKTN4yLWG0v+IsnngRnhB6G3BGjJHUvdR6Zp5SzZraRse8B3z5ixgVl2hBxOS8+Uvr6LlfImaUcZLMMzkRdKeowS/htAACLowVJe3pU544IJ2CGTsnjwk9y3b5bUJKO3jXukWjDYtrLNKfdNuQjg+kqvIHaCQW40t+vfXGhC5IDBWC5kuev4DJAIFEcvJfJgRrm8ua6LrzEfH0GuhjLwYb+pnQ/eg8dmcXwzzggJF7xK56kxgnA4qLtOqKV4NgjVR0QsCqOBKb3l5LQMlSktdfgp9hlW","iv":"b09c32a79ed33844285c0f1b1b4d1feb","keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","salt":"GYNFQCSCigu8wNp8cS8C3w=="}',
    });
    return this;
  }

  withImportedHdKeyringController() {
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      keyrings: [
        {
          type: 'HD Key Tree',
          accounts: [DEFAULT_FIXTURE_ACCOUNT],
          metadata: {
            id: '01JN61V4CZ5WSJXSS7END4FJQ9',
            name: '',
          },
        },
        {
          type: 'HD Key Tree',
          accounts: [DEFAULT_IMPORTED_FIXTURE_ACCOUNT],
          metadata: {
            id: '01JN61V9ACE7ZA3ZRZFPYFYCJ1',
            name: '',
          },
        },
      ],
      // TODO: update this
      vault:
        '{"cipher":"IpV+3goe8Vey0mmfHz6DT0NiLwcTbjeglBI+WckZ/HeW0JcyE6kK9rBaqiZ+I0adwWAysIf/OanwvpE5YkYw9xYEkVXDUBQ/0lmscFGatXl24hadMdD01MRkKH6qyjUUw6ZqqmFnIRFbSwwYtD1X8UaRDhX+k/vnzAD9ETFW2cUpji7n5VU5hJQYOaCDO6hUxzE55scp2k68bDm/26EJ5SVgcsDXP/BW/MKnsqGGLAIPtQbVYUVChQ9D150WJif3HLJS1p0SSdGluL85JBLEQqShbBRZ3SiAHtJilf3oQBJB/YcAM6j6Uo7Sf+gAhc7cOvMYQ+YrTc+0Solzfa2OkLemskd4IOIVj6vWY+w0TPLo1IYSR1mFE2JVXE064zhUO0PKXME1qENQTiQCAAIfeEBwfdbQfrv92Zo/nU4VFyzdC3Rf+WPmWjLMXkZYqb1PdwhcgY85EpdFcjZAtcye6VF2iBTO0nMmZIyUabI/3RFizUgKtTlNH/H4NOLTm2HwUHOwAe4pxBbtEIFyuqo050n7UAJftN14Lp+/0kmraguFvsf0sg+AWXK5Tk9Bmkqm74bCuvmDCw2l28/+VEXOiYvytr9105NstlOnG/MmIJoYx8NkIJr5jMSCRtX8byBGRT+lhNq70CjWZIub5USmHkRdx1AuBAipQCdTjisaS2QRPwcA7M4PFbE2ltil1TavcRGRo+xa5nKji04jsx9AotAKkCqUPTOFr/h+WazGtx5+LWTAGXPUe9YtUraBCABXdnNhq7t7dXR7ivaZLkl6oXhQN6u2wmGRRvg3D36gddFVgDcqNafk/y82e0uWAu3F9VrGynYd0t7txkmzup1J19kpBlv7YVWy17J2MT3/PkatNrqdo21qFlhnYAcYKBC52MMInaY8qwQWXLMPud+cDdSR7QDLefl2AQEvH+hyzh2DI6d3Wri17LjujvSRdcwjAitylxnz9k4H2IAgJLlXIh5W69C+JdsNzoHanuJd+Hk=","iv":"68e751a7883bd7119118ebd2b3d30a6f","keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","salt":"pOiYCrlywkH4UDFq/IHIKg=="}',
    });
    return this;
  }

  withImportedHdKeyringAndTwoDefaultAccountsOneImportedHdAccountKeyringController() {
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      keyrings: [
        {
          type: 'HD Key Tree',
          accounts: [DEFAULT_FIXTURE_ACCOUNT, DEFAULT_FIXTURE_ACCOUNT_2],
          metadata: {
            id: '01JN61V4CZ5WSJXSS7END4FJQ9',
            name: '',
          },
        },
        {
          type: 'HD Key Tree',
          accounts: [DEFAULT_IMPORTED_FIXTURE_ACCOUNT],
          metadata: {
            id: '01JN61V9ACE7ZA3ZRZFPYFYCJ1',
            name: '',
          },
        },
      ],
      // TODO: update this
      vault:
        '{"cipher":"wWIegxm+og31XAr34sZAkaf+wsuIycthFqmLa2mA0zxD0HSJKp1uITa4dJ94uGN10RgaDHHRmqpLzMqx7l7W+LiG6KMkdaPiZUqDLq3zdQVecY+rwWt+G4DZbIrZC6jUMopKTdvSv0Lrzb3fRnsQ1sDJ4R99OY8Dvhloc4V+rgi43rLc4eT7DB7zLlK0GuUtxfZwStJVeq5lBlYsVNrsZF2kfBCZQxqZGxLlSk6qaIP8HNY/ptttB/ZdOBjYYPqZkr5J5oUhmiIQDqN+MqsjUrOEmfz9fP3HIi8IxCFGA94G1tvDClMHMqpzwYsBQpcA0k7NJiSc+UdB8dcilXQLXF33PvQKSbgVeXuNkgKgnWPGtsGxPTJ0gIxCBxsW0MmyYvyBsHO8BoocflrOaqkXvSwmXUja9aQwHdZAmayvxWXnIE4MRAD1nLnvXdMO+qY+nW3yCvw5R6DoNBtnQIk9cKCuj2UL0/fxhNDdfbK8rhTyPZMRqRH2dhhuji71V+OeQBPV1/R0srvSUggOfSmcxVNe+ok5SJdzJpCavXE4/JVwTPe1Jrr/uz4AC4R2ih7lDBPFZnNXy7uSRn0lZWbKZFoM6jkLO7oTn9UN1C+YcteyNqkDiYGNJ0zxjuMzU/r6aJGAlvKGCkvBph3ON9vfD2ARAwpSSIFckh4a6t37vmKzmpsW7tQE95uqJHe7h+KMraWxtqlCCWB6BsJkpbm0BqjBdg8zUH8pP0GA0un3KCJjUEfTOWw+Yn69IkJQzX1Jyr5Hepzt500Va7K7kDDlFG4KFUt5RO80GnT7jtRGPGjPx29pKK2Zp61dmP5BZu+0xnXMlSGozJv+dgRCsZuzqvzUu5/44jYpggHrApNk5hhw0crBeovV+EgHE2VVnGNdLwwSngJ00b/cUnCUsPW0FjR7IscaI96eslFAPkdZXr70zXPVzA/NiE05ADciMoZxD8Qv8dGGU+yQMnDo2wABv+YEroO3VOtJiKBPqIB0GC0=","iv":"1ccda0516bc876f905e08e76bad201b9","keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","salt":"E9val7NN4h2AfX/pwUkd9aa2iNyn+LwIurZXIdxlG/o="}',
    });
    return this;
  }

  withTokens(tokens) {
    merge(this.fixture.state.engine.backgroundState.TokensController, {
      allTokens: {
        [CHAIN_IDS.MAINNET]: {
          [DEFAULT_FIXTURE_ACCOUNT]: tokens,
        },
      },
    });
    return this;
  }

  withIncomingTransactionPreferences(incomingTransactionPreferences) {
    merge(this.fixture.state.engine.backgroundState.PreferencesController, {
      showIncomingTransactions: incomingTransactionPreferences,
    });
    return this;
  }

  withTransactions(transactions) {
    merge(this.fixture.state.engine.backgroundState.TransactionController, {
      transactions,
    });
    return this;
  }

  /**
   * Sets the MetaMetrics opt-in state to 'agreed' in the fixture's asyncState.
   * This indicates that the user has agreed to MetaMetrics data collection.
   *
   * @returns {this} The current instance for method chaining.
   */
  withMetaMetricsOptIn() {
    if (!this.fixture.asyncState) {
      this.fixture.asyncState = {};
    }
    this.fixture.asyncState['@MetaMask:metricsOptIn'] = 'agreed';
    return this;
  }

/**
   * Sets up a minimal Solana fixture with mainnet configuration
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining
   */
  withSolanaFixture() {
    const SOLANA_TOKEN = 'token:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

    this.fixture.state.engine.backgroundState.MultichainNetworkController = {
      selectedMultichainNetworkChainId: SolScope.Mainnet,
      multichainNetworkConfigurationsByChainId: {
        [SolScope.Mainnet]: {
          chainId: SolScope.Mainnet,
          name: 'Solana Mainnet',
          nativeCurrency: `${SolScope.Mainnet}/${SOLANA_TOKEN}`,
          isEvm: false
        }
      },
      isEvmSelected: false
    };

    return this;
  }

  /**
   * Build and return the fixture object.
   * @returns {Object} - The built fixture object.
   */
  build() {
    return this.fixture;
  }
}

export default FixtureBuilder;