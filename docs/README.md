# GETREN

## Descrição de projeto
<div style="text-align: justify">
Este projeto consiste em um site para o GETREN (Grupo de Estudos de Treinamento e Reabilitação Neurofuncional) que será uma plataforma de cursos sobre a área de educação física e fisioterapia. Assim, usuários podem se cadastrar no site e se inscrever nos cursos para aproveitar seu conteúdo.
<br/><br/>

## Descrição das Páginas Implementadas
<div style="text-align: justify">
Aqui encontram-se explicações sobre as páginas já implementadas no sistema, para simplificar o entendimento do funcionamento do site.

- ### Cadastro ( /cadastro )
<div style="text-align: justify">
Nessa página o usuário pode realizar o seu cadastro informando um email válido e uma senha com sua confirmação. Um email é enviado a ele para confirmação do cadastro.

- ### Login ( /login )
<div style="text-align: justify">
Nessa página o usuário pode fazer o login, acessar a página de cadastro caso ainda não esteja registrado e também solicitar um email para o caso de esquecimento da senha.

- ### Perfil ( /perfil )
<div style="text-align: justify">
Nessa página o usuário pode visualizar ou alterar seu perfil, visualizar os cursos já comprados e fazer o logout.

- ### Cursos ( /cursos )
<div style="text-align: justify">
Nessa página é possível visualizar os cursos presentes no site, sendo possível procurar apenas por cursos abertos, fechados, buscar por palavras-chave ou mostrar todos os cursos.

- ### Página dinâmica de curso ( /curso/<:id> )
<div style="text-align: justify">
Nessa página encontram-se as informações de um curso específico, e também é possivel o usuário se inscrever nesse curso, e, caso inscrito, pode visualizar os vídeos e emitir o seu certificado.

## Descrição das Páginas de Admin
<div style="text-align: justify">
Aqui encontram-se informações sobre as rotas apenas disponíveis para administradores do site, e envolvem a manipulação dos cursos e vídeos da plataforma.

- ### Adicionar Curso ( /cadastrar-curso )
<div style="text-align: justify">
Essa página permite a criação de um curso para a plataforma.

- ### Editar Curso ( /editar-curso/<:id> )
<div style="text-align: justify">
Essa página permite a edição de cursos existentes na plataforma.

- ### Adicionar Vídeo ( /cadastrar-video/<:id> )
<div style="text-align: justify">
Essa página permite a adição de um vídeo para a plataforma, no curso com id (id). Esse vídeo pode ser adicionado através de link do youtube ou arquivo de vídeo.

- ### Editar Vídeo ( /editar-video/<:id> )
<div style="text-align: justify">
Essa página permite a edição de vídeos existentes na plataforma.

- ### Páginas a fazer
<div style="text-align: justify">
Aqui encontram-se as páginas que ainda serão feitas no projeto de acordo com os requisitos e necessidades das clientes.

        - Home
        - FAQ
        - Sobre

## Próximos passos
<div style="text-align: justify">
Como próximos passos temos a construção da visualização do vídeo dentro dos cursos, inserção dos métodos de pagamento e emissão de certificado, além das páginas citadas acima.
