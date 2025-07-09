import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import type {
  IErrorResponse,
  IUserData,
  UserLoginRequest,
  UserLoginResponse,
  UserRegisterRequest,
  UserRegisterResponse,
} from '../types/interfaces.ts';
import { getToken, removeToken, setToken } from '../services/localstorage.service.ts';
import { API_URL } from '../consts/consts.ts';
import { showMessage } from '../store/slices/messageSlice.ts';

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL, // your API URL
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, baseApi, extraOptions) => {
  let result = await baseQuery(args, baseApi, extraOptions);

  if (result.error) {
    if (result.error.status === 401) {
      const refreshResult = await baseQuery('/refresh', baseApi, extraOptions);

      if (refreshResult.data && (refreshResult.data as UserLoginResponse).accessToken) {
        const newAccessToken = (refreshResult.data as UserLoginResponse).accessToken;

        setToken(newAccessToken);

        result = await baseQuery(args, baseApi, extraOptions);
        if (result.error?.status === 401) {
          removeToken();
        }
      } else {
        removeToken();
      }
    } else {
      baseApi.dispatch(
        showMessage({
          type: 'error',
          content: (result.error.data as IErrorResponse)?.message,
        }),
      );
      baseApi.dispatch(api.util.resetApiState());
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  refetchOnReconnect: true,
  tagTypes: ['User', 'Me'],
  endpoints: (builder) => ({
    login: builder.mutation<UserLoginResponse, UserLoginRequest>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        const { accessToken } = data;
        setToken(accessToken);
      },
    }),
    register: builder.mutation<UserRegisterResponse, UserRegisterRequest>({
      query: (body) => ({
        url: '/registration',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        const { accessToken } = data;
        setToken(accessToken);
      },
    }),
    getUsers: builder.query<IUserData[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    me: builder.query<IUserData, void>({
      query: () => '/me',
      providesTags: ['Me'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
        invalidatesTags: ['User', 'Me'],
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        await queryFulfilled;
        removeToken();
        dispatch(api.util.resetApiState());
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetUsersQuery,
  useMeQuery,
} = api;
