import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.BufferedReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class CompleteAppointmentServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        HttpSession session = request.getSession(false);
        if (session == null || !"doctor".equals(session.getAttribute("role"))) {
            JsonObject error = new JsonObject();
            error.addProperty("success", false);
            error.addProperty("message", "Unauthorized access");
            out.print(error.toString());
            return;
        }
        
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        
        JsonObject requestData = JsonParser.parseString(sb.toString()).getAsJsonObject();
        JsonObject jsonResponse = new JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "UPDATE appointments SET status = 'completed' WHERE id = ?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, requestData.get("appointmentId").getAsInt());
            
            int rowsAffected = stmt.executeUpdate();
            
            if (rowsAffected > 0) {
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Appointment completed successfully");
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Failed to complete appointment");
            }
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error completing appointment: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}