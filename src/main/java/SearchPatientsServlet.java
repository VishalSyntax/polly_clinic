import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

@WebServlet("/searchPatients")
public class SearchPatientsServlet extends HttpServlet {
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String searchType = request.getParameter("type");
        String searchTerm = request.getParameter("term");
        
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        List<Patient> patients = new ArrayList<>();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql;
            
            switch (searchType) {
                case "id":
                    sql = "SELECT * FROM patients WHERE patient_id = ?";
                    break;
                case "contact":
                    sql = "SELECT * FROM patients WHERE contact_number LIKE ?";
                    break;
                case "name":
                    sql = "SELECT * FROM patients WHERE name LIKE ?";
                    break;
                default:
                    sql = "SELECT * FROM patients WHERE name LIKE ?";
            }
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            
            if (searchType.equals("id")) {
                stmt.setString(1, searchTerm);
            } else {
                stmt.setString(1, "%" + searchTerm + "%");
            }
            
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Patient patient = new Patient();
                patient.id = rs.getString("patient_id");
                patient.name = rs.getString("name");
                patient.contact = rs.getString("contact_number");
                patient.email = rs.getString("email");
                patients.add(patient);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        Gson gson = new Gson();
        out.print(gson.toJson(patients));
        out.flush();
    }
    
    class Patient {
        String id;
        String name;
        String contact;
        String email;
    }
}