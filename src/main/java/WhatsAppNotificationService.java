import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

public class WhatsAppNotificationService {
    private static final String TWILIO_ACCOUNT_SID = "your_account_sid";
    private static final String TWILIO_AUTH_TOKEN = "your_auth_token";
    private static final String TWILIO_WHATSAPP_NUMBER = "whatsapp:+14155238886"; // Twilio sandbox number
    
    public static void sendAppointmentBooked(String patientPhone, String patientName, String patientId, String date, String time, String doctorName) {
        String message = String.format(
            "🏥 *PollyClinic Appointment Confirmed* ✅\n\n" +
            "👤 *Patient:* %s (ID: %s)\n" +
            "📅 *Date:* %s\n" +
            "⏰ *Time:* %s\n" +
            "👨‍⚕️ *Doctor:* %s\n\n" +
            "📍 Please arrive 15 minutes early\n" +
            "📞 Contact: +91-9579575606\n\n" +
            "Thank you for choosing PollyClinic!", 
            patientName, patientId, date, time, doctorName);
        sendWhatsAppMessage(patientPhone, message);
    }
    
    public static void sendAppointmentCancelled(String patientPhone, String patientName, String patientId, String date, String time, String doctorName) {
        String message = String.format(
            "🏥 *PollyClinic Appointment Cancelled* ❌\n\n" +
            "👤 *Patient:* %s (ID: %s)\n" +
            "📅 *Cancelled Date:* %s\n" +
            "⏰ *Cancelled Time:* %s\n" +
            "👨‍⚕️ *Doctor:* %s\n\n" +
            "📞 To reschedule, call: +91-9579575606\n" +
            "🌐 Or visit our website\n\n" +
            "We apologize for any inconvenience.", 
            patientName, patientId, date, time, doctorName);
        sendWhatsAppMessage(patientPhone, message);
    }
    
    public static void sendPrescriptionReady(String patientPhone, String patientName, String patientId, String doctorName, String medicines, String instructions) {
        String message = String.format(
            "🏥 *PollyClinic Prescription Ready* 💊\n\n" +
            "👤 *Patient:* %s (ID: %s)\n" +
            "👨‍⚕️ *Prescribed by:* %s\n\n" +
            "💊 *Medicines:*\n%s\n\n" +
            "📋 *Instructions:*\n%s\n\n" +
            "🕒 *Pickup Hours:* 9 AM - 6 PM\n" +
            "📍 *Location:* PollyClinic Reception\n\n" +
            "⚠️ Please bring your ID for verification", 
            patientName, patientId, doctorName, medicines, instructions);
        sendWhatsAppMessage(patientPhone, message);
    }
    
    private static void sendWhatsAppMessage(String toPhone, String message) {
        try {
            String auth = Base64.getEncoder().encodeToString((TWILIO_ACCOUNT_SID + ":" + TWILIO_AUTH_TOKEN).getBytes());
            
            // URL encode the message
            String encodedMessage = java.net.URLEncoder.encode(message, "UTF-8");
            String body = String.format("From=%s&To=whatsapp:+91%s&Body=%s", 
                                      TWILIO_WHATSAPP_NUMBER, toPhone, encodedMessage);
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.twilio.com/2010-04-01/Accounts/" + TWILIO_ACCOUNT_SID + "/Messages.json"))
                .header("Authorization", "Basic " + auth)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
                
            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("WhatsApp sent: " + response.statusCode());
        } catch (Exception e) {
            System.err.println("WhatsApp notification failed: " + e.getMessage());
        }
    }
}