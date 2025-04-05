# Guia de Instalação e Uso da Aplicação  

Este tutorial descreve como configurar e executar a aplicação localmente, além de listar as funcionalidades já implementadas e as que ainda serão desenvolvidas.  

---

## 🛠 Tecnologias Utilizadas  

- **Next.js** (App Router + Server Actions)  
- **TypeScript**  
- **Prisma ORM**  
- **MongoDB**  
- **Tesseract.js** (OCR)  
- **TailwindCSS**  
- **OpenAI**
- **Vercel** (Deploy)  

---

## 🚀 Como Instalar e Rodar o Projeto  

### 1️⃣ Clone o Repositório  

```bash
git clone https://github.com/sabrinaberno/uploadFiles-OCR-LLM 
cd uploadFiles-OCR-LLM
```

### 2️⃣ Instale as Dependências  

```bash
npm install
```
---

## 🔧 Configuração do .env  

A aplicação utiliza **MongoDB** como banco de dados, **OpenAI** para comunicação com o usuário e **Clerk** para autenticação. Para garantir o funcionamento correto, crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis de ambiente:

# Banco de Dados (MongoDB)
```env
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco"
```
# OpenAI (Inteligência Artificial)
```env
OPENAI_API_KEY="SUA_CHAVE_OPENAI"
```

# Clerk (Autenticação)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="SUA_CHAVE_PUBLICA_CLERK"
CLERK_SECRET_KEY="SUA_CHAVE_SECRETA_CLERK"
```

📌 **Substitua** 
- `usuario`, `senha` e `nome-do-banco` pelos seus dados reais do MongoDB.  
- `SUA_CHAVE_OPENAI` pela sua chave de API do OpenAI.
- `SUA_CHAVE_PUBLICA_CLERK` e `SUA_CHAVE_SECRETA_CLERK` pelas chaves da sua conta Clerk.

Após isso, rode as migrações do Prisma:  

```bash
npx prisma generate
```

Caso tenha alguma dúvida, acesse a [documentação do Prisma](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb/connect-your-database-node-mongodb)


## ▶️ Rodando a Aplicação  

Para iniciar o projeto em modo de desenvolvimento:  

```bash
npm run dev
```

A aplicação estará disponível em:  

🔗 **http://localhost:3000**

---

## 📌 Funcionalidades Implementadas  

✅ **Upload de documentos**  
✅ **Conversão de texto via OCR (Tesseract.js)**  
✅ **Banco de dados integrado com Prisma e MongoDB**  
✅ **Integração com plataformas generativas - ChatGPT**  
✅ **Visualização de históricos de conversa**  
✅ **Autenticação de usuários com Clerk**
✅ **Deploy na Vercel**  

---

## 🔜 Funcionalidades Futuras  

🚧 **Melhoria na experiência do usuário (UI/UX)**
🚧 **Suporte para múltiplos formatos de documentos**
🚧 **Testes**
🚧 **Visualização do histórico de documentos enviados**

---

## ❓ Dúvidas  

Caso tenha qualquer dúvida ou precise de ajuda, estou disponível! 😃
[E-mail](sabrinacberno@hotmail.com)
[LinkedIn](https://www.linkedin.com/in/sabrina-caldas-berno/)
