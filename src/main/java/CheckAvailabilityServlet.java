import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class CheckAvailabilityServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String doctorId = request.getParameter("doctorId");
        String date = request.getParameter("date");
        
        JsonArray bookedSlots = new JsonArray();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT appointment_time FROM appointments " +
                        "WHERE doctor_id = ? AND appointment_date = ? AND status = 'scheduled'";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, Integer.parseInt(doctorId));
            stmt.setString(2, date);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                bookedSlots.add(rs.getString("appointment_time"));
            }
        } catch (Exception e) {
            JsonObject error = new JsonObject();
            error.addProperty("error", e.getMessage());
            out.print(error.toString());
            return;
        }
        
        out.print(bookedSlots.toString());
    }
}