import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FieldError } from '@tts-dev/common';
import { Sentence } from 'app/types/sentence';
import sentenceAPI from 'app/api/sentenceAPI';

type ExtraSentence = string | null;

interface SentenceState {
  current?: Sentence;
  firstSentence: ExtraSentence;
  lastSentence: ExtraSentence;
  nextSentence: ExtraSentence;
  previousSentence: ExtraSentence;
}

interface FetchSentenceArgs {
  id: string;
}

const initialState: SentenceState = {
  current: undefined,
  firstSentence: '',
  lastSentence: '',
  nextSentence: '',
  previousSentence: '',
};

const getSentence = createAsyncThunk<
  Sentence,
  FetchSentenceArgs,
  { rejectValue: FieldError[] }
>('sentence:getSentence', async (args, thunkAPI) => {
  try {
    const sentence = await sentenceAPI.getSentence(args.id);
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
    const res = await sentenceAPI.getFirstSentence();
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
    const res = await sentenceAPI.getLastSentence();
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
    const res = await sentenceAPI.getNextSentence(id);
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
    const res = await sentenceAPI.getPreviousSentence(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const sentenceSlice = createSlice({
  name: 'sentence',
  initialState,
  reducers: {
    setSentence: (state, action: PayloadAction<Sentence>) => {
      state.current = action.payload;
    },
    clearSentence: state => {
      state.current = initialState.current;
      state.firstSentence = initialState.firstSentence;
      state.lastSentence = initialState.lastSentence;
      state.nextSentence = initialState.nextSentence;
      state.previousSentence = initialState.previousSentence;
    },
  },
  extraReducers: builder => {
    /** GET_SENTENCE_START */
    builder.addCase(getSentence.pending, state => {
      state.current = undefined;
    });
    builder.addCase(getSentence.fulfilled, (state, action) => {
      state.current = action.payload;
    });
    builder.addCase(getSentence.rejected, state => {
      state.current = undefined;
    });
    /** GET_SENTENCE_END */

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

export default sentenceSlice.reducer;
export const { setSentence, clearSentence } = sentenceSlice.actions;
export {
  getSentence,
  getFirstSentence,
  getLastSentence,
  getNextSentence,
  getPreviousSentence,
};
