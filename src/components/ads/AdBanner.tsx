import React from 'react';
import { View, Text } from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';
import { AD_UNIT_IDS } from './adConfig';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

// Try to load Google Mobile Ads components at module level
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;
let isGoogleMobileAdsAvailable = false;

try {
  // Dynamic require with try-catch for Expo Go compatibility
  const GoogleMobileAds = require('react-native-google-mobile-ads');
  BannerAd = GoogleMobileAds.BannerAd;
  BannerAdSize = GoogleMobileAds.BannerAdSize;
  TestIds = GoogleMobileAds.TestIds;
  isGoogleMobileAdsAvailable = true;
} catch (error) {
  // Google Mobile Ads SDK not available (Expo Go)
  console.log('Google Mobile Ads SDK not available, will show placeholder');
}

interface AdBannerProps {
  style?: any;
  testID?: string;
}

/**
 * AdBanner component that renders a banner ad or null if user is premium.
 * According to ARCHITECTURE.md §7:
 * - Free tier: Shows banner ads at bottom of screens (except during active rescaling)
 * - Premium tier: Returns null unconditionally
 * 
 * Fallback: If Google Mobile Ads SDK is not available (Expo Go), shows a placeholder
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

  // If SDK is not available, show placeholder
  if (!isGoogleMobileAdsAvailable || !BannerAd || !BannerAdSize || !TestIds) {
    return (
      <View 
        style={[
          { 
            height: 50, 
            backgroundColor: '#f0f0f0', 
            justifyContent: 'center', 
            alignItems: 'center',
            alignSelf: 'center',
            marginVertical: spacing.sm,
            borderRadius: 4,
          },
          style
        ]}
        testID={testID || 'ad-placeholder'}
      >
        <Text style={[typography.bodySmall, { color: '#666' }]}>
          [ Ad Placeholder ]
        </Text>
      </View>
    );
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
