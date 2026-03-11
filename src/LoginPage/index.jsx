import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosIntance';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {useMutation} from '@tanstack/react-query';
import {Button, TextInput} from 'react-native-paper';

const Login = ({navigation}) => {
  const navigate = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();

  const loginMutation = useMutation({
    mutationFn: async data => {
      const response = await api.post('/users/login', data);
      return response.data;
    },

    onSuccess: async data => {
      const {access_token} = data;

      await AsyncStorage.setItem('access_token', access_token);

      navigation.replace('MainApp');
    },

    onError: () => {
      Alert.alert('Login Failed', 'Invalid credentials');
    },
  });

  const handleLogin = formData => {
    loginMutation.mutate(formData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <View style={styles.card}>
        <Controller
          name="username"
          control={control}
          rules={{
            required: 'Please enter the username',
            validate: value =>
              /[A-Z]/.test(value) ||
              'Username must contain at least one capital letter',
          }}
          render={({field: {onChange, value}}) => (
            <TextInput
              label="Username"
              value={value}
              onChangeText={onChange}
              ColorValue="#21005d"
              style={styles.input}
              underlineColor="transparent"
            />
          )}
        />
        {errors.username && (
          <Text style={styles.errorMessage}>{errors.username.message}</Text>
        )}
        <Controller
          name="password"
          control={control}
          rules={{
            required: 'please enter the password',
          }}
          render={({field: {onChange, value}}) => (
            <TextInput
              label="Password"
              onChangeText={onChange}
              value={value}
              style={styles.passwordInput}
              underlineColor="transparent"
              secureTextEntry
              right={<TextInput.Icon icon="eye" />}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorMessage}>{errors.password.message}</Text>
        )}
    
        <Button
          onPress={handleSubmit(handleLogin)}
          textColor="white"
          style={styles.button}
          loading={loginMutation.isPending}>
          Login
        </Button>

        <TouchableOpacity>
          <Text
            style={styles.registerText}
            onPress={() => navigate.navigate('register')}>
            Don’t have an account? Register Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#21005d',
    textAlign: 'center',
  },
  subtitle: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    elevation: 10,
  },
  input: {
    backgroundColor: '#F2F2F2',
    marginTop: 15,
  },
  passwordInput: {
    backgroundColor: '#F2F2F2',
    marginTop: 15,
    // marginBottom: 20,
  },
  button: {
    backgroundColor: '#21005d',
    marginTop:20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#6C63FF',
    fontWeight: '600',
  },
  eyeIcon: {
    padding: 5,
  },
  errorMessage: {
    color: 'red',
  },
});
