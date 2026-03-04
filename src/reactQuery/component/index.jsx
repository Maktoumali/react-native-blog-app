import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  // ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";

const ProductListing = () => {
  const getProducts = async () => {
    const res = await axios.get("https://dummyjson.com/products");
    return res.data.products;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" animating={true} color="#21005d"/>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />

      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.brand}>{item.brand}</Text>

        <View style={styles.rowBetween}>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>

        <Text
          style={[
            styles.stock,
            item.availabilityStatus === "In Stock"
              ? styles.inStock
              : styles.outStock,
          ]}
        >
          {item.availabilityStatus}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 12 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ProductListing;

const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },

  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },

  cardContent: {
    padding: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },

  brand: {
    fontSize: 13,
    color: "#777",
    marginVertical: 4,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },

  rating: {
    fontSize: 14,
    color: "#f9a825",
  },

  stock: {
    fontSize: 13,
    fontWeight: "600",
  },

  inStock: {
    color: "#2e7d32",
  },

  outStock: {
    color: "#d32f2f",
  },
});