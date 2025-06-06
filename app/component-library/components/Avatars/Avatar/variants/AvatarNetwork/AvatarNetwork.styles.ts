// Third party dependencies.
import { StyleSheet, ViewStyle } from 'react-native';

// External dependencies.
import { AvatarSize } from '../../Avatar.types';
import { Theme } from '../../../../../../util/theme/models';

// Internal dependencies.
import { AvatarNetworkStyleSheetVars } from './AvatarNetwork.types';

/**
 * Style sheet function for AvatarNetwork component.
 *
 * @param params Style sheet params.
 * @param params.theme App theme from ThemeContext.
 * @param params.vars AvatarNetwork stylesheet vars.
 * @returns StyleSheet object.
 */
const styleSheet = (params: {
  theme: Theme;
  vars: AvatarNetworkStyleSheetVars;
}) => {
  const { vars, theme } = params;
  const { size, style, showFallback } = vars;
  const baseStyle: ViewStyle = showFallback
    ? {
        backgroundColor: theme.colors.background.alternative,
        borderWidth: 1,
      }
    : {
        borderRadius: size === AvatarSize.Xs ? 4 : 8,
      };
  return StyleSheet.create({
    base: Object.assign(
      { justifyContent: 'center', alignItems: 'center' },
      baseStyle,
      style,
    ) as ViewStyle,
    label:
      // Temporarily lower font size in XS size to prevent cut off
      size === AvatarSize.Xs ? { lineHeight: undefined, fontSize: 10 } : {},
    image: {
      height: Number(size),
      width: Number(size),
    },
  });
};

export default styleSheet;
