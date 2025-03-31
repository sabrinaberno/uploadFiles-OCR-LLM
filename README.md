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
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2️⃣ Instale as Dependências  

```bash
npm install
```
---

## 🔧 Configuração do Banco de Dados  

A aplicação usa **MongoDB** como banco de dados. Para rodar corretamente, você precisa criar um arquivo `.env` na raiz do projeto com a variável de ambiente:  

```env
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco"
```

📌 **Substitua** `usuario`, `senha` e `nome-do-banco` pelos seus dados reais do MongoDB.  

Após isso, rode as migrações do Prisma:  

```bash
npm prisma db push
```

Caso tenha alguma dúvida, acesse a [documentação do Prisma](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb/connect-your-database-node-mongodb)

---

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
✅ **Deploy na Vercel**  

---

## 🔜 Funcionalidades Futuras  

🚧 **Autenticação de usuários**  

---

## ❓ Dúvidas  

Caso tenha qualquer dúvida ou precise de ajuda, estou disponível! 😃
[E-mail](sabrinacberno@hotmail.com)
[LinkedIn](https://www.linkedin.com/in/sabrina-caldas-berno/)
