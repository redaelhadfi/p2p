<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Erreur 404 - Page Non Trouvée</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 50px;
        text-align: center;
    }
    .error-container {
        background: rgba(255, 255, 255, 0.1);
        padding: 40px;
        border-radius: 10px;
        max-width: 600px;
        margin: 0 auto;
    }
    .error-code {
        font-size: 120px;
        font-weight: bold;
        margin: 20px 0;
    }
    a {
        color: white;
        text-decoration: none;
        background: rgba(255, 255, 255, 0.2);
        padding: 10px 20px;
        border-radius: 5px;
        display: inline-block;
        margin-top: 20px;
    }
    a:hover {
        background: rgba(255, 255, 255, 0.3);
    }
</style>
</head>
<body>
<div class="error-container">
    <div class="error-code">404</div>
    <h1>Page Non Trouvée</h1>
    <p>Désolé, la page que vous recherchez n'existe pas.</p>
    <p>L'URL demandée: <strong><%= request.getAttribute("javax.servlet.error.request_uri") %></strong></p>
    <a href="<%= request.getContextPath() %>/">Retour à l'accueil</a>
</div>
</body>
</html>
