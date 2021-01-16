import React from 'react';
import {NextPage} from 'next';
import {GetTwilioToken, AccessToken} from '../providers/twilio/twilio.providers';

const HomePage: NextPage<{token: AccessToken}> = ({token}) => {
  return <pre>{JSON.stringify(token)}</pre>;
};

HomePage.getInitialProps = async ({query}) => {
  try {
    const {identity, room} = query;
    if (!identity || !room) return {};

    const token = await GetTwilioToken({identity, room});
    return {token};
  } catch (e) {
    return e;
  }
};

export default HomePage;
