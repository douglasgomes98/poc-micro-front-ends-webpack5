# poc-micro-front-ends-webpack5

### Pros
* Permite o fácil compartilhamento de componentes entre apps
* Permite o reuso de componentes de frameworks diferentes
* Tempo de build menor.

### Contras
* Maior complexidade no gerenciamento de estados
* Não é possível vercionar as dependências (ErrorBoundary always)
* Não é possível manter um contrato entre os apps (TypeScript)
* É necessário que o app que está expondo o componente sempre esteja disponível, pois a dependência é em runtime.
* Impacto na Ux, tem mais loadings nas páginas
* Tamanho do bundle final maior.
