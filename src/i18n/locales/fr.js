// French, translated from en.js. Same keys; plural values use this
// language's CLDR categories.
export default {
  'import.recoveryTitle': 'Phrase de récupération',
  'import.tapToEnter':
    'Touchez pour saisir ou coller votre phrase de récupération…',
  'import.validPhrase': 'Phrase de récupération valide',
  'import.invalidChecksum':
    'Phrase de récupération invalide — somme de contrôle incorrecte',
  'walletSettings.type': 'Type',
  'walletSettings.transactionCount': 'Transactions',
  'walletSettings.notSynced': 'Non synchronisé',
  'walletSettings.watchOnly': 'Portefeuille en lecture seule',
  'walletSettings.publicKey': 'Afficher la XPUB du portefeuille',
  'walletSettings.publicKeyTitle': 'XPUB du portefeuille',
  'walletSettings.copyPublicKey': 'Copier la clé publique',
  'messageSigning.help':
    'Créez ou vérifiez un message signé avec une adresse Bitcoin.',
  'messageSigning.address': 'Adresse Bitcoin',
  'messageSigning.message': 'Message',
  'messageSigning.signature': 'Signature',
  'messageSigning.sign': 'Signer',
  'messageSigning.verify': 'Vérifier',
  'messageSigning.valid':
    'Signature vérifiée. Le message correspond à cette adresse.',
  'messageSigning.invalid':
    'Échec de la vérification. Vérifiez l’adresse, le message et la signature.',
  'messageSigning.signed':
    'Message signé. Vous pouvez copier ou partager la signature.',
  'messageSigning.invalidAddress':
    'Saisissez une adresse Bitcoin valide pour ce réseau.',
  'messageSigning.invalidMessage':
    'Saisissez un message de 10 000 caractères maximum.',
  'messageSigning.unsupported':
    'La signature de messages prend en charge les adresses Legacy, SegWit imbriqué et SegWit natif à clé unique. Taproot et les scripts multisignatures ne sont pas pris en charge.',
  'messageSigning.watchOnly':
    'Ce portefeuille est en lecture seule. Vous pouvez vérifier des signatures, mais pas signer de messages.',
  'messageSigning.notOwned':
    'Pour signer, utilisez l’adresse sélectionnée de ce portefeuille. Vous pouvez vérifier la signature d’une autre adresse.',
  'messageSigning.unavailable':
    'La clé privée de cette adresse n’est pas disponible.',
  'messageSigning.failed': 'Impossible de signer le message. Réessayez.',
  'messageSigning.shareFailed': 'Impossible d’ouvrir le partage. Réessayez.',
  'recovery.protected': 'Protégé',
  'cloud.protectedTitle': 'Vous êtes protégé',
  'cloud.protectedDescription':
    'Votre portefeuille est protégé par une clé d’accès.',
  'cloud.title': 'Sauvegarde de récupération iCloud',
  'cloud.consent':
    'Les données de récupération de ce portefeuille seront chiffrées avec une clé d’accès, puis enregistrées dans votre stockage iCloud privé. La restauration nécessite ce compte iCloud et la même clé d’accès. Conservez également la sauvegarde de votre Clé secrète. La sauvegarde iCloud comprend les clés de récupération et les réglages du portefeuille, mais pas les notes de transaction ni les paiements en attente.',
  'cloud.saved': 'Sauvegarde vérifiée',
  'cloud.savedDescription':
    'Votre sauvegarde chiffrée a été enregistrée, téléchargée et déchiffrée avec succès. Conservez la clé d’accès et la sauvegarde de votre Clé secrète. La restauration sur un autre appareil n’a pas encore été testée.',
  'cloud.subtitle':
    'Chiffrée avec une clé d’accès. Nécessite iCloud et iOS 18 ou version ultérieure.',
  'cloud.verifiedSubtitle':
    'Une sauvegarde de récupération a été vérifiée le {date}. Touchez pour enregistrer une nouvelle copie.',
  'cloud.empty':
    'Aucune sauvegarde de récupération n’a été trouvée sur ce compte iCloud.',
  'cloud.restoreTitle': 'Restaurer ce portefeuille ?',
  'cloud.restorePreview':
    'Portefeuille : {name}\nRéseau : {network}\n\nLe portefeuille récupéré sera ajouté. Les portefeuilles existants resteront inchangés.',
  'cloud.restoredDescription':
    'Les clés de récupération ont été restaurées. Les soldes et les transactions seront actualisés depuis le réseau.',
  'cloud.unsupported':
    'Les sauvegardes par clé d’accès nécessitent un iPhone ou un iPad sous iOS 18 ou version ultérieure, ainsi que l’app Bithold à jour.',
  'cloud.prfUnsupported':
    'Ce fournisseur de clés d’accès ne prend pas en charge le chiffrement des sauvegardes. Aucune sauvegarde vérifiée n’a été créée. Conservez la sauvegarde de votre Clé secrète.',
  'cloud.accountUnavailable':
    'Connectez-vous à iCloud dans les Réglages de votre appareil, puis réessayez.',
  'cloud.accountChanged':
    'Le compte iCloud a changé pendant cette opération. Réessayez avec le bon compte.',
  'cloud.quotaExceeded':
    'Votre stockage iCloud est plein. Libérez de l’espace et réessayez.',
  'cloud.network':
    'Impossible de joindre iCloud. Vérifiez votre connexion et réessayez.',
  'cloud.invalidPayload':
    'Impossible de vérifier que cette sauvegarde correspond à un portefeuille Bithold pris en charge. Rien n’a été importé.',
  'cloud.duplicate':
    'Ce portefeuille figure déjà dans l’app. Aucun doublon n’a été ajouté.',
  'cloud.interrupted':
    'L’opération a été interrompue. Déverrouillez l’app et réessayez.',
  'cloud.watchOnly':
    'Un portefeuille en lecture seule n’a pas de clés de récupération privées à sauvegarder.',
  'cloud.busy': 'Une opération de sauvegarde est déjà en cours.',
  'cloud.failed':
    'Impossible de mener à bien ou de vérifier l’opération. Vérifiez iCloud et la clé d’accès, puis réessayez. Conservez la sauvegarde de votre Clé secrète.',
  'cloudRestore.pickerHeader': 'Restaurer un portefeuille',
  'cloudRestore.pickerTitle': 'Restaurer une sauvegarde',
  'cloudRestore.pickerSubtitle': 'Sélectionnez la sauvegarde à restaurer',
  'cloudRestore.backupName': '#{index} Sauvegarde iCloud',
  'cloudRestore.active': 'Active',
  'cloudRestore.pastBackups': 'Sauvegardes précédentes',
  'cloudRestore.restoring': 'Restauration du portefeuille...',
  'cloudRestore.restoringSubtitle': 'Un instant',
  'cloudRestore.success': 'Restauration réussie !',
  'cloudRestore.activeTitle': 'Sauvegarde active',
  'cloudRestore.emptyTitle': 'Aucune sauvegarde trouvée',
  'cloudRestore.accessTitle': 'Autoriser l’accès à\niCloud',
  'cloudRestore.passkeysTitle': 'Activer les clés d’accès',
  'cloudRestore.errorTitle': 'Une erreur s’est produite',
  'cloudRestore.prfUnsupported':
    'Ce fournisseur de clés d’accès ne peut pas déverrouiller les sauvegardes iCloud. Utilisez des clés d’accès enregistrées dans le trousseau iCloud ou restaurez le portefeuille à l’aide de votre Clé secrète.',
  'common.back': 'Retour',
  'common.cancel': 'Annuler',
  'common.continue': 'Continuer',
  'common.done': 'Terminé',
  'common.edit': 'Modifier',
  'common.loading': 'Chargement',
  'settings.title': 'Réglages',
  'settings.row.currency': 'Devise',
  'settings.row.unit': 'Unité d’affichage',
  'settings.unit.fixedPrecision': 'Toujours afficher 8 décimales',
  'settings.row.language': 'Langue',
  'settings.row.blockExplorer': 'Explorateur de blocs',
  'settings.explorer.custom': 'Personnalisé',
  'settings.explorer.customSubtitle': 'Utilisez votre propre explorateur',
  'settings.explorer.urlPlaceholder': 'URL de l’explorateur',
  'settings.explorer.invalidUrl':
    'Saisissez une URL commençant par https:// ou http://.',
  'settings.notificationsDenied':
    'Autorisez les notifications pour Bithold dans les Réglages de l’iPhone.',
  'settings.notificationsOpenSettings': 'Ouvrir Réglages',
  'settings.notificationsFailed':
    'Impossible de modifier l’autorisation des notifications. Veuillez réessayer.',
  'settings.row.notifications': 'Notifications',
  'settings.row.sounds': 'Sons',
  'settings.row.haptic': 'Retour haptique',
  'settings.row.animation': 'Animation du solde',
  'settings.row.passcode': 'Verrouillage par code',
  'settings.row.faceId': 'Verrouillage Face ID',
  'settings.row.reset': 'Réinitialiser l’application',
  'settings.currencyFailed': 'Impossible de changer de devise',
  'settings.resetMessage':
    'Supprimer tous les portefeuilles et clés locaux de cet appareil ? Assurez-vous d’avoir sauvegardé leurs données de récupération.',
  'settings.resetTitle': 'Confirmer la réinitialisation ?',
  'settings.resetWarning': 'Cette action est irréversible.',
  'settings.resetConfirm': 'Réinitialiser l’application',
  'settings.setCurrency': 'Choisir la devise',
  'settings.searchCurrencies': 'Rechercher une devise',
  'settings.closeSearch': 'Fermer la recherche',
  'settings.noCurrencies': 'Aucune devise trouvée',
  'settings.noCurrenciesHint': 'Essayez un nom ou un code de devise.',
  'settings.selectLanguage': 'Choisir la langue',
  'restore.icloudTitle': 'Restaurer depuis votre sauvegarde iCloud',
  'restore.icloudSubtitle':
    'Restaurez votre compte à l’aide de vos clés d’accès iCloud.',
  'restore.secretKeyTitle': 'Clé secrète (option avancée)',
  'restore.secretKeySubtitle':
    'Restaurez votre compte à l’aide de votre Clé secrète de 12 mots.',
  'restore.qrTitle': 'Code QR',
  'restore.qrSubtitle': 'Synchronisez avec Bithold sur un autre appareil.',
  'electrum.chooseServer': 'Choisissez un serveur.',
  'currency.AED': 'Dirham des Émirats arabes unis',
  'currency.AMD': 'Dram arménien',
  'currency.ANG': 'Florin antillais',
  'currency.ARS': 'Peso argentin',
  'currency.AUD': 'Dollar australien',
  'currency.AWG': 'Florin arubais',
  'currency.BDT': 'Taka bangladeshi',
  'currency.BHD': 'Dinar bahreïni',
  'currency.BOB': 'Boliviano bolivien',
  'currency.BRL': 'Réal brésilien',
  'currency.CAD': 'Dollar canadien',
  'currency.CHF': 'Franc suisse',
  'currency.CLP': 'Peso chilien',
  'currency.CNY': 'Yuan renminbi chinois',
  'currency.COP': 'Peso colombien',
  'currency.CZK': 'Couronne tchèque',
  'currency.DKK': 'Couronne danoise',
  'currency.DOP': 'Peso dominicain',
  'currency.DZD': 'Dinar algérien',
  'currency.EGP': 'Livre égyptienne',
  'currency.ETB': 'Birr éthiopien',
  'currency.EUR': 'Euro',
  'currency.GBP': 'Livre sterling',
  'currency.GHS': 'Cédi ghanéen',
  'currency.GTQ': 'Quetzal guatémaltèque',
  'currency.HKD': 'Dollar de Hong Kong',
  'currency.HUF': 'Forint hongrois',
  'currency.IDR': 'Roupie indonésienne',
  'currency.ILS': 'Nouveau shekel israélien',
  'currency.INR': 'Roupie indienne',
  'currency.IRR': 'Rial iranien',
  'currency.IRT': 'Toman iranien',
  'currency.ISK': 'Couronne islandaise',
  'currency.JPY': 'Yen japonais',
  'currency.KES': 'Shilling kényan',
  'currency.KRW': 'Won sud-coréen',
  'currency.KWD': 'Dinar koweïtien',
  'currency.KZT': 'Tenge kazakh',
  'currency.LBP': 'Livre libanaise',
  'currency.LKR': 'Roupie srilankaise',
  'currency.MAD': 'Dirham marocain',
  'currency.MXN': 'Peso mexicain',
  'currency.MYR': 'Ringgit malais',
  'currency.MZN': 'Metical mozambicain',
  'currency.NGN': 'Naira nigérian',
  'currency.NOK': 'Couronne norvégienne',
  'currency.NZD': 'Dollar néo-zélandais',
  'currency.OMR': 'Riyal omanais',
  'currency.PEN': 'Sol péruvien',
  'currency.PHP': 'Peso philippin',
  'currency.PKR': 'Roupie pakistanaise',
  'currency.PLN': 'Zloty polonais',
  'currency.PYG': 'Guaraní paraguayen',
  'currency.QAR': 'Riyal qatari',
  'currency.RON': 'Leu roumain',
  'currency.RSD': 'Dinar serbe',
  'currency.RUB': 'Rouble russe',
  'currency.SAR': 'Riyal saoudien',
  'currency.SEK': 'Couronne suédoise',
  'currency.SGD': 'Dollar de Singapour',
  'currency.THB': 'Baht thaïlandais',
  'currency.TRY': 'Livre turque',
  'currency.TWD': 'Nouveau dollar taïwanais',
  'currency.TZS': 'Shilling tanzanien',
  'currency.UAH': 'Hryvnia ukrainienne',
  'currency.UGX': 'Shilling ougandais',
  'currency.USD': 'Dollar des États-Unis',
  'currency.UYU': 'Peso uruguayen',
  'currency.UZS': 'Sum ouzbek',
  'currency.VES': 'Bolivar vénézuélien',
  'currency.VND': 'Dông vietnamien',
  'currency.XAF': 'Franc CFA (BEAC)',
  'currency.XOF': 'Franc CFA (BCEAO)',
  'currency.ZAR': 'Rand sud-africain',
  'common.copyAddress': 'Copier l’adresse',
  'bubble.dismissAddress': 'Masquer l’adresse',
  'brand.logo': 'Logo Bithold',
  'sheet.dismiss': 'Fermer le panneau',
  'sheet.background': 'Arrière-plan du panneau',
  'wallet.alertTitle': 'Portefeuille',
  'error.operationFailed': 'L’opération n’a pas pu aboutir.',
  'common.next': 'Suivant',
  'common.ok': 'OK',
  'import.title': 'Saisissez votre phrase de récupération, clé ou descripteur',
  'common.confirm': 'Confirmer',
  'import.loading': 'Importation du portefeuille…',
  'import.failed': 'Impossible d’importer le portefeuille',
  'import.inputAlertTitle': 'Saisie impossible',
  'import.inputLimit': 'La saisie dépasse la limite de 16 384 caractères.',
  'import.fieldUnavailable': 'Le champ d’importation n’est plus disponible.',
  'import.fieldInactive': 'Le champ d’importation n’est plus actif.',
  'import.composing': 'Terminez la saisie du mot en cours avant d’importer.',
  'import.description':
    'Si vous utilisez une phrase de récupération pour importer le portefeuille, séparez chaque mot par un espace.',
  'import.inputLabel': 'Phrase de récupération, clé ou descripteur',
  'import.inputHint':
    'Saisissez votre phrase de récupération, votre clé privée ou votre descripteur.',
  'import.pasteEmpty':
    'Copiez votre phrase de récupération ou votre clé privée, puis touchez Coller.',
  'import.clear': 'Effacer',
  'import.scan': 'Scanner',
  'import.paste': 'Coller',
  'import.passphrase': 'Phrase de passe',
  'import.passphrasePrompt':
    'Saisissez votre phrase de passe si vous en avez utilisé une',
  'import.options': 'Options d’importation',
  'onboarding.welcome.setupOptions':
    'Configurez Bithold avec une des options suivantes.',
  'onboarding.welcome.selfCustody':
    'L’auto-conservation,\nc’est toujours garder\nle contrôle de vos fonds',
  'onboarding.welcome.recoveryPhrase': 'Créer une phrase de récupération',
  'onboarding.welcome.recoveryDescription':
    'Un nouveau portefeuille Bitcoin avec 12 mots pour le restaurer',
  'onboarding.welcome.importDescription':
    'Phrase de récupération, clé privée ou sauvegarde\u00A0iCloud',
  'onboarding.welcome.email': 'Continuer par e-mail',
  'onboarding.welcome.emailDescription':
    'Se connecter ou créer un compte Wallet',
  'onboarding.welcome.import': 'Importer',
  'onboarding.welcome.apple': 'Se connecter avec Apple',
  'onboarding.welcome.google': 'Se connecter avec Google',
  'onboarding.welcome.termsIntro': 'En utilisant Bithold, vous acceptez nos',
  'onboarding.welcome.termsOfService': 'Conditions d’utilisation',
  'onboarding.welcome.termsAnd': 'et notre',
  'onboarding.welcome.privacyPolicy': 'Politique de confidentialité',
  'onboarding.or': 'OU',
  'onboarding.welcomeTitle':
    "Bienvenue dans votre nouveau portefeuille d'actifs numériques!",
  'onboarding.getStarted': 'Démarrer',
  'onboarding.restoreWallet': 'Restaurer le portefeuille',
  'onboarding.title':
    'Sécurisez, gérez et\ngardez votre Bitcoin\nen un seul endroit',
  'onboarding.create': 'Créer un portefeuille',
  'onboarding.creating': 'Création du portefeuille…',
  'onboarding.createFailed': 'Impossible de créer le portefeuille',
  'onboarding.import': 'Importer un portefeuille',
  'onboarding.terms':
    'En continuant, vous acceptez les {terms} et la {privacy}',
  'onboarding.termsOfService': 'Conditions d’utilisation',
  'onboarding.privacyPolicy': 'Politique de confidentialité',
  'onboarding.noCloudBackup':
    'Bithold ne sauvegarde pas encore les portefeuilles dans le cloud : il n’y a donc aucune sauvegarde cloud à importer.',
  'importWith.title': 'Importer avec',
  'importWith.phraseTitle': 'Phrase de récupération ou clé privée',
  'importWith.phraseDescription':
    'Utilisez une phrase de récupération de 12, 18 ou 24 mots, ou une clé privée',
  'importWith.cloudTitle': 'Sauvegarde cloud',
  'importWith.cloudDescription':
    'Importez rapidement votre portefeuille depuis votre sauvegarde cloud',
  'common.save': 'Enregistrer',
  'import.passphraseEnabled': 'Phrase de passe activée',
  'import.usePassphrase': 'Utiliser une phrase de passe',
  'import.addressType': 'Type d’adresse : {type}',
  'import.addressTypesAutomatic': 'Types d’adresse : automatique',
  'import.defaultDerivationPath': 'Chemin de dérivation par défaut',
  'import.bip39Passphrase': 'Phrase de passe BIP39',
  'import.bip39PassphraseMessage':
    'Utilisez exactement la phrase de passe associée à ce portefeuille. Par défaut, la phrase de passe est vide.',
  'import.addressTypeTitle': 'Type d’adresse',
  'import.derivationPath': 'Chemin de dérivation',
  'import.pasteFailed': 'Impossible de coller',
  'import.pasteAccess': 'Autorisez le collage quand iOS vous le demande.',
  'import.nothingToPaste': 'Rien à coller',
  'import.editWord': 'Modifier le mot',
  'scanner.title': 'Scanner pour envoyer',
  'scanner.denied':
    'Autorisez l’accès à l’appareil photo dans Réglages pour scanner des codes QR.',
  'scanner.unavailable':
    'Appareil photo indisponible. Saisissez ou collez plutôt l’adresse.',
  'scanner.openSettings': 'Ouvrir Réglages',
  'scanner.invalid': 'Ce code QR ne contient pas d’adresse Bitcoin valide.',
  'balance.resetFailed': 'Impossible de réinitialiser',
  'balance.refreshFailed': 'Impossible d’actualiser',
  'activity.title': 'Activité',
  'balance.hiddenLabel': 'Solde masqué. Maintenez le doigt pour l’afficher.',
  'balance.shownLabel':
    'Solde du portefeuille. Maintenez le doigt pour le masquer.',
  'balance.walletSelector': 'Sélecteur de portefeuille',
  'wallet.defaultName': 'Portefeuille {number}',
  'balance.receive': 'Recevoir',
  'balance.send': 'Envoyer',
  'chart.noData': 'Aucune donnée disponible, réessayez',
  'chart.bitcoinPrice': 'Prix du Bitcoin',
  'chart.today': '{change} aujourd’hui',
  'balance.pullToRefresh': 'Tirer pour actualiser',
  'balance.releaseToRefresh': 'Relâcher pour actualiser',
  'balance.updating': 'Actualisation…',
  'common.copied': 'Copié',
  'common.copiedBubble': 'Copié.',
  'error.tryAgain': 'Veuillez réessayer.',
  'addressType.descriptor': 'Script personnalisé',
  'receive.addressLabel': 'Votre adresse BTC',
  'receive.addressLabelTaproot': 'Votre adresse BTC Taproot',
  'receive.addressLabelLegacy': 'Votre adresse BTC Legacy',
  'receive.title': 'Recevoir du Bitcoin',
  'receive.pathTitle': 'Chemin de réception',
  'receive.qrCopy': 'Copier',
  'receive.qrShare': 'Partager…',
  'receive.addressFailed': 'Impossible d’obtenir une adresse',
  'receive.newAddress': 'Nouvelle adresse',
  'receive.newAddressHint':
    'Affiche une nouvelle adresse de réception sur ce chemin',
  'receive.copyFailed': 'Impossible de copier',
  'receive.shareFailed': 'Impossible de partager',
  'receive.typeLabel': 'Type d’adresse de réception',
  'receive.typeHint': 'Ouvre les types d’adresse de réception disponibles',
  'receive.qrLabel':
    'Code QR Bithold. Maintenez le doigt dessus pour copier ou partager.',
  'receive.choosePath': 'Choisir le chemin de réception',
  'receive.choosePathAddress': 'Choisir le chemin de réception. {address}',
  'receive.choosePathHint':
    'Ouvre les chemins de réception disponibles pour ce portefeuille',
  'receive.pathFailed': 'Impossible de sélectionner le chemin de réception',
  'receive.path.wif': 'Clé privée unique',
  'receive.path.address': 'Adresse importée',
  'receive.path.descriptor': 'Descripteur importé',
  'auth.notCompleted': 'L’authentification n’a pas abouti',
  'native.storageRead':
    'Impossible de lire les données locales du portefeuille. Déverrouillez l’appareil et réessayez.',
  'native.storageSave':
    'Impossible d’enregistrer les données locales du portefeuille',
  'native.storageRemove':
    'Impossible de supprimer les données locales du portefeuille',
  'native.entropySize': 'Taille d’entropie non valide',
  'native.randomness': 'Source d’aléa sécurisée indisponible',
  'native.invalidServer': 'Serveur non valide',
  'native.tlsFailed': 'Échec de la connexion TLS',
  'native.tcpFailed': 'Échec de la connexion TCP',
  'native.connectTimeout': 'Délai de connexion dépassé',
  'native.certificateChanged': 'Certificat modifié',
  'native.certificateUntrusted': 'Certificat non approuvé',
  'native.overlappingRequest': 'Requête serveur non valide ou concurrente',
  'native.timeout': 'Délai de la requête serveur dépassé',
  'native.sendFailed': 'Impossible d’envoyer la requête au serveur',
  'native.responseTooLarge': 'Réponse du serveur trop volumineuse',
  'native.invalidResponse': 'Réponse du serveur non valide',
  'native.unexpectedResponse': 'Réponse inattendue du serveur',
  'native.disconnected': 'Serveur déconnecté',
  'native.connectionClosed': 'Connexion fermée',
  'native.unavailable':
    'Cette version n’inclut pas le moteur de portefeuille natif',
  'send.amountTitle': 'Définir le montant',
  'send.priceUnavailable': 'Prix indisponible',
  'send.priceUnavailableMessage':
    'Saisissez le montant en Bitcoin tant que le taux de change est indisponible.',
  'send.dustWarning':
    'Le réseau Bitcoin ne permet pas d’envoyer {amount} ou moins',
  'send.insufficientWarning':
    'Déposez davantage de fonds ou saisissez un montant inférieur.',
  'send.amountInCurrency': 'Montant en {currency}',
  'send.amountInBitcoin': 'Montant en Bitcoin',
  'send.switchCurrency': 'Basculer entre Bitcoin et {currency}',
  'send.useAvailable': 'Utiliser le solde disponible',
  'send.available': 'Disponible',
  'send.networkFee': 'Frais de réseau',
  'error.keys.invalidAddressIndex': 'Index d’adresse non valide',
  'error.keys.addressBranchUnavailable': 'Branche d’adresses indisponible',
  'error.keys.descriptorMustProduceAddressableOutput':
    'Le descripteur doit produire une sortie dotée d’une adresse',
  'error.keys.witnessScriptsRequireCompressedPublic':
    'Les scripts witness nécessitent des clés publiques compressées',
  'error.keys.walletCannotSign': 'Ce portefeuille ne peut pas signer',
  'error.descriptor.invalidDescriptorCharacter':
    'Caractère de descripteur non valide',
  'error.descriptor.invalidDescriptor': 'Descripteur non valide',
  'error.descriptor.invalidDescriptorDerivation':
    'Dérivation de descripteur non valide',
  'error.descriptor.publicKeysCannotHaveDerivation':
    'Les clés publiques ne peuvent pas avoir de chemin de dérivation',
  'error.descriptor.privateKeysCannotHaveDerivation':
    'Les clés privées ne peuvent pas avoir de chemin de dérivation',
  'error.descriptor.hardenedStepsMustPrecedeBranches':
    'Les niveaux renforcés doivent précéder les branches',
  'error.descriptor.publicKeyCannotDeriveHardened':
    'Une clé publique ne peut pas dériver de clés enfants renforcées',
  'error.descriptor.invalidDescriptorChecksum':
    'Somme de contrôle du descripteur non valide',
  'error.descriptor.descriptorNestingTooDeep':
    'Imbrication du descripteur trop profonde',
  'error.descriptor.unsupportedDescriptorNesting':
    'Imbrication de descripteur non prise en charge',
  'error.descriptor.invalidMultisigThreshold': 'Seuil multisig non valide',
  'error.descriptor.unsupportedDescriptorExpression':
    'Expression de descripteur non prise en charge',
  'error.descriptor.duplicateMultisigKeys': 'Clés multisig en double',
  'error.descriptor.descriptorRequiresCompressedXOnly':
    'Ce descripteur nécessite une clé publique compressée ou x-only',
  'error.keys.unsupportedBitcoinNetwork': 'Réseau Bitcoin non pris en charge',
  'error.keys.invalidDerivationPath': 'Chemin de dérivation non valide',
  'error.keys.derivationIndexTooLarge': 'L’index de dérivation est trop grand',
  'error.keys.invalidExtendedKey': 'Clé étendue non valide',
  'error.keys.keyBelongsDifferentBitcoinNetwork':
    'La clé appartient à un autre réseau Bitcoin',
  'error.keys.invalidPrivateKeyNetwork': 'Clé privée ou réseau non valide',
  'error.keys.unsupportedAddressType': 'Type d’adresse non pris en charge',
  'error.keys.enterRecoveryPhraseKeyDescriptor':
    'Saisissez une phrase de récupération, une clé ou un descripteur',
  'error.keys.invalidRecoveryPhraseCheckEvery':
    'Phrase de récupération non valide : vérifiez chaque mot, le nombre de mots et la somme de contrôle',
  'error.payment.missingSpendingOutput': 'Sortie à dépenser manquante',
  'error.payment.spendingOutputChanged': 'La sortie à dépenser a changé',
  'error.payment.unsupportedTaprootSpendPath':
    'Chemin de dépense Taproot non pris en charge',
  'error.payment.unsupportedInputScriptFeeEstimation':
    'Script d’entrée non pris en charge pour l’estimation des frais',
  'error.payment.useMostThreeDecimalPlaces':
    'Utilisez au maximum trois décimales pour le taux de frais',
  'error.payment.watchOnlyWalletCannotSign':
    'Ce portefeuille en lecture seule ne peut pas signer de paiements',
  'error.payment.refreshWalletBeforeSending':
    'Actualisez le portefeuille avant d’envoyer',
  'error.payment.chooseFeeRate11000':
    'Choisissez un taux de frais de 1 à 1000 sat/vB',
  'error.payment.invalidRbfPreference': 'Préférence RBF non valide',
  'error.payment.enterLeast546Satoshis': 'Saisissez au moins 546 satoshis',
  'error.payment.insufficientBalanceAmountNetworkFee':
    'Solde insuffisant pour ce montant et les frais de réseau',
  'error.payment.amountBelowBitcoinDustLimit':
    'Après déduction des frais, le montant est inférieur au seuil de poussière de Bitcoin',
  'error.payment.noSpendableBitcoinAvailable':
    'Aucun Bitcoin dépensable n’est disponible',
  'error.payment.duplicateSpendingOutput': 'Sortie à dépenser en double',
  'error.payment.walletSnapshotChangedRefreshFee':
    'L’instantané du portefeuille a changé. Actualisez l’aperçu des frais.',
  'error.payment.paymentAccountingMismatch':
    'Incohérence comptable du paiement',
  'error.payment.secureSigningRandomnessUnavailable':
    'Source d’aléa sécurisée pour la signature indisponible',
  'error.payment.transactionRbfSettingDoesNot':
    'Le réglage RBF de la transaction ne correspond pas au récapitulatif approuvé',
  'error.payment.recoveryMaterialCannotSignInput':
    'Les données de récupération ne permettent pas de signer cette entrée',
  'error.payment.signedPaymentDoesNotMatch':
    'Le paiement signé ne correspond pas au récapitulatif approuvé',
  'error.payment.signedTransactionExceedsReviewedFee':
    'La transaction signée dépasse l’estimation des frais du récapitulatif. Préparez-la à nouveau.',
  'error.payment.broadcastResultUncertainSignedPayment':
    'Le résultat de la diffusion est incertain. Le paiement signé a été conservé ; actualisez pour vérifier son statut.',
  'error.replacement.unknownReplacement': 'Remplacement inconnu',
  'error.replacement.refreshWalletBeforeReplacingPayment':
    'Actualisez le portefeuille avant de remplacer un paiement',
  'error.replacement.paymentTooSmallCancelFee':
    'Ce paiement est trop faible pour être annulé avec ces frais : il ne resterait rien après les frais de réseau.',
  'error.replacement.notEnoughConfirmedBitcoinRaise':
    'Solde confirmé insuffisant pour augmenter les frais de ce paiement. Vous pouvez l’annuler à la place.',
  'error.replacement.replacementAccountingMismatch':
    'Incohérence comptable du remplacement',
  'error.replacement.replacementFeeNotHigherThan':
    'Les frais de remplacement ne sont pas supérieurs à ceux d’origine',
  'error.chart.invalidHistoricalPrice': 'Prix historique non valide',
  'error.chart.historicalPricesAreStale': 'Les prix historiques sont obsolètes',
  'error.chart.notEnoughHistoricalPrices': 'Prix historiques insuffisants',
  'error.chart.unsupportedChartRange':
    'Période du graphique non prise en charge',
  'error.chart.incorrectHistoryCurrency': 'Devise de l’historique incorrecte',
  'error.chart.invalidHistoricalResponse': 'Réponse d’historique non valide',
  'error.chart.invalidHistoryDate': 'Date d’historique non valide',
  'error.chart.unknownHistorySource': 'Source d’historique inconnue',
  'error.chart.unsupportedHistoryCurrency':
    'Devise d’historique non prise en charge',
  'error.electrum.incompleteElectrumResponse': 'Réponse Electrum incomplète',
  'error.electrum.duplicateElectrumResponse': 'Réponse Electrum en double',
  'error.electrum.walletConnectionClosed': 'Connexion du portefeuille fermée',
  'error.electrum.serverFailedBitcoinMainnetVerification':
    'Le serveur n’a pas réussi la vérification Bitcoin Mainnet',
  'error.electrum.connectionSuperseded': 'Connexion remplacée',
  'error.electrum.unableConnectBitcoinServersCheck':
    'Impossible de se connecter aux serveurs Bitcoin. Vérifiez votre connexion et actualisez.',
  'error.electrum.invalidChainTip': 'Sommet de chaîne non valide',
  'error.electrum.invalidSubscriptionStatus': 'Statut d’abonnement non valide',
  'error.electrum.addressHistoryChangedDuringSynchronization':
    'L’historique de l’adresse a changé pendant la synchronisation ; actualisez à nouveau',
  'error.electrum.invalidBlockHeader': 'En-tête de bloc non valide',
  'error.fees.invalidFeeRecommendations':
    'Recommandations de frais non valides',
  'error.fees.inconsistentFeeRecommendations':
    'Recommandations de frais incohérentes',
  'error.rates.incorrectRateBaseCurrency': 'Devise de base du taux incorrecte',
  'error.rates.invalidStaleRateTimestamp':
    'Horodatage du taux non valide ou obsolète',
  'error.rates.unknownRateProvider': 'Fournisseur de taux inconnu',
  'error.rates.invalidRateResponse': 'Réponse de taux non valide',
  'error.rates.noSupportedPricesResponse':
    'Aucun prix pris en charge dans la réponse',
  'error.rates.providerCoolingDownFailure':
    'Le fournisseur est en pause après un échec',
  'error.rates.unsupportedCurrency': 'Devise non prise en charge',
  'error.rates.krakenReturnedError': 'Kraken a renvoyé une erreur',
  'error.rates.incorrectPriceCurrency': 'Devise du prix incorrecte',
  'error.rates.invalidConversionResponse': 'Réponse de conversion non valide',
  'error.rates.invalidBitcoinPrice': 'Prix du Bitcoin non valide',
  'error.accounts.walletStorageNotReady':
    'Le stockage du portefeuille n’est pas prêt',
  'error.accounts.invalidRecoveryMaterialImportOptions':
    'Données de récupération ou options d’importation non valides. Vérifiez la somme de contrôle, le réseau et le chemin de dérivation.',
  'error.accounts.walletAlreadyImported': 'Ce portefeuille est déjà importé',
  'error.accounts.importWasInterruptedPleaseTry':
    'L’importation a été interrompue. Veuillez réessayer.',
  'error.accounts.enterWalletName180':
    'Saisissez un nom de portefeuille de 1 à 80 caractères',
  'error.accounts.addressTypeUnavailable': 'Type d’adresse indisponible',
  'error.accounts.walletNoLongerExists': 'Le portefeuille n’existe plus',
  'error.accounts.walletHasUnresolvedBroadcastCheck':
    'Ce portefeuille a une diffusion non résolue. Vérifiez-la avant de supprimer le portefeuille.',
  'error.accounts.invalidTransaction': 'Transaction non valide',
  'error.accounts.invalidNote': 'Note non valide',
  'error.payment.walletNotSynchronized':
    'Le portefeuille n’est pas synchronisé',
  'error.payment.previousBroadcastUnresolvedRefreshRetry':
    'Une diffusion précédente n’est pas résolue. Actualisez ou relancez ce même paiement depuis Activité.',
  'error.payment.paymentAlreadyBeingSubmitted':
    'Un paiement est déjà en cours d’envoi',
  'error.payment.paymentReviewExpiredSelectedWallet':
    'Le récapitulatif du paiement a expiré ou le portefeuille sélectionné a changé. Vérifiez à nouveau le paiement.',
  'error.payment.paymentConfirmedChangedMeantimeNothing':
    'Ce paiement a été confirmé ou a changé entre-temps. Rien n’a été remplacé.',
  'error.payment.selectedCoinsChangedReviewPayment':
    'Les pièces sélectionnées ont changé. Vérifiez à nouveau le paiement.',
  'error.payment.signingKeyUnavailable': 'La clé de signature est indisponible',
  'error.payment.noUnresolvedPaymentAvailable':
    'Aucun paiement non résolu n’est disponible',
  'error.preferences.unknownPreference': 'Préférence inconnue',
  'error.preferences.backgroundPushNotificationsAreNot':
    'Les notifications push en arrière-plan ne sont pas configurées. La synchronisation du solde fonctionne lorsque l’app est ouverte.',
  'error.recovery.watchOnlyWalletHasNo':
    'Ce portefeuille en lecture seule n’a pas de données de récupération privées',
  'error.recovery.walletHasNoPrivateRecovery':
    'Ce portefeuille n’a pas de données de récupération privées',
  'error.recovery.recoveryMaterialUnavailable':
    'Les données de récupération sont indisponibles',
  'error.recovery.watchOnlyWalletHasNo2':
    'Ce portefeuille en lecture seule n’a pas de clés privées',
  'error.recovery.walletHasNoPrivateKeys':
    'Ce portefeuille n’a pas de clés privées',
  'error.recovery.addressControlledBySeveralKeys':
    'Cette adresse est contrôlée par plusieurs clés : elle n’a donc pas de clé privée unique.',
  'error.storage.walletMetadataDamaged':
    'Les métadonnées du portefeuille sont endommagées',
  'error.sync.invalidRawTransaction': 'Transaction brute non valide',
  'error.sync.transactionIdVerificationFailed':
    'Échec de la vérification de l’ID de transaction',
  'error.sync.invalidTransactionValues': 'Valeurs de transaction non valides',
  'error.sync.invalidAddressState': 'État d’adresse non valide',
  'error.sync.inconsistentTransactionHistory':
    'Historique des transactions incohérent',
  'error.sync.invalidUnspentOutput': 'Sortie non dépensée non valide',
  'error.sync.balanceDoesNotMatchUnspent':
    'Le solde ne correspond pas aux sorties non dépensées',
  'error.sync.walletScanCancelled': 'Analyse du portefeuille annulée',
  'error.sync.addressDiscoveryLimitReachedLarger':
    'Limite de découverte d’adresses atteinte ; une analyse plus large nécessite une configuration de récupération explicite',
  'error.sync.overlappingWalletDerivationBranches':
    'Branches de dérivation du portefeuille qui se chevauchent',
  'error.sync.historyChangedDuringSynchronization':
    'L’historique a changé pendant la synchronisation',
  'error.sync.missingInputTransaction': 'Transaction d’entrée manquante',
  'error.sync.invalidTransactionAccounting':
    'Comptabilité de la transaction non valide',
  'error.sync.serverHistoryDoesNotBelong':
    'L’historique du serveur n’appartient pas à cette adresse',
  'error.sync.serverOmittedAddedUnspentOutputs':
    'Le serveur a omis ou ajouté des sorties non dépensées',
  'error.sync.outputValueOwnershipMismatch':
    'Incohérence de valeur ou de propriété d’une sortie',
  'error.sync.chainChangedDuringSynchronizationRefresh':
    'La chaîne a changé pendant la synchronisation ; actualisez à nouveau',
  'error.sync.invalidWalletBalance': 'Solde du portefeuille non valide',
  'error.sync.connectionChangedDuringSynchronizationRefresh':
    'La connexion a changé pendant la synchronisation ; actualisez à nouveau',
  'error.payment.serviceUnavailable': 'Service indisponible ({status})',
  'error.chart.historyUnavailable':
    'Les prix historiques en {currency} sont temporairement indisponibles. Votre graphique enregistré a été conservé.',
  'error.electrum.rejected': 'Electrum a rejeté {method}',
  'error.rates.noProvider':
    'Aucun fournisseur de prix n’est actuellement disponible pour {currency}. Le dernier prix enregistré a été conservé.',
  'error.addresses.gapLimit': {
    one: 'Ce portefeuille a déjà {count} adresse inutilisée d’affilée. Recevez d’abord un paiement sur celle-ci, pour que les autres portefeuilles qui le restaurent puissent toujours retrouver vos fonds.',
    other:
      'Ce portefeuille a déjà {count} adresses inutilisées d’affilée. Recevez d’abord un paiement sur l’une d’elles, pour que les autres portefeuilles qui le restaurent puissent toujours retrouver vos fonds.',
  },
  'error.preferences.priceUnavailable':
    'Le prix en {currency} est temporairement indisponible. La devise sélectionnée n’a pas été modifiée.',
  'error.storage.openFailed':
    'Impossible d’ouvrir vos portefeuilles locaux. Déverrouillez votre téléphone et réessayez.',
  'recovery.passphraseLabel': 'Phrase de passe BIP39 :',
  'fee.custom': 'Frais personnalisés',
  'fee.estimateUnavailable': 'Estimation du délai de confirmation indisponible',
  'fee.network': 'Frais de réseau',
  'fee.enterValid': 'Saisissez des frais valides',
  'fee.tier.veryLow': 'Frais très bas',
  'fee.tier.low': 'Frais bas',
  'fee.tier.recommended': 'Frais recommandés',
  'fee.tier.priority': 'Frais prioritaires',
  'fee.tier.top': 'Priorité maximale',
  'fee.speed': 'Vitesse de confirmation : {speed}',
  'fee.speedName.veryLow': 'très lente',
  'fee.speedName.low': 'lente',
  'fee.speedName.recommended': 'normale',
  'fee.speedName.priority': 'rapide',
  'fee.speedName.top': 'très rapide',
  'fee.lowWarning': 'La transaction risque d’échouer en raison de frais bas',
  'replace.reason.confirmed':
    'Seuls les paiements non confirmés peuvent être remplacés.',
  'replace.reason.watchOnly':
    'Ce portefeuille en lecture seule ne peut pas signer.',
  'replace.reason.received':
    'Seuls les paiements envoyés depuis ce portefeuille peuvent être remplacés.',
  'replace.reason.foreignInputs':
    'Certaines entrées de ce paiement appartiennent à un autre portefeuille.',
  'replace.reason.spentLater':
    'Un paiement non confirmé plus récent dépense des fonds issus de celui-ci. Remplacer ce paiement annulerait aussi le paiement plus récent.',
  'replace.reason.refresh': 'Actualisez le portefeuille et réessayez.',
  'send.title': 'Envoyer du Bitcoin',
  'send.scanLabel': 'Scanner un code QR Bitcoin',
  'send.addressLabel': 'Adresse Bitcoin',
  'send.addressPlaceholder': 'Envoyer à une adresse Bitcoin',
  'send.notePlaceholder': 'Note personnelle',
  'send.noteOptional': '(facultatif)',
  'send.noteHint':
    'Saisissez une note pour repérer facilement cette transaction dans l’historique de votre portefeuille',
  'send.clipboardEmpty':
    'Le presse-papiers est vide. Touchez à nouveau pour saisir une adresse.',
  'send.pasteFailed':
    'Impossible de coller. Touchez à nouveau pour saisir une adresse.',
  'send.invalidAddress': 'Adresse BTC non valide. Vérifiez-la et réessayez.',
  'send.feesUnavailable':
    'Les frais de réseau sont indisponibles pour le moment. Vérifiez votre connexion et réessayez.',
  'send.prepareFailed': 'Impossible de préparer le paiement',
  'send.statusText': 'Envoi de {amount}',
  'send.sentLabel': 'Envoi de {amount} effectué',
  'send.sendingLabel': 'Envoi de {amount} en cours',
  'send.submitFailed': 'Impossible d’envoyer ce paiement.',
  'send.paymentTitle': 'Paiement',
  'review.title': 'Récapitulatif',
  'review.customizeFees': 'Personnaliser les frais',
  'review.to': 'Destinataire',
  'review.amount': 'Montant',
  'review.total': 'Total',
  'review.feeRate': 'Taux de frais',
  'fee.minimum': 'Frais minimaux : {rate} sat/vB',
  'fee.maximum': 'Frais maximaux : {rate} sat/vB',
  'fee.rateLabel': 'Taux de frais de réseau',
  'fee.rateInputLabel': 'Taux de frais en satoshis par octet virtuel',
  'fee.calculating': 'Calcul en cours…',
  'fee.rbf': 'Accélération (RBF)',
  'fee.rbfLabel': 'Remplacement par frais (RBF)',
  'fee.enabled': 'Activée',
  'fee.disabled': 'Désactivée',
  'slide.label': 'Glisser pour confirmer',
  'slide.handleLabel':
    'Faites glisser la poignée vers la droite pour confirmer',
  'send.showAddress': 'Afficher l’adresse Bitcoin complète',
  'manageWallets.title': 'Gérer les portefeuilles',
  'addWallet.title': 'Ajouter un portefeuille',
  'addWallet.createTitle': 'Créer un portefeuille',
  'addWallet.createDescription':
    'Créez un portefeuille avec une nouvelle phrase de récupération',
  'addWallet.icloudTitle': 'Sauvegarde iCloud',
  'walletSettings.name': 'Nom du portefeuille',
  'walletIcon.title': 'Icône du portefeuille',
  'walletIcon.change': 'Changer l’icône du portefeuille',
  'walletIcon.initials': 'Initiales',
  'walletIcon.wallet': 'Portefeuille',
  'walletIcon.multi_chain': 'Multichaîne',
  'walletIcon.diamond': 'Diamant',
  'walletIcon.speed': 'Vitesse',
  'walletIcon.bitcoin': 'Bitcoin',
  'walletIcon.tron': 'Tron',
  'walletIcon.heart': 'Cœur',
  'walletIcon.dollar': 'Dollar',
  'walletIcon.card': 'Carte',
  'walletIcon.flame': 'Flamme',
  'walletIcon.leaderboard': 'Classement',
  'walletIcon.savings': 'Épargne',
  'walletIcon.key': 'Clé',
  'walletIcon.growth': 'Croissance',
  'walletIcon.gift': 'Cadeau',
  'walletIcon.star': 'Étoile',
  'walletColor.label': '{color}, couleur du portefeuille',
  'walletColor.gold': 'Or',
  'walletColor.indigo': 'Indigo',
  'walletColor.red': 'Rouge',
  'walletColor.orange': 'Orange',
  'walletColor.sand': 'Sable',
  'walletColor.neon': 'Néon',
  'walletColor.green': 'Vert',
  'walletColor.ocean': 'Océan',
  'walletColor.lavender': 'Lavande',
  'walletColor.fuchsia': 'Fuchsia',
  'walletColor.grey': 'Gris',
  'manageWallets.settingsFor': 'Réglages du portefeuille {name}',
  'walletSettings.title': 'Réglages du portefeuille',
  'walletSettings.unavailableFeature':
    'Cette fonctionnalité n’est pas disponible dans cette version.',
  'walletSettings.nameRow': 'Nom',
  'walletSettings.backup': 'Sauvegarde',
  'walletSettings.addresses': 'Adresses',
  'walletSettings.signVerify': 'Signer / vérifier un message',
  'walletSettings.backupWarning':
    'Sauvegardez toujours votre portefeuille pour ne pas en perdre l’accès si vous perdez ou réinitialisez votre appareil.',
  'walletSettings.remove': 'Supprimer le portefeuille',
  'backup.secretKey': 'Clé secrète',
  'backup.methodsTitle': 'Méthodes de sauvegarde',
  'backup.protectTitle': 'Protégez votre portefeuille',
  'backup.protectSubtitle':
    'Sécurisez la sauvegarde de votre portefeuille dans iCloud avec une clé d’accès, grâce à Face ID ou Touch ID.',
  'backup.secure': 'Sécuriser',

  'backup.creating': 'Création de la sauvegarde',
  'backup.created': 'Sauvegarde créée',
  'backup.icloudTitle': 'Sauvegarde iCloud',
  'backup.icloudSubtitle':
    'Sécurisez votre portefeuille avec vos clés d’accès iCloud et restaurez-le avec Face ID ou Touch ID.',
  'backup.localWallet': 'Portefeuille local',
  'backup.cloudDisabled':
    'La sauvegarde cloud est désactivée. Utilisez la Clé secrète pour sauvegarder manuellement vos données de récupération.',
  'backup.secretKeySubtitle':
    'Obtenez vos données de récupération pour restaurer manuellement votre portefeuille.',
  'backup.revealTitle': 'Notez votre sauvegarde',
  'backup.revealWords':
    'Notez ces mots dans l’ordre et conservez-les en lieu sûr, hors ligne.',
  'backup.revealKey':
    'Recopiez exactement ce qui s’affiche et conservez-le en lieu sûr, hors ligne.',
  'backup.coverTitle': 'Afficher votre Clé secrète',
  'backup.check.writeDown': 'Notez-la. Rien de numérique.',
  'backup.check.private': 'Gardez votre écran à l’abri.',
  'backup.check.protect': 'Protégez votre Clé secrète.',
  'backup.check.neverShare': 'Ne la partagez jamais.',
  'backup.check.dontLose': 'Ne la perdez pas.',
  'backup.hold': 'Maintenir pour afficher',
  'backup.holdHint':
    'Maintenez le doigt appuyé pour afficher votre Clé secrète. Relâchez pour la masquer.',
  'remove.removedTitle': 'Portefeuille supprimé',
  'remove.confirmTitle': 'Supprimer de cet appareil ?',
  'remove.removedOthers':
    'Vos autres portefeuilles sont toujours disponibles sur cet appareil.',
  'remove.removedLast':
    'Vous pouvez maintenant créer un portefeuille ou en importer un.',
  'remove.confirmMessage':
    'Les clés et les données locales du portefeuille seront effacées. Vous pourrez l’importer à nouveau à l’aide de ses données de récupération.',
  'remove.message':
    '« {name} » sera supprimé de cet appareil.\n\nConservez ses données de récupération si vous devez l’importer à nouveau.',
  'remove.failed': 'Impossible de supprimer le portefeuille',
  'remove.confirm': 'Supprimer',
  'addresses.copyPrivateKey': 'Copier la clé privée',
  'addresses.receive': 'Réception',
  'addresses.change': 'Monnaie',
  'recovery.notProtected': 'Non protégé',
  'activity.unknownBroadcast': 'Statut de diffusion inconnu',
  'activity.checkPayment': 'Vérifier le paiement',
  'activity.checkPaymentMessage':
    'Actualisez d’abord, ou renvoyez exactement la même transaction signée.',
  'activity.refresh': 'Actualiser',
  'activity.connection': 'Connexion',
  'activity.resubmit': 'Renvoyer',
  'activity.submitted': 'Transaction envoyée',
  'activity.broadcast': 'Diffusion',
  'activity.empty': 'Votre activité s’affichera ici',
  'activity.syncing': 'Synchronisation des transactions…',
  'activity.cancelledTitle': 'Paiement annulé',
  'activity.cancelledMessage':
    'Une transaction de remplacement qui renvoie les fonds vers ce portefeuille a été envoyée au réseau. Elle apparaîtra dans Activité dès qu’elle sera détectée.',
  'time.seconds': 'quelques secondes',
  'time.minute': 'une minute',
  'time.minutes': { one: '{count} minute', other: '{count} minutes' },
  'time.hour': 'une heure',
  'time.hours': { one: '{count} heure', other: '{count} heures' },
  'time.day': 'un jour',
  'time.days': { one: '{count} jour', other: '{count} jours' },
  'time.month': 'un mois',
  'time.months': { one: '{count} mois', other: '{count} mois' },
  'time.year': 'un an',
  'time.years': { one: '{count} an', other: '{count} ans' },
  'time.ago': 'il y a {time}',
  'time.in': 'dans {time}',
  'activity.pending': 'En attente',
  'activity.dateUnavailable': 'Date indisponible',
  'activity.today': 'Aujourd’hui',
  'activity.yesterday': 'Hier',
  'activity.received': 'Reçu',
  'activity.selfTransfer': 'Transfert interne',
  'activity.sent': 'Envoyé',
  'activity.rowHintConverted':
    'Montant converti au prix actuel du Bitcoin. Ouvre les détails de la transaction.',
  'activity.rowHint': 'Ouvre les détails de la transaction.',
  'activity.timeUnavailable': 'Heure indisponible',
  'activity.selfFee': 'Frais · {amount}',
  'pending.title': 'Transaction en attente',
  'pending.lowFee':
    'Cette transaction pourrait tarder à aboutir en raison de frais bas',
  'pending.message':
    'Ce paiement n’est pas encore confirmé. D’ici là, vous pouvez l’accélérer ou l’annuler.',
  'pending.speedUp': 'Accélérer',
  'pending.cancel': 'Annuler',
  'note.title': 'Note personnelle',
  'error.somethingWrong': 'Une erreur s’est produite',
  'transaction.walletLabel': 'Portefeuille de la transaction : {name}',
  'transaction.receiving': 'Réception en cours',
  'transaction.sending': 'Envoi en cours',
  'transaction.unavailable': 'Indisponible',
  'transaction.selfNote': 'Transféré au sein de votre portefeuille',
  'transaction.from': 'Expéditeur',
  'transaction.status': 'Statut',
  'transaction.complete': 'Terminée',
  'transaction.date': 'Date',
  'transaction.receivedFrom': 'Reçu de',
  'transaction.receivingFrom': 'En provenance de',
  'transaction.sentTo': 'Envoyé à',
  'transaction.sendingTo': 'À destination de',
  'transaction.sentFrom': 'Envoyé depuis',
  'transaction.sendingFrom': 'Envoi depuis',
  'transaction.id': 'ID de transaction',
  'transaction.depositedTo': 'Déposé sur',
  'transaction.depositingTo': 'Dépôt en cours sur',
  'transaction.fee': 'Frais',
  'transaction.now': 'Valeur actuelle',
  'addresses.used': 'Utilisée',
  'addresses.menuCopy': 'Copier l’adresse',
  'addresses.menuCopyWif': 'Copier la clé privée (WIF)',
  'addresses.rowLabel': 'Adresse {index}, {address}',
  'addresses.rowHint': 'Ouvre les options de l’adresse.',
  'addresses.transactions': 'Transactions : {count}',
  'transaction.title': 'Transaction',
  'transaction.explorerHint':
    'Ouvre l’explorateur de blocs. Maintenez le doigt pour copier.',
  'transaction.holdToCopy': 'Maintenez le doigt pour copier.',
  'note.editHint': 'Modifie la note personnelle.',
  'note.add': 'Ajouter une note',
  'transaction.feeLabel': 'Frais : {amount}',
  'transaction.feeHint':
    'Change la devise des frais. Maintenez le doigt pour copier.',
  'transaction.copied': 'Copié !',
  'transaction.addressCount': {
    one: '{count} adresse',
    other: '{count} adresses',
  },
  'transaction.recipientHint':
    'Touchez pour afficher l’adresse complète. Maintenez le doigt pour copier.',
  'replace.cancel.title': 'Annuler le paiement ?',
  'replace.cancel.body':
    'Le paiement est remplacé par un autre qui renvoie ses fonds vers ce portefeuille, déduction faite des frais de réseau. Si le paiement d’origine est confirmé en premier, rien n’est annulé.',
  'replace.cancel.action': 'Annuler le paiement',
  'replace.cancel.failed': 'Échec de l’annulation du paiement.',
  'replace.unavailable': 'Impossible de remplacer ce paiement',
  'replace.newFee': 'Nouveaux frais',
  'replace.additionalFee': 'Frais additionnels',
  'replace.returns': 'Montant restitué',
  'replace.submitting': 'Envoi…',
  'settings.row.touchId': 'Verrouillage Touch ID',
  'settings.row.biometricLock': 'Verrouillage biométrique',
  'settings.faceIdNeedsPasscode': 'Définissez d’abord un code.',
  'settings.faceIdAllowTitle': 'Autoriser Face ID',
  'settings.faceIdAllowMessage':
    'Accédez à Réglages > Bithold > Face ID pour autoriser Bithold à utiliser Face ID.',
  'settings.passcodeRemoveTitle': 'Supprimer le code ?',
  'settings.passcodeRemoveMessage':
    'Si vous désactivez votre code, votre portefeuille ne sera plus protégé et vos fonds pourraient être en danger.',
  'settings.passcodeRemoveConfirm': 'Supprimer le code',
  'passcode.enableTitle': 'Activer le verrouillage par code',
  'passcode.enableBody1':
    'Bithold vous demandera votre code à l’ouverture, à chaque retour au premier plan et avant d’afficher votre Clé secrète ou une clé privée.',
  'passcode.enableBody2':
    'Si vous l’oubliez, le seul moyen de retrouver l’accès sera d’effacer les portefeuilles de cet appareil et de les importer à nouveau avec votre Clé secrète.',
  'passcode.enterNew':
    'Saisissez le code que vous utiliserez pour déverrouiller Bithold.',
  'passcode.enterCurrent': 'Saisissez votre code.',
  'passcode.field': 'Code',
  'passcode.confirmField': 'Confirmer le code',
  'passcode.mismatch': 'Les codes ne correspondent pas. Veuillez réessayer.',
  'lock.enterPasscode': 'Saisissez votre code',
  'lock.unlock': 'Déverrouiller',
  'lock.wrongPasscode': 'Code incorrect.',
  'lock.lockedOut': 'Trop de tentatives échouées. Veuillez patienter.',
  'lock.retryIn': 'Réessayez dans {time}. Laissez cet écran ouvert.',
  'lock.useFaceId': 'Utiliser Face ID',
  'lock.useTouchId': 'Utiliser Touch ID',
  'lock.forgot': 'Code oublié ?',
  'lock.forgotTitle': 'Code oublié ?',
  'lock.forgotMessage':
    'Le seul moyen de retrouver l’accès est d’effacer les portefeuilles de cet appareil et de les importer à nouveau avec votre Clé secrète.',
  'lock.eraseAndRestore': 'Effacer et restaurer',
  'lock.passcodeRequired': 'Code requis',
  'lock.enrolmentChanged':
    'Les réglages Face ID de votre appareil ont changé depuis votre dernière ouverture de Bithold. Saisissez votre code pour continuer. Vous pourrez réactiver le verrouillage Face ID dans les réglages de Bithold.',
  'lock.faceIdReason': 'Déverrouiller Bithold',
  'lock.invalidPasscode': 'Saisissez un code à 6 chiffres.',
  'lock.noPasscode': 'Aucun code n’est défini.',
  'walletName.title': 'Votre nom préféré',
  'walletName.introduction': 'Faisons connaissance.',
  'walletName.reassurance': 'Vous pouvez le modifier à tout moment.',
  'walletName.placeholder': 'Votre nom préféré…',
  'walletName.pickEmoji': 'Choisir un emoji',
  'walletName.changeEmoji': 'Changer d’emoji',
  'walletName.resetAvatar': 'Utiliser un avatar basé sur le nom',
  'walletName.yourAvatar': 'Votre avatar',
  'walletName.changeAvatar': 'Changer d’avatar',
  'walletName.pickPhoto': 'Choisir une photo',
  'walletName.takePhoto': 'Prendre une photo',
  'walletName.removePhoto': 'Supprimer la photo',
  'walletName.cameraDenied':
    'Autorisez l’accès à la caméra dans les Réglages pour prendre une photo du portefeuille.',
  'walletName.cameraUnavailable':
    'La caméra n’est pas disponible sur cet appareil.',
  'walletName.photoFailed':
    'La photo n’a pas pu être chargée. Veuillez réessayer.',
};
