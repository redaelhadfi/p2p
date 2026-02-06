package exple1;

import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

@SuppressWarnings("serial")
public class HttpMethodsServlet extends HttpServlet {
  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) 
      throws ServletException, IOException {
    response.setContentType("text/html; charset=UTF-8");
    PrintWriter out = response.getWriter();
    
    out.println("<!DOCTYPE html>");
    out.println("<html>");
    out.println("<head><title>HTTP Methods Demo</title></head>");
    out.println("<body>");
    out.println("<h1>Méthode GET exécutée</h1>");
    out.println("<p>Cette servlet démontre l'utilisation de différentes méthodes HTTP.</p>");
    out.println("<p>Vous avez utilisé la méthode: <strong>" + request.getMethod() + "</strong></p>");
    
    out.println("<h2>Tester les différentes méthodes:</h2>");
    out.println("<form method='POST' action='http-methods'>");
    out.println("<input type='submit' value='Test POST'>");
    out.println("</form>");
    
    out.println("<form method='GET' action='http-methods'>");
    out.println("<input type='hidden' name='test' value='delete'>");
    out.println("<input type='submit' value='Simuler DELETE'>");
    out.println("</form>");
    
    out.println("</body>");
    out.println("</html>");
  }
  
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) 
      throws ServletException, IOException {
    response.setContentType("text/html; charset=UTF-8");
    PrintWriter out = response.getWriter();
    
    out.println("<!DOCTYPE html>");
    out.println("<html>");
    out.println("<head><title>HTTP POST</title></head>");
    out.println("<body>");
    out.println("<h1>Méthode POST exécutée</h1>");
    out.println("<p>Utilisé pour créer ou soumettre des données.</p>");
    out.println("<a href='http-methods'>Retour</a>");
    out.println("</body>");
    out.println("</html>");
  }
  
  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) 
      throws ServletException, IOException {
    response.setContentType("text/html; charset=UTF-8");
    PrintWriter out = response.getWriter();
    
    out.println("<!DOCTYPE html>");
    out.println("<html>");
    out.println("<head><title>HTTP PUT</title></head>");
    out.println("<body>");
    out.println("<h1>Méthode PUT exécutée</h1>");
    out.println("<p>Utilisé pour mettre à jour des ressources existantes.</p>");
    out.println("</body>");
    out.println("</html>");
  }
  
  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) 
      throws ServletException, IOException {
    response.setContentType("text/html; charset=UTF-8");
    PrintWriter out = response.getWriter();
    
    out.println("<!DOCTYPE html>");
    out.println("<html>");
    out.println("<head><title>HTTP DELETE</title></head>");
    out.println("<body>");
    out.println("<h1>Méthode DELETE exécutée</h1>");
    out.println("<p>Utilisé pour supprimer des ressources.</p>");
    out.println("</body>");
    out.println("</html>");
  }
  
  @Override
  public void doHead(HttpServletRequest request, HttpServletResponse response) 
      throws ServletException, IOException {
    response.setContentType("text/html; charset=UTF-8");
    // HEAD method only returns headers, no body
    response.setHeader("Custom-Header", "HttpMethodsServlet");
  }
  
  @Override
  public void doOptions(HttpServletRequest request, HttpServletResponse response) 
      throws ServletException, IOException {
    response.setHeader("Allow", "GET, POST, PUT, DELETE, HEAD, OPTIONS");
    response.setStatus(HttpServletResponse.SC_OK);
  }
  
  @Override
  protected void doTrace(HttpServletRequest request, HttpServletResponse response) 
      throws ServletException, IOException {
    response.setContentType("message/http");
    PrintWriter out = response.getWriter();
    
    out.println("TRACE " + request.getRequestURI() + " " + request.getProtocol());
    java.util.Enumeration<String> headerNames = request.getHeaderNames();
    while (headerNames.hasMoreElements()) {
      String headerName = headerNames.nextElement();
      out.println(headerName + ": " + request.getHeader(headerName));
    }
  }
  
  @Override
  public void service(HttpServletRequest request, HttpServletResponse response) 
      throws ServletException, IOException {
    // Log the incoming request
    System.out.println("Service method called for: " + request.getMethod() + " " + request.getRequestURI());
    
    // Call the parent service method which will dispatch to appropriate doXXX method
    super.service(request, response);
  }
}
