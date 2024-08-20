import React, { createContext, useState } from 'react';

interface UserData {
  username: String,
  email: String,
}

interface UserState {
  signedIn: boolean,
  data: UserData,
}

interface UserContextType {
  signedIn: UserState,
  setSignedIn: React.Dispatch<React.SetStateAction<UserState>>,
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default UserContext;