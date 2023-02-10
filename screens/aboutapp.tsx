import { SafeAreaView, 
    KeyboardAvoidingView, 
    Platform,
    Linking,
    View,
    Text,
    ScrollView
} from 'react-native';
import { styles } from '../styles/css';

interface PropsType {
    navigation: any
}

export default function AboutApp({ navigation }: PropsType) {

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView  
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={{marginBottom: 10}}>
                        <Text style={{fontSize: 18, lineHeight: 24}}>
                        This is a react native(mobile) version of <Text style={{color: 'blue', fontWeight: 'bold'}} onPress={() => Linking.openURL('https://firestore-realtime-chat.vercel.app')}>Chat Applications with Cloud Firestore</Text>, a real-time chat application with <Text style={{color: 'blue', fontWeight: 'bold'}} onPress={() => Linking.openURL('https://firebase.google.com/products/firestore')}>Firebase Cloud FireStore</Text>.
                        </Text>
                    </View> 
              </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

}    
