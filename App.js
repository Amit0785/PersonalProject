import {Text, View, SafeAreaView, AppState} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';

import StackNavigation from './App/Navigation/StackNavigation/StackNavigation';

import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import Hud from './App/Screens/Common/Hud';

import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {localNotificationService} from './App/Services/Notification/PushController';
import {fcmService} from './App/Services/Notification/FcmService';
import {NotificationProvider} from './App//Services/Notification/NotificationContext';

import NetworkError from './App/Services/NetworkError';
import {ProfileProvider} from './App/Services/ProfileProvider';

//const store = configReduxStore();

const App = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  //const [socket, setSocket] = useState(null);
  const [netStatus, setNet] = useState(true);
  const [unread, setUnread] = useState('N');

  //const store = reduxStore();

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    ConfigureFirebase();
    //Checking live status of internet connection
    NetInfo.addEventListener(state => {
      //console.log('Netinfo status==>', state.isConnected);
      setNet(state.isConnected);
      //console.log('NetStatus===>', netStatus);
    });

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  // const createConnection = async () => {
  //   const userToken = await AsyncStorage.getItem('token');
  //   const token1 = JSON.parse(userToken);
  //   console.log('App.js(Token)===>', token1);

  //   if (token1 != null && token1 != '' && token1 != 'null') {
  //     setSocket({
  //       socket: io(SOCKET_URL, {
  //         query: {token: token1, forceNew: true},
  //       }),
  //     });

  //     if (socket != null) {
  //       console.log('App.js(OKKKK)===>');
  //       console.log('App.js(state.socket)====>', socket);
  //       socket.on('connected', data => {
  //         console.log('App.js(Connected)===>', data);
  //         if (socket.connected) {
  //           console.log('App.js(hiiiii)===>');
  //           //this.getAllChatMessage()
  //         } else {
  //           console.log('App.js(ggg)===>');
  //         }
  //       });

  //       socket.on('online', data => {
  //         console.log('App.js(online user)===>', data);
  //       });
  //       socket.on('offline', data => {
  //         console.log('App.js(offline user)===>', data);
  //       });

  //       socket.on('receiveMessage', data => {
  //         console.log('App.js(reciveMessage)===>' + JSON.stringify(data));
  //       });
  //     }
  //   } else {
  //   }
  // };

  // const createConnectionAfterLogin = async () => {
  //   createConnection();
  // };

  // const disconnectSocket = async () => {
  //   if (socket != null) {
  //     console.log('App.js(socket)===>', 'not null');

  //     //this.state.socket.disconnect();
  //     socket.emit('logout');
  //     // this.setState({
  //     //   socket: null,
  //     // });
  //     console.log('App.js(socket)===>', 'disconnect');
  //   } else {
  //     console.log('App.js(socket)===>', ' null');
  //   }
  // };

  // const disconnectSocketBack = async () => {
  //   if (socket != null) {
  //     console.log('App.js(SOCKET NOT NULL)===>');
  //     socket.on('disconnect', data => {
  //       console.log('App.js(disconnect)===>', data);
  //     });
  //   } else {
  //     console.log('App.js(socket)===>', ' null');
  //   }
  //   console.log('App.js(socket)===>', 'disconnect');
  // };

  // const checkConnectedOrNot = async () => {
  //   if (socket != null) {
  //     console.log('App.js(SOCKET NOT NULL)===>');
  //     socket.on('connected', data => {
  //       console.log('App.js(connected)===>', data);
  //       if (socket.connected) {
  //         console.log('App.js(hihi)===>');
  //       } else {
  //         console.log('App.js(ggg)===>');
  //       }
  //     });
  //   } else {
  //     console.log('App.js(SOCKET  NULL)===>');
  //   }
  // };

  const ConfigureFirebase = async () => {
    // console.log(firebase.apps.length, 'firebase')
    const androidCredentials = {
      apiKey: 'AIzaSyCYFcoiYAlJs7TC8-krjY9OCXrUiS9o43Q',
      authDomain: 'personalproject-f964e.firebaseapp.com',
      projectId: 'personalproject-f964e',
      databaseURL: 'https://personalproject-f964e-default-rtdb.firebaseio.com',
      storageBucket: 'personalproject-f964e.appspot.com',
      messagingSenderId: '734215870365',
      appId: '1:734215870365:android:f328f9aeb7eda58e384174',
      measurementId: '',
    };

    // Your secondary Firebase project credentials for iOS...
    const iosCredentials = {
      clientId: '',
      appId: '',
      apiKey: '',
      databaseURL: '',
      storageBucket: '',
      messagingSenderId: '',
      projectId: '',
    };

    // Select the relevant credentials
    const credentials = Platform.select({
      android: androidCredentials,
      ios: iosCredentials,
    });

    if (!firebase.apps.length) {
      firebase.initializeApp(credentials);
      console.log(
        '==firebase.initializeApp(credentials)===>',
        firebase.initializeApp(credentials),
      );
    }

    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {
      console.log('App onRegister in app.js');
    }

    function onNotification(notify) {
      console.log('App onNotification', notify);
      setUnread('Y');
      const options = {
        soundName: 'default',
        playSound: true,
      };
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options,
      );
    }

    function onOpenNotification(notify) {
      console.log('App on open notification', notify);
      setUnread('Y');
      //alert('Open Notification'+notify.body )
    }

    //isReadyRef.current = false;
    requestUserPermission();
  };

  const requestUserPermission = async () => {
    //if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      //console.log('Authorization status:', authStatus);

      messaging()
        .getToken()
        .then(fcmToken => {
          if (fcmToken) {
            console.warn('have tok=====', fcmToken);
          } else {
            console.warn('have tok=====', 'Not registered');
          }
        })
        .catch(error => {
          console.warn('have tok=====', 'Error occured');
        });
    }
    //}
  };

  const updateNotficationStatus = async value => {
    setUnread(value);
  };

  const handleAppStateChange = nextAppState => {
    // console.log('handleAppStateChange==>', nextAppState);
    //console.log('appState==>', appState.current);
    if (
      // appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // TODO SET USERS ONLINE STATUS TO TRUE
      //console.log('===>', netStatus);

      if (netStatus) {
        //console.log('Socket on Api call');

        const statusActiveData = {
          status: '1',
        };
      }
    } else {
      // TODO SET USERS ONLINE STATUS TO FALSE
      console.log('Socket off Api call');
      const statusInactiveData = {
        status: '0',
      };
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    //console.log('AppState===>', appState.current);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ProfileProvider>
        <NotificationProvider
          value={{
            usernotificationstatus: unread,
            updateNotficationStatus: updateNotficationStatus,
            // data: socket,
            // createConnectionAfterLogin: createConnectionAfterLogin,
            // disconnectSocket: disconnectSocket,
            // disconnectSocketBack: disconnectSocketBack,
            // checkConnectedOrNot: checkConnectedOrNot,
          }}>
          <>
            {!netStatus ? <NetworkError /> : null}

            <StackNavigation />
            <Toast />
            <Hud ref={rid => Hud.setHud(rid)} />
          </>
        </NotificationProvider>
      </ProfileProvider>
    </SafeAreaView>
  );
};

export default App;

//const styles = StyleSheet.create({});
