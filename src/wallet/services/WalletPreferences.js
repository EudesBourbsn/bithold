import { t } from '../../i18n/core.js';
import { allowsNotifications } from '../../services/notificationPermission.js';
import { validBlockExplorer } from '../config/blockExplorers.js';
import { CURRENCY_CODES } from '../config/currencies.js';
import { DEFAULT_PREFERENCES } from '../config/preferences.js';
import { validRate } from '../network/rates.js';

export class WalletPreferences {
  constructor(engine) {
    this.engine = engine;
  }
  async preference(key, value) {
    const engine = this.engine;
    if (!(key in DEFAULT_PREFERENCES)) {
      throw new Error(t('error.preferences.unknownPreference'));
    }
    const currencyRequest =
      key === 'currency'
        ? (engine.currencyRequest = (engine.currencyRequest ?? 0) + 1)
        : null;
    if (key === 'blockExplorer' && !validBlockExplorer(value)) {
      throw new Error(t('settings.explorer.invalidUrl'));
    }
    if (key === 'currency') {
      if (!CURRENCY_CODES.includes(value)) {
        throw new Error(t('error.rates.unsupportedCurrency'));
      }
      if (!validRate(engine.market.quotes[value])) {
        await engine.refreshRates(value);
        if (currencyRequest !== engine.currencyRequest) {
          return;
        }
        if (!validRate(engine.market.quotes[value])) {
          throw new Error(
            t('error.preferences.priceUnavailable', { currency: value }),
          );
        }
      }
    }
    if (key === 'currency') {
      // A valid rate is enough to switch; the chart is fetched here so the
      // price card has it, and again in the background below if it failed.
      if (!engine.market.charts[value]) {
        await engine.refreshChart(value);
      }
      if (currencyRequest !== engine.currencyRequest) {
        return;
      }
    }
    if (key === 'notifications') {
      if (this.notificationUpdate) {
        return this.notificationUpdate;
      }
      this.notificationUpdate = this.setNotifications(Boolean(value));
      try {
        return await this.notificationUpdate;
      } finally {
        this.notificationUpdate = null;
      }
    }
    const previous = engine.state.preferences;
    engine.state.preferences = {
      ...engine.state.preferences,
      [key]: value,
    };
    try {
      await engine.save();
    } catch (error) {
      // A failed write leaves memory, storage and the UI in agreement.
      engine.state.preferences = previous;
      engine.emit();
      throw error;
    }
    engine.emit();
    if (key === 'currency') {
      engine.refreshMarket().catch(() => {});
    }
  }
  async setNotifications(enabled) {
    const engine = this.engine;
    if (enabled) {
      const status = await engine.native.requestNotificationPermission();
      if (!allowsNotifications(status)) {
        const error = new Error(t('settings.notificationsDenied'));
        error.code = 'notification_denied';
        throw error;
      }
    }
    const previous = engine.state.preferences.notifications;
    engine.state.preferences = {
      ...engine.state.preferences,
      notifications: enabled,
    };
    try {
      await engine.save();
    } catch (error) {
      engine.state.preferences = {
        ...engine.state.preferences,
        notifications: previous,
      };
      engine.emit();
      throw error;
    }
    engine.emit();
  }
}
