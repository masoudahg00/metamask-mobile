/* eslint-disable import/prefer-default-export */
import { StyleSheet } from 'react-native';

// TODO: Replace "any" with type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 16,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background.default,
    },
    header: {
      alignItems: 'center',
    },
    headerLogo: {
      width: 67,
      height: 32,
    },
    content: {
      justifyContent: 'center',
      paddingHorizontal: 16,
      flexGrow: 1,
    },
    title: {
      textAlign: 'center',
      paddingBottom: 16,
    },
    description: {
      textAlign: 'center',
    },
    images: {
      alignItems: 'center',
      marginBottom: 40,
    },
    actionButtonWrapper: {
      width: '100%',
      padding: 16,
    },
    actionButton: {
      height: undefined,
      marginVertical: 10,
      padding: 8,
    },
    foxImage: {
      width: 140,
      height: 140,
    },
  });
