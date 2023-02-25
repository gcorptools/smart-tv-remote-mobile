import {useRemoteControlApi} from '@gcorptools/smart-tv-remote-common';
import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, List, Text, TextInput} from 'react-native-paper';
import base64 from 'react-native-base64';

const ConnectPairingForm = ({onSuccess, onBack}: any) => {
  const {sendAuthKey} = useRemoteControlApi();
  const [values, setValues] = useState<any>({});

  const onSubmit = async () => {
    const {authKey} = values;
    const encoded = base64.encode(`:${authKey}`);
    await sendAuthKey(encoded)
      .then(() => onSuccess(authKey))
      .catch((err: any) =>
        console.error('An error occurred during pairing', err),
      );
  };

  return (
    <View>
      <List.Section>
        <List.Subheader>
          Check the pairing code displayed on your Smart TV
        </List.Subheader>

        <TextInput
          label="Pairing code"
          defaultValue={values.authKey}
          onChangeText={(v: any) => {
            setValues({...values, authKey: v});
          }}
          keyboardType="numeric"
          placeholder="ie: 1234"
        />
      </List.Section>

      <>
        <Button onPress={() => onBack()}>
          <Text>Back</Text>
        </Button>
        <Button mode="contained" onPress={() => onSubmit()}>
          <Text>Save</Text>
        </Button>
      </>
    </View>
  );
};

export default ConnectPairingForm;
