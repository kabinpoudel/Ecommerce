import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IData, IOrder, IOrderItems } from "./types";
import { Status } from "../globals/types/type";
import type { AppDispatch } from "./store";
import { APIWITHTOKEN } from "../http";

const initialState: IOrder = {
  status: Status.LOADING,
  items: [],
  khaltiUrl: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setItems(state: IOrder, action: PayloadAction<IOrderItems[]>) {
      state.items = action.payload;
    },
    setStatus(state: IOrder, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setKhaltiUrl(state: IOrder, action: PayloadAction<string>) {
      console.log(action.payload);
      state.khaltiUrl = action.payload;
    },
  },
});

export default orderSlice.reducer;
export const { setItems, setStatus, setKhaltiUrl } = orderSlice.actions;

export function orderItem(data: IData) {
  return async function orderItemThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHTOKEN.post("/order", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setItems(response.data.data));
        if (response.data.url) {
          dispatch(setKhaltiUrl(response.data.url));
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function fetchMyOrders() {
  return async function fetchMyOrdersThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHTOKEN.get("/order");
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setItems(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}
