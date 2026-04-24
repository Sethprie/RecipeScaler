import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

// Import i18n configuration to ensure it's initialized
import '@/i18n';

const TestI18n: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={{ padding: 20 }}>
      <Text testID="home-title">{t('home.title')}</Text>
      <Text testID="common-save">{t('common.save')}</Text>
      <Text testID="create-title">{t('create.title')}</Text>
      <Text testID="settings-title">{t('settings.title')}</Text>
    </View>
  );
};

export default TestI18n;
