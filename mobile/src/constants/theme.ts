import { createTheme } from '@rneui/themed';

export const theme = createTheme({
  lightColors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#f8fafc',
    white: '#ffffff',
    black: '#0f172a',
    grey0: '#f1f5f9',
    grey1: '#e2e8f0',
    grey2: '#cbd5e1',
    grey3: '#94a3b8',
    grey4: '#64748b',
    grey5: '#475569',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    divider: '#e2e8f0',
  },
  darkColors: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    background: '#0f0f23',
    white: '#0f172a',
    black: '#f8fafc',
    grey0: '#1e293b',
    grey1: '#334155',
    grey2: '#475569',
    grey3: '#64748b',
    grey4: '#94a3b8',
    grey5: '#cbd5e1',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    divider: '#334155',
  },
  mode: 'dark',
  components: {
    Button: {
      raised: true,
      borderRadius: 12,
      titleStyle: {
        fontWeight: '600',
      },
    },
    Card: {
      containerStyle: {
        borderRadius: 16,
        padding: 16,
        margin: 8,
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    },
    Input: {
      containerStyle: {
        marginBottom: 8,
      },
      inputContainerStyle: {
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 4,
      },
      inputStyle: {
        fontSize: 16,
      },
    },
  },
});

export const COLORS = {
  primary: '#6366f1',
  primaryLight: '#818cf8',
  secondary: '#8b5cf6',
  accent: '#ec4899',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  background: '#0f0f23',
  surface: '#1e1e3f',
  surfaceLight: '#2a2a50',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  border: '#334155',
  divider: '#1e293b',
  gradientStart: '#6366f1',
  gradientEnd: '#8b5cf6',
  cardBg: '#1e1e3f',
  chipBg: '#2a2a50',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    default: 'easeInOut',
    bounce: 'spring',
  },
};
