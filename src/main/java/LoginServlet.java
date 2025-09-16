import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import com.google.gson.JsonObject;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String selectedUserType = request.getParameter("userType");
        
        JsonObject jsonResponse = new JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            // First check if user exists and is deactivated
            String checkSql = "SELECT is_active FROM users WHERE username = ? AND password = ?";
            PreparedStatement checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setString(1, username);
            checkStmt.setString(2, password);
            ResultSet checkRs = checkStmt.executeQuery();
            
            if (checkRs.next()) {
                boolean isActive = checkRs.getBoolean("is_active");
                if (!isActive) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "You are deactivated. Contact admin panel.");
                    out.print(jsonResponse.toString());
                    return;
                }
            }
            
            String sql = "SELECT u.id, u.user_type, d.id as doctor_id, d.name as doctor_name, r.name as receptionist_name " +
                        "FROM users u " +
                        "LEFT JOIN doctors d ON u.id = d.user_id " +
                        "LEFT JOIN receptionists r ON u.id = r.user_id " +
                        "WHERE u.username = ? AND u.password = ? AND u.is_active = TRUE";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            stmt.setString(2, password);
            
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                String actualUserType = rs.getString("user_type");
                
                // Validate that selected user type matches actual user type
                if (!actualUserType.equals(selectedUserType)) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Please select the correct user type for your account");
                    out.print(jsonResponse.toString());
                    return;
                }
                
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("userType", actualUserType);
                jsonResponse.addProperty("userId", rs.getInt("id"));
                
                String userType = actualUserType;
                if ("doctor".equals(userType)) {
                    String doctorName = rs.getString("doctor_name");
                    int doctorId = rs.getInt("doctor_id");
                    jsonResponse.addProperty("name", doctorName);
                    jsonResponse.addProperty("doctorName", doctorName);
                    jsonResponse.addProperty("doctorId", doctorId);
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