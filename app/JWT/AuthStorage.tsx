// import AsyncStorage from '@react-native-async-storage/async-storage';

// // JWT 저장
// export const saveToken = async (token) => {
//   try {
//     await AsyncStorage.setItem('jwt_token', token);  // JWT를 AsyncStorage에 저장
//   } catch (e) {
//     console.error('Error saving token', e);
//   }
// };

// // JWT 가져오기
// export const getToken = async () => {
//   try {
//     const token = await AsyncStorage.getItem('jwt_token');
//     if (token !== null) {
//       return token;  // JWT 반환
//     }
//   } catch (e) {
//     console.error('Error retrieving token', e);
//   }
//   return null;
// };

// // JWT 삭제
// export const removeToken = async () => {
//   try {
//     await AsyncStorage.removeItem('jwt_token');  // JWT 삭제
//   } catch (e) {
//     console.error('Error removing token', e);
//   }
// };
