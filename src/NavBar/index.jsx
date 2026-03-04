import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import api from '../api/axiosIntance';

const NavBar = ({children}) => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  const title = useNavigationState(state => {
    let route = state.routes[state.index];

    while (route.state && route.state.index != null) {
      route = route.state.routes[route.state.index];
    }

    return route.name;
  });

  const canGoBack = navigation.canGoBack();

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.log(error);
    }
  };
console.log(open,"open")
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.navbar}>
        {/* LEFT SECTION */}
        <View style={styles.leftSection}>
          {canGoBack && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.title}>{title}</Text>
        </View>

        {/* RIGHT SECTION */}
        <View style={{position: 'relative'}}>
          <TouchableOpacity
            onPress={() => setOpen(!open)}
            style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://i.pravatar.cc/150?img=12',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>

          {open && (
            <>
              <Pressable
                style={styles.overlay}
                onPress={() => setOpen(false)}
              />
              <View style={styles.dropdown}>
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={{flex: 1}}>{children}</View>
    </SafeAreaView>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  avatarContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    height: '100%',
    width: '100%',
  },
  dropdown: {
    position: 'absolute',
    top: 20,
    right: 40,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 6,
    height: 80,
    zIndex: 3,
  },
  logoutText: {
    fontSize: 16,
    color: 'red',
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
});