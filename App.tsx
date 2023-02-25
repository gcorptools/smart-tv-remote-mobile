/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useMemo} from 'react';
import {StatusBar, Text, useColorScheme} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {
  SonyRemoteControl,
  RemoteControlProvider,
  RemoteControlUtils,
  RemoteType,
} from '@gcorptools/smart-tv-remote-common';
import {RegisteredRemotesProvider} from './src/contexts';
import Navigation from './src/components/navigation';

const App = (): JSX.Element => {
  const colorScheme = useColorScheme();
  const remoteControlUtils = useMemo(() => {
    const instance = RemoteControlUtils.getInstance();
    instance.setTypeMap({
      [RemoteType.Sony]: SonyRemoteControl,
      [RemoteType.Samsung]: SonyRemoteControl,
    });
    return instance;
  }, []);

  const onSuccess = useCallback(
    (result: any) => console.log('Success', result),
    [],
  );
  const onError = useCallback((err: any) => console.error('Error', err), []);

  if (!remoteControlUtils) {
    return <Text>Loading...</Text>;
  }

  return (
    <PaperProvider>
      <RegisteredRemotesProvider>
        <RemoteControlProvider
          utils={remoteControlUtils}
          onSuccess={onSuccess}
          onError={onError}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </RemoteControlProvider>
      </RegisteredRemotesProvider>
    </PaperProvider>
  );
};

export default App;
