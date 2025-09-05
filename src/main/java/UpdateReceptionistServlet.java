import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.BufferedReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class UpdateReceptionistServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        
        JsonObject requestData = JsonParser.parseString(sb.toString()).getAsJsonObject();
        JsonObject jsonResponse = new JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            conn.setAutoCommit(false);
            
            int receptionistId = requestData.get("id").getAsInt();
            String username = requestData.get("username").getAsString();
            String name = requestData.get("name").getAsString();
            String phone = requestData.get("phone").getAsString();
            String email = requestData.get("email").getAsString();
            String shift = requestData.get("shift").getAsString();
            
            // Update user
            String userSql = "UPDATE users u JOIN receptionists r ON u.id = r.user_id SET u.username = ? WHERE r.id = ?";
            PreparedStatement userStmt = conn.prepareStatement(userSql);
            userStmt.setString(1, username);
            userStmt.setInt(2, receptionistId);
            userStmt.executeUpdate();
            
            // Update receptionist
            String receptionistSql = "UPDATE receptionists SET name = ?, phone = ?, email = ?, shift_timing = ? WHERE id = ?";
            PreparedStatement receptionistStmt = conn.prepareStatement(receptionistSql);
            receptionistStmt.setString(1, name);
            receptionistStmt.setString(2, phone);
            receptionistStmt.setString(3, email);
            receptionistStmt.setString(4, shift);
            receptionistStmt.setInt(5, receptionistId);
            receptionistStmt.executeUpdate();
            
            conn.commit();
            
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Receptionist updated successfully");
            
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error updating receptionist: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}