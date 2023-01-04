import React, {useState} from 'react';
import { SafeAreaView, 
         View, 
         Keyboard,
         StyleSheet 
} from 'react-native';
import axios from "axios";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Text, TextInput } from 'react-native-paper';
import { PUBLIC_CODE } from '@env';

interface PropsType {
   navigation: any
}

function Home({ navigation }: PropsType){
  const [roomName, setRoomName] = useState('');

  function changeRoomName(text: string){
    const value = text.replace(/<\/?[^>]*>/g, "");
    setRoomName(value);
  }
  
  async function joinChatRoom(){
    if (!roomName){
       return;
    }

    let result: any;
    do {
       const response = await axios.get("https://api.randomuser.me/");
       result = response.data.results[0];
    }
    while(!result.id.name && !result.id.value);      
    const user = {
       id: `${result.id.name}_${result.id.value?.replace(/ /g, '-')}`,
       name: result.name.first,
       picture: result.picture.thumbnail,
       email: result.email,
       publiccode: PUBLIC_CODE,
    };

    navigation.navigate('ChatRoom', {roomid: roomName, user});
    setRoomName('');
    Keyboard.dismiss();
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps='handled'
        scrollEnabled={false}
        >
        <View style={styles.mainContainer}>
          <View style={styles.itemCenter}>
            <Text style={styles.titleText}>Chat Applications with Cloud Firestore</Text>
          </View>
          <View style={styles.listItem}>
            <TextInput
              mode='outlined'
              label="Chat Room"
              placeholder="Please Type Room Name"
              value={roomName}
              onChangeText={text => changeRoomName(text)}
              autoCapitalize="none"
            />
          </View>
          <Button
            mode='contained'
            onPress={() => joinChatRoom()}
            >Join Room</Button>
        </View>
      </KeyboardAwareScrollView>    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1
  },
  mainContainer: {
    flex: 1, 
    justifyContent: 'center', 
    paddingBottom: 50, 
    paddingHorizontal: 5
  },
  listItem: {
    marginBottom: 10,
  },
  itemCenter: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  titleText: {
    height: 24,
    fontSize: 20,
    fontWeight: 'bold'   
  }
});

export default Home;
