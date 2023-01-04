import UserAvatar from './useravatar';
import {View, Text} from 'react-native';
import {User} from '../lib/types';

interface PropsType {
   user: User
}

function UserView({user}: PropsType){
   return (
      <View style={{flexDirection: 'column', alignItems: 'center', marginRight: 10}}>
           <Text style={{color: 'grey'}}>{user.name}</Text>
           <UserAvatar user={user} />
      </View>
   );
} 

export default UserView;
