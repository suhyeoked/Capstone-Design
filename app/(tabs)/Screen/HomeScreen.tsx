import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen({ route }) {
  const { name } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        {name ? `환영합니다, ${name}님!` : '환영합니다!'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcomeText: { fontSize: 24, fontWeight: 'bold' },
});
