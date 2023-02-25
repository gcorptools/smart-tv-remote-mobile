import React from 'react';
import {useRemoteControlState} from '@gcorptools/smart-tv-remote-common';
import {useMemo} from 'react';
import {ROUTES} from '../../constants';
import RemoteControlRow from './remote-control-row';
import {Button, Text} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';

const BackButton = ({navigation}: any) => {
  const onBack = () => {
    navigation.navigate(ROUTES.StoredDevices);
  };

  return (
    <Button
      mode="contained"
      onPress={() => onBack()}
      icon="arrow-left"
      style={styles.button}>
      Back to devices
    </Button>
  );
};

const RemoteControlScreen = ({navigation}: any) => {
  const {type, remoteControl, actionsMap} = useRemoteControlState();

  const {rows, columns} = useMemo(() => {
    let row = 0;
    const maxColumns = Object.keys(actionsMap)
      .map((key: string) => +key)
      .sort((a: number, b: number) => a - b)
      .reduce((result: number[], key: number) => {
        row = +key;
        const columnKeys = Object.keys(actionsMap[row]).map((c: string) => +c);
        const columnsMax = Math.max(...columnKeys); // Number of columns
        result.push(columnsMax);
        return result;
      }, []);
    const rowsNumber = Array.from(Array(row + 1));
    const columnsNumber = Math.max(...maxColumns) + 1;
    return {rows: rowsNumber, columns: columnsNumber};
  }, [actionsMap]);

  if (!remoteControl || !type) {
    return <BackButton navigation={navigation} />;
  }

  return (
    <View>
      <ScrollView>
        <Text style={styles.title} variant="headlineMedium">
          {type.toUpperCase()}
        </Text>
        <BackButton navigation={navigation} />
        {rows.map((_: any, index: number) => (
          <RemoteControlRow
            key={`row-${index}`}
            index={index}
            columns={columns}
            value={actionsMap[index] || {}}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
  },
});

export default RemoteControlScreen;
