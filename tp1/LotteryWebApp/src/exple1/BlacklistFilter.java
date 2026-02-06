package exple1;

import java.io.*;
import java.util.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class BlacklistFilter implements Filter {
  
  private Set<String> blacklist;
  
  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
    blacklist = new HashSet<>();
    
    // Read blacklist from init parameters in web.xml
    String blacklistParam = filterConfig.getInitParameter("blacklist");
    if (blacklistParam != null && !blacklistParam.trim().isEmpty()) {
      String[] names = blacklistParam.split(",");
      for (String name : names) {
        blacklist.add(name.trim().toLowerCase());
      }
    }
    
    System.out.println("BlacklistFilter initialized with " + blacklist.size() + " entries");
  }
  
  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
      throws IOException, ServletException {
    
    HttpServletRequest httpRequest = (HttpServletRequest) request;
    HttpServletResponse httpResponse = (HttpServletResponse) response;
    
    String nom = request.getParameter("nom");
    
    if (nom != null && !nom.trim().isEmpty()) {
      String nomLower = nom.trim().toLowerCase();
      
      if (blacklist.contains(nomLower)) {
        // User is blacklisted - deny access
        httpResponse.setContentType("text/html; charset=UTF-8");
        PrintWriter out = httpResponse.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>Accès Refusé</title></head>");
        out.println("<body bgcolor='#FFCCCC'>");
        out.println("<center>");
        out.println("<h1>Accès Refusé!</h1>");
        out.println("<h2>Le nom '" + nom + "' figure dans la liste noire.</h2>");
        out.println("<p>Vous n'êtes pas autorisé à accéder à cette application.</p>");
        out.println("<br><br>");
        out.println("<a href='greetings-filtered.html'>Retour</a>");
        out.println("</center>");
        out.println("</body>");
        out.println("</html>");
        
        // Log the blocked access
        System.out.println("Access denied for blacklisted user: " + nom);
        return; // Stop the filter chain
      }
    }
    
    // User is not blacklisted - continue the filter chain
    chain.doFilter(request, response);
  }
  
  @Override
  public void destroy() {
    blacklist.clear();
    System.out.println("BlacklistFilter destroyed");
  }
}
