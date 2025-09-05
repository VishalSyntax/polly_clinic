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

public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        JsonObject jsonResponse = new JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT u.id, u.user_type, d.name as doctor_name, r.name as receptionist_name " +
                        "FROM users u " +
                        "LEFT JOIN doctors d ON u.id = d.user_id " +
                        "LEFT JOIN receptionists r ON u.id = r.user_id " +
                        "WHERE u.username = ? AND u.password = ? AND u.is_active = TRUE";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            stmt.setString(2, password);
            
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("userType", rs.getString("user_type"));
                jsonResponse.addProperty("userId", rs.getInt("id"));
                
                String userType = rs.getString("user_type");
                if ("doctor".equals(userType)) {
                    String doctorName = rs.getString("doctor_name");
                    jsonResponse.addProperty("name", doctorName);
                    jsonResponse.addProperty("doctorName", doctorName);
                    jsonResponse.addProperty("redirectUrl", "doctor-appointments.html");
                } else if ("receptionist".equals(userType)) {
                    String receptionistName = rs.getString("receptionist_name");
                    jsonResponse.addProperty("name", receptionistName);
                    jsonResponse.addProperty("userName", receptionistName);
                    jsonResponse.addProperty("redirectUrl", "receptionist-dashboard.html");
                } else if ("admin".equals(userType)) {
                    jsonResponse.addProperty("name", "Administrator");
                    jsonResponse.addProperty("redirectUrl", "admin-dashboard.html");
                }
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid username or password");
            }
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Database error: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}