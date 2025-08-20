import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../src/store';


export default function HomeScreen({ route , navigation }) {
  const name = useSelector((state : RootState)=>state.user.name)
  const [taskArray , setTaskArray] = useState([]);
  const [taskArrayInput , setTaskArrayInput] = useState("");
  const [targetAdd , setTargetAdd] = useState(false);

  const [selected, setSelected] = useState("");


  const handleCalendars = () => {
    navigation.navigate('Calendars');
  }
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
      <Pressable onPress={()=>{
          setTargetAdd(true)
        }}>
        <View style={styles.targetAdd}>
            <Text style={styles.targetAddText}>
              추가
            </Text>
        </View>
      </Pressable>
      {
        targetAdd == true ? 
            <View>
              <View style={styles.targetAddTextInput}>
                <TextInput editable
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  onChange={(e)=>{
                    setTaskArrayInput(e.nativeEvent.text)
                  }}
                  placeholder='목표를 입력하세요'/>
              </View>
              <View style={styles.targetAdd}>
                <Pressable onPress={()=>{
                  let copy = [...taskArray]
                  copy.unshift(taskArrayInput)
                  setTaskArray(copy)
                  setTargetAdd(false)
                }}>
                  <Text style={styles.targetAddText}>
                    추가
                  </Text>
                </Pressable>
              </View>
            </View>
            : null
      }
      
          <View style={styles.taskContainer}>
            { 
              taskArray.map((item)=>{
                return(
                <View style={styles.taskButton}>
                  <Text style={styles.taskText}>{item}</Text>
                  <Text style={styles.taskTextLine} />
                  <Text style={styles.taskTextBottom}>더보기</Text>
                  <Pressable style={styles.taskTextBottomRemove} onPress={()=>{
                    let remove = [...taskArray]
                    remove.shift();
                    setTaskArray(remove)
                  }}>
                    삭제
                  </Pressable>
                </View>
                )
              })
            }
          </View>
          

      {/* Bottom Navigation */}
      </View>
    <View style={styles.bottomBar}>
      <TouchableOpacity onPress={handleCalendars}>
        <View style={styles.navDot} />
      </TouchableOpacity>
        <View style={styles.navDot} />
        <View style={styles.navDot} />
        <View style={styles.navDot} />
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
    color: 'black', 
    marginVertical: 20,
    fontWeight : 'bold' ,
    textAlign : 'left'
  },
  targetAdd : {
    backgroundColor : '#f3f4f6',
    alignItems : 'center',
    paddingTop : 10 ,
    paddingBottom : 10 ,
    borderRadius : 8,
    width : 110 ,
    paddingLeft : 10,
    paddingRight : 10,
  },
  targetAddText : {
    fontSize : 17 ,
    fontWeight : 'bold' ,
  },
  targetAddTextInput :  {
    paddingTop : 10,
    paddingBottom : 10,
    height : 100
  } ,
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
  }, 
  taskTextBottomRemove : {
    fontSize : 14 ,
    color : '#B4B4B4',
  } ,
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    height: 72,
    backgroundColor: '#EFF1F5',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navDot: { width: 18, height: 18, borderRadius: 18, backgroundColor: '#3b5bdb' },

}); 