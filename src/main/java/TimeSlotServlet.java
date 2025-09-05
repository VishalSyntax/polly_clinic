import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.BufferedReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class TimeSlotServlet extends HttpServlet {
    
    // Get all time slots
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        JsonArray slotsArray = new JsonArray();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT * FROM time_slots WHERE is_active = TRUE ORDER BY slot_time";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                JsonObject slot = new JsonObject();
                slot.addProperty("id", rs.getInt("id"));
                slot.addProperty("slotTime", rs.getString("slot_time"));
                slot.addProperty("isActive", rs.getBoolean("is_active"));
                slotsArray.add(slot);
            }
        } catch (Exception e) {
            JsonObject error = new JsonObject();
            error.addProperty("error", e.getMessage());
            out.print(error.toString());
            return;
        }
        
        out.print(slotsArray.toString());
    }
    
    // Add new time slot
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
            String sql = "INSERT INTO time_slots (slot_time) VALUES (?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, requestData.get("slotTime").getAsString());
            stmt.executeUpdate();
            
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Time slot added successfully");
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error adding time slot: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
    
    // Delete time slot
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String slotId = request.getParameter("id");
        JsonObject jsonResponse = new JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "UPDATE time_slots SET is_active = FALSE WHERE id = ?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, Integer.parseInt(slotId));
            stmt.executeUpdate();
            
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Time slot removed successfully");
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error removing time slot: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}