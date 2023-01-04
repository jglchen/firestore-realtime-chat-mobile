import UserView from './userview';
import {View, Text} from 'react-native';
import {styles} from '../styles/css';
import {User} from '../lib/types';

interface PropsType {
   users: User[]
}

function Users({users}: PropsType){
   if (users.length == 0){
      return (
        <View style={styles.horizontalView}>
            <Text style={{fontSize: 18}}>There is no one else in this room</Text>
        </View>
      );
   }
   return (
      <>
        <View style={styles.horizontalView}>
          <Text style={styles.titleText}>Also in this room:</Text>
        </View>
        <View style={[styles.horizontalView,{flexWrap: 'wrap'}]}>
           {users.map((user) => 
              <UserView key={user.id} user={user} />
            )
           }
        </View>
      </> 
   )
}

export default Users;
