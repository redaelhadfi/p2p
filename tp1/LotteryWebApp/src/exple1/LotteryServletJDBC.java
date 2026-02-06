package exple1;

import java.io.*;
import java.sql.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

@SuppressWarnings("serial")
public class LotteryServletJDBC extends HttpServlet {
  
  // Database connection parameters
  private static final String DB_URL = "jdbc:mysql://localhost:3306/lottery_db";
  private static final String DB_USER = "root";
  private static final String DB_PASSWORD = "password";
  
  @Override
  public void init() throws ServletException {
    super.init();
    try {
      // Load MySQL JDBC Driver
      Class.forName("com.mysql.cj.jdbc.Driver");
    } catch (ClassNotFoundException e) {
      throw new ServletException("MySQL JDBC Driver not found", e);
    }
  }
  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) 
      throws ServletException, IOException {
    response.setContentType("text/html; charset=UTF-8");
    PrintWriter out = response.getWriter();
    
    String nomPrenom = request.getParameter("nom");
    if (nomPrenom == null || nomPrenom.trim().isEmpty()) {
      nomPrenom = "Anonymous";
    }
    
    double gain = Math.random() * 10;
    
    Connection conn = null;
    PreparedStatement pstmt = null;
    ResultSet rs = null;
    
    try {
      // Get database connection
      conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
      
      // Save the lottery result
      String insertSQL = "INSERT INTO lottery_results (nom, gain, date_participation) VALUES (?, ?, NOW())";
      pstmt = conn.prepareStatement(insertSQL);
      pstmt.setString(1, nomPrenom);
      pstmt.setDouble(2, gain);
      pstmt.executeUpdate();
      pstmt.close();
      
      // Retrieve user's history
      String selectSQL = "SELECT gain, date_participation FROM lottery_results WHERE nom = ? ORDER BY date_participation DESC";
      pstmt = conn.prepareStatement(selectSQL);
      pstmt.setString(1, nomPrenom);
      rs = pstmt.getResultSet();
      
      // Display results
      out.println("<!DOCTYPE HTML>");
      out.println("<html>");
      out.println("<head>");
      out.println("<title>Résultats Loterie</title>");
      out.println("<style>");
      out.println("body { font-family: Arial, sans-serif; background-color: #FDF5E6; padding: 20px; }");
      out.println("table { border-collapse: collapse; width: 100%; margin-top: 20px; }");
      out.println("th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }");
      out.println("th { background-color: #4CAF50; color: white; }");
      out.println("</style>");
      out.println("</head>");
      out.println("<body>");
      out.println("<center>");
      out.println("<h1>Félicitations " + nomPrenom.toUpperCase() + "!</h1>");
      out.println("<h2>Vous avez gagné: " + String.format("%.2f", gain) + " millions de dollars!</h2>");
      
      // Display history
      out.println("<h3>Votre historique de participations:</h3>");
      out.println("<table>");
      out.println("<tr><th>Gain (millions $)</th><th>Date</th></tr>");
      
      rs = pstmt.executeQuery();
      while (rs.next()) {
        double historicGain = rs.getDouble("gain");
        Timestamp date = rs.getTimestamp("date_participation");
        out.println("<tr>");
        out.println("<td>" + String.format("%.2f", historicGain) + "</td>");
        out.println("<td>" + date + "</td>");
        out.println("</tr>");
      }
      
      out.println("</table>");
      out.println("<br><br>");
      out.println("<a href='greetings.html'>Rejouer</a>");
      out.println("</center>");
      out.println("</body>");
      out.println("</html>");
      
    } catch (SQLException e) {
      out.println("<h2>Erreur de base de données: " + e.getMessage() + "</h2>");
      out.println("<p>Assurez-vous que la base de données 'lottery_db' existe et que la table 'lottery_results' est créée.</p>");
      e.printStackTrace();
    } finally {
      // Close resources
      try {
        if (rs != null) rs.close();
        if (pstmt != null) pstmt.close();
        if (conn != null) conn.close();
      } catch (SQLException e) {
        e.printStackTrace();
      }
    }
  }
  
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) 
      throws ServletException, IOException {
    doGet(request, response);
  }
}
