# TP1 : Les Servlets HTTP - Application de Loterie Virtuelle

## 📋 Description

Application web JEE complète basée sur les servlets HTTP. Les utilisateurs participent à une loterie virtuelle en saisissant leur nom et reçoivent un montant de gain aléatoire.

## 🏗️ Structure

```
LotteryWebApp/
├── src/exple1/
│   ├── GreetingServlet.java          # Servlet de base
│   ├── LotteryServletJDBC.java       # Intégration JDBC/MySQL
│   ├── SecureGreetingServlet.java    # Authentification
│   ├── HttpMethodsServlet.java       # Méthodes HTTP
│   └── BlacklistFilter.java          # Filtre liste noire
├── WebContent/
│   ├── greetings.html, greetings.jsp
│   ├── error-*.jsp                   # Pages d'erreur
│   └── WEB-INF/
│       ├── web.xml                   # Configuration
│       ├── classes/, lib/
├── database/lottery_db.sql
└── config/tomcat-users.xml
```

## 🎯 Fonctionnalités

### 7 Extensions Implémentées
1. **Base**: Servlet avec formulaire HTML, génération dynamique, calcul aléatoire
2. **JDBC**: Intégration MySQL, sauvegarde résultats, historique
3. **Sécurité**: Authentification BASIC HTTP, rôle "tomcat"
4. **Filtre**: BlacklistFilter, interception requêtes
5. **JSP**: Versions simple et avancée avec scriptlets
6. **Méthodes HTTP**: GET, POST, PUT, DELETE, HEAD, OPTIONS, TRACE
7. **Erreurs**: Pages personnalisées 404, 403, 500

## 🚀 Installation

### Prérequis
- JDK 8+, Tomcat 8.5+, MySQL 5.7+

### Setup Rapide

```bash
# 1. Base de données
mysql -u root -p < database/lottery_db.sql

# 2. Configuration Tomcat
cp config/tomcat-users.xml $CATALINA_HOME/conf/

# 3. Déploiement
jar -cvf LotteryWebApp.war -C WebContent .
cp LotteryWebApp.war $CATALINA_HOME/webapps/
```

## 📝 Utilisation

### Application de Base
`http://localhost:8080/LotteryWebApp/`

### Application JDBC
`http://localhost:8080/LotteryWebApp/greetings-jdbc.html`

### Application Sécurisée
`http://localhost:8080/LotteryWebApp/greetings-secure.html`
- Username: `admin` / Password: `admin123`

### Application Filtrée
`http://localhost:8080/LotteryWebApp/greetings-filtered.html`
- Blacklist: "hacker", "spam", "bot"

### Version JSP
`http://localhost:8080/LotteryWebApp/greetings.jsp`

## 📸 Screenshots

![Application running](LotteryWebApp/screenshots/Screenshot%202026-02-05%20at%2021.47.01.png)
![Interface](LotteryWebApp/screenshots/Screenshot%202026-02-05%20at%2021.47.09.png)

## 📊 Concepts Clés

**Servlets HTTP**: Cycle de vie (`init()`, `service()`, `destroy()`), méthodes HTTP, requêtes/réponses

**Architecture JEE**: Structure WEB-INF, fichiers WAR, web.xml

**JDBC**: Connexion MySQL, PreparedStatement, gestion ressources

**Sécurité**: Authentification BASIC, autorisation par rôles, validation entrées

**Filtres**: Interface Filter, chaîne de filtres, interception

**JSP**: Scriptlets `<% %>`, expressions `<%= %>`, objets implicites

