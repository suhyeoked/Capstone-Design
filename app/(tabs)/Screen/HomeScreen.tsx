import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen({ route }) {
  const { name } = route.params || {};

  return (
    <View style={styles.container}>
      {/* Welcome Message */}
      <Text style={styles.welcomeText}>{name ? `${name}님 좋은 하루!` : '좋은 하루!'}</Text>

      {/* Today's Goal Section */}
      <Text style={styles.subTitle}>오늘의 목표</Text>
      <View style={styles.taskContainer}>
        <TouchableOpacity style={styles.taskButton}>
          <Text style={styles.taskText}>정보처리기사 자격증 취득</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.taskButton}>
          <Text style={styles.taskText}>30분씩 주 3회 운동</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navContainer}>
        <View style={styles.navButton} />
        <View style={styles.navButton} />
        <View style={styles.navButton} />
        <View style={styles.navButton} />
        <View style={styles.navButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 50,
    color: '#1e3a8a', // Dark blue color
  },
  subTitle: {
    fontSize: 18,
    color: '#6b7280', // Grey color
    marginVertical: 20,
  },
  taskContainer: {
    width: '100%',
    marginTop: 10,
  },
  taskButton: {
    backgroundColor: '#f3f4f6', // Light grey
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  taskText: {
    fontSize: 16,
    color: '#374151', // Dark grey
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 30,
  },
  navButton: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1e3a8a', // Dark blue
  },
});
