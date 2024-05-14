type Data = {
  name: string;
  resetUrl: string;
}
export const resetPassword = (data: Data) => {
  return `
  <!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }
    body {
      font-family: 'Roboto', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    main {
      display: flex;
      flex-direction: column;
      align-items: self-start;
      gap: 10px;
    }
    h1 {
      font-size: 25px;
      font-weight: bold;
    }
    p, h1, a, button {
      margin: 0 15px;
    }
    header, footer {
      background: hsl(210 40% 96.1%);
      padding: 15px;
      width: 100%;
    }
    a {
      font-weight: bold;
    }
    button {
      padding: 10px;
      border-radius: 5px;
      border: none;
      background-color: hsl(222.2 47.4% 11.2%);
      font-size: 15px;
      font-weight: bold;
      color: white;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>
        Olá, ${data.name}!
      </h1>
    </header>
    <p>
      Sabemos que é frustrante esquecer a senha, mas não se preocupe - estamos aqui para ajudá-lo a recuperar o acesso à sua conta!
    </p>
    <p>Para redefinir sua senha, basta clicar no link abaixo:</p>
    <p>Após clicar no botão ou no link, você será direcionado para a página de redefinição de senha. Siga as instruções simples para escolher uma nova senha segura e recuperar o acesso à sua conta.</p>
    <p>Lembre-se de escolher uma senha forte e única para manter sua conta segura.</p>
    <p>Se você não solicitou esta redefinição de senha ou precisar de assistência adicional, entre em contato com nossa equipe de suporte imediatamente para que possamos ajudá-lo a proteger sua conta.</p>
    <p>Estamos aqui para tornar o processo o mais fácil possível para você. Se precisar de mais alguma coisa, não hesite em nos contatar.</p>
    <footer>
      <p>Atenciosamente,</p>
      <p>99 Agendamentos</p>
    </footer>
  </main>
</body>
</html>
  `
}