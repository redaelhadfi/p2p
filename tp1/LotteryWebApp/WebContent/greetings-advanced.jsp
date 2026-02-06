<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
<%@ page import="java.util.*" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Lottery Application - Advanced JSP</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
        padding: 20px;
    }
    .container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    th {
        background-color: #4CAF50;
        color: white;
    }
    tr:hover {
        background-color: #f5f5f5;
    }
    .result-box {
        background: #e8f5e9;
        padding: 20px;
        border-radius: 5px;
        margin: 20px 0;
        border-left: 4px solid #4CAF50;
    }
</style>
</head>
<body>
<div class="container">
    <center><h1>🎰 Loterie Virtuelle - JSP Avancé 🎰</h1></center>
    
    <form action="greetings-advanced.jsp" method="post">
        <label for="nom">Votre nom:</label>
        <input type="text" id="nom" name="nom" required style="width: 300px; padding: 8px; margin: 10px;">
        <input type="submit" value="Jouer" style="padding: 8px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
    </form>
    
    <%
        String nom = request.getParameter("nom");
        if (nom != null && !nom.trim().isEmpty()) {
            double gain = Math.random() * 10;
            
            // JavaBean usage
            pageContext.setAttribute("playerName", nom);
            pageContext.setAttribute("winAmount", gain);
    %>
            <div class="result-box">
                <h2>🎉 Félicitations <%= nom.toUpperCase() %>! 🎉</h2>
                <h3 style="color: #4CAF50;">Vous avez gagné: <%= String.format("%.2f", gain) %> millions de dollars!</h3>
            </div>
            
            <h3>Détails de votre session:</h3>
            <table>
                <tr>
                    <th>Information</th>
                    <th>Valeur</th>
                </tr>
                <tr>
                    <td>Nom du joueur</td>
                    <td><%= nom %></td>
                </tr>
                <tr>
                    <td>Gain</td>
                    <td><%= String.format("%.2f", gain) %> millions $</td>
                </tr>
                <tr>
                    <td>Session ID</td>
                    <td><%= session.getId() %></td>
                </tr>
                <tr>
                    <td>Méthode HTTP</td>
                    <td><%= request.getMethod() %></td>
                </tr>
                <tr>
                    <td>IP Client</td>
                    <td><%= request.getRemoteAddr() %></td>
                </tr>
                <tr>
                    <td>User-Agent</td>
                    <td><%= request.getHeader("User-Agent") %></td>
                </tr>
                <tr>
                    <td>Date/Heure</td>
                    <td><%= new java.util.Date() %></td>
                </tr>
            </table>
            
            <br>
            <center>
                <a href="greetings-advanced.jsp" style="padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Rejouer</a>
            </center>
    <%
        }
    %>
</div>
</body>
</html>
