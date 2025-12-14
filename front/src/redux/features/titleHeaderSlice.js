import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
};

const titleHeaderSlice = createSlice({
  name: "titleHeader",
  initialState,
  reducers: {
    setTitleHeader: (state, action) => {
      const { title } = action.payload;

      state.title = title;
    },
  },
});

export const { setTitleHeader } = titleHeaderSlice.actions;
export default titleHeaderSlice.reducer;
