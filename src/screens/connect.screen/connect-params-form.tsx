import {
  useRemoteControlApi,
  SONY_ACTIONS,
  RemoteType,
} from '@gcorptools/smart-tv-remote-common';
import {View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {
  Button,
  Checkbox,
  List,
  SegmentedButtons,
  Text,
  TextInput,
} from 'react-native-paper';
import {getDeviceId, getDeviceName} from 'react-native-device-info';

const ConnectParamsForm = ({onSuccess}: any) => {
  const {newRemote} = useRemoteControlApi();
  const [values, setValues] = useState<any>({});

  const options = useMemo(
    () =>
      Object.keys(RemoteType)
        .sort()
        .map((label: string) => ({
          value: (RemoteType as any)[label],
          label,
        })),
    [],
  );

  const valid = useMemo(() => {
    const url = !!values.url && `${values.url}`.trim().length > 1;
    const port =
      !!values.port && `${values.port}`.trim().length > 1 && +values.port > 0;
    const type = !!values.type;
    return url && port && type;
  }, [values.url, values.port, values.type]);

  const onReset = () => {
    setValues({
      type: '',
      url: '',
      clientId: '',
      clientName: '',
      port: '',
      debug: false,
    });
  };

  const onSubmit = async () => {
    const {type, ...params} = values;
    const clientId = await getDeviceId();
    const clientName = await getDeviceName();
    const remoteControl = newRemote(
      type,
      {...params, clientId, clientName},
      Object.values({...SONY_ACTIONS}),
    );
    await remoteControl
      .requestPairingKey()
      .then(() => onSuccess(type, remoteControl))
      .catch((err: any) => console.error('There is an error', err));
  };

  return (
    <View>
      <List.Section>
        <List.Subheader>Enter your Smart TV parameters title</List.Subheader>
        <SegmentedButtons
          value={values.type}
          onValueChange={(v: any) => setValues({...values, type: v})}
          buttons={options}
        />
        <TextInput
          label="Url"
          onChangeText={(v: any) => {
            setValues({...values, url: v});
          }}
          keyboardType="url"
          returnKeyType="next"
          placeholder="ie: http://192.168.1.1"
        />
        <TextInput
          label="Port"
          keyboardType="numeric"
          onChangeText={(v: any) => {
            setValues({...values, port: v});
          }}
          returnKeyType="next"
          placeholder="ie: 80"
        />
        <Checkbox.Item
          label="Debug mode"
          status={values.debug ? 'checked' : 'unchecked'}
          onPress={() => {
            setValues({...values, debug: !values.debug});
          }}
        />
      </List.Section>

      <>
        <Button onPress={() => onReset()}>
          <Text>Reset</Text>
        </Button>
        <Button mode="contained" onPress={() => onSubmit()} disabled={!valid}>
          <Text>Save</Text>
        </Button>
      </>
    </View>
  );
};

export default ConnectParamsForm;
