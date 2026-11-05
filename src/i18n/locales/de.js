// German, translated from en.js. Same keys; plural values use this
// language's CLDR categories.
export default {
  'import.recoveryTitle': 'Wiederherstellungsphrase',
  'import.tapToEnter':
    'Tippe, um deine Wiederherstellungsphrase einzugeben oder einzufügen…',
  'import.validPhrase': 'Gültige Wiederherstellungsphrase',
  'import.invalidChecksum':
    'Ungültige Wiederherstellungsphrase — Prüfsumme stimmt nicht',
  'walletSettings.type': 'Typ',
  'walletSettings.transactionCount': 'Transaktionen',
  'walletSettings.notSynced': 'Nicht synchronisiert',
  'walletSettings.watchOnly': 'Watch-only-Wallet',
  'walletSettings.publicKey': 'Wallet-XPUB anzeigen',
  'walletSettings.publicKeyTitle': 'Wallet-XPUB',
  'walletSettings.copyPublicKey': 'Öffentlichen Schlüssel kopieren',
  'messageSigning.help':
    'Erstelle oder prüfe eine signierte Nachricht mit einer Bitcoin-Adresse.',
  'messageSigning.address': 'Bitcoin-Adresse',
  'messageSigning.message': 'Nachricht',
  'messageSigning.signature': 'Signatur',
  'messageSigning.sign': 'Signieren',
  'messageSigning.verify': 'Prüfen',
  'messageSigning.valid':
    'Signatur bestätigt. Die Nachricht stimmt mit der Adresse überein.',
  'messageSigning.invalid':
    'Prüfung fehlgeschlagen. Prüfe Adresse, Nachricht und Signatur.',
  'messageSigning.signed':
    'Nachricht signiert. Du kannst die Signatur kopieren oder teilen.',
  'messageSigning.invalidAddress':
    'Gib eine gültige Bitcoin-Adresse für dieses Netzwerk ein.',
  'messageSigning.invalidMessage':
    'Gib eine Nachricht mit höchstens 10.000 Zeichen ein.',
  'messageSigning.unsupported':
    'Nachrichtensignaturen unterstützen Legacy-, Nested-SegWit- und Native-SegWit-Adressen mit einem Schlüssel. Taproot und Multisignatur-Skripte werden nicht unterstützt.',
  'messageSigning.watchOnly':
    'Dies ist eine Watch-only-Wallet. Du kannst Signaturen prüfen, aber keine Nachrichten signieren.',
  'messageSigning.notOwned':
    'Verwende zum Signieren die ausgewählte Adresse dieser Wallet. Signaturen anderer Adressen kannst du prüfen.',
  'messageSigning.unavailable':
    'Der private Schlüssel für diese Adresse ist nicht verfügbar.',
  'messageSigning.failed':
    'Die Nachricht konnte nicht signiert werden. Versuche es erneut.',
  'messageSigning.shareFailed':
    'Teilen konnte nicht geöffnet werden. Versuche es erneut.',
  'recovery.protected': 'Geschützt',
  'cloud.protectedTitle': 'Du bist geschützt',
  'cloud.protectedDescription': 'Deine Wallet ist mit einem Passkey geschützt.',
  'cloud.title': 'iCloud-Backup zur Wiederherstellung',
  'cloud.consent':
    'Verschlüssele die Wiederherstellungsdaten dieser Wallet mit einem Passkey und speichere sie in deinem privaten iCloud-Speicher. Zum Wiederherstellen brauchst du dieses iCloud-Konto und denselben Passkey. Bewahre auch dein Geheimschlüssel-Backup auf. Gesichert werden die Schlüssel und Einstellungen der Wallet, nicht aber Transaktionsnotizen oder ausstehende Zahlungen.',
  'cloud.saved': 'Backup geprüft',
  'cloud.savedDescription':
    'Dein verschlüsseltes Backup wurde gespeichert, heruntergeladen und erfolgreich entschlüsselt. Behalte den Passkey und bewahre dein Geheimschlüssel-Backup auf. Eine Wiederherstellung auf einem anderen Gerät wurde noch nicht getestet.',
  'cloud.subtitle':
    'Mit einem Passkey verschlüsselt. Erfordert iCloud und iOS 18 oder neuer.',
  'cloud.verifiedSubtitle':
    'Ein Backup zur Wiederherstellung wurde am {date} geprüft. Tippe, um eine neue Kopie zu speichern.',
  'cloud.empty':
    'In diesem iCloud-Konto wurden keine Backups zur Wiederherstellung gefunden.',
  'cloud.restoreTitle': 'Diese Wallet wiederherstellen?',
  'cloud.restorePreview':
    'Wallet: {name}\nNetzwerk: {network}\n\nDie wiederhergestellte Wallet wird hinzugefügt. Vorhandene Wallets bleiben unverändert.',
  'cloud.restoredDescription':
    'Die Schlüssel der Wallet wurden wiederhergestellt. Guthaben und Transaktionen werden über das Netzwerk aktualisiert.',
  'cloud.unsupported':
    'Backups mit Passkey erfordern ein iPhone oder iPad mit iOS 18 oder neuer und die aktualisierte Bithold-App.',
  'cloud.prfUnsupported':
    'Dieser Passkey-Anbieter unterstützt die Backup-Verschlüsselung nicht. Es wurde kein geprüftes Backup erstellt. Bewahre dein Geheimschlüssel-Backup auf.',
  'cloud.accountUnavailable':
    'Melde dich in den Einstellungen deines Geräts bei iCloud an und versuche es dann erneut.',
  'cloud.accountChanged':
    'Das iCloud-Konto hat sich während dieses Vorgangs geändert. Versuche es mit dem richtigen Konto erneut.',
  'cloud.quotaExceeded':
    'Dein iCloud-Speicher ist voll. Gib Speicherplatz frei und versuche es erneut.',
  'cloud.network':
    'iCloud konnte nicht erreicht werden. Prüfe deine Verbindung und versuche es erneut.',
  'cloud.invalidPayload':
    'Bei der Prüfung wurde dieses Backup nicht als unterstützte Bithold-Wallet erkannt. Es wurde nichts importiert.',
  'cloud.duplicate':
    'Diese Wallet ist bereits in der App vorhanden. Es wurde kein Duplikat hinzugefügt.',
  'cloud.interrupted':
    'Der Vorgang wurde unterbrochen. Entsperre die App und versuche es erneut.',
  'cloud.watchOnly':
    'Eine Watch-only-Wallet hat keine privaten Schlüssel, die gesichert werden könnten.',
  'cloud.busy': 'Ein Backup-Vorgang läuft bereits.',
  'cloud.failed':
    'Der Vorgang konnte nicht abgeschlossen oder geprüft werden. Kontrolliere iCloud und den Passkey und versuche es dann erneut. Bewahre dein Geheimschlüssel-Backup auf.',
  'cloudRestore.pickerHeader': 'Wallet wiederherstellen',
  'cloudRestore.pickerTitle': 'Aus Backup wiederherstellen',
  'cloudRestore.pickerSubtitle': 'Wähle ein Backup zum Wiederherstellen aus',
  'cloudRestore.backupName': '#{index} iCloud-Backup (Passkey)',
  'cloudRestore.active': 'Aktiv',
  'cloudRestore.pastBackups': 'Frühere Backups',
  'cloudRestore.restoring': 'Wallet wird wiederhergestellt …',
  'cloudRestore.restoringSubtitle': 'Einen Moment bitte',
  'cloudRestore.success': 'Wiederherstellung erfolgreich!',
  'cloudRestore.activeTitle': 'Backup aktiv',
  'cloudRestore.emptyTitle': 'Kein Backup gefunden',
  'cloudRestore.accessTitle': 'Zugriff auf\niCloud erlauben',
  'cloudRestore.passkeysTitle': 'Passkeys aktivieren',
  'cloudRestore.errorTitle': 'Etwas ist schiefgelaufen',
  'cloudRestore.prfUnsupported':
    'Dieser Passkey-Anbieter kann keine iCloud-Backups entsperren. Verwende im iCloud-Schlüsselbund gespeicherte Passkeys oder stelle die Wallet mit deinem Geheimschlüssel wieder her.',
  'common.back': 'Zurück',
  'common.cancel': 'Abbrechen',
  'common.continue': 'Weiter',
  'common.done': 'Fertig',
  'common.edit': 'Bearbeiten',
  'common.loading': 'Wird geladen',
  'settings.title': 'Einstellungen',
  'settings.row.currency': 'Währung',
  'settings.row.unit': 'Anzeigeeinheit',
  'settings.unit.fixedPrecision': 'Immer 8 Nachkommastellen anzeigen',
  'settings.row.language': 'Sprache',
  'settings.row.blockExplorer': 'Block-Explorer',
  'settings.explorer.custom': 'Eigener Explorer',
  'settings.explorer.customSubtitle': 'Explorer deiner Wahl nutzen',
  'settings.explorer.urlPlaceholder': 'Explorer-URL',
  'settings.explorer.invalidUrl':
    'Gib eine URL ein, die mit https:// oder http:// beginnt.',
  'settings.notificationsDenied':
    'Erlaube Mitteilungen für Bithold in den iPhone-Einstellungen.',
  'settings.notificationsOpenSettings': 'Einstellungen öffnen',
  'settings.notificationsFailed':
    'Die Berechtigung für Mitteilungen konnte nicht aktualisiert werden. Bitte versuche es erneut.',
  'settings.row.notifications': 'Mitteilungen',
  'settings.row.sounds': 'Töne',
  'settings.row.haptic': 'Haptisches Feedback',
  'settings.row.animation': 'Portfolioanimation',
  'settings.row.passcode': 'Codesperre',
  'settings.row.faceId': 'Sperre mit Face ID',
  'settings.row.reset': 'App zurücksetzen',
  'settings.currencyFailed': 'Währung konnte nicht geändert werden',
  'settings.resetMessage':
    'Alle lokalen Wallets und Schlüssel von diesem Gerät entfernen? Stelle sicher, dass du ihre Wiederherstellungsdaten gesichert hast.',
  'settings.resetTitle': 'Bist du sicher?',
  'settings.resetWarning': 'Das kann nicht rückgängig gemacht werden.',
  'settings.resetConfirm': 'App zurücksetzen',
  'settings.setCurrency': 'Währung festlegen',
  'settings.searchCurrencies': 'Währungen suchen',
  'settings.closeSearch': 'Suche schließen',
  'settings.noCurrencies': 'Keine Währungen gefunden',
  'settings.noCurrenciesHint':
    'Versuche es mit einem Währungsnamen oder -code.',
  'settings.selectLanguage': 'Sprache auswählen',
  'restore.icloudTitle': 'Mit deinem iCloud-Backup wiederherstellen',
  'restore.icloudSubtitle':
    'Stelle dein Konto mit deinen iCloud-Passkeys wieder her.',
  'restore.secretKeyTitle': 'Geheimschlüssel (für Fortgeschrittene)',
  'restore.secretKeySubtitle':
    'Stelle dein Konto mit deinem Geheimschlüssel aus 12 Wörtern wieder her.',
  'restore.qrTitle': 'QR-Code',
  'restore.qrSubtitle': 'Synchronisiere mit Bithold auf einem anderen Gerät.',
  'electrum.chooseServer': 'Wähle einen Server aus.',
  'currency.AED': 'VAE-Dirham',
  'currency.AMD': 'Armenischer Dram',
  'currency.ANG': 'Niederländische-Antillen-Gulden',
  'currency.ARS': 'Argentinischer Peso',
  'currency.AUD': 'Australischer Dollar',
  'currency.AWG': 'Aruba-Florin',
  'currency.BDT': 'Bangladesch-Taka',
  'currency.BHD': 'Bahrain-Dinar',
  'currency.BOB': 'Bolivianischer Boliviano',
  'currency.BRL': 'Brasilianischer Real',
  'currency.CAD': 'Kanadischer Dollar',
  'currency.CHF': 'Schweizer Franken',
  'currency.CLP': 'Chilenischer Peso',
  'currency.CNY': 'Renminbi Yuan',
  'currency.COP': 'Kolumbianischer Peso',
  'currency.CZK': 'Tschechische Krone',
  'currency.DKK': 'Dänische Krone',
  'currency.DOP': 'Dominikanischer Peso',
  'currency.DZD': 'Algerischer Dinar',
  'currency.EGP': 'Ägyptisches Pfund',
  'currency.ETB': 'Äthiopischer Birr',
  'currency.EUR': 'Euro',
  'currency.GBP': 'Britisches Pfund',
  'currency.GHS': 'Ghanaischer Cedi',
  'currency.GTQ': 'Guatemaltekischer Quetzal',
  'currency.HKD': 'Hongkong-Dollar',
  'currency.HUF': 'Ungarischer Forint',
  'currency.IDR': 'Indonesische Rupiah',
  'currency.ILS': 'Israelischer Neuer Schekel',
  'currency.INR': 'Indische Rupie',
  'currency.IRR': 'Iranischer Rial',
  'currency.IRT': 'Iranischer Toman',
  'currency.ISK': 'Isländische Krone',
  'currency.JPY': 'Japanischer Yen',
  'currency.KES': 'Kenia-Schilling',
  'currency.KRW': 'Südkoreanischer Won',
  'currency.KWD': 'Kuwait-Dinar',
  'currency.KZT': 'Kasachischer Tenge',
  'currency.LBP': 'Libanesisches Pfund',
  'currency.LKR': 'Sri-Lanka-Rupie',
  'currency.MAD': 'Marokkanischer Dirham',
  'currency.MXN': 'Mexikanischer Peso',
  'currency.MYR': 'Malaysischer Ringgit',
  'currency.MZN': 'Mosambikanischer Metical',
  'currency.NGN': 'Nigerianischer Naira',
  'currency.NOK': 'Norwegische Krone',
  'currency.NZD': 'Neuseeland-Dollar',
  'currency.OMR': 'Omanischer Rial',
  'currency.PEN': 'Peruanischer Sol',
  'currency.PHP': 'Philippinischer Peso',
  'currency.PKR': 'Pakistanische Rupie',
  'currency.PLN': 'Polnischer Złoty',
  'currency.PYG': 'Paraguayischer Guaraní',
  'currency.QAR': 'Katar-Riyal',
  'currency.RON': 'Rumänischer Leu',
  'currency.RSD': 'Serbischer Dinar',
  'currency.RUB': 'Russischer Rubel',
  'currency.SAR': 'Saudi-Rial',
  'currency.SEK': 'Schwedische Krone',
  'currency.SGD': 'Singapur-Dollar',
  'currency.THB': 'Thailändischer Baht',
  'currency.TRY': 'Türkische Lira',
  'currency.TWD': 'Neuer Taiwan-Dollar',
  'currency.TZS': 'Tansania-Schilling',
  'currency.UAH': 'Ukrainische Hrywnja',
  'currency.UGX': 'Uganda-Schilling',
  'currency.USD': 'US-Dollar',
  'currency.UYU': 'Uruguayischer Peso',
  'currency.UZS': 'Usbekistan-Sum',
  'currency.VES': 'Venezolanischer Bolívar',
  'currency.VND': 'Vietnamesischer Dong',
  'currency.XAF': 'CFA-Franc (BEAC)',
  'currency.XOF': 'CFA-Franc (BCEAO)',
  'currency.ZAR': 'Südafrikanischer Rand',
  'common.copyAddress': 'Adresse kopieren',
  'bubble.dismissAddress': 'Adresse ausblenden',
  'brand.logo': 'Bithold-Logo',
  'sheet.dismiss': 'Ansicht schließen',
  'sheet.background': 'Hintergrund der Ansicht',
  'wallet.alertTitle': 'Wallet',
  'error.operationFailed': 'Der Vorgang konnte nicht abgeschlossen werden.',
  'common.next': 'Weiter',
  'common.ok': 'OK',
  'import.title':
    'Wiederherstellungsphrase, Schlüssel oder Deskriptor eingeben',
  'common.confirm': 'Bestätigen',
  'import.loading': 'Wallet wird importiert …',
  'import.failed': 'Wallet konnte nicht importiert werden',
  'import.inputAlertTitle': 'Eingabe nicht möglich',
  'import.inputLimit':
    'Die Eingabe überschreitet das Limit von 16.384 Zeichen.',
  'import.fieldUnavailable': 'Das Importfeld ist nicht mehr verfügbar.',
  'import.fieldInactive': 'Das Importfeld ist nicht mehr aktiv.',
  'import.composing':
    'Schließe die Eingabe des aktuellen Worts ab, bevor du importierst.',
  'import.description':
    'Wenn du die Wallet mit einer Wiederherstellungsphrase importierst, trenne die Wörter durch Leerzeichen.',
  'import.inputLabel': 'Wiederherstellungsphrase, Schlüssel oder Deskriptor',
  'import.inputHint':
    'Gib deine Wiederherstellungsphrase, deinen privaten Schlüssel oder deinen Deskriptor ein.',
  'import.pasteEmpty':
    'Kopiere deine Wiederherstellungsphrase oder deinen privaten Schlüssel und tippe dann auf „Einfügen“.',
  'import.clear': 'Löschen',
  'import.scan': 'Scannen',
  'import.paste': 'Einfügen',
  'import.passphrase': 'Passphrase',
  'import.passphrasePrompt':
    'Gib deine Passphrase ein, falls du eine verwendet hast',
  'import.options': 'Importoptionen',
  'onboarding.welcome.setupOptions':
    'Richte Bithold mit einer der folgenden Optionen ein.',
  'onboarding.welcome.selfCustody':
    'Selbstverwahrung heißt,\ndu hast dein Guthaben\nimmer unter Kontrolle',
  'onboarding.welcome.recoveryPhrase': 'Wiederherstellungsphrase erstellen',
  'onboarding.welcome.recoveryDescription':
    'Neue Bitcoin-Wallet mit 12 Wörtern zur Wiederherstellung',
  'onboarding.welcome.importDescription':
    'Seed-Phrase, privater Schlüssel oder iCloud\u2011Backup',
  'onboarding.welcome.email': 'Mit E-Mail fortfahren',
  'onboarding.welcome.emailDescription':
    'Anmelden oder ein Wallet-Konto erstellen',
  'onboarding.welcome.import': 'Importieren',
  'onboarding.welcome.apple': 'Mit Apple anmelden',
  'onboarding.welcome.google': 'Mit Google anmelden',
  'onboarding.welcome.termsIntro':
    'Mit der Nutzung von Bithold akzeptierst du unsere',
  'onboarding.welcome.termsOfService': 'Nutzungsbedingungen',
  'onboarding.welcome.termsAnd': 'und',
  'onboarding.welcome.privacyPolicy': 'Datenschutzerklärung',
  'onboarding.or': 'ODER',
  'onboarding.welcomeTitle': 'Willkommen in Ihrer neuen digitalen Geldbörse!',
  'onboarding.getStarted': "So geht's los",
  'onboarding.restoreWallet': 'Wallet wiederherstellen',
  'onboarding.title':
    'Sichere, verwalte &\nverwahre Bitcoin –\nalles an einem Ort',
  'onboarding.create': 'Neue Wallet erstellen',
  'onboarding.creating': 'Wallet wird erstellt …',
  'onboarding.createFailed': 'Wallet konnte nicht erstellt werden',
  'onboarding.import': 'Wallet importieren',
  'onboarding.terms':
    'Indem du fortfährst, stimmst du den {terms} und der {privacy} zu',
  'onboarding.termsOfService': 'Nutzungsbedingungen',
  'onboarding.privacyPolicy': 'Datenschutzerklärung',
  'onboarding.noCloudBackup':
    'Bithold sichert Wallets noch nicht in der Cloud, daher gibt es kein Cloud-Backup zum Importieren.',
  'importWith.title': 'Importieren mit',
  'importWith.phraseTitle': 'Seed-Phrase oder privater Schlüssel',
  'importWith.phraseDescription':
    'Nutze Seed-Phrasen mit 12, 18 oder 24 Wörtern oder private Schlüssel',
  'importWith.cloudTitle': 'Cloud-Backup',
  'importWith.cloudDescription':
    'Importiere deine Wallet schnell aus deinem Cloud-Backup',
  'common.save': 'Speichern',
  'import.passphraseEnabled': 'Passphrase aktiviert',
  'import.usePassphrase': 'Passphrase verwenden',
  'import.addressType': 'Adresstyp: {type}',
  'import.addressTypesAutomatic': 'Adresstypen: automatisch',
  'import.defaultDerivationPath': 'Standard-Ableitungspfad',
  'import.bip39Passphrase': 'BIP39-Passphrase',
  'import.bip39PassphraseMessage':
    'Verwende genau die Passphrase, die zu dieser Wallet gehört. Standard ist eine leere Passphrase.',
  'import.addressTypeTitle': 'Adresstyp',
  'import.derivationPath': 'Ableitungspfad',
  'import.pasteFailed': 'Einfügen nicht möglich',
  'import.pasteAccess': 'Erlaube das Einfügen, wenn iOS danach fragt.',
  'import.nothingToPaste': 'Nichts zum Einfügen',
  'import.editWord': 'Wort bearbeiten',
  'scanner.title': 'Zum Senden scannen',
  'scanner.denied':
    'Erlaube in den Einstellungen den Zugriff auf deine Kamera, um QR-Codes zu scannen.',
  'scanner.unavailable':
    'Kamera nicht verfügbar. Gib die Adresse stattdessen ein oder füge sie ein.',
  'scanner.openSettings': 'Einstellungen öffnen',
  'scanner.invalid': 'Dieser QR-Code enthält keine gültige Bitcoin-Adresse.',
  'balance.resetFailed': 'Zurücksetzen nicht möglich',
  'balance.refreshFailed': 'Aktualisieren nicht möglich',
  'activity.title': 'Aktivität',
  'balance.hiddenLabel': 'Guthaben ausgeblendet. Lange drücken zum Einblenden.',
  'balance.shownLabel': 'Wallet-Guthaben. Lange drücken zum Ausblenden.',
  'balance.walletSelector': 'Wallet-Auswahl',
  'wallet.defaultName': 'Wallet {number}',
  'balance.receive': 'Empfangen',
  'balance.send': 'Senden',
  'chart.noData': 'Keine Daten verfügbar, versuche es erneut',
  'chart.bitcoinPrice': 'Bitcoin-Kurs',
  'chart.today': '{change} heute',
  'balance.pullToRefresh': 'Zum Aktualisieren ziehen',
  'balance.releaseToRefresh': 'Zum Aktualisieren loslassen',
  'balance.updating': 'Wird aktualisiert…',
  'common.copied': 'Kopiert',
  'common.copiedBubble': 'Kopiert.',
  'error.tryAgain': 'Bitte versuche es erneut.',
  'addressType.descriptor': 'Eigenes Skript',
  'receive.addressLabel': 'Deine BTC-Adresse',
  'receive.addressLabelTaproot': 'Deine Taproot-BTC-Adresse',
  'receive.addressLabelLegacy': 'Deine Legacy-BTC-Adresse',
  'receive.title': 'Bitcoin empfangen',
  'receive.pathTitle': 'Empfangspfad',
  'receive.qrCopy': 'Kopieren',
  'receive.qrShare': 'Teilen …',
  'receive.addressFailed': 'Adresse konnte nicht abgerufen werden',
  'receive.newAddress': 'Neue Adresse',
  'receive.newAddressHint': 'Zeigt eine neue Empfangsadresse auf diesem Pfad',
  'receive.copyFailed': 'Kopieren nicht möglich',
  'receive.shareFailed': 'Teilen nicht möglich',
  'receive.typeLabel': 'Typ der Empfangsadresse',
  'receive.typeHint': 'Öffnet die verfügbaren Typen von Empfangsadressen',
  'receive.qrLabel':
    'Bithold-QR-Code. Gedrückt halten zum Kopieren oder Teilen.',
  'receive.choosePath': 'Empfangspfad auswählen',
  'receive.choosePathAddress': 'Empfangspfad auswählen. {address}',
  'receive.choosePathHint':
    'Öffnet die verfügbaren Empfangspfade für diese Wallet',
  'receive.pathFailed': 'Empfangspfad konnte nicht ausgewählt werden',
  'receive.path.wif': 'Einzelner privater Schlüssel',
  'receive.path.address': 'Importierte Adresse',
  'receive.path.descriptor': 'Importierter Deskriptor',
  'auth.notCompleted': 'Die Authentifizierung wurde nicht abgeschlossen',
  'native.storageRead':
    'Lokale Wallet-Daten können nicht gelesen werden. Entsperre das Gerät und versuche es erneut.',
  'native.storageSave': 'Lokale Wallet-Daten können nicht gespeichert werden',
  'native.storageRemove': 'Lokale Wallet-Daten können nicht entfernt werden',
  'native.entropySize': 'Ungültige Entropiegröße',
  'native.randomness': 'Sichere Zufallszahlen nicht verfügbar',
  'native.invalidServer': 'Ungültiger Server',
  'native.tlsFailed': 'TLS-Verbindung fehlgeschlagen',
  'native.tcpFailed': 'TCP-Verbindung fehlgeschlagen',
  'native.connectTimeout': 'Zeitüberschreitung beim Verbindungsaufbau',
  'native.certificateChanged': 'Zertifikat hat sich geändert',
  'native.certificateUntrusted': 'Nicht vertrauenswürdiges Zertifikat',
  'native.overlappingRequest':
    'Ungültige oder sich überschneidende Serveranfrage',
  'native.timeout': 'Zeitüberschreitung bei der Serveranfrage',
  'native.sendFailed': 'Serveranfrage konnte nicht gesendet werden',
  'native.responseTooLarge': 'Serverantwort zu groß',
  'native.invalidResponse': 'Ungültige Serverantwort',
  'native.unexpectedResponse': 'Unerwartete Serverantwort',
  'native.disconnected': 'Serververbindung getrennt',
  'native.connectionClosed': 'Verbindung geschlossen',
  'native.unavailable': 'Dieser Build enthält die native Wallet-Engine nicht',
  'send.amountTitle': 'Betrag festlegen',
  'send.priceUnavailable': 'Preis nicht verfügbar',
  'send.priceUnavailableMessage':
    'Gib den Betrag in Bitcoin ein, solange der Wechselkurs nicht verfügbar ist.',
  'send.dustWarning':
    'Bitcoin unterstützt keine Zahlungen von {amount} oder weniger',
  'send.insufficientWarning':
    'Zahle mehr Guthaben ein oder gib einen niedrigeren Betrag ein.',
  'send.amountInCurrency': 'Betrag in {currency}',
  'send.amountInBitcoin': 'Betrag in Bitcoin',
  'send.switchCurrency': 'Zwischen Bitcoin und {currency} wechseln',
  'send.useAvailable': 'Verfügbares Guthaben verwenden',
  'send.available': 'Verfügbar',
  'send.networkFee': 'Netzwerkgebühr',
  'error.keys.invalidAddressIndex': 'Ungültiger Adressindex',
  'error.keys.addressBranchUnavailable': 'Adresszweig nicht verfügbar',
  'error.keys.descriptorMustProduceAddressableOutput':
    'Der Deskriptor muss einen adressierbaren Output erzeugen',
  'error.keys.witnessScriptsRequireCompressedPublic':
    'Witness-Skripte erfordern komprimierte öffentliche Schlüssel',
  'error.keys.walletCannotSign': 'Diese Wallet kann nicht signieren',
  'error.descriptor.invalidDescriptorCharacter':
    'Ungültiges Zeichen im Deskriptor',
  'error.descriptor.invalidDescriptor': 'Ungültiger Deskriptor',
  'error.descriptor.invalidDescriptorDerivation':
    'Ungültige Deskriptor-Ableitung',
  'error.descriptor.publicKeysCannotHaveDerivation':
    'Öffentliche Schlüssel können keine Ableitungspfade haben',
  'error.descriptor.privateKeysCannotHaveDerivation':
    'Private Schlüssel können keine Ableitungspfade haben',
  'error.descriptor.hardenedStepsMustPrecedeBranches':
    'Gehärtete Schritte müssen vor Verzweigungen stehen',
  'error.descriptor.publicKeyCannotDeriveHardened':
    'Ein öffentlicher Schlüssel kann keine gehärteten Kindschlüssel ableiten',
  'error.descriptor.invalidDescriptorChecksum':
    'Ungültige Deskriptor-Prüfsumme',
  'error.descriptor.descriptorNestingTooDeep':
    'Deskriptor zu tief verschachtelt',
  'error.descriptor.unsupportedDescriptorNesting':
    'Nicht unterstützte Deskriptor-Verschachtelung',
  'error.descriptor.invalidMultisigThreshold':
    'Ungültiger Multisig-Schwellenwert',
  'error.descriptor.unsupportedDescriptorExpression':
    'Nicht unterstützter Deskriptor-Ausdruck',
  'error.descriptor.duplicateMultisigKeys': 'Doppelte Multisig-Schlüssel',
  'error.descriptor.descriptorRequiresCompressedXOnly':
    'Dieser Deskriptor erfordert einen komprimierten öffentlichen Schlüssel oder einen x-only-Schlüssel',
  'error.keys.unsupportedBitcoinNetwork':
    'Nicht unterstütztes Bitcoin-Netzwerk',
  'error.keys.invalidDerivationPath': 'Ungültiger Ableitungspfad',
  'error.keys.derivationIndexTooLarge': 'Der Ableitungsindex ist zu groß',
  'error.keys.invalidExtendedKey': 'Ungültiger erweiterter Schlüssel',
  'error.keys.keyBelongsDifferentBitcoinNetwork':
    'Der Schlüssel gehört zu einem anderen Bitcoin-Netzwerk',
  'error.keys.invalidPrivateKeyNetwork':
    'Ungültiger privater Schlüssel oder ungültiges Netzwerk',
  'error.keys.unsupportedAddressType': 'Nicht unterstützter Adresstyp',
  'error.keys.enterRecoveryPhraseKeyDescriptor':
    'Gib eine Wiederherstellungsphrase, einen Schlüssel oder einen Deskriptor ein',
  'error.keys.invalidRecoveryPhraseCheckEvery':
    'Ungültige Wiederherstellungsphrase: Kontrolliere jedes Wort, die Wortanzahl und die Prüfsumme',
  'error.payment.missingSpendingOutput': 'Auszugebender Output fehlt',
  'error.payment.spendingOutputChanged':
    'Auszugebender Output hat sich geändert',
  'error.payment.unsupportedTaprootSpendPath':
    'Nicht unterstützter Taproot-Ausgabepfad',
  'error.payment.unsupportedInputScriptFeeEstimation':
    'Nicht unterstütztes Input-Skript für die Gebührenschätzung',
  'error.payment.useMostThreeDecimalPlaces':
    'Verwende für den Gebührensatz höchstens drei Nachkommastellen',
  'error.payment.watchOnlyWalletCannotSign':
    'Diese Watch-only-Wallet kann keine Zahlungen signieren',
  'error.payment.refreshWalletBeforeSending':
    'Aktualisiere die Wallet vor dem Senden',
  'error.payment.chooseFeeRate11000':
    'Wähle einen Gebührensatz von 1 bis 1000 sat/vB',
  'error.payment.invalidRbfPreference': 'Ungültige RBF-Einstellung',
  'error.payment.enterLeast546Satoshis': 'Gib mindestens 546 Satoshi ein',
  'error.payment.insufficientBalanceAmountNetworkFee':
    'Unzureichendes Guthaben für diesen Betrag und die Netzwerkgebühr',
  'error.payment.amountBelowBitcoinDustLimit':
    'Der Betrag liegt nach Abzug der Gebühren unter dem Bitcoin-Dust-Limit',
  'error.payment.noSpendableBitcoinAvailable':
    'Keine ausgebbaren Bitcoin verfügbar',
  'error.payment.duplicateSpendingOutput': 'Doppelter auszugebender Output',
  'error.payment.walletSnapshotChangedRefreshFee':
    'Der Wallet-Stand hat sich geändert. Aktualisiere die Gebührenvorschau.',
  'error.payment.paymentAccountingMismatch':
    'Abweichung in der Zahlungsabrechnung',
  'error.payment.secureSigningRandomnessUnavailable':
    'Sichere Zufallszahlen zum Signieren nicht verfügbar',
  'error.payment.transactionRbfSettingDoesNot':
    'Die RBF-Einstellung der Transaktion entspricht nicht der freigegebenen Überprüfung',
  'error.payment.recoveryMaterialCannotSignInput':
    'Mit den Wiederherstellungsdaten kann dieser Input nicht signiert werden',
  'error.payment.signedPaymentDoesNotMatch':
    'Die signierte Zahlung entspricht nicht der freigegebenen Überprüfung',
  'error.payment.signedTransactionExceedsReviewedFee':
    'Die signierte Transaktion übersteigt die überprüfte Gebührenschätzung. Bereite sie erneut vor.',
  'error.payment.broadcastResultUncertainSignedPayment':
    'Das Ergebnis der Übertragung ist unklar. Die signierte Zahlung wurde aufbewahrt; aktualisiere, um ihren Status zu prüfen.',
  'error.replacement.unknownReplacement': 'Unbekannte Ersetzung',
  'error.replacement.refreshWalletBeforeReplacingPayment':
    'Aktualisiere die Wallet, bevor du eine Zahlung ersetzt',
  'error.replacement.paymentTooSmallCancelFee':
    'Diese Zahlung ist zu klein, um sie mit dieser Gebühr zu stornieren: Nach Abzug der Netzwerkgebühr bliebe nichts übrig.',
  'error.replacement.notEnoughConfirmedBitcoinRaise':
    'Nicht genug bestätigte Bitcoin, um die Gebühr dieser Zahlung zu erhöhen. Du kannst sie stattdessen stornieren.',
  'error.replacement.replacementAccountingMismatch':
    'Abweichung in der Abrechnung der Ersetzung',
  'error.replacement.replacementFeeNotHigherThan':
    'Die Ersatzgebühr ist nicht höher als die ursprüngliche',
  'error.chart.invalidHistoricalPrice': 'Ungültiger historischer Preis',
  'error.chart.historicalPricesAreStale': 'Historische Preise sind veraltet',
  'error.chart.notEnoughHistoricalPrices': 'Nicht genügend historische Preise',
  'error.chart.unsupportedChartRange': 'Nicht unterstützter Diagrammzeitraum',
  'error.chart.incorrectHistoryCurrency': 'Falsche Währung im Kursverlauf',
  'error.chart.invalidHistoricalResponse': 'Ungültige Antwort zum Kursverlauf',
  'error.chart.invalidHistoryDate': 'Ungültiges Datum im Kursverlauf',
  'error.chart.unknownHistorySource': 'Unbekannte Quelle für den Kursverlauf',
  'error.chart.unsupportedHistoryCurrency':
    'Nicht unterstützte Währung für den Kursverlauf',
  'error.electrum.incompleteElectrumResponse':
    'Unvollständige Electrum-Antwort',
  'error.electrum.duplicateElectrumResponse': 'Doppelte Electrum-Antwort',
  'error.electrum.walletConnectionClosed': 'Wallet-Verbindung geschlossen',
  'error.electrum.serverFailedBitcoinMainnetVerification':
    'Der Server hat die Bitcoin-Mainnet-Prüfung nicht bestanden',
  'error.electrum.connectionSuperseded': 'Verbindung wurde ersetzt',
  'error.electrum.unableConnectBitcoinServersCheck':
    'Verbindung zu den Bitcoin-Servern nicht möglich. Prüfe deine Verbindung und aktualisiere.',
  'error.electrum.invalidChainTip': 'Ungültige Blockchain-Spitze',
  'error.electrum.invalidSubscriptionStatus': 'Ungültiger Abonnementstatus',
  'error.electrum.addressHistoryChangedDuringSynchronization':
    'Der Adressverlauf hat sich während der Synchronisierung geändert; aktualisiere erneut',
  'error.electrum.invalidBlockHeader': 'Ungültiger Block-Header',
  'error.fees.invalidFeeRecommendations': 'Ungültige Gebührenempfehlungen',
  'error.fees.inconsistentFeeRecommendations':
    'Widersprüchliche Gebührenempfehlungen',
  'error.rates.incorrectRateBaseCurrency': 'Falsche Basiswährung des Kurses',
  'error.rates.invalidStaleRateTimestamp':
    'Ungültiger oder veralteter Kurszeitstempel',
  'error.rates.unknownRateProvider': 'Unbekannter Kursanbieter',
  'error.rates.invalidRateResponse': 'Ungültige Kursantwort',
  'error.rates.noSupportedPricesResponse':
    'Keine unterstützten Preise in der Antwort',
  'error.rates.providerCoolingDownFailure':
    'Der Anbieter pausiert nach einem Fehler',
  'error.rates.unsupportedCurrency': 'Nicht unterstützte Währung',
  'error.rates.krakenReturnedError': 'Kraken hat einen Fehler zurückgegeben',
  'error.rates.incorrectPriceCurrency': 'Falsche Preiswährung',
  'error.rates.invalidConversionResponse': 'Ungültige Umrechnungsantwort',
  'error.rates.invalidBitcoinPrice': 'Ungültiger Bitcoin-Preis',
  'error.accounts.walletStorageNotReady':
    'Der Wallet-Speicher ist nicht bereit',
  'error.accounts.invalidRecoveryMaterialImportOptions':
    'Ungültige Wiederherstellungsdaten oder Importoptionen. Kontrolliere Prüfsumme, Netzwerk und Ableitungspfad.',
  'error.accounts.walletAlreadyImported': 'Diese Wallet ist bereits importiert',
  'error.accounts.importWasInterruptedPleaseTry':
    'Der Import wurde unterbrochen. Bitte versuche es erneut.',
  'error.accounts.enterWalletName180':
    'Gib einen Wallet-Namen mit 1–80 Zeichen ein',
  'error.accounts.addressTypeUnavailable': 'Adresstyp nicht verfügbar',
  'error.accounts.walletNoLongerExists': 'Die Wallet existiert nicht mehr',
  'error.accounts.walletHasUnresolvedBroadcastCheck':
    'Diese Wallet hat eine ungeklärte Übertragung. Prüfe sie, bevor du die Wallet entfernst.',
  'error.accounts.invalidTransaction': 'Ungültige Transaktion',
  'error.accounts.invalidNote': 'Ungültige Notiz',
  'error.payment.walletNotSynchronized': 'Die Wallet ist nicht synchronisiert',
  'error.payment.previousBroadcastUnresolvedRefreshRetry':
    'Eine frühere Übertragung ist ungeklärt. Aktualisiere oder übermittle genau diese Zahlung unter „Aktivität“ erneut.',
  'error.payment.paymentAlreadyBeingSubmitted':
    'Eine Zahlung wird bereits übermittelt',
  'error.payment.paymentReviewExpiredSelectedWallet':
    'Die Überprüfung der Zahlung ist abgelaufen oder die ausgewählte Wallet hat sich geändert. Überprüfe die Zahlung erneut.',
  'error.payment.paymentConfirmedChangedMeantimeNothing':
    'Diese Zahlung wurde inzwischen bestätigt oder geändert. Es wurde nichts ersetzt.',
  'error.payment.selectedCoinsChangedReviewPayment':
    'Die ausgewählten Coins haben sich geändert. Überprüfe die Zahlung erneut.',
  'error.payment.signingKeyUnavailable':
    'Der Signaturschlüssel ist nicht verfügbar',
  'error.payment.noUnresolvedPaymentAvailable':
    'Keine ungeklärte Zahlung vorhanden',
  'error.preferences.unknownPreference': 'Unbekannte Einstellung',
  'error.preferences.backgroundPushNotificationsAreNot':
    'Push-Mitteilungen im Hintergrund sind nicht eingerichtet. Das Guthaben wird synchronisiert, solange die App geöffnet ist.',
  'error.recovery.watchOnlyWalletHasNo':
    'Diese Watch-only-Wallet hat keine privaten Wiederherstellungsdaten',
  'error.recovery.walletHasNoPrivateRecovery':
    'Diese Wallet hat keine privaten Wiederherstellungsdaten',
  'error.recovery.recoveryMaterialUnavailable':
    'Die Wiederherstellungsdaten sind nicht verfügbar',
  'error.recovery.watchOnlyWalletHasNo2':
    'Diese Watch-only-Wallet hat keine privaten Schlüssel',
  'error.recovery.walletHasNoPrivateKeys':
    'Diese Wallet hat keine privaten Schlüssel',
  'error.recovery.addressControlledBySeveralKeys':
    'Diese Adresse wird von mehreren Schlüsseln kontrolliert und hat daher keinen einzelnen privaten Schlüssel.',
  'error.storage.walletMetadataDamaged': 'Die Wallet-Metadaten sind beschädigt',
  'error.sync.invalidRawTransaction': 'Ungültige Rohtransaktion',
  'error.sync.transactionIdVerificationFailed':
    'Prüfung der Transaktions-ID fehlgeschlagen',
  'error.sync.invalidTransactionValues': 'Ungültige Transaktionswerte',
  'error.sync.invalidAddressState': 'Ungültiger Adressstatus',
  'error.sync.inconsistentTransactionHistory':
    'Widersprüchlicher Transaktionsverlauf',
  'error.sync.invalidUnspentOutput': 'Ungültiger nicht ausgegebener Output',
  'error.sync.balanceDoesNotMatchUnspent':
    'Das Guthaben stimmt nicht mit den nicht ausgegebenen Outputs überein',
  'error.sync.walletScanCancelled': 'Wallet-Scan abgebrochen',
  'error.sync.addressDiscoveryLimitReachedLarger':
    'Limit für die Adresssuche erreicht; ein größerer Scan erfordert eine ausdrückliche Wiederherstellungskonfiguration',
  'error.sync.overlappingWalletDerivationBranches':
    'Sich überschneidende Ableitungszweige der Wallet',
  'error.sync.historyChangedDuringSynchronization':
    'Der Verlauf hat sich während der Synchronisierung geändert',
  'error.sync.missingInputTransaction': 'Input-Transaktion fehlt',
  'error.sync.invalidTransactionAccounting': 'Ungültige Transaktionsabrechnung',
  'error.sync.serverHistoryDoesNotBelong':
    'Der Serververlauf gehört nicht zu dieser Adresse',
  'error.sync.serverOmittedAddedUnspentOutputs':
    'Der Server hat nicht ausgegebene Outputs ausgelassen oder hinzugefügt',
  'error.sync.outputValueOwnershipMismatch':
    'Output-Wert oder -Zugehörigkeit stimmt nicht überein',
  'error.sync.chainChangedDuringSynchronizationRefresh':
    'Die Blockchain hat sich während der Synchronisierung geändert; aktualisiere erneut',
  'error.sync.invalidWalletBalance': 'Ungültiges Wallet-Guthaben',
  'error.sync.connectionChangedDuringSynchronizationRefresh':
    'Die Verbindung hat sich während der Synchronisierung geändert; aktualisiere erneut',
  'error.payment.serviceUnavailable': 'Dienst nicht verfügbar ({status})',
  'error.chart.historyUnavailable':
    'Historische Preise für {currency} sind vorübergehend nicht verfügbar. Dein gespeichertes Diagramm wurde beibehalten.',
  'error.electrum.rejected': 'Electrum hat {method} abgelehnt',
  'error.rates.noProvider':
    'Für {currency} ist derzeit kein Preisanbieter verfügbar. Der zuletzt gespeicherte Preis wurde beibehalten.',
  'error.addresses.gapLimit': {
    one: 'Diese Wallet hat bereits {count} nicht verwendete Adresse in Folge. Empfange zuerst eine Zahlung an diese Adresse, damit andere Wallets beim Wiederherstellen dieser Wallet dein Guthaben weiterhin finden.',
    other:
      'Diese Wallet hat bereits {count} nicht verwendete Adressen in Folge. Empfange zuerst eine Zahlung an eine davon, damit andere Wallets beim Wiederherstellen dieser Wallet dein Guthaben weiterhin finden.',
  },
  'error.preferences.priceUnavailable':
    'Ein Preis für {currency} ist vorübergehend nicht verfügbar. Deine ausgewählte Währung wurde nicht geändert.',
  'error.storage.openFailed':
    'Deine lokalen Wallets können nicht geöffnet werden. Entsperre dein Smartphone und versuche es erneut.',
  'recovery.passphraseLabel': 'BIP39-Passphrase:',
  'fee.custom': 'Eigene Gebühr',
  'fee.estimateUnavailable': 'Schätzung der Bestätigungszeit nicht verfügbar',
  'fee.network': 'Netzwerkgebühr',
  'fee.enterValid': 'Gib eine gültige Gebühr ein',
  'fee.tier.veryLow': 'Sehr niedrige Gebühr',
  'fee.tier.low': 'Niedrige Gebühr',
  'fee.tier.recommended': 'Empfohlene Gebühr',
  'fee.tier.priority': 'Prioritätsgebühr',
  'fee.tier.top': 'Höchste Priorität',
  'fee.speed': 'Bestätigungstempo: {speed}',
  'fee.speedName.veryLow': 'sehr langsam',
  'fee.speedName.low': 'langsam',
  'fee.speedName.recommended': 'normal',
  'fee.speedName.priority': 'schnell',
  'fee.speedName.top': 'sehr schnell',
  'fee.lowWarning': 'Transaktion kann wegen niedriger Gebühr fehlschlagen',
  'replace.reason.confirmed':
    'Nur unbestätigte Zahlungen können ersetzt werden.',
  'replace.reason.watchOnly': 'Diese Watch-only-Wallet kann nicht signieren.',
  'replace.reason.received':
    'Nur von dieser Wallet gesendete Zahlungen können ersetzt werden.',
  'replace.reason.foreignInputs':
    'Einige Inputs dieser Zahlung gehören zu einer anderen Wallet.',
  'replace.reason.spentLater':
    'Eine spätere unbestätigte Zahlung gibt Mittel aus dieser Zahlung aus. Eine Ersetzung würde auch die spätere Zahlung stornieren.',
  'replace.reason.refresh': 'Aktualisiere die Wallet und versuche es erneut.',
  'send.title': 'Bitcoin senden',
  'send.scanLabel': 'Bitcoin-QR-Code scannen',
  'send.addressLabel': 'Bitcoin-Adresse',
  'send.addressPlaceholder': 'An Bitcoin-Adresse senden',
  'send.notePlaceholder': 'Persönliche Notiz',
  'send.noteOptional': '(optional)',
  'send.noteHint':
    'Gib eine Notiz ein, um diese Transaktion im Verlauf deiner Wallet leichter wiederzuerkennen',
  'send.clipboardEmpty':
    'Die Zwischenablage ist leer. Tippe erneut, um eine Adresse einzugeben.',
  'send.pasteFailed':
    'Einfügen nicht möglich. Tippe erneut, um eine Adresse einzugeben.',
  'send.invalidAddress':
    'Ungültige BTC-Adresse. Bitte prüfe sie und versuche es erneut.',
  'send.feesUnavailable':
    'Netzwerkgebühren sind gerade nicht verfügbar. Prüfe deine Verbindung und versuche es erneut.',
  'send.prepareFailed': 'Zahlung konnte nicht vorbereitet werden',
  'send.statusText': '{amount} senden',
  'send.sentLabel': '{amount} gesendet',
  'send.sendingLabel': '{amount} wird gesendet',
  'send.submitFailed': 'Diese Zahlung konnte nicht übermittelt werden.',
  'send.paymentTitle': 'Zahlung',
  'review.title': 'Überprüfen',
  'review.customizeFees': 'Gebühren anpassen',
  'review.to': 'An',
  'review.amount': 'Betrag',
  'review.total': 'Gesamt',
  'review.feeRate': 'Gebührensatz',
  'fee.minimum': 'Die Mindestgebühr beträgt {rate} sat/vB',
  'fee.maximum': 'Die Höchstgebühr beträgt {rate} sat/vB',
  'fee.rateLabel': 'Netzwerk-Gebührensatz',
  'fee.rateInputLabel': 'Gebührensatz in Satoshi pro virtuellem Byte',
  'fee.calculating': 'Wird berechnet …',
  'fee.rbf': 'Beschleunigung (RBF)',
  'fee.rbfLabel': 'Ersetzen durch höhere Gebühr (RBF)',
  'fee.enabled': 'Aktiviert',
  'fee.disabled': 'Deaktiviert',
  'slide.label': 'Zum Bestätigen wischen',
  'slide.handleLabel': 'Ziehe den Regler nach rechts, um zu bestätigen',
  'send.showAddress': 'Vollständige Bitcoin-Adresse anzeigen',
  'manageWallets.title': 'Wallets verwalten',
  'addWallet.title': 'Wallet hinzufügen',
  'addWallet.createTitle': 'Wallet erstellen',
  'addWallet.createDescription': 'Erstelle eine neue Wallet mit Seed-Phrase',
  'addWallet.icloudTitle': 'iCloud-Backup',
  'walletSettings.name': 'Wallet-Name',
  'walletIcon.title': 'Wallet-Symbol',
  'walletIcon.change': 'Wallet-Symbol ändern',
  'walletIcon.initials': 'Initialen',
  'walletIcon.wallet': 'Geldbörse',
  'walletIcon.multi_chain': 'Multi-Chain',
  'walletIcon.diamond': 'Diamant',
  'walletIcon.speed': 'Geschwindigkeit',
  'walletIcon.bitcoin': 'Bitcoin',
  'walletIcon.tron': 'Tron',
  'walletIcon.heart': 'Herz',
  'walletIcon.dollar': 'Dollar',
  'walletIcon.card': 'Karte',
  'walletIcon.flame': 'Flamme',
  'walletIcon.leaderboard': 'Rangliste',
  'walletIcon.savings': 'Ersparnisse',
  'walletIcon.key': 'Schlüssel',
  'walletIcon.growth': 'Wachstum',
  'walletIcon.gift': 'Geschenk',
  'walletIcon.star': 'Stern',
  'walletColor.label': 'Wallet-Farbe {color}',
  'walletColor.gold': 'Gold',
  'walletColor.indigo': 'Indigo',
  'walletColor.red': 'Rot',
  'walletColor.orange': 'Orange',
  'walletColor.sand': 'Sand',
  'walletColor.neon': 'Neon',
  'walletColor.green': 'Grün',
  'walletColor.ocean': 'Ozean',
  'walletColor.lavender': 'Lavendel',
  'walletColor.fuchsia': 'Fuchsia',
  'walletColor.grey': 'Grau',
  'manageWallets.settingsFor': 'Wallet-Einstellungen für {name}',
  'walletSettings.title': 'Wallet-Einstellungen',
  'walletSettings.unavailableFeature':
    'Diese Funktion ist in diesem Build nicht verfügbar.',
  'walletSettings.nameRow': 'Name',
  'walletSettings.backup': 'Backup',
  'walletSettings.addresses': 'Adressen',
  'walletSettings.signVerify': 'Nachricht signieren/prüfen',
  'walletSettings.backupWarning':
    'Sichere deine Wallet immer, damit du den Zugriff nicht verlierst, wenn du dein Gerät verlierst oder zurücksetzt.',
  'walletSettings.remove': 'Wallet entfernen',
  'backup.secretKey': 'Geheimschlüssel',
  'backup.methodsTitle': 'Backup-Methoden',
  'backup.protectTitle': 'Schütze deine Wallet',
  'backup.protectSubtitle':
    'Sichere das Backup deiner Wallet in iCloud mit einem Passkey – per Face ID oder Touch ID.',
  'backup.secure': 'Sichern',

  'backup.creating': 'Backup wird erstellt',
  'backup.created': 'Backup erstellt',
  'backup.icloudTitle': 'iCloud-Backup',
  'backup.icloudSubtitle':
    'Sichere deine Wallet mit deinen iCloud-Passkeys und stelle sie mit Face ID oder Touch ID wieder her.',
  'backup.localWallet': 'Lokale Wallet',
  'backup.cloudDisabled':
    'Das Cloud-Backup ist deaktiviert. Sichere deine Wiederherstellungsdaten manuell über „Geheimschlüssel“.',
  'backup.secretKeySubtitle':
    'Rufe deine Wiederherstellungsdaten für die manuelle Wiederherstellung der Wallet ab.',
  'backup.revealTitle': 'Schreib dein Backup auf',
  'backup.revealWords':
    'Schreib diese Wörter der Reihe nach auf und bewahre sie offline an einem sicheren Ort auf.',
  'backup.revealKey':
    'Schreib diesen Schlüssel genau wie angezeigt auf und bewahre ihn offline an einem sicheren Ort auf.',
  'backup.coverTitle': 'Geheimschlüssel anzeigen',
  'backup.check.writeDown': 'Schreib ihn auf. Nie digital.',
  'backup.check.private': 'Bleib unbeobachtet.',
  'backup.check.protect': 'Schütze den Geheimschlüssel.',
  'backup.check.neverShare': 'Gib ihn niemals weiter.',
  'backup.check.dontLose': 'Verliere ihn nicht.',
  'backup.hold': 'Zum Anzeigen halten',
  'backup.holdHint':
    'Gedrückt halten, um deinen Geheimschlüssel anzuzeigen. Loslassen zum Ausblenden.',
  'remove.removedTitle': 'Wallet entfernt',
  'remove.confirmTitle': 'Von diesem Gerät entfernen?',
  'remove.removedOthers':
    'Deine anderen Wallets sind weiterhin auf diesem Gerät verfügbar.',
  'remove.removedLast':
    'Du kannst jetzt eine neue Wallet erstellen oder eine Wallet importieren.',
  'remove.confirmMessage':
    'Die lokalen Schlüssel und Daten der Wallet werden gelöscht. Du kannst die Wallet mit ihren Wiederherstellungsdaten erneut importieren.',
  'remove.message':
    '„{name}“ wird von diesem Gerät entfernt.\n\nBewahre die Wiederherstellungsdaten auf, falls du die Wallet erneut importieren musst.',
  'remove.failed': 'Wallet konnte nicht entfernt werden',
  'remove.confirm': 'Entfernen',
  'addresses.copyPrivateKey': 'Privaten Schlüssel kopieren',
  'addresses.receive': 'Empfang',
  'addresses.change': 'Wechselgeld',
  'recovery.notProtected': 'Nicht geschützt',
  'activity.unknownBroadcast': 'Übertragungsstatus unbekannt',
  'activity.checkPayment': 'Zahlung prüfen',
  'activity.checkPaymentMessage':
    'Aktualisiere zuerst oder übermittle genau dieselbe signierte Transaktion erneut.',
  'activity.refresh': 'Aktualisieren',
  'activity.connection': 'Verbindung',
  'activity.resubmit': 'Erneut übermitteln',
  'activity.submitted': 'Transaktion übermittelt',
  'activity.broadcast': 'Übertragung',
  'activity.empty': 'Deine Aktivität wird hier angezeigt',
  'activity.syncing': 'Transaktionen werden synchronisiert …',
  'activity.cancelledTitle': 'Zahlung storniert',
  'activity.cancelledMessage':
    'Eine Ersatztransaktion, die die Bitcoin an diese Wallet zurücksendet, wurde an das Netzwerk gesendet. Sie erscheint unter „Aktivität“, sobald sie erkannt wurde.',
  'time.seconds': 'wenigen Sekunden',
  'time.minute': 'einer Minute',
  'time.minutes': { one: '{count} Minute', other: '{count} Minuten' },
  'time.hour': 'einer Stunde',
  'time.hours': { one: '{count} Stunde', other: '{count} Stunden' },
  'time.day': 'einem Tag',
  'time.days': { one: '{count} Tag', other: '{count} Tagen' },
  'time.month': 'einem Monat',
  'time.months': { one: '{count} Monat', other: '{count} Monaten' },
  'time.year': 'einem Jahr',
  'time.years': { one: '{count} Jahr', other: '{count} Jahren' },
  'time.ago': 'vor {time}',
  'time.in': 'in {time}',
  'activity.pending': 'Ausstehend',
  'activity.dateUnavailable': 'Datum nicht verfügbar',
  'activity.today': 'Heute',
  'activity.yesterday': 'Gestern',
  'activity.received': 'Empfangen',
  'activity.selfTransfer': 'Interner Transfer',
  'activity.sent': 'Gesendet',
  'activity.rowHintConverted':
    'Betrag zum aktuellen Bitcoin-Preis umgerechnet. Öffnet die Transaktionsdetails.',
  'activity.rowHint': 'Öffnet die Transaktionsdetails.',
  'activity.timeUnavailable': 'Uhrzeit nicht verfügbar',
  'activity.selfFee': 'Gebühr · {amount}',
  'pending.title': 'Ausstehende Transaktion',
  'pending.lowFee':
    'Diese Transaktion wird wegen der niedrigen Gebühr möglicherweise nicht schnell abgeschlossen',
  'pending.message':
    'Diese Zahlung ist noch nicht bestätigt. Bis dahin kannst du sie beschleunigen oder stornieren.',
  'pending.speedUp': 'Beschleunigen',
  'pending.cancel': 'Stornieren',
  'note.title': 'Persönliche Notiz',
  'error.somethingWrong': 'Etwas ist schiefgelaufen',
  'transaction.walletLabel': 'Wallet der Transaktion: {name}',
  'transaction.receiving': 'Wird empfangen',
  'transaction.sending': 'Wird gesendet',
  'transaction.unavailable': 'Nicht verfügbar',
  'transaction.selfNote': 'Innerhalb deiner Wallet transferiert',
  'transaction.from': 'Von',
  'transaction.status': 'Status',
  'transaction.complete': 'Abgeschlossen',
  'transaction.date': 'Datum',
  'transaction.receivedFrom': 'Empfangen von',
  'transaction.receivingFrom': 'Wird empfangen von',
  'transaction.sentTo': 'Gesendet an',
  'transaction.sendingTo': 'Wird gesendet an',
  'transaction.sentFrom': 'Gesendet von',
  'transaction.sendingFrom': 'Wird gesendet von',
  'transaction.id': 'Transaktions-ID',
  'transaction.depositedTo': 'Eingegangen auf',
  'transaction.depositingTo': 'Geht ein auf',
  'transaction.fee': 'Gebühr',
  'transaction.now': 'Aktueller Wert',
  'addresses.used': 'Verwendet',
  'addresses.menuCopy': 'Adresse kopieren',
  'addresses.menuCopyWif': 'Privaten Schlüssel kopieren (WIF)',
  'addresses.rowLabel': 'Adresse {index}, {address}',
  'addresses.rowHint': 'Öffnet die Adressoptionen.',
  'addresses.transactions': 'Transaktionen: {count}',
  'transaction.title': 'Transaktion',
  'transaction.explorerHint':
    'Öffnet den Block-Explorer. Gedrückt halten zum Kopieren.',
  'transaction.holdToCopy': 'Gedrückt halten zum Kopieren.',
  'note.editHint': 'Bearbeitet die persönliche Notiz.',
  'note.add': 'Notiz hinzufügen',
  'transaction.feeLabel': 'Gebühr {amount}',
  'transaction.feeHint':
    'Wechselt die Währung der Gebühr. Gedrückt halten zum Kopieren.',
  'transaction.copied': 'Kopiert!',
  'transaction.addressCount': {
    one: '{count} Adresse',
    other: '{count} Adressen',
  },
  'transaction.recipientHint':
    'Tippen, um die vollständige Adresse anzuzeigen. Gedrückt halten zum Kopieren.',
  'replace.cancel.title': 'Zahlung stornieren?',
  'replace.cancel.body':
    'Die Zahlung wird durch eine ersetzt, die ihre Bitcoin abzüglich der Netzwerkgebühr an diese Wallet zurücksendet. Wird die ursprüngliche Zahlung zuerst bestätigt, wird nichts storniert.',
  'replace.cancel.action': 'Zahlung stornieren',
  'replace.cancel.failed': 'Die Zahlung konnte nicht storniert werden.',
  'replace.unavailable': 'Diese Zahlung kann nicht ersetzt werden',
  'replace.newFee': 'Neue Netzwerkgebühr',
  'replace.additionalFee': 'Zusätzliche Gebühr',
  'replace.returns': 'Zurück in die Wallet',
  'replace.submitting': 'Wird übermittelt …',
  'settings.row.touchId': 'Sperre mit Touch ID',
  'settings.row.biometricLock': 'Biometrische Sperre',
  'settings.faceIdNeedsPasscode': 'Lege zuerst einen Code fest.',
  'settings.faceIdAllowTitle': 'Face ID erlauben',
  'settings.faceIdAllowMessage':
    'Gehe zu Einstellungen > Bithold > Face ID, um Bithold die Verwendung von Face ID zu erlauben.',
  'settings.passcodeRemoveTitle': 'Code entfernen?',
  'settings.passcodeRemoveMessage':
    'Wenn du die Codesperre ausschaltest, ist deine Wallet ungeschützt und dein Guthaben könnte gefährdet sein.',
  'settings.passcodeRemoveConfirm': 'Code entfernen',
  'passcode.enableTitle': 'Codesperre aktivieren',
  'passcode.enableBody1':
    'Bithold fragt nach deinem Code, wenn die App geöffnet wird, wenn sie aus dem Hintergrund zurückkehrt und bevor sie deinen Geheimschlüssel oder einen privaten Schlüssel anzeigt.',
  'passcode.enableBody2':
    'Wenn du ihn vergisst, erhältst du nur wieder Zugriff, indem du die Wallets auf diesem Gerät löschst und sie mit deinem Geheimschlüssel erneut importierst.',
  'passcode.enterNew':
    'Gib den Code ein, mit dem du Bithold entsperren möchtest.',
  'passcode.enterCurrent': 'Gib deinen Code ein.',
  'passcode.field': 'Code',
  'passcode.confirmField': 'Code bestätigen',
  'passcode.mismatch':
    'Die Codes stimmen nicht überein. Bitte versuche es erneut.',
  'lock.enterPasscode': 'Code eingeben',
  'lock.unlock': 'Entsperren',
  'lock.wrongPasscode': 'Falscher Code eingegeben.',
  'lock.lockedOut': 'Zu viele Fehlversuche. Bitte warte.',
  'lock.retryIn': 'Neuer Versuch in {time}. Lass diesen Bildschirm geöffnet.',
  'lock.useFaceId': 'Face ID verwenden',
  'lock.useTouchId': 'Touch ID verwenden',
  'lock.forgot': 'Code vergessen?',
  'lock.forgotTitle': 'Code vergessen?',
  'lock.forgotMessage':
    'Du erhältst nur wieder Zugriff, indem du die Wallets auf diesem Gerät löschst und sie mit deinem Geheimschlüssel erneut importierst.',
  'lock.eraseAndRestore': 'Löschen & wiederherstellen',
  'lock.passcodeRequired': 'Code erforderlich',
  'lock.enrolmentChanged':
    'Die Einstellungen für Face ID auf deinem Gerät haben sich geändert, seit du Bithold zuletzt geöffnet hast. Gib deinen Code ein, um fortzufahren. Die Sperre mit Face ID kannst du in den Einstellungen wieder aktivieren.',
  'lock.faceIdReason': 'Bithold entsperren',
  'lock.invalidPasscode': 'Gib einen 6-stelligen Code ein.',
  'lock.noPasscode': 'Es ist kein Code festgelegt.',
  'walletName.title': 'Dein bevorzugter Name',
  'walletName.introduction': 'Lass uns dich kennenlernen.',
  'walletName.reassurance': 'Du kannst dies jederzeit ändern.',
  'walletName.placeholder': 'Dein bevorzugter Name…',
  'walletName.pickEmoji': 'Emoji auswählen',
  'walletName.changeEmoji': 'Emoji ändern',
  'walletName.resetAvatar': 'Avatar anhand des Namens verwenden',
  'walletName.yourAvatar': 'Dein Avatar',
  'walletName.changeAvatar': 'Avatar ändern',
  'walletName.pickPhoto': 'Foto auswählen',
  'walletName.takePhoto': 'Foto aufnehmen',
  'walletName.removePhoto': 'Foto entfernen',
  'walletName.cameraDenied':
    'Erlaube den Kamerazugriff in den Einstellungen, um ein Wallet-Foto aufzunehmen.',
  'walletName.cameraUnavailable':
    'Die Kamera ist auf diesem Gerät nicht verfügbar.',
  'walletName.photoFailed':
    'Das Foto konnte nicht geladen werden. Bitte versuche es erneut.',
};
