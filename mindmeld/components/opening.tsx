import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('./MindMeld 1.png')} // Update with your logo path
        style={styles.logo}
      />
      <Text style={styles.title}>MindMeld</Text>
      <Text style={styles.subtitle}>Fitness</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 400, // Adjust size as needed
    height: 200, // Adjust size as needed
    marginBottom: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 25,
    color: '#fff',
    marginTop: 5,
  },
});