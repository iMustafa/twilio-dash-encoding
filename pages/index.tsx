import React from 'react';
import {NextPage} from 'next';
import {connect, useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {StoreState} from '../redux/reducers';
import {TwilioActionTypes} from '../redux/types/twilio.types';
import {GetTwilioToken} from '../providers/twilio/twilio.providers';
import LoginForm from '../components/molecules/login-form';

const Videos = dynamic(() => import('../components/molecules/videos'), {
  ssr: false,
});

interface MainState {
  token: string;
}

const HomePage: NextPage<MainState> = ({token}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const $token = useSelector((state: StoreState) => state.twilio.token);

  React.useEffect(() => {
    const {identity, room} = router.query;
    if (identity && room)
      dispatch({
        type: TwilioActionTypes.SET_IDENTITY,
        payload: {identity, room},
      });

    if (token)
      dispatch({type: TwilioActionTypes.SET_TWILIO_TOKEN, payload: token});
  }, []);

  return (
    <React.Fragment>
      <LoginForm />
      <Videos />
    </React.Fragment>
  );
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

export default connect(null, {})(HomePage);
