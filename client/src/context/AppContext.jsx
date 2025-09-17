import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from '../components/Toast';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  theme: 'dark',
  language: 'en',
  notifications: [],
  loading: false,
  error: null,
};

// Action types
export const ActionTypes = {
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        notifications: [],
        error: null,
      };
    
    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    
    case ActionTypes.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
    
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const toast = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: ActionTypes.SET_USER, payload: user });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch({ type: ActionTypes.SET_THEME, payload: savedTheme });
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
  }, [state.theme]);

  // Actions
  const actions = {
    setUser: (user) => {
      dispatch({ type: ActionTypes.SET_USER, payload: user });
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
    },

    logout: () => {
      dispatch({ type: ActionTypes.LOGOUT });
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
    },

    setTheme: (theme) => {
      dispatch({ type: ActionTypes.SET_THEME, payload: theme });
    },

    setLanguage: (language) => {
      dispatch({ type: ActionTypes.SET_LANGUAGE, payload: language });
    },

    addNotification: (notification) => {
      const id = Date.now() + Math.random();
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: { ...notification, id },
      });
    },

    removeNotification: (id) => {
      dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
    },

    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      toast.error(error);
    },

    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    },
  };

  // Computed values
  const computed = {
    isStartup: state.user?.role === 'startup',
    isInvestor: state.user?.role === 'investor',
    hasProfile: state.user?.hasFilledForm || false,
    userName: state.user?.name || state.user?.fullName || 'User',
    userEmail: state.user?.email || '',
  };

  const value = {
    ...state,
    ...actions,
    ...computed,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// HOC for components that need app context
export const withApp = (Component) => {
  return (props) => {
    const app = useApp();
    return <Component {...props} app={app} />;
  };
};

export default AppContext;
