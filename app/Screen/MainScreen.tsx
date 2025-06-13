import React, { useEffect, useState } from 'react';
import {
  Image, StyleSheet, Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';



export default function LoginScreen({ navigation }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 라우팅
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  const handleSignUp = () => {
    navigation.navigate('SignUp');
  }
  // 라우팅


  const fadeAnim = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(()=>{
    return {
      opacity: fadeAnim.value,
    }
  })

  useEffect(()=>{
    fadeAnim.value = withTiming(1,{duration: 500})
  }, []);
  
  return (
    <View style={styles.container}>
      <Image source={require('../img/nomore.png')} style={styles.logo} />
      <Text style={[styles.logoText, animatedStyle]}>
        NoMore
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonContainer}>
        <Image source={require('../img/kakao.png')} style={styles.snsLoginButton}/>
        <Image source={require('../img/naver.png')} style={styles.snsLoginButton}/>
        <Image source={require('../img/google.png')} style={styles.snsLoginButton}/>
        <Image source={require('../img/apple.png')} style={styles.snsLoginButton}/>
      </View>
      <TouchableOpacity
        style={[styles.loginButton]}
      >
        <Text style={styles.loginButtonText} onPress={handleLogin}>
          이메일로 로그인
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton}>
        <Text style={styles.signUpButtonText} onPress={handleSignUp}>회원가입</Text>
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
    fontWeight : 'bold'
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
    backgroundColor : '#FFFFFF',
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
  snsLoginButton: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
    borderRadius : 20,
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
