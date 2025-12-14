import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { clientApi } from "./api/clientApi";
import { compteApi } from "./api/compteApi";
import { transactionApi } from "./api/transactionApi";
import { pretApi } from "./api/pretApi";
import { rembourseApi } from "./api/rembourseApi";
import { adminApi } from "./api/adminApi";
import { userApi } from "./api/userApi";
import authReducer from "./features/authSlice";
import titleHeaderReducer from "./features/titleHeaderSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [compteApi.reducerPath]: compteApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [pretApi.reducerPath]: pretApi.reducer,
    [rembourseApi.reducerPath]: rembourseApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    auth: authReducer,
    titleHeader: titleHeaderReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      clientApi.middleware,
      compteApi.middleware,
      transactionApi.middleware,
      pretApi.middleware,
      rembourseApi.middleware,
      adminApi.middleware,
      userApi.middleware
    ),
});
