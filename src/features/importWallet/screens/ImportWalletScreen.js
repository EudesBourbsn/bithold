import { Platform } from 'react-native';
import { NativeImportWalletScreen } from './NativeImportWalletScreen';
import { PhraseImportWalletScreen } from './PhraseImportWalletScreen';

export const ImportWalletScreen =
  Platform.OS === 'ios' && Number.parseInt(Platform.Version, 10) >= 17
    ? NativeImportWalletScreen
    : PhraseImportWalletScreen;
