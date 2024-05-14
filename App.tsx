import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/home';
import ChatRoom from './screens/chatroom';
import AboutApp from './screens/aboutapp';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
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
  ); 
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator  
        screenOptions={{
          tabBarInactiveTintColor: 'gray',
        }}
        initialRouteName="HomeStack"
        >
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{ headerShown: false, tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }} />
        <Tab.Screen 
          name="About App" 
          component={AboutApp} 
          options={{ headerTitle: 'About This App', tabBarLabel: 'About',
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'information-circle' : 'information-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );

}

export default App;


/*
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/

