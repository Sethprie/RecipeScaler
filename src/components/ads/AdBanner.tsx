import React from 'react';
import { View } from 'react-native';
import { 
  BannerAd, 
  BannerAdSize, 
  TestIds 
} from 'react-native-google-mobile-ads';
import { useSettingsStore } from '@/store/useSettingsStore';
import { AD_UNIT_IDS } from './adConfig';

interface AdBannerProps {
  style?: any;
  testID?: string;
}

/**
 * AdBanner component that renders a banner ad or null if user is premium.
 * According to ARCHITECTURE.md §7:
 * - Free tier: Shows banner ads at bottom of screens (except during active rescaling)
 * - Premium tier: Returns null unconditionally
 */
export const AdBanner: React.FC<AdBannerProps> = ({ 
  style, 
  testID 
}) => {
  const isPremium = useSettingsStore((state) => state.settings.isPremium);

  // If user is premium, don't show ads
  if (isPremium) {
    return null;
  }

  // In development, use test IDs. In production, use real IDs
  const adUnitId = __DEV__ ? TestIds.BANNER : AD_UNIT_IDS.banner || TestIds.BANNER;

  return (
    <View 
      style={[{ alignSelf: 'center' }, style]}
      testID={testID || 'ad-banner'}
    >
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

export default AdBanner;
