<h1 align="center" style="font-weight: bold;">Medical One<br>
M3P-FrontEnd-Squad1</h1> 
<p align="center"> <b>Projeto de Avaliação Final do Curso FullStack - Turma Health,<br> 
oferecido por <a href="https://cursos.sesisenai.org.br/" target="_blank">Sesi/Senai SC</a></b> </p>

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

<p align="center">
<a href="#descricao">Descrição</a> •
<a href="#instalacao">Instalação</a> • 
<a href="#instalacao">Configuração</a> • 
<a href="#routes">Endpoints</a> • 
<a href="#colab">Colaboradores</a> • 
<a href="#license">Licença</a> </p> 

<h2 id="descricao">Descrição</h2>
MedicalOne é um software para gestão de inventário médico, desenvolvido para otimizar o atendimento ao paciente. Através da plataforma, médicos e profissionais de saúde podem cadastrar e gerenciar informações dos pacientes de forma prática e organizada, incluindo dados pessoais, histórico médico e agendamento de consultas. Com uma interface intuitiva e responsiva, o MedicalOne oferece funcionalidades como o registro de consultas e exames, notificações de exames pendentes e relatórios de histórico, facilitando a gestão do consultório e contribuindo para um atendimento de saúde mais eficaz e personalizado.

### Problema Resolvido
O sistema foi criado para resolver a dificuldade no gerenciamento de informações de saúde, permitindo uma administração eficiente de pacientes, consultas e exames, com acesso diferenciado para usuários com diferentes perfis. 

A aplicação oferece funcionalidades específicas para diferentes perfis de usuários, incluindo administradores, médicos e pacientes, garantindo uma experiência personalizada e intuitiva.

### Tecnologias Utilizadas

Este projeto é desenvolvido utilizando as seguintes tecnologias e bibliotecas:

#### Frontend
- **Angular**: Framework para construção de aplicações web.
  - Versão: ^17.3.0
- **Bootstrap**: Framework CSS para desenvolvimento responsivo e mobile-first.
  - Versão: ^5.3.2
- **SweetAlert2**: Biblioteca de modais bonitos e responsivos.
  - Versão: ^11.6.13
- **jwt-decode**: Biblioteca para decodificação de tokens JWT.
  - Versão: ^4.0.0

#### Desenvolvimento
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
  - Versão: ~5.4.2
- **Angular CLI**: Interface de linha de comando para Angular.
  - Versão: ^17.3.2

<h2 id="instalacao">Instalação</h2>

### Pré-requisitos

Certifique-se de que os seguintes softwares estejam instalados para garantir o bom funcionamento do projeto:
- **Node.js**: Necessário para executar o npm e compilar o projeto Angular.
  - Versão recomendada: 22.11.0 LTS ou superior   
  - [Download Node.js](https://nodejs.org/)
  - 
- **Angular CLI**: Interface de linha de comando para Angular, facilitando a criação, execução e construção do projeto.
  - Instalação: `npm install -g @angular/cli`  
  - Versão recomendada: 17.3 ou superior
  - 
- **IDE (Ambiente de Desenvolvimento Integrado)**: Recomendado usar Visual Studio Code ou outro editor similar para facilitar o desenvolvimento e a navegação no código.
  - Recomendado: VS Code com as extensões para Angular e TypeScript  
  - [Download Visual Studio Code](https://code.visualstudio.com/)

- **Git**: Sistema de controle de versões necessário para clonar o repositório e contribuir com o projeto.
  - Versão recomendada: 2.30 ou superior  
  - [Download Git](https://git-scm.com/)

- **Docker**: Ferramenta de virtualização utilizada para rodar os containers do backend e do banco de dados, garantindo um ambiente consistente e isolado.
  - Versão recomendada: Docker Desktop 4.0 ou superior  
  - [Download Docker](https://www.docker.com/get-started)
 
### Clonando o Repositório

```bash
git clone https://github.com/FullStack-Health/M3P-FrontEnd-Squad1.git
```

## Instalando as dependências

```bash
cd .\M3P-FrontEnd-Squad1\
npm install
```
### Rodando a aplicação
Para compilar e iniciar a aplicação

```bash
ng serve
```
<h2 id="configuração">Configuração</h2>

### Integração BackEnd + Banco de dados
Esta aplicação tem funcionamento concomitante com o [servidor backend](https://github.com/FullStack-Health/M3P-BackEnd-Squad1.git)

Para criar um ambiente completo com backend, banco de dados e PgAdmin:
```bash
cd docker
docker-compose up
```

A aplicação backend estará rodando na porta 8081.

### Hospedagem web do projeto

[Link projeto hospedado](https://medical-one-app.vercel.app)

### Acesso inicial
Perfil admin:
```
User: admin@example.com
Password: admin12345
```

Perfil medico:
```
User: medico@example.com
Password: medico12345
```

<h2 id="routes">Endpoints</h2>

* backend: https://github.com/FullStack-Health/M3P-BackEnd-Squad1
* viacep : https://viacep.com.br/ws/${sanitizedCep}/json/

### Features

- Login
- Cadastro
- Pacientes
- Consultas
- Exames
- Prontuários
- Usuários
- Dashboard

<h2 id="colab">Colaboradores</h2>

- Camila Reimann ([camilareimann](https://github.com/camilareimann))
- Evelin Lilanda Nunes ([evelinlnunes](https://github.com/evelinlnunes))
- Felippe Kulkamp Sant Ana ([Felippeks](https://github.com/Felippeks))
- Ricardo Vieira dos Santos ([viesant](https://github.com/viesant))
- Sérgio Roberto Vieira Junior ([Brk-SirGio](https://github.com/Brk-SirGio))

<h2 id="license">Licença</h2>

Este projeto está licenciado nos termos da [licença MIT](https://choosealicense.com/licenses/mit/).

