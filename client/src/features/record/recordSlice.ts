import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FieldError } from '@tts-dev/common';
import { Record } from 'app/types/record';
import recordAPI from 'app/api/recordAPI';

type ExtraRecord = string | null;

interface RecordState {
  current?: Record;
  firstRecord: ExtraRecord;
  lastRecord: ExtraRecord;
  nextRecord: ExtraRecord;
  previousRecord: ExtraRecord;
}

interface FetchRecordArgs {
  id: string;
}

const initialState: RecordState = {
  current: undefined,
  firstRecord: '',
  lastRecord: '',
  nextRecord: '',
  previousRecord: '',
};

const getRecord = createAsyncThunk<
  Record,
  FetchRecordArgs,
  { rejectValue: FieldError[] }
>('record:getRecord', async (args, thunkAPI) => {
  try {
    const record = await recordAPI.getRecord(args.id);
    return record;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const getFirstRecord = createAsyncThunk<
  ExtraRecord,
  undefined,
  { rejectValue: FieldError[] }
>('record:getFirstRecord', async (_, thunkAPI) => {
  try {
    const res = await recordAPI.getFirstRecord();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const getLastRecord = createAsyncThunk<
  ExtraRecord,
  undefined,
  { rejectValue: FieldError[] }
>('record:getLastRecord', async (_, thunkAPI) => {
  try {
    const res = await recordAPI.getLastRecord();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const getNextRecord = createAsyncThunk<
  ExtraRecord,
  { id: string },
  { rejectValue: FieldError[] }
>('record:getNextRecord', async ({ id }, thunkAPI) => {
  try {
    const res = await recordAPI.getNextRecord(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const getPreviousRecord = createAsyncThunk<
  ExtraRecord,
  { id: string },
  { rejectValue: FieldError[] }
>('record:getPreviousRecord', async ({ id }, thunkAPI) => {
  try {
    const res = await recordAPI.getPreviousRecord(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const recordSlice = createSlice({
  name: 'record',
  initialState,
  reducers: {
    setRecord: (state, action: PayloadAction<Record>) => {
      state.current = action.payload;
    },
    clearRecord: state => {
      state.current = initialState.current;
      state.firstRecord = initialState.firstRecord;
      state.lastRecord = initialState.lastRecord;
      state.nextRecord = initialState.nextRecord;
      state.previousRecord = initialState.previousRecord;
    },
  },
  extraReducers: builder => {
    /** GET_SENTENCE_START */
    builder.addCase(getRecord.pending, state => {
      state.current = undefined;
    });
    builder.addCase(getRecord.fulfilled, (state, action) => {
      state.current = action.payload;
    });
    builder.addCase(getRecord.rejected, state => {
      state.current = undefined;
    });
    /** GET_SENTENCE_END */

    /** GET_FIRST_START */
    builder.addCase(getFirstRecord.fulfilled, (state, action) => {
      state.firstRecord = action.payload;
    });
    builder.addCase(getFirstRecord.rejected, state => {
      state.firstRecord = null;
    });
    /** GET_FIRST_END */

    /** GET_LAST_START */
    builder.addCase(getLastRecord.fulfilled, (state, action) => {
      state.lastRecord = action.payload;
    });
    builder.addCase(getLastRecord.rejected, state => {
      state.lastRecord = null;
    });
    /** GET_LAST_END */

    /** GET_NEXT_START */
    builder.addCase(getNextRecord.fulfilled, (state, action) => {
      state.nextRecord = action.payload;
    });
    builder.addCase(getNextRecord.rejected, state => {
      state.nextRecord = null;
    });
    /** GET_NEXT_END */

    /** GET_PREVIOUS_START */
    builder.addCase(getPreviousRecord.fulfilled, (state, action) => {
      state.previousRecord = action.payload;
    });
    builder.addCase(getPreviousRecord.rejected, state => {
      state.previousRecord = null;
    });
    /** GET_PREVIOUS_START */
  },
});

export default recordSlice.reducer;
export const { setRecord, clearRecord } = recordSlice.actions;
export {
  getRecord,
  getFirstRecord,
  getLastRecord,
  getNextRecord,
  getPreviousRecord,
};
