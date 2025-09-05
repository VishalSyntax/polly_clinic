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

public class UpdateDoctorServlet extends HttpServlet {
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
            
            int doctorId = requestData.get("id").getAsInt();
            String username = requestData.get("username").getAsString();
            String name = requestData.get("name").getAsString();
            String specialization = requestData.get("specialization").getAsString();
            String phone = requestData.get("phone").getAsString();
            String email = requestData.get("email").getAsString();
            String license = requestData.get("license").getAsString();
            
            // Update user
            String userSql = "UPDATE users u JOIN doctors d ON u.id = d.user_id SET u.username = ? WHERE d.id = ?";
            PreparedStatement userStmt = conn.prepareStatement(userSql);
            userStmt.setString(1, username);
            userStmt.setInt(2, doctorId);
            userStmt.executeUpdate();
            
            // Update doctor
            String doctorSql = "UPDATE doctors SET name = ?, specialization = ?, phone = ?, email = ?, license_number = ? WHERE id = ?";
            PreparedStatement doctorStmt = conn.prepareStatement(doctorSql);
            doctorStmt.setString(1, name);
            doctorStmt.setString(2, specialization);
            doctorStmt.setString(3, phone);
            doctorStmt.setString(4, email);
            doctorStmt.setString(5, license);
            doctorStmt.setInt(6, doctorId);
            doctorStmt.executeUpdate();
            
            conn.commit();
            
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Doctor updated successfully");
            
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error updating doctor: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}