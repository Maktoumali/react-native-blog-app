import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

const useInternetListener = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected =
        state.isConnected && state.isInternetReachable;

      if (!isConnected) {
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection.'
        );
      }
    });

    return () => unsubscribe();
  }, []);
};

export default useInternetListener;