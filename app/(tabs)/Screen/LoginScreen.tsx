import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!id || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://133.186.213.135:80/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: id, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '로그인 실패');

      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Home', { name: id });
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || '로그인 실패');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    // Add your forgot password logic here
    console.log('Forgot password');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <Image source={require('./img/logo.png')} style={styles.logo} /> {/* Replace with your logo */}
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={id}
        onChangeText={setId}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.loginButton, loading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? '로그인 중...' : '로그인'}
        </Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.colorButton, styles.yellowButton]} />
        <TouchableOpacity style={[styles.colorButton, styles.greenButton]} />
        <TouchableOpacity style={[styles.colorButton, styles.whiteButton]} />
        <TouchableOpacity style={[styles.colorButton, styles.blackButton]} />
      </View>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>비밀번호 찾기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196F3', // Blue background
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
  },
  colorButton: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
    borderRadius: 25,
  },
  yellowButton: {
    backgroundColor: 'yellow',
  },
  greenButton: {
    backgroundColor: 'green',
  },
  whiteButton: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  blackButton: {
    backgroundColor: 'black',
  },
  signUpButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: 'white',
    fontSize: 14,
  },
});
