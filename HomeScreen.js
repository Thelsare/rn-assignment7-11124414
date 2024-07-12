import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, FlatList, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const addToCart = async (item) => {
    try {
      let existingCartItems = await AsyncStorage.getItem('cartItems');
      existingCartItems = existingCartItems ? JSON.parse(existingCartItems) : [];

      existingCartItems.push(item);

      await AsyncStorage.setItem('cartItems', JSON.stringify(existingCartItems));

      alert('Item added to cart successfully!. Click on the bag icon at the top of the screen');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.positioning}>
       
        <Text style={styles.appName}>Open Fashion</Text>
        <Pressable style={{ position: 'absolute', right: 50, top: 10 }} onPress={() => navigation.navigate('Checkout')}>
          <Ionicons name="search-outline" size={30} color="black" />
        </Pressable>
        <Pressable style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => navigation.navigate('Checkout')}>
          <Ionicons name="bag-outline" size={30} color="black" />
        </Pressable>
        <StatusBar style="auto" />
      </View>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.conco}>
            <Pressable onPress={() => navigation.navigate('ProductDetails', { product: item })}>
              <Image source={{ uri: item.image }} style={styles.dresses} />
            </Pressable>
            <Pressable onPress={() => addToCart(item)} style={{ position: 'absolute', top: 10, right: 10 }}>
              <Ionicons name="add-circle-outline" size={25} color="black" />
            </Pressable>
            <Text style={styles.flatlistcontainer}>{item.title}</Text>
            <Text style={styles.flatlistdescription}>{item.category}</Text>
            <Text style={styles.flatlistprice}>${item.price}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  positioning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  dresses: {
    margin: 10,
    width: 150,
    height: 150,
  },
  flatlistcontainer: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  flatlistdescription: {
    fontSize: 11,
    marginHorizontal: 10,
    color: 'grey',
  },
  flatlistprice: {
    fontSize: 20,
    marginHorizontal: 10,
    color: 'orange',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  conco: {
    marginBottom: 20,
  },
});
