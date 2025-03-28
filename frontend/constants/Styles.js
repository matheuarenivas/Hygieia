/**
 * Global styles for the application
 */
import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const Typography = {
  heading1: {
    fontFamily: 'ManropeBold',
    fontSize: 28,
    color: Colors.dark.text,
  },
  heading2: {
    fontFamily: 'ManropeSemiBold',
    fontSize: 24,
    color: Colors.dark.text,
  },
  heading3: {
    fontFamily: 'ManropeMedium',
    fontSize: 20,
    color: Colors.dark.text,
  },
  subtitle: {
    fontFamily: 'ManropeMedium',
    fontSize: 16,
    color: Colors.dark.text,
  },
  body: {
    fontFamily: 'Manrope',
    fontSize: 14,
    color: Colors.dark.text,
  },
  caption: {
    fontFamily: 'Manrope',
    fontSize: 12,
    color: Colors.dark.icon,
  },
  button: {
    fontFamily: 'ManropeSemiBold',
    fontSize: 16,
    color: Colors.dark.tint,
  },
  navLabel: {
    fontFamily: 'Manrope',
    fontSize: 12,
    marginTop: 4,
  },
};

// The navbar height to account for in padding
export const NAVBAR_HEIGHT = 90;

export const Layouts = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  screenWithNav: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingBottom: NAVBAR_HEIGHT,
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    margin: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const Buttons = StyleSheet.create({
  primary: {
    backgroundColor: Colors.dark.tint,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  secondary: {
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    fontFamily: 'ManropeSemiBold',
    fontSize: 16,
  },
}); 