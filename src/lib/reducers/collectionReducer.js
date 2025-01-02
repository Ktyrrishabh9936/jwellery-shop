// src/features/products/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchtopcollectionProducts = createAsyncThunk(
  "products/fetchCollectionProducts",
  async ({  page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products/filter?collection=top-products&pageNumber=${page}&pageSize=${limit}`);
      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const fetchmoretopcollectionProducts = createAsyncThunk(
  "products/fetchmoretopcollectionProducts",
  async ({  page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products/filter?collection=top-products&pageNumber=${page}&pageSize=${limit}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const collectionSlice = createSlice({
  name: "collection",
  initialState: {
    topPicks: [],
    topPicksCurrentPage: 1,
    topPicksTotalPages: 1,
    topPicksLoading: false,
    topPicksNextload:false,
    topPickserror: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchtopcollectionProducts.pending, (state) => {
        state.topPicksLoading = true;
        state.topPickserror = null;
      })
      .addCase(fetchtopcollectionProducts.fulfilled, (state, action) => {
        const { content,currentPage,totalPages} = action.payload;
        state.topPicks =content;
        state.topPicksCurrentPage =currentPage;
        state.topPicksTotalPages =totalPages;
        state.topPicksLoading = false;
      })
      .addCase(fetchtopcollectionProducts.rejected, (state, action) => {
        state.topPicksLoading = false;
        state.topPickserror = action.payload;
      })
      .addCase(fetchmoretopcollectionProducts.pending, (state) => {
        state.topPicksNextload = true;
        state.topPickserror = null;
      })
      .addCase(fetchmoretopcollectionProducts.fulfilled, (state, action) => {
        const { content,currentPage,totalPages} = action.payload;
        state.topPicks = [...state.topPicks, ...content];
        state.topPicksCurrentPage =currentPage;
        state.topPicksTotalPages =totalPages;
        state.topPicksNextload = false;
      })
      .addCase(fetchmoretopcollectionProducts.rejected, (state, action) => {
        state.topPicksNextload = false;
        state.topPickserror = action.payload;
      });
  },
});

export default collectionSlice.reducer;
