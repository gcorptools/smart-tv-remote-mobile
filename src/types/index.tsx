import {
  BaseRemoteControl,
  RemoteType,
} from '@gcorptools/smart-tv-remote-common';

export type RemoteDevice = Pick<
  BaseRemoteControl,
  'clientId' | 'clientName' | 'url' | 'debug' | 'port'
> & {
  type: RemoteType;
  authKey: string;
};

export type RegisteredRemoteCtxStateType = {
  remotes: Record<string, RemoteDevice>;
};

export type RegisteredRemoteCtxApiType = {
  addRemote: (domain: string, remote: RemoteDevice) => void;
  removeRemote: (domain: string) => void;
};

export type RegisteredRemoteCtxType = RegisteredRemoteCtxStateType & {
  api: RegisteredRemoteCtxApiType;
};

export type RegisteredRemoteCtxProps = {
  children: any;
};
