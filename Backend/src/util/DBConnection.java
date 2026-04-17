package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DESIGN PATTERN: Singleton (Preksha's Module)
 * ─────────────────────────────────────────────────────────────
 * Ensures only ONE database connection instance exists.
 * All DAOs share the same connection, preventing unnecessary
 * multiple connections to MySQL.
 * ─────────────────────────────────────────────────────────────
 * GRASP: Information Expert (Preksha's Module)
 * ─────────────────────────────────────────────────────────────
 * DBConnection is the Information Expert for database connectivity.
 * It holds all knowledge about URL, credentials and driver loading,
 * making it solely responsible for providing a valid connection.
 */
public class DBConnection {

    private static final String URL      = "Your url here";
    private static final String USER     = "Your username here ";
    private static final String PASSWORD = "Your password here"; 

    // Singleton: single shared instance
    private static Connection instance = null;

    private DBConnection() {} // prevent instantiation

    public static Connection getConnection() {
        if (instance == null) {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                instance = DriverManager.getConnection(URL, USER, PASSWORD);
                System.out.println("Database Connected Successfully!");
            } catch (ClassNotFoundException e) {
                System.out.println("MySQL JDBC Driver not found.");
                e.printStackTrace();
            } catch (SQLException e) {
                System.out.println("Database Connection Failed.");
                e.printStackTrace();
                instance = null;
            }
        }
        return instance;
    }
}
