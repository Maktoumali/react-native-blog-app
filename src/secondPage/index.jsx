import {
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  View,
  Platform,
} from 'react-native';

const SecondPage = () => {
  return (
    <>
      <View style={styles.mainContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <ScrollView
            contentContainerStyle={{padding: 24}}
            keyboardShouldPersistTaps="handled" 
            showsVerticalScrollIndicator={false}
            >
            <View style={styles.inner}>
              <Text style={styles.header}>Fill the Form</Text>
              <TextInput
                placeholder="Username"
                placeholderTextColor="#999"
                style={styles.textInput}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#999"
                style={styles.textInput}
              />
              <TextInput
                placeholder="DOB"
                placeholderTextColor="#999"
                style={styles.textInput}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                style={styles.textInput}
              />
              <TextInput
                placeholder="Phone No."
                placeholderTextColor="#999"
                style={styles.textInput}
              />
              <View style={styles.btnContainer}>
                <Button title="Submit" onPress={() => null} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
    color:'black'
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});

export default SecondPage;
