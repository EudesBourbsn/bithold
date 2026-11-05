import { inputProps } from '../../../theme/inputTheme';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Icon } from '../../../components/icons/Icon';
import { SheetNavigationButton } from '../../../components/sheets/SheetNavigationButton';
import { sheetMetrics, typography } from '../../../theme/index';
import {
  BLOCK_EXPLORERS,
  isCustomExplorer,
  normalizeExplorerUrl,
  validExplorerUrl,
} from '../../../wallet/config/blockExplorers';
import currencies from '../data/currencies.json';
import languages from '../data/languages.json';
import { currencySymbol } from '../../send/domain/amount';
import { styles } from '../styles/SettingsPreferences.styles.js';
import { SettingsModal } from './SettingsModal';
import { SettingsHeader } from './SettingsRow';
import { SettingsSelectionRow } from './SettingsSelectionRow';

function currencyTitle(code) {
  const symbol = currencySymbol(code);
  return symbol && symbol !== code ? `${code} (${symbol})` : code;
}

export function PreferencePickerModal({
  visible,
  picker,
  closePicker,
  searching,
  setSearching,
  query,
  setQuery,
  displayedCurrency,
  selectCurrency,
  preferences,
  selectUnit,
  toggleFixedPrecision,
  language,
  selectLanguage,
  selectExplorer,
  t,
}) {
  const explorer = preferences.blockExplorer;
  const custom = isCustomExplorer(explorer);
  const [editingCustom, setEditingCustom] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const customSaved = useRef(false);
  useEffect(() => {
    setEditingCustom(false);
    setCustomUrl(custom ? explorer : '');
    customSaved.current = false;
    // Reset only when the picker opens again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picker.key]);
  const saveCustom = ({ quiet = false } = {}) => {
    const url = normalizeExplorerUrl(customUrl);
    if (!validExplorerUrl(url)) {
      if (!quiet) {
        Alert.alert(
          t('settings.row.blockExplorer'),
          t('settings.explorer.invalidUrl'),
        );
      }
      return;
    }
    if (customSaved.current || url === explorer) {
      return;
    }
    customSaved.current = true;
    Keyboard.dismiss();
    selectExplorer(url);
  };
  const filtered = currencies.filter(([code, name]) =>
    `${code} ${t(`currency.${code}`)} ${name}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const currencyHeader = (
    <SettingsHeader
      title={t('settings.setCurrency')}
      right={
        !searching && (
          <SheetNavigationButton
            icon="searchSmall"
            size={sheetMetrics.search.iconSize}
            label={t('settings.searchCurrencies')}
            onPress={() => setSearching(true)}
          />
        )
      }
    >
      {searching && (
        <View style={styles.searchField}>
          <View pointerEvents="none" style={styles.searchIcon}>
            <SettingsSearch />
          </View>
          <TextInput
            {...inputProps}
            accessibilityLabel={t('settings.searchCurrencies')}
            placeholder={t('settings.searchCurrencies')}
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCorrect={false}
            style={styles.searchInput}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('settings.closeSearch')}
            hitSlop={sheetMetrics.header.hitSlop}
            onPress={() => {
              Keyboard.dismiss();
              setQuery('');
              setSearching(false);
            }}
            style={styles.clear}
          >
            <Icon name="searchClear" size={10} />
          </Pressable>
        </View>
      )}
    </SettingsHeader>
  );
  const currencyContent = (
    <>
      <View style={styles.list}>
        {filtered.length ? (
          filtered.map(([code], index) => (
            <SettingsSelectionRow
              key={code}
              plain
              last={index === filtered.length - 1}
              title={currencyTitle(code)}
              subtitle={t(`currency.${code}`)}
              selected={displayedCurrency === code}
              onPress={() => selectCurrency(code)}
            />
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={typography.settingsRow}>
              {t('settings.noCurrencies')}
            </Text>
            <Text style={typography.secondary}>
              {t('settings.noCurrenciesHint')}
            </Text>
          </View>
        )}
      </View>
    </>
  );
  const unitHeader = <SettingsHeader title={t('settings.row.unit')} />;
  const unitContent = (
    <View style={styles.unitList}>
      <SettingsSelectionRow
        radio
        title="BTC"
        selected={preferences.unit === 'BTC'}
        onPress={() => selectUnit('BTC')}
      />
      <SettingsSelectionRow
        checkbox
        title={t('settings.unit.fixedPrecision')}
        selected={preferences.fixedPrecision}
        onPress={toggleFixedPrecision}
      />
      <View style={styles.unitDivider} />
      <SettingsSelectionRow
        radio
        title="satoshi"
        subtitle="1 BTC = 100,000,000 sat"
        selected={preferences.unit === 'sats'}
        onPress={() => selectUnit('sats')}
      />
    </View>
  );

  const languageHeader = (
    <SettingsHeader title={t('settings.selectLanguage')} />
  );
  const languageContent = (
    <>
      <View style={[styles.list, styles.languageChoices]}>
        {languages.map(([locale, label], index) => (
          <SettingsSelectionRow
            key={locale}
            plain
            last={index === languages.length - 1}
            title={label}
            selected={language === locale}
            onPress={() => selectLanguage(locale)}
          />
        ))}
      </View>
    </>
  );
  const explorerHeader = (
    <SettingsHeader title={t('settings.row.blockExplorer')} />
  );
  const explorerContent = (
    <>
      <View style={[styles.choices, styles.languageChoices]}>
        {BLOCK_EXPLORERS.map(({ id, name, url }) => (
          <SettingsSelectionRow
            key={id}
            title={name}
            subtitle={url.replace(/^https:\/\//, '')}
            selected={explorer === id}
            onPress={() => selectExplorer(id)}
          />
        ))}
        <SettingsSelectionRow
          title={t('settings.explorer.custom')}
          subtitle={
            custom
              ? explorer.replace(/^https?:\/\//, '')
              : t('settings.explorer.customSubtitle')
          }
          selected={custom}
          onPress={() => setEditingCustom(true)}
        />
        {(editingCustom || custom) && (
          <View style={[styles.searchField, styles.explorerField]}>
            <TextInput
              {...inputProps}
              accessibilityLabel={t('settings.explorer.urlPlaceholder')}
              placeholder={t('settings.explorer.urlPlaceholder')}
              value={customUrl}
              onChangeText={value => {
                customSaved.current = false;
                setCustomUrl(value);
              }}
              autoFocus={editingCustom}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              keyboardType="url"
              textContentType="URL"
              returnKeyType="done"
              onSubmitEditing={() => saveCustom()}
              onEndEditing={() => saveCustom({ quiet: true })}
              style={[styles.searchInput, styles.explorerInput]}
            />
          </View>
        )}
      </View>
    </>
  );
  const pickers = {
    currency: { header: currencyHeader, content: currencyContent },
    unit: { header: unitHeader, content: unitContent },
    language: { header: languageHeader, content: languageContent },
    blockExplorer: { header: explorerHeader, content: explorerContent },
  };

  return (
    <SettingsModal
      visible={visible && picker.open}
      requestKey={picker.key}
      onClose={closedKey => {
        if (closedKey === picker.key) {
          Keyboard.dismiss();
          closePicker();
        }
      }}
      header={pickers[picker.kind].header}
      step={picker.kind}
      rootStep={picker.kind}
    >
      {pickers[picker.kind].content}
    </SettingsModal>
  );
}
function SettingsSearch() {
  return <Icon name="searchSmall" size={sheetMetrics.search.iconSize} />;
}
