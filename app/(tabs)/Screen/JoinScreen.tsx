import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function JoinScreen({ navigation }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email : string) => {
    // 이메일 형식 간단 체크 (RFC 5322 완전 대응은 아니지만 일반적 사용에 충분)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignUp = async () => {
    if (!id || !password || !confirmPassword) {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: id,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('회원가입 성공', `${id}님, 환영합니다!`);
        navigation.goBack();
      } else {
        // 서버에서 에러 메시지 전달 시 처리
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
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  signUpButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
