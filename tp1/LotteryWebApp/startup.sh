#!/bin/bash

echo "Starting LotteryWebApp deployment..."

# Navigate to project directory
cd /Users/redaelhadfi/Desktop/p2p/tp1/LotteryWebApp

# Compile Java files
echo "Compiling Java files..."
javac -cp /opt/homebrew/opt/tomcat/libexec/lib/servlet-api.jar -d WebContent/WEB-INF/classes src/exple1/*.java

# Create WAR file
echo "Creating WAR file..."
cd WebContent
jar -cvf LotteryWebApp.war *

echo "Stopping Tomcat..."
/opt/homebrew/opt/tomcat/bin/catalina stop 2>/dev/null || echo "Tomcat was not running"

echo "Deploying WAR file..."
cp LotteryWebApp.war /opt/homebrew/opt/tomcat/libexec/webapps/

echo "Starting Tomcat..."
/opt/homebrew/opt/tomcat/bin/catalina start

echo "Deployment complete!"
echo "Access the application at: http://localhost:8080/LotteryWebApp/"
