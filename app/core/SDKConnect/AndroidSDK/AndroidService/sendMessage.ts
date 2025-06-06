/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountsController } from '@metamask/accounts-controller';
import Logger from '../../../../util/Logger';
import Engine from '../../../Engine';
import { METHODS_TO_DELAY, RPC_METHODS } from '../../SDKConnectConstants';
import handleBatchRpcResponse from '../../handlers/handleBatchRpcResponse';
import DevLogger from '../../utils/DevLogger';
import { wait } from '../../utils/wait.util';
import AndroidService from '../AndroidService';
import {
  areAddressesEqual,
  toFormattedAddress,
} from '../../../../util/address';

async function sendMessage(
  instance: AndroidService,
  message: any,
  forceRedirect?: boolean,
) {
  const id = message?.data?.id;
  let rpcMethod = instance.rpcQueueManager.getId(id);

  const isConnectionResponse = rpcMethod === RPC_METHODS.ETH_REQUESTACCOUNTS;

  if (isConnectionResponse) {
    const accountsController = (
      Engine.context as {
        AccountsController: AccountsController;
      }
    ).AccountsController;

    const selectedFormattedAddress = toFormattedAddress(
      accountsController.getSelectedAccount().address,
    );

    const formattedAccounts = (message.data.result as string[]).map(
      (a: string) => toFormattedAddress(a),
    );

    const isPartOfConnectedAddresses = formattedAccounts.includes(
      selectedFormattedAddress,
    );

    if (isPartOfConnectedAddresses) {
      // Remove the selectedAddress from the formattedAccounts if it exists
      const remainingAccounts = formattedAccounts.filter(
        (account) => !areAddressesEqual(account, selectedFormattedAddress),
      );

      // Create the reorderedAccounts array with selectedAddress as the first element
      const reorderedAccounts: string[] = [
        selectedFormattedAddress,
        ...remainingAccounts,
      ];

      message = {
        ...message,
        data: {
          ...message.data,
          result: reorderedAccounts,
        },
      };
    }
  }

  instance.communicationClient.sendMessage(JSON.stringify(message));

  DevLogger.log(`AndroidService::sendMessage method=${rpcMethod}`, message);

  // handle multichain rpc call responses separately
  const chainRPCs = instance.batchRPCManager.getById(id);
  if (chainRPCs) {
    const isLastRpcOrError = await handleBatchRpcResponse({
      chainRpcs: chainRPCs,
      msg: message,
      backgroundBridge:
        instance.bridgeByClientId[instance.currentClientId ?? ''],
      batchRPCManager: instance.batchRPCManager,
      sendMessage: ({ msg }) => instance.sendMessage(msg),
    });
    DevLogger.log(
      `AndroidService::sendMessage isLastRpc=${isLastRpcOrError}`,
      chainRPCs,
    );

    if (!isLastRpcOrError) {
      DevLogger.log(
        `AndroidService::sendMessage NOT last rpc --- skip goBack()`,
        chainRPCs,
      );
      instance.rpcQueueManager.remove(id);
      // Only continue processing the message and goback if all rpcs in the batch have been handled
      return;
    }

    // Always set the method to metamask_batch otherwise it may not have been set correctly because of the batch rpc flow.
    rpcMethod = RPC_METHODS.METAMASK_BATCH;
    DevLogger.log(
      `AndroidService::sendMessage chainRPCs=${chainRPCs} COMPLETED!`,
    );
  }

  instance.rpcQueueManager.remove(id);

  if (!rpcMethod && forceRedirect !== true) {
    DevLogger.log(
      `AndroidService::sendMessage no rpc method --- rpcMethod=${rpcMethod} forceRedirect=${forceRedirect} --- skip goBack()`,
    );
    return;
  }

  try {
    if (METHODS_TO_DELAY[rpcMethod]) {
      // Add delay to see the feedback modal
      await wait(1000);
    }

    if (!instance.rpcQueueManager.isEmpty()) {
      DevLogger.log(
        `AndroidService::sendMessage NOT empty --- skip goBack()`,
        instance.rpcQueueManager.get(),
      );
      return;
    }

    DevLogger.log(`AndroidService::sendMessage empty --- goBack()`);
  } catch (error) {
    Logger.log(error, `AndroidService:: error waiting for empty rpc queue`);
  }
}

export default sendMessage;
