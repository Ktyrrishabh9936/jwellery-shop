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
export const fetchHotPicks = createAsyncThunk(
  "products/fetchHotPicks",
  async ({  page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products/filter?collection=hot-picks&pageNumber=${page}&pageSize=${limit}`);
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
export const fetchMoreHotPicks = createAsyncThunk(
  "products/fetchMoreHotPicks",
  async ({  page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products/filter?collection=hot-picks&pageNumber=${page}&pageSize=${limit}`);
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
    hotPicks: [],
    hotPicksCurrentPage: 1,
    hotPicksTotalPages: 1,
    hotPicksLoading: false,
    hotPicksNextload:false,
    hotPickserror: null,
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
        state.topPicksNextload = false;
      })
      .addCase(fetchmoretopcollectionProducts.rejected, (state, action) => {
        state.topPicksNextload = false;
        state.topPickserror = action.payload;
      }).addCase(fetchHotPicks.pending, (state) => {
        state.hotPicksLoading = true;
        state.hotPickserror = null;
      })
      .addCase(fetchHotPicks.fulfilled, (state, action) => {
        const { content,currentPage,totalPages} = action.payload;
        state.hotPicks =content;
        state.hotPicksCurrentPage =currentPage;
        state.hotPicksLoading = false;
      })
      .addCase(fetchHotPicks.rejected, (state, action) => {
        state.hotPicksLoading = false;
        state.hotPickserror = action.payload;
      })
      .addCase(fetchMoreHotPicks.pending, (state) => {
        state.hotPicksNextload = true;
        state.hotPickserror = null;
      })
      .addCase(fetchMoreHotPicks.fulfilled, (state, action) => {
        const { content,currentPage,totalPages} = action.payload;
        state.hotPicks = [...state.hotPicks, ...content];
        state.hotPicksCurrentPage =currentPage;
        state.hotPicksNextload = false;
      })
      .addCase(fetchMoreHotPicks.rejected, (state, action) => {
        state.hotPicksNextload = false;
        state.hotPickserror = action.payload;
      });
  },
});

export default collectionSlice.reducer;
