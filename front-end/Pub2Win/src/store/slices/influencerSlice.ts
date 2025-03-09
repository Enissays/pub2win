import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { InfluencersState, Influencer } from '../types';

// Mock data for influencers
const mockInfluencers = [
  {
    id: '1',
    name: 'Martin Legrand',
    followers: 100000,
    description: 'Lorem ipsum dolor sit amet consectetur. Quam nunc tortor facilisis massa morbi. Eget sed tempus ut mattis ut adipiscing pulvinar. Curabitur egestas nec perin feugibus elementum ut turtor.',
    imageUrl: 'https://i.imgur.com/placeholder.png',
  },
  // Add more mock influencers as needed
];

// Create async thunk for fetching influencers
export const fetchInfluencers = createAsyncThunk(
  'influencers/fetchInfluencers',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, you would make an API call here
      // For now, we'll use mock data with a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockInfluencers;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

const initialState: InfluencersState = {
  items: [],
  loading: false,
  error: null,
};

const influencersSlice = createSlice({
  name: 'influencers',
  initialState,
  reducers: {
    clearInfluencers: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfluencers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfluencers.fulfilled, (state, action: PayloadAction<Influencer[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchInfluencers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearInfluencers } = influencersSlice.actions;
export default influencersSlice.reducer;