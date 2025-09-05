import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import com.google.gson.JsonObject;

public class AddReceptionistServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String name = request.getParameter("name");
        String shift = request.getParameter("shift");
        String phone = request.getParameter("phone");
        String email = request.getParameter("email");
        
        JsonObject jsonResponse = new JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            conn.setAutoCommit(false);
            
            // Insert user
            String userSql = "INSERT INTO users (username, password, user_type) VALUES (?, ?, 'receptionist')";
            PreparedStatement userStmt = conn.prepareStatement(userSql, PreparedStatement.RETURN_GENERATED_KEYS);
            userStmt.setString(1, username);
            userStmt.setString(2, password);
            userStmt.executeUpdate();
            
            ResultSet rs = userStmt.getGeneratedKeys();
            int userId = 0;
            if (rs.next()) {
                userId = rs.getInt(1);
            }
            
            // Insert receptionist
            String receptionistSql = "INSERT INTO receptionists (user_id, name, phone, email, shift_timing) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement receptionistStmt = conn.prepareStatement(receptionistSql);
            receptionistStmt.setInt(1, userId);
            receptionistStmt.setString(2, name);
            receptionistStmt.setString(3, phone);
            receptionistStmt.setString(4, email);
            receptionistStmt.setString(5, shift);
            receptionistStmt.executeUpdate();
            
            conn.commit();
            
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Receptionist added successfully");
            
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error adding receptionist: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}