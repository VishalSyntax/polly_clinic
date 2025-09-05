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

public class SaveRemarkServlet extends HttpServlet {
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
            String sql = "INSERT INTO patient_remarks (patient_id, doctor_id, appointment_id, remarks) VALUES (?, ?, ?, ?)";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, requestData.get("patientId").getAsString());
            stmt.setInt(2, requestData.get("doctorId").getAsInt());
            stmt.setInt(3, requestData.get("appointmentId").getAsInt());
            stmt.setString(4, requestData.get("remarks").getAsString());
            
            int rowsAffected = stmt.executeUpdate();
            
            if (rowsAffected > 0) {
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Remark saved successfully");
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Failed to save remark");
            }
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error saving remark: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}