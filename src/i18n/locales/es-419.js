// Spanish (Latin America), translated from en.js. Same keys; plural values use
// this language's CLDR categories (one / other).
export default {
  'import.recoveryTitle': 'Frase de recuperación',
  'import.tapToEnter': 'Toca para escribir o pegar tu frase de recuperación…',
  'import.validPhrase': 'Frase de recuperación válida',
  'import.invalidChecksum':
    'Frase de recuperación no válida — la suma de verificación no coincide',
  'walletSettings.type': 'Tipo',
  'walletSettings.transactionCount': 'Transacciones',
  'walletSettings.notSynced': 'Sin sincronizar',
  'walletSettings.watchOnly': 'Billetera de solo lectura',
  'walletSettings.publicKey': 'Mostrar XPUB de la billetera',
  'walletSettings.publicKeyTitle': 'XPUB de la billetera',
  'walletSettings.copyPublicKey': 'Copiar clave pública',
  'messageSigning.help':
    'Crea o verifica un mensaje firmado con una dirección de Bitcoin.',
  'messageSigning.address': 'Dirección de Bitcoin',
  'messageSigning.message': 'Mensaje',
  'messageSigning.signature': 'Firma',
  'messageSigning.sign': 'Firmar',
  'messageSigning.verify': 'Verificar',
  'messageSigning.valid':
    'Firma verificada. El mensaje corresponde a la dirección.',
  'messageSigning.invalid':
    'La verificación falló. Revisa la dirección, el mensaje y la firma.',
  'messageSigning.signed':
    'Mensaje firmado. Puedes copiar o compartir la firma.',
  'messageSigning.invalidAddress':
    'Ingresa una dirección de Bitcoin válida para esta red.',
  'messageSigning.invalidMessage':
    'Ingresa un mensaje de hasta 10,000 caracteres.',
  'messageSigning.unsupported':
    'La firma de mensajes admite direcciones Legacy, SegWit anidado y SegWit nativo de una sola clave. No admite Taproot ni scripts multifirma.',
  'messageSigning.watchOnly':
    'Esta es una billetera de solo lectura. Puedes verificar firmas, pero no firmar mensajes.',
  'messageSigning.notOwned':
    'Para firmar, usa la dirección seleccionada de esta billetera. Puedes verificar firmas de otras direcciones.',
  'messageSigning.unavailable':
    'La clave privada de esta dirección no está disponible.',
  'messageSigning.failed': 'No se pudo firmar el mensaje. Inténtalo de nuevo.',
  'messageSigning.shareFailed':
    'No se pudo abrir la opción de compartir. Inténtalo de nuevo.',
  'recovery.protected': 'Protegida',
  'cloud.protectedTitle': 'Estás protegido',
  'cloud.protectedDescription':
    'Tu billetera está protegida con una llave de acceso.',
  'cloud.title': 'Respaldo de recuperación en iCloud',
  'cloud.consent':
    'Cifra los datos de recuperación de esta billetera con una llave de acceso y guárdalos en tu almacenamiento privado de iCloud. La restauración requiere esta cuenta de iCloud y la misma llave de acceso. Conserva también el respaldo de tu Clave Secreta. El respaldo incluye las claves de recuperación y la configuración de la billetera, pero no las notas de las transacciones ni los pagos pendientes.',
  'cloud.saved': 'Respaldo verificado',
  'cloud.savedDescription':
    'Tu respaldo cifrado se guardó, se descargó y se descifró correctamente. Conserva la llave de acceso y el respaldo de tu Clave Secreta. Aún no se ha probado la restauración en otro dispositivo.',
  'cloud.subtitle':
    'Cifrado con una llave de acceso. Requiere iCloud e iOS 18 o posterior.',
  'cloud.verifiedSubtitle':
    'Se verificó un respaldo de recuperación el {date}. Toca para guardar una copia nueva.',
  'cloud.empty':
    'No se encontraron respaldos de recuperación en esta cuenta de iCloud.',
  'cloud.restoreTitle': '¿Restaurar la billetera?',
  'cloud.restorePreview':
    'Billetera: {name}\nRed: {network}\n\nSe agregará la billetera recuperada. Las billeteras existentes no se modificarán.',
  'cloud.restoredDescription':
    'Se restauraron las claves de recuperación. Los saldos y las transacciones se actualizarán desde la red.',
  'cloud.unsupported':
    'Los respaldos con llave de acceso requieren un iPhone o iPad con iOS 18 o posterior y la versión actualizada de Bithold.',
  'cloud.prfUnsupported':
    'Este proveedor de llaves de acceso no es compatible con el cifrado de respaldos. No se creó ningún respaldo verificado. Conserva el respaldo de tu Clave Secreta.',
  'cloud.accountUnavailable':
    'Inicia sesión en iCloud desde la Configuración de tu dispositivo y luego inténtalo de nuevo.',
  'cloud.accountChanged':
    'La cuenta de iCloud cambió durante esta operación. Inténtalo de nuevo con la cuenta correcta.',
  'cloud.quotaExceeded':
    'Tu almacenamiento de iCloud está lleno. Libera espacio e inténtalo de nuevo.',
  'cloud.network':
    'No se pudo conectar con iCloud. Revisa tu conexión e inténtalo de nuevo.',
  'cloud.invalidPayload':
    'No se pudo verificar que este respaldo sea una billetera de Bithold compatible. No se importó nada.',
  'cloud.duplicate':
    'Esta billetera ya está en la app. No se agregó ningún duplicado.',
  'cloud.interrupted':
    'Se interrumpió la operación. Desbloquea la app e inténtalo de nuevo.',
  'cloud.watchOnly':
    'Una billetera de solo lectura no tiene claves de recuperación privadas que respaldar.',
  'cloud.busy': 'Ya hay una operación de respaldo en curso.',
  'cloud.failed':
    'No se pudo completar ni verificar la operación. Revisa iCloud y la llave de acceso, y luego inténtalo de nuevo. Conserva el respaldo de tu Clave Secreta.',
  'cloudRestore.pickerHeader': 'Restaurar billetera',
  'cloudRestore.pickerTitle': 'Restaurar desde un respaldo',
  'cloudRestore.pickerSubtitle': 'Elige el respaldo que quieres restaurar',
  'cloudRestore.backupName': '#{index} Respaldo en iCloud',
  'cloudRestore.active': 'Activo',
  'cloudRestore.pastBackups': 'Respaldos anteriores',
  'cloudRestore.restoring': 'Restaurando billetera...',
  'cloudRestore.restoringSubtitle': 'Solo un momento',
  'cloudRestore.success': '¡Restauración exitosa!',
  'cloudRestore.activeTitle': 'Respaldo activo',
  'cloudRestore.emptyTitle': 'No hay respaldos',
  'cloudRestore.accessTitle': 'Permitir el acceso a\niCloud',
  'cloudRestore.passkeysTitle': 'Activar llaves de acceso',
  'cloudRestore.errorTitle': 'Algo salió mal',
  'cloudRestore.prfUnsupported':
    'Este proveedor de llaves de acceso no puede desbloquear los respaldos en iCloud. Usa llaves de acceso guardadas en el Llavero de iCloud o restaura la billetera con tu Clave Secreta.',
  'common.back': 'Atrás',
  'common.cancel': 'Cancelar',
  'common.continue': 'Continuar',
  'common.done': 'Listo',
  'common.edit': 'Editar',
  'common.loading': 'Cargando',
  'settings.title': 'Configuración',
  'settings.row.currency': 'Moneda',
  'settings.row.unit': 'Unidad de los montos',
  'settings.unit.fixedPrecision': 'Mostrar siempre 8 decimales',
  'settings.row.language': 'Idioma',
  'settings.row.blockExplorer': 'Explorador de bloques',
  'settings.explorer.custom': 'Personalizado',
  'settings.explorer.customSubtitle': 'Usa tu propio explorador',
  'settings.explorer.urlPlaceholder': 'URL del explorador',
  'settings.explorer.invalidUrl':
    'Ingresa una URL que comience con https:// o http://.',
  'settings.notificationsDenied':
    'Permite las notificaciones de Bithold en la Configuración del iPhone.',
  'settings.notificationsOpenSettings': 'Abrir Configuración',
  'settings.notificationsFailed':
    'No se pudo actualizar el permiso de notificaciones. Inténtalo de nuevo.',
  'settings.row.notifications': 'Notificaciones',
  'settings.row.sounds': 'Sonidos',
  'settings.row.haptic': 'Respuesta háptica',
  'settings.row.animation': 'Animación del portafolio',
  'settings.row.passcode': 'Bloqueo con código',
  'settings.row.faceId': 'Bloqueo con Face ID',
  'settings.row.reset': 'Restablecer aplicación',
  'settings.currencyFailed': 'No se pudo cambiar la moneda',
  'settings.resetMessage':
    '¿Eliminar todas las billeteras y claves locales de este dispositivo? Asegúrate de haber respaldado los datos de recuperación de cada billetera.',
  'settings.resetTitle': '¿Estás seguro?',
  'settings.resetWarning': 'Esta acción no se puede deshacer.',
  'settings.resetConfirm': 'Restablecer aplicación',
  'settings.setCurrency': 'Elegir moneda',
  'settings.searchCurrencies': 'Buscar monedas',
  'settings.closeSearch': 'Cerrar búsqueda',
  'settings.noCurrencies': 'No se encontraron monedas',
  'settings.noCurrenciesHint':
    'Prueba con el nombre o el código de una moneda.',
  'settings.selectLanguage': 'Elegir idioma',
  'restore.icloudTitle': 'Restaurar con tu respaldo en iCloud',
  'restore.icloudSubtitle':
    'Restaura tu cuenta con tus llaves de acceso de iCloud.',
  'restore.secretKeyTitle': 'Clave Secreta (avanzada)',
  'restore.secretKeySubtitle':
    'Restaura tu cuenta con tu Clave Secreta de 12 palabras.',
  'restore.qrTitle': 'Código QR',
  'restore.qrSubtitle': 'Sincroniza con Bithold en otro dispositivo.',
  'electrum.chooseServer': 'Elige un servidor.',
  'currency.AED': 'Dírham de los Emiratos Árabes Unidos',
  'currency.AMD': 'Dram armenio',
  'currency.ANG': 'Florín de las Antillas Neerlandesas',
  'currency.ARS': 'Peso argentino',
  'currency.AUD': 'Dólar australiano',
  'currency.AWG': 'Florín arubeño',
  'currency.BDT': 'Taka bangladesí',
  'currency.BHD': 'Dinar bareiní',
  'currency.BOB': 'Boliviano',
  'currency.BRL': 'Real brasileño',
  'currency.CAD': 'Dólar canadiense',
  'currency.CHF': 'Franco suizo',
  'currency.CLP': 'Peso chileno',
  'currency.CNY': 'Yuan renminbi',
  'currency.COP': 'Peso colombiano',
  'currency.CZK': 'Corona checa',
  'currency.DKK': 'Corona danesa',
  'currency.DOP': 'Peso dominicano',
  'currency.DZD': 'Dinar argelino',
  'currency.EGP': 'Libra egipcia',
  'currency.ETB': 'Bir etíope',
  'currency.EUR': 'Euro',
  'currency.GBP': 'Libra esterlina',
  'currency.GHS': 'Cedi ghanés',
  'currency.GTQ': 'Quetzal guatemalteco',
  'currency.HKD': 'Dólar hongkonés',
  'currency.HUF': 'Forinto húngaro',
  'currency.IDR': 'Rupia indonesia',
  'currency.ILS': 'Nuevo séquel israelí',
  'currency.INR': 'Rupia india',
  'currency.IRR': 'Rial iraní',
  'currency.IRT': 'Tomán iraní',
  'currency.ISK': 'Corona islandesa',
  'currency.JPY': 'Yen japonés',
  'currency.KES': 'Chelín keniano',
  'currency.KRW': 'Won surcoreano',
  'currency.KWD': 'Dinar kuwaití',
  'currency.KZT': 'Tenge kazajo',
  'currency.LBP': 'Libra libanesa',
  'currency.LKR': 'Rupia esrilanquesa',
  'currency.MAD': 'Dírham marroquí',
  'currency.MXN': 'Peso mexicano',
  'currency.MYR': 'Ringit malasio',
  'currency.MZN': 'Metical mozambiqueño',
  'currency.NGN': 'Naira nigeriano',
  'currency.NOK': 'Corona noruega',
  'currency.NZD': 'Dólar neozelandés',
  'currency.OMR': 'Rial omaní',
  'currency.PEN': 'Sol peruano',
  'currency.PHP': 'Peso filipino',
  'currency.PKR': 'Rupia pakistaní',
  'currency.PLN': 'Esloti polaco',
  'currency.PYG': 'Guaraní paraguayo',
  'currency.QAR': 'Rial catarí',
  'currency.RON': 'Leu rumano',
  'currency.RSD': 'Dinar serbio',
  'currency.RUB': 'Rublo ruso',
  'currency.SAR': 'Rial saudí',
  'currency.SEK': 'Corona sueca',
  'currency.SGD': 'Dólar singapurense',
  'currency.THB': 'Baht tailandés',
  'currency.TRY': 'Lira turca',
  'currency.TWD': 'Nuevo dólar taiwanés',
  'currency.TZS': 'Chelín tanzano',
  'currency.UAH': 'Grivna ucraniana',
  'currency.UGX': 'Chelín ugandés',
  'currency.USD': 'Dólar estadounidense',
  'currency.UYU': 'Peso uruguayo',
  'currency.UZS': 'Som uzbeko',
  'currency.VES': 'Bolívar venezolano',
  'currency.VND': 'Dong vietnamita',
  'currency.XAF': 'Franco CFA de África Central',
  'currency.XOF': 'Franco CFA de África Occidental',
  'currency.ZAR': 'Rand sudafricano',
  'common.copyAddress': 'Copiar dirección',
  'bubble.dismissAddress': 'Ocultar dirección',
  'brand.logo': 'Logotipo de Bithold',
  'sheet.dismiss': 'Cerrar panel',
  'sheet.background': 'Fondo de la ventana modal',
  'wallet.alertTitle': 'Billetera',
  'error.operationFailed': 'No se pudo completar la operación.',
  'common.next': 'Siguiente',
  'common.ok': 'Aceptar',
  'import.title': 'Ingresa tu frase de recuperación, clave o descriptor',
  'common.confirm': 'Confirmar',
  'import.loading': 'Importando tu billetera…',
  'import.failed': 'No se pudo importar la billetera',
  'import.inputAlertTitle': 'No se pudo ingresar el texto',
  'import.inputLimit': 'El texto supera el límite de 16,384 caracteres.',
  'import.fieldUnavailable': 'El campo de importación ya no está disponible.',
  'import.fieldInactive': 'El campo de importación ya no está activo.',
  'import.composing':
    'Termina de escribir la palabra actual antes de importar.',
  'import.description':
    'Si usas una frase de recuperación para importar la billetera, separa cada palabra con un espacio.',
  'import.inputLabel': 'Frase de recuperación, clave o descriptor',
  'import.inputHint':
    'Ingresa tu frase de recuperación, clave privada o descriptor.',
  'import.pasteEmpty':
    'Copia tu frase de recuperación o clave privada y luego toca Pegar.',
  'import.clear': 'Borrar',
  'import.scan': 'Escanear',
  'import.paste': 'Pegar',
  'import.passphrase': 'Frase de contraseña',
  'import.passphrasePrompt': 'Ingresa la frase de contraseña si usaste una',
  'import.options': 'Opciones de importación',
  'onboarding.welcome.setupOptions':
    'Configura Bithold con una de las siguientes opciones.',
  'onboarding.welcome.selfCustody':
    'La autocustodia significa\nque siempre tienes\nel control de tus fondos',
  'onboarding.welcome.recoveryPhrase': 'Crear frase de recuperación',
  'onboarding.welcome.recoveryDescription':
    'Una nueva billetera de Bitcoin con 12 palabras para restaurarla',
  'onboarding.welcome.importDescription':
    'Frase semilla, clave privada o respaldo\u00A0en\u00A0iCloud',
  'onboarding.welcome.email': 'Continuar con correo',
  'onboarding.welcome.emailDescription':
    'Inicia sesión o crea una cuenta Wallet',
  'onboarding.welcome.import': 'Importar',
  'onboarding.welcome.apple': 'Iniciar sesión con Apple',
  'onboarding.welcome.google': 'Iniciar sesión con Google',
  'onboarding.welcome.termsIntro': 'Al usar Bithold, aceptas nuestros',
  'onboarding.welcome.termsOfService': 'Términos de servicio',
  'onboarding.welcome.termsAnd': 'y nuestra',
  'onboarding.welcome.privacyPolicy': 'Política de privacidad',
  'onboarding.or': 'O',
  'onboarding.welcomeTitle':
    '¡Bienvenido a su nueva billetera de activos digitales!',
  'onboarding.getStarted': 'Empezar',
  'onboarding.restoreWallet': 'Restaurar monedero',
  'onboarding.title':
    'Protege, administra\ny guarda tu Bitcoin\nen un solo lugar',
  'onboarding.create': 'Crear billetera nueva',
  'onboarding.creating': 'Creando tu billetera…',
  'onboarding.createFailed': 'No se pudo crear la billetera',
  'onboarding.import': 'Importar billetera',
  'onboarding.terms': 'Al continuar, aceptas los {terms} y la {privacy}',
  'onboarding.termsOfService': 'Términos de servicio',
  'onboarding.privacyPolicy': 'Política de privacidad',
  'onboarding.noCloudBackup':
    'Bithold todavía no respalda billeteras en la nube, así que no hay ningún respaldo en la nube para importar.',
  'importWith.title': 'Importar con',
  'importWith.phraseTitle': 'Frase semilla o clave privada',
  'importWith.phraseDescription':
    'Usa frases semilla de 12, 18 o 24 palabras, o claves privadas',
  'importWith.cloudTitle': 'Respaldo en la nube',
  'importWith.cloudDescription':
    'Importa tu billetera rápidamente desde tu respaldo en la nube',
  'common.save': 'Guardar',
  'import.passphraseEnabled': 'Frase de contraseña activada',
  'import.usePassphrase': 'Usar frase de contraseña',
  'import.addressType': 'Tipo de dirección: {type}',
  'import.addressTypesAutomatic': 'Tipos de dirección: automático',
  'import.defaultDerivationPath': 'Ruta de derivación predeterminada',
  'import.bip39Passphrase': 'Frase de contraseña BIP39',
  'import.bip39PassphraseMessage':
    'Usa la frase de contraseña exacta asociada a esta billetera. De forma predeterminada, la frase de contraseña está vacía.',
  'import.addressTypeTitle': 'Tipo de dirección',
  'import.derivationPath': 'Ruta de derivación',
  'import.pasteFailed': 'No se pudo pegar',
  'import.pasteAccess': 'Permite el acceso para pegar cuando iOS lo solicite.',
  'import.nothingToPaste': 'No hay nada que pegar',
  'import.editWord': 'Editar palabra',
  'scanner.title': 'Escanear para enviar',
  'scanner.denied':
    'Permite el acceso a la cámara en Configuración para escanear códigos QR.',
  'scanner.unavailable':
    'La cámara no está disponible. Ingresa o pega la dirección.',
  'scanner.openSettings': 'Abrir Configuración',
  'scanner.invalid':
    'Este código QR no contiene una dirección de Bitcoin válida.',
  'balance.resetFailed': 'No se pudo restablecer',
  'balance.refreshFailed': 'No se pudo actualizar',
  'activity.title': 'Actividad',
  'balance.hiddenLabel': 'Saldo oculto. Mantén presionado para mostrarlo.',
  'balance.shownLabel':
    'Saldo de la billetera. Mantén presionado para ocultarlo.',
  'balance.walletSelector': 'Selector de billetera',
  'wallet.defaultName': 'Billetera {number}',
  'balance.receive': 'Recibir',
  'balance.send': 'Enviar',
  'chart.noData': 'No hay datos disponibles. Inténtalo de nuevo.',
  'chart.bitcoinPrice': 'Precio de Bitcoin',
  'chart.today': '{change} hoy',
  'balance.pullToRefresh': 'Desliza para actualizar',
  'balance.releaseToRefresh': 'Suelta para actualizar',
  'balance.updating': 'Actualizando…',
  'common.copied': 'Copiado',
  'common.copiedBubble': 'Copiado.',
  'error.tryAgain': 'Inténtalo de nuevo.',
  'addressType.descriptor': 'Script personalizado',
  'receive.addressLabel': 'Tu dirección BTC',
  'receive.addressLabelTaproot': 'Tu dirección BTC Taproot',
  'receive.addressLabelLegacy': 'Tu dirección BTC Legacy',
  'receive.title': 'Recibir Bitcoin',
  'receive.pathTitle': 'Ruta de recepción',
  'receive.qrCopy': 'Copiar',
  'receive.qrShare': 'Compartir…',
  'receive.addressFailed': 'No se pudo obtener la dirección',
  'receive.newAddress': 'Nueva dirección',
  'receive.newAddressHint':
    'Muestra una nueva dirección de recepción en esta ruta',
  'receive.copyFailed': 'No se pudo copiar',
  'receive.shareFailed': 'No se pudo compartir',
  'receive.typeLabel': 'Tipo de dirección de recepción',
  'receive.typeHint': 'Abre los tipos de dirección de recepción disponibles',
  'receive.qrLabel':
    'Código QR de Bithold. Mantén presionado para copiar o compartir.',
  'receive.choosePath': 'Elegir ruta de recepción',
  'receive.choosePathAddress': 'Elegir ruta de recepción. {address}',
  'receive.choosePathHint':
    'Abre las rutas de recepción disponibles para esta billetera',
  'receive.pathFailed': 'No se pudo seleccionar la ruta de recepción',
  'receive.path.wif': 'Clave privada individual',
  'receive.path.address': 'Dirección importada',
  'receive.path.descriptor': 'Descriptor importado',
  'auth.notCompleted': 'No se completó la autenticación',
  'native.storageRead':
    'No se pudieron leer los datos locales de la billetera. Desbloquea el dispositivo e inténtalo de nuevo.',
  'native.storageSave':
    'No se pudieron guardar los datos locales de la billetera',
  'native.storageRemove':
    'No se pudieron eliminar los datos locales de la billetera',
  'native.entropySize': 'Tamaño de entropía no válido',
  'native.randomness': 'Aleatoriedad segura no disponible',
  'native.invalidServer': 'Servidor no válido',
  'native.tlsFailed': 'Falló la conexión TLS',
  'native.tcpFailed': 'Falló la conexión TCP',
  'native.connectTimeout': 'Se agotó el tiempo de espera de la conexión',
  'native.certificateChanged': 'El certificado cambió',
  'native.certificateUntrusted': 'Certificado no confiable',
  'native.overlappingRequest': 'Solicitud al servidor no válida o superpuesta',
  'native.timeout': 'Se agotó el tiempo de espera de la solicitud al servidor',
  'native.sendFailed': 'No se pudo enviar la solicitud al servidor',
  'native.responseTooLarge': 'Respuesta del servidor demasiado grande',
  'native.invalidResponse': 'Respuesta del servidor no válida',
  'native.unexpectedResponse': 'Respuesta inesperada del servidor',
  'native.disconnected': 'Servidor desconectado',
  'native.connectionClosed': 'Conexión cerrada',
  'native.unavailable':
    'Esta versión no incluye el motor nativo de la billetera',
  'send.amountTitle': 'Ingresar monto',
  'send.priceUnavailable': 'Precio no disponible',
  'send.priceUnavailableMessage':
    'Ingresa el monto en Bitcoin mientras el tipo de cambio no esté disponible.',
  'send.dustWarning': 'La red de Bitcoin no admite envíos de {amount} o menos',
  'send.insufficientWarning': 'Deposita más fondos o ingresa un monto menor.',
  'send.amountInCurrency': 'Monto en {currency}',
  'send.amountInBitcoin': 'Monto en Bitcoin',
  'send.switchCurrency': 'Cambiar entre Bitcoin y {currency}',
  'send.useAvailable': 'Usar saldo disponible',
  'send.available': 'Disponible',
  'send.networkFee': 'Comisión de red',
  'error.keys.invalidAddressIndex': 'Índice de dirección no válido',
  'error.keys.addressBranchUnavailable': 'Rama de direcciones no disponible',
  'error.keys.descriptorMustProduceAddressableOutput':
    'El descriptor debe generar una salida con dirección',
  'error.keys.witnessScriptsRequireCompressedPublic':
    'Los scripts de testigo (witness) requieren claves públicas comprimidas',
  'error.keys.walletCannotSign': 'Esta billetera no puede firmar',
  'error.descriptor.invalidDescriptorCharacter':
    'Carácter de descriptor no válido',
  'error.descriptor.invalidDescriptor': 'Descriptor no válido',
  'error.descriptor.invalidDescriptorDerivation':
    'Derivación de descriptor no válida',
  'error.descriptor.publicKeysCannotHaveDerivation':
    'Las claves públicas no pueden tener rutas de derivación',
  'error.descriptor.privateKeysCannotHaveDerivation':
    'Las claves privadas no pueden tener rutas de derivación',
  'error.descriptor.hardenedStepsMustPrecedeBranches':
    'Los pasos endurecidos deben ir antes de las ramas',
  'error.descriptor.publicKeyCannotDeriveHardened':
    'Una clave pública no puede derivar claves hijas endurecidas',
  'error.descriptor.invalidDescriptorChecksum':
    'Suma de verificación del descriptor no válida',
  'error.descriptor.descriptorNestingTooDeep':
    'Anidamiento de descriptores demasiado profundo',
  'error.descriptor.unsupportedDescriptorNesting':
    'Anidamiento de descriptores no compatible',
  'error.descriptor.invalidMultisigThreshold': 'Umbral multifirma no válido',
  'error.descriptor.unsupportedDescriptorExpression':
    'Expresión de descriptor no compatible',
  'error.descriptor.duplicateMultisigKeys': 'Claves multifirma duplicadas',
  'error.descriptor.descriptorRequiresCompressedXOnly':
    'Este descriptor requiere una clave pública comprimida o x-only',
  'error.keys.unsupportedBitcoinNetwork': 'Red de Bitcoin no compatible',
  'error.keys.invalidDerivationPath': 'Ruta de derivación no válida',
  'error.keys.derivationIndexTooLarge':
    'El índice de derivación es demasiado grande',
  'error.keys.invalidExtendedKey': 'Clave extendida no válida',
  'error.keys.keyBelongsDifferentBitcoinNetwork':
    'La clave pertenece a otra red de Bitcoin',
  'error.keys.invalidPrivateKeyNetwork': 'Clave privada o red no válida',
  'error.keys.unsupportedAddressType': 'Tipo de dirección no compatible',
  'error.keys.enterRecoveryPhraseKeyDescriptor':
    'Ingresa una frase de recuperación, clave o descriptor',
  'error.keys.invalidRecoveryPhraseCheckEvery':
    'Frase de recuperación no válida: revisa cada palabra, la cantidad de palabras y la suma de verificación',
  'error.payment.missingSpendingOutput': 'Falta una salida a gastar',
  'error.payment.spendingOutputChanged': 'Cambió una salida a gastar',
  'error.payment.unsupportedTaprootSpendPath':
    'Ruta de gasto Taproot no compatible',
  'error.payment.unsupportedInputScriptFeeEstimation':
    'Script de entrada no compatible con la estimación de la comisión',
  'error.payment.useMostThreeDecimalPlaces':
    'Usa como máximo tres decimales en la tasa de comisión',
  'error.payment.watchOnlyWalletCannotSign':
    'Esta billetera de solo lectura no puede firmar pagos',
  'error.payment.refreshWalletBeforeSending':
    'Actualiza la billetera antes de enviar',
  'error.payment.chooseFeeRate11000':
    'Elige una tasa de comisión de 1 a 1000 sat/vB',
  'error.payment.invalidRbfPreference': 'Preferencia de RBF no válida',
  'error.payment.enterLeast546Satoshis': 'Ingresa al menos 546 satoshis',
  'error.payment.insufficientBalanceAmountNetworkFee':
    'Saldo insuficiente para este monto y la comisión de red',
  'error.payment.amountBelowBitcoinDustLimit':
    'Después de las comisiones, el monto queda por debajo del límite de polvo de Bitcoin',
  'error.payment.noSpendableBitcoinAvailable':
    'No hay Bitcoin disponible para gastar',
  'error.payment.duplicateSpendingOutput': 'Salida a gastar duplicada',
  'error.payment.walletSnapshotChangedRefreshFee':
    'La instantánea de la billetera cambió. Actualiza la vista previa de la comisión.',
  'error.payment.paymentAccountingMismatch':
    'Discrepancia en la contabilidad del pago',
  'error.payment.secureSigningRandomnessUnavailable':
    'Aleatoriedad segura para firmar no disponible',
  'error.payment.transactionRbfSettingDoesNot':
    'La configuración de RBF de la transacción no coincide con la revisión aprobada',
  'error.payment.recoveryMaterialCannotSignInput':
    'Los datos de recuperación no pueden firmar esta entrada',
  'error.payment.signedPaymentDoesNotMatch':
    'El pago firmado no coincide con la revisión aprobada',
  'error.payment.signedTransactionExceedsReviewedFee':
    'La transacción firmada supera la comisión estimada que se revisó. Prepárala de nuevo.',
  'error.payment.broadcastResultUncertainSignedPayment':
    'El resultado de la transmisión es incierto. Se conservó el pago firmado; actualiza para comprobar su estado.',
  'error.replacement.unknownReplacement': 'Reemplazo desconocido',
  'error.replacement.refreshWalletBeforeReplacingPayment':
    'Actualiza la billetera antes de reemplazar un pago',
  'error.replacement.paymentTooSmallCancelFee':
    'Este pago es demasiado pequeño para cancelarlo con esta comisión: no quedaría nada después de la comisión de red.',
  'error.replacement.notEnoughConfirmedBitcoinRaise':
    'No hay suficiente Bitcoin confirmado para aumentar la comisión de este pago. En su lugar, puedes cancelarlo.',
  'error.replacement.replacementAccountingMismatch':
    'Discrepancia en la contabilidad del reemplazo',
  'error.replacement.replacementFeeNotHigherThan':
    'La comisión del reemplazo no es mayor que la original',
  'error.chart.invalidHistoricalPrice': 'Precio histórico no válido',
  'error.chart.historicalPricesAreStale':
    'Los precios históricos están desactualizados',
  'error.chart.notEnoughHistoricalPrices':
    'No hay suficientes precios históricos',
  'error.chart.unsupportedChartRange': 'Rango del gráfico no compatible',
  'error.chart.incorrectHistoryCurrency': 'Moneda del historial incorrecta',
  'error.chart.invalidHistoricalResponse':
    'Respuesta de precios históricos no válida',
  'error.chart.invalidHistoryDate': 'Fecha del historial no válida',
  'error.chart.unknownHistorySource': 'Fuente del historial desconocida',
  'error.chart.unsupportedHistoryCurrency':
    'Moneda del historial no compatible',
  'error.electrum.incompleteElectrumResponse':
    'Respuesta de Electrum incompleta',
  'error.electrum.duplicateElectrumResponse': 'Respuesta de Electrum duplicada',
  'error.electrum.walletConnectionClosed':
    'Se cerró la conexión de la billetera',
  'error.electrum.serverFailedBitcoinMainnetVerification':
    'El servidor no superó la verificación de Bitcoin Mainnet',
  'error.electrum.connectionSuperseded': 'Conexión reemplazada',
  'error.electrum.unableConnectBitcoinServersCheck':
    'No se pudo conectar a los servidores de Bitcoin. Revisa tu conexión y actualiza.',
  'error.electrum.invalidChainTip': 'Punta de la cadena no válida',
  'error.electrum.invalidSubscriptionStatus': 'Estado de suscripción no válido',
  'error.electrum.addressHistoryChangedDuringSynchronization':
    'El historial de la dirección cambió durante la sincronización; vuelve a actualizar',
  'error.electrum.invalidBlockHeader': 'Encabezado de bloque no válido',
  'error.fees.invalidFeeRecommendations':
    'Recomendaciones de comisión no válidas',
  'error.fees.inconsistentFeeRecommendations':
    'Recomendaciones de comisión incoherentes',
  'error.rates.incorrectRateBaseCurrency':
    'Moneda base del tipo de cambio incorrecta',
  'error.rates.invalidStaleRateTimestamp':
    'Marca de tiempo del tipo de cambio no válida o desactualizada',
  'error.rates.unknownRateProvider': 'Proveedor de tipos de cambio desconocido',
  'error.rates.invalidRateResponse': 'Respuesta de tipo de cambio no válida',
  'error.rates.noSupportedPricesResponse':
    'La respuesta no contiene precios compatibles',
  'error.rates.providerCoolingDownFailure':
    'El proveedor está en pausa después de un error',
  'error.rates.unsupportedCurrency': 'Moneda no compatible',
  'error.rates.krakenReturnedError': 'Kraken devolvió un error',
  'error.rates.incorrectPriceCurrency': 'Moneda del precio incorrecta',
  'error.rates.invalidConversionResponse': 'Respuesta de conversión no válida',
  'error.rates.invalidBitcoinPrice': 'Precio de Bitcoin no válido',
  'error.accounts.walletStorageNotReady':
    'El almacenamiento de la billetera no está listo',
  'error.accounts.invalidRecoveryMaterialImportOptions':
    'Datos de recuperación u opciones de importación no válidos. Revisa la suma de verificación, la red y la ruta de derivación.',
  'error.accounts.walletAlreadyImported': 'Esta billetera ya está importada',
  'error.accounts.importWasInterruptedPleaseTry':
    'Se interrumpió la importación. Inténtalo de nuevo.',
  'error.accounts.enterWalletName180':
    'Ingresa un nombre de billetera de 1 a 80 caracteres',
  'error.accounts.addressTypeUnavailable': 'Tipo de dirección no disponible',
  'error.accounts.walletNoLongerExists': 'La billetera ya no existe',
  'error.accounts.walletHasUnresolvedBroadcastCheck':
    'Esta billetera tiene una transmisión sin resolver. Revísala antes de eliminar la billetera.',
  'error.accounts.invalidTransaction': 'Transacción no válida',
  'error.accounts.invalidNote': 'Nota no válida',
  'error.payment.walletNotSynchronized': 'La billetera no está sincronizada',
  'error.payment.previousBroadcastUnresolvedRefreshRetry':
    'Hay una transmisión anterior sin resolver. Actualiza o vuelve a intentar ese mismo pago desde Actividad.',
  'error.payment.paymentAlreadyBeingSubmitted': 'Ya se está enviando un pago',
  'error.payment.paymentReviewExpiredSelectedWallet':
    'La revisión del pago expiró o cambió la billetera seleccionada. Vuelve a revisarlo.',
  'error.payment.paymentConfirmedChangedMeantimeNothing':
    'Mientras tanto, este pago se confirmó o cambió. No se reemplazó nada.',
  'error.payment.selectedCoinsChangedReviewPayment':
    'Las monedas seleccionadas cambiaron. Vuelve a revisar el pago.',
  'error.payment.signingKeyUnavailable': 'La clave de firma no está disponible',
  'error.payment.noUnresolvedPaymentAvailable':
    'No hay ningún pago sin resolver disponible',
  'error.preferences.unknownPreference': 'Preferencia desconocida',
  'error.preferences.backgroundPushNotificationsAreNot':
    'Las notificaciones push en segundo plano no están configuradas. La sincronización del saldo funciona mientras la app está abierta.',
  'error.recovery.watchOnlyWalletHasNo':
    'Esta billetera de solo lectura no tiene datos de recuperación privados',
  'error.recovery.walletHasNoPrivateRecovery':
    'Esta billetera no tiene datos de recuperación privados',
  'error.recovery.recoveryMaterialUnavailable':
    'Los datos de recuperación no están disponibles',
  'error.recovery.watchOnlyWalletHasNo2':
    'Esta billetera de solo lectura no tiene claves privadas',
  'error.recovery.walletHasNoPrivateKeys':
    'Esta billetera no tiene claves privadas',
  'error.recovery.addressControlledBySeveralKeys':
    'Esta dirección está controlada por varias claves, así que no tiene una única clave privada.',
  'error.storage.walletMetadataDamaged':
    'Los metadatos de la billetera están dañados',
  'error.sync.invalidRawTransaction': 'Transacción en bruto no válida',
  'error.sync.transactionIdVerificationFailed':
    'Falló la verificación del ID de transacción',
  'error.sync.invalidTransactionValues': 'Valores de transacción no válidos',
  'error.sync.invalidAddressState': 'Estado de dirección no válido',
  'error.sync.inconsistentTransactionHistory':
    'Historial de transacciones incoherente',
  'error.sync.invalidUnspentOutput': 'Salida no gastada no válida',
  'error.sync.balanceDoesNotMatchUnspent':
    'El saldo no coincide con las salidas no gastadas',
  'error.sync.walletScanCancelled': 'Se canceló el escaneo de la billetera',
  'error.sync.addressDiscoveryLimitReachedLarger':
    'Se alcanzó el límite de detección de direcciones; un escaneo más amplio requiere una configuración de recuperación explícita',
  'error.sync.overlappingWalletDerivationBranches':
    'Ramas de derivación de la billetera superpuestas',
  'error.sync.historyChangedDuringSynchronization':
    'El historial cambió durante la sincronización',
  'error.sync.missingInputTransaction': 'Falta la transacción de entrada',
  'error.sync.invalidTransactionAccounting':
    'Contabilidad de la transacción no válida',
  'error.sync.serverHistoryDoesNotBelong':
    'El historial del servidor no pertenece a esta dirección',
  'error.sync.serverOmittedAddedUnspentOutputs':
    'El servidor omitió o agregó salidas no gastadas',
  'error.sync.outputValueOwnershipMismatch':
    'Discrepancia en el valor o la titularidad de una salida',
  'error.sync.chainChangedDuringSynchronizationRefresh':
    'La cadena cambió durante la sincronización; vuelve a actualizar',
  'error.sync.invalidWalletBalance': 'Saldo de la billetera no válido',
  'error.sync.connectionChangedDuringSynchronizationRefresh':
    'La conexión cambió durante la sincronización; vuelve a actualizar',
  'error.payment.serviceUnavailable': 'Servicio no disponible ({status})',
  'error.chart.historyUnavailable':
    'Los precios históricos en {currency} no están disponibles temporalmente. Se conservó tu gráfico guardado.',
  'error.electrum.rejected': 'Electrum rechazó {method}',
  'error.rates.noProvider':
    'En este momento no hay ningún proveedor de precios disponible para {currency}. Se conservó el último precio guardado.',
  'error.addresses.gapLimit': {
    one: 'Esta billetera ya tiene {count} dirección consecutiva sin usar. Primero recibe un pago en ella para que otras billeteras que la restauren puedan seguir encontrando tus fondos.',
    other:
      'Esta billetera ya tiene {count} direcciones consecutivas sin usar. Primero recibe un pago en una de ellas para que otras billeteras que la restauren puedan seguir encontrando tus fondos.',
  },
  'error.preferences.priceUnavailable':
    'El precio en {currency} no está disponible temporalmente. Tu moneda seleccionada no cambió.',
  'error.storage.openFailed':
    'No se pudieron abrir tus billeteras locales. Desbloquea tu teléfono e inténtalo de nuevo.',
  'recovery.passphraseLabel': 'Frase de contraseña BIP39:',
  'fee.custom': 'Comisión personalizada',
  'fee.estimateUnavailable': 'Estimación de confirmación no disponible',
  'fee.network': 'Comisión de red',
  'fee.enterValid': 'Ingresa una comisión válida',
  'fee.tier.veryLow': 'Comisión muy baja',
  'fee.tier.low': 'Comisión baja',
  'fee.tier.recommended': 'Comisión recomendada',
  'fee.tier.priority': 'Comisión prioritaria',
  'fee.tier.top': 'Prioridad máxima',
  'fee.speed': 'Velocidad de confirmación: {speed}',
  'fee.speedName.veryLow': 'muy lenta',
  'fee.speedName.low': 'lenta',
  'fee.speedName.recommended': 'normal',
  'fee.speedName.priority': 'rápida',
  'fee.speedName.top': 'muy rápida',
  'fee.lowWarning': 'La transacción podría fallar debido a la comisión baja',
  'replace.reason.confirmed':
    'Solo se pueden reemplazar los pagos sin confirmar.',
  'replace.reason.watchOnly': 'Esta billetera de solo lectura no puede firmar.',
  'replace.reason.received':
    'Solo se pueden reemplazar los pagos enviados desde esta billetera.',
  'replace.reason.foreignInputs':
    'Algunas entradas de este pago pertenecen a otra billetera.',
  'replace.reason.spentLater':
    'Un pago posterior sin confirmar gasta fondos de este. Reemplazarlo también cancelaría ese pago.',
  'replace.reason.refresh': 'Actualiza la billetera e inténtalo de nuevo.',
  'send.title': 'Enviar Bitcoin',
  'send.scanLabel': 'Escanear código QR de Bitcoin',
  'send.addressLabel': 'Dirección de Bitcoin',
  'send.addressPlaceholder': 'Enviar a una dirección de Bitcoin',
  'send.notePlaceholder': 'Nota personal',
  'send.noteOptional': '(opcional)',
  'send.noteHint':
    'Ingresa una nota para identificar fácilmente esta transacción en el historial de tu billetera',
  'send.clipboardEmpty':
    'El portapapeles está vacío. Toca de nuevo para ingresar una dirección.',
  'send.pasteFailed':
    'No se pudo pegar. Toca de nuevo para ingresar una dirección.',
  'send.invalidAddress':
    'Dirección BTC no válida. Revísala e inténtalo de nuevo.',
  'send.feesUnavailable':
    'Las comisiones de red no están disponibles en este momento. Revisa tu conexión e inténtalo de nuevo.',
  'send.prepareFailed': 'No se pudo preparar el pago',
  'send.statusText': 'Envío de {amount}',
  'send.sentLabel': 'Se envió {amount}',
  'send.sendingLabel': 'Enviando {amount}',
  'send.submitFailed': 'No se pudo enviar este pago.',
  'send.paymentTitle': 'Pago',
  'review.title': 'Revisar',
  'review.customizeFees': 'Personalizar comisiones',
  'review.to': 'Para',
  'review.amount': 'Monto',
  'review.total': 'Total',
  'review.feeRate': 'Tasa de comisión',
  'fee.minimum': 'La comisión mínima es de {rate} sat/vB',
  'fee.maximum': 'La comisión máxima es de {rate} sat/vB',
  'fee.rateLabel': 'Tasa de comisión de red',
  'fee.rateInputLabel': 'Tasa de comisión en satoshis por byte virtual',
  'fee.calculating': 'Calculando…',
  'fee.rbf': 'Aceleración (RBF)',
  'fee.rbfLabel': 'Reemplazo por comisión (RBF)',
  'fee.enabled': 'Activada',
  'fee.disabled': 'Desactivada',
  'slide.label': 'Desliza para confirmar',
  'slide.handleLabel': 'Arrastra el control hacia la derecha para confirmar',
  'send.showAddress': 'Mostrar la dirección de Bitcoin completa',
  'manageWallets.title': 'Administrar billeteras',
  'addWallet.title': 'Agregar billetera',
  'addWallet.createTitle': 'Crear billetera',
  'addWallet.createDescription': 'Crea una billetera nueva con frase semilla',
  'addWallet.icloudTitle': 'Respaldo en iCloud',
  'walletSettings.name': 'Nombre de la billetera',
  'walletIcon.title': 'Ícono de la billetera',
  'walletIcon.change': 'Cambiar el ícono de la billetera',
  'walletIcon.initials': 'Iniciales',
  'walletIcon.wallet': 'Billetera',
  'walletIcon.multi_chain': 'Multicadena',
  'walletIcon.diamond': 'Diamante',
  'walletIcon.speed': 'Velocidad',
  'walletIcon.bitcoin': 'Bitcoin',
  'walletIcon.tron': 'Tron',
  'walletIcon.heart': 'Corazón',
  'walletIcon.dollar': 'Dólar',
  'walletIcon.card': 'Tarjeta',
  'walletIcon.flame': 'Fuego',
  'walletIcon.leaderboard': 'Clasificación',
  'walletIcon.savings': 'Ahorros',
  'walletIcon.key': 'Llave',
  'walletIcon.growth': 'Crecimiento',
  'walletIcon.gift': 'Regalo',
  'walletIcon.star': 'Estrella',
  'walletColor.label': 'Color de la billetera: {color}',
  'walletColor.gold': 'Dorado',
  'walletColor.indigo': 'Índigo',
  'walletColor.red': 'Rojo',
  'walletColor.orange': 'Naranja',
  'walletColor.sand': 'Arena',
  'walletColor.neon': 'Neón',
  'walletColor.green': 'Verde',
  'walletColor.ocean': 'Océano',
  'walletColor.lavender': 'Lavanda',
  'walletColor.fuchsia': 'Fucsia',
  'walletColor.grey': 'Gris',
  'manageWallets.settingsFor': 'Configuración de la billetera {name}',
  'walletSettings.title': 'Configuración de billetera',
  'walletSettings.unavailableFeature':
    'Esta función no está disponible en esta versión.',
  'walletSettings.nameRow': 'Nombre',
  'walletSettings.backup': 'Respaldo',
  'walletSettings.addresses': 'Direcciones',
  'walletSettings.signVerify': 'Firmar/verificar mensaje',
  'walletSettings.backupWarning':
    'Respalda siempre tu billetera para no perder el acceso si pierdes o restableces tu dispositivo.',
  'walletSettings.remove': 'Eliminar billetera',
  'backup.secretKey': 'Clave Secreta',
  'backup.methodsTitle': 'Métodos de respaldo',
  'backup.protectTitle': 'Protege tu billetera',
  'backup.protectSubtitle':
    'Protege el respaldo de tu billetera en iCloud con una llave de acceso, usando Face ID o Touch ID.',
  'backup.secure': 'Proteger',

  'backup.creating': 'Creando respaldo',
  'backup.created': 'Respaldo creado',
  'backup.icloudTitle': 'Respaldo en iCloud',
  'backup.icloudSubtitle':
    'Protege tu billetera con tus llaves de acceso de iCloud y restáurala con Face ID o Touch ID.',
  'backup.localWallet': 'Billetera local',
  'backup.cloudDisabled':
    'El respaldo en la nube está desactivado. Usa la Clave Secreta para respaldar manualmente tus datos de recuperación.',
  'backup.secretKeySubtitle':
    'Obtén tus datos de recuperación para restaurar tu billetera manualmente.',
  'backup.revealTitle': 'Anota tu respaldo',
  'backup.revealWords':
    'Anota estas palabras en orden y guárdalas en un lugar seguro y sin conexión.',
  'backup.revealKey':
    'Anótala exactamente como se muestra y guárdala en un lugar seguro y sin conexión.',
  'backup.coverTitle': 'Revelar tu Clave Secreta',
  'backup.check.writeDown': 'Anótala. Nada digital.',
  'backup.check.private': 'Que nadie vea tu pantalla.',
  'backup.check.protect': 'Protege tu Clave Secreta.',
  'backup.check.neverShare': 'Nunca la compartas.',
  'backup.check.dontLose': 'No la pierdas.',
  'backup.hold': 'Mantén presionado para ver',
  'backup.holdHint':
    'Sigue presionando para ver tu Clave Secreta. Suelta para ocultarla.',
  'remove.removedTitle': 'Billetera eliminada',
  'remove.confirmTitle': '¿Eliminar de este dispositivo?',
  'remove.removedOthers':
    'Tus otras billeteras siguen disponibles en este dispositivo.',
  'remove.removedLast':
    'Ahora puedes crear una billetera nueva o importar una.',
  'remove.confirmMessage':
    'Se borrarán las claves y los datos locales de la billetera. Puedes volver a importarla con sus datos de recuperación.',
  'remove.message':
    '“{name}” se eliminará de este dispositivo.\n\nGuarda sus datos de recuperación por si necesitas volver a importarla.',
  'remove.failed': 'No se pudo eliminar la billetera',
  'remove.confirm': 'Eliminar',
  'addresses.copyPrivateKey': 'Copiar clave privada',
  'addresses.receive': 'Recepción',
  'addresses.change': 'Cambio',
  'recovery.notProtected': 'Sin protección',
  'activity.unknownBroadcast': 'Estado de transmisión desconocido',
  'activity.checkPayment': 'Revisar pago',
  'activity.checkPaymentMessage':
    'Actualiza primero o vuelve a enviar exactamente la misma transacción firmada.',
  'activity.refresh': 'Actualizar',
  'activity.connection': 'Conexión',
  'activity.resubmit': 'Reenviar',
  'activity.submitted': 'Transacción enviada',
  'activity.broadcast': 'Transmisión',
  'activity.empty': 'Tu actividad aparecerá aquí',
  'activity.syncing': 'Sincronizando transacciones…',
  'activity.cancelledTitle': 'Pago cancelado',
  'activity.cancelledMessage':
    'Se envió a la red un reemplazo que devuelve el Bitcoin a esta billetera. Aparecerá en Actividad en cuanto se detecte.',
  'time.seconds': 'unos segundos',
  'time.minute': 'un minuto',
  'time.minutes': { one: '{count} minuto', other: '{count} minutos' },
  'time.hour': 'una hora',
  'time.hours': { one: '{count} hora', other: '{count} horas' },
  'time.day': 'un día',
  'time.days': { one: '{count} día', other: '{count} días' },
  'time.month': 'un mes',
  'time.months': { one: '{count} mes', other: '{count} meses' },
  'time.year': 'un año',
  'time.years': { one: '{count} año', other: '{count} años' },
  'time.ago': 'hace {time}',
  'time.in': 'en {time}',
  'activity.pending': 'Pendiente',
  'activity.dateUnavailable': 'Fecha no disponible',
  'activity.today': 'Hoy',
  'activity.yesterday': 'Ayer',
  'activity.received': 'Recibido',
  'activity.selfTransfer': 'Transferencia interna',
  'activity.sent': 'Enviado',
  'activity.rowHintConverted':
    'Monto convertido al precio actual de Bitcoin. Abre los detalles de la transacción.',
  'activity.rowHint': 'Abre los detalles de la transacción.',
  'activity.timeUnavailable': 'Hora no disponible',
  'activity.selfFee': 'Comisión · {amount}',
  'pending.title': 'Transacción pendiente',
  'pending.lowFee':
    'Es posible que esta transacción tarde en completarse debido a su comisión baja',
  'pending.message':
    'Este pago aún no está confirmado. Hasta que se confirme, puedes acelerarlo o cancelarlo.',
  'pending.speedUp': 'Acelerar',
  'pending.cancel': 'Cancelar',
  'note.title': 'Nota personal',
  'error.somethingWrong': 'Algo salió mal',
  'transaction.walletLabel': 'Billetera de la transacción: {name}',
  'transaction.receiving': 'Recibiendo',
  'transaction.sending': 'Enviando',
  'transaction.unavailable': 'No disponible',
  'transaction.selfNote': 'Transferido dentro de tu billetera',
  'transaction.from': 'De',
  'transaction.status': 'Estado',
  'transaction.complete': 'Completada',
  'transaction.date': 'Fecha',
  'transaction.receivedFrom': 'Recibido de',
  'transaction.receivingFrom': 'Recibiendo de',
  'transaction.sentTo': 'Enviado a',
  'transaction.sendingTo': 'Enviando a',
  'transaction.sentFrom': 'Enviado desde',
  'transaction.sendingFrom': 'Enviando desde',
  'transaction.id': 'ID de transacción',
  'transaction.depositedTo': 'Depositado en',
  'transaction.depositingTo': 'Depositando en',
  'transaction.fee': 'Comisión',
  'transaction.now': 'Valor actual',
  'addresses.used': 'Usada',
  'addresses.menuCopy': 'Copiar dirección',
  'addresses.menuCopyWif': 'Copiar clave privada (WIF)',
  'addresses.rowLabel': 'Dirección {index}, {address}',
  'addresses.rowHint': 'Abre las opciones de la dirección.',
  'addresses.transactions': 'Transacciones: {count}',
  'transaction.title': 'Transacción',
  'transaction.explorerHint':
    'Abre el explorador de bloques. Mantén presionado para copiar.',
  'transaction.holdToCopy': 'Mantén presionado para copiar.',
  'note.editHint': 'Edita la nota personal.',
  'note.add': 'Agregar nota',
  'transaction.feeLabel': 'Comisión: {amount}',
  'transaction.feeHint':
    'Cambia la moneda de la comisión. Mantén presionado para copiar.',
  'transaction.copied': '¡Copiado!',
  'transaction.addressCount': {
    one: '{count} dirección',
    other: '{count} direcciones',
  },
  'transaction.recipientHint':
    'Toca para mostrar la dirección completa. Mantén presionado para copiar.',
  'replace.cancel.title': '¿Cancelar el pago?',
  'replace.cancel.body':
    'El pago se reemplaza por otro que devuelve su Bitcoin a esta billetera, menos la comisión de red. Si el original se confirma primero, no se cancela nada.',
  'replace.cancel.action': 'Cancelar pago',
  'replace.cancel.failed': 'No se pudo cancelar el pago.',
  'replace.unavailable': 'No se puede reemplazar este pago',
  'replace.newFee': 'Nueva comisión',
  'replace.additionalFee': 'Comisión adicional',
  'replace.returns': 'Vuelve a tu billetera',
  'replace.submitting': 'Enviando…',
  'settings.row.touchId': 'Bloqueo con Touch ID',
  'settings.row.biometricLock': 'Bloqueo biométrico',
  'settings.faceIdNeedsPasscode': 'Primero configura un código.',
  'settings.faceIdAllowTitle': 'Permitir Face ID',
  'settings.faceIdAllowMessage':
    'Ve a Configuración > Bithold > Face ID para permitir que Bithold use Face ID.',
  'settings.passcodeRemoveTitle': '¿Eliminar el código?',
  'settings.passcodeRemoveMessage':
    'Si desactivas tu código, tu billetera quedará sin protección y tus fondos podrían verse expuestos.',
  'settings.passcodeRemoveConfirm': 'Eliminar código',
  'passcode.enableTitle': 'Activar bloqueo con código',
  'passcode.enableBody1':
    'Bithold te pedirá tu código al abrirse, al volver a primer plano y antes de mostrar tu Clave Secreta o una clave privada.',
  'passcode.enableBody2':
    'Si lo olvidas, la única forma de volver a entrar es borrar las billeteras de este dispositivo e importarlas de nuevo con tu Clave Secreta.',
  'passcode.enterNew': 'Ingresa el código que usarás para desbloquear Bithold.',
  'passcode.enterCurrent': 'Ingresa tu código.',
  'passcode.field': 'Código',
  'passcode.confirmField': 'Confirmar código',
  'passcode.mismatch': 'Los códigos no coinciden. Inténtalo de nuevo.',
  'lock.enterPasscode': 'Ingresa el código',
  'lock.unlock': 'Desbloquear',
  'lock.wrongPasscode': 'Código incorrecto.',
  'lock.lockedOut': 'Demasiados intentos fallidos. Espera un momento.',
  'lock.retryIn': 'Inténtalo de nuevo en {time}. Mantén esta pantalla abierta.',
  'lock.useFaceId': 'Usar Face ID',
  'lock.useTouchId': 'Usar Touch ID',
  'lock.forgot': '¿Olvidaste tu código?',
  'lock.forgotTitle': '¿Olvidaste tu código?',
  'lock.forgotMessage':
    'La única forma de recuperar el acceso es borrar las billeteras de este dispositivo e importarlas de nuevo con tu Clave Secreta.',
  'lock.eraseAndRestore': 'Borrar y restaurar',
  'lock.passcodeRequired': 'Se requiere el código',
  'lock.enrolmentChanged':
    'La configuración de Face ID de tu dispositivo cambió desde la última vez que abriste Bithold. Ingresa tu código para continuar. Puedes volver a activar el bloqueo con Face ID en Configuración.',
  'lock.faceIdReason': 'Desbloquear Bithold',
  'lock.invalidPasscode': 'Ingresa un código de 6 dígitos.',
  'lock.noPasscode': 'No hay ningún código configurado.',
  'walletName.title': 'Tu nombre preferido',
  'walletName.introduction': 'Queremos conocerte.',
  'walletName.reassurance': 'Puedes cambiarlo cuando quieras.',
  'walletName.placeholder': 'Tu nombre preferido…',
  'walletName.pickEmoji': 'Elegir emoji',
  'walletName.changeEmoji': 'Cambiar emoji',
  'walletName.resetAvatar': 'Usar un avatar basado en el nombre',
  'walletName.yourAvatar': 'Tu avatar',
  'walletName.changeAvatar': 'Cambiar avatar',
  'walletName.pickPhoto': 'Elegir foto',
  'walletName.takePhoto': 'Tomar foto',
  'walletName.removePhoto': 'Eliminar foto',
  'walletName.cameraDenied':
    'Permite el acceso a la cámara en Configuración para tomar una foto de la billetera.',
  'walletName.cameraUnavailable':
    'La cámara no está disponible en este dispositivo.',
  'walletName.photoFailed': 'No se pudo cargar la foto. Inténtalo de nuevo.',
};
