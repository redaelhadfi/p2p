package exple1;

import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

@SuppressWarnings("serial")
public class SecureGreetingServlet extends HttpServlet {
  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) 
      throws ServletException, IOException {
    response.setContentType("text/html; charset=UTF-8");
    PrintWriter out = response.getWriter();
    
    // Get authenticated user information
    String remoteUser = request.getRemoteUser();
    
    String docType = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\">\n";
    String nomPrenom = request.getParameter("nom");
    if (nomPrenom == null || nomPrenom.trim().isEmpty()) {
      nomPrenom = (remoteUser != null) ? remoteUser : "Anonymous";
    }
    
    double gain = Math.random() * 10;
    
    out.println(docType);
    out.println("<html>");
    out.println("<head><title>Greetings Servlet - Secure</title></head>");
    out.println("<body bgcolor='#FDF5E6'>");
    out.println("<center>");
    out.println("<h1>Greetings " + nomPrenom.toUpperCase() + "!</h1>");
    out.println("<p>Utilisateur authentifié: " + (remoteUser != null ? remoteUser : "Non authentifié") + "</p>");
    out.println("<h2>Vous avez gagné: " + String.format("%.2f", gain) + " millions de dollars!</h2>");
    out.println("<br><br>");
    out.println("<a href='greetings-secure.html'>Rejouer</a> | ");
    out.println("<form method='POST' action='j_security_check' style='display:inline;'>");
    out.println("<input type='hidden' name='logout' value='true'>");
    out.println("<input type='submit' value='Logout'>");
    out.println("</form>");
    out.println("</center>");
    out.println("</body>");
    out.println("</html>");
  }
  
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) 
      throws ServletException, IOException {
    doGet(request, response);
  }
}
