import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  Keyboard,
  TextInput,
  View,
  Button,
  Alert,
} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import api from '../../api/axiosIntance';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 🔥 Mutation Function
  const registerUser = async data => {
    const res = await api.post('/blogs/', data);
    return res.data;
  };

  // 🔥 React Query Mutation
  const {mutate, isPending} = useMutation({
    mutationFn: registerUser,
    onSuccess: data => {
      Keyboard.dismiss();
      Alert.alert('Success', 'Registered Successfully');
      console.log('Response:', data);
      setTitle('');
      setContent('');
    },
    onError: error => {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Something went wrong',
      );
      Keyboard.dismiss();
    },
  });

  const handleCreateBlog = () => {
    if (!title || !content) {
      Alert.alert('Validation', 'All fields are required');
      return;
    }

    Keyboard.dismiss();

    mutate({
      title: title,
      content: content,
    });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.inner}>
        <TextInput
          placeholder="Title"
          placeholderTextColor="#999"
          style={styles.textInput}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          placeholder="Content"
          placeholderTextColor="#999"
          style={[styles.textInput, {height: 100}]}
          multiline
          value={content}
          onChangeText={setContent}
        />

        <Button
          title={isPending ? 'Submitting...' : 'Submit'}
          onPress={handleCreateBlog}
          disabled={isPending}
        />
      </View>
    </View>
  );
};

export default CreateBlog;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inner: {
    gap: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
