# Match Serviços (Expo + React Native)

## Pré-requisitos

- **Node.js** 20+ (recomendado ≥ 20.19.4 para evitar avisos de engine)
- **npm** (vem com o Node)
- Para testar no celular: app **Expo Go** ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Para **iOS nativo** no simulador: macOS com Xcode

## Instalação

Na pasta do projeto:

```bash
cd app
npm install
```

## Rodar o projeto

Inicia o servidor de desenvolvimento do Expo (Metro):

```bash
npm start
```

Ou:

```bash
npx expo start
```

No terminal do Expo você pode pressionar:

| Tecla | Ação |
|-------|------|
| `a` | Abrir no emulador/dispositivo **Android** |
| `i` | Abrir no simulador **iOS** (só no macOS) |
| `w` | Abrir no **navegador** (web) |
| `r` | Recarregar o app |
| `m` | Alternar menu de desenvolvimento |

### Scripts do `package.json`

```bash
npm run start    # igual a: expo start
npm run android  # expo start --android
npm run ios      # expo start --ios
npm run web      # expo start --web
```

### Cache limpo (se estilos ou dependências “não pegarem”)

```bash
npx expo start --clear
```

## Build / export (opcional)

Gerar bundle web estático:

```bash
npx expo export --platform web
```

## Pacotes alinhados ao Expo

Ao instalar bibliotecas nativas, prefira fixar versões compatíveis com seu SDK:

```bash
npx expo install nome-do-pacote
```

---

Projeto criado com **Expo SDK 54**, **NativeWind** (Tailwind) e dados mockados em `src/data/mock.ts`.
