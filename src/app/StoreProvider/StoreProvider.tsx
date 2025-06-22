import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { FirebaseAuthInit } from './FirebaseAuthInit';

interface StoreProviderProps {
  children: ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <FirebaseAuthInit>
        {children}
      </FirebaseAuthInit>
    </Provider>
  );
};

export default StoreProvider;