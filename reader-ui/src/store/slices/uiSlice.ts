import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// 定义通知接口
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // 显示时长（毫秒），0 表示不自动关闭
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: number;
}

// 定义模态框接口
export interface Modal {
  id: string;
  type: string;
  title: string;
  content?: React.ReactNode;
  props?: Record<string, any>;
  closable?: boolean;
  maskClosable?: boolean;
  width?: number | string;
  onOk?: () => void;
  onCancel?: () => void;
}

// 定义加载状态接口
export interface LoadingState {
  global: boolean; // 全局加载状态
  components: Record<string, boolean>; // 组件级加载状态
  operations: Record<string, boolean>; // 操作级加载状态
}

// 定义侧边栏状态接口
export interface SidebarState {
  collapsed: boolean;
  width: number;
  activeMenu: string;
  pinned: boolean;
}

// 定义布局状态接口
export interface LayoutState {
  headerHeight: number;
  footerHeight: number;
  contentPadding: number;
  showHeader: boolean;
  showFooter: boolean;
  showSidebar: boolean;
}

// 定义搜索状态接口
export interface SearchState {
  visible: boolean;
  query: string;
  results: any[];
  loading: boolean;
  history: string[];
  suggestions: string[];
}

// 定义快捷键状态接口
export interface ShortcutState {
  enabled: boolean;
  customShortcuts: Record<string, string>;
}

// 定义 UI 状态接口
export interface UIState {
  loading: LoadingState;
  notifications: Notification[];
  modals: Modal[];
  sidebar: SidebarState;
  layout: LayoutState;
  search: SearchState;
  shortcuts: ShortcutState;
  dragAndDrop: {
    isDragging: boolean;
    dragType: string | null;
    dragData: any;
  };
  selection: {
    selectedItems: string[];
    selectionMode: boolean;
  };
  viewport: {
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
  };
  preferences: {
    animations: boolean;
    soundEffects: boolean;
    autoSave: boolean;
    confirmBeforeDelete: boolean;
  };
}

// 初始状态
const initialState: UIState = {
  loading: {
    global: false,
    components: {},
    operations: {},
  },
  notifications: [],
  modals: [],
  sidebar: {
    collapsed: false,
    width: 240,
    activeMenu: 'dashboard',
    pinned: true,
  },
  layout: {
    headerHeight: 64,
    footerHeight: 48,
    contentPadding: 24,
    showHeader: true,
    showFooter: true,
    showSidebar: true,
  },
  search: {
    visible: false,
    query: '',
    results: [],
    loading: false,
    history: [],
    suggestions: [],
  },
  shortcuts: {
    enabled: true,
    customShortcuts: {},
  },
  dragAndDrop: {
    isDragging: false,
    dragType: null,
    dragData: null,
  },
  selection: {
    selectedItems: [],
    selectionMode: false,
  },
  viewport: {
    width: window.innerWidth || 1920,
    height: window.innerHeight || 1080,
    isMobile: false,
    isTablet: false,
  },
  preferences: {
    animations: true,
    soundEffects: false,
    autoSave: true,
    confirmBeforeDelete: true,
  },
};

