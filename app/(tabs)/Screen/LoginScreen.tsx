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

  return (
    <View style={styles.container}>
      <Image source={require('../img/nomore.png')} style={styles.logo} />
      <Text style={styles.logoText}>
              NoMore
      </Text>
      <TextInput
        style={styles.input}
        placeholder="아이디 입력"
        value={id}
        onChangeText={setId}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 입력"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.loginButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? '로그인 중...' : '로그인'}
        </Text>
      </TouchableOpacity>
     
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>회원가입</Text>
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
    backgroundColor : '#3E63AC'
  },
  logoText : {
    fontSize : 36 ,
    color : '#FFFFFF',
    fontWeight : 'bold' ,
    marginBottom : 40
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
  },
  input: {
    color : "#FFFFFF" ,
    borderWidth: 1,
    borderColor: '#7BA7FFCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    width: '100%',
    fontWeight : "100"
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
  
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signUpButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 14,
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
