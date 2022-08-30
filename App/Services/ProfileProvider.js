import React, {createContext, useState} from 'react';

const ProfileContext = createContext();

const ProfileProvider = ({children}) => {
  const [profileContextData, setProfileContextData] = useState('');
  const [notificationStatusContextData, setnotificationStatusContextData] =
    useState(true);
  return (
    <ProfileContext.Provider
      value={{
        profileContextData,
        setProfileContextData,
        notificationStatusContextData,
        setnotificationStatusContextData,
      }}>
      {children}
    </ProfileContext.Provider>
  );
};

export {ProfileContext, ProfileProvider};