// 生成唯一 ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 创建 slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // 加载状态管理
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    
    setComponentLoading: (state, action: PayloadAction<{ component: string; loading: boolean }>) => {
      const { component, loading } = action.payload;
      state.loading.components[component] = loading;
    },
    
    setOperationLoading: (state, action: PayloadAction<{ operation: string; loading: boolean }>) => {
      const { operation, loading } = action.payload;
      state.loading.operations[operation] = loading;
    },
    
    clearComponentLoading: (state, action: PayloadAction<string>) => {
      delete state.loading.components[action.payload];
    },
    
    clearOperationLoading: (state, action: PayloadAction<string>) => {
      delete state.loading.operations[action.payload];
    },
    
    // 通知管理
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: generateId(),
        createdAt: Date.now(),
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    updateNotification: (state, action: PayloadAction<{ id: string; updates: Partial<Notification> }>) => {
      const { id, updates } = action.payload;
      const notification = state.notifications.find(n => n.id === id);
      if (notification) {
        Object.assign(notification, updates);
      }
    },
    
    // 模态框管理
    openModal: (state, action: PayloadAction<Omit<Modal, 'id'>>) => {
      const modal: Modal = {
        ...action.payload,
        id: generateId(),
      };
      state.modals.push(modal);
    },
    
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(m => m.id !== action.payload);
    },
    
    closeAllModals: (state) => {
      state.modals = [];
    },
    
    updateModal: (state, action: PayloadAction<{ id: string; updates: Partial<Modal> }>) => {
      const { id, updates } = action.payload;
      const modal = state.modals.find(m => m.id === id);
      if (modal) {
        Object.assign(modal, updates);
      }
    },
    
    // 侧边栏管理
    toggleSidebar: (state) => {
      state.sidebar.collapsed = !state.sidebar.collapsed;
    },
    
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebar.collapsed = action.payload;
    },
    
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebar.width = action.payload;
    },
    
    setActiveMenu: (state, action: PayloadAction<string>) => {
      state.sidebar.activeMenu = action.payload;
    },
    
    toggleSidebarPin: (state) => {
      state.sidebar.pinned = !state.sidebar.pinned;
    },
    
    // 布局管理
    updateLayout: (state, action: PayloadAction<Partial<LayoutState>>) => {
      state.layout = { ...state.layout, ...action.payload };
    },
    
    toggleLayoutElement: (state, action: PayloadAction<'header' | 'footer' | 'sidebar'>) => {
      const element = action.payload;
      switch (element) {
        case 'header':
          state.layout.showHeader = !state.layout.showHeader;
          break;
        case 'footer':
          state.layout.showFooter = !state.layout.showFooter;
          break;
        case 'sidebar':
          state.layout.showSidebar = !state.layout.showSidebar;
          break;
      }
    },
    
    // 搜索管理
    toggleSearch: (state) => {
      state.search.visible = !state.search.visible;
      if (!state.search.visible) {
        state.search.query = '';
        state.search.results = [];
      }
    },
    
    setSearchVisible: (state, action: PayloadAction<boolean>) => {
      state.search.visible = action.payload;
      if (!action.payload) {
        state.search.query = '';
        state.search.results = [];
      }
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.search.query = action.payload;
    },
    
    setSearchResults: (state, action: PayloadAction<any[]>) => {
      state.search.results = action.payload;
    },
    
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.search.loading = action.payload;
    },
    
    addSearchHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.search.history.includes(query)) {
        state.search.history.unshift(query);
        // 限制历史记录长度
        if (state.search.history.length > 20) {
          state.search.history = state.search.history.slice(0, 20);
        }
      }
    },
    
    clearSearchHistory: (state) => {
      state.search.history = [];
    },
    
    setSearchSuggestions: (state, action: PayloadAction<string[]>) => {
      state.search.suggestions = action.payload;
    },
    
    // 快捷键管理
    toggleShortcuts: (state) => {
      state.shortcuts.enabled = !state.shortcuts.enabled;
    },
    
    setCustomShortcut: (state, action: PayloadAction<{ action: string; shortcut: string }>) => {
      const { action: actionName, shortcut } = action.payload;
      state.shortcuts.customShortcuts[actionName] = shortcut;
    },
    
    removeCustomShortcut: (state, action: PayloadAction<string>) => {
      delete state.shortcuts.customShortcuts[action.payload];
    },
    
    // 拖拽管理
    startDrag: (state, action: PayloadAction<{ type: string; data: any }>) => {
      const { type, data } = action.payload;
      state.dragAndDrop.isDragging = true;
      state.dragAndDrop.dragType = type;
      state.dragAndDrop.dragData = data;
    },
    
    endDrag: (state) => {
      state.dragAndDrop.isDragging = false;
      state.dragAndDrop.dragType = null;
      state.dragAndDrop.dragData = null;
    },
    
    // 选择管理
    toggleSelectionMode: (state) => {
      state.selection.selectionMode = !state.selection.selectionMode;
      if (!state.selection.selectionMode) {
        state.selection.selectedItems = [];
      }
    },
    
    setSelectionMode: (state, action: PayloadAction<boolean>) => {
      state.selection.selectionMode = action.payload;
      if (!action.payload) {
        state.selection.selectedItems = [];
      }
    },
    
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.selection.selectedItems.indexOf(itemId);
      if (index > -1) {
        state.selection.selectedItems.splice(index, 1);
      } else {
        state.selection.selectedItems.push(itemId);
      }
    },
    
    selectAllItems: (state, action: PayloadAction<string[]>) => {
      state.selection.selectedItems = action.payload;
    },
    
    clearSelection: (state) => {
      state.selection.selectedItems = [];
    },
    
    // 视口管理
    updateViewport: (state, action: PayloadAction<{ width: number; height: number }>) => {
      const { width, height } = action.payload;
      state.viewport.width = width;
      state.viewport.height = height;
      state.viewport.isMobile = width < 768;
      state.viewport.isTablet = width >= 768 && width < 1024;
    },
    
    // 偏好设置管理
    updatePreferences: (state, action: PayloadAction<Partial<UIState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    togglePreference: (state, action: PayloadAction<keyof UIState['preferences']>) => {
      const key = action.payload;
      state.preferences[key] = !state.preferences[key];
    },
  },
});

