<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Lottery Application - JSP Version</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
    }
    .container {
        max-width: 600px;
        margin: 50px auto;
        background: rgba(255, 255, 255, 0.1);
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }
    input[type="text"] {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border: none;
        border-radius: 5px;
        font-size: 16px;
    }
    input[type="submit"] {
        background-color: #4CAF50;
        color: white;
        padding: 12px 30px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 10px;
    }
    input[type="submit"]:hover {
        background-color: #45a049;
    }
</style>
</head>
<body>
<div class="container">
    <center>
    <h1>🎰 Loterie Virtuelle JSP 🎰</h1>
    <h2>Tenter votre chance!</h2>
    <form action="greetings.jsp" method="post">
       <label for="nom">Votre nom svp:</label>
       <input type="text" id="nom" name="nom" required>
       <input type="submit" value="Jouer">
    </form>
    
    <%
        String nom = request.getParameter("nom");
        if (nom != null && !nom.trim().isEmpty()) {
            double gain = Math.random() * 10;
            String nomUpper = nom.toUpperCase();
    %>
            <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.2); border-radius: 10px;">
                <h2>🎉 Félicitations <%= nomUpper %> ! 🎉</h2>
                <h1 style="color: #FFD700;">💰 <%= String.format("%.2f", gain) %> millions $ 💰</h1>
                <p>Vous avez gagné <%= String.format("%.2f", gain) %> millions de dollars!</p>
                <br>
                <a href="greetings.jsp" style="color: white; text-decoration: none; background: #4CAF50; padding: 10px 20px; border-radius: 5px;">Rejouer</a>
            </div>
    <%
        }
    %>
    </center>
</div>

<div style="text-align: center; margin-top: 20px; font-size: 12px;">
    <p>Session ID: <%= session.getId() %></p>
    <p>Request Method: <%= request.getMethod() %></p>
    <p>Server: <%= application.getServerInfo() %></p>
</div>

</body>
</html>
