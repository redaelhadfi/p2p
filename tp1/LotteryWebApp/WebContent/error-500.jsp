<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Erreur 500 - Erreur Interne du Serveur</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        color: white;
        padding: 50px;
        text-align: center;
    }
    .error-container {
        background: rgba(255, 255, 255, 0.1);
        padding: 40px;
        border-radius: 10px;
        max-width: 800px;
        margin: 0 auto;
    }
    .error-code {
        font-size: 120px;
        font-weight: bold;
        margin: 20px 0;
    }
    .error-details {
        background: rgba(0, 0, 0, 0.2);
        padding: 20px;
        border-radius: 5px;
        margin: 20px 0;
        text-align: left;
        font-family: monospace;
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
    <div class="error-code">500</div>
    <h1>Erreur Interne du Serveur</h1>
    <p>Une erreur s'est produite lors du traitement de votre requête.</p>
    
    <% if (exception != null) { %>
    <div class="error-details">
        <strong>Type d'exception:</strong> <%= exception.getClass().getName() %><br>
        <strong>Message:</strong> <%= exception.getMessage() %><br>
        <strong>URL:</strong> <%= request.getAttribute("javax.servlet.error.request_uri") %>
    </div>
    <% } %>
    
    <p>Veuillez réessayer plus tard ou contactez l'administrateur si le problème persiste.</p>
    <a href="<%= request.getContextPath() %>/">Retour à l'accueil</a>
</div>
</body>
</html>
