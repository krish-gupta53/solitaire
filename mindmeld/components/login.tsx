import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign up</Text>
        <Text style={styles.subtitle}>Get started for free</Text>
        <Image
          source={require('./assests/MindMeld 1.png')} // Update with your logo path
          style={styles.logo}
        />
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="User Name" placeholderTextColor="#fff" />
        <TextInput style={styles.input} placeholder="Age" placeholderTextColor="#fff" />
        <TextInput style={styles.input} placeholder="Gender" placeholderTextColor="#fff" />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#fff" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#fff" secureTextEntry />

        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already a user? <Text style={styles.loginText}>Login</Text>
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
  signUpButton: {
    backgroundColor: '#00AEEF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#00AEEF',
  },
});