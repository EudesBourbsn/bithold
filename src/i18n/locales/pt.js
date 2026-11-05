// Brazilian Portuguese, translated from en.js. Same keys; plural values use this
// language's CLDR categories (one = 0 and 1, other).
export default {
  'import.recoveryTitle': 'Frase de recuperação',
  'import.tapToEnter': 'Toque para digitar ou colar sua frase de recuperação…',
  'import.validPhrase': 'Frase de recuperação válida',
  'import.invalidChecksum':
    'Frase de recuperação inválida — soma de verificação incorreta',
  'walletSettings.type': 'Tipo',
  'walletSettings.transactionCount': 'Transações',
  'walletSettings.notSynced': 'Não sincronizado',
  'walletSettings.watchOnly': 'Carteira somente leitura',
  'walletSettings.publicKey': 'Mostrar XPUB da carteira',
  'walletSettings.publicKeyTitle': 'XPUB da carteira',
  'walletSettings.copyPublicKey': 'Copiar chave pública',
  'messageSigning.help':
    'Crie ou verifique uma mensagem assinada usando um endereço Bitcoin.',
  'messageSigning.address': 'Endereço Bitcoin',
  'messageSigning.message': 'Mensagem',
  'messageSigning.signature': 'Assinatura',
  'messageSigning.sign': 'Assinar',
  'messageSigning.verify': 'Verificar',
  'messageSigning.valid':
    'Assinatura verificada. A mensagem corresponde ao endereço.',
  'messageSigning.invalid':
    'A verificação falhou. Confira o endereço, a mensagem e a assinatura.',
  'messageSigning.signed':
    'Mensagem assinada. Você pode copiar ou compartilhar a assinatura.',
  'messageSigning.invalidAddress':
    'Digite um endereço Bitcoin válido para esta rede.',
  'messageSigning.invalidMessage':
    'Digite uma mensagem de até 10.000 caracteres.',
  'messageSigning.unsupported':
    'A assinatura de mensagens aceita endereços Legacy, SegWit aninhado e SegWit nativo de chave única. Taproot e scripts de múltiplas assinaturas não são aceitos.',
  'messageSigning.watchOnly':
    'Esta carteira é somente leitura. Você pode verificar assinaturas, mas não assinar mensagens.',
  'messageSigning.notOwned':
    'Para assinar, use o endereço selecionado desta carteira. Você pode verificar assinaturas de outros endereços.',
  'messageSigning.unavailable':
    'A chave privada deste endereço não está disponível.',
  'messageSigning.failed':
    'Não foi possível assinar a mensagem. Tente novamente.',
  'messageSigning.shareFailed':
    'Não foi possível abrir o compartilhamento. Tente novamente.',
  'recovery.protected': 'Protegida',
  'cloud.protectedTitle': 'Você está protegido',
  'cloud.protectedDescription':
    'Sua carteira está protegida com uma chave-senha.',
  'cloud.title': 'Backup de recuperação no iCloud',
  'cloud.consent':
    'Os dados de recuperação desta carteira serão criptografados com uma chave-senha e salvos no seu armazenamento privado do iCloud. Para restaurar, você precisará desta conta do iCloud e da mesma chave-senha. Guarde também o backup da sua Chave Secreta. O backup inclui as chaves de recuperação e os ajustes da carteira, mas não as notas das transações nem os pagamentos pendentes.',
  'cloud.saved': 'Backup verificado',
  'cloud.savedDescription':
    'Seu backup criptografado foi salvo, baixado e descriptografado com sucesso. Guarde a chave-senha e o backup da sua Chave Secreta. A restauração em outro dispositivo ainda não foi testada.',
  'cloud.subtitle':
    'Criptografado com uma chave-senha. Requer o iCloud e o iOS 18 ou posterior.',
  'cloud.verifiedSubtitle':
    'Um backup de recuperação foi verificado em {date}. Toque para salvar uma nova cópia.',
  'cloud.empty':
    'Nenhum backup de recuperação foi encontrado nesta conta do iCloud.',
  'cloud.restoreTitle': 'Restaurar esta carteira?',
  'cloud.restorePreview':
    'Carteira: {name}\nRede: {network}\n\nA carteira recuperada será adicionada. As carteiras existentes não serão alteradas.',
  'cloud.restoredDescription':
    'As chaves de recuperação foram restauradas. O saldo e as transações serão atualizados a partir da rede.',
  'cloud.unsupported':
    'Os backups com chave-senha exigem um iPhone ou iPad com o iOS 18 ou posterior e a versão atualizada do Bithold.',
  'cloud.prfUnsupported':
    'Este provedor de chaves-senha não é compatível com a criptografia de backups. Nenhum backup verificado foi criado. Guarde o backup da sua Chave Secreta.',
  'cloud.accountUnavailable':
    'Inicie sessão no iCloud nos Ajustes do dispositivo e tente novamente.',
  'cloud.accountChanged':
    'A conta do iCloud mudou durante esta operação. Tente novamente com a conta correta.',
  'cloud.quotaExceeded':
    'Seu armazenamento do iCloud está cheio. Libere espaço e tente novamente.',
  'cloud.network':
    'Não foi possível conectar ao iCloud. Verifique sua conexão e tente novamente.',
  'cloud.invalidPayload':
    'Não foi possível verificar se este backup é de uma carteira compatível do Bithold. Nada foi importado.',
  'cloud.duplicate':
    'Esta carteira já está no app e não foi adicionada novamente.',
  'cloud.interrupted':
    'A operação foi interrompida. Desbloqueie o app e tente novamente.',
  'cloud.watchOnly':
    'Uma carteira somente leitura não tem chaves de recuperação privadas para fazer backup.',
  'cloud.busy': 'Já há uma operação de backup em andamento.',
  'cloud.failed':
    'Não foi possível concluir ou verificar a operação. Confira o iCloud e a chave-senha e tente novamente. Guarde o backup da sua Chave Secreta.',
  'cloudRestore.pickerHeader': 'Restaurar carteira',
  'cloudRestore.pickerTitle': 'Restaurar do backup',
  'cloudRestore.pickerSubtitle': 'Selecione um backup para restaurar',
  'cloudRestore.backupName': '#{index} Backup com chave-senha',
  'cloudRestore.active': 'Ativo',
  'cloudRestore.pastBackups': 'Backups anteriores',
  'cloudRestore.restoring': 'Restaurando carteira...',
  'cloudRestore.restoringSubtitle': 'Só um momento',
  'cloudRestore.success': 'Restauração concluída!',
  'cloudRestore.activeTitle': 'Backup ativo',
  'cloudRestore.emptyTitle': 'Nenhum backup encontrado',
  'cloudRestore.accessTitle': 'Permitir acesso ao\niCloud',
  'cloudRestore.passkeysTitle': 'Ativar chaves-senha',
  'cloudRestore.errorTitle': 'Algo deu errado',
  'cloudRestore.prfUnsupported':
    'Este provedor de chaves-senha não consegue desbloquear os backups do iCloud. Use chaves-senha salvas nas Chaves do iCloud ou restaure a carteira com sua Chave Secreta.',
  'common.back': 'Voltar',
  'common.cancel': 'Cancelar',
  'common.continue': 'Continuar',
  'common.done': 'OK',
  'common.edit': 'Editar',
  'common.loading': 'Carregando',
  'settings.title': 'Ajustes',
  'settings.row.currency': 'Moeda',
  'settings.row.unit': 'Unidade de exibição',
  'settings.unit.fixedPrecision': 'Sempre mostrar 8 casas decimais',
  'settings.row.language': 'Idioma',
  'settings.row.blockExplorer': 'Explorador de blocos',
  'settings.explorer.custom': 'Personalizado',
  'settings.explorer.customSubtitle': 'Use seu próprio explorador',
  'settings.explorer.urlPlaceholder': 'URL do explorador',
  'settings.explorer.invalidUrl':
    'Insira uma URL que comece com https:// ou http://.',
  'settings.notificationsDenied':
    'Permita as notificações do Bithold nos Ajustes do iPhone.',
  'settings.notificationsOpenSettings': 'Abrir Ajustes',
  'settings.notificationsFailed':
    'Não foi possível atualizar a permissão de notificações. Tente novamente.',
  'settings.row.notifications': 'Notificações',
  'settings.row.sounds': 'Sons',
  'settings.row.haptic': 'Resposta tátil',
  'settings.row.animation': 'Animação do portfólio',
  'settings.row.passcode': 'Bloqueio por código',
  'settings.row.faceId': 'Bloqueio por Face ID',
  'settings.row.reset': 'Redefinir aplicativo',
  'settings.currencyFailed': 'Não foi possível alterar a moeda',
  'settings.resetMessage':
    'Remover todas as carteiras e chaves locais deste dispositivo? Verifique se você fez backup dos dados de recuperação delas.',
  'settings.resetTitle': 'Tem certeza?',
  'settings.resetWarning': 'Esta ação não pode ser desfeita.',
  'settings.resetConfirm': 'Redefinir aplicativo',
  'settings.setCurrency': 'Definir moeda',
  'settings.searchCurrencies': 'Buscar moedas',
  'settings.closeSearch': 'Fechar busca',
  'settings.noCurrencies': 'Nenhuma moeda encontrada',
  'settings.noCurrenciesHint': 'Tente o nome ou o código de uma moeda.',
  'settings.selectLanguage': 'Selecionar idioma',
  'restore.icloudTitle': 'Restaurar com seu Backup do iCloud',
  'restore.icloudSubtitle':
    'Restaure sua conta usando suas chaves-senha do iCloud.',
  'restore.secretKeyTitle': 'Chave Secreta (avançada)',
  'restore.secretKeySubtitle':
    'Restaure sua conta usando sua Chave Secreta de 12 palavras.',
  'restore.qrTitle': 'Código QR',
  'restore.qrSubtitle': 'Sincronize com o Bithold em outro dispositivo.',
  'electrum.chooseServer': 'Escolha um servidor.',
  'currency.AED': 'Dirham dos Emirados Árabes Unidos',
  'currency.AMD': 'Dram armênio',
  'currency.ANG': 'Florim das Antilhas Holandesas',
  'currency.ARS': 'Peso argentino',
  'currency.AUD': 'Dólar australiano',
  'currency.AWG': 'Florim arubano',
  'currency.BDT': 'Taka bengali',
  'currency.BHD': 'Dinar bareinita',
  'currency.BOB': 'Boliviano da Bolívia',
  'currency.BRL': 'Real brasileiro',
  'currency.CAD': 'Dólar canadense',
  'currency.CHF': 'Franco suíço',
  'currency.CLP': 'Peso chileno',
  'currency.CNY': 'Yuan chinês',
  'currency.COP': 'Peso colombiano',
  'currency.CZK': 'Coroa tcheca',
  'currency.DKK': 'Coroa dinamarquesa',
  'currency.DOP': 'Peso dominicano',
  'currency.DZD': 'Dinar argelino',
  'currency.EGP': 'Libra egípcia',
  'currency.ETB': 'Birr etíope',
  'currency.EUR': 'Euro',
  'currency.GBP': 'Libra esterlina',
  'currency.GHS': 'Cedi ganês',
  'currency.GTQ': 'Quetzal guatemalteco',
  'currency.HKD': 'Dólar de Hong Kong',
  'currency.HUF': 'Florim húngaro',
  'currency.IDR': 'Rupia indonésia',
  'currency.ILS': 'Novo shekel israelense',
  'currency.INR': 'Rupia indiana',
  'currency.IRR': 'Rial iraniano',
  'currency.IRT': 'Toman iraniano',
  'currency.ISK': 'Coroa islandesa',
  'currency.JPY': 'Iene japonês',
  'currency.KES': 'Xelim queniano',
  'currency.KRW': 'Won sul-coreano',
  'currency.KWD': 'Dinar kuwaitiano',
  'currency.KZT': 'Tenge cazaque',
  'currency.LBP': 'Libra libanesa',
  'currency.LKR': 'Rupia cingalesa',
  'currency.MAD': 'Dirham marroquino',
  'currency.MXN': 'Peso mexicano',
  'currency.MYR': 'Ringgit malaio',
  'currency.MZN': 'Metical moçambicano',
  'currency.NGN': 'Naira nigeriana',
  'currency.NOK': 'Coroa norueguesa',
  'currency.NZD': 'Dólar neozelandês',
  'currency.OMR': 'Rial omanense',
  'currency.PEN': 'Sol peruano',
  'currency.PHP': 'Peso filipino',
  'currency.PKR': 'Rupia paquistanesa',
  'currency.PLN': 'Zloty polonês',
  'currency.PYG': 'Guarani paraguaio',
  'currency.QAR': 'Rial catariano',
  'currency.RON': 'Leu romeno',
  'currency.RSD': 'Dinar sérvio',
  'currency.RUB': 'Rublo russo',
  'currency.SAR': 'Riyal saudita',
  'currency.SEK': 'Coroa sueca',
  'currency.SGD': 'Dólar singapuriano',
  'currency.THB': 'Baht tailandês',
  'currency.TRY': 'Lira turca',
  'currency.TWD': 'Novo dólar taiwanês',
  'currency.TZS': 'Xelim tanzaniano',
  'currency.UAH': 'Hryvnia ucraniano',
  'currency.UGX': 'Xelim ugandense',
  'currency.USD': 'Dólar americano',
  'currency.UYU': 'Peso uruguaio',
  'currency.UZS': 'Som uzbeque',
  'currency.VES': 'Bolívar venezuelano',
  'currency.VND': 'Dong vietnamita',
  'currency.XAF': 'Franco CFA de BEAC',
  'currency.XOF': 'Franco CFA de BCEAO',
  'currency.ZAR': 'Rand sul-africano',
  'common.copyAddress': 'Copiar endereço',
  'bubble.dismissAddress': 'Fechar endereço',
  'brand.logo': 'Logotipo do Bithold',
  'sheet.dismiss': 'Fechar painel',
  'sheet.background': 'Fundo do painel',
  'wallet.alertTitle': 'Carteira',
  'error.operationFailed': 'Não foi possível concluir a operação.',
  'common.next': 'Próximo',
  'common.ok': 'OK',
  'import.title': 'Insira a frase de recuperação, a chave ou o descritor',
  'common.confirm': 'Confirmar',
  'import.loading': 'Importando sua carteira…',
  'import.failed': 'Não foi possível importar a carteira',
  'import.inputAlertTitle': 'Não foi possível inserir o texto',
  'import.inputLimit': 'O texto excede o limite de 16.384 caracteres.',
  'import.fieldUnavailable': 'O campo de importação não está mais disponível.',
  'import.fieldInactive': 'O campo de importação não está mais ativo.',
  'import.composing': 'Conclua a digitação da palavra atual antes de importar.',
  'import.description':
    'Se usar uma frase de recuperação para importar a carteira, separe cada palavra com um espaço.',
  'import.inputLabel': 'Frase de recuperação, chave ou descritor',
  'import.inputHint':
    'Insira sua frase de recuperação, chave privada ou descritor.',
  'import.pasteEmpty':
    'Copie sua frase de recuperação ou chave privada e toque em Colar.',
  'import.clear': 'Limpar',
  'import.scan': 'Escanear',
  'import.paste': 'Colar',
  'import.passphrase': 'Passphrase BIP39',
  'import.passphrasePrompt':
    'Insira a passphrase BIP39, se você tiver usado uma',
  'import.options': 'Opções de importação',
  'onboarding.welcome.setupOptions':
    'Configure o Bithold usando uma das opções a seguir.',
  'onboarding.welcome.selfCustody':
    'Autocustódia significa\nque seus fundos estão\nsempre sob seu controle',
  'onboarding.welcome.recoveryPhrase': 'Criar frase de recuperação',
  'onboarding.welcome.recoveryDescription':
    'Uma nova carteira Bitcoin com 12 palavras para restaurá-la',
  'onboarding.welcome.importDescription':
    'Frase semente, chave privada ou backup\u00A0do\u00A0iCloud',
  'onboarding.welcome.email': 'Continuar com e-mail',
  'onboarding.welcome.emailDescription': 'Entre ou crie uma conta Wallet',
  'onboarding.welcome.import': 'Importar',
  'onboarding.welcome.apple': 'Entrar com a Apple',
  'onboarding.welcome.google': 'Entrar com o Google',
  'onboarding.welcome.termsIntro':
    'Ao usar o Bithold, você concorda com nossos',
  'onboarding.welcome.termsOfService': 'Termos de Serviço',
  'onboarding.welcome.termsAnd': 'e nossa',
  'onboarding.welcome.privacyPolicy': 'Política de Privacidade',
  'onboarding.or': 'OU',
  'onboarding.welcomeTitle':
    'Bem-vindo à sua nova carteira de ativos digitais!',
  'onboarding.getStarted': 'Começar',
  'onboarding.restoreWallet': 'Restaurar a carteira',
  'onboarding.title':
    'Proteja, gerencie e\nguarde seu Bitcoin,\ntudo em um só lugar',
  'onboarding.create': 'Criar nova carteira',
  'onboarding.creating': 'Criando sua carteira…',
  'onboarding.createFailed': 'Não foi possível criar a carteira',
  'onboarding.import': 'Importar carteira',
  'onboarding.terms':
    'Ao continuar, você concorda com os {terms} e a {privacy}',
  'onboarding.termsOfService': 'Termos de Serviço',
  'onboarding.privacyPolicy': 'Política de Privacidade',
  'onboarding.noCloudBackup':
    'O Bithold ainda não faz backup de carteiras na nuvem, então não há backup na nuvem para importar.',
  'importWith.title': 'Importar com',
  'importWith.phraseTitle': 'Frase semente ou chave privada',
  'importWith.phraseDescription':
    'Use uma frase semente de 12, 18 ou 24 palavras, ou uma chave privada',
  'importWith.cloudTitle': 'Backup na nuvem',
  'importWith.cloudDescription':
    'Importe sua carteira rapidamente a partir do backup na nuvem',
  'common.save': 'Salvar',
  'import.passphraseEnabled': 'Passphrase BIP39 ativada',
  'import.usePassphrase': 'Usar passphrase BIP39',
  'import.addressType': 'Tipo de endereço: {type}',
  'import.addressTypesAutomatic': 'Tipos de endereço: automático',
  'import.defaultDerivationPath': 'Caminho de derivação padrão',
  'import.bip39Passphrase': 'Passphrase BIP39',
  'import.bip39PassphraseMessage':
    'Use exatamente a passphrase BIP39 associada a esta carteira. Por padrão, a passphrase fica vazia.',
  'import.addressTypeTitle': 'Tipo de endereço',
  'import.derivationPath': 'Caminho de derivação',
  'import.pasteFailed': 'Não foi possível colar',
  'import.pasteAccess': 'Permita colar quando o iOS solicitar.',
  'import.nothingToPaste': 'Nada para colar',
  'import.editWord': 'Editar palavra',
  'scanner.title': 'Escaneie para enviar',
  'scanner.denied':
    'Permita o acesso à câmera em Ajustes para escanear códigos QR.',
  'scanner.unavailable':
    'Câmera indisponível. Em vez disso, insira ou cole o endereço.',
  'scanner.openSettings': 'Abrir Ajustes',
  'scanner.invalid': 'Este código QR não contém um endereço Bitcoin válido.',
  'balance.resetFailed': 'Não foi possível redefinir',
  'balance.refreshFailed': 'Não foi possível atualizar',
  'activity.title': 'Atividade',
  'balance.hiddenLabel': 'Saldo oculto. Mantenha pressionado para mostrar.',
  'balance.shownLabel': 'Saldo da carteira. Mantenha pressionado para ocultar.',
  'balance.walletSelector': 'Seletor de carteira',
  'wallet.defaultName': 'Carteira {number}',
  'balance.receive': 'Receber',
  'balance.send': 'Enviar',
  'chart.noData': 'Sem dados disponíveis. Tente novamente.',
  'chart.bitcoinPrice': 'Preço do Bitcoin',
  'chart.today': '{change} hoje',
  'balance.pullToRefresh': 'Puxe para atualizar',
  'balance.releaseToRefresh': 'Solte para atualizar',
  'balance.updating': 'Atualizando…',
  'common.copied': 'Copiado',
  'common.copiedBubble': 'Copiado.',
  'error.tryAgain': 'Tente novamente.',
  'addressType.descriptor': 'Script personalizado',
  'receive.addressLabel': 'Seu endereço BTC',
  'receive.addressLabelTaproot': 'Seu endereço BTC Taproot',
  'receive.addressLabelLegacy': 'Seu endereço BTC Legacy',
  'receive.title': 'Receber Bitcoin',
  'receive.pathTitle': 'Caminho de recebimento',
  'receive.qrCopy': 'Copiar',
  'receive.qrShare': 'Compartilhar…',
  'receive.addressFailed': 'Não foi possível obter o endereço',
  'receive.newAddress': 'Novo endereço',
  'receive.newAddressHint':
    'Mostra um novo endereço de recebimento neste caminho',
  'receive.copyFailed': 'Não foi possível copiar',
  'receive.shareFailed': 'Não foi possível compartilhar',
  'receive.typeLabel': 'Tipo de endereço de recebimento',
  'receive.typeHint': 'Abre os tipos de endereço de recebimento disponíveis',
  'receive.qrLabel':
    'Código QR do Bithold. Toque e mantenha pressionado para copiar ou compartilhar.',
  'receive.choosePath': 'Escolher caminho de recebimento',
  'receive.choosePathAddress': 'Escolher caminho de recebimento. {address}',
  'receive.choosePathHint':
    'Abre os caminhos de recebimento disponíveis para esta carteira',
  'receive.pathFailed': 'Não foi possível selecionar o caminho de recebimento',
  'receive.path.wif': 'Chave privada única',
  'receive.path.address': 'Endereço importado',
  'receive.path.descriptor': 'Descritor importado',
  'auth.notCompleted': 'A autenticação não foi concluída',
  'native.storageRead':
    'Não foi possível ler os dados locais da carteira. Desbloqueie o dispositivo e tente novamente.',
  'native.storageSave': 'Não foi possível salvar os dados locais da carteira',
  'native.storageRemove':
    'Não foi possível remover os dados locais da carteira',
  'native.entropySize': 'Tamanho de entropia inválido',
  'native.randomness': 'Aleatoriedade segura indisponível',
  'native.invalidServer': 'Servidor inválido',
  'native.tlsFailed': 'Falha na conexão TLS',
  'native.tcpFailed': 'Falha na conexão TCP',
  'native.connectTimeout': 'A conexão expirou',
  'native.certificateChanged': 'Certificado alterado',
  'native.certificateUntrusted': 'Certificado não confiável',
  'native.overlappingRequest': 'Solicitação ao servidor inválida ou sobreposta',
  'native.timeout': 'A solicitação ao servidor expirou',
  'native.sendFailed': 'Não foi possível enviar a solicitação ao servidor',
  'native.responseTooLarge': 'Resposta do servidor grande demais',
  'native.invalidResponse': 'Resposta do servidor inválida',
  'native.unexpectedResponse': 'Resposta inesperada do servidor',
  'native.disconnected': 'Servidor desconectado',
  'native.connectionClosed': 'Conexão encerrada',
  'native.unavailable': 'Esta versão não inclui o mecanismo nativo da carteira',
  'send.amountTitle': 'Definir valor',
  'send.priceUnavailable': 'Preço indisponível',
  'send.priceUnavailableMessage':
    'Insira o valor em Bitcoin enquanto a cotação estiver indisponível.',
  'send.dustWarning': 'A rede Bitcoin não aceita envios de {amount} ou menos',
  'send.insufficientWarning': 'Deposite mais fundos ou insira um valor menor.',
  'send.amountInCurrency': 'Valor em {currency}',
  'send.amountInBitcoin': 'Valor em Bitcoin',
  'send.switchCurrency': 'Alternar entre Bitcoin e {currency}',
  'send.useAvailable': 'Usar saldo disponível',
  'send.available': 'Disponível',
  'send.networkFee': 'Taxa de rede',
  'error.keys.invalidAddressIndex': 'Índice de endereço inválido',
  'error.keys.addressBranchUnavailable': 'Ramo de endereços indisponível',
  'error.keys.descriptorMustProduceAddressableOutput':
    'O descritor deve gerar uma saída com endereço',
  'error.keys.witnessScriptsRequireCompressedPublic':
    'Scripts de testemunha exigem chaves públicas comprimidas',
  'error.keys.walletCannotSign': 'Esta carteira não pode assinar',
  'error.descriptor.invalidDescriptorCharacter':
    'Caractere inválido no descritor',
  'error.descriptor.invalidDescriptor': 'Descritor inválido',
  'error.descriptor.invalidDescriptorDerivation':
    'Derivação do descritor inválida',
  'error.descriptor.publicKeysCannotHaveDerivation':
    'Chaves públicas não podem ter caminhos de derivação',
  'error.descriptor.privateKeysCannotHaveDerivation':
    'Chaves privadas não podem ter caminhos de derivação',
  'error.descriptor.hardenedStepsMustPrecedeBranches':
    'Os níveis reforçados devem vir antes dos ramos',
  'error.descriptor.publicKeyCannotDeriveHardened':
    'Uma chave pública não pode derivar chaves filhas reforçadas',
  'error.descriptor.invalidDescriptorChecksum':
    'Soma de verificação do descritor inválida',
  'error.descriptor.descriptorNestingTooDeep':
    'Aninhamento do descritor profundo demais',
  'error.descriptor.unsupportedDescriptorNesting':
    'Aninhamento de descritor não compatível',
  'error.descriptor.invalidMultisigThreshold': 'Limiar multisig inválido',
  'error.descriptor.unsupportedDescriptorExpression':
    'Expressão de descritor não compatível',
  'error.descriptor.duplicateMultisigKeys': 'Chaves multisig duplicadas',
  'error.descriptor.descriptorRequiresCompressedXOnly':
    'Este descritor exige uma chave pública comprimida ou x-only',
  'error.keys.unsupportedBitcoinNetwork': 'Rede Bitcoin não compatível',
  'error.keys.invalidDerivationPath': 'Caminho de derivação inválido',
  'error.keys.derivationIndexTooLarge': 'O índice de derivação é grande demais',
  'error.keys.invalidExtendedKey': 'Chave estendida inválida',
  'error.keys.keyBelongsDifferentBitcoinNetwork':
    'A chave pertence a outra rede Bitcoin',
  'error.keys.invalidPrivateKeyNetwork': 'Chave privada ou rede inválida',
  'error.keys.unsupportedAddressType': 'Tipo de endereço não compatível',
  'error.keys.enterRecoveryPhraseKeyDescriptor':
    'Insira uma frase de recuperação, uma chave ou um descritor',
  'error.keys.invalidRecoveryPhraseCheckEvery':
    'Frase de recuperação inválida: verifique cada palavra, o número de palavras e a soma de verificação',
  'error.payment.missingSpendingOutput': 'Saída a ser gasta não encontrada',
  'error.payment.spendingOutputChanged': 'A saída a ser gasta mudou',
  'error.payment.unsupportedTaprootSpendPath':
    'Caminho de gasto Taproot não compatível',
  'error.payment.unsupportedInputScriptFeeEstimation':
    'Script de entrada não compatível com a estimativa de taxa',
  'error.payment.useMostThreeDecimalPlaces':
    'Use no máximo três casas decimais na taxa por vbyte',
  'error.payment.watchOnlyWalletCannotSign':
    'Esta carteira somente leitura não pode assinar pagamentos',
  'error.payment.refreshWalletBeforeSending':
    'Atualize a carteira antes de enviar',
  'error.payment.chooseFeeRate11000': 'Escolha uma taxa de 1 a 1000 sat/vB',
  'error.payment.invalidRbfPreference': 'Preferência de RBF inválida',
  'error.payment.enterLeast546Satoshis': 'Insira pelo menos 546 satoshis',
  'error.payment.insufficientBalanceAmountNetworkFee':
    'Saldo insuficiente para este valor e a taxa de rede',
  'error.payment.amountBelowBitcoinDustLimit':
    'Após as taxas, o valor fica abaixo do limite de poeira do Bitcoin',
  'error.payment.noSpendableBitcoinAvailable':
    'Não há Bitcoin disponível para gastar',
  'error.payment.duplicateSpendingOutput': 'Saída a ser gasta duplicada',
  'error.payment.walletSnapshotChangedRefreshFee':
    'O estado da carteira mudou. Atualize a prévia da taxa.',
  'error.payment.paymentAccountingMismatch':
    'Divergência na contabilização do pagamento',
  'error.payment.secureSigningRandomnessUnavailable':
    'Aleatoriedade segura para assinatura indisponível',
  'error.payment.transactionRbfSettingDoesNot':
    'A configuração de RBF da transação não corresponde à revisão aprovada',
  'error.payment.recoveryMaterialCannotSignInput':
    'Os dados de recuperação não podem assinar esta entrada',
  'error.payment.signedPaymentDoesNotMatch':
    'O pagamento assinado não corresponde à revisão aprovada',
  'error.payment.signedTransactionExceedsReviewedFee':
    'A transação assinada excede a estimativa de taxa revisada. Prepare-a novamente.',
  'error.payment.broadcastResultUncertainSignedPayment':
    'O resultado da transmissão é incerto. O pagamento assinado foi mantido; atualize para verificar o status.',
  'error.replacement.unknownReplacement': 'Substituição desconhecida',
  'error.replacement.refreshWalletBeforeReplacingPayment':
    'Atualize a carteira antes de substituir um pagamento',
  'error.replacement.paymentTooSmallCancelFee':
    'Este pagamento é pequeno demais para ser cancelado com esta taxa: não sobraria nada após a taxa de rede.',
  'error.replacement.notEnoughConfirmedBitcoinRaise':
    'Não há Bitcoin confirmado suficiente para aumentar a taxa deste pagamento. Em vez disso, você pode cancelá-lo.',
  'error.replacement.replacementAccountingMismatch':
    'Divergência na contabilização da substituição',
  'error.replacement.replacementFeeNotHigherThan':
    'A taxa de substituição não é maior que a original',
  'error.chart.invalidHistoricalPrice': 'Preço histórico inválido',
  'error.chart.historicalPricesAreStale':
    'Os preços históricos estão desatualizados',
  'error.chart.notEnoughHistoricalPrices': 'Preços históricos insuficientes',
  'error.chart.unsupportedChartRange': 'Período do gráfico não compatível',
  'error.chart.incorrectHistoryCurrency': 'Moeda do histórico incorreta',
  'error.chart.invalidHistoricalResponse': 'Resposta de histórico inválida',
  'error.chart.invalidHistoryDate': 'Data do histórico inválida',
  'error.chart.unknownHistorySource': 'Fonte do histórico desconhecida',
  'error.chart.unsupportedHistoryCurrency': 'Moeda do histórico não compatível',
  'error.electrum.incompleteElectrumResponse':
    'Resposta do Electrum incompleta',
  'error.electrum.duplicateElectrumResponse': 'Resposta do Electrum duplicada',
  'error.electrum.walletConnectionClosed': 'Conexão da carteira encerrada',
  'error.electrum.serverFailedBitcoinMainnetVerification':
    'O servidor não passou na verificação da Mainnet do Bitcoin',
  'error.electrum.connectionSuperseded': 'Conexão substituída',
  'error.electrum.unableConnectBitcoinServersCheck':
    'Não foi possível conectar aos servidores Bitcoin. Verifique sua conexão e atualize.',
  'error.electrum.invalidChainTip': 'Topo da cadeia inválido',
  'error.electrum.invalidSubscriptionStatus': 'Status de inscrição inválido',
  'error.electrum.addressHistoryChangedDuringSynchronization':
    'O histórico do endereço mudou durante a sincronização; atualize novamente',
  'error.electrum.invalidBlockHeader': 'Cabeçalho de bloco inválido',
  'error.fees.invalidFeeRecommendations': 'Recomendações de taxa inválidas',
  'error.fees.inconsistentFeeRecommendations':
    'Recomendações de taxa inconsistentes',
  'error.rates.incorrectRateBaseCurrency': 'Moeda base da cotação incorreta',
  'error.rates.invalidStaleRateTimestamp':
    'Data e hora da cotação inválidas ou desatualizadas',
  'error.rates.unknownRateProvider': 'Provedor de cotação desconhecido',
  'error.rates.invalidRateResponse': 'Resposta de cotação inválida',
  'error.rates.noSupportedPricesResponse':
    'Nenhum preço compatível na resposta',
  'error.rates.providerCoolingDownFailure':
    'O provedor está em pausa após uma falha',
  'error.rates.unsupportedCurrency': 'Moeda não compatível',
  'error.rates.krakenReturnedError': 'A Kraken retornou um erro',
  'error.rates.incorrectPriceCurrency': 'Moeda do preço incorreta',
  'error.rates.invalidConversionResponse': 'Resposta de conversão inválida',
  'error.rates.invalidBitcoinPrice': 'Preço do Bitcoin inválido',
  'error.accounts.walletStorageNotReady':
    'O armazenamento da carteira não está pronto',
  'error.accounts.invalidRecoveryMaterialImportOptions':
    'Dados de recuperação ou opções de importação inválidos. Verifique a soma de verificação, a rede e o caminho de derivação.',
  'error.accounts.walletAlreadyImported': 'Esta carteira já foi importada',
  'error.accounts.importWasInterruptedPleaseTry':
    'A importação foi interrompida. Tente novamente.',
  'error.accounts.enterWalletName180':
    'Insira um nome de carteira com 1–80 caracteres',
  'error.accounts.addressTypeUnavailable': 'Tipo de endereço indisponível',
  'error.accounts.walletNoLongerExists': 'A carteira não existe mais',
  'error.accounts.walletHasUnresolvedBroadcastCheck':
    'Esta carteira tem uma transmissão não resolvida. Verifique-a antes de remover a carteira.',
  'error.accounts.invalidTransaction': 'Transação inválida',
  'error.accounts.invalidNote': 'Nota inválida',
  'error.payment.walletNotSynchronized': 'A carteira não está sincronizada',
  'error.payment.previousBroadcastUnresolvedRefreshRetry':
    'Uma transmissão anterior não foi resolvida. Atualize ou reenvie esse mesmo pagamento em Atividade.',
  'error.payment.paymentAlreadyBeingSubmitted':
    'Um pagamento já está sendo enviado',
  'error.payment.paymentReviewExpiredSelectedWallet':
    'A revisão do pagamento expirou ou a carteira selecionada mudou. Revise o pagamento novamente.',
  'error.payment.paymentConfirmedChangedMeantimeNothing':
    'Este pagamento foi confirmado ou mudou nesse meio-tempo. Nada foi substituído.',
  'error.payment.selectedCoinsChangedReviewPayment':
    'As saídas não gastas selecionadas mudaram. Revise o pagamento novamente.',
  'error.payment.signingKeyUnavailable':
    'A chave de assinatura não está disponível',
  'error.payment.noUnresolvedPaymentAvailable':
    'Não há nenhum pagamento não resolvido disponível',
  'error.preferences.unknownPreference': 'Preferência desconhecida',
  'error.preferences.backgroundPushNotificationsAreNot':
    'As notificações push em segundo plano não estão configuradas. A sincronização do saldo funciona enquanto o app está aberto.',
  'error.recovery.watchOnlyWalletHasNo':
    'Esta carteira somente leitura não tem dados de recuperação privados',
  'error.recovery.walletHasNoPrivateRecovery':
    'Esta carteira não tem dados de recuperação privados',
  'error.recovery.recoveryMaterialUnavailable':
    'Os dados de recuperação não estão disponíveis',
  'error.recovery.watchOnlyWalletHasNo2':
    'Esta carteira somente leitura não tem chaves privadas',
  'error.recovery.walletHasNoPrivateKeys':
    'Esta carteira não tem chaves privadas',
  'error.recovery.addressControlledBySeveralKeys':
    'Este endereço é controlado por várias chaves, por isso não tem uma única chave privada.',
  'error.storage.walletMetadataDamaged':
    'Os metadados da carteira estão corrompidos',
  'error.sync.invalidRawTransaction': 'Transação bruta inválida',
  'error.sync.transactionIdVerificationFailed':
    'Falha na verificação do ID da transação',
  'error.sync.invalidTransactionValues': 'Valores da transação inválidos',
  'error.sync.invalidAddressState': 'Estado do endereço inválido',
  'error.sync.inconsistentTransactionHistory':
    'Histórico de transações inconsistente',
  'error.sync.invalidUnspentOutput': 'Saída não gasta inválida',
  'error.sync.balanceDoesNotMatchUnspent':
    'O saldo não corresponde às saídas não gastas',
  'error.sync.walletScanCancelled': 'Varredura da carteira cancelada',
  'error.sync.addressDiscoveryLimitReachedLarger':
    'Limite de descoberta de endereços atingido; uma varredura maior exige uma configuração de recuperação explícita',
  'error.sync.overlappingWalletDerivationBranches':
    'Ramos de derivação da carteira sobrepostos',
  'error.sync.historyChangedDuringSynchronization':
    'O histórico mudou durante a sincronização',
  'error.sync.missingInputTransaction': 'Transação de entrada não encontrada',
  'error.sync.invalidTransactionAccounting':
    'Contabilização da transação inválida',
  'error.sync.serverHistoryDoesNotBelong':
    'O histórico do servidor não pertence a este endereço',
  'error.sync.serverOmittedAddedUnspentOutputs':
    'O servidor omitiu ou adicionou saídas não gastas',
  'error.sync.outputValueOwnershipMismatch':
    'Divergência no valor ou na titularidade da saída',
  'error.sync.chainChangedDuringSynchronizationRefresh':
    'A cadeia mudou durante a sincronização; atualize novamente',
  'error.sync.invalidWalletBalance': 'Saldo da carteira inválido',
  'error.sync.connectionChangedDuringSynchronizationRefresh':
    'A conexão mudou durante a sincronização; atualize novamente',
  'error.payment.serviceUnavailable': 'Serviço indisponível ({status})',
  'error.chart.historyUnavailable':
    'Os preços históricos em {currency} estão temporariamente indisponíveis. Seu gráfico salvo foi mantido.',
  'error.electrum.rejected': 'O Electrum rejeitou {method}',
  'error.rates.noProvider':
    'No momento, nenhum provedor de preços está disponível para {currency}. O último preço salvo foi mantido.',
  'error.addresses.gapLimit': {
    one: 'Esta carteira já tem {count} endereço não usado seguido. Receba primeiro um pagamento nele, para que outras carteiras que a restaurarem ainda possam encontrar seus fundos.',
    other:
      'Esta carteira já tem {count} endereços não usados seguidos. Receba primeiro um pagamento em um deles, para que outras carteiras que a restaurarem ainda possam encontrar seus fundos.',
  },
  'error.preferences.priceUnavailable':
    'O preço em {currency} está temporariamente indisponível. A moeda selecionada não foi alterada.',
  'error.storage.openFailed':
    'Não foi possível abrir suas carteiras locais. Desbloqueie o celular e tente novamente.',
  'recovery.passphraseLabel': 'Passphrase BIP39:',
  'fee.custom': 'Taxa personalizada',
  'fee.estimateUnavailable': 'Estimativa de confirmação indisponível',
  'fee.network': 'Taxa de rede',
  'fee.enterValid': 'Insira uma taxa válida',
  'fee.tier.veryLow': 'Taxa muito baixa',
  'fee.tier.low': 'Taxa baixa',
  'fee.tier.recommended': 'Taxa recomendada',
  'fee.tier.priority': 'Taxa prioritária',
  'fee.tier.top': 'Prioridade máxima',
  'fee.speed': 'Velocidade de confirmação: {speed}',
  'fee.speedName.veryLow': 'muito lenta',
  'fee.speedName.low': 'lenta',
  'fee.speedName.recommended': 'normal',
  'fee.speedName.priority': 'rápida',
  'fee.speedName.top': 'muito rápida',
  'fee.lowWarning': 'A transação pode falhar devido à taxa baixa',
  'replace.reason.confirmed':
    'Apenas pagamentos não confirmados podem ser substituídos.',
  'replace.reason.watchOnly': 'Esta carteira somente leitura não pode assinar.',
  'replace.reason.received':
    'Apenas pagamentos enviados desta carteira podem ser substituídos.',
  'replace.reason.foreignInputs':
    'Algumas entradas deste pagamento pertencem a outra carteira.',
  'replace.reason.spentLater':
    'Um pagamento posterior, ainda não confirmado, gasta fundos deste. Substituí-lo também cancelaria aquele pagamento.',
  'replace.reason.refresh': 'Atualize a carteira e tente novamente.',
  'send.title': 'Enviar Bitcoin',
  'send.scanLabel': 'Escanear código QR de Bitcoin',
  'send.addressLabel': 'Endereço Bitcoin',
  'send.addressPlaceholder': 'Enviar para um endereço Bitcoin',
  'send.notePlaceholder': 'Nota pessoal',
  'send.noteOptional': '(opcional)',
  'send.noteHint':
    'Insira uma nota para identificar facilmente esta transação no histórico da sua carteira',
  'send.clipboardEmpty':
    'A área de transferência está vazia. Toque novamente para inserir um endereço.',
  'send.pasteFailed':
    'Não foi possível colar. Toque novamente para inserir um endereço.',
  'send.invalidAddress': 'Endereço BTC inválido. Verifique e tente novamente.',
  'send.feesUnavailable':
    'As taxas de rede estão indisponíveis no momento. Verifique sua conexão e tente novamente.',
  'send.prepareFailed': 'Não foi possível preparar o pagamento',
  'send.statusText': 'Envio de {amount}',
  'send.sentLabel': 'Envio de {amount} concluído',
  'send.sendingLabel': 'Enviando {amount}',
  'send.submitFailed': 'Não foi possível enviar este pagamento.',
  'send.paymentTitle': 'Pagamento',
  'review.title': 'Revisão',
  'review.customizeFees': 'Personalizar taxas',
  'review.to': 'Para',
  'review.amount': 'Valor',
  'review.total': 'Total',
  'review.feeRate': 'Taxa por vbyte',
  'fee.minimum': 'A taxa mínima é {rate} sat/vB',
  'fee.maximum': 'A taxa máxima é {rate} sat/vB',
  'fee.rateLabel': 'Taxa de rede por vbyte',
  'fee.rateInputLabel': 'Taxa em satoshis por byte virtual',
  'fee.calculating': 'Calculando…',
  'fee.rbf': 'Aceleração (RBF)',
  'fee.rbfLabel': 'Substituição por taxa (RBF)',
  'fee.enabled': 'Ativada',
  'fee.disabled': 'Desativada',
  'slide.label': 'Deslize para confirmar',
  'slide.handleLabel': 'Arraste o controle para a direita para confirmar',
  'send.showAddress': 'Mostrar endereço Bitcoin completo',
  'manageWallets.title': 'Gerenciar carteiras',
  'addWallet.title': 'Adicionar carteira',
  'addWallet.createTitle': 'Criar carteira',
  'addWallet.createDescription': 'Crie uma nova carteira com frase semente',
  'addWallet.icloudTitle': 'Backup do iCloud',
  'walletSettings.name': 'Nome da carteira',
  'walletIcon.title': 'Ícone da carteira',
  'walletIcon.change': 'Alterar ícone da carteira',
  'walletIcon.initials': 'Iniciais',
  'walletIcon.wallet': 'Carteira',
  'walletIcon.multi_chain': 'Várias redes',
  'walletIcon.diamond': 'Diamante',
  'walletIcon.speed': 'Velocidade',
  'walletIcon.bitcoin': 'Bitcoin',
  'walletIcon.tron': 'Tron',
  'walletIcon.heart': 'Coração',
  'walletIcon.dollar': 'Dólar',
  'walletIcon.card': 'Cartão',
  'walletIcon.flame': 'Chama',
  'walletIcon.leaderboard': 'Classificação',
  'walletIcon.savings': 'Poupança',
  'walletIcon.key': 'Chave',
  'walletIcon.growth': 'Crescimento',
  'walletIcon.gift': 'Presente',
  'walletIcon.star': 'Estrela',
  'walletColor.label': 'Cor da carteira: {color}',
  'walletColor.gold': 'Dourado',
  'walletColor.indigo': 'Índigo',
  'walletColor.red': 'Vermelho',
  'walletColor.orange': 'Laranja',
  'walletColor.sand': 'Areia',
  'walletColor.neon': 'Neon',
  'walletColor.green': 'Verde',
  'walletColor.ocean': 'Oceano',
  'walletColor.lavender': 'Lavanda',
  'walletColor.fuchsia': 'Fúcsia',
  'walletColor.grey': 'Cinza',
  'manageWallets.settingsFor': 'Ajustes da carteira {name}',
  'walletSettings.title': 'Ajustes da carteira',
  'walletSettings.unavailableFeature':
    'Este recurso não está disponível nesta versão.',
  'walletSettings.nameRow': 'Nome',
  'walletSettings.backup': 'Backup',
  'walletSettings.addresses': 'Endereços',
  'walletSettings.signVerify': 'Assinar/verificar mensagem',
  'walletSettings.backupWarning':
    'Faça sempre o backup da sua carteira para não perder o acesso caso perca ou redefina seu dispositivo.',
  'walletSettings.remove': 'Remover carteira',
  'backup.secretKey': 'Chave Secreta',
  'backup.methodsTitle': 'Métodos de backup',
  'backup.protectTitle': 'Proteja sua carteira',
  'backup.protectSubtitle':
    'Proteja o backup da sua carteira no iCloud com uma chave-senha usando o Face ID ou o Touch ID.',
  'backup.secure': 'Proteger',

  'backup.creating': 'Criando backup',
  'backup.created': 'Backup criado',
  'backup.icloudTitle': 'Backup do iCloud',
  'backup.icloudSubtitle':
    'Proteja com suas chaves-senha do iCloud e restaure usando o Face ID ou o Touch ID.',
  'backup.localWallet': 'Carteira local',
  'backup.cloudDisabled':
    'O backup na nuvem está desativado. Use a Chave Secreta para fazer o backup manual dos seus dados de recuperação.',
  'backup.secretKeySubtitle':
    'Obtenha seus dados de recuperação para restaurar a carteira manualmente.',
  'backup.revealTitle': 'Anote seu backup',
  'backup.revealWords':
    'Anote estas palavras na ordem certa e guarde-as em um lugar seguro e off-line.',
  'backup.revealKey':
    'Anote esta chave exatamente como aparece e guarde-a em um lugar seguro e off-line.',
  'backup.coverTitle': 'Revele sua Chave Secreta',
  'backup.check.writeDown': 'Anote-a. Nada de digital.',
  'backup.check.private': 'Só você deve ver sua tela.',
  'backup.check.protect': 'Proteja sua Chave Secreta.',
  'backup.check.neverShare': 'Nunca a compartilhe.',
  'backup.check.dontLose': 'Não a perca.',
  'backup.hold': 'Segure para revelar',
  'backup.holdHint':
    'Mantenha pressionado para ver sua Chave Secreta. Solte para ocultar.',
  'remove.removedTitle': 'Carteira removida',
  'remove.confirmTitle': 'Remover deste dispositivo?',
  'remove.removedOthers':
    'Suas outras carteiras continuam disponíveis neste dispositivo.',
  'remove.removedLast':
    'Agora você pode criar uma nova carteira ou importar uma.',
  'remove.confirmMessage':
    'As chaves e os dados locais da carteira serão apagados. Você pode importá-la novamente com os dados de recuperação dela.',
  'remove.message':
    'A carteira “{name}” será removida deste dispositivo.\n\nGuarde os dados de recuperação dela se precisar importá-la novamente.',
  'remove.failed': 'Não foi possível remover a carteira',
  'remove.confirm': 'Remover',
  'addresses.copyPrivateKey': 'Copiar chave privada',
  'addresses.receive': 'Recebimento',
  'addresses.change': 'Troco',
  'recovery.notProtected': 'Sem proteção',
  'activity.unknownBroadcast': 'Status da transmissão desconhecido',
  'activity.checkPayment': 'Verificar pagamento',
  'activity.checkPaymentMessage':
    'Atualize primeiro ou reenvie exatamente a mesma transação assinada.',
  'activity.refresh': 'Atualizar',
  'activity.connection': 'Conexão',
  'activity.resubmit': 'Reenviar',
  'activity.submitted': 'Transação enviada',
  'activity.broadcast': 'Transmissão',
  'activity.empty': 'Sua atividade aparecerá aqui',
  'activity.syncing': 'Sincronizando transações…',
  'activity.cancelledTitle': 'Pagamento cancelado',
  'activity.cancelledMessage':
    'Uma substituição que devolve o Bitcoin para esta carteira foi enviada à rede. Ela aparecerá em Atividade assim que for detectada.',
  'time.seconds': 'alguns segundos',
  'time.minute': 'um minuto',
  'time.minutes': { one: '{count} minuto', other: '{count} minutos' },
  'time.hour': 'uma hora',
  'time.hours': { one: '{count} hora', other: '{count} horas' },
  'time.day': 'um dia',
  'time.days': { one: '{count} dia', other: '{count} dias' },
  'time.month': 'um mês',
  'time.months': { one: '{count} mês', other: '{count} meses' },
  'time.year': 'um ano',
  'time.years': { one: '{count} ano', other: '{count} anos' },
  'time.ago': 'há {time}',
  'time.in': 'em {time}',
  'activity.pending': 'Pendente',
  'activity.dateUnavailable': 'Data indisponível',
  'activity.today': 'Hoje',
  'activity.yesterday': 'Ontem',
  'activity.received': 'Recebido',
  'activity.selfTransfer': 'Transferência interna',
  'activity.sent': 'Enviado',
  'activity.rowHintConverted':
    'Valor convertido pelo preço atual do Bitcoin. Abre os detalhes da transação.',
  'activity.rowHint': 'Abre os detalhes da transação.',
  'activity.timeUnavailable': 'Horário indisponível',
  'activity.selfFee': 'Taxa · {amount}',
  'pending.title': 'Transação pendente',
  'pending.lowFee':
    'Esta transação pode demorar para ser concluída devido à taxa baixa',
  'pending.message':
    'Este pagamento ainda não foi confirmado. Até lá, você pode acelerá-lo ou cancelá-lo.',
  'pending.speedUp': 'Acelerar',
  'pending.cancel': 'Cancelar',
  'note.title': 'Nota pessoal',
  'error.somethingWrong': 'Algo deu errado',
  'transaction.walletLabel': 'Carteira da transação: {name}',
  'transaction.receiving': 'Recebendo',
  'transaction.sending': 'Enviando',
  'transaction.unavailable': 'Indisponível',
  'transaction.selfNote': 'Transferido dentro da sua carteira',
  'transaction.from': 'De',
  'transaction.status': 'Status',
  'transaction.complete': 'Concluída',
  'transaction.date': 'Data',
  'transaction.receivedFrom': 'Recebido de',
  'transaction.receivingFrom': 'Recebendo de',
  'transaction.sentTo': 'Enviado para',
  'transaction.sendingTo': 'Enviando para',
  'transaction.sentFrom': 'Enviado de',
  'transaction.sendingFrom': 'Enviando de',
  'transaction.id': 'ID da transação',
  'transaction.depositedTo': 'Depositado em',
  'transaction.depositingTo': 'Depositando em',
  'transaction.fee': 'Taxa',
  'transaction.now': 'Valor atual',
  'addresses.used': 'Usado',
  'addresses.menuCopy': 'Copiar endereço',
  'addresses.menuCopyWif': 'Copiar chave privada (WIF)',
  'addresses.rowLabel': 'Endereço {index}, {address}',
  'addresses.rowHint': 'Abre as opções do endereço.',
  'addresses.transactions': 'Transações: {count}',
  'transaction.title': 'Transação',
  'transaction.explorerHint':
    'Abre o explorador de blocos. Mantenha pressionado para copiar.',
  'transaction.holdToCopy': 'Mantenha pressionado para copiar.',
  'note.editHint': 'Edita a nota pessoal.',
  'note.add': 'Adicionar nota',
  'transaction.feeLabel': 'Taxa de {amount}',
  'transaction.feeHint':
    'Alterna a moeda da taxa. Mantenha pressionado para copiar.',
  'transaction.copied': 'Copiado!',
  'transaction.addressCount': {
    one: '{count} endereço',
    other: '{count} endereços',
  },
  'transaction.recipientHint':
    'Toque para mostrar o endereço completo. Mantenha pressionado para copiar.',
  'replace.cancel.title': 'Cancelar pagamento?',
  'replace.cancel.body':
    'O pagamento será substituído por outro que devolve o Bitcoin para esta carteira, descontada a taxa de rede. Se o original for confirmado primeiro, nada será cancelado.',
  'replace.cancel.action': 'Cancelar pagamento',
  'replace.cancel.failed': 'Falha ao cancelar o pagamento.',
  'replace.unavailable': 'Não é possível substituir este pagamento',
  'replace.newFee': 'Nova taxa de rede',
  'replace.additionalFee': 'Taxa adicional',
  'replace.returns': 'Retorna à carteira',
  'replace.submitting': 'Enviando…',
  'settings.row.touchId': 'Bloqueio por Touch ID',
  'settings.row.biometricLock': 'Bloqueio por biometria',
  'settings.faceIdNeedsPasscode': 'Defina um código primeiro.',
  'settings.faceIdAllowTitle': 'Permitir Face ID',
  'settings.faceIdAllowMessage':
    'Acesse Ajustes > Bithold > Face ID para permitir que o Bithold use o Face ID.',
  'settings.passcodeRemoveTitle': 'Remover o código?',
  'settings.passcodeRemoveMessage':
    'Desativar o código deixará sua carteira sem proteção e poderá expor seus fundos.',
  'settings.passcodeRemoveConfirm': 'Remover código',
  'passcode.enableTitle': 'Ativar bloqueio por código',
  'passcode.enableBody1':
    'O Bithold pedirá seu código ao abrir, ao voltar do segundo plano e antes de mostrar sua Chave Secreta ou uma chave privada.',
  'passcode.enableBody2':
    'Se você esquecer o código, a única forma de recuperar o acesso é apagar as carteiras deste dispositivo e importá-las novamente com sua Chave Secreta.',
  'passcode.enterNew':
    'Insira o código que você usará para desbloquear o Bithold.',
  'passcode.enterCurrent': 'Insira seu código.',
  'passcode.field': 'Código',
  'passcode.confirmField': 'Confirmar código',
  'passcode.mismatch': 'Os códigos não coincidem. Tente novamente.',
  'lock.enterPasscode': 'Insira o código',
  'lock.unlock': 'Desbloquear',
  'lock.wrongPasscode': 'Código incorreto.',
  'lock.lockedOut': 'Aguarde devido às tentativas malsucedidas.',
  'lock.retryIn': 'Tente novamente em {time}. Mantenha esta tela aberta.',
  'lock.useFaceId': 'Usar Face ID',
  'lock.useTouchId': 'Usar Touch ID',
  'lock.forgot': 'Esqueceu seu código?',
  'lock.forgotTitle': 'Esqueceu seu código?',
  'lock.forgotMessage':
    'A única forma de recuperar o acesso é apagar as carteiras deste dispositivo e importá-las novamente com sua Chave Secreta.',
  'lock.eraseAndRestore': 'Apagar e restaurar',
  'lock.passcodeRequired': 'Código necessário',
  'lock.enrolmentChanged':
    'As configurações de Face ID do seu dispositivo mudaram desde a última vez que você abriu o Bithold. Insira seu código para continuar. Você pode ativar o bloqueio por Face ID novamente em Ajustes.',
  'lock.faceIdReason': 'Desbloquear o Bithold',
  'lock.invalidPasscode': 'Insira um código de 6 dígitos.',
  'lock.noPasscode': 'Nenhum código foi definido.',
  'walletName.title': 'Seu nome preferido',
  'walletName.introduction': 'Vamos conhecer você.',
  'walletName.reassurance': 'Você pode alterar isso a qualquer momento.',
  'walletName.placeholder': 'Seu nome preferido…',
  'walletName.pickEmoji': 'Escolher emoji',
  'walletName.changeEmoji': 'Alterar emoji',
  'walletName.resetAvatar': 'Usar um avatar baseado no nome',
  'walletName.yourAvatar': 'Seu avatar',
  'walletName.changeAvatar': 'Alterar avatar',
  'walletName.pickPhoto': 'Escolher foto',
  'walletName.takePhoto': 'Tirar foto',
  'walletName.removePhoto': 'Remover foto',
  'walletName.cameraDenied':
    'Permita o acesso à câmera nos Ajustes para tirar uma foto da carteira.',
  'walletName.cameraUnavailable':
    'A câmera não está disponível neste dispositivo.',
  'walletName.photoFailed':
    'Não foi possível carregar a foto. Tente novamente.',
};
