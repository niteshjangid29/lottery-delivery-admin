// store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  address: string;
  phoneNo: string;
  email: string;
  isLogin: boolean;
}

const initialState: UserState = {
  name: "",
  address: "",
  phoneNo:"",
  email: "",
  isLogin: false,
};

const userSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminPhone(state, action: PayloadAction<{ phoneNo: string,isLogin:boolean;}>) { state.phoneNo= action.payload.phoneNo;state.isLogin= action.payload.isLogin},
  },
});

export const { setAdminPhone } = userSlice.actions;
export default userSlice.reducer;
