import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    viewContainer: {
      flex: 1,
      paddingTop: 10,
      paddingHorizontal: 5,
    },
    horizontalView: {
      width: "100%",
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 10,
    },
    horizontalReverse: {
      width: "100%",
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingBottom: 10,
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold'
    }, 
    subTitleText: {
      fontSize: 18,
      fontWeight: 'bold'
    },
    inputTextContainer: {
      borderColor: 'grey',
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      marginTop: 10
    },
    inputText: {
      //width: '100%',
      //minHeight: 25,
      //fontSize: 16,
      padding: 10,
      minHeight: 25,
      fontSize: 16,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: '#888',
      marginTop: 10
    }, 
});
