import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Pressable, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const storedCartItems = await AsyncStorage.getItem('cartItems');
      if (storedCartItems !== null) {
        setCartItems(JSON.parse(storedCartItems));
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const removeFromCart = async (item) => {
    try {
      let existingCartItems = await AsyncStorage.getItem('cartItems');
      existingCartItems = existingCartItems ? JSON.parse(existingCartItems) : [];

      const updatedCartItems = existingCartItems.filter(cartItem => cartItem.id !== item.id);

      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.positioning}>
        <Text style={styles.appName}>Open Fashion</Text>
        <Pressable style={{ position: 'absolute', right: 50, top: 10 }}>
          <Ionicons name="search-outline" size={30} color="black" />
        </Pressable>
      </View>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.title}</Text>
              <Text style={styles.itemdescription}>{item.category}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
            <Pressable onPress={() => removeFromCart(item)} style={{ position: 'absolute', top: 10, right: 10 }}>
              <Ionicons name="close-circle-outline" size={25} color="red" />
            </Pressable>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>EST. TOTAL</Text>
        <Text style={styles.totalAmount}>${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</Text>
      </View>
      <View style={styles.checkoutButtonContainer}>
        <Pressable style={styles.button}>
          <Ionicons name="bag-handle-outline" size={45} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>CHECKOUT</Text>
        </Pressable>
      </View>
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
  cartItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  itemName: {
    fontSize: 16,
  },
  itemdescription: {
    fontSize: 14,
    color: 'grey',
  },
  itemPrice: {
    fontSize: 18,
    color: 'orange',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'orange',
  },
  checkoutButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: 'black',
    width: '90%',
    height: 70,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
