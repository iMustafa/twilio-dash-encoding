import React from 'react';
import {connect, useSelector, useDispatch} from 'react-redux';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import {GetTwilioToken} from '../../providers/twilio/twilio.providers';
import {TwilioActionTypes} from '../../redux/types/twilio.types';
import {StoreState} from '../../redux/reducers';

interface LoginFormState {
  identity: string;
  room: string;
}

const LoginForm = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: StoreState) => state.twilio.token);
  const [state, setState] = React.useState<LoginFormState>({
    identity: "",
    room: "",
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const {identity, room} = state;
      if (identity && room) {
        const token = await GetTwilioToken({identity, room});
        dispatch({type: TwilioActionTypes.SET_TWILIO_TOKEN, payload: token});
      }
    } catch (e) {
      console.log(e);
    }
  };

  return token ? (
    <React.Fragment />
  ) : (
    <React.Fragment>
      <Input id="identity" placeholder="Identity" onChange={handleChange} name="identity" value={state.identity} />
      <Input id="room" placeholder="room" onChange={handleChange} name="room" value={state.room} />
      <Button id="connect" onClick={handleLogin}>CONNECT</Button>
    </React.Fragment>
  );
};

export default connect(null, {})(LoginForm);
