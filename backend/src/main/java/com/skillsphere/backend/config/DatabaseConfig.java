package com.skillsphere.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DatabaseConfig {

    @Value("${skillsphere.db.host}")
    private String host;

    @Value("${skillsphere.db.port}")
    private String port;

    @Value("${skillsphere.db.name}")
    private String name;

    @Value("${skillsphere.db.username}")
    private String username;

    @Value("${skillsphere.db.password}")
    private String password;

    @Bean
    public DataSource dataSource() {
        String mysqlUrl = "jdbc:mysql://" + host + ":" + port + "/" + name + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        
        // Force mock database during automated tests
        boolean forceMock = "true".equalsIgnoreCase(System.getenv("MOCK_DB")) 
                || "test".equalsIgnoreCase(System.getProperty("spring.profiles.active"))
                || "test".equalsIgnoreCase(System.getenv("NODE_ENV"));

        if (forceMock) {
            return getH2DataSource();
        }

        try {
            // Load driver class explicitly to check
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            // Attempt to establish a brief connection to verify server availability
            DriverManager.setLoginTimeout(15); // 15 seconds timeout
            try (Connection conn = DriverManager.getConnection(mysqlUrl, username, password)) {
                System.out.println("✅ Connected to MySQL database successfully.");
                DriverManager.setLoginTimeout(0); // Reset to default for subsequent connections
                DriverManagerDataSource dataSource = new DriverManagerDataSource();
                dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
                dataSource.setUrl(mysqlUrl);
                dataSource.setUsername(username);
                dataSource.setPassword(password);
                return dataSource;
            }
        } catch (Exception e) {
            try { DriverManager.setLoginTimeout(0); } catch (Exception ignored) {}
            System.err.println("❌ Database connection failed. Falling back to MOCK in-memory H2 database.");
            System.err.println("Error details: " + e.getMessage());
        }

        return getH2DataSource();
    }

    private DataSource getH2DataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.h2.Driver");
        dataSource.setUrl("jdbc:h2:mem:skillsphere_db;DB_CLOSE_DELAY=-1;MODE=MySQL");
        dataSource.setUsername("sa");
        dataSource.setPassword("");
        return dataSource;
    }
}
