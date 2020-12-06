import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FieldError } from '@tts-dev/common';
import authAPI, { UpdateAuthProfileField } from 'app/api/authAPI';
import { User } from 'app/types/user';

interface AuthState {
  loading: boolean;
  authenticated: boolean;
  user?: User | null;
}

interface LoginArgs {
  phoneNumber: string;
  password: string;
}

interface UpdateAuthProfileArgs {
  id: string;
  data: UpdateAuthProfileField;
}

interface UpdatePasswordArgs {
  oldPassword: string;
  newPassword: string;
}

const initialState: AuthState = {
  loading: false,
  authenticated: false,
  // user: null,
};

const login = createAsyncThunk<User, LoginArgs, { rejectValue: FieldError[] }>(
  'auth:login',
  async ({ phoneNumber, password }, thunkAPI) => {
    try {
      const user = await authAPI.login(phoneNumber, password);

      return user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const getMe = createAsyncThunk<User, undefined, { rejectValue: FieldError[] }>(
  'auth:getMe',
  async (_, thunkAPI) => {
    try {
      const user = await authAPI.getMe();

      return user;
    } catch (err) {
      thunkAPI.dispatch(logout());
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const logout = createAsyncThunk<
  unknown,
  undefined,
  { rejectValue: FieldError[] }
>('auth:logout', async (_, thunkAPI) => {
  try {
    await authAPI.logout();
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const updateAuthProfile = createAsyncThunk<
  User,
  UpdateAuthProfileArgs,
  { rejectValue: FieldError[] }
>('auth:updateAuthProfile', async (args, thunkAPI) => {
  try {
    const user = await authAPI.updateAuthInfo(args.id, args.data);
    return user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const updatePassword = createAsyncThunk<
  boolean,
  UpdatePasswordArgs,
  { rejectValue: FieldError[] }
>('auth:updatePassword', async (args, thunkAPI) => {
  try {
    const res = await authAPI.updatePassword(
      args.oldPassword,
      args.newPassword
    );
    thunkAPI.dispatch(logout());

    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const uploadAvatar = createAsyncThunk<
  User,
  { avatar: File },
  { rejectValue: FieldError[] }
>('auth:uploadAvatar', async (args, thunkAPI) => {
  try {
    const user = await authAPI.uploadAvatarProfile(args.avatar);

    return user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<User>) => {
      state.authenticated = true;
      state.user = action.payload;
      state.loading = false;
    },
    setUnAuth: state => {
      state.authenticated = false;
      state.user = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    /** LOGIN_START  */
    builder.addCase(login.pending, state => {
      state.loading = true;
      state.authenticated = false;
      state.user = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.authenticated = true;
      state.user = action.payload;
    });
    builder.addCase(login.rejected, state => {
      state.loading = false;
      state.authenticated = false;
      state.user = null;
    });
    /** LOGIN_END  */

    /** LOGOUT_START  */
    builder.addCase(logout.pending, state => {
      state.loading = true;
      state.authenticated = true;
    });
    builder.addCase(logout.fulfilled, state => {
      state.loading = false;
      state.authenticated = false;
      state.user = null;
    });
    builder.addCase(logout.rejected, state => {
      state.loading = false;
      state.authenticated = false;
      state.user = null;
    });
    /** LOGOUT_END  */

    /** GET_ME_START  */
    builder.addCase(getMe.pending, state => {
      state.loading = true;
      state.authenticated = false;
      state.user = null;
    });
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.loading = false;
      state.authenticated = true;
      state.user = action.payload;
    });
    builder.addCase(getMe.rejected, state => {
      state.loading = false;
      state.authenticated = false;
      state.user = null;
    });
    /** GET_ME_END  */

    /** UPDATE_AUTH_PROFILE_START */
    builder.addCase(updateAuthProfile.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateAuthProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.authenticated = true;
      state.user = action.payload;
    });
    builder.addCase(updateAuthProfile.rejected, state => {
      state.loading = false;
    });
    /** UPDATE_AUTH_PROFILE_END */

    /** UPLOAD_AVATAR_START */

    builder.addCase(uploadAvatar.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    /** UPLOAD_AVATAR_END */
  },
});

export const { setAuth, setUnAuth } = authSlice.actions;
export {
  login,
  logout,
  getMe,
  updateAuthProfile,
  uploadAvatar,
  updatePassword,
};
export default authSlice.reducer;
