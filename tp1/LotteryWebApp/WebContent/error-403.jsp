<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Erreur 403 - Accès Interdit</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    <div class="error-code">403</div>
    <h1>Accès Interdit</h1>
    <p>Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.</p>
    <p>Veuillez vous connecter avec les autorisations appropriées.</p>
    <a href="<%= request.getContextPath() %>/">Retour à l'accueil</a>
</div>
</body>
</html>
