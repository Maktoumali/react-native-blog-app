import {
  FlatList,
  StyleSheet,
  Text,
  View,
  // ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import api from '../api/axiosIntance';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, Avatar} from 'react-native-paper';

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
    <View style={styles.mainCardContainer}>
      <View style={styles.authorImagContainer}>
        <View style={styles}>
          <Avatar.Image
            size={40}
            source={{
              uri: `http://192.168.1.66:8000/${blog.author.profile_photo}`,
            }}
          />
        </View>
        <View></View>
        <View></View>
      </View>
      {blog.images?.length > 0 && (
        <Image
          source={{uri: `http://192.168.1.66:8000${blog.images[0].url}`}} // ✅ object + no extra /
          style={styles.blogImage} // ✅ Image must have a size or it won't show
          resizeMode="cover"
        />
      )}
      <View style={styles.card}>
        <Text style={styles.title}>{blog.title}</Text>

        <Text style={styles.content}>{blog.content}</Text>

        <View style={styles.divider} />

        <Text style={styles.meta}>
          ✍ Author: <Text style={styles.bold}>{blog.author.username}</Text>
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const FirstPage = () => {
  const {data, isLoading, isError, error, refetch, isFetching} = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
    staleTime: 5 * 60 * 1000,
  });
  const navigation = useNavigation();
  console.log('data', data);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="small" color="#21005d" />
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
        data={data?.items}
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
  mainCardContainer:{
    width:'100%',
    backgroundColor:'#FAF9F6',
    marginBottom:8,
  },
  authorImagContainer: {
    width: '100%',
    // backgroundColor: 'black',
    height:50,
    display:'flex',
    justifyContent:'center',
    paddingLeft:10,
    
  },
  avatarContainer: {
    width: '20%',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    // borderRadius: 14,
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
  blogImage: {
    width: '100%',
    height: 320,
    // borderRadius: 14,
    marginBottom: 0, // card sits right below it
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default FirstPage;
