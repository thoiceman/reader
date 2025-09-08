import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// 定义书籍接口
export interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  description?: string;
  category: string;
  tags: string[];
  readingProgress: number;
  isRead: boolean;
  isFavorite: boolean;
  addedAt: string;
  lastReadAt?: string;
}

// 定义分类接口
export interface Category {
  id: string;
  name: string;
  description?: string;
  bookCount: number;
}

// 定义搜索过滤器接口
export interface SearchFilters {
  query: string;
  category?: string;
  tags: string[];
  readStatus: 'all' | 'read' | 'unread' | 'reading';
  sortBy: 'title' | 'author' | 'addedAt' | 'lastReadAt' | 'progress';
  sortOrder: 'asc' | 'desc';
}

// 定义图书馆状态接口
export interface LibraryState {
  books: Book[];
  categories: Category[];
  allTags: string[];
  searchFilters: SearchFilters;
  filteredBooks: Book[];
  selectedBooks: string[];
  viewMode: 'grid' | 'list';
  loading: {
    books: boolean;
    categories: boolean;
    search: boolean;
  };
  error: string | null;
}

// 初始状态
const initialState: LibraryState = {
  books: [],
  categories: [],
  allTags: [],
  searchFilters: {
    query: '',
    category: undefined,
    tags: [],
    readStatus: 'all',
    sortBy: 'addedAt',
    sortOrder: 'desc',
  },
  filteredBooks: [],
  selectedBooks: [],
  viewMode: 'grid',
  loading: {
    books: false,
    categories: false,
    search: false,
  },
  error: null,
};

// 异步 thunk：获取书籍列表
export const fetchBooks = createAsyncThunk(
  'library/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      // 这里应该调用实际的 API
      const response = await fetch('/api/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const books = await response.json();
      return books;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// 异步 thunk：获取分类列表
export const fetchCategories = createAsyncThunk(
  'library/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const categories = await response.json();
      return categories;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// 异步 thunk：搜索书籍
export const searchBooks = createAsyncThunk(
  'library/searchBooks',
  async (filters: Partial<SearchFilters>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { library: LibraryState };
      const currentFilters = { ...state.library.searchFilters, ...filters };
      
      // 这里实现本地搜索逻辑，也可以调用后端搜索 API
      let filteredBooks = [...state.library.books];
      
      // 按查询字符串过滤
      if (currentFilters.query) {
        const query = currentFilters.query.toLowerCase();
        filteredBooks = filteredBooks.filter(
          book => 
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        );
      }
      
      // 按分类过滤
      if (currentFilters.category) {
        filteredBooks = filteredBooks.filter(
          book => book.category === currentFilters.category
        );
      }
      
      // 按标签过滤
      if (currentFilters.tags.length > 0) {
        filteredBooks = filteredBooks.filter(
          book => currentFilters.tags.some(tag => book.tags.includes(tag))
        );
      }
      
      // 按阅读状态过滤
      if (currentFilters.readStatus !== 'all') {
        filteredBooks = filteredBooks.filter(book => {
          switch (currentFilters.readStatus) {
            case 'read':
              return book.isRead;
            case 'unread':
              return !book.isRead && book.readingProgress === 0;
            case 'reading':
              return !book.isRead && book.readingProgress > 0;
            default:
              return true;
          }
        });
      }
      
      // 排序
      filteredBooks.sort((a, b) => {
        const { sortBy, sortOrder } = currentFilters;
        let comparison = 0;
        
        switch (sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'author':
            comparison = a.author.localeCompare(b.author);
            break;
          case 'addedAt':
            comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
            break;
          case 'lastReadAt':
            const aTime = a.lastReadAt ? new Date(a.lastReadAt).getTime() : 0;
            const bTime = b.lastReadAt ? new Date(b.lastReadAt).getTime() : 0;
            comparison = aTime - bTime;
            break;
          case 'progress':
            comparison = a.readingProgress - b.readingProgress;
            break;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      
      return { filters: currentFilters, books: filteredBooks };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Search failed');
    }
  }
);

// 创建 slice
const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    // 设置搜索过滤器
    setSearchFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    
    // 清除搜索过滤器
    clearSearchFilters: (state) => {
      state.searchFilters = initialState.searchFilters;
      state.filteredBooks = state.books;
    },
    
    // 切换书籍选择
    toggleBookSelection: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const index = state.selectedBooks.indexOf(bookId);
      if (index > -1) {
        state.selectedBooks.splice(index, 1);
      } else {
        state.selectedBooks.push(bookId);
      }
    },
    
    // 选择所有书籍
    selectAllBooks: (state) => {
      state.selectedBooks = state.filteredBooks.map(book => book.id);
    },
    
    // 清除所有选择
    clearBookSelection: (state) => {
      state.selectedBooks = [];
    },
    
    // 切换视图模式
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    
    // 更新书籍收藏状态
    toggleBookFavorite: (state, action: PayloadAction<string>) => {
      const book = state.books.find(b => b.id === action.payload);
      if (book) {
        book.isFavorite = !book.isFavorite;
      }
    },
    
    // 更新书籍阅读进度
    updateBookProgress: (state, action: PayloadAction<{ bookId: string; progress: number }>) => {
      const { bookId, progress } = action.payload;
      const book = state.books.find(b => b.id === bookId);
      if (book) {
        book.readingProgress = progress;
        book.lastReadAt = new Date().toISOString();
        if (progress >= 100) {
          book.isRead = true;
        }
      }
    },
    
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 处理获取书籍列表
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading.books = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading.books = false;
        state.books = action.payload;
        state.filteredBooks = action.payload;
        // 提取所有标签
        const allTags = new Set<string>();
        action.payload.forEach((book: Book) => {
          book.tags.forEach((tag: string) => allTags.add(tag));
        });
        state.allTags = Array.from(allTags);
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading.books = false;
        state.error = action.payload as string;
      })
      
      // 处理获取分类列表
      .addCase(fetchCategories.pending, (state) => {
        state.loading.categories = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading.categories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading.categories = false;
        state.error = action.payload as string;
      })
      
      // 处理搜索书籍
      .addCase(searchBooks.pending, (state) => {
        state.loading.search = true;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchFilters = action.payload.filters;
        state.filteredBooks = action.payload.books;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading.search = false;
        state.error = action.payload as string;
      });
  },
});

// 导出 actions
export const {
  setSearchFilters,
  clearSearchFilters,
  toggleBookSelection,
  selectAllBooks,
  clearBookSelection,
  setViewMode,
  toggleBookFavorite,
  updateBookProgress,
  clearError,
} = librarySlice.actions;

// 导出 reducer
export default librarySlice.reducer;

// 导出选择器
export const selectBooks = (state: { library: LibraryState }) => state.library.books;
export const selectFilteredBooks = (state: { library: LibraryState }) => state.library.filteredBooks;
export const selectCategories = (state: { library: LibraryState }) => state.library.categories;
export const selectAllTags = (state: { library: LibraryState }) => state.library.allTags;
export const selectSearchFilters = (state: { library: LibraryState }) => state.library.searchFilters;
export const selectSelectedBooks = (state: { library: LibraryState }) => state.library.selectedBooks;
export const selectViewMode = (state: { library: LibraryState }) => state.library.viewMode;
export const selectLibraryLoading = (state: { library: LibraryState }) => state.library.loading;
export const selectLibraryError = (state: { library: LibraryState }) => state.library.error;