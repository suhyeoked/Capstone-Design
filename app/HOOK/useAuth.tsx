// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { getToken } from '../JWT/AuthStorage'; // AuthStorage에서 getToken 가져오기

// const useAuth = () => {
//   const [authToken, setAuthToken] = useState<string | null>(null);

//   useEffect(() => {
//     // 컴포넌트가 마운트될 때 JWT 가져오기
//     const fetchToken = async () => {
//       const token = await getToken();
//       if (token) {
//         setAuthToken(token);
//       }
//     };
//     fetchToken();
//   }, []);

//   const getAuthHeaders = () => {
//     return {
//       Authorization: `Bearer ${authToken}`,
//     };
//   };

//   const fetchData = async (url , p0: { method: string; headers: { 'Content-Type': string; }; body: string; }) => {
//     try {
//       const headers = getAuthHeaders();
//       const response = await axios.get(url, { headers });
//       return response.data;
//     } catch (error) {
//       console.error('API request failed', error);
//     }
//   };

//   return { authToken, fetchData };
// };

// export default useAuth;
