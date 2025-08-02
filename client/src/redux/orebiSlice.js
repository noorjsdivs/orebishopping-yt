import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  products: [],
  orderCount: 0,
};

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity = (item.quantity || 0) + (action.payload.quantity || 1);
      } else {
        state.products.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find((item) => item._id === action.payload);

      if (item) {
        item.quantity = (item.quantity || 0) + 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.products.find((item) => item._id === action.payload);

      if (item) {
        const currentQuantity = item.quantity || 1;
        if (currentQuantity === 1) {
          item.quantity = 1;
        } else {
          item.quantity = currentQuantity - 1;
        }
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
    addUser: (state, action) => {
      state.userInfo = action.payload;
    },
    removeUser: (state) => {
      state.userInfo = null;
    },
    setOrderCount: (state, action) => {
      state.orderCount = action.payload;
    },
    resetOrderCount: (state) => {
      state.orderCount = 0;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
  resetCart,
  addUser,
  removeUser,
  setOrderCount,
  resetOrderCount,
} = orebiSlice.actions;
export default orebiSlice.reducer;
