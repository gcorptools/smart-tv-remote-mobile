import {useRemoteControl} from '@gcorptools/smart-tv-remote-common';
import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Button, DataTable, IconButton, MD3Colors} from 'react-native-paper';
import {ROUTES} from '../../constants';
import {useRegisteredRemotes} from '../../contexts';
import {RemoteDevice} from '../../types';

const RedirectButton = ({navigation}: any) => {
  const onRedirect = () => {
    navigation.navigate(ROUTES.Connect);
  };

  return (
    <Button
      mode="contained"
      onPress={() => onRedirect()}
      icon="devices"
      style={styles.button}>
      Add device
    </Button>
  );
};

const StoredDevicesScreen = ({navigation}: any) => {
  const {remotes: remotesDict, api: registeredApi} = useRegisteredRemotes();
  const {remoteControl, api} = useRemoteControl();
  const [selected, setSelected] = useState(false);

  const remotes = useMemo(
    () => Object.values(remotesDict || {}),
    [remotesDict],
  );

  const onRemove = (remote: RemoteDevice) => {
    registeredApi.removeRemote(remote.url);
  };

  const onSelect = async (remote: RemoteDevice) => {
    const {type, clientId, clientName, url, port, debug} = remote;
    api.newRemote(type, {clientId, clientName, url, port, debug});
    setSelected(true);
  };

  useEffect(() => {
    if (!remoteControl || !selected) {
      return;
    }
    navigation.navigate(ROUTES.RemoteControl);
  }, [navigation, remoteControl, selected]);

  return (
    <ScrollView>
      <RedirectButton navigation={navigation} />
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Domain</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        {remotes.map((remote: RemoteDevice) => (
          <DataTable.Row key={`remote-${remote.url}`}>
            <DataTable.Cell>{remote.url}</DataTable.Cell>
            <DataTable.Cell style={styles.actions}>
              <IconButton
                icon="login"
                size={40}
                onPress={() => onSelect(remote)}
              />
              <IconButton
                iconColor={MD3Colors.error50}
                icon="delete-forever"
                size={40}
                onPress={() => onRemove(remote)}
              />
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
  },
  actions: {
    marginBottom: 0,
    textAlign: 'right',
    marginLeft: 'auto',
    marginRight: 0,
  },
});

export default StoredDevicesScreen;
