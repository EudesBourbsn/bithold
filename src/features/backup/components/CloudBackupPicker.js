import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { impactFeedback } from '../../../services/feedback';
import { colors } from '../../../theme/index';
import { styles } from '../styles/CloudRestoreSheet.styles.js';
import { RestoreStatusIcon } from './RestoreStatusIcon';

function backupDate(time, locale) {
  const at = new Date(time);
  const month = at.toLocaleString(locale, { month: 'long' });
  const day = String(at.getDate()).padStart(2, '0');
  const period =
    new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true })
      .formatToParts(at)
      .find(part => part.type === 'dayPeriod')?.value ?? '';
  const minutes = String(at.getMinutes()).padStart(2, '0');
  return `${month} ${day}, ${at.getFullYear()}, ${at.getHours()}:${minutes}${
    period ? ` ${period}` : ''
  }`;
}

function BackupChevron({ direction = 'right' }) {
  return direction === 'right' ? (
    <Svg width={24} height={24} viewBox="0 0 24 24" style={styles.chevron}>
      <Path
        d="M9 6l6 6-6 6"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  ) : (
    <Svg width={8} height={4} viewBox="0 0 8 4">
      <Path
        d={direction === 'down' ? 'M.5.5 4 3.5 7.5.5' : 'M.5 3.5 4 .5l3.5 3'}
        stroke="#FFFFFF"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function ActiveBackupBadge({ label }) {
  return (
    <View pointerEvents="none" style={styles.active}>
      <Svg style={styles.activeGlow} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="activeGlow" x1="1" y1="0" x2="0" y2="0">
            <Stop offset={0} stopColor={colors.gold} stopOpacity={1} />
            <Stop offset={1} stopColor={colors.gold} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#activeGlow)" />
      </Svg>
      <View style={styles.tag}>
        <Svg style={styles.tagGradient} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="activeTag" x1="0" y1="0" x2="0" y2="1">
              <Stop offset={0} stopColor={colors.gold} />
              <Stop offset={1} stopColor="#9B7545" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#activeTag)" />
        </Svg>
        <Text allowFontScaling={false} style={styles.tagText}>
          {label}
        </Text>
      </View>
    </View>
  );
}

function BackupItem({ entry, index, locale, loading, disabled, onPress, t }) {
  const title = t('cloudRestore.backupName', { index });
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled}
      onPress={() => {
        impactFeedback();
        onPress(entry);
      }}
      style={styles.item}
    >
      <View style={styles.itemText}>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.itemTitle}
        >
          {title}
        </Text>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.itemDate}
        >
          {backupDate(entry.created, locale)}
        </Text>
      </View>
      {entry.active ? (
        <ActiveBackupBadge label={t('cloudRestore.active')} />
      ) : loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <BackupChevron />
      )}
    </TouchableOpacity>
  );
}

export function CloudBackupPicker({ entries, picking, onPick, t, locale }) {
  const [expanded, setExpanded] = useState(false);
  const row = (entry, i) => (
    <BackupItem
      key={entry.id}
      entry={entry}
      index={entries.length - i}
      locale={locale}
      loading={picking === entry.id}
      disabled={entry.active || !!picking}
      onPress={onPick}
      t={t}
    />
  );
  return (
    <View style={styles.picker}>
      <View style={styles.pickerPlate}>
        <RestoreStatusIcon symbol="icloud.fill" />
      </View>
      <Text
        accessibilityRole="header"
        allowFontScaling={false}
        style={styles.pickerTitle}
      >
        {t('cloudRestore.pickerTitle')}
      </Text>
      <Text allowFontScaling={false} style={styles.pickerSubtitle}>
        {t('cloudRestore.pickerSubtitle')}
      </Text>
      <View style={styles.list}>
        {entries.slice(0, 2).map(row)}
        {entries.length > 2 && (
          <>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{ expanded }}
              onPress={() => {
                impactFeedback();
                setExpanded(value => !value);
              }}
              style={styles.past}
            >
              <Text allowFontScaling={false} style={styles.pastText}>
                {t('cloudRestore.pastBackups')}
              </Text>
              <View style={styles.pastPill}>
                <BackupChevron direction={expanded ? 'up' : 'down'} />
              </View>
            </TouchableOpacity>
            {expanded && entries.slice(2).map((entry, i) => row(entry, i + 2))}
          </>
        )}
      </View>
    </View>
  );
}
