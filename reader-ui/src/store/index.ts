import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import libraryReducer from './slices/librarySlice';
import readingReducer from './slices/readingSlice';
import uiReducer from './slices/uiSlice';

// 配置 store
export const store = configureStore({
  reducer: {
    library: libraryReducer,
    reading: readingReducer,
    ui: uiReducer,
  },
  // 启用 Redux DevTools
  devTools: process.env.NODE_ENV !== 'production',
  // 配置中间件
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // 序列化检查配置
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// 导出类型定义
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 导出类型化的 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 导出 store 实例
export default store;