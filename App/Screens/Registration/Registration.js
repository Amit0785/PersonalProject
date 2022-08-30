import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import RadioForm from 'react-native-simple-radio-button';

import {RFValue} from 'react-native-responsive-fontsize';

//import {base_url} from '../../Services/constants';
import axios from 'axios';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';

const {width, height} = Dimensions.get('window');

const Registration = props => {
  const nameRef = useRef();
  const userNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const confirmPassRef = useRef();

  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [userType, setUserType] = useState('User');
  const [value, setValue] = useState(0);
  var choice = [
    {label: 'User', value: 0},
    {label: 'Celebrity', value: 1},
  ];

  const userHandler = val => {
    if (val === 0) {
      setValue(val);
      setUserType('User');
    } else if (val === 1) {
      setValue(val);
      setUserType('Celebrity');
    }
  };

  const [shownName, setShownName] = useState(false);
  const [shownUserName, setShownUserName] = useState(false);
  const [shownEmail, setShownEmail] = useState(false);
  const [shownPhone, setShownPhone] = useState(false);
  const [shownPassword, setShownPassword] = useState(false);
  const [shownConfirmPassword, setShownConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState({
    isName: true,
    isValidEmail: true,
    isPhone: true,
    isValidPassword: true,
    isConfirmPassword: true,
    isUserName: true,
  });

  const nameHandler = value => {
    setName(value);
    setShownName(true);
    //console.log(name);
  };
  const userNameHandler = value => {
    setUserName(value);
    setShownUserName(true);
    //console.log(userName);
  };

  const emailHandler = value => {
    setEmail(value);
    setShownEmail(true);
    //console.log(email);
  };

  const validateEmail = value => {
    const regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (regExp.test(value) === false) {
      return false;
    } else {
      return true;
    }
  };

  const phoneHandler = value => {
    setPhone(value);
    setShownPhone(true);
    //console.log(phone);
  };

  const passwordHandler = value => {
    setPassword(value);
    setShownPassword(true);
    //console.log(password);
  };

  const confirmPasswordHandler = value => {
    setConfirmPassword(value);
    setShownConfirmPassword(true);
    //console.log(confirmPassword);
  };

  const handleSubmit = async () => {
    if (name.trim() == '') {
      return setErrorMsg({...errorMsg, isName: false});
    } else if (userName.trim() == '') {
      return setErrorMsg({...errorMsg, isUserName: false});
    } else if (!validateEmail(email)) {
      return setErrorMsg({...errorMsg, isValidEmail: false});
    } else if (password.trim().length < 8) {
      return setErrorMsg({...errorMsg, isValidPassword: false});
    } else if (password != confirmPassword) {
      return setErrorMsg({...errorMsg, isConfirmPassword: false});
    } else if (phone.trim() == '') {
      return setErrorMsg({...errorMsg, isPhone: false});
    } else {
      //setLoading(true);
      Hud.showHud();

      const registrationData = {
        name: name,
        email: email,
        password: password,
        confirm_password: confirmPassword,
        //user_type: userType,
        user_type: value + 1,
        mobile_number: phone,
        username: userName,
      };
      console.log('data====>', registrationData);
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <KeyboardAvoidingScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#ffffff', width: width * 0.9}}>
        <View style={{backgroundColor: '#FFFFFF', alignItems: 'center'}}>
          <View style={{marginTop: height * 0.1, marginBottom: height * 0.03}}>
            <Text style={{fontSize: RFValue(40), fontWeight: 'bold'}}>
              Sign Up
            </Text>
          </View>

          <View style={shownName ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={nameRef}
                onChangeText={value => nameHandler(value)}
                placeholder="Name"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => {
                  userNameRef.current.focus();
                }}
                style={styles.input}
              />
            </View>

            <View
              style={{
                height: height * 0.05,
                width: width * 0.05,
                alignSelf: 'center',
                marginRight: 8,
              }}>
              <Image
                source={require('../../Assets/Icon/name.png')}
                style={
                  shownName
                    ? {...styles.imagesty, tintColor: 'black'}
                    : {...styles.imagesty, tintColor: '#B19DA7'}
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isName && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter Name
            </Text>
          )}

          <View style={shownUserName ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={userNameRef}
                onChangeText={value => userNameHandler(value)}
                placeholder="UserName"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailRef.current.focus();
                }}
                style={styles.input}
              />
            </View>

            <View
              style={{
                height: height * 0.05,
                width: width * 0.05,
                alignSelf: 'center',
                marginRight: 8,
              }}>
              <Image
                source={require('../../Assets/Icon/name.png')}
                style={
                  shownUserName
                    ? {...styles.imagesty, tintColor: 'black'}
                    : {...styles.imagesty, tintColor: '#B19DA7'}
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isUserName && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter unique UserName
            </Text>
          )}

          <View style={shownEmail ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={emailRef}
                onChangeText={value => emailHandler(value)}
                placeholder="Email"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => {
                  phoneRef.current.focus();
                }}
                style={styles.input}
              />
            </View>

            <View
              style={{
                height: height * 0.05,
                width: width * 0.05,
                alignSelf: 'center',
                marginRight: 8,
              }}>
              <Image
                source={require('../../Assets/Icon/reg_message.png')}
                style={
                  shownEmail
                    ? {...styles.imagesty, tintColor: 'black'}
                    : styles.imagesty
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isValidEmail && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter valid email
            </Text>
          )}

          <View style={shownPhone ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={phoneRef}
                onChangeText={value => phoneHandler(value)}
                placeholder="Phone"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                keyboardType="numeric"
                maxLength={10}
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordRef.current.focus();
                }}
                style={styles.input}
              />
            </View>

            <View
              style={{
                height: height * 0.038,
                width: width * 0.05,
                alignSelf: 'center',
                marginRight: 8,
              }}>
              <Image
                source={require('../../Assets/Icon/mobile.png')}
                style={
                  shownPhone
                    ? {...styles.imagesty, tintColor: 'black'}
                    : styles.imagesty
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isPhone && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter valid Phone number
            </Text>
          )}

          <View style={shownPassword ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={passwordRef}
                secureTextEntry={true}
                onChangeText={value => passwordHandler(value)}
                placeholder="Password"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPassRef.current.focus();
                }}
                style={styles.input}
              />
            </View>

            <View
              style={{
                height: height * 0.03,
                width: width * 0.05,
                alignSelf: 'center',
                marginRight: 10,
              }}>
              <Image
                source={require('../../Assets/Icon/lock.png')}
                style={
                  shownPassword
                    ? {...styles.imagesty, tintColor: 'black'}
                    : styles.imagesty
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isValidPassword && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter valid Password
            </Text>
          )}

          <View
            style={
              shownConfirmPassword ? styles.divisionSelect : styles.division
            }>
            <View style={styles.input}>
              <TextInput
                ref={confirmPassRef}
                secureTextEntry={true}
                onChangeText={value => confirmPasswordHandler(value)}
                placeholder="Confirm Password"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                style={styles.input}
              />
            </View>

            <View
              style={{
                height: height * 0.03,
                width: width * 0.05,
                alignSelf: 'center',
                marginRight: 10,
              }}>
              <Image
                source={require('../../Assets/Icon/lock.png')}
                style={
                  shownConfirmPassword
                    ? {...styles.imagesty, tintColor: 'black'}
                    : styles.imagesty
                }
                resizeMode="contain"
              />
            </View>
          </View>

          {!errorMsg.isConfirmPassword && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter valid Password
            </Text>
          )}

          <View style={{width: width * 0.75, marginTop: height * 0.03}}>
            <Text style={{color: '#8E7B85', fontSize: RFValue(20)}}>
              User Type
            </Text>

            <View style={{marginVertical: height * 0.03}}>
              <RadioForm
                radio_props={choice}
                initial={0}
                onPress={val => userHandler(val)}
                buttonSize={12}
                buttonOuterSize={20}
                buttonColor={'#EBE0E5'}
                selectedButtonColor={'#E92D87'}
                //buttonInnerColor={'#EBE0E5'}
                labelHorizontal={true}
                labelStyle={{
                  fontSize: RFValue(20),
                  marginRight: 20,
                  color: '#151143',
                }}
                disabled={false}
                formHorizontal={true}
              />
            </View>
          </View>

          <View
            style={{width: width * 0.8, height: 50, marginTop: height * 0.02}}>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: '#E92D87',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => handleSubmit()}>
              <Text style={{fontSize: 19, color: '#FFFFFF'}}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: height * 0.07,
              width: width * 0.8,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: height * 0.01,
              marginBottom: height * 0.05,
            }}>
            <Text style={{fontSize: RFValue(18), color: '#8A8A8A'}}>
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Login')}>
              <Text
                style={{
                  color: '#E92D87',
                  fontSize: RFValue(19),
                  fontWeight: 'bold',
                  marginLeft: 5,
                }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  division: {
    width: width * 0.8,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.025,
    paddingLeft: 10,
  },

  divisionSelect: {
    width: width * 0.8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E92D87',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.025,
    paddingLeft: 10,
  },

  input: {
    flex: 1,
    color: '#151143',
  },

  imagesty: {width: '100%', height: '100%'},
});