// 导出 actions
export const {
  // 加载状态
  setGlobalLoading,
  setComponentLoading,
  setOperationLoading,
  clearComponentLoading,
  clearOperationLoading,
  
  // 通知
  addNotification,
  removeNotification,
  clearAllNotifications,
  updateNotification,
  
  // 模态框
  openModal,
  closeModal,
  closeAllModals,
  updateModal,
  
  // 侧边栏
  toggleSidebar,
  setSidebarCollapsed,
  setSidebarWidth,
  setActiveMenu,
  toggleSidebarPin,
  
  // 布局
  updateLayout,
  toggleLayoutElement,
  
  // 搜索
  toggleSearch,
  setSearchVisible,
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  addSearchHistory,
  clearSearchHistory,
  setSearchSuggestions,
  
  // 快捷键
  toggleShortcuts,
  setCustomShortcut,
  removeCustomShortcut,
  
  // 拖拽
  startDrag,
  endDrag,
  
  // 选择
  toggleSelectionMode,
  setSelectionMode,
  toggleItemSelection,
  selectAllItems,
  clearSelection,
  
  // 视口
  updateViewport,
  
  // 偏好设置
  updatePreferences,
  togglePreference,
} = uiSlice.actions;

// 导出 reducer
export default uiSlice.reducer;

// 导出选择器
export const selectLoading = (state: { ui: UIState }) => state.ui.loading;
export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.loading.global;
export const selectComponentLoading = (component: string) => (state: { ui: UIState }) => 
  state.ui.loading.components[component] || false;
export const selectOperationLoading = (operation: string) => (state: { ui: UIState }) => 
  state.ui.loading.operations[operation] || false;

export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectModals = (state: { ui: UIState }) => state.ui.modals;
export const selectSidebar = (state: { ui: UIState }) => state.ui.sidebar;
export const selectLayout = (state: { ui: UIState }) => state.ui.layout;
export const selectSearch = (state: { ui: UIState }) => state.ui.search;
export const selectShortcuts = (state: { ui: UIState }) => state.ui.shortcuts;
export const selectDragAndDrop = (state: { ui: UIState }) => state.ui.dragAndDrop;
export const selectSelection = (state: { ui: UIState }) => state.ui.selection;
export const selectViewport = (state: { ui: UIState }) => state.ui.viewport;
export const selectPreferences = (state: { ui: UIState }) => state.ui.preferences;

// 复合选择器
export const selectIsLoading = (state: { ui: UIState }) => {
  const { global, components, operations } = state.ui.loading;
  return global || Object.values(components).some(Boolean) || Object.values(operations).some(Boolean);
};

export const selectActiveModal = (state: { ui: UIState }) => {
  const modals = state.ui.modals;
  return modals.length > 0 ? modals[modals.length - 1] : null;
};

export const selectHasSelection = (state: { ui: UIState }) => 
  state.ui.selection.selectedItems.length > 0;

export const selectIsMobile = (state: { ui: UIState }) => state.ui.viewport.isMobile;
export const selectIsTablet = (state: { ui: UIState }) => state.ui.viewport.isTablet;
export const selectIsDesktop = (state: { ui: UIState }) => 
  !state.ui.viewport.isMobile && !state.ui.viewport.isTablet;