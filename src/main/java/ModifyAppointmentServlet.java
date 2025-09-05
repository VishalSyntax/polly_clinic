import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@WebServlet("/modifyAppointment")
public class ModifyAppointmentServlet extends HttpServlet {
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        try {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = request.getReader().readLine()) != null) {
                sb.append(line);
            }
            
            JsonObject jsonRequest = JsonParser.parseString(sb.toString()).getAsJsonObject();
            int appointmentId = jsonRequest.get("appointmentId").getAsInt();
            String newDate = jsonRequest.get("newDate").getAsString();
            String newTime = jsonRequest.get("newTime").getAsString();
            
            try (Connection conn = DatabaseConnection.getConnection()) {
                String sql = "UPDATE appointments SET appointment_date = ?, appointment_time = ? WHERE id = ?";
                PreparedStatement stmt = conn.prepareStatement(sql);
                stmt.setString(1, newDate);
                stmt.setString(2, newTime);
                stmt.setInt(3, appointmentId);
                
                int rowsUpdated = stmt.executeUpdate();
                
                JsonObject jsonResponse = new JsonObject();
                if (rowsUpdated > 0) {
                    jsonResponse.addProperty("success", true);
                    jsonResponse.addProperty("message", "Appointment updated successfully");
                } else {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Appointment not found");
                }
                
                out.print(jsonResponse.toString());
                
            } catch (Exception e) {
                e.printStackTrace();
                JsonObject jsonResponse = new JsonObject();
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Database error: " + e.getMessage());
                out.print(jsonResponse.toString());
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            JsonObject jsonResponse = new JsonObject();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error processing request");
            out.print(jsonResponse.toString());
        }
        
        out.flush();
    }
}