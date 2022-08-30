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
  Modal,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';

import {RFValue} from 'react-native-responsive-fontsize';
//import {base_url} from '../../Services/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
// import {
//   AccessToken,
//   GraphRequest,
//   GraphRequestManager,
//   LoginManager,
//   Profile,
// } from 'react-native-fbsdk-next';

import RadioForm from 'react-native-simple-radio-button';

//import {postApiCall} from '../../Services/Network';

//import {AuthContext} from '../../Services/Context';
import axios from 'axios';

const {width, height} = Dimensions.get('window');

const Login = props => {
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  const emailRef = useRef();
  const passwordRef = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shownEmail, setShownEmail] = useState(false);
  const [shownPassword, setShownPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [shownUserName, setShownUserName] = useState(false);
  const [facebookData, setFacebookData] = useState([]);
  //const [showModal, setShowModal] = useState(true);
  const [errorMsg, setErrorMsg] = useState({
    isValidEmail: true,
    isValidPassword: true,
    isValidUser: true,
  });

  const [value, setValue] = useState(1);
  var choice = [
    {label: 'User', value: 0},
    {label: 'Celebrity', value: 1},
  ];

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const validateEmail = value => {
    const regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (regExp.test(value) === false) {
      return false;
    } else {
      return true;
    }
  };

  const emailHandler = value => {
    setShownEmail(true);
    if (value.trim() !== '') {
      setEmail(value.trim());
      setErrorMsg({
        ...errorMsg,
        isValidEmail: true,
      });
    } else {
      setErrorMsg({
        ...errorMsg,
        isValidEmail: false,
      });
    }
  };

  const userHandler = val => {
    setValue(val + 1);

    console.log('Value==>', val);
    if (val === 0) {
      //setUserType('User');
    } else if (val === 1) {
      //setUserType('Celebrity');
    }
  };

  const passwordHandler = value => {
    setShownPassword(true);
    if (value.trim() !== '' || value.trim().length > 8) {
      setPassword(value.trim());
      setErrorMsg({
        ...errorMsg,
        isValidPassword: true,
      });
    } else {
      setErrorMsg({
        ...errorMsg,
        isValidPassword: false,
      });
    }
  };

  const onSignIn = async () => {
    if (!validateEmail(email)) {
      return setErrorMsg({...errorMsg, isValidEmail: false});
    } else if (password.trim().length < 8) {
      return setErrorMsg({...errorMsg, isValidPassword: false});
    } else {
      let deviceToken = await AsyncStorage.getItem('fcm_token');
      //console.log('Device Token==>', deviceToken);
      Hud.showHud();
      const loginData = {
        email: email,
        password: password,
        device_token: deviceToken,
      };
      console.log('login data==>', loginData);

      auth()
        .signInWithEmailAndPassword(email, password)
        .then(userCredentials => {
          console.log('User account signed in!', userCredentials);

          const user = userCredentials.user;
          props.navigation.replace('MyDrawer');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }

          console.error(error);
        });
    }
  };

  const loginWithFacebook = async () => {
    console.log('Facebook Login');
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('==> Login cancelled');
        } else {
          console.log(
            '==> Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          AccessToken.getCurrentAccessToken().then(data => {
            console.log('Facebook data====>', data);
            console.log(
              'Facebook Access data====>',
              data.accessToken.toString(),
            );
            const accessToken = data.accessToken.toString();
            getInfoFromToken(accessToken);
          });

          // AccessToken.getCurrentAccessToken().then(data => {
          //   console.log('Facebook data====>', data);
          //   console.log(
          //     'Facebook Access data====>',
          //     data.accessToken.toString(),
          //   );
          //   let accessToken = data.accessToken;
          //   //alert(accessToken.toString());

          //   const responseInfoCallback = (error, result) => {
          //     if (error) {
          //       console.log(error);
          //       alert('Error fetching data: ' + error.toString());
          //     } else {
          //       console.log('Success fetching data: ', result);
          //       //alert('Success fetching data: ' + result.toString());
          //     }
          //   };

          //   const infoRequest = new GraphRequest(
          //     '/me',
          //     {
          //       accessToken: accessToken,
          //       parameters: {
          //         fields: {
          //           string: 'email,name,first_name,middle_name,last_name',
          //         },
          //       },
          //     },
          //     responseInfoCallback,
          //   );

          //   // Start the graph request.
          //   new GraphRequestManager().addRequest(infoRequest).start();
          // });
        }
      },
      function (error) {
        console.log('==> Login fail with error: ' + error);
      },
    );
  };

  const getInfoFromToken = token => {
    console.log('Facebook token===>', token);
    fetch(
      'https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' +
        token,
    )
      .then(response => response.json())
      .then(async json => {
        console.log('facebook data json ====>', json);
        setFacebookData(json);
        //setShowModal(true);
        Hud.showHud();
        const facebookData1 = {
          email: json.email,
        };
        // await axios
        //   .post(`${base_url}checkuser`, facebookData1)
        //   .then(res => {
        //     console.log(res.data.data);

        //     if (res.status === 200) {
        //       console.log('data length==>', res.data.data.length);
        //       console.log('json==>', json);
        //       if (
        //         res.data.data.length != 0 &&
        //         res.data.data.length != null &&
        //         res.data.data.length != undefined
        //       ) {
        //         console.log('Json data=>', json.name, json.id, json.email);
        //         console.log(
        //           'res data=>',
        //           res.data.data[0].username,
        //           res.data.data[0].user_type,
        //         );

        //         facebookLogin(
        //           json.email,
        //           json.name,
        //           res.data.data[0].username,
        //           res.data.data[0].user_type,
        //           json.id,
        //         );
        //       } else {
        //         Hud.hideHud();
        //         setShowModal(true);
        //       }
        //     } else {
        //       console.log('Error during checking user');
        //     }
        //   })
        //   .catch(function (error) {
        //     console.log('error==>', error);
        //     // Request made and server responded

        //     Hud.hideHud();
        //     if (error.response) {
        //       console.log('response error===>', error.response.data);
        //       var myobj = error.response.data;
        //       var firstItem = Object.values(myobj)[0];
        //       console.log('====>firstItem', firstItem);

        //       Toast.show({
        //         type: 'error',
        //         text1: error.response.data.message,
        //       });
        //     } else if (error.request) {
        //       // The request was made but no response was received
        //       console.log('Request Error==>', error.request);
        //     } else {
        //       // Something happened in setting up the request that triggered an Error
        //       console.log('Error', error.message);
        //     }
        //   });
      })
      .catch(err => {
        console.log('ERROR GETTING DATA FROM FACEBOOK', err);
      });
  };

  const userNameHandler = value => {
    setUserName(value);
    setShownUserName(true);
  };

  const facebookLogin = async (
    email,
    name,
    username,
    user_type,
    facebook_id,
  ) => {
    let deviceToken = await AsyncStorage.getItem('fcm_token');
    Hud.showHud();
    const facebookLoginData = {
      email: email,
      name: name,
      username: username,
      user_type: user_type,
      facebook_id: facebook_id,
      device_token: deviceToken,
    };
    console.log('data===>', facebookLoginData);

    // await axios
    //   .post(`${base_url}facebooklogin`, facebookLoginData)
    //   .then(async response => {
    //     console.log('login response Data==>', response.data.data);
    //     console.log('token------------>', response.data.data.token);
    //     Hud.hideHud();
    //     if (response.status == 200) {
    //       AsyncStorage.setItem('token', response.data.data.token);
    //       AsyncStorage.setItem('userType', JSON.stringify(user_type));
    //       //console.log('login token=======>', response.data.data.token);
    //       Toast.show({
    //         type: 'success',
    //         text1: response.data.message,
    //       });
    //       props.navigation.replace('MyDrawer');
    //     } else {
    //       console.log('Error during Facebook Login', response.status);
    //     }
    //   })
    //   .catch(function (error) {
    //     // Request made and server responded

    //     Hud.hideHud();
    //     if (error.response) {
    //       console.log('response error===>', error.response.data);
    //       Toast.show({
    //         type: 'error',
    //         text1: 'This email is already registered using password',
    //         text2: 'Please use your valid credentials for Login',
    //       });
    //     } else if (error.request) {
    //       // The request was made but no response was received
    //       console.log('Request Error==>', error.request);
    //     } else {
    //       // Something happened in setting up the request that triggered an Error
    //       console.log('Error', error.message);
    //     }
    //   });
  };

  const facebookRegistration = async () => {
    console.log('Facebook Registration');
    if (userName.trim() === '') {
      setErrorMsg({...errorMsg, isValidUser: false});
    } else {
      setShowModal(false);
      facebookLogin(
        facebookData.email,
        facebookData.name,
        userName,
        value,
        facebookData.id,
      );
    }
  };

  const onRegistration = async () => {
    if (!validateEmail(email)) {
      return setErrorMsg({...errorMsg, isValidEmail: false});
    } else if (password.trim().length < 8) {
      return setErrorMsg({...errorMsg, isValidPassword: false});
    } else {
      let deviceToken = await AsyncStorage.getItem('fcm_token');
      //console.log('Device Token==>', deviceToken);
      Hud.showHud();
      const loginData = {
        email: email,
        password: password,
        device_token: deviceToken,
      };
      console.log('login data==>', loginData);

      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
          console.log('User account created & signed in!', userCredentials);

          const user = userCredentials.user;
          props.navigation.replace('MyDrawer');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }

          console.error(error);
        });
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View style={{flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center'}}>
        <View style={{marginTop: height * 0.1}}>
          <Text style={{fontSize: RFValue(40), fontWeight: 'bold'}}>
            Sign In
          </Text>
        </View>

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
                passwordRef.current.focus();
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

        <View style={shownPassword ? styles.divisionSelect : styles.division}>
          <View style={styles.input}>
            <TextInput
              ref={passwordRef}
              onChangeText={value => passwordHandler(value)}
              placeholder="Password"
              secureTextEntry={true}
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
            Please enter valid password
          </Text>
        )}

        <TouchableOpacity
          style={{alignSelf: 'center', margin: height * 0.03}}
          onPress={() => props.navigation.navigate('ForgotPassword')}>
          <Text
            style={{
              fontSize: RFValue(20),
              fontWeight: '400',
              color: '#151143',
            }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <View
          style={{width: width * 0.8, height: 50, marginTop: height * 0.03}}>
          <TouchableOpacity
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: '#E92D87',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => onSignIn()}>
            <Text style={{fontSize: 19, color: '#FFFFFF'}}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={{margin: height * 0.03}}>
          <Text style={{fontSize: 20, color: '#8E8E8E'}}>or</Text>
        </View>

        {/* <View style={{width: width * 0.8, height: 50}}> */}
        <TouchableOpacity
          style={{
            // height: '100%',
            // width: '100%',
            width: width * 0.8,
            height: 50,
            backgroundColor: '#EBE0E5',
            borderRadius: 10,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
          onPress={() => loginWithFacebook()}>
          <View style={{height: 30, width: 30}}>
            <Image
              source={require('../../Assets/Icon/facebook.png')}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          </View>

          <Modal
            visible={showModal}
            //visible={true}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={() => {
              setShowModal(false);
            }}>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  width: width * 0.9,
                  height: height * 0.5,
                  alignItems: 'center',
                  //justifyContent: 'center',
                  //marginTop: height * 0.3,
                  borderRadius: 10,
                  alignSelf: 'center',
                  paddingHorizontal: 5,
                }}>
                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View />
                  <Text
                    style={{
                      color: '#000',
                      fontSize: RFValue(22),
                      fontWeight: 'bold',
                      // backgroundColor: 'red',
                      alignSelf: 'flex-end',
                    }}>
                    Other Details
                  </Text>

                  <TouchableOpacity
                    style={{
                      height: height * 0.06,
                      width: width * 0.06,
                      alignSelf: 'flex-end',
                    }}
                    onPress={() => setShowModal(false)}>
                    <Image
                      source={require('../../Assets/Icon/close.png')}
                      style={{
                        height: '100%',
                        width: '100%',
                        tintColor: '#000',
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={
                    shownUserName ? styles.divisionSelect : styles.division
                  }>
                  <View style={styles.input}>
                    <TextInput
                      onChangeText={value => userNameHandler(value)}
                      placeholder="UserName"
                      //style={[styles.textInput]}
                      placeholderTextColor={'#8E7B85'}
                      autoCorrect={false}
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
                {!errorMsg.isValidUser && (
                  <Text
                    style={{
                      color: 'red',
                      fontSize: RFValue(15),
                      textAlign: 'center',
                      width: '100%',
                    }}>
                    Please enter unique Username
                  </Text>
                )}

                <View
                  style={{
                    width: width * 0.75,
                    marginTop: height * 0.03,
                    alignSelf: 'center',
                  }}>
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
                <TouchableOpacity
                  onPress={() => {
                    facebookRegistration();
                  }}
                  style={{
                    position: 'absolute',
                    bottom: 15,
                    width: 150,
                    height: 50,
                    backgroundColor: '#E92D87',
                    alignSelf: 'center',
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: '#FFFFFF',
                      fontFamily: 'Roboto-Medium',
                      fontWeight: '500',
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View>
            <Text style={{fontSize: 17, color: '#000', fontWeight: 'bold'}}>
              Continue with Facebook
            </Text>
          </View>

          <View></View>
        </TouchableOpacity>
        {/* </View> */}

        <View
          style={{
            flexDirection: 'row',
            height: height * 0.07,
            width: width * 0.8,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: height * 0.01,
          }}>
          <Text style={{fontSize: RFValue(18), color: '#8A8A8A'}}>
            Don’t have an account?
          </Text>
          <TouchableOpacity
            //onPress={() => props.navigation.navigate('Registration')}
            onPress={() => {
              onRegistration();
            }}>
            <Text
              style={{
                color: '#E92D87',
                fontSize: RFValue(19),
                fontWeight: 'bold',
                marginLeft: 5,
              }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  division: {
    width: width * 0.8,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.05,
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
    marginTop: height * 0.05,
    paddingLeft: 10,
  },

  input: {
    flex: 1,
    color: '#151143',
  },

  icon: {},

  imagesty: {width: '100%', height: '100%'},
});
