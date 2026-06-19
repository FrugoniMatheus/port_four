# SportTrack

Aplicativo mobile de registro e acompanhamento de treinos esportivos desenvolvido com **Ionic + Angular + Firebase**.

## Tecnologias

- Ionic 7 + Angular 20 (NgModules)
- Firebase Authentication (login, cadastro, recuperação de senha)
- Firebase Firestore (banco de dados em tempo real)
- Capacitor (build nativo mobile)

## Telas

| Tela | Rota |
|------|------|
| Login | `/login` |
| Cadastro | `/cadastro` |
| Recuperar Senha | `/recuperar-senha` |
| Dashboard / Home | `/home` |
| Registrar Treino | `/registrar-treino` |
| Perfil do Atleta | `/perfil` |
| Nova Meta Esportiva | `/nova-meta` |

## Como rodar

```bash
npm install
ionic serve
```

## Funcionalidades

- Autenticação completa com Firebase Auth
- Registro de treinos com tipo, duração, data, esforço e notas
- Definição de metas esportivas com prazo
- Dashboard com dados em tempo real do Firestore
- Edição de perfil do atleta
- Acessibilidade: aria-labels, aria-live, contraste WCAG AA, lang pt-BR
