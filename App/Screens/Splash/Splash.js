import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const Splash = props => {
  useEffect(() => {
    setTimeout(() => {
      //props.navigation.navigate('Login');
      unsubscribe();
    }, 3000);
  }, []);

  const unsubscribe = async () => {
    //props.navigation.replace('Login');
    // const token = await AsyncStorage.getItem('token');

    // if (token === null) {
    //   props.navigation.replace('Login');
    // } else {
    //   props.navigation.replace('MyDrawer');
    // }

    auth.onAuthStateChanged(user => {
      if (user) {
        props.navigation.replace('MyDrawer');
      } else {
        props.navigation.replace('Login');
      }
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <View
        style={{
          width: '100%',
          height: '50%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={styles.stretch}
          source={require('../../Assets/Icon/Logo.png')}
        />
      </View>
    </SafeAreaView>

    // <SafeAreaView style={{flex:1,}}>

    // <Image style={{height:height,width:width,}}
    //     source={require('../../Assets/Icon/splash.jpg')}
    // />

    // </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  stretch: {
    width: '50%',
    height: '30%',
    resizeMode: 'contain',
  },
});
