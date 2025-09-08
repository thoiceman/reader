import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// 定义书签接口
export interface Bookmark {
  id: string;
  bookId: string;
  chapterTitle?: string;
  position: number; // 页码或位置
  content: string; // 书签处的文本内容
  note?: string; // 用户备注
  createdAt: string;
  updatedAt: string;
}

// 定义笔记接口
export interface Note {
  id: string;
  bookId: string;
  chapterTitle?: string;
  position: number;
  selectedText: string; // 选中的文本
  content: string; // 笔记内容
  color: 'yellow' | 'green' | 'blue' | 'pink' | 'purple'; // 高亮颜色
  createdAt: string;
  updatedAt: string;
}

// 定义阅读进度接口
export interface ReadingProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  currentChapter?: string;
  percentage: number;
  lastReadAt: string;
  readingTime: number; // 总阅读时间（分钟）
  sessionStartTime?: number; // 当前阅读会话开始时间
}

// 定义阅读设置接口
export interface ReadingSettings {
  fontSize: number; // 字体大小 12-24
  lineHeight: number; // 行高 1.2-2.0
  fontFamily: 'serif' | 'sans-serif' | 'monospace';
  theme: 'light' | 'dark' | 'sepia';
  pageWidth: number; // 页面宽度百分比 60-100
  autoScroll: boolean; // 自动滚动
  scrollSpeed: number; // 滚动速度 1-10
  nightMode: boolean; // 夜间模式
}

// 定义当前阅读状态接口
export interface CurrentReading {
  bookId: string | null;
  bookTitle: string;
  bookAuthor: string;
  bookCover?: string;
  currentPage: number;
  totalPages: number;
  isReading: boolean;
  isPaused: boolean;
  fullscreen: boolean;
}

// 定义阅读状态接口
export interface ReadingState {
  currentReading: CurrentReading;
  readingProgress: Record<string, ReadingProgress>; // bookId -> progress
  bookmarks: Bookmark[];
  notes: Note[];
  readingSettings: ReadingSettings;
  recentBooks: string[]; // 最近阅读的书籍ID列表
  loading: {
    progress: boolean;
    bookmarks: boolean;
    notes: boolean;
    settings: boolean;
  };
  error: string | null;
}

// 初始状态
const initialState: ReadingState = {
  currentReading: {
    bookId: null,
    bookTitle: '',
    bookAuthor: '',
    bookCover: undefined,
    currentPage: 0,
    totalPages: 0,
    isReading: false,
    isPaused: false,
    fullscreen: false,
  },
  readingProgress: {},
  bookmarks: [],
  notes: [],
  readingSettings: {
    fontSize: 16,
    lineHeight: 1.6,
    fontFamily: 'serif',
    theme: 'light',
    pageWidth: 80,
    autoScroll: false,
    scrollSpeed: 5,
    nightMode: false,
  },
  recentBooks: [],
  loading: {
    progress: false,
    bookmarks: false,
    notes: false,
    settings: false,
  },
  error: null,
};

