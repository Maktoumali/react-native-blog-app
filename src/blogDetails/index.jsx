import {StyleSheet, Text, View} from 'react-native';

const BlogDetails = ({route}) => {
  const {blog} = route.params;
  console.log(blog,"blog")


  return (
    <>
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
