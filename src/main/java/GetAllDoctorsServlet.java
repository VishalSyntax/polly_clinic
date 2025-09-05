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

public class GetAllDoctorsServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        JsonArray doctorsArray = new JsonArray();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT d.id, u.username, d.name, d.specialization, d.phone, d.email, d.license_number, u.is_active " +
                        "FROM doctors d JOIN users u ON d.user_id = u.id";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                JsonObject doctor = new JsonObject();
                doctor.addProperty("id", rs.getInt("id"));
                doctor.addProperty("username", rs.getString("username"));
                doctor.addProperty("name", rs.getString("name"));
                doctor.addProperty("specialization", rs.getString("specialization"));
                doctor.addProperty("phone", rs.getString("phone"));
                doctor.addProperty("email", rs.getString("email"));
                doctor.addProperty("license", rs.getString("license_number"));
                doctor.addProperty("isActive", rs.getBoolean("is_active"));
                doctorsArray.add(doctor);
            }
        } catch (Exception e) {
            JsonObject error = new JsonObject();
            error.addProperty("error", e.getMessage());
            out.print(error.toString());
            return;
        }
        
        out.print(doctorsArray.toString());
    }
}