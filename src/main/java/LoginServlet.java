import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String userType = request.getParameter("userType");
        
        if (userDAO.authenticateUser(username, password, userType)) {
            HttpSession session = request.getSession();
            session.setAttribute("username", username);
            session.setAttribute("userType", userType);
            
            response.setContentType("application/json");
            response.getWriter().write("{\"success\": true, \"userType\": \"" + userType + "\"}");
        } else {
            response.setContentType("application/json");
            response.getWriter().write("{\"success\": false, \"message\": \"Invalid credentials\"}");
        }
    }
}

@WebServlet("/addDoctor")
class AddDoctorServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String name = request.getParameter("name");
        String specialization = request.getParameter("specialization");
        String phone = request.getParameter("phone");
        String email = request.getParameter("email");
        String license = request.getParameter("license");
        
        boolean success = userDAO.addDoctor(username, password, name, specialization, phone, email, license);
        
        response.setContentType("application/json");
        if (success) {
            response.getWriter().write("{\"success\": true, \"message\": \"Doctor added successfully\"}");
        } else {
            response.getWriter().write("{\"success\": false, \"message\": \"Failed to add doctor\"}");
        }
    }
}

@WebServlet("/addReceptionist")
class AddReceptionistServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String name = request.getParameter("name");
        String phone = request.getParameter("phone");
        String email = request.getParameter("email");
        String shift = request.getParameter("shift");
        
        boolean success = userDAO.addReceptionist(username, password, name, phone, email, shift);
        
        response.setContentType("application/json");
        if (success) {
            response.getWriter().write("{\"success\": true, \"message\": \"Receptionist added successfully\"}");
        } else {
            response.getWriter().write("{\"success\": false, \"message\": \"Failed to add receptionist\"}");
        }
    }
}