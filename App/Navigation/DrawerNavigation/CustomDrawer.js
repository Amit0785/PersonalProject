import React, {useState, useEffect, useContext} from 'react';

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApicall, postApiCall} from '../../Services/Network';
import Hud from '../../Screens/Common/Hud';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

import {ProfileContext} from '../../Services/ProfileProvider';

const CustomDrawer = props => {
  const {profileContextData} = useContext(ProfileContext);

  const [activeRoute, setRouteState] = useState(0);

  //const [name, setName] = useState('');
  const [userType, setUserType] = useState('');
  const [data, setData] = useState([]);

  const navigateToProfile = async () => {
    setRouteState(1);
    props.navigation.closeDrawer();
    props.navigation.navigate('Profile');
  };

  const navigateToListofQuestion = async () => {
    setRouteState(2);
    props.navigation.closeDrawer();

    if (profileContextData.user_type === 1) {
      props.navigation.navigate('ListOfQuestion');
    } else {
      props.navigation.navigate('ListOfQuestionCelebrity');
    }
  };

  const navigateToRequest = async () => {
    setRouteState(3);
    props.navigation.closeDrawer();
    props.navigation.navigate('AllRequest');
  };

  const navigateToTransaction = async () => {
    setRouteState(4);
    props.navigation.closeDrawer();
    props.navigation.navigate('Transactions');
  };

  const navigateToNotification = async () => {
    setRouteState(5);
    props.navigation.closeDrawer();
    props.navigation.navigate('NotificationSettingScreen');
  };

  const navigateToPrivacy = async () => {
    setRouteState(6);
    props.navigation.closeDrawer();
    props.navigation.navigate('PrivacyPolicy');
  };

  const navigateToTAndC = async () => {
    setRouteState(7);
    props.navigation.closeDrawer();
    props.navigation.navigate('TermAndCondition');
  };

  const navigateToFAQ = async () => {
    setRouteState(8);
    props.navigation.closeDrawer();
    props.navigation.navigate('FAQ');
  };

  const doLogout = () => {
    Alert.alert(
      //title
      'Logout',
      //body
      'Are you sure want to logout ?',
      [
        {text: 'Yes', onPress: () => navigateToLogout()},
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };

  const navigateToLogout = async () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        props.navigation.closeDrawer();
        props.navigation.replace('Login');
      });
    //await AsyncStorage.removeItem('token');
    //await AsyncStorage.removeItem('login');
    //await AsyncStorage.removeItem('profile');
  };

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
      {/* <StatusBar hidden /> */}

      <View
        style={{
          height: height * 0.23,
          width: '100%',
          backgroundColor: '#151143',
        }}>
        <View
          style={{
            width: '95%',
            alignItems: 'flex-end',
            marginTop: height * 0.01,
          }}>
          <TouchableOpacity
            style={{height: height * 0.05, width: width * 0.05}}
            onPress={() => props.navigation.closeDrawer()}>
            <Image
              source={require('../../Assets/Icon/close.png')}
              style={{height: '100%', width: '100%', tintColor: '#EBE0E5'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            //paddingTop: 10,
            //backgroundColor:'red'
          }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 100,
              marginLeft: '2%',
              //marginLeft: 10,
              //marginHorizontal: '5%',
              alignItems: 'center',
              //backgroundColor:'red'
            }}>
            <Image
              //source={require('../../Assets/Images/Img.png')}
              source={{uri: profileContextData.profile_image}}
              style={{height: '100%', width: '100%', borderRadius: 100}}
              resizeMode="cover"
            />
          </View>
          <View
            style={{marginLeft: 15, marginTop: 10, alignItems: 'flex-start'}}>
            <Text
              style={{
                fontSize: 15,
                color: '#7B7B7B',
                //fontFamily: 'Rubik',
                //fontWeight: '500',
                letterSpacing: 0.4,
              }}>
              Hi,
            </Text>
            <Text
              style={{
                fontSize: 25,
                color: '#FFFFFF',
                //fontFamily: 'Rubik',
                //fontWeight: '500',
                fontWeight: 'bold',
                letterSpacing: 0.4,
              }}>
              {profileContextData.name}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 10,
          marginLeft: 0,
          borderWidth: 0,
          //borderColor: 'blue',
          width: '100%',
          justifyContent: 'center',
          //marginTop: 30,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={navigateToProfile}
          style={
            activeRoute === 1 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 22,
              }}>
              <Image
                source={require('../../Assets/Icon/name1.png')}
                style={
                  activeRoute === 1
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <View>
            <Text
              style={
                activeRoute === 1
                  ? {...styles.textstyleSelected}
                  : {...styles.textstyle}
              }>
              My Account
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToListofQuestion}
          style={
            activeRoute === 2 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 20,
              }}>
              <Image
                source={require('../../Assets/Icon/list.png')}
                style={
                  activeRoute === 2
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          {profileContextData.user_type == 1 ? (
            <View>
              <Text
                style={
                  activeRoute === 2
                    ? {...styles.textstyleSelected}
                    : {...styles.textstyle}
                }>
                List of Questions
              </Text>
            </View>
          ) : (
            <View>
              <Text
                style={
                  activeRoute === 2
                    ? {...styles.textstyleSelected}
                    : {...styles.textstyle}
                }>
                List of Collective Questions
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {profileContextData.user_type != 1 ? (
          <TouchableOpacity
            onPress={navigateToRequest}
            style={
              activeRoute === 3
                ? styles.columnstyleSelected
                : styles.columnstyle
            }>
            <View style={styles.imgBox}>
              <View
                style={{
                  height: 20,
                  width: 30,
                  marginLeft: -7,
                }}>
                <Image
                  source={require('../../Assets/Icon/request.png')}
                  style={
                    activeRoute === 3
                      ? {width: '100%', height: '100%', tintColor: '#fff'}
                      : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                  }
                />
              </View>
            </View>

            <View>
              <Text
                style={
                  activeRoute === 3
                    ? {...styles.textstyleSelected}
                    : {...styles.textstyle}
                }>
                All Requests
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={navigateToTransaction}
          style={
            activeRoute === 4 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 20,
              }}>
              <Image
                source={require('../../Assets/Icon/wallet.png')}
                style={
                  activeRoute === 4
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          {profileContextData.user_type === 1 ? (
            <View>
              <Text
                style={
                  activeRoute === 4
                    ? {...styles.textstyleSelected}
                    : {...styles.textstyle}
                }>
                All Transactions
              </Text>
            </View>
          ) : (
            <View>
              <Text
                style={
                  activeRoute === 4
                    ? {...styles.textstyleSelected}
                    : {...styles.textstyle}
                }>
                Collective Transactions
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToNotification}
          style={
            activeRoute === 5 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 18,
              }}>
              <Image
                source={require('../../Assets/Icon/bell.png')}
                style={
                  activeRoute === 5
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <View>
            <Text
              style={
                activeRoute === 5
                  ? {...styles.textstyleSelected}
                  : {...styles.textstyle}
              }>
              Notifications Setting
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToPrivacy}
          style={
            activeRoute === 6 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 17,
              }}>
              <Image
                source={require('../../Assets/Icon/lock.png')}
                style={
                  activeRoute === 6
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <View>
            <Text
              style={
                activeRoute === 6
                  ? {...styles.textstyleSelected}
                  : {...styles.textstyle}
              }>
              Privacy Policy
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToTAndC}
          style={
            activeRoute === 7 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 17,
              }}>
              <Image
                source={require('../../Assets/Icon/t&c.png')}
                style={
                  activeRoute === 7
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <View>
            <Text
              style={
                activeRoute === 7
                  ? {...styles.textstyleSelected}
                  : {...styles.textstyle}
              }>
              Terms & conditions
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToFAQ}
          style={
            activeRoute === 8 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={{...styles.imgBox}}>
            <View
              style={{
                height: 21,
                width: 22,
              }}>
              <Image
                source={require('../../Assets/Icon/faq.png')}
                style={
                  activeRoute === 8
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <View>
            <Text
              style={
                activeRoute === 8
                  ? {...styles.textstyleSelected}
                  : {...styles.textstyle}
              }>
              FAQ’s
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            width: width * 0.7,
            height: height * 0.002,
            backgroundColor: '#B19DA7',
            marginTop: height * 0.05,
          }}
        />

        <TouchableOpacity onPress={() => doLogout()} style={styles.columnstyle}>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 22,
              }}>
              <Image
                source={require('../../Assets/Icon/logout.png')}
                style={{width: '100%', height: '100%'}}
              />
            </View>
          </View>

          <View>
            <Text
              style={{
                fontSize: RFValue(22),
                color: '#E92D87',
                fontWeight: 'bold',
              }}>
              Log out
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  columnstyleSelected: {
    alignSelf: 'center',
    marginTop: '1.5%',
    width: width * 0.72,
    height: height * 0.08,
    borderRadius: 10,
    alignItems: 'center',
    //justifyContent:'center',
    flexDirection: 'row',
    backgroundColor: '#EE4897',
  },

  columnstyle: {
    alignSelf: 'center',
    marginTop: '1.5%',
    width: width * 0.72,
    height: height * 0.08,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },

  textstyle: {
    //fontFamily: 'WorkSans-Medium',
    fontSize: 16,
    color: '#8F99A8',
    fontWeight: '400',
    // borderColor: 'black',
    // borderWidth: 1,
  },
  textstyleSelected: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',

    //fontFamily: 'WorkSans-Medium',
  },
  imgBox: {
    width: 55,
    height: 30,
    //paddingLeft: 15,
    //borderWidth: 1,
    //borderColor: 'red',
    marginRight: width * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
