# Ultra Implantes — Central de Inteligência

Projeto front-end responsivo preparado para publicar no **GitHub Pages** e editar sem framework.

## Estrutura do projeto

```text
ultra_central_inteligencia/
├─ index.html          # estrutura das telas
├─ styles.css          # todo o visual / responsividade
├─ config.js           # cores, textos e caminhos dos logos (mais fácil de editar)
├─ app.js              # lógica da aplicação
├─ scenarios.js        # cenários carregados pelo navegador
├─ scenarios.json      # cópia estruturada dos cenários
├─ .nojekyll           # evita interferência do Jekyll no GitHub Pages
└─ assets/
   ├─ ultra-logo.png
   ├─ ultra-icon.png
   ├─ rd-conversas.png
   └─ rd-icon.png
```

---

## 1. Publicar no GitHub Pages

### Forma simples
1. Crie um repositório novo no GitHub, por exemplo: `ultra-central-inteligencia`.
2. Descompacte este ZIP.
3. Envie **o conteúdo da pasta** para a raiz do repositório. O `index.html` precisa ficar na raiz.
4. No GitHub, abra **Settings → Pages**.
5. Em **Build and deployment**, escolha **Deploy from a branch**.
6. Selecione a branch `main` e a pasta `/ (root)`.
7. Clique em **Save**.
8. Aguarde alguns minutos. O GitHub mostrará a URL pública.

> Importante: este projeto é estático. Não precisa `npm install`, build, Node ou servidor para funcionar.

---

## 2. Onde editar cada coisa

### Trocar cores, logos e textos gerais
Edite **`config.js`**.

Exemplo:

```js
theme: {
  orange: '#ff6a00',
  graphite: '#24262b',
  background: '#f7f7f8'
}
```

Você pode trocar a cor principal sem tocar no CSS.

### Trocar os logos
Substitua os arquivos dentro de `assets/` mantendo os mesmos nomes:

- `assets/ultra-logo.png` → logo horizontal
- `assets/ultra-icon.png` → símbolo / favicon
- `assets/rd-conversas.png` → assinatura RD Conversas
- `assets/rd-icon.png` → ícone usado na área de importação

Se quiser usar outro nome de arquivo, altere os caminhos em `config.js`.

### Alterar margens, tamanhos, cards e responsividade
Edite **`styles.css`**.

As principais variáveis ficam no início:

```css
:root {
  --orange: #ff6a00;
  --ink: #24262b;
  --bg: #f7f7f8;
  --radius: 20px;
  --content: 1240px;
}
```

- `--content` controla a largura máxima da área central.
- `--radius` controla o arredondamento.
- `.view` controla as margens internas das páginas.
- `.sidebar` controla o menu lateral.
- os `@media` no final controlam tablet e celular.

### Alterar títulos ou blocos da interface
Edite **`index.html`**.

Não mexa nos `id="..."` se não souber exatamente o que está fazendo, porque o JavaScript usa esses IDs.

### Alterar a lógica do sistema
Edite **`app.js`**.

Aqui ficam:
- navegação;
- leitura do CSV;
- normalização das tarefas;
- cálculo dos indicadores;
- Copiloto;
- painel da Milena;
- histórico no `localStorage`.

### Alterar cenários e respostas da IA
Edite **`scenarios.js`** ou regenere-o a partir da sua Base Mestre.

Cada cenário contém campos como:
- título;
- categoria;
- como pensar;
- melhor pergunta;
- resposta padrão;
- erros a evitar;
- o que registrar;
- limite clínico.

---

## 3. Como editar diretamente pelo GitHub

Para mudanças pequenas:

1. Abra o arquivo no GitHub.
2. Clique no ícone de lápis **Edit this file**.
3. Faça a alteração.
4. Clique em **Commit changes**.
5. O GitHub Pages atualiza automaticamente em alguns minutos.

Para trocar uma imagem:

1. Entre na pasta `assets`.
2. Apague ou substitua o arquivo antigo.
3. Envie o novo arquivo com o **mesmo nome**.

---

## 4. Como testar antes de publicar

Você pode abrir `index.html` diretamente no Chrome.

Para uma experiência mais fiel à hospedagem, use a extensão **Live Server** no VS Code:

1. Abra a pasta no VS Code.
2. Instale a extensão `Live Server`.
3. Clique com o botão direito em `index.html`.
4. Escolha **Open with Live Server**.

---

## 5. Mobile e desktop

O CSS já possui breakpoints para:

- desktop largo;
- notebook/tablet;
- celular.

A navegação lateral vira menu móvel em telas menores.

Antes de publicar uma alteração visual, teste no Chrome:

**F12 → Toggle device toolbar** e veja pelo menos:
- 375 px;
- 430 px;
- 768 px;
- 1366 px.

---

## 6. Importação do RD

A tela **Importar RD** aceita CSV.

Neste protótipo:
- o arquivo é processado no navegador;
- os dados não são enviados para um servidor;
- a última importação e o histórico ficam no `localStorage` daquele navegador;
- limpar dados do navegador apaga esse histórico.

### Para produção real
Antes de usar como sistema oficial com dados de pacientes, implementar:
- login;
- backend autenticado;
- banco de dados;
- controle de permissões;
- trilha de auditoria;
- política LGPD;
- integração oficial com RD CRM / RD Conversas.

GitHub Pages é adequado para **front-end/protótipo**, não para guardar prontuários ou dados sensíveis de pacientes.

---

## 7. Regra de ouro para editar sem quebrar

### Pode editar à vontade
- textos visíveis;
- cores;
- imagens;
- espaçamentos;
- bordas;
- tipografia;
- conteúdo dos cenários.

### Edite com cuidado
- `id=` no HTML;
- nomes dos campos usados no JavaScript;
- funções de importação;
- chaves do `localStorage`;
- estrutura de `scenarios.js`.

Se alterar um ID usado pelo `app.js`, algum botão ou painel pode parar de funcionar.

---

## 8. Arquivos que você normalmente vai editar

Para 90% das alterações:

1. `config.js` — marca e cores.
2. `styles.css` — aparência.
3. `index.html` — textos/layout.
4. `scenarios.js` — inteligência/respostas.

O `app.js` deve ser tratado como lógica da aplicação.

---

## 9. Próxima evolução recomendada

A versão de produção deve separar:

**Front-end** → interface responsiva da Ultra.  
**Backend** → autenticação, banco e integrações.  
**Motor de IA** → Base Mestre + conhecimento clínico validado + guardrails.  
**RD** → CRM, tarefas, negociações e Conversas.  
**Gestão** → painel de qualidade, conversão, follow-up e treinamento.

O princípio funcional permanece:

**fala + histórico + tarefa + etapa + resultado → leitura → próximo passo → resposta → registro → métrica → aprendizado.**
