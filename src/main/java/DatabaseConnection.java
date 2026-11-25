
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * Provides JDBC connections to MySQL using environment variables, JVM system properties,
 * an optional classpath {@code db.properties} file, or local development defaults.
 */
public class DatabaseConnection {

    private static final Properties FILE_PROPS = loadProperties();

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError("MySQL JDBC Driver not found: " + e.getMessage());
        }
    }

    private static Properties loadProperties() {
        Properties props = new Properties();
        try (InputStream in = DatabaseConnection.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (in != null) {
                props.load(in);
            }
        } catch (IOException ignored) {
            // Optional configuration file; environment variables or defaults will be used.
        }
        return props;
    }

    private static String getConfig(String key, String defaultValue) {
        String env = System.getenv(key);
        if (env != null && !env.trim().isEmpty()) {
            return env.trim();
        }
        String sysProp = System.getProperty(key);
        if (sysProp != null && !sysProp.trim().isEmpty()) {
            return sysProp.trim();
        }
        String fileProp = FILE_PROPS.getProperty(key);
        if (fileProp != null && !fileProp.trim().isEmpty()) {
            return fileProp.trim();
        }
        return defaultValue;
    }

    private static String buildJdbcUrl() {
        String explicitUrl = getConfig("DB_URL", null);
        if (explicitUrl != null) {
            return explicitUrl;
        }
        String host = getConfig("DB_HOST", "localhost");
        String port = getConfig("DB_PORT", "3306");
        String dbName = getConfig("DB_NAME", "pollyclinic");
        String sslMode = getConfig("DB_SSL_MODE", "PREFERRED");
        String timezone = getConfig("DB_TIMEZONE", "Asia/Kolkata");

        return String.format(
            "jdbc:mysql://%s:%s/%s?sslMode=%s&allowPublicKeyRetrieval=true&connectionTimeZone=%s&forceConnectionTimeZoneToSession=true",
            host, port, dbName, sslMode, timezone
        );
    }

    public static Connection getConnection() throws SQLException {
        String url = buildJdbcUrl();
        String username = getConfig("DB_USER", getConfig("DB_USERNAME", "root"));
        String password = getConfig("DB_PASSWORD", "0809");
        return DriverManager.getConnection(url, username, password);
    }
}
