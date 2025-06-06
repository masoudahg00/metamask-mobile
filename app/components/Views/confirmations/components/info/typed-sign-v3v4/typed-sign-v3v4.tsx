import React from 'react';
import AccountNetworkInfoRow from '../../rows/account-network-info-row';
import { InfoSectionOriginAndDetails } from './info-section-origin-and-details';
import Message from './message';
import TypedSignV3V4Simulation from './simulation';

const TypedSignV3V4 = () => (
    <>
      <AccountNetworkInfoRow />
      <TypedSignV3V4Simulation />
      <InfoSectionOriginAndDetails />
      <Message />
    </>
  );

export default TypedSignV3V4;
