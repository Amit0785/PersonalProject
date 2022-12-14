import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import Splash from '../../Screens/Splash/Splash';
import Login from '../../Screens/Login/Login';
import Registration from '../../Screens/Registration/Registration';
import PleaseWait from '../../Screens/PleaseWait/PleaseWait';
import ForgotPassword from '../../Screens/ForgotPassword/ForgotPassword';
// import ForgotPasswordOtp from '../../Screens/ForgotPassword/ForgotPasswordOtp';
// import ResetPassword from '../../Screens/ResetPassword/ResetPassword';

// import Profile from '../../Screens/Profile/Profile';

// import ChangePassword from '../../Screens/ChangePassword/ChangePassword';
// import Otp from '../../Screens/Otp/Otp';
// import Faq from '../../Screens/FAQ/Faq';
// import TermAndCondition from '../../Screens/TermAndCondition/TermAndCondition';
// import PrivacyPolicy from '../../Screens/PrivacyPolicy/PrivacyPolicy';

import MyDrawer from '../DrawerNavigation/MyDrawer';

import IndividualChat from '../../Screens/IndividualChat/IndividualChat';

// import LiveCelebrity from '../../Screens/Live/LiveCelebrity';
import VideoCall from '../../Screens/VideoCall/VideoCall';
import OnLive from '../../Screens/Live/OnLive';
import CreateLive from '../../Screens/Live/CreateLive';
// import CelebrityProfilePage from '../../Screens/CelebrityProfile/CelebrityProfilePage';

import Payment from '../../Screens/Payment/Payment';
import PayPalPayment from '../../Screens/Payment/PayPalPayment';
import StripePayment from '../../Screens/Payment/StripePayment';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="PleaseWait" component={PleaseWait} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

        <Stack.Screen name="MyDrawer" component={MyDrawer} />
        <Stack.Screen name="IndividualChat" component={IndividualChat} />
        <Stack.Screen name="VideoCall" component={VideoCall} />

        <Stack.Screen name="OnLive" component={OnLive} />
        <Stack.Screen name="CreateLive" component={CreateLive} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="PayPalPayment" component={PayPalPayment} />
        <Stack.Screen name="StripePayment" component={StripePayment} />
        {/* <Stack.Screen name="Otp" component={Otp} />

        
        <Stack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtp} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />

        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />

        
        <Stack.Screen
          name="CelebrityProfilePage"
          component={CelebrityProfilePage}
        />

        

        

        <Stack.Screen name="FAQ" component={Faq} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="TermAndCondition" component={TermAndCondition} />
        <Stack.Screen name="LiveCelebrity" component={LiveCelebrity} />
       
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
