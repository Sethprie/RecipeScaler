import { useColorScheme } from 'react-native';
import { lightColors, darkColors, Colors } from '@/constants/colors';

export function useTheme(): {
  colors: Colors;
  isDark: boolean;
} {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
  };
}
