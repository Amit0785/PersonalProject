import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {ProfileContext} from '../../Services/ProfileProvider';

const {width, height} = Dimensions.get('window');

const Splash = props => {
  const {setProfileContextData, setnotificationStatusContextData} =
    useContext(ProfileContext);

  useEffect(() => {
    setTimeout(() => {
      //props.navigation.navigate('Login');
      subscribe();
    }, 3000);
  }, []);

  const subscribe = async () => {
    auth.onAuthStateChanged(userExist => {
      if (userExist) {
        console.log('userValue===>', userExist);
        firestore().collection('users').doc(userExist.uid).update({
          status: 'online',
        });
        setProfileContextData(userExist);
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
