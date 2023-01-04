import UserAvatar from './useravatar';
import {View, Text, StyleSheet} from 'react-native';
import getDateString from '../lib/getdatestring';
import { styles } from '../styles/css';
import { Message } from '../lib/types';

interface PropsType {
  message: Message;
  ownedByCurrentUser: boolean;
}

const ChatMessage = ({ message, ownedByCurrentUser }: PropsType) => {

   return (
      <View style={ownedByCurrentUser ? styles.horizontalReverse : styles.horizontalView}>
          {!ownedByCurrentUser && (
              <View style={{marginRight: 5}}>
                  <UserAvatar user={message.user!} />
              </View>  
          )}
          <View style={{maxWidth: '60%'}}>
              <Text style={{color: 'grey'}}>
                 {!ownedByCurrentUser && message.user?.name + ' @ '}{getDateString(message.sentAt)}
              </Text>
              <View style={[msgStyles.messageBody, (ownedByCurrentUser ? msgStyles.myMessage : msgStyles.receivedMessage)]}>
                 <Text style={ownedByCurrentUser ? msgStyles.myMsgText : msgStyles.receivedMsgText}>{message.body}</Text>
              </View>
          </View>
      </View>
   );

};

const msgStyles = StyleSheet.create({
  messageBody: {
    borderRadius: 3,
    paddingVertical: 6,
    paddingHorizontal: 6
  },
  myMessage: {
    backgroundColor: 'rgb(0, 132, 255)',
  },
  myMsgText: {
    fontSize: 18,
    color: 'white'
  },
  receivedMessage: {
    backgroundColor: 'rgb(228, 230, 235)',
  },
  receivedMsgText: {
    fontSize: 18,
    color: 'rgb(5, 5, 5)'
  },
});
  
export default ChatMessage;