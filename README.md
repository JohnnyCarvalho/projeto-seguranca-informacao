# Projeto para a aula de Segurança de Informação da PUC-PR - Curso Engenharia de Software

# Requisitos: NodeJS

Para executar o projeto siga os seguintes passos:

# 1) Servidor NODE:

Em um terminal de comando acesse o diretório em que o projeto for clonado e:

  ```cd Server
  npm install
  npm start```

Caso o servidor node aponte erro de porta, basta acessar o arquivo ports.js no root do projeto e mudar a porta do servidor para uma porta disponível em seu ambiente.

# 2) FRONTEND Next.js:
Em outro terminal de comando acesse o diretório em que o projeto for clonado e:
  cd Frontend
  npm install
  npm run dev
  
O front deve estar sendo executado no endereço http://127.0.0.1:3000

# 3) SIMULAÇÃO FORÇA BRUTA
Em outro terminal de comando acesse o diretório em que o projeto for clonado e:
  cd Bruteforce
  npm install
  node bruteforce.js
  Siga as instruções que aparecerão no terminal de comando.


# RELATÓRIO
ITEM 01 -Desenvolva um programa que implemente uma aplicação que possua funcionalidades: cadastrar e autenticar usuário. Um usuário possui os seguintes atributos: nome(string de 4 caracteres) e senha (string de 4 caracteres). O cadastro dos usuários deve ser armazenado em um arquivo txt. A aplicação deve utilizar o algorítmo MD5 para realizar a função de hash para armazenamento da senha.

CONSIDERAÇÕES: A aplicação foi desenvolvida utilizando uma API em NodeJS como backend (pasta Server) e o frontend em React, utilizando o framework next.js (pasta Frontend). A aplicação armazena os dados dos usuários no arquivo db.json (dentro da pasta Server) e todas as senhas são armazenadas como hashs, através da aplicação do algorítmo MD5, conforme requisitado no enunciado.

ITEM 02 - Pesquise um algorítmo/código fonte de força bruta para MD5 e processe o arquivo que contém as senhas armazenadas. Compute o tempo para realizar a quebra de 04 usuários.

CONSIDERAÇÕES: Desenvolvemos nosso próprio algorítimo de força bruta para simular duas situações: 
a) Situação em que o atacante está tentando descobrir credenciais válidas em um website (no caso a própria aplicação desenvolvida). Neste cenário utilizamos manipulação do DOM através da biblioteca puppeteer (que simula a utilização do browser), desenvolvendo um algoritmo para testar possíveis nomes de usuário e, quando encontrado um usuário válido, testar diferentes combinações de senha.
O script criado foi executado durante cerca de 8 horas (Disponível no youTube https://youtu.be/riwno66skaw) e encontrou com sucesso dois nomes de usuário e suas respectivas senhas.

b) O segundo cenário, proposto no enunciado do exercício, simula um atacante que já possui acesso à base de dados e utiliza de força bruta para quebrar as senhas salvas no banco de dados. O script demorou cerca de 4 minutos para quebrar as senhas dos cinco usuários existentes na base de dados (Disponível no YouTube https://youtu.be/9yj44DNsKxE).

ITEM 03 - Implemente uma solução para reduzir a possibilidade de sucesso de um ataque de força bruta no programa desenvolvido no item 01.

CONSIDERAÇÕES: Para reduzir a possibilidade de sucesso de um ataque de força bruta nós criamos uma propriedade no arquivo de configuração (config.json na pasta raiz do projeto) chamada "securityActive" que recebe um parâmetro booleano. Se true os requisitos de senha passam a ser:
- Mínimo 8 caracteres
- Ao menos uma letra maiúscula
- Ao menos uma letra minúscula
- Ao menos um número
- Ao menos um caractere especial
Desta forma seria necessário maior tempo de processamento para quebra das hashs md5 no caso de acesso não autorizado à base de dados.

Quanto ao ataque de força bruta feito através do navegador, além das medidas acima foram implementadas as seguintes medidas:
O nome de usuário passa a necessitar de ao menos cinco caracteres.
Além disto, quando o parâmetro está como true será feita uma validação do número de tentativas de login sem êxito, caso existam mais do que cinco tentativas mal sucedidas o usuário deverá aguarda 1 minuto até que seja possível realizar nova tentativa.


# ENTREGÁVEIS:
Código fonte do item 01 - Pastas Frontend e Server
Código fonte do item 02 - Pasta Bruteforce
Código fonte do item 03 - Pasta Server, arquivo server.js e arquivo config.json na pasta raíz.
Relatório - Arquivo README.md

