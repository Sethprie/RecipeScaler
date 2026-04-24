import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Text,
  TouchableOpacity 
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTranslation } from 'react-i18next';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AdBanner } from '@/components/ads/AdBanner';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const settings = useSettingsStore((state) => state.settings);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setPremium = useSettingsStore((state) => state.setPremium);

  const handleLanguageChange = (language: 'es' | 'en') => {
    setLanguage(language);
    i18n.changeLanguage(language);
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setTheme(theme);
  };

  const handleGetPremium = () => {
    // Stub for premium purchase
    Alert.alert(
      t('settings.premium.title'),
      t('settings.premium.description'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.premium.upgrade'),
          style: 'default',
          onPress: () => {
            // Simulate premium upgrade
            setPremium(true);
            Alert.alert(t('settings.premium.success'), t('settings.premium.thankYou'));
          },
        },
      ]
    );
  };

  const renderLanguageSection = () => (
    <View style={styles.section}>
      <Text style={[typography.headingMedium, { color: colors.textPrimary }]}>
        {t('settings.language.title')}
      </Text>
      <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: spacing.xs }]}>
        {t('settings.language.description')}
      </Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            {
              backgroundColor: settings.language === 'es' ? colors.primaryLight : colors.surface,
              borderColor: settings.language === 'es' ? colors.primary : colors.border,
            }
          ]}
          onPress={() => handleLanguageChange('es')}
          testID="language-es"
        >
          <Text style={[
            typography.bodyLarge,
            {
              color: settings.language === 'es' ? colors.primary : colors.textPrimary
            }
          ]}>
            Español
          </Text>
          {settings.language === 'es' && (
            <Text style={[typography.bodySmall, { color: colors.primary }]}>
              {t('common.selected')}
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            {
              backgroundColor: settings.language === 'en' ? colors.primaryLight : colors.surface,
              borderColor: settings.language === 'en' ? colors.primary : colors.border,
            }
          ]}
          onPress={() => handleLanguageChange('en')}
          testID="language-en"
        >
          <Text style={[
            typography.bodyLarge,
            {
              color: settings.language === 'en' ? colors.primary : colors.textPrimary
            }
          ]}>
            English
          </Text>
          {settings.language === 'en' && (
            <Text style={[typography.bodySmall, { color: colors.primary }]}>
              {t('common.selected')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderThemeSection = () => (
    <View style={styles.section}>
      <Text style={[typography.headingMedium, { color: colors.textPrimary }]}>
        {t('settings.theme.title')}
      </Text>
      <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: spacing.xs }]}>
        {t('settings.theme.description')}
      </Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            {
              backgroundColor: settings.theme === 'light' ? colors.primaryLight : colors.surface,
              borderColor: settings.theme === 'light' ? colors.primary : colors.border,
            }
          ]}
          onPress={() => handleThemeChange('light')}
          testID="theme-light"
        >
          <Text style={[
            typography.bodyLarge,
            {
              color: settings.theme === 'light' ? colors.primary : colors.textPrimary
            }
          ]}>
            {t('settings.theme.light')}
          </Text>
          {settings.theme === 'light' && (
            <Text style={[typography.bodySmall, { color: colors.primary }]}>
              {t('common.selected')}
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            {
              backgroundColor: settings.theme === 'dark' ? colors.primaryLight : colors.surface,
              borderColor: settings.theme === 'dark' ? colors.primary : colors.border,
            }
          ]}
          onPress={() => handleThemeChange('dark')}
          testID="theme-dark"
        >
          <Text style={[
            typography.bodyLarge,
            {
              color: settings.theme === 'dark' ? colors.primary : colors.textPrimary
            }
          ]}>
            {t('settings.theme.dark')}
          </Text>
          {settings.theme === 'dark' && (
            <Text style={[typography.bodySmall, { color: colors.primary }]}>
              {t('common.selected')}
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            {
              backgroundColor: settings.theme === 'system' ? colors.primaryLight : colors.surface,
              borderColor: settings.theme === 'system' ? colors.primary : colors.border,
            }
          ]}
          onPress={() => handleThemeChange('system')}
          testID="theme-system"
        >
          <Text style={[
            typography.bodyLarge,
            {
              color: settings.theme === 'system' ? colors.primary : colors.textPrimary
            }
          ]}>
            {t('settings.theme.system')}
          </Text>
          {settings.theme === 'system' && (
            <Text style={[typography.bodySmall, { color: colors.primary }]}>
              {t('common.selected')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPremiumSection = () => (
    <View style={styles.section}>
      <Text style={[typography.headingMedium, { color: colors.textPrimary }]}>
        {t('settings.premium.title')}
      </Text>
      <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: spacing.xs }]}>
        {t('settings.premium.description')}
      </Text>
      
      {settings.isPremium ? (
        <View style={[styles.premiumStatus, { backgroundColor: colors.primaryLight }]}>
          <Text style={[typography.bodyMedium, { color: colors.primary }]}>
            {t('settings.premium.active')}
          </Text>
        </View>
      ) : (
        <PrimaryButton
          label={t('settings.premium.upgrade')}
          onPress={handleGetPremium}
          style={styles.upgradeButton}
          testID="upgrade-button"
        />
      )}
    </View>
  );

  const renderAboutSection = () => (
    <View style={styles.section}>
      <Text style={[typography.headingMedium, { color: colors.textPrimary }]}>
        {t('settings.about.title')}
      </Text>
      
      <View style={styles.aboutInfo}>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}>
          {t('settings.about.version')}: {Constants.expoConfig?.version || '1.0.0'}
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textDisabled, marginTop: spacing.xs }]}>
          {t('settings.about.build')}: {Constants.expoConfig?.extra?.eas?.projectId || 'dev'}
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textDisabled, marginTop: spacing.sm }]}>
          {t('settings.about.credits')}
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textDisabled, marginTop: spacing.xs }]}>
          {t('settings.about.madeWith')} ❤️
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Ad Banner */}
        <AdBanner testID="settings-ad-banner" />
        
        {/* Language Section */}
        {renderLanguageSection()}
        
        {/* Theme Section */}
        {renderThemeSection()}
        
        {/* Premium Section */}
        {renderPremiumSection()}
        
        {/* About Section */}
        {renderAboutSection()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  optionsContainer: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  option: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumStatus: {
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  upgradeButton: {
    marginTop: spacing.md,
  },
  aboutInfo: {
    marginTop: spacing.md,
    gap: spacing.xs,
  },
});
