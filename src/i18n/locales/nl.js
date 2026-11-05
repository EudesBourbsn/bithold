// Dutch, translated from en.js. Same keys; plural values use this
// language's CLDR categories.
export default {
  'import.recoveryTitle': 'Herstelzin',
  'import.tapToEnter': 'Tik om je herstelzin te typen of te plakken…',
  'import.validPhrase': 'Geldige herstelzin',
  'import.invalidChecksum': 'Ongeldige herstelzin — controlesom klopt niet',
  'walletSettings.type': 'Type',
  'walletSettings.transactionCount': 'Transacties',
  'walletSettings.notSynced': 'Niet gesynchroniseerd',
  'walletSettings.watchOnly': 'Alleen-lezen-wallet',
  'walletSettings.publicKey': 'Wallet-XPUB tonen',
  'walletSettings.publicKeyTitle': 'Wallet-XPUB',
  'walletSettings.copyPublicKey': 'Openbare sleutel kopiëren',
  'messageSigning.help':
    'Maak of controleer een ondertekend bericht met een Bitcoin-adres.',
  'messageSigning.address': 'Bitcoin-adres',
  'messageSigning.message': 'Bericht',
  'messageSigning.signature': 'Handtekening',
  'messageSigning.sign': 'Ondertekenen',
  'messageSigning.verify': 'Controleren',
  'messageSigning.valid':
    'Handtekening gecontroleerd. Het bericht komt overeen met het adres.',
  'messageSigning.invalid':
    'Controle mislukt. Controleer het adres, het bericht en de handtekening.',
  'messageSigning.signed':
    'Bericht ondertekend. Je kunt de handtekening kopiëren of delen.',
  'messageSigning.invalidAddress':
    'Voer een geldig Bitcoin-adres voor dit netwerk in.',
  'messageSigning.invalidMessage':
    'Voer een bericht van maximaal 10.000 tekens in.',
  'messageSigning.unsupported':
    'Berichten ondertekenen ondersteunt Legacy-, Nested SegWit- en Native SegWit-adressen met één sleutel. Taproot en multisignature-scripts worden niet ondersteund.',
  'messageSigning.watchOnly':
    'Dit is een alleen-lezen-wallet. Je kunt handtekeningen controleren, maar geen berichten ondertekenen.',
  'messageSigning.notOwned':
    'Gebruik het geselecteerde adres van deze wallet om te ondertekenen. Je kunt handtekeningen van andere adressen controleren.',
  'messageSigning.unavailable':
    'De privésleutel voor dit adres is niet beschikbaar.',
  'messageSigning.failed':
    'Het bericht kon niet worden ondertekend. Probeer het opnieuw.',
  'messageSigning.shareFailed':
    'Delen kon niet worden geopend. Probeer het opnieuw.',
  'recovery.protected': 'Beschermd',
  'cloud.protectedTitle': 'Je bent beschermd',
  'cloud.protectedDescription':
    'Je wallet is beveiligd met een toegangssleutel.',
  'cloud.title': 'iCloud-back-up voor herstel',
  'cloud.consent':
    'Versleutel de herstelgegevens van deze wallet met een toegangssleutel en sla ze op in je persoonlijke iCloud-opslag. Om te herstellen heb je dit iCloud-account en dezelfde toegangssleutel nodig. Bewaar ook de back-up van je Geheime Sleutel. Hiermee sla je de sleutels en instellingen van de wallet op, maar geen transactienotities of betalingen in behandeling.',
  'cloud.saved': 'Back-up geverifieerd',
  'cloud.savedDescription':
    'Je versleutelde back-up is opgeslagen, gedownload en met succes ontsleuteld. Bewaar de toegangssleutel en de back-up van je Geheime Sleutel. Herstellen op een ander apparaat is nog niet getest.',
  'cloud.subtitle':
    'Versleuteld met een toegangssleutel. Vereist iCloud en iOS 18 of nieuwer.',
  'cloud.verifiedSubtitle':
    'Back-up geverifieerd op {date}. Tik om een nieuwe kopie op te slaan.',
  'cloud.empty':
    'In dit iCloud-account zijn geen back-ups voor herstel gevonden.',
  'cloud.restoreTitle': 'Deze wallet herstellen?',
  'cloud.restorePreview':
    'Wallet: {name}\nNetwerk: {network}\n\nDe herstelde wallet wordt toegevoegd. Bestaande wallets blijven ongewijzigd.',
  'cloud.restoredDescription':
    'De sleutels van de wallet zijn hersteld. Het saldo en de transacties worden via het netwerk bijgewerkt.',
  'cloud.unsupported':
    'Voor back-ups met een toegangssleutel heb je een iPhone of iPad met iOS 18 of nieuwer en de bijgewerkte Bithold-app nodig.',
  'cloud.prfUnsupported':
    'Deze aanbieder van toegangssleutels ondersteunt geen versleuteling van back-ups. Er is geen geverifieerde back-up gemaakt. Bewaar de back-up van je Geheime Sleutel.',
  'cloud.accountUnavailable':
    'Log in bij iCloud via Instellingen op je apparaat en probeer het daarna opnieuw.',
  'cloud.accountChanged':
    'Het iCloud-account is tijdens deze bewerking gewijzigd. Probeer het opnieuw met het juiste account.',
  'cloud.quotaExceeded':
    'Je iCloud-opslag is vol. Maak ruimte vrij en probeer het opnieuw.',
  'cloud.network':
    'Kan iCloud niet bereiken. Controleer je verbinding en probeer het opnieuw.',
  'cloud.invalidPayload':
    'Kan niet verifiëren dat deze back-up een ondersteunde Bithold-wallet is. Er is niets geïmporteerd.',
  'cloud.duplicate':
    'Deze wallet staat al in de app. Er is geen duplicaat toegevoegd.',
  'cloud.interrupted':
    'De bewerking is onderbroken. Ontgrendel de app en probeer het opnieuw.',
  'cloud.watchOnly':
    'Deze wallet is alleen-lezen en bevat geen privésleutels waarvan je een back-up kunt maken.',
  'cloud.busy': 'Er is al een back-upbewerking bezig.',
  'cloud.failed':
    'De bewerking kon niet worden voltooid of geverifieerd. Controleer iCloud en de toegangssleutel, en probeer het daarna opnieuw. Bewaar de back-up van je Geheime Sleutel.',
  'cloudRestore.pickerHeader': 'Wallet herstellen',
  'cloudRestore.pickerTitle': 'Herstellen uit back-up',
  'cloudRestore.pickerSubtitle': 'Kies een back-up om te herstellen',
  'cloudRestore.backupName': '#{index} iCloud-back-up',
  'cloudRestore.active': 'In gebruik',
  'cloudRestore.pastBackups': 'Eerdere back-ups',
  'cloudRestore.restoring': 'Wallet wordt hersteld...',
  'cloudRestore.restoringSubtitle': 'Een ogenblik geduld',
  'cloudRestore.success': 'Herstel geslaagd!',
  'cloudRestore.activeTitle': 'Back-up al in gebruik',
  'cloudRestore.emptyTitle': 'Geen back-ups gevonden',
  'cloudRestore.accessTitle': 'Toegang tot\niCloud toestaan',
  'cloudRestore.passkeysTitle': 'Toegangssleutels inschakelen',
  'cloudRestore.errorTitle': 'Er is iets misgegaan',
  'cloudRestore.prfUnsupported':
    'Deze aanbieder van toegangssleutels kan geen iCloud-back-ups ontgrendelen. Gebruik toegangssleutels die in de iCloud-sleutelhanger zijn opgeslagen, of herstel de wallet met je Geheime Sleutel.',
  'common.back': 'Terug',
  'common.cancel': 'Annuleren',
  'common.continue': 'Doorgaan',
  'common.done': 'Gereed',
  'common.edit': 'Bewerken',
  'common.loading': 'Bezig met laden',
  'settings.title': 'Instellingen',
  'settings.row.currency': 'Valuta',
  'settings.row.unit': 'Weergave-eenheid',
  'settings.unit.fixedPrecision': 'Altijd 8 decimalen tonen',
  'settings.row.language': 'Taal',
  'settings.row.blockExplorer': 'Blockexplorer',
  'settings.explorer.custom': 'Aangepast',
  'settings.explorer.customSubtitle': 'Gebruik je eigen blockexplorer',
  'settings.explorer.urlPlaceholder': 'Webadres van je blockexplorer',
  'settings.explorer.invalidUrl':
    'Voer een webadres in dat begint met https:// of http://.',
  'settings.notificationsDenied':
    'Sta meldingen voor Bithold toe in Instellingen op je iPhone.',
  'settings.notificationsOpenSettings': 'Instellingen openen',
  'settings.notificationsFailed':
    'Kan de toestemming voor meldingen niet bijwerken. Probeer het opnieuw.',
  'settings.row.notifications': 'Meldingen',
  'settings.row.sounds': 'Geluiden',
  'settings.row.haptic': 'Haptische feedback',
  'settings.row.animation': 'Portfolioanimatie',
  'settings.row.passcode': 'Vergrendeling met toegangscode',
  'settings.row.faceId': 'Vergrendeling met Face ID',
  'settings.row.reset': 'App resetten',
  'settings.currencyFailed': 'Kan valuta niet wijzigen',
  'settings.resetMessage':
    'Alle lokale wallets en sleutels van dit apparaat verwijderen? Zorg dat je een back-up van hun herstelgegevens hebt gemaakt.',
  'settings.resetTitle': 'Weet je het zeker?',
  'settings.resetWarning': 'Dit kan niet ongedaan worden gemaakt.',
  'settings.resetConfirm': 'App resetten',
  'settings.setCurrency': 'Valuta instellen',
  'settings.searchCurrencies': 'Valuta zoeken',
  'settings.closeSearch': 'Zoeken sluiten',
  'settings.noCurrencies': 'Geen valuta gevonden',
  'settings.noCurrenciesHint': 'Probeer een valutanaam of -code.',
  'settings.selectLanguage': 'Taal kiezen',
  'restore.icloudTitle': 'Herstellen met je iCloud-back-up',
  'restore.icloudSubtitle':
    'Herstel je account met je toegangssleutels in iCloud.',
  'restore.secretKeyTitle': 'Geheime Sleutel (geavanceerd)',
  'restore.secretKeySubtitle':
    'Herstel je account met je Geheime Sleutel van 12 woorden.',
  'restore.qrTitle': 'QR-code',
  'restore.qrSubtitle': 'Synchroniseer met Bithold op een ander apparaat.',
  'electrum.chooseServer': 'Kies een server.',
  'currency.AED': 'Verenigde Arabische Emiraten-dirham',
  'currency.AMD': 'Armeense dram',
  'currency.ANG': 'Nederlands-Antilliaanse gulden',
  'currency.ARS': 'Argentijnse peso',
  'currency.AUD': 'Australische dollar',
  'currency.AWG': 'Arubaanse gulden',
  'currency.BDT': 'Bengalese taka',
  'currency.BHD': 'Bahreinse dinar',
  'currency.BOB': 'Boliviaanse boliviano',
  'currency.BRL': 'Braziliaanse real',
  'currency.CAD': 'Canadese dollar',
  'currency.CHF': 'Zwitserse frank',
  'currency.CLP': 'Chileense peso',
  'currency.CNY': 'Chinese yuan',
  'currency.COP': 'Colombiaanse peso',
  'currency.CZK': 'Tsjechische kroon',
  'currency.DKK': 'Deense kroon',
  'currency.DOP': 'Dominicaanse peso',
  'currency.DZD': 'Algerijnse dinar',
  'currency.EGP': 'Egyptisch pond',
  'currency.ETB': 'Ethiopische birr',
  'currency.EUR': 'Euro',
  'currency.GBP': 'Brits pond',
  'currency.GHS': 'Ghanese cedi',
  'currency.GTQ': 'Guatemalteekse quetzal',
  'currency.HKD': 'Hongkongse dollar',
  'currency.HUF': 'Hongaarse forint',
  'currency.IDR': 'Indonesische roepia',
  'currency.ILS': 'Israëlische nieuwe shekel',
  'currency.INR': 'Indiase roepie',
  'currency.IRR': 'Iraanse rial',
  'currency.IRT': 'Iraanse toman',
  'currency.ISK': 'IJslandse kroon',
  'currency.JPY': 'Japanse yen',
  'currency.KES': 'Keniaanse shilling',
  'currency.KRW': 'Zuid-Koreaanse won',
  'currency.KWD': 'Koeweitse dinar',
  'currency.KZT': 'Kazachse tenge',
  'currency.LBP': 'Libanees pond',
  'currency.LKR': 'Sri Lankaanse roepie',
  'currency.MAD': 'Marokkaanse dirham',
  'currency.MXN': 'Mexicaanse peso',
  'currency.MYR': 'Maleisische ringgit',
  'currency.MZN': 'Mozambikaanse metical',
  'currency.NGN': 'Nigeriaanse naira',
  'currency.NOK': 'Noorse kroon',
  'currency.NZD': 'Nieuw-Zeelandse dollar',
  'currency.OMR': 'Omaanse rial',
  'currency.PEN': 'Peruaanse sol',
  'currency.PHP': 'Filipijnse peso',
  'currency.PKR': 'Pakistaanse roepie',
  'currency.PLN': 'Poolse zloty',
  'currency.PYG': 'Paraguayaanse guarani',
  'currency.QAR': 'Qatarese rial',
  'currency.RON': 'Roemeense leu',
  'currency.RSD': 'Servische dinar',
  'currency.RUB': 'Russische roebel',
  'currency.SAR': 'Saoedi-Arabische riyal',
  'currency.SEK': 'Zweedse kroon',
  'currency.SGD': 'Singaporese dollar',
  'currency.THB': 'Thaise baht',
  'currency.TRY': 'Turkse lira',
  'currency.TWD': 'Nieuwe Taiwanese dollar',
  'currency.TZS': 'Tanzaniaanse shilling',
  'currency.UAH': 'Oekraïense hryvnia',
  'currency.UGX': 'Oegandese shilling',
  'currency.USD': 'Amerikaanse dollar',
  'currency.UYU': 'Uruguayaanse peso',
  'currency.UZS': 'Oezbeekse sum',
  'currency.VES': 'Venezolaanse bolivar',
  'currency.VND': 'Vietnamese dong',
  'currency.XAF': 'Centraal-Afrikaanse CFA-frank',
  'currency.XOF': 'West-Afrikaanse CFA-frank',
  'currency.ZAR': 'Zuid-Afrikaanse rand',
  'common.copyAddress': 'Adres kopiëren',
  'bubble.dismissAddress': 'Adres verbergen',
  'brand.logo': 'Bithold-logo',
  'sheet.dismiss': 'Paneel sluiten',
  'sheet.background': 'Achtergrond van paneel',
  'wallet.alertTitle': 'Wallet',
  'error.operationFailed': 'De bewerking kon niet worden voltooid.',
  'common.next': 'Volgende',
  'common.ok': 'OK',
  'import.title': 'Voer je herstelzin, sleutel of descriptor in',
  'common.confirm': 'Bevestigen',
  'import.loading': 'Je wallet wordt geïmporteerd…',
  'import.failed': 'Kan wallet niet importeren',
  'import.inputAlertTitle': 'Invoer niet mogelijk',
  'import.inputLimit': 'De invoer overschrijdt de limiet van 16.384 tekens.',
  'import.fieldUnavailable': 'Het importveld is niet meer beschikbaar.',
  'import.fieldInactive': 'Het importveld is niet meer actief.',
  'import.composing': 'Maak het huidige woord af voordat je importeert.',
  'import.description':
    'Als je een herstelzin gebruikt om de wallet te importeren, scheid dan elk woord met een spatie.',
  'import.inputLabel': 'Herstelzin, sleutel of descriptor',
  'import.inputHint': 'Voer je herstelzin, privésleutel of descriptor in.',
  'import.pasteEmpty':
    'Kopieer je herstelzin of privésleutel en tik daarna op “Plakken”.',
  'import.clear': 'Wissen',
  'import.scan': 'Scannen',
  'import.paste': 'Plakken',
  'import.passphrase': 'Wachtwoordzin',
  'import.passphrasePrompt':
    'Voer je wachtwoordzin in als je er een hebt gebruikt',
  'import.options': 'Importopties',
  'onboarding.welcome.setupOptions':
    'Stel Bithold in met een van de volgende opties.',
  'onboarding.welcome.selfCustody':
    'Met zelfbewaring heb je\naltijd de controle\nover je tegoed',
  'onboarding.welcome.recoveryPhrase': 'Herstelzin maken',
  'onboarding.welcome.recoveryDescription':
    'Een nieuwe Bitcoin-wallet, te herstellen met 12 woorden',
  'onboarding.welcome.importDescription':
    'Herstelzin, privésleutel of iCloud\u2011back\u2011up',
  'onboarding.welcome.email': 'Doorgaan met e-mail',
  'onboarding.welcome.emailDescription': 'Log in of maak een Wallet-account',
  'onboarding.welcome.import': 'Importeren',
  'onboarding.welcome.apple': 'Inloggen met Apple',
  'onboarding.welcome.google': 'Inloggen met Google',
  'onboarding.welcome.termsIntro':
    'Door Bithold te gebruiken, ga je akkoord met onze',
  'onboarding.welcome.termsOfService': 'Servicevoorwaarden',
  'onboarding.welcome.termsAnd': 'en ons',
  'onboarding.welcome.privacyPolicy': 'Privacybeleid',
  'onboarding.or': 'OF',
  'onboarding.welcomeTitle': 'Welkom bij uw nieuwe digitale portemonnee!',
  'onboarding.getStarted': 'Ga aan de slag',
  'onboarding.restoreWallet': 'Herstel portemonnee',
  'onboarding.title':
    'Beveilig, beheer en\nbewaar je Bitcoin,\nalles op één plek',
  'onboarding.create': 'Nieuwe wallet aanmaken',
  'onboarding.creating': 'Je wallet wordt aangemaakt…',
  'onboarding.createFailed': 'Kan wallet niet aanmaken',
  'onboarding.import': 'Wallet importeren',
  'onboarding.terms':
    'Door verder te gaan, ga je akkoord met de {terms} en het {privacy}',
  'onboarding.termsOfService': 'Servicevoorwaarden',
  'onboarding.privacyPolicy': 'Privacybeleid',
  'onboarding.noCloudBackup':
    'Bithold maakt nog geen back-ups van wallets in de cloud, dus er is geen back-up om uit de cloud te importeren.',
  'importWith.title': 'Importeren met',
  'importWith.phraseTitle': 'Herstelzin of privésleutel',
  'importWith.phraseDescription':
    'Gebruik een herstelzin van 12, 18 of 24 woorden, of een privésleutel',
  'importWith.cloudTitle': 'Back-up in de cloud',
  'importWith.cloudDescription':
    'Importeer je wallet snel vanuit je back-up in de cloud',
  'common.save': 'Opslaan',
  'import.passphraseEnabled': 'Wachtwoordzin ingeschakeld',
  'import.usePassphrase': 'Wachtwoordzin gebruiken',
  'import.addressType': 'Adrestype: {type}',
  'import.addressTypesAutomatic': 'Adrestypen: automatisch',
  'import.defaultDerivationPath': 'Standaardafleidingspad',
  'import.bip39Passphrase': 'BIP39-wachtwoordzin',
  'import.bip39PassphraseMessage':
    'Gebruik exact de wachtwoordzin die bij deze wallet hoort. Standaard is de wachtwoordzin leeg.',
  'import.addressTypeTitle': 'Adrestype',
  'import.derivationPath': 'Afleidingspad',
  'import.pasteFailed': 'Kan niet plakken',
  'import.pasteAccess': 'Sta plakken toe wanneer iOS erom vraagt.',
  'import.nothingToPaste': 'Niets om te plakken',
  'import.editWord': 'Woord bewerken',
  'scanner.title': 'Scan om te verzenden',
  'scanner.denied':
    'Geef in Instellingen toegang tot je camera om QR-codes te scannen.',
  'scanner.unavailable':
    'Camera niet beschikbaar. Voer het adres in of plak het.',
  'scanner.openSettings': 'Instellingen openen',
  'scanner.invalid': 'Deze QR-code bevat geen geldig Bitcoin-adres.',
  'balance.resetFailed': 'Kan niet resetten',
  'balance.refreshFailed': 'Kan niet vernieuwen',
  'activity.title': 'Activiteit',
  'balance.hiddenLabel': 'Saldo verborgen. Houd ingedrukt om te tonen.',
  'balance.shownLabel': 'Walletsaldo. Houd ingedrukt om te verbergen.',
  'balance.walletSelector': 'Walletkiezer',
  'wallet.defaultName': 'Wallet {number}',
  'balance.receive': 'Ontvangen',
  'balance.send': 'Verzenden',
  'chart.noData': 'Geen gegevens beschikbaar, probeer het opnieuw',
  'chart.bitcoinPrice': 'Bitcoin-koers',
  'chart.today': '{change} vandaag',
  'balance.pullToRefresh': 'Trek om te vernieuwen',
  'balance.releaseToRefresh': 'Laat los om te vernieuwen',
  'balance.updating': 'Bijwerken…',
  'common.copied': 'Gekopieerd',
  'common.copiedBubble': 'Gekopieerd.',
  'error.tryAgain': 'Probeer het opnieuw.',
  'addressType.descriptor': 'Aangepast script',
  'receive.addressLabel': 'Je BTC-adres',
  'receive.addressLabelTaproot': 'Je Taproot-BTC-adres',
  'receive.addressLabelLegacy': 'Je Legacy-BTC-adres',
  'receive.title': 'Bitcoin ontvangen',
  'receive.pathTitle': 'Ontvangstpad',
  'receive.qrCopy': 'Kopiëren',
  'receive.qrShare': 'Delen…',
  'receive.addressFailed': 'Kan adres niet ophalen',
  'receive.newAddress': 'Nieuw adres',
  'receive.newAddressHint': 'Toont een nieuw ontvangstadres op dit pad',
  'receive.copyFailed': 'Kan niet kopiëren',
  'receive.shareFailed': 'Kan niet delen',
  'receive.typeLabel': 'Type ontvangstadres',
  'receive.typeHint': 'Opent de beschikbare typen ontvangstadressen',
  'receive.qrLabel':
    'Bithold-QR-code. Houd ingedrukt om te kopiëren of te delen.',
  'receive.choosePath': 'Ontvangstpad kiezen',
  'receive.choosePathAddress': 'Ontvangstpad kiezen. {address}',
  'receive.choosePathHint':
    'Opent de beschikbare ontvangstpaden voor deze wallet',
  'receive.pathFailed': 'Kan ontvangstpad niet kiezen',
  'receive.path.wif': 'Losse privésleutel',
  'receive.path.address': 'Geïmporteerd adres',
  'receive.path.descriptor': 'Geïmporteerde descriptor',
  'auth.notCompleted': 'Authenticatie is niet voltooid',
  'native.storageRead':
    'Kan lokale walletgegevens niet lezen. Ontgrendel het apparaat en probeer het opnieuw.',
  'native.storageSave': 'Kan lokale walletgegevens niet opslaan',
  'native.storageRemove': 'Kan lokale walletgegevens niet verwijderen',
  'native.entropySize': 'Ongeldige entropiegrootte',
  'native.randomness': 'Veilige willekeur niet beschikbaar',
  'native.invalidServer': 'Ongeldige server',
  'native.tlsFailed': 'TLS-verbinding mislukt',
  'native.tcpFailed': 'TCP-verbinding mislukt',
  'native.connectTimeout': 'Time-out bij verbinden',
  'native.certificateChanged': 'Certificaat gewijzigd',
  'native.certificateUntrusted': 'Niet-vertrouwd certificaat',
  'native.overlappingRequest': 'Ongeldig of overlappend serververzoek',
  'native.timeout': 'Time-out bij serververzoek',
  'native.sendFailed': 'Kan serververzoek niet verzenden',
  'native.responseTooLarge': 'Serverantwoord te groot',
  'native.invalidResponse': 'Ongeldig serverantwoord',
  'native.unexpectedResponse': 'Onverwacht serverantwoord',
  'native.disconnected': 'Verbinding met server verbroken',
  'native.connectionClosed': 'Verbinding gesloten',
  'native.unavailable': 'Deze build bevat de native walletengine niet',
  'send.amountTitle': 'Bedrag invoeren',
  'send.priceUnavailable': 'Prijs niet beschikbaar',
  'send.priceUnavailableMessage':
    'Voer het bedrag in Bitcoin in zolang de wisselkoers niet beschikbaar is.',
  'send.dustWarning':
    'Het Bitcoin-netwerk weigert bedragen van {amount} of minder',
  'send.insufficientWarning': 'Stort meer geld of voer een lager bedrag in.',
  'send.amountInCurrency': 'Bedrag in {currency}',
  'send.amountInBitcoin': 'Bedrag in Bitcoin',
  'send.switchCurrency': 'Wisselen tussen Bitcoin en {currency}',
  'send.useAvailable': 'Beschikbaar saldo gebruiken',
  'send.available': 'Beschikbaar',
  'send.networkFee': 'Netwerkkosten',
  'error.keys.invalidAddressIndex': 'Ongeldige adresindex',
  'error.keys.addressBranchUnavailable': 'Adrestak niet beschikbaar',
  'error.keys.descriptorMustProduceAddressableOutput':
    'Descriptor moet een adresseerbare output opleveren',
  'error.keys.witnessScriptsRequireCompressedPublic':
    'Witness-scripts vereisen gecomprimeerde publieke sleutels',
  'error.keys.walletCannotSign': 'Deze wallet kan niet ondertekenen',
  'error.descriptor.invalidDescriptorCharacter': 'Ongeldig teken in descriptor',
  'error.descriptor.invalidDescriptor': 'Ongeldige descriptor',
  'error.descriptor.invalidDescriptorDerivation':
    'Ongeldige afleiding in descriptor',
  'error.descriptor.publicKeysCannotHaveDerivation':
    'Publieke sleutels kunnen geen afleidingspaden hebben',
  'error.descriptor.privateKeysCannotHaveDerivation':
    'Privésleutels kunnen geen afleidingspaden hebben',
  'error.descriptor.hardenedStepsMustPrecedeBranches':
    'Geharde stappen moeten vóór vertakkingen komen',
  'error.descriptor.publicKeyCannotDeriveHardened':
    'Een publieke sleutel kan geen geharde onderliggende sleutels afleiden',
  'error.descriptor.invalidDescriptorChecksum':
    'Ongeldige controlesom van descriptor',
  'error.descriptor.descriptorNestingTooDeep': 'Descriptor te diep genest',
  'error.descriptor.unsupportedDescriptorNesting':
    'Niet-ondersteunde nesting in descriptor',
  'error.descriptor.invalidMultisigThreshold': 'Ongeldige multisig-drempel',
  'error.descriptor.unsupportedDescriptorExpression':
    'Niet-ondersteunde expressie in descriptor',
  'error.descriptor.duplicateMultisigKeys': 'Dubbele multisig-sleutels',
  'error.descriptor.descriptorRequiresCompressedXOnly':
    'Deze descriptor vereist een gecomprimeerde of x-only publieke sleutel',
  'error.keys.unsupportedBitcoinNetwork': 'Niet-ondersteund Bitcoin-netwerk',
  'error.keys.invalidDerivationPath': 'Ongeldig afleidingspad',
  'error.keys.derivationIndexTooLarge': 'Afleidingsindex is te groot',
  'error.keys.invalidExtendedKey': 'Ongeldige uitgebreide sleutel',
  'error.keys.keyBelongsDifferentBitcoinNetwork':
    'Sleutel hoort bij een ander Bitcoin-netwerk',
  'error.keys.invalidPrivateKeyNetwork':
    'Ongeldige privésleutel of ongeldig netwerk',
  'error.keys.unsupportedAddressType': 'Niet-ondersteund adrestype',
  'error.keys.enterRecoveryPhraseKeyDescriptor':
    'Voer een herstelzin, sleutel of descriptor in',
  'error.keys.invalidRecoveryPhraseCheckEvery':
    'Ongeldige herstelzin: controleer elk woord, het aantal woorden en de controlesom',
  'error.payment.missingSpendingOutput': 'Te besteden output ontbreekt',
  'error.payment.spendingOutputChanged': 'Te besteden output is gewijzigd',
  'error.payment.unsupportedTaprootSpendPath':
    'Niet-ondersteund Taproot-bestedingspad',
  'error.payment.unsupportedInputScriptFeeEstimation':
    'Niet-ondersteund inputscript voor kostenschatting',
  'error.payment.useMostThreeDecimalPlaces':
    'Gebruik maximaal drie decimalen voor het kostentarief',
  'error.payment.watchOnlyWalletCannotSign':
    'Deze wallet is alleen-lezen en kan geen betalingen ondertekenen',
  'error.payment.refreshWalletBeforeSending':
    'Vernieuw de wallet voordat je verzendt',
  'error.payment.chooseFeeRate11000':
    'Kies een kostentarief van 1 tot 1000 sat/vB',
  'error.payment.invalidRbfPreference': 'Ongeldige RBF-voorkeur',
  'error.payment.enterLeast546Satoshis': 'Voer minimaal 546 satoshi in',
  'error.payment.insufficientBalanceAmountNetworkFee':
    'Onvoldoende saldo voor dit bedrag en de netwerkkosten',
  'error.payment.amountBelowBitcoinDustLimit':
    'Bedrag ligt na aftrek van kosten onder de dustlimiet van Bitcoin',
  'error.payment.noSpendableBitcoinAvailable':
    'Er is geen besteedbare Bitcoin beschikbaar',
  'error.payment.duplicateSpendingOutput': 'Dubbele te besteden output',
  'error.payment.walletSnapshotChangedRefreshFee':
    'Momentopname van de wallet is gewijzigd. Vernieuw de kostenschatting.',
  'error.payment.paymentAccountingMismatch':
    'Afwijking in de boekhouding van de betaling',
  'error.payment.secureSigningRandomnessUnavailable':
    'Veilige willekeur voor ondertekening niet beschikbaar',
  'error.payment.transactionRbfSettingDoesNot':
    'RBF-instelling van de transactie komt niet overeen met het goedgekeurde overzicht',
  'error.payment.recoveryMaterialCannotSignInput':
    'De herstelgegevens kunnen deze input niet ondertekenen',
  'error.payment.signedPaymentDoesNotMatch':
    'Ondertekende betaling komt niet overeen met het goedgekeurde overzicht',
  'error.payment.signedTransactionExceedsReviewedFee':
    'De ondertekende transactie overschrijdt de gecontroleerde kostenschatting. Bereid de transactie opnieuw voor.',
  'error.payment.broadcastResultUncertainSignedPayment':
    'Het resultaat van de uitzending is onzeker. De ondertekende betaling is bewaard; vernieuw om de status te controleren.',
  'error.replacement.unknownReplacement': 'Onbekende vervanging',
  'error.replacement.refreshWalletBeforeReplacingPayment':
    'Vernieuw de wallet voordat je een betaling vervangt',
  'error.replacement.paymentTooSmallCancelFee':
    'Deze betaling is te klein om met dit tarief te annuleren: na de netwerkkosten blijft er niets over.',
  'error.replacement.notEnoughConfirmedBitcoinRaise':
    'Niet genoeg bevestigde Bitcoin om de kosten van deze betaling te verhogen. Je kunt de betaling in plaats daarvan annuleren.',
  'error.replacement.replacementAccountingMismatch':
    'Afwijking in de boekhouding van de vervanging',
  'error.replacement.replacementFeeNotHigherThan':
    'Kosten van de vervanging zijn niet hoger dan die van het origineel',
  'error.chart.invalidHistoricalPrice': 'Ongeldige historische prijs',
  'error.chart.historicalPricesAreStale': 'Historische prijzen zijn verouderd',
  'error.chart.notEnoughHistoricalPrices': 'Niet genoeg historische prijzen',
  'error.chart.unsupportedChartRange': 'Niet-ondersteund grafiekbereik',
  'error.chart.incorrectHistoryCurrency':
    'Onjuiste valuta in prijsgeschiedenis',
  'error.chart.invalidHistoricalResponse':
    'Ongeldig antwoord met historische gegevens',
  'error.chart.invalidHistoryDate': 'Ongeldige datum in prijsgeschiedenis',
  'error.chart.unknownHistorySource': 'Onbekende bron voor prijsgeschiedenis',
  'error.chart.unsupportedHistoryCurrency':
    'Niet-ondersteunde valuta voor prijsgeschiedenis',
  'error.electrum.incompleteElectrumResponse': 'Onvolledig Electrum-antwoord',
  'error.electrum.duplicateElectrumResponse': 'Dubbel Electrum-antwoord',
  'error.electrum.walletConnectionClosed': 'Walletverbinding gesloten',
  'error.electrum.serverFailedBitcoinMainnetVerification':
    'Server heeft de verificatie voor Bitcoin Mainnet niet doorstaan',
  'error.electrum.connectionSuperseded': 'Verbinding is vervangen',
  'error.electrum.unableConnectBitcoinServersCheck':
    'Kan geen verbinding maken met Bitcoin-servers. Controleer je verbinding en vernieuw.',
  'error.electrum.invalidChainTip': 'Ongeldige top van de blockchain',
  'error.electrum.invalidSubscriptionStatus': 'Ongeldige abonnementsstatus',
  'error.electrum.addressHistoryChangedDuringSynchronization':
    'Adresgeschiedenis gewijzigd tijdens synchronisatie; vernieuw nogmaals',
  'error.electrum.invalidBlockHeader': 'Ongeldige blokheader',
  'error.fees.invalidFeeRecommendations': 'Ongeldige kostenaanbevelingen',
  'error.fees.inconsistentFeeRecommendations':
    'Inconsistente kostenaanbevelingen',
  'error.rates.incorrectRateBaseCurrency': 'Onjuiste basisvaluta voor koers',
  'error.rates.invalidStaleRateTimestamp':
    'Ongeldige of verouderde tijdstempel van koers',
  'error.rates.unknownRateProvider': 'Onbekende koersaanbieder',
  'error.rates.invalidRateResponse': 'Ongeldig koersantwoord',
  'error.rates.noSupportedPricesResponse':
    'Geen ondersteunde prijzen in antwoord',
  'error.rates.providerCoolingDownFailure':
    'Aanbieder is tijdelijk gepauzeerd na een fout',
  'error.rates.unsupportedCurrency': 'Niet-ondersteunde valuta',
  'error.rates.krakenReturnedError': 'Kraken gaf een fout terug',
  'error.rates.incorrectPriceCurrency': 'Onjuiste valuta voor prijs',
  'error.rates.invalidConversionResponse': 'Ongeldig antwoord voor omrekening',
  'error.rates.invalidBitcoinPrice': 'Ongeldige Bitcoin-prijs',
  'error.accounts.walletStorageNotReady': 'Walletopslag is niet gereed',
  'error.accounts.invalidRecoveryMaterialImportOptions':
    'Ongeldige herstelgegevens of importopties. Controleer de controlesom, het netwerk en het afleidingspad.',
  'error.accounts.walletAlreadyImported': 'Deze wallet is al geïmporteerd',
  'error.accounts.importWasInterruptedPleaseTry':
    'Het importeren is onderbroken. Probeer het opnieuw.',
  'error.accounts.enterWalletName180': 'Voer een walletnaam in van 1–80 tekens',
  'error.accounts.addressTypeUnavailable': 'Adrestype niet beschikbaar',
  'error.accounts.walletNoLongerExists': 'Wallet bestaat niet meer',
  'error.accounts.walletHasUnresolvedBroadcastCheck':
    'Deze wallet heeft een uitzending die nog niet is afgerond. Controleer die voordat je de wallet verwijdert.',
  'error.accounts.invalidTransaction': 'Ongeldige transactie',
  'error.accounts.invalidNote': 'Ongeldige notitie',
  'error.payment.walletNotSynchronized': 'Wallet is niet gesynchroniseerd',
  'error.payment.previousBroadcastUnresolvedRefreshRetry':
    'Een eerdere uitzending is nog niet afgerond. Vernieuw of probeer dezelfde betaling opnieuw vanuit Activiteit.',
  'error.payment.paymentAlreadyBeingSubmitted':
    'Er wordt al een betaling verzonden',
  'error.payment.paymentReviewExpiredSelectedWallet':
    'Het betalingsoverzicht is verlopen of de geselecteerde wallet is gewijzigd. Controleer de betaling opnieuw.',
  'error.payment.paymentConfirmedChangedMeantimeNothing':
    'Deze betaling is inmiddels bevestigd of gewijzigd. Er is niets vervangen.',
  'error.payment.selectedCoinsChangedReviewPayment':
    'De geselecteerde munten zijn gewijzigd. Controleer de betaling opnieuw.',
  'error.payment.signingKeyUnavailable':
    'Ondertekeningssleutel is niet beschikbaar',
  'error.payment.noUnresolvedPaymentAvailable':
    'Er is geen niet-afgeronde betaling beschikbaar',
  'error.preferences.unknownPreference': 'Onbekende voorkeur',
  'error.preferences.backgroundPushNotificationsAreNot':
    'Pushmeldingen op de achtergrond zijn niet geconfigureerd. Saldosynchronisatie werkt terwijl de app geopend is.',
  'error.recovery.watchOnlyWalletHasNo':
    'Deze wallet is alleen-lezen en bevat geen herstelgegevens met privésleutels',
  'error.recovery.walletHasNoPrivateRecovery':
    'Deze wallet bevat geen herstelgegevens met privésleutels',
  'error.recovery.recoveryMaterialUnavailable':
    'Herstelgegevens zijn niet beschikbaar',
  'error.recovery.watchOnlyWalletHasNo2':
    'Deze wallet is alleen-lezen en heeft geen privésleutels',
  'error.recovery.walletHasNoPrivateKeys':
    'Deze wallet heeft geen privésleutels',
  'error.recovery.addressControlledBySeveralKeys':
    'Dit adres wordt beheerd door meerdere sleutels en heeft dus geen afzonderlijke privésleutel.',
  'error.storage.walletMetadataDamaged': 'Metadata van wallet is beschadigd',
  'error.sync.invalidRawTransaction': 'Ongeldige ruwe transactie',
  'error.sync.transactionIdVerificationFailed':
    'Verificatie van transactie-ID mislukt',
  'error.sync.invalidTransactionValues': 'Ongeldige transactiewaarden',
  'error.sync.invalidAddressState': 'Ongeldige adresstatus',
  'error.sync.inconsistentTransactionHistory':
    'Inconsistente transactiegeschiedenis',
  'error.sync.invalidUnspentOutput': 'Ongeldige onbestede output',
  'error.sync.balanceDoesNotMatchUnspent':
    'Saldo komt niet overeen met onbestede outputs',
  'error.sync.walletScanCancelled': 'Walletscan geannuleerd',
  'error.sync.addressDiscoveryLimitReachedLarger':
    'Limiet voor adresdetectie bereikt; een grotere scan vereist een expliciete herstelconfiguratie',
  'error.sync.overlappingWalletDerivationBranches':
    'Overlappende afleidingstakken in wallet',
  'error.sync.historyChangedDuringSynchronization':
    'Geschiedenis gewijzigd tijdens synchronisatie',
  'error.sync.missingInputTransaction': 'Inputtransactie ontbreekt',
  'error.sync.invalidTransactionAccounting':
    'Ongeldige boekhouding van transactie',
  'error.sync.serverHistoryDoesNotBelong':
    'Servergeschiedenis hoort niet bij dit adres',
  'error.sync.serverOmittedAddedUnspentOutputs':
    'Server heeft onbestede outputs weggelaten of toegevoegd',
  'error.sync.outputValueOwnershipMismatch':
    'Waarde of eigendom van output komt niet overeen',
  'error.sync.chainChangedDuringSynchronizationRefresh':
    'Keten gewijzigd tijdens synchronisatie; vernieuw nogmaals',
  'error.sync.invalidWalletBalance': 'Ongeldig walletsaldo',
  'error.sync.connectionChangedDuringSynchronizationRefresh':
    'Verbinding gewijzigd tijdens synchronisatie; vernieuw nogmaals',
  'error.payment.serviceUnavailable': 'Dienst niet beschikbaar ({status})',
  'error.chart.historyUnavailable':
    'Historische prijzen voor {currency} zijn tijdelijk niet beschikbaar. Je opgeslagen grafiek is behouden.',
  'error.electrum.rejected': 'Electrum heeft {method} geweigerd',
  'error.rates.noProvider':
    'Er is momenteel geen prijsaanbieder beschikbaar voor {currency}. De laatst opgeslagen prijs is behouden.',
  'error.addresses.gapLimit': {
    one: 'Deze wallet heeft al {count} ongebruikt adres op rij. Ontvang daar eerst een betaling op, zodat andere wallets die deze wallet herstellen je tegoed nog kunnen vinden.',
    other:
      'Deze wallet heeft al {count} ongebruikte adressen op rij. Ontvang eerst een betaling op een daarvan, zodat andere wallets die deze wallet herstellen je tegoed nog kunnen vinden.',
  },
  'error.preferences.priceUnavailable':
    'Er is tijdelijk geen prijs voor {currency} beschikbaar. Je geselecteerde valuta is niet gewijzigd.',
  'error.storage.openFailed':
    'Kan je lokale wallets niet openen. Ontgrendel je telefoon en probeer het opnieuw.',
  'recovery.passphraseLabel': 'BIP39-wachtwoordzin:',
  'fee.custom': 'Aangepaste kosten',
  'fee.estimateUnavailable': 'Geschatte bevestigingstijd niet beschikbaar',
  'fee.network': 'Netwerkkosten',
  'fee.enterValid': 'Voer een geldig tarief in',
  'fee.tier.veryLow': 'Zeer lage kosten',
  'fee.tier.low': 'Lage kosten',
  'fee.tier.recommended': 'Aanbevolen kosten',
  'fee.tier.priority': 'Prioriteitskosten',
  'fee.tier.top': 'Topprioriteitskosten',
  'fee.speed': 'Bevestigingssnelheid: {speed}',
  'fee.speedName.veryLow': 'zeer langzaam',
  'fee.speedName.low': 'langzaam',
  'fee.speedName.recommended': 'normaal',
  'fee.speedName.priority': 'snel',
  'fee.speedName.top': 'zeer snel',
  'fee.lowWarning': 'Transactie kan mislukken door lage kosten',
  'replace.reason.confirmed':
    'Alleen onbevestigde betalingen kunnen worden vervangen.',
  'replace.reason.watchOnly':
    'Deze wallet is alleen-lezen en kan niet ondertekenen.',
  'replace.reason.received':
    'Alleen betalingen die vanuit deze wallet zijn verzonden, kunnen worden vervangen.',
  'replace.reason.foreignInputs':
    'Sommige inputs van deze betaling horen bij een andere wallet.',
  'replace.reason.spentLater':
    'Een latere onbevestigde betaling besteedt Bitcoin uit deze betaling. Als je deze vervangt, wordt die betaling ook geannuleerd.',
  'replace.reason.refresh': 'Vernieuw de wallet en probeer het opnieuw.',
  'send.title': 'Bitcoin verzenden',
  'send.scanLabel': 'Bitcoin-QR-code scannen',
  'send.addressLabel': 'Bitcoin-adres',
  'send.addressPlaceholder': 'Naar Bitcoin-adres verzenden',
  'send.notePlaceholder': 'Persoonlijke notitie',
  'send.noteOptional': '(optioneel)',
  'send.noteHint':
    'Voer een notitie in om deze transactie in de geschiedenis van je wallet makkelijk te herkennen',
  'send.clipboardEmpty':
    'Klembord is leeg. Tik nogmaals om een adres in te voeren.',
  'send.pasteFailed':
    'Kan niet plakken. Tik nogmaals om een adres in te voeren.',
  'send.invalidAddress':
    'Ongeldig BTC-adres. Controleer het en probeer het opnieuw.',
  'send.feesUnavailable':
    'Netwerkkosten zijn momenteel niet beschikbaar. Controleer je verbinding en probeer het opnieuw.',
  'send.prepareFailed': 'Kan betaling niet voorbereiden',
  'send.statusText': '{amount} verzenden',
  'send.sentLabel': '{amount} verzonden',
  'send.sendingLabel': '{amount} wordt verzonden',
  'send.submitFailed': 'Kan deze betaling niet verzenden.',
  'send.paymentTitle': 'Betaling',
  'review.title': 'Controleren',
  'review.customizeFees': 'Kosten aanpassen',
  'review.to': 'Naar',
  'review.amount': 'Bedrag',
  'review.total': 'Totaal',
  'review.feeRate': 'Kostentarief',
  'fee.minimum': 'Het minimumtarief is {rate} sat/vB',
  'fee.maximum': 'Het maximumtarief is {rate} sat/vB',
  'fee.rateLabel': 'Tarief voor netwerkkosten',
  'fee.rateInputLabel': 'Tarief in satoshi per virtuele byte',
  'fee.calculating': 'Berekenen…',
  'fee.rbf': 'Versnelling (RBF)',
  'fee.rbfLabel': 'Vervangen door hogere kosten (RBF)',
  'fee.enabled': 'Ingeschakeld',
  'fee.disabled': 'Uitgeschakeld',
  'slide.label': 'Schuif om te bevestigen',
  'slide.handleLabel': 'Sleep de schuifknop naar rechts om te bevestigen',
  'send.showAddress': 'Volledig Bitcoin-adres tonen',
  'manageWallets.title': 'Wallets beheren',
  'addWallet.title': 'Wallet toevoegen',
  'addWallet.createTitle': 'Wallet aanmaken',
  'addWallet.createDescription': 'Maak een nieuwe wallet met herstelzin',
  'addWallet.icloudTitle': 'iCloud-back-up',
  'walletSettings.name': 'Walletnaam',
  'walletIcon.title': 'Walleticoon',
  'walletIcon.change': 'Walleticoon wijzigen',
  'walletIcon.initials': 'Initialen',
  'walletIcon.wallet': 'Wallet',
  'walletIcon.multi_chain': 'Multichain',
  'walletIcon.diamond': 'Diamant',
  'walletIcon.speed': 'Snelheid',
  'walletIcon.bitcoin': 'Bitcoin',
  'walletIcon.tron': 'Tron',
  'walletIcon.heart': 'Hart',
  'walletIcon.dollar': 'Dollar',
  'walletIcon.card': 'Kaart',
  'walletIcon.flame': 'Vlam',
  'walletIcon.leaderboard': 'Ranglijst',
  'walletIcon.savings': 'Spaargeld',
  'walletIcon.key': 'Sleutel',
  'walletIcon.growth': 'Groei',
  'walletIcon.gift': 'Cadeau',
  'walletIcon.star': 'Ster',
  'walletColor.label': '{color} als walletkleur',
  'walletColor.gold': 'Goud',
  'walletColor.indigo': 'Indigo',
  'walletColor.red': 'Rood',
  'walletColor.orange': 'Oranje',
  'walletColor.sand': 'Zand',
  'walletColor.neon': 'Neon',
  'walletColor.green': 'Groen',
  'walletColor.ocean': 'Oceaan',
  'walletColor.lavender': 'Lavendel',
  'walletColor.fuchsia': 'Fuchsia',
  'walletColor.grey': 'Grijs',
  'manageWallets.settingsFor': 'Walletinstellingen voor {name}',
  'walletSettings.title': 'Walletinstellingen',
  'walletSettings.unavailableFeature':
    'Deze functie is niet beschikbaar in deze build.',
  'walletSettings.nameRow': 'Naam',
  'walletSettings.backup': 'Back-up',
  'walletSettings.addresses': 'Adressen',
  'walletSettings.signVerify': 'Bericht ondertekenen/verifiëren',
  'walletSettings.backupWarning':
    'Maak altijd een back-up van je wallet, zodat je de toegang niet verliest als je je apparaat kwijtraakt of reset.',
  'walletSettings.remove': 'Wallet verwijderen',
  'backup.secretKey': 'Geheime Sleutel',
  'backup.methodsTitle': 'Back-upmethoden',
  'backup.protectTitle': 'Bescherm je wallet',
  'backup.protectSubtitle':
    'Beveilig de back-up van je wallet in iCloud met een toegangssleutel via Face ID of Touch ID.',
  'backup.secure': 'Beveiligen',

  'backup.creating': 'Back-up wordt gemaakt',
  'backup.created': 'Back-up gemaakt',
  'backup.icloudTitle': 'iCloud-back-up',
  'backup.icloudSubtitle':
    'Beveilig met je toegangssleutels in iCloud en herstel met Face ID of Touch ID.',
  'backup.localWallet': 'Lokale wallet',
  'backup.cloudDisabled':
    'Back-up in de cloud is uitgeschakeld. Gebruik de Geheime Sleutel om handmatig een back-up van je herstelgegevens te maken.',
  'backup.secretKeySubtitle':
    'Haal je herstelgegevens op om je wallet handmatig te herstellen.',
  'backup.revealTitle': 'Schrijf je back-up op',
  'backup.revealWords':
    'Schrijf deze woorden in de juiste volgorde op en bewaar ze offline op een veilige plek.',
  'backup.revealKey':
    'Schrijf dit exact zo op als het hier staat en bewaar het offline op een veilige plek.',
  'backup.coverTitle': 'Je Geheime Sleutel tonen',
  'backup.check.writeDown': 'Schrijf hem op. Niet digitaal.',
  'backup.check.private': 'Laat niemand meekijken.',
  'backup.check.protect': 'Bescherm je Geheime Sleutel.',
  'backup.check.neverShare': 'Deel hem nooit.',
  'backup.check.dontLose': 'Raak hem niet kwijt.',
  'backup.hold': 'Houd ingedrukt om te tonen',
  'backup.holdHint':
    'Blijf ingedrukt houden om je Geheime Sleutel te bekijken. Laat los om hem te verbergen.',
  'remove.removedTitle': 'Wallet verwijderd',
  'remove.confirmTitle': 'Van dit apparaat verwijderen?',
  'remove.removedOthers':
    'Je andere wallets zijn nog steeds beschikbaar op dit apparaat.',
  'remove.removedLast':
    'Je kunt nu een nieuwe wallet aanmaken of een wallet importeren.',
  'remove.confirmMessage':
    'De lokale sleutels en gegevens van de wallet worden gewist. Je kunt de wallet opnieuw importeren met de herstelgegevens.',
  'remove.message':
    '“{name}” wordt van dit apparaat verwijderd.\n\nBewaar de herstelgegevens als je de wallet opnieuw moet importeren.',
  'remove.failed': 'Kan wallet niet verwijderen',
  'remove.confirm': 'Verwijderen',
  'addresses.copyPrivateKey': 'Privésleutel kopiëren',
  'addresses.receive': 'Ontvangst',
  'addresses.change': 'Wisselgeld',
  'recovery.notProtected': 'Niet beschermd',
  'activity.unknownBroadcast': 'Status van uitzending onbekend',
  'activity.checkPayment': 'Betaling controleren',
  'activity.checkPaymentMessage':
    'Vernieuw eerst, of verzend exact dezelfde ondertekende transactie opnieuw.',
  'activity.refresh': 'Vernieuwen',
  'activity.connection': 'Verbinding',
  'activity.resubmit': 'Opnieuw verzenden',
  'activity.submitted': 'Transactie verzonden',
  'activity.broadcast': 'Uitzenden',
  'activity.empty': 'Je activiteit verschijnt hier',
  'activity.syncing': 'Transacties worden gesynchroniseerd…',
  'activity.cancelledTitle': 'Betaling geannuleerd',
  'activity.cancelledMessage':
    'Er is een vervangende transactie naar het netwerk verzonden die de Bitcoin terugstuurt naar deze wallet. Deze verschijnt in Activiteit zodra die zichtbaar is.',
  'time.seconds': 'een paar seconden',
  'time.minute': 'een minuut',
  'time.minutes': { one: '{count} minuut', other: '{count} minuten' },
  'time.hour': 'een uur',
  'time.hours': { one: '{count} uur', other: '{count} uur' },
  'time.day': 'een dag',
  'time.days': { one: '{count} dag', other: '{count} dagen' },
  'time.month': 'een maand',
  'time.months': { one: '{count} maand', other: '{count} maanden' },
  'time.year': 'een jaar',
  'time.years': { one: '{count} jaar', other: '{count} jaar' },
  'time.ago': '{time} geleden',
  'time.in': 'over {time}',
  'activity.pending': 'In behandeling',
  'activity.dateUnavailable': 'Datum niet beschikbaar',
  'activity.today': 'Vandaag',
  'activity.yesterday': 'Gisteren',
  'activity.received': 'Ontvangen',
  'activity.selfTransfer': 'Interne overboeking',
  'activity.sent': 'Verzonden',
  'activity.rowHintConverted':
    'Bedrag omgerekend tegen de huidige Bitcoin-prijs. Opent transactiedetails.',
  'activity.rowHint': 'Opent transactiedetails.',
  'activity.timeUnavailable': 'Tijd niet beschikbaar',
  'activity.selfFee': 'Kosten · {amount}',
  'pending.title': 'Transactie in behandeling',
  'pending.lowFee':
    'Deze transactie wordt door de lage kosten mogelijk niet snel voltooid',
  'pending.message':
    'Deze betaling is nog niet bevestigd. Tot die tijd kun je de betaling versnellen of annuleren.',
  'pending.speedUp': 'Versnellen',
  'pending.cancel': 'Annuleren',
  'note.title': 'Persoonlijke notitie',
  'error.somethingWrong': 'Er is iets misgegaan',
  'transaction.walletLabel': 'Wallet van transactie: {name}',
  'transaction.receiving': 'Wordt ontvangen',
  'transaction.sending': 'Wordt verzonden',
  'transaction.unavailable': 'Niet beschikbaar',
  'transaction.selfNote': 'Overgeboekt binnen je wallet',
  'transaction.from': 'Van',
  'transaction.status': 'Status',
  'transaction.complete': 'Voltooid',
  'transaction.date': 'Datum',
  'transaction.receivedFrom': 'Ontvangen van',
  'transaction.receivingFrom': 'Wordt ontvangen van',
  'transaction.sentTo': 'Verzonden naar',
  'transaction.sendingTo': 'Wordt verzonden naar',
  'transaction.sentFrom': 'Verzonden van',
  'transaction.sendingFrom': 'Wordt verzonden van',
  'transaction.id': 'Transactie-ID',
  'transaction.depositedTo': 'Gestort op',
  'transaction.depositingTo': 'Wordt gestort op',
  'transaction.fee': 'Kosten',
  'transaction.now': 'Nu',
  'addresses.used': 'Gebruikt',
  'addresses.menuCopy': 'Adres kopiëren',
  'addresses.menuCopyWif': 'Privésleutel kopiëren (WIF)',
  'addresses.rowLabel': 'Adres {index}, {address}',
  'addresses.rowHint': 'Opent de adresopties.',
  'addresses.transactions': 'Transacties: {count}',
  'transaction.title': 'Transactie',
  'transaction.explorerHint':
    'Opent de blockexplorer. Houd ingedrukt om te kopiëren.',
  'transaction.holdToCopy': 'Houd ingedrukt om te kopiëren.',
  'note.editHint': 'Bewerkt de persoonlijke notitie.',
  'note.add': 'Notitie toevoegen',
  'transaction.feeLabel': 'Kosten {amount}',
  'transaction.feeHint':
    'Wisselt de valuta van de kosten. Houd ingedrukt om te kopiëren.',
  'transaction.copied': 'Gekopieerd!',
  'transaction.addressCount': {
    one: '{count} adres',
    other: '{count} adressen',
  },
  'transaction.recipientHint':
    'Tik om het volledige adres te tonen. Houd ingedrukt om te kopiëren.',
  'replace.cancel.title': 'Betaling annuleren?',
  'replace.cancel.body':
    'De betaling wordt vervangen door een betaling die de Bitcoin terugstuurt naar deze wallet, min de netwerkkosten. Als de oorspronkelijke betaling eerst wordt bevestigd, wordt er niets geannuleerd.',
  'replace.cancel.action': 'Betaling annuleren',
  'replace.cancel.failed': 'Annuleren van de betaling is mislukt.',
  'replace.unavailable': 'Kan deze betaling niet vervangen',
  'replace.newFee': 'Nieuwe netwerkkosten',
  'replace.additionalFee': 'Extra kosten',
  'replace.returns': 'Terug naar je wallet',
  'replace.submitting': 'Verzenden…',
  'settings.row.touchId': 'Vergrendeling met Touch ID',
  'settings.row.biometricLock': 'Vergrendeling met biometrie',
  'settings.faceIdNeedsPasscode': 'Stel eerst een toegangscode in.',
  'settings.faceIdAllowTitle': 'Face ID toestaan',
  'settings.faceIdAllowMessage':
    'Ga naar Instellingen > Bithold > Face ID om Bithold toegang tot Face ID te geven.',
  'settings.passcodeRemoveTitle': 'Toegangscode verwijderen?',
  'settings.passcodeRemoveMessage':
    'Als je de toegangscode uitschakelt, is je wallet niet meer beveiligd en kan je tegoed in gevaar komen.',
  'settings.passcodeRemoveConfirm': 'Toegangscode verwijderen',
  'passcode.enableTitle': 'Vergrendeling met toegangscode inschakelen',
  'passcode.enableBody1':
    'Bithold vraagt om je toegangscode wanneer de app wordt geopend of weer op de voorgrond komt, en voordat je Geheime Sleutel of een privésleutel wordt getoond.',
  'passcode.enableBody2':
    'Als je de toegangscode vergeet, kun je alleen weer toegang krijgen door de wallets op dit apparaat te wissen en ze opnieuw te importeren met je Geheime Sleutel.',
  'passcode.enterNew':
    'Voer de toegangscode in waarmee je Bithold wilt ontgrendelen.',
  'passcode.enterCurrent': 'Voer je toegangscode in.',
  'passcode.field': 'Toegangscode',
  'passcode.confirmField': 'Herhaal toegangscode',
  'passcode.mismatch':
    'De toegangscodes komen niet overeen. Probeer het opnieuw.',
  'lock.enterPasscode': 'Voer toegangscode in',
  'lock.unlock': 'Ontgrendelen',
  'lock.wrongPasscode': 'Onjuiste toegangscode ingevoerd.',
  'lock.lockedOut': 'Wacht even vanwege mislukte pogingen.',
  'lock.retryIn': 'Probeer het over {time} opnieuw. Houd dit scherm open.',
  'lock.useFaceId': 'Face ID gebruiken',
  'lock.useTouchId': 'Touch ID gebruiken',
  'lock.forgot': 'Toegangscode vergeten?',
  'lock.forgotTitle': 'Toegangscode vergeten?',
  'lock.forgotMessage':
    'De enige manier om weer toegang te krijgen is de wallets op dit apparaat te wissen en ze opnieuw te importeren met je Geheime Sleutel.',
  'lock.eraseAndRestore': 'Wissen en herstellen',
  'lock.passcodeRequired': 'Toegangscode vereist',
  'lock.enrolmentChanged':
    'De Face ID-instellingen van je apparaat zijn gewijzigd sinds je Bithold voor het laatst hebt geopend. Voer je toegangscode in om door te gaan. Je kunt de vergrendeling met Face ID weer inschakelen in de instellingen van Bithold.',
  'lock.faceIdReason': 'Ontgrendel Bithold',
  'lock.invalidPasscode': 'Voer een toegangscode van 6 cijfers in.',
  'lock.noPasscode': 'Er is geen toegangscode ingesteld.',
  'walletName.title': 'Je voorkeursnaam',
  'walletName.introduction': 'Laten we kennismaken.',
  'walletName.reassurance': 'Je kunt dit altijd wijzigen.',
  'walletName.placeholder': 'Je voorkeursnaam…',
  'walletName.pickEmoji': 'Emoji kiezen',
  'walletName.changeEmoji': 'Emoji wijzigen',
  'walletName.resetAvatar': 'Een avatar op basis van de naam gebruiken',
  'walletName.yourAvatar': 'Je avatar',
  'walletName.changeAvatar': 'Avatar wijzigen',
  'walletName.pickPhoto': 'Foto kiezen',
  'walletName.takePhoto': 'Foto maken',
  'walletName.removePhoto': 'Foto verwijderen',
  'walletName.cameraDenied':
    'Sta cameratoegang toe in Instellingen om een walletfoto te maken.',
  'walletName.cameraUnavailable':
    'De camera is niet beschikbaar op dit apparaat.',
  'walletName.photoFailed':
    'De foto kon niet worden geladen. Probeer het opnieuw.',
};
