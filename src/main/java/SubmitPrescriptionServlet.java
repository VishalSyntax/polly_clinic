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
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;

public class SubmitPrescriptionServlet extends HttpServlet {
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
            
            int appointmentId = requestData.get("appointmentId").getAsInt();
            String patientId = requestData.get("patientId").getAsString();
            int doctorId = requestData.get("doctorId").getAsInt();
            JsonArray medicines = requestData.getAsJsonArray("medicines");
            
            // Get patient contact and name
            String patientSql = "SELECT name, contact_number FROM patients WHERE patient_id = ?";
            PreparedStatement patientStmt = conn.prepareStatement(patientSql);
            patientStmt.setString(1, patientId);
            ResultSet patientRs = patientStmt.executeQuery();
            
            String patientName = "";
            String patientContact = "";
            if (patientRs.next()) {
                patientName = patientRs.getString("name");
                patientContact = patientRs.getString("contact_number");
            }
            
            // Insert prescriptions
            String prescriptionSql = "INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, medicine_name, quantity, timing) VALUES (?, ?, ?, ?, ?, ?)";
            PreparedStatement prescriptionStmt = conn.prepareStatement(prescriptionSql);
            
            for (JsonElement medicineElement : medicines) {
                JsonObject medicine = medicineElement.getAsJsonObject();
                prescriptionStmt.setInt(1, appointmentId);
                prescriptionStmt.setString(2, patientId);
                prescriptionStmt.setInt(3, doctorId);
                prescriptionStmt.setString(4, medicine.get("name").getAsString());
                prescriptionStmt.setString(5, medicine.get("quantity").getAsString());
                prescriptionStmt.setString(6, medicine.get("timing").getAsString());
                prescriptionStmt.addBatch();
            }
            prescriptionStmt.executeBatch();
            
            // Mark appointment as completed
            String updateSql = "UPDATE appointments SET status = 'completed' WHERE id = ?";
            PreparedStatement updateStmt = conn.prepareStatement(updateSql);
            updateStmt.setInt(1, appointmentId);
            updateStmt.executeUpdate();
            
            conn.commit();
            
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("patientName", patientName);
            jsonResponse.addProperty("patientContact", patientContact);
            jsonResponse.addProperty("message", "Prescription submitted successfully");
            
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error submitting prescription: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}