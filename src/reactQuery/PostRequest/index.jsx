import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  Keyboard,
  TextInput,
  View,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {Button, Surface, HelperText, IconButton} from 'react-native-paper';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useMutation} from '@tanstack/react-query';
import {launchImageLibrary} from 'react-native-image-picker';
import api from '../../api/axiosIntance';
import Header from '../../NavBar';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const requestAndroidPermission = async () => {
    if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
    }

    // Android 13+
    if (Platform.Version >= 33) {
      const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      return result === RESULTS.GRANTED;
    }

    // Android 12 and below
    const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    return result === RESULTS.GRANTED;
  };

  const handlePickImage = async () => {
    const hasPermission = await requestAndroidPermission();

    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Please allow photo library access in your device settings.',
      );
      return;
    }

    // ✅ Await instead of using a callback
    const response = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });

    if (response.didCancel || response.errorCode) return;
    const asset = response.assets?.[0];
    if (asset) setImage(asset);
    console.log(image, 'selectedImage');
  };

  const handleRemoveImage = () => setImage(null);

  const createBlog = async data => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);

    if (data.image) {
      formData.append('images', {
        uri: data.image.uri,
        type: data.image.type || 'image/jpeg',
        name: data.image.fileName || 'blog_image.jpg',
      });
    }

    console.log(formData, 'formData');
    const res = await api.post('/blogs/', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return res.data;
  };

  const {mutate, isPending} = useMutation({
    mutationFn: createBlog,
    onSuccess: data => {
      Keyboard.dismiss();
      Alert.alert('Success', 'Blog created successfully!');
      setTitle('');
      setContent('');
      setImage(null);
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
      Alert.alert('Validation', 'Title and content are required');
      return;
    }
    Keyboard.dismiss();
    mutate({title, content, image});
  };

  return (
    <>
    <Header heading={'Create Blog'}/>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
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
              style={[styles.textInput, styles.contentInput]}
              multiline
              value={content}
              onChangeText={setContent}
            />

            {image ? (
              <Surface style={styles.imagePreviewContainer} elevation={2}>
                <Image source={{uri: image.uri}} style={styles.previewImage} />
                <IconButton
                  icon="close-circle"
                  iconColor="#ff4444"
                  size={26}
                  style={styles.removeIcon}
                  onPress={handleRemoveImage}
                />
                <Text style={styles.imageFileName} numberOfLines={1}>
                  {image.fileName || 'Selected image'}
                </Text>
              </Surface>
            ) : (
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={handlePickImage}
                activeOpacity={0.7}>
                <IconButton icon="image-plus" iconColor="#21005d" size={32} />
                <Text style={styles.uploadText}>Tap to upload an image</Text>
                <HelperText type="info" style={styles.helperText}>
                  JPG, PNG supported
                </HelperText>
              </TouchableOpacity>
            )}

            {image && (
              <Button
                mode="outlined"
                icon="image-edit"
                textColor="#21005d"
                style={styles.changeImageBtn}
                onPress={handlePickImage}>
                Change Image
              </Button>
            )}

            <Button
              onPress={handleCreateBlog}
              disabled={isPending}
              textColor="white"
              buttonColor="#21005d"
              mode="contained"
              loading={isPending}
              icon="send">
              Submit
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default CreateBlog;

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#21005d',
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#f5f0ff',
  },
  uploadText: {
    color: '#21005d',
    fontSize: 15,
    fontWeight: '600',
  },
  helperText: {
    color: '#999',
  },
  imagePreviewContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f0ff',
  },
  previewImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  removeIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    margin: 0,
  },
  imageFileName: {
    padding: 8,
    paddingHorizontal: 12,
    color: '#555',
    fontSize: 13,
  },
  changeImageBtn: {
    borderColor: '#21005d',
  },
});
