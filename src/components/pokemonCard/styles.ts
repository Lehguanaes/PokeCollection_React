import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  nativeCard: {
    width: 320,
    maxWidth: '100%',
    minHeight: 148,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 2,
    padding: 12,
    gap: 12,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },

  nativeImageShell: {
    width: 94,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nativeImageRing: {
    width: 88,
    height: 88,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nativeImage: {
    width: 70,
    height: 70,
  },

  nativeContent: {
    flex: 1,
    minWidth: 0,
    gap: 7,
  },

  nativeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  nativeTitle: {
    flex: 1,
    color: Colors.subtitle,
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  nativeIndex: {
    fontSize: 12,
    fontWeight: '900',
  },

  nativeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  nativeHpPill: {
    minWidth: 52,
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
  },

  nativeHpLabel: {
    color: Colors.gray[800],
    fontSize: 11,
    fontWeight: '800',
  },

  nativeHpValue: {
    fontSize: 13,
    fontWeight: '900',
  },

  nativeTypesRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  nativeTypePill: {
    minHeight: 28,
    maxWidth: 88,
    borderRadius: 999,
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  nativeTypeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'capitalize',
  },

  nativeStatsRow: {
    flexDirection: 'row',
    gap: 6,
  },

  nativeStatPill: {
    flex: 1,
    minHeight: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(102,205,170,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nativeStatName: {
    color: Colors.gray[500],
    fontSize: 9,
    fontWeight: '900',
  },

  nativeStatValue: {
    fontSize: 12,
    fontWeight: '900',
  },

  nativeDetailsButton: {
    alignSelf: 'flex-start',
    minHeight: 34,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
  },

  nativeDetailsText: {
    fontSize: 12,
    fontWeight: '900',
  },
});
