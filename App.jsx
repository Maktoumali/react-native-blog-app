import {NavigationContainer} from '@react-navigation/native';
import FirstPage from './src/firstPage';
import SecondPage from './src/secondPage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ImagePickerScreen from './src/cameraAccess';
import Fontisto from '@react-native-vector-icons/fontisto';
import ProductListing from './src/reactQuery/component';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import CreateBlog from './src/reactQuery/PostRequest';
import Login from './src/LoginPage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BlogDetails from './src/blogDetails';
import NavBar from './src/NavBar';
import {PaperProvider} from 'react-native-paper';
import Registration from './src/registrationPage';
import {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';

function App() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const queryClient = new QueryClient();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  function blogStack() {
    return (
      <Stack.Navigator
        screenOptions={({}) => ({
          headerShown: false,
        })}>
        <Stack.Screen name="Home" component={FirstPage} />
        <Stack.Screen name="blogDetails" component={BlogDetails} />
      </Stack.Navigator>
    );
  }

  function MyTabs() {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarActiveTintColor: 'blue',
          // tabBarActiveBackgroundColor:'green',
          // tabBarBackground:'red',
          tabBarIcon: () => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Profile') {
              iconName = 'island';
            } else if (route.name === 'Shop') {
              iconName = 'shopping-store';
            } else if (route.name === 'Add Blog') {
              iconName = 'file-text';
            } else {
              iconName = 'camera';
            }

            return <Fontisto name={iconName} size={20} />;
          },
        })}>
        <Tab.Screen name="Home" component={blogStack} />
        <Tab.Screen name="Profile" component={SecondPage} />
        <Tab.Screen name="camera" component={ImagePickerScreen} />
        <Tab.Screen name="Shop" component={ProductListing} />
        <Tab.Screen name="Add Blog" component={CreateBlog} />
      </Tab.Navigator>
    );
  }

  function MainApp() {
    return (
      <NavBar>
        <MyTabs />
      </NavBar>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="register" component={Registration} />
            <Stack.Screen name="MainApp" component={MainApp} />
          </Stack.Navigator>
          {/* <MyTabs/> */}
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

export default App;
