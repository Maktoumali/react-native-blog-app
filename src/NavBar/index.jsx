import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Header = ({ isBackBtn = false, isSearch = false, heading }) => {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={{ backgroundColor: 'white' }}>
      {isBackBtn && (
        <Appbar.BackAction onPress={() => navigation.goBack()} iconColor='black'/>
      )}

      <Appbar.Content title={heading} titleStyle={{ color: 'black' }} />

      {isSearch && (
        <Appbar.Action icon="magnify" onPress={() => {}} iconColor='black'/>
      )}
    </Appbar.Header>
  );
};

export default Header;