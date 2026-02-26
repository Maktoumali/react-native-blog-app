import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import api from '../api/axiosIntance';
import {useNavigation} from '@react-navigation/native';

const fetchBlogs = async () => {
  const response = await api.get('/blogs/list');
  return response.data;
};

const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const Item = ({blog, onPress}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <View style={styles.card}>
      <Text style={styles.title}>{blog.title}</Text>

      <Text style={styles.content}>{blog.content}</Text>

      <View style={styles.divider} />

      <Text style={styles.meta}>
        ✍ Author: <Text style={styles.bold}>{blog.author.username}</Text>
      </Text>

      <Text style={styles.meta}>📅 Created: {formatDate(blog.created_at)}</Text>

      <Text style={styles.meta}>🔄 Updated: {formatDate(blog.updated_at)}</Text>
    </View>
  </TouchableOpacity>
);

const FirstPage = () => {
  const {data, isLoading, isError, error, refetch, isFetching} = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });
  const navigation = useNavigation();
  console.log('data', data);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={{color: 'red'}}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <Item
            blog={item}
            onPress={() => navigation.navigate('blogDetails', {blog: item})}
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{padding: 16}}
        showsVerticalScrollIndicator={false}
        refreshing={isFetching}
        onRefresh={refetch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6, // Android shadow
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  content: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  meta: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: '#444',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FirstPage;
