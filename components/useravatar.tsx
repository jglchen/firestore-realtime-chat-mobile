import {styles} from '../styles/useravatar';
import {Image} from 'react-native';
import {User} from '../lib/types';

interface PropsType {
   user: User
}

function UserAvatar({user}: PropsType){
   return (
      <Image 
         style={styles.avatar}
         source={{uri: user.picture}}
      />
   );
}

export default UserAvatar;