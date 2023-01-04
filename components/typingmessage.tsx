import { TypingAnimation } from 'react-native-typing-animation';
import UserAvatar from './useravatar';
import {View} from 'react-native';
import { styles } from '../styles/css';
import {User} from '../lib/types';

interface PropsType {
   user: User
}

const TypingMessage = ({ user }: PropsType) => {
   return (
      <View style={styles.horizontalView}>
          <View style={{marginRight: 5}}>
              <UserAvatar user={user} />
          </View>  
          <TypingAnimation dotColor="grey" dotY={0}  />
      </View>
   );
};
  
export default TypingMessage;
