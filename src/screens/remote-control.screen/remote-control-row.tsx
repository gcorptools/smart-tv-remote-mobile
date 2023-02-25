import React, {useCallback, useState} from 'react';
import {
  RemoteControlAction,
  useRemoteControlState,
} from '@gcorptools/smart-tv-remote-common';
import {useMemo} from 'react';
import {SegmentedButtons} from 'react-native-paper';
import {StyleSheet} from 'react-native';

const ACTION_ICONS: Record<string, string> = {
  AudioQualityMode: 'audio-input-rca',
  Mute: 'volume-mute',
  Wide: 'arrow-expand',
  PictureMode: 'image-area',
  PicOff: 'image-off',
  iManual: 'information-variant',
  GGuide: 'television-guide',
  Next: 'fast-forward',
  Prev: 'rewind',
  Forward: 'skip-forward',
  Rewind: 'skip-backward',
  Play: 'play',
  Pause: 'pause',
  Stop: 'stop',
  Down: 'arrow-down',
  Up: 'arrow-up',
  Home: 'home-circle',
  Left: 'arrow-left',
  Right: 'arrow-right',
  PowerOff: 'power',
  VolumeDown: 'minus',
  VolumeUp: 'plus',
  ChannelDown: 'chevron-down',
  ChannelUp: 'chevron-up',
};

const ACTION_STYLES: Record<string, any> = {
  Red: {
    backgroundColor: '#f00',
  },
  Green: {
    backgroundColor: '#0F0',
  },
  Yellow: {
    backgroundColor: '#FFFF00',
  },
  Blue: {
    backgroundColor: '#00F',
  },
};

const RemoteControlRow = ({
  index,
  columns,
  value,
}: {
  index: number;
  columns: number;
  value: Record<number, RemoteControlAction[]>;
}) => {
  const [current] = useState('');
  const {remoteControl} = useRemoteControlState();
  const safeValue = useMemo(() => value || {}, [value]);

  const onPress = useCallback(
    async (action: RemoteControlAction) => {
      remoteControl?.sendAction(action);
    },
    [remoteControl],
  );

  const buttons = useMemo(() => {
    return Array.from(Array(columns)).map((_: any, i: number) => {
      const key = `row-${index}-column-${i}`;
      const actions = safeValue[i] || [];
      if (!actions.length) {
        return {
          key,
          value: key,
          label: '',
          disabled: true,
        };
      }
      // const [first, ...others] = actions;
      const first = actions[0]; // TODO: Deals with others
      const icon = ACTION_ICONS[first.label];
      const style = ACTION_STYLES[first.label];
      return {
        key,
        icon,
        style,
        onPress: () => onPress(first),
        value: first.value,
        label: !icon ? first.text.toLowerCase() : '',
      };
    });
  }, [columns, index, onPress, safeValue]);

  return (
    <SegmentedButtons
      style={styles.button}
      value={current}
      buttons={buttons}
      onValueChange={() => {}}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
  },
});

export default RemoteControlRow;
