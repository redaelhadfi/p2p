<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Erreur - Une erreur s'est produite</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
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
    .error-icon {
        font-size: 80px;
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
    <div class="error-icon">⚠️</div>
    <h1>Une Erreur s'est Produite</h1>
    <p>Désolé, quelque chose s'est mal passé.</p>
    <% if (exception != null) { %>
    <p><strong>Erreur:</strong> <%= exception.getMessage() %></p>
    <% } %>
    <a href="<%= request.getContextPath() %>/">Retour à l'accueil</a>
</div>
</body>
</html>