// 异步 thunk：保存阅读进度
export const saveReadingProgress = createAsyncThunk(
  'reading/saveProgress',
  async (progress: ReadingProgress, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/books/${progress.bookId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progress),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save reading progress');
      }
      
      return progress;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// 异步 thunk：获取书签列表
export const fetchBookmarks = createAsyncThunk(
  'reading/fetchBookmarks',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/books/${bookId}/bookmarks`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }
      const bookmarks = await response.json();
      return bookmarks;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// 异步 thunk：添加书签
export const addBookmark = createAsyncThunk(
  'reading/addBookmark',
  async (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/books/${bookmark.bookId}/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookmark),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add bookmark');
      }
      
      const newBookmark = await response.json();
      return newBookmark;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// 异步 thunk：获取笔记列表
export const fetchNotes = createAsyncThunk(
  'reading/fetchNotes',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/books/${bookId}/notes`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const notes = await response.json();
      return notes;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// 异步 thunk：添加笔记
export const addNote = createAsyncThunk(
  'reading/addNote',
  async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/books/${note.bookId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add note');
      }
      
      const newNote = await response.json();
      return newNote;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// 异步 thunk：保存阅读设置
export const saveReadingSettings = createAsyncThunk(
  'reading/saveSettings',
  async (settings: ReadingSettings, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user/reading-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save reading settings');
      }
      
      return settings;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// 创建 slice
const readingSlice = createSlice({
  name: 'reading',
  initialState,
  reducers: {
    // 开始阅读
    startReading: (state, action: PayloadAction<{
      bookId: string;
      bookTitle: string;
      bookAuthor: string;
      bookCover?: string;
      currentPage?: number;
      totalPages: number;
    }>) => {
      const { bookId, bookTitle, bookAuthor, bookCover, currentPage = 0, totalPages } = action.payload;
      
      state.currentReading = {
        bookId,
        bookTitle,
        bookAuthor,
        bookCover,
        currentPage,
        totalPages,
        isReading: true,
        isPaused: false,
        fullscreen: false,
      };
      
      // 更新最近阅读列表
      const recentIndex = state.recentBooks.indexOf(bookId);
      if (recentIndex > -1) {
        state.recentBooks.splice(recentIndex, 1);
      }
      state.recentBooks.unshift(bookId);
      
      // 限制最近阅读列表长度
      if (state.recentBooks.length > 10) {
        state.recentBooks = state.recentBooks.slice(0, 10);
      }
      
      // 初始化阅读进度
      if (!state.readingProgress[bookId]) {
        state.readingProgress[bookId] = {
          bookId,
          currentPage,
          totalPages,
          percentage: (currentPage / totalPages) * 100,
          lastReadAt: new Date().toISOString(),
          readingTime: 0,
          sessionStartTime: Date.now(),
        };
      } else {
        state.readingProgress[bookId].sessionStartTime = Date.now();
      }
    },
    
    // 暂停阅读
    pauseReading: (state) => {
      state.currentReading.isPaused = true;
      
      // 更新阅读时间
      if (state.currentReading.bookId && state.readingProgress[state.currentReading.bookId]) {
        const progress = state.readingProgress[state.currentReading.bookId];
        if (progress.sessionStartTime) {
          const sessionTime = Math.floor((Date.now() - progress.sessionStartTime) / 60000); // 转换为分钟
          progress.readingTime += sessionTime;
          progress.sessionStartTime = undefined;
        }
      }
    },
    
    // 恢复阅读
    resumeReading: (state) => {
      state.currentReading.isPaused = false;
      
      // 重新开始计时
      if (state.currentReading.bookId && state.readingProgress[state.currentReading.bookId]) {
        state.readingProgress[state.currentReading.bookId].sessionStartTime = Date.now();
      }
    },
    
    // 停止阅读
    stopReading: (state) => {
      // 更新阅读时间
      if (state.currentReading.bookId && state.readingProgress[state.currentReading.bookId]) {
        const progress = state.readingProgress[state.currentReading.bookId];
        if (progress.sessionStartTime) {
          const sessionTime = Math.floor((Date.now() - progress.sessionStartTime) / 60000);
          progress.readingTime += sessionTime;
          progress.sessionStartTime = undefined;
        }
        progress.lastReadAt = new Date().toISOString();
      }
      
      state.currentReading = initialState.currentReading;
    },
    
    // 更新当前页码
    updateCurrentPage: (state, action: PayloadAction<number>) => {
      const page = action.payload;
      state.currentReading.currentPage = page;
      
      // 更新阅读进度
      if (state.currentReading.bookId) {
        const progress = state.readingProgress[state.currentReading.bookId];
        if (progress) {
          progress.currentPage = page;
          progress.percentage = (page / progress.totalPages) * 100;
          progress.lastReadAt = new Date().toISOString();
        }
      }
    },
    
    // 切换全屏模式
    toggleFullscreen: (state) => {
      state.currentReading.fullscreen = !state.currentReading.fullscreen;
    },
    
    // 更新阅读设置
    updateReadingSettings: (state, action: PayloadAction<Partial<ReadingSettings>>) => {
      state.readingSettings = { ...state.readingSettings, ...action.payload };
    },
    
    // 删除书签
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== action.payload);
    },
    
    // 更新书签
    updateBookmark: (state, action: PayloadAction<{ id: string; updates: Partial<Bookmark> }>) => {
      const { id, updates } = action.payload;
      const bookmark = state.bookmarks.find(b => b.id === id);
      if (bookmark) {
        Object.assign(bookmark, updates, { updatedAt: new Date().toISOString() });
      }
    },
    
    // 删除笔记
    removeNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    
    // 更新笔记
    updateNote: (state, action: PayloadAction<{ id: string; updates: Partial<Note> }>) => {
      const { id, updates } = action.payload;
      const note = state.notes.find(n => n.id === id);
      if (note) {
        Object.assign(note, updates, { updatedAt: new Date().toISOString() });
      }
    },
    
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 处理保存阅读进度
    builder
      .addCase(saveReadingProgress.pending, (state) => {
        state.loading.progress = true;
        state.error = null;
      })
      .addCase(saveReadingProgress.fulfilled, (state, action) => {
        state.loading.progress = false;
        state.readingProgress[action.payload.bookId] = action.payload;
      })
      .addCase(saveReadingProgress.rejected, (state, action) => {
        state.loading.progress = false;
        state.error = action.payload as string;
      })
      
      // 处理获取书签
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading.bookmarks = true;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading.bookmarks = false;
        state.bookmarks = action.payload;
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading.bookmarks = false;
        state.error = action.payload as string;
      })
      
      // 处理添加书签
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.bookmarks.push(action.payload);
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // 处理获取笔记
      .addCase(fetchNotes.pending, (state) => {
        state.loading.notes = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading.notes = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading.notes = false;
        state.error = action.payload as string;
      })
      
      // 处理添加笔记
      .addCase(addNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      })
      .addCase(addNote.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // 处理保存阅读设置
      .addCase(saveReadingSettings.pending, (state) => {
        state.loading.settings = true;
      })
      .addCase(saveReadingSettings.fulfilled, (state, action) => {
        state.loading.settings = false;
        state.readingSettings = action.payload;
      })
      .addCase(saveReadingSettings.rejected, (state, action) => {
        state.loading.settings = false;
        state.error = action.payload as string;
      });
  },
});

