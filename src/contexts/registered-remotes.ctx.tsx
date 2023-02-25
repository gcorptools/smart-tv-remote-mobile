import React, {useEffect} from 'react';
import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {
  RegisteredRemoteCtxApiType,
  RegisteredRemoteCtxProps,
  RegisteredRemoteCtxStateType,
  RegisteredRemoteCtxType,
  RemoteDevice,
} from '../types';
import {readStoredKey, storeKey} from '../utils';

const REGISTERED_REMOTES_KEY = '@REGISTERED_REMOTES';

const DEFAULT_STATE = {
  remotes: {},
};
const DEFAULT_API = {
  addRemote: (domain: string, remote: RemoteDevice) => {
    throw new Error(
      `Undefined method addRemote cannot save domain: ${domain}, remote: ${remote}`,
    );
  },
  removeRemote: (domain: string) => {
    throw new Error(
      `Undefined method removeRemote cannot save domain: ${domain}`,
    );
  },
};

const RegisteredRemoteStateCtx =
  createContext<RegisteredRemoteCtxStateType>(DEFAULT_STATE);
const RegisteredRemoteApiCtx =
  createContext<RegisteredRemoteCtxApiType>(DEFAULT_API);
const RegisteredRemoteCtx = createContext<RegisteredRemoteCtxType>({
  ...DEFAULT_STATE,
  api: DEFAULT_API,
});

export const RegisteredRemotesProvider = ({
  children,
}: RegisteredRemoteCtxProps) => {
  const [initialized, setInitialized] = useState(false);
  const [remotes, setRemotes] = useState<Record<string, RemoteDevice>>({});

  useEffect(() => {
    if (initialized) {
      return;
    }
    setInitialized(true);
    const readRemotes = async () => {
      try {
        const savedRemotes =
          (await readStoredKey(REGISTERED_REMOTES_KEY)) || '{}';
        setRemotes(JSON.parse(savedRemotes));
      } catch (error) {
        console.error('Error retrieving remotes', error);
      }
    };
    readRemotes();
  }, [initialized]);

  useEffect(() => {
    const saveRemotes = async () => {
      try {
        await storeKey(REGISTERED_REMOTES_KEY, JSON.stringify(remotes));
      } catch (error) {
        console.error('Error saving remotes', error);
      }
    };
    saveRemotes();
  }, [remotes]);

  const addRemote = useCallback((domain: string, remote: RemoteDevice) => {
    setRemotes((old: any) => ({...old, [domain]: remote}));
  }, []);

  const removeRemote = useCallback((domain: string) => {
    setRemotes((old: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[domain]: _, ...newState} = old;
      return newState;
    });
  }, []);

  const api = useMemo(
    () => ({
      addRemote,
      removeRemote,
    }),
    [addRemote, removeRemote],
  );

  return (
    <RegisteredRemoteCtx.Provider
      value={{
        remotes,
        api,
      }}>
      <RegisteredRemoteApiCtx.Provider value={api}>
        <RegisteredRemoteStateCtx.Provider value={{remotes}}>
          {children}
        </RegisteredRemoteStateCtx.Provider>
      </RegisteredRemoteApiCtx.Provider>
    </RegisteredRemoteCtx.Provider>
  );
};

export const useRegisteredRemotes = () => useContext(RegisteredRemoteCtx);
export const useRegisteredRemotesApi = () => useContext(RegisteredRemoteApiCtx);
export const useRegisteredRemotesState = () =>
  useContext(RegisteredRemoteStateCtx);
