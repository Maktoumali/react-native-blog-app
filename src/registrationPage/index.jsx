import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, Text } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axiosIntance';

const Registration = () => {
  const { control, handleSubmit } = useForm();
  const [image, setImage] = useState(null);

  // ✅ React Query Mutation
  const registerMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post('/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      Alert.alert('Success', 'User Registered Successfully');
      console.log(data);
    },
    onError: (error) => {
      Alert.alert('Error', 'Registration Failed');
      console.log(error.response?.data);
    },
  });

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.didCancel && result.assets) {
      setImage(result.assets[0]);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);

    if (image) {
      formData.append('photo', {
        uri: image.uri,
        type: image.type,
        name: image.fileName || 'photo.jpg',
      });
    }

    registerMutation.mutate(formData);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Register
      </Text>

      {/* Username */}
      <Controller
        control={control}
        name="username"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Username"
            activeOutlineColor='#21005d'
            mode="outlined"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      {/* Email */}
      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Email"
            mode="outlined"
            activeOutlineColor='#21005d'
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Password"
            mode="outlined"
            activeOutlineColor='#21005d'
            secureTextEntry
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      {/* Upload Button */}
      <Button
        mode="contained"
        icon="camera"
        onPress={pickImage}
        style={styles.uploadButton}
      >
        Upload Photo
      </Button>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.imagePreview} />
      )}

      {/* Submit */}
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={registerMutation.isPending}
        buttonColor='#21005d'
        textColor='white'
        disabled={registerMutation.isPending}
      >
        Register
      </Button>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor:'white'
  },
  uploadButton: {
    marginBottom: 15,
  },
  imagePreview: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
});