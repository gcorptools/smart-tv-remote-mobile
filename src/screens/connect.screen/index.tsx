import React, {useState} from 'react';
import {ROUTES} from '../../constants';
import ConnectParamsForm from './connect-params-form';
import ConnectPairingForm from './connect-pairing-form';
import {Button, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {
  BaseRemoteControl,
  RemoteType,
} from '@gcorptools/smart-tv-remote-common';
import {RemoteDevice} from '../../types';
import {useRegisteredRemotesApi} from '../../contexts';

const RedirectButton = ({navigation}: any) => {
  const onRedirect = () => {
    navigation.navigate(ROUTES.StoredDevices);
  };

  return (
    <Button
      mode="contained"
      onPress={() => onRedirect()}
      icon="devices"
      style={styles.button}>
      See stored devices
    </Button>
  );
};

const ConnectScreen = ({navigation}: any) => {
  const [currentStep, setCurrentStep] = useState(0);
  const {addRemote} = useRegisteredRemotesApi();
  const [remote, setRemote] = useState<RemoteDevice | null>(null);

  const onParamsSuccess = (type: RemoteType, baseRemote: BaseRemoteControl) => {
    const {clientId, clientName, url, port, debug} = baseRemote;
    setRemote({clientId, clientName, url, port, debug, type, authKey: ''});
    setCurrentStep(1);
  };

  const onAuthSuccess = (authKey: string) => {
    if (!remote) {
      return;
    }
    addRemote(remote.url, {...remote, authKey});
    navigation.navigate(ROUTES.RemoteControl);
  };

  const steps = [
    {
      title: 'TV Parameters',
      description: <Text>Enter your TV settings</Text>,
      content: <ConnectParamsForm onSuccess={onParamsSuccess} />,
    },
    {
      title: 'Pairing',
      description: <Text>Enter the authentication key</Text>,
      content: (
        <ConnectPairingForm
          onBack={() => setCurrentStep(0)}
          onSuccess={onAuthSuccess}
        />
      ),
    },
  ];

  return (
    <View>
      <RedirectButton navigation={navigation} />
      {steps[currentStep].content}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
  },
});

export default ConnectScreen;
