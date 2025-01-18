import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Continue your beautiful journey with <Text style={styles.brand}>MindMeld</Text></Text>
        <Image
          source={require('./path/to/your/logo.png')} // Update with your logo path
          style={styles.logo}
        />
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#fff" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#fff" secureTextEntry />

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          New to <Text style={styles.brand}>MindMeld</Text>? <Text style={styles.signUpText}>Sign up</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  brand: {
    color: '#00AEEF',
    fontWeight: 'bold',
  },
  logo: {
    width: 50, // Adjust size as needed
    height: 50, // Adjust size as needed
    alignSelf: 'flex-end',
  },
  form: {
    flex: 1,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#00AEEF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: '#00AEEF',
  },
});