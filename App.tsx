import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/home';
import ChatRoom from './screens/chatroom';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
           name="Home" 
           component={Home}
           options={{ title: 'Join Room' }}
           />
        <Stack.Screen 
           name="ChatRoom" 
           component={ChatRoom} 
           options={({ route }: {route: any}) => {
              if (!route.params?.roomid) {
                 return ({title: 'ChatRoom'});
              }
              return ({title: 'ChatRoom: '+route.params?.roomid});
           }}
           />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
