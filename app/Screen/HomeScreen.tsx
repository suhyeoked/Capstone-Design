import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ route }) {
  const { name } = route.params || {};
  const [taskArray , setTaskArray] = useState(['111','222']);
 
  return (
    <View style={styles.container}>
      <View>
      <View style={styles.topNavBar} >
        <Image source={require('../img/search.png')} style={styles.topNavBarImage} />
        <Image source={require('../img/alarm.png')} style={styles.topNavBarImage} />
        <View style={styles.topNavBarButton} />
      </View>
      <Text style={styles.welcomeText}>
        {name ? `${name}님 \n좋은 하루 !` : '좋은 하루!'}
      </Text>
      <Text style={styles.subTitle}>오늘의 목표</Text>
      <View style={styles.taskContainer}>
        {
          taskArray.map((item)=>{
            return(
            <View style={styles.taskButton}>
              <Text style={styles.taskText}>{item}</Text>
              <Text style={styles.taskTextLine} />
              <Text style={styles.taskTextBottom}>더보기</Text>
            </View>
            )
          })
        }
      </View>
      {/* Bottom Navigation */}
      </View>
      <View style={styles.navContainer}>
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
  },
  topNavBar : {
    flexDirection: 'row',
    position : 'absolute',
    right : 10 ,
    justifyContent: 'flex-end',
  }
  ,
  topNavBarImage : {
    width : 30 ,
    height : 30 ,
    marginLeft : 15,
  } 
  ,
  topNavBarButton : {
    width : 30 ,
    height : 30 ,
    backgroundColor : '#3E63AC',
    borderRadius : 30,
    marginLeft : 15 ,
  }
  ,
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 100,
    color: 'black', 
    lineHeight : 54
  },
  subTitle: {
    fontSize: 18,
    color: 'black', // Grey color
    marginVertical: 20,
    fontWeight : 'bold' ,
    textAlign : 'left'
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
    alignItems: 'flex-end' ,
    width: '100%',
  },
  taskText: {
    fontSize: 19 ,
    color: '#374151', // Dark grey
    fontWeight : 'bold' ,
    cursor : 'auto' 
  },
  taskTextLine : {
    width : '100%' ,
    backgroundColor : '#D9D9D9' ,
    height : 1, 
    marginTop : 12 ,
    marginBottom : 12
  },
  taskTextBottom : {
    color : '#B4B4B4',
    fontWeight : 'black',
    cursor : 'pointer'
  }, 
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '112%',
    height : 70,
    position : 'absolute' ,
    bottom : 0,
    backgroundColor : "#EFEFEF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  navButton: {
    width: 26,
    height: 26,
    borderRadius: 26,
    backgroundColor: '#1e3a8a',
    alignSelf : 'center'
  },
});