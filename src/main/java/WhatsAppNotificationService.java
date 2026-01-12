import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class WhatsAppNotificationService {

    // IMPORTANT: Storing credentials directly in code is not secure.
    // It's better to load these from a configuration file or environment variables.
    private static final String INSTANCE_ID = "7105319809"; // Replace with your actual Instance ID
    private static final String API_TOKEN = "f557539d8a6e4ee0acd5144309849c63a12e5c5094564d73b7";   // Replace with your actual API Token

    public void sendAppointmentConfirmation(String contact, String patientName, String doctorName, String date, String time) {
        String message = String.format(
            "Dear %s,\n\nYour appointment with %s on %s at %s has been confirmed.\n\nThank you,\nPolly Clinic",
            patientName, doctorName, date, time
        );
        sendMessage(contact, message);
    }

    public void sendPrescriptionReady(String contact, String patientName) {
        String message = String.format(
            "Dear %s,\n\nYour prescription is ready. Please collect it from the clinic at your convenience.\n\nThank you,\nPolly Clinic",
            patientName
        );
        sendMessage(contact, message);
    }
    
    public void sendAppointmentCancellation(String contact, String patientName, String reason) {
        String message = String.format(
            "Dear %s,\n\nWe regret to inform you that your appointment has been cancelled.\nReason: %s\n\nPlease contact us to reschedule.\n\nThank you,\nPolly Clinic",
            patientName, reason
        );
        sendMessage(contact, message);
    }

    private void sendMessage(String contact, String message) {
        if (contact == null || contact.trim().isEmpty()) {
            System.err.println("WhatsApp Error: Contact number is empty.");
            return;
        }

        try {
            URL url = new URL("https://api.green-api.com/waInstance" + INSTANCE_ID + "/sendMessage/" + API_TOKEN);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json; utf-8");
            conn.setDoOutput(true);

            // *** FIX APPLIED HERE ***
            // The chatId must be in the format "phonenumber@c.us".
            String chatId = contact.trim() + "@c.us";
            
            // Create the JSON payload with the corrected chatId.
            String jsonInputString = String.format("{\"chatId\": \"%s\", \"message\": \"%s\"}", chatId, message);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int responseCode = conn.getResponseCode();
            System.out.println("Green API Response Code: " + responseCode);

            // *** IMPROVED ERROR LOGGING ***
            // Read the full response from the server to get detailed error messages.
            try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
                StringBuilder response = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
                System.out.println("Green API Response Body: " + response.toString());
            }

            conn.disconnect();

        } catch (Exception e) {
            System.err.println("Error sending WhatsApp message to " + contact);
            e.printStackTrace();
        }
    }
}