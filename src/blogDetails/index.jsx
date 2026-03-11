import {StyleSheet, Text, View} from 'react-native';
import Header from '../NavBar';

const BlogDetails = ({route}) => {
  const {blog} = route.params;
  console.log(blog,"blog")

  

  return (
    <>
    <Header heading={'blog Details'} isBackBtn/>
      <View style={styles.blogHeading}>
        <Text>Blog Heading</Text>
        <Text></Text>
      </View>

      <View>
        <View>
            
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  blogHeading: {},
});

export default BlogDetails;
