import React, {useState, useEffect, useRef} from 'react';
import { collection, 
         doc, 
         addDoc,
         setDoc,
         getDocs, 
         deleteDoc, 
         query, 
         where, 
         orderBy, 
         Timestamp,
         onSnapshot } from "firebase/firestore";
import db from '../lib/firestore';
import useTyping from "../lib/usetyping";
import { Keyboard,
         TouchableHighlight, 
         View, 
         ScrollView
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from '../styles/css';
import UserAvatar from '../components/useravatar';
import Users from '../components/users';
import ChatMessage from '../components/chatmessage'
import TypingMessage from "../components/typingmessage";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PUBLIC_CODE } from '@env';
import store from 'store2';
import { User, Message } from '../lib/types';

interface PropsType {
   route: any;  
   navigation: any
}

function ChatRoom({ route, navigation }: PropsType){
   const { roomid, user } = route.params;
   const [users, setUsers] = useState<User[]>([]);
   const [messages, setMessages] = useState<Message[]>([]);
   const [typingUsers, setTypingUsers] = useState<User[]>([]);
   const [newMessage, setNewMessage] = useState("");
   const { isTyping, startTyping, cancelTyping } = useTyping();
   const [timeDiff, setTimeDiff] = useState(0);
   const viewRef = useRef(null);
   const PUBLIC__CODE = PUBLIC_CODE || process.env.EXPO_PUBLIC_PUBLIC_CODE;

   useEffect(() => {
      async function addUserToRoom(){
         if (!user){
            return;
         }

         try {
            const userData = {...user};
            delete userData.id;
            let userID = user.id;
            const result = await clearChatRoom();
            if (result == 'EmptyRoom') {
               await setDoc(doc(db, "chat", roomid, "users", userID), {...userData, createdAt: Timestamp.now().toMillis()});
            }else{
               //Check if user with the same name exists in users
               const q = query(collection(db, "chat", roomid, "users"), where("name", "==", user.name), where("publiccode", "==", PUBLIC__CODE));
               const querySnapshot = await getDocs(q);
               if (querySnapshot.empty){
                  await setDoc(doc(db, "chat", roomid, "users", userID), {...userData, createdAt: Timestamp.now().toMillis()});
               }else{
                  let duplicateId = false;
                  querySnapshot.forEach((doc) => {
                     if (doc.id === userID){
                        duplicateId = true;
                     }
                  });
                  if (duplicateId){
                     const result = await addDoc(collection(db, "chat", roomid, "users"), {...userData, createdAt: Timestamp.now().toMillis()});
                     userID = result.id;
                     user.id = userID;
                  }else{
                     await setDoc(doc(db, "chat", roomid, "users", userID), {...userData, createdAt: Timestamp.now().toMillis()});
                  }
               }
            } 
            addUserToRecent(user);
         }catch(error: any){
            console.error("Error found:", error);
         }
      }
      
      addUserToRoom();
   
   },[roomid, user]);
    
   useEffect(() => {
      const q = query(collection(db, "chat", roomid, "users"), where("publiccode", "==", PUBLIC__CODE));
      getDocs(q)
      .then((querySnapshot) => {
         const userList: User[] = [];
         querySnapshot.forEach((doc) => {
            const newUser = {id: doc.id, ...doc.data()} as User;
            delete newUser.publiccode;
            userList.push(newUser);
         });
         setUsers(userList);
      })
      .catch((error) => {
         console.error(error);
      });

      const q1 = query(collection(db, "chat", roomid, "recent"), where("key", "==", "adduser"), where("publiccode", "==", PUBLIC__CODE));
      const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
         querySnapshot.forEach((doc) => {
            setUsers((prev: User[]) => {
               const exists = prev.find(
                  ({ id }) => id === doc.data().id
               );
               if (exists){
                  return prev;
               }
               const addedUser = doc.data();
               delete addedUser.key;
               delete addedUser.publiccode;
               return [...prev, addedUser as User];
            });
  
         });
      });

      const q2 = query(collection(db, "chat", roomid, "recent"), where("key", "==", "removeuser"), where("publiccode", "==", PUBLIC__CODE));
      const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
         querySnapshot.forEach((doc) => {
            setUsers((prev: User[]) => {
               return prev.filter(
                  ({ id }) => id !== doc.data().id
               );
            }); 
         }); 
      });
   
      return () => {
        unsubscribe1();
        unsubscribe2();
      }
   },[]);

   useEffect(() => {
      const q = query(collection(db, "chat", roomid, "typingusers"), where("publiccode", "==", PUBLIC__CODE));
      getDocs(q)
      .then((querySnapshot) => {
         const userList: User[] = [];
         querySnapshot.forEach((doc) => {
            const newUser = {id: doc.id, ...doc.data()} as User;
            delete newUser.publiccode;
            userList.push(newUser);
         });
         setTypingUsers(userList);
      })
      .catch((error) => {
         console.error(error);
      });

      const q1 = query(collection(db, "chat", roomid, "recent"), where("key", "==", "addtypinguser"), where("publiccode", "==", PUBLIC__CODE));
      const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
         querySnapshot.forEach((doc) => {
            setTypingUsers((prev: User[]) => {
               const exists = prev.find(
                  ({ id }) => id === doc.data().id
               );
               if (exists){
                   return prev;
               }
               const addedUser = doc.data();
               delete addedUser.key;
               delete addedUser.publiccode;
               return [...prev, addedUser as User];
            });
         });
      });

      const q2 = query(collection(db, "chat", roomid, "recent"), where("key", "==", "removetypinguser"), where("publiccode", "==", PUBLIC__CODE));
      const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
         querySnapshot.forEach((doc) => {
            setTypingUsers((prev: User[]) => {
               return prev.filter(
                  ({ id }) => id !== doc.data().id
               );
            }); 
         });
      });

      return () => {
         unsubscribe1();
         unsubscribe2();
      }
   },[]);

   useEffect(() => {
      const q = query(collection(db, "chat", roomid, "messages"), where("publiccode", "==", PUBLIC__CODE), orderBy('sentAt'));
      getDocs(q)
      .then((querySnapshot) => {
         const msgList: Message[] = [];
         querySnapshot.forEach((doc) => {
            const message = {id: doc.id, ...doc.data()} as Message;
            message.sentAt += timeDiff;
            delete message.publiccode;
            msgList.push(message);
         });   
         setMessages(msgList);
   
      })
      .catch((error) => {
         console.error(error);
      });
      
      const q1 = query(collection(db, "chat", roomid, "recent"), where("key", "==", "addmessage"), where("publiccode", "==", PUBLIC__CODE));
      const unsubscribe = onSnapshot(q1, (querySnapshot) => {
         querySnapshot.forEach((doc) => {
            setMessages((prev: Message[]) => {
               const exists = prev.find(
                  ({ id }) => id === doc.data().id
               );
               if (exists){
                   return prev;
               }
               const addedMessage = doc.data();
               delete addedMessage.key;
               delete addedMessage.publiccode;
               const messagesData = prev.filter(item => 
                  item.id !== 'temp');
               return [...messagesData, addedMessage as Message];           
            });
         });
      });
 
      return () => {
         unsubscribe();
      }
       
   },[]);

   useEffect(() => {
      setTimeDiff(Date.now() - Timestamp.now().toMillis());
   },[]);

   async function addUserToRecent(user: User) {
      const addedUser = {key: 'adduser', ...user, createdAt: Timestamp.now().toMillis()};
      await setDoc(doc(db, "chat", roomid, "recent", "adduser"), addedUser);
 
      //Check the recent removed user
      const storeKey = 'removeuser_' + roomid;
      const removedUser = JSON.parse(store(storeKey));
      if (removedUser?.id === addedUser.id){
         store.remove(storeKey);
         await deleteDoc(doc(db, "chat", roomid, "recent", "removeuser"));
      }
   }

   async function clearChatRoom() {
      const qMsg = query(collection(db, "chat", roomid, "recent"), where("key", "==", "addmessage"), where("publiccode", "==", PUBLIC__CODE));
      const queryMsg = await getDocs(qMsg);
      if (!queryMsg.empty){
         let dataValid = false;
         queryMsg.forEach((doc) => {
            if (doc.data()?.sentAt > (Timestamp.now().toMillis() - 12 * 60 * 60 * 1000)){
               dataValid = true;
            }
         });
         if (dataValid){
            return '';
         }
      }
      const qUser = query(collection(db, "chat", roomid, "recent"), where("key", "==", "adduser"), where("publiccode", "==", PUBLIC__CODE));
      const queryUser = await getDocs(qUser);
      if (!queryUser.empty){
         let dataValid = false;
         queryUser.forEach((doc) => {
            if (doc.data()?.createdAt > (Timestamp.now().toMillis() - 12 * 60 * 60 * 1000)){
               dataValid = true;
            }
         });
         if (dataValid){
            return '';
         }
      }

      if (queryMsg.empty && queryUser.empty){
         return 'EmptyRoom';
      }

      await clearUsers();
      await clearMessages();
      await clearTypingUsers();
      await clearRecent();
      return 'EmptyRoom';
   }

   async function clearMessages() {
      const q = query(collection(db, "chat", roomid, "messages"), where("publiccode", "==", PUBLIC__CODE));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty){
         return;
      }

      querySnapshot.forEach(async(item) => {
         await deleteDoc(doc(db, "chat", roomid, "messages", item.id));
      });    
   }
    
   async function clearTypingUsers() {
      const q = query(collection(db, "chat", roomid, "typingusers"), where("publiccode", "==", PUBLIC__CODE));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty){
         return;
      }
      
      querySnapshot.forEach(async(item) => {
         await deleteDoc(doc(db, "chat", roomid, "typingusers", item.id));
      });    
   }

   async function clearRecent() {
      const q = query(collection(db, "chat", roomid, "recent"), where("publiccode", "==", PUBLIC__CODE));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty){
         return;
      }
   
      querySnapshot.forEach(async(item) => {
         await deleteDoc(doc(db, "chat", roomid, "recent", item.id));
      });    

      store.clear();
   }

   async function clearUsers() {
      try {

         const q = query(collection(db, "chat", roomid, "users"), where("publiccode", "==", PUBLIC__CODE));
         const querySnapshot = await getDocs(q);
         if (querySnapshot.empty){
            return;
         }
      
         querySnapshot.forEach(async(item) => {
            await deleteDoc(doc(db, "chat", roomid, "users", item.id));
         });
      }catch(error){
         console.error("Error found:", error);
      }
   }
    
   useEffect(() => {
      navigation.addListener('beforeRemove', async (event: any) => {
         if (!user){
            return;
         }
         
         try {
            await deleteDoc(doc(db, "chat", roomid, "users", user.id));
         
            //Check if collection of users is empty
            const q = query(collection(db, "chat", roomid, "users"), where("publiccode", "==", PUBLIC__CODE));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty){
               await clearMessages();
               await clearTypingUsers();
               await clearRecent();
            }else{
               const removeUser = {key: 'removeuser', id: user.id, publiccode: PUBLIC__CODE};
               await setDoc(doc(db, "chat", roomid, "recent", "removeuser"), removeUser);
               const storeKey = 'removeuser_' + roomid;
               store(storeKey, JSON.stringify(removeUser));
            }
         }catch(error){
            console.error("Error found:", error);
         }
      });
   },[navigation, user]);

   const sendMessage = async (messageBody: string) => {
      if (!messageBody) return;

      try {

         const sendUser = {...user};
         delete sendUser.publiccode;
         setMessages((prev: Message[]) => {
            const message = { id: 'temp', user: sendUser, body: messageBody, sentAt: Timestamp.now().toMillis() };
            return [...prev, message];
         });
         const msgBody = {user: sendUser, body: messageBody, sentAt: Timestamp.now().toMillis(), publiccode: PUBLIC__CODE };
         const docRef = await addDoc(collection(db, "chat", roomid, "messages"), msgBody);
         await setDoc(doc(db, "chat", roomid, "recent", "addmessage"), {key: 'addmessage', id: docRef.id, ...msgBody});
   
      }catch(error){
         console.error("Error found:", error);
      }
   };

   const startTypingMessage = async () => {
      if (!user) return;

      try {

         const userData = {...user};
         delete userData.id;
         await setDoc(doc(db, "chat", roomid, "typingusers", user.id), userData);

         const addedUser = {key: 'addtypinguser', ...user};
         await setDoc(doc(db, "chat", roomid, "recent", "addtypinguser"), addedUser);
         //Check the recent removed typinguser
         const storeKey = 'removetypinguser_' + roomid;
         const removedUser = JSON.parse(store(storeKey));
         if (removedUser?.id === user.id){
            store.remove(storeKey);
            await deleteDoc(doc(db, "chat", roomid, "recent", "removetypinguser"));
         }
      }catch(error){
         //console.error("Error found:", error);
      }
   };
 
   const stopTypingMessage = async () => {
      if (!user) return;
       
      try {
         await deleteDoc(doc(db, "chat", roomid, "typingusers", user.id));

         const removeUser = {key: 'removetypinguser', id: user.id, publiccode: PUBLIC__CODE};
         await setDoc(doc(db, "chat", roomid, "recent", "removetypinguser"), removeUser);
         const storeKey = 'removetypinguser_' + roomid;
         store(storeKey, JSON.stringify(removeUser));

      }catch(error){
         //console.error("Error found:", error);
      }
   };

   const handleSendMessage = () => {
      cancelTyping();
      sendMessage(newMessage);
      setNewMessage("");
      Keyboard.dismiss();
   };

   useEffect(() => {
      if (isTyping) startTypingMessage();
      else stopTypingMessage();
   }, [isTyping]);
    
   useEffect(() => {
      if (viewRef && viewRef?.current){
         setTimeout(() => {(viewRef?.current as any).scrollToEnd()}, 1);
      }
   });
    
   return (
      <KeyboardAwareScrollView
         contentContainerStyle={styles.container}
         keyboardShouldPersistTaps='handled'
         scrollEnabled={false}
         >
         <View style={styles.viewContainer}>
            <View style={styles.horizontalReverse}>
              {user &&
                <UserAvatar user={user} />
              }
            </View>
            <Users users={users?.filter((item) => item.id !== user?.id)}></Users>
            <View style={{height: 10}}></View>
            <ScrollView ref={viewRef}>
                {messages?.map((message) => 
                  <ChatMessage key={message.id} message={message} ownedByCurrentUser={message.user?.id === user?.id ? true: false} ></ChatMessage>
                )}
                {typingUsers?.filter((item) => item.id != user.id).map((user) => (
                   <TypingMessage key={user.id} user={user} />
                ))}
                <View style={{height: 10}}></View>
            </ScrollView>
         </View>
         <View style={{backgroundColor: 'white'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
               <TextInput
                  mode='outlined'
                  style={{width: '80%'}}
                  label="Message"
                  placeholder="Aa"
                  value={newMessage}
                  returnKeyType="next"
                  multiline={true}
                  onChangeText={(text) => {
                     const value = text.replace(/<\/?[^>]*>/g, "");
                     setNewMessage(value);
                  }}
                  onKeyPress={startTyping}
                  onEndEditing={cancelTyping}
                  />
               <TouchableHighlight onPress={() => { handleSendMessage(); }}>
                  <FontAwesome name="angle-double-right" color={"#444"} size={56} />
               </TouchableHighlight>
            </View>
            <View style={{height: 25}}></View>
         </View>
      </KeyboardAwareScrollView>    
   );
} 

export default ChatRoom;