// 导出 actions
export const {
  startReading,
  pauseReading,
  resumeReading,
  stopReading,
  updateCurrentPage,
  toggleFullscreen,
  updateReadingSettings,
  removeBookmark,
  updateBookmark,
  removeNote,
  updateNote,
  clearError,
} = readingSlice.actions;

// 导出 reducer
export default readingSlice.reducer;

// 导出选择器
export const selectCurrentReading = (state: { reading: ReadingState }) => state.reading.currentReading;
export const selectReadingProgress = (state: { reading: ReadingState }) => state.reading.readingProgress;
export const selectBookmarks = (state: { reading: ReadingState }) => state.reading.bookmarks;
export const selectNotes = (state: { reading: ReadingState }) => state.reading.notes;
export const selectReadingSettings = (state: { reading: ReadingState }) => state.reading.readingSettings;
export const selectRecentBooks = (state: { reading: ReadingState }) => state.reading.recentBooks;
export const selectReadingLoading = (state: { reading: ReadingState }) => state.reading.loading;
export const selectReadingError = (state: { reading: ReadingState }) => state.reading.error;

// 复合选择器
export const selectBookProgress = (bookId: string) => (state: { reading: ReadingState }) => 
  state.reading.readingProgress[bookId];

export const selectBookBookmarks = (bookId: string) => (state: { reading: ReadingState }) => 
  state.reading.bookmarks.filter(bookmark => bookmark.bookId === bookId);

export const selectBookNotes = (bookId: string) => (state: { reading: ReadingState }) => 
  state.reading.notes.filter(note => note.bookId === bookId);