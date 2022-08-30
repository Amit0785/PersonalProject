import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import RBSheet from 'react-native-raw-bottom-sheet';
import Icons from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import Hud from '../../Screens/Common/Hud';
import Toast from 'react-native-toast-message';
import {base_url} from '../../Services/constants';

import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';

const {width, height} = Dimensions.get('window');

const BottomTab = props => {
  useEffect(() => {
    handleUserType();
    handleProfile();
  }, []);

  //const refRBSheet = useRef();
  // const [data, setData] = useState([]);
  // const [activeRoute, setRouteState] = useState(0);
  const setRoute = (pageName, index) => {
    props.navigation.jumpTo(pageName);
    //setRouteState(index);
  };

  const [video, setVideo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState('');
  const [profile, setProfile] = useState([]);
  const handleUserType = async () => {
    setUser(JSON.parse(await AsyncStorage.getItem('userType')));
    // console.log('profile===>', user);
    // console.log('type====>', typeof user);
  };

  const handleProfile = async () => {
    setProfile(JSON.parse(await AsyncStorage.getItem('profile')));
    console.log('profile===>', profile);
    // console.log('type====>', typeof user);
  };
  const walletTab = async () => {
    if (user === 1) {
      //console.log('User===>', data.user_type);
      props.navigation.jumpTo('Wallet');
    } else if (user === 2) {
      props.navigation.jumpTo('Balance');
    }
  };

  const chatTab = async () => {
    if (user === 1) {
      //console.log('User===>', data.user_type);
      props.navigation.jumpTo('Chat');
    } else if (user === 2) {
      props.navigation.jumpTo('ChatCelebrity');
    }
  };

  const storeVideo = num => {
    console.log('video in gallery');
    //setShowModal(false);
    ImagePicker.openPicker({
      mediaType: 'video',
      useFrontCamera: true,
    })
      .then(vid => {
        console.log('Video Data==>', vid);
        //setVideo(vid.path);

        if (vid.size >= 10650663) {
          Toast.show({
            type: 'error',
            text1: 'Image size should not be greater than 10 Mb',
          });
          setShowModal(false);
        } else {
          uploadVideoFunc(vid, num);
        }
      })
      .catch(error => {
        //console.log(error);
        console.log('User cancelled Video selection from Gallery');
      });
  };

  const newVideo = num => {
    console.log('video from camera');
    setShowModal(false);
    //refRBSheet.current.close();
    ImagePicker.openCamera({
      mediaType: 'video',
      useFrontCamera: true,
    })
      .then(vid => {
        console.log('recording video==>', vid);
        //setVideo(vid.path);

        if (vid.size >= 10650663) {
          Toast.show({
            type: 'error',
            text1: 'Image size should not be greater than 10 Mb',
          });
          setShowModal(false);
        } else {
          uploadVideoFunc(vid, num);
        }
      })
      .catch(error => {
        //console.log(error);
        console.log('User cancelled Video selection from Camera');
      });
  };

  const uploadVideoFunc = async (file, type) => {
    Hud.showHud();

    const data = new FormData();
    data.append('video_type', type);
    data.append('file', {
      //uri: file,
      uri:
        Platform.OS == 'ios' ? file.path?.replace('file://', '/') : file.path,
      name: 'name.mp4',
      type: file.mime,
    });
    console.log('========>', data);
    const AccessToken = await AsyncStorage.getItem('token');

    try {
      let res = await fetch(base_url + `celebritypost`, {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      let responseJson = await res.json().then(response => {
        console.log(
          'responseJson===>',
          response,
          JSON.stringify(response.data.file),
          typeof response.data.file,
        );
        Hud.hideHud();
        if (response.success === true) {
          Toast.show({
            type: 'success',
            text1: 'Video has been uploaded',
          });
        } else {
          var myobj = response.data.file;
          var firstItem = Object.values(myobj)[0];
          console.log('====>firstItem', firstItem);
          console.log('====>firstItem', typeof firstItem);
          Toast.show({
            type: 'error',
            text1: firstItem,
          });
        }
      });
    } catch (error) {
      Hud.hideHud();
      console.log('Error==>', error);
      Toast.show({
        type: 'error',
        text1: 'Error ',
      });
    } finally {
      //Hud.hideHud();
      setShowModal(false);
    }
  };

  const onLive = async () => {
    console.log('Live Function Enter here');
    setShowModal(false);
    props.navigation.navigate('LiveCelebrity', {data: profile});
  };

  return (
    <ImageBackground
      source={require('../../Assets/Icon/bottom-background-image.png')}
      resizeMode="stretch"
      imageStyle={{tintColor: '#fff', position: 'absolute', bottom: 0}}
      style={{
        //flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        //height: '27%',
        height: height * 0.13,
        //backgroundColor: 'white',
        aspectRatio: 2.75,
      }}>
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          bottom: 0,
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          //height: '27%',
          height: height * 0.13,
          //backgroundColor: 'white',
          aspectRatio: 2.75,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',

            marginLeft: width * 0.078,
            marginRight: 10,
            //paddingTop: 35,
            bottom: 5,
            //width:'20%',
            width: width * 0.16,
            //height:60,
            borderWidth: 0,
            //borderColor: 'red',
            //backgroundColor:'#E92D87',
            borderRadius: 100,
          }}
          onPress={() => setRoute('Home', 0)}>
          <View
            style={{
              width: 60,
              height: 60,
              backgroundColor: '#E92D87',
              borderRadius: 100,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../../Assets/Icon/Home.png')}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
          }}
          // onPress={() => refRBSheet.current.open()}
          //onPress={() => setRoute('Add', 1)}
        >
          <View style={styles.division}>
            <View style={styles.IconStyleChat}>
              <Image
                source={require('../../Assets/Icon/add.png')}
                style={{width: '100%', height: '100%'}}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* <RBSheet
          //height={370}

          animationType="slide"
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            container: {
              borderTopEndRadius: 20,
              borderTopStartRadius: 20,
            },
            wrapper: {
              //backgroundColor: 'transparent',
              // backgroundColor: 'rgba(0,0,0,0.3)',
              backgroundColor: 'rgba(225,225,225,0.5)',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          <View style={{flex: 1}}>
        
          </View>
        </RBSheet> */}

        <Modal
          visible={showModal}
          transparent={true}
          //animationType={'slide'}
          //presentationStyle="formSheet"
        >
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '100%',
                //height: user === 1 ? 200 : 250,
                //alignSelf: 'center',
                backgroundColor: '#fff',
                //alignItems: 'center',
                //borderRadius: 10,
                borderTopEndRadius: 15,
                borderTopStartRadius: 15,
                position: 'absolute',
                bottom: 0,
                paddingBottom: height * 0.05,
              }}>
              <View
                style={{
                  //backgroundColor: 'red',
                  width: '100%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingRight: width * 0.05,
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: RFValue(23),
                    fontFamily: 'Roboto-Bold',

                    color: 'black',
                    margin: 10,
                  }}>
                  Create
                </Text>

                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Icons name="close" size={28} color={'#000'} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => newVideo(2)}
                style={styles.refDivision}>
                <View
                  style={{
                    height: 50,
                    width: 50,
                    backgroundColor: 'rgba(225,225,225,0.5)',
                    // backgroundColor: '#E92D87',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 100,
                  }}>
                  <View
                    style={{
                      height: 15,
                      width: 25,
                      //marginRight: 3,
                    }}>
                    <Image
                      source={require('../../Assets/Icon/camera.png')}
                      style={{width: '100%', height: '100%', tintColor: '#000'}}
                      resizeMode="cover"
                    />
                  </View>
                </View>

                <Text style={styles.rawTextStyle}>Create a Reel Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => storeVideo(1)}
                style={styles.refDivision}>
                <View
                  style={{
                    height: 50,
                    width: 50,
                    backgroundColor: 'rgba(225,225,225,0.5)',
                    // backgroundColor: '#E92D87',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 100,
                  }}>
                  <Icons name="image" size={28} color={'#000'} />
                  {/* <View style={{height: 15, width: 25, marginRight: 3}}>
                    <Image
                      source={require('../../Assets/Icon/camera.png')}
                      style={{width: '100%', height: '100%', tintColor: '#000'}}
                      resizeMode="cover"
                    />
                  </View> */}
                </View>

                <Text style={styles.rawTextStyle}>
                  Upload a Promotional Video
                </Text>
              </TouchableOpacity>

              {user === 2 ? (
                <TouchableOpacity
                  onPress={() => onLive()}
                  style={styles.refDivision}>
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      backgroundColor: 'rgba(225,225,225,0.5)',
                      // backgroundColor: '#E92D87',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 100,
                    }}>
                    <View
                      style={{
                        height: 15,
                        width: 25,
                        //marginRight: 3
                      }}>
                      <Image
                        source={require('../../Assets/Icon/live.jpg')}
                        style={{
                          width: '100%',
                          height: '100%',
                          tintColor: '#000',
                        }}
                        resizeMode="cover"
                      />
                    </View>
                  </View>

                  <Text style={styles.rawTextStyle}>Go Live</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </Modal>
        <TouchableOpacity onPress={() => chatTab()}>
          <View style={styles.division}>
            <View style={styles.IconStyleChat}>
              <Image
                source={require('../../Assets/Icon/chat.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          //onPress={() => setRoute('Wallet', 3)}
          onPress={() => walletTab()}>
          <View style={styles.division}>
            <View style={styles.IconStyleChat}>
              <Image
                source={require('../../Assets/Icon/wallet.png')}
                // style={{ width: 20, height: 19 }}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default BottomTab;
const styles = StyleSheet.create({
  IconStyleChat: {
    height: 25,
    width: 28,
    marginBottom: 0,
  },

  division: {
    //justifyContent: 'space-between',
    //alignItems: 'center',
    //backgroundColor: 'red',
    width: width * 0.15,
    height: height * 0.1,
    // alignSelf:'center',
    alignItems: 'center',
    justifyContent: 'center',
    //alignContent:'center',

    marginLeft: 15,
    marginRight: 15,
    marginTop: 30,
    //paddingTop: 35,
  },

  Container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'black',
    width: '100%',
    height: height * 0.13,
    backgroundColor: '#ffff',
    aspectRatio: 2.75,
    borderTopEndRadius: 28,
    borderTopStartRadius: 28,
  },

  refDivision: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 7,
    alignItems: 'center',
    //backgroundColor: 'pink',
  },

  rawTextStyle: {
    fontSize: RFValue(16),
    marginLeft: 10,
  },
});
