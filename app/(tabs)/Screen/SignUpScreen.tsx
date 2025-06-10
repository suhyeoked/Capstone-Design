import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');               // ① 이름 state 추가
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignUp = async () => {
    if (!name || !id || !password || !confirmPassword) { // ② 이름 체크 추가
      setError('모든 항목을 입력해주세요.');
      return;
    }

    if (!validateEmail(id)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // TODO: 실제 API URL로 변경
      const response = await fetch('http://133.186.213.135:80/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: id,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('회원가입 성공', `${name}님, 환영합니다!`);
        navigation.navigate('HomeScreen', { name });
      } else {
        setError(data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.log('SignUp Error:', error);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../img/nomore.png')} style={styles.logo} />
        <Text style={styles.logoText}>
          NoMore
        </Text>
      <TextInput
        style={styles.input}
        placeholder="이름"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={id}
        onChangeText={setId}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.signUpButton, loading && { backgroundColor: '#bbb' }]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.signUpButtonText}>
          {loading ? '회원가입 중...' : '회원가입'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20,
    flex: 1, 
    justifyContent: 'center' ,
    alignItems: 'center',
    backgroundColor : '#3E63AC' ,
  },

  logo: {
    width: 100,
    height: 100,
    alignItems : "center"
  },
  logoText : {
    fontSize : 36 ,
    color : '#FFFFFF',
    fontWeight : 'bold',
    marginBottom : 40 ,
    textAlign : "center"
  },
  input: {
    width : "100%" ,
    borderWidth: 1,
    borderColor: '#7BA7FFCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15 ,
    color : '#FFFFFF',
    fontWeight : '100'
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center' , 
    width : "100%" ,
  },
  signUpButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
