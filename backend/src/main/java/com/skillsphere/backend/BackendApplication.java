package com.skillsphere.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        // Force mock profile/env when starting the dev server or test runner
        if ("test".equalsIgnoreCase(System.getenv("NODE_ENV"))) {
            System.setProperty("spring.profiles.active", "test");
        }
        
        SpringApplication.run(BackendApplication.class, args);
    }
}
