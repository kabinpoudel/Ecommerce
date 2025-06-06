import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status, Status as StatusEnum } from "../globals/types/type";
import { API } from "../http";
import type { AppDispatch } from "./store";

interface IUser {
  username: string | null;
  email: string | null;
  password: string | null;
  token: string | null;
}
interface ILoginUser {
  email: string | null;
  password: string | null;
}

interface IAuthState {
  user: IUser;
  status: Status;
}
const initialState: IAuthState = {
  user: {
    username: null,
    email: null,
    password: null,
    token: null,
  },
  status: StatusEnum.LOADING,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state: IAuthState, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
    setStatus(state: IAuthState, action: PayloadAction<StatusEnum>) {
      state.status = action.payload;
    },
    setToken(state: IAuthState, action: PayloadAction<string>) {
      state.user.token = action.payload;
    },
  },
});
export const { setStatus, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;

export function registerUser(data: IUser) {
  return async function registerUserThunk(dispatch: AppDispatch) {
    try {
      const response = await API.post("/auth/register", data);

      if (response.status === 201) {
        dispatch(setStatus(StatusEnum.SUCCESS));
        dispatch(setUser(data));
      } else {
        dispatch(setStatus(StatusEnum.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(StatusEnum.ERROR));
    }
  };
}

export function loginUser(data: ILoginUser) {
  return async function loginUserThunk(dispatch: AppDispatch) {
    try {
      const response = await API.post("/auth/login", data);
      console.log(response);
      if (response.status === 200) {
        dispatch(setStatus(StatusEnum.SUCCESS));
        if (response.data.data) {
          localStorage.setItem("usertoken", response.data.data);
          dispatch(setToken(response.data.data));
        } else {
          dispatch(setStatus(Status.ERROR));
        }
      } else {
        dispatch(setStatus(StatusEnum.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(StatusEnum.ERROR));
    }
  };
}

export function forgotPassword(data: { email: string }) {
  return async function forgotPasswordThunk(dispatch: AppDispatch) {
    try {
      const response = await API.post("/auth/forgot-password", data);
      console.log(response);
      if (response.status === 200) {
        dispatch(setStatus(StatusEnum.SUCCESS));
      } else {
        dispatch(setStatus(StatusEnum.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(StatusEnum.ERROR));
    }
  };
}
