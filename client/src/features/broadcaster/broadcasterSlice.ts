import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DialectType, FieldError } from '@tts-dev/common';
import broadcasterAPI from 'app/api/broadcasterAPI';
import { BroadcasterSentence } from 'app/types/broadcaster';

type ExtraSentence = string | null;

interface BroadcasterState {
  current?: BroadcasterSentence;
  currentDialect?: DialectType;
  firstSentence: ExtraSentence;
  lastSentence: ExtraSentence;
  nextSentence: ExtraSentence;
  previousSentence: ExtraSentence;
}

interface FetchBroadcasterSentenceArgs {
  id: string;
  dialect: DialectType;
}

const initialState: BroadcasterState = {
  current: undefined,
  currentDialect: undefined,
  firstSentence: '',
  lastSentence: '',
  nextSentence: '',
  previousSentence: '',
};

const getBroadcasterSentence = createAsyncThunk<
  BroadcasterSentence,
  FetchBroadcasterSentenceArgs,
  { rejectValue: FieldError[] }
>('broadcaster:getBroadcasterSentence', async (args, thunkAPI) => {
  try {
    const sentence = await broadcasterAPI.getBroadcasterSentence(
      args.id,
      args.dialect
    );
    return sentence;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const getFirstSentence = createAsyncThunk<
  ExtraSentence,
  undefined,
  { rejectValue: FieldError[] }
>('sentence:getFirstSentence', async (_, thunkAPI) => {
  try {
    const res = await broadcasterAPI.getFirst();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const getLastSentence = createAsyncThunk<
  ExtraSentence,
  undefined,
  { rejectValue: FieldError[] }
>('sentence:getLastSentence', async (_, thunkAPI) => {
  try {
    const res = await broadcasterAPI.getLast();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const getNextSentence = createAsyncThunk<
  ExtraSentence,
  { id: string },
  { rejectValue: FieldError[] }
>('sentence:getNextSentence', async ({ id }, thunkAPI) => {
  try {
    const res = await broadcasterAPI.getNext(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const getPreviousSentence = createAsyncThunk<
  ExtraSentence,
  { id: string },
  { rejectValue: FieldError[] }
>('sentence:getPreviousSentence', async ({ id }, thunkAPI) => {
  try {
    const res = await broadcasterAPI.getPrevious(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const broadcasterSlice = createSlice({
  name: 'broadcaster',
  initialState,
  reducers: {
    setBroadcasterSentence: (
      state,
      action: PayloadAction<BroadcasterSentence>
    ) => {
      state.current = action.payload;
    },
    clearBroadcasterSentence: state => {
      state.current = initialState.current;
      state.firstSentence = initialState.firstSentence;
      state.lastSentence = initialState.lastSentence;
      state.nextSentence = initialState.nextSentence;
      state.previousSentence = initialState.previousSentence;
    },
    setCurrentDialect: (state, action: PayloadAction<DialectType>) => {
      state.currentDialect = action.payload;
    },
    clearCurrentDialect: state => {
      state.currentDialect = initialState.currentDialect;
    },
  },
  extraReducers: builder => {
    /** GET_BROADCASTER_SENTENCE_START */
    builder.addCase(getBroadcasterSentence.pending, state => {
      state.current = undefined;
    });
    builder.addCase(getBroadcasterSentence.fulfilled, (state, action) => {
      state.current = action.payload;
    });
    builder.addCase(getBroadcasterSentence.rejected, state => {
      state.current = undefined;
    });
    /** GET_BROADCASTER_SENTENCE_END */

    /** GET_FIRST_START */
    builder.addCase(getFirstSentence.fulfilled, (state, action) => {
      state.firstSentence = action.payload;
    });
    builder.addCase(getFirstSentence.rejected, state => {
      state.firstSentence = null;
    });
    /** GET_FIRST_END */

    /** GET_LAST_START */
    builder.addCase(getLastSentence.fulfilled, (state, action) => {
      state.lastSentence = action.payload;
    });
    builder.addCase(getLastSentence.rejected, state => {
      state.lastSentence = null;
    });
    /** GET_LAST_END */

    /** GET_NEXT_START */
    builder.addCase(getNextSentence.fulfilled, (state, action) => {
      state.nextSentence = action.payload;
    });
    builder.addCase(getNextSentence.rejected, state => {
      state.nextSentence = null;
    });
    /** GET_NEXT_END */

    /** GET_PREVIOUS_START */
    builder.addCase(getPreviousSentence.fulfilled, (state, action) => {
      state.previousSentence = action.payload;
    });
    builder.addCase(getPreviousSentence.rejected, state => {
      state.previousSentence = null;
    });
    /** GET_PREVIOUS_START */
  },
});

export default broadcasterSlice.reducer;
export const {
  setBroadcasterSentence,
  clearBroadcasterSentence,
  setCurrentDialect,
  clearCurrentDialect,
} = broadcasterSlice.actions;
export {
  getBroadcasterSentence,
  getFirstSentence,
  getLastSentence,
  getNextSentence,
  getPreviousSentence,
};
