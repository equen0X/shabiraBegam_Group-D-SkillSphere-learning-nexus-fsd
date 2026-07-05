package com.skillsphere.backend;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class BackendApplicationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String getBaseUrl() {
        return "http://localhost:" + port;
    }

    @BeforeAll
    static void setup() {
        System.setProperty("MOCK_DB", "true");
        System.setProperty("spring.profiles.active", "test");
    }

    @Test
    @SuppressWarnings("unchecked")
    void testFullAuthFlow() throws Exception {
        // 1. Get server status check
        ResponseEntity<Map> statusRes = restTemplate.getForEntity(getBaseUrl() + "/status", Map.class);
        assertEquals(HttpStatus.OK, statusRes.getStatusCode());
        assertNotNull(statusRes.getBody());
        assertEquals("OK", statusRes.getBody().get("status"));

        // 2. GET /me should block request if unauthorized (no token)
        ResponseEntity<Map> meNoTokenRes = restTemplate.getForEntity(getBaseUrl() + "/me", Map.class);
        assertEquals(HttpStatus.UNAUTHORIZED, meNoTokenRes.getStatusCode());
        assertNotNull(meNoTokenRes.getBody());
        assertEquals(false, meNoTokenRes.getBody().get("success"));
        assertTrue(meNoTokenRes.getBody().get("message").toString().contains("No Token Provided"));

        // 3. GET /me should block request if token is invalid
        HttpHeaders invalidHeaders = new HttpHeaders();
        invalidHeaders.setBearerAuth("invalid_token_here_xyz");
        HttpEntity<Void> invalidEntity = new HttpEntity<>(invalidHeaders);
        ResponseEntity<Map> meInvalidTokenRes = restTemplate.exchange(getBaseUrl() + "/me", HttpMethod.GET, invalidEntity, Map.class);
        assertEquals(HttpStatus.FORBIDDEN, meInvalidTokenRes.getStatusCode());
        assertNotNull(meInvalidTokenRes.getBody());
        assertEquals(false, meInvalidTokenRes.getBody().get("success"));
        assertTrue(meInvalidTokenRes.getBody().get("message").toString().contains("Invalid Token"));

        // 4. POST /auth/google should authenticate and register new Google user
        Map<String, String> googleLoginRequest = new HashMap<>();
        googleLoginRequest.put("credential", "mock_google_token_johndoe@skillsphere.com");
        ResponseEntity<Map> googleLoginRes = restTemplate.postForEntity(getBaseUrl() + "/auth/google", googleLoginRequest, Map.class);
        assertEquals(HttpStatus.OK, googleLoginRes.getStatusCode());
        assertNotNull(googleLoginRes.getBody());
        assertEquals(true, googleLoginRes.getBody().get("success"));

        String userAccessToken = (String) googleLoginRes.getBody().get("accessToken");
        String userRefreshToken = (String) googleLoginRes.getBody().get("refreshToken");
        assertNotNull(userAccessToken);
        assertNotNull(userRefreshToken);

        Map<String, Object> userData = (Map<String, Object>) googleLoginRes.getBody().get("user");
        assertEquals("johndoe@skillsphere.com", userData.get("email"));
        assertEquals("STUDENT", userData.get("role"));
        assertEquals("johndoe", userData.get("username"));

        // 5. GET /me should fetch profile successfully with a valid access token
        HttpHeaders validHeaders = new HttpHeaders();
        validHeaders.setBearerAuth(userAccessToken);
        HttpEntity<Void> validEntity = new HttpEntity<>(validHeaders);
        ResponseEntity<Map> meValidRes = restTemplate.exchange(getBaseUrl() + "/me", HttpMethod.GET, validEntity, Map.class);
        assertEquals(HttpStatus.OK, meValidRes.getStatusCode());
        assertNotNull(meValidRes.getBody());
        assertEquals(true, meValidRes.getBody().get("success"));

        Map<String, Object> profileData = (Map<String, Object>) meValidRes.getBody().get("user");
        assertEquals("johndoe@skillsphere.com", profileData.get("email"));
        assertEquals("STUDENT", profileData.get("role"));

        // 6. POST /auth/refresh should rotate the refresh token and issue new access token
        Thread.sleep(1000); // ensure timestamp changes
        Map<String, String> refreshRequest = new HashMap<>();
        refreshRequest.put("refreshToken", userRefreshToken);
        ResponseEntity<Map> refreshRes = restTemplate.postForEntity(getBaseUrl() + "/auth/refresh", refreshRequest, Map.class);
        assertEquals(HttpStatus.OK, refreshRes.getStatusCode());
        assertNotNull(refreshRes.getBody());
        assertEquals(true, refreshRes.getBody().get("success"));

        String secondAccessToken = (String) refreshRes.getBody().get("accessToken");
        String secondRefreshToken = (String) refreshRes.getBody().get("refreshToken");
        assertNotNull(secondAccessToken);
        assertNotNull(secondRefreshToken);
        assertNotEquals(userAccessToken, secondAccessToken);
        assertNotEquals(userRefreshToken, secondRefreshToken);

        // 7. POST /auth/refresh with rotated (old) refresh token should fail (replay protection)
        ResponseEntity<Map> replayRes = restTemplate.postForEntity(getBaseUrl() + "/auth/refresh", refreshRequest, Map.class);
        assertEquals(HttpStatus.FORBIDDEN, replayRes.getStatusCode());
        assertNotNull(replayRes.getBody());
        assertEquals(false, replayRes.getBody().get("success"));
        assertTrue(replayRes.getBody().get("message").toString().contains("compromised or revoked"));

        // 8. GET /me should work with the newly rotated access token
        HttpHeaders secondHeaders = new HttpHeaders();
        secondHeaders.setBearerAuth(secondAccessToken);
        HttpEntity<Void> secondEntity = new HttpEntity<>(secondHeaders);
        ResponseEntity<Map> meSecondRes = restTemplate.exchange(getBaseUrl() + "/me", HttpMethod.GET, secondEntity, Map.class);
        assertEquals(HttpStatus.OK, meSecondRes.getStatusCode());

        // 9. POST /auth/logout should revoke the refresh token session
        Map<String, String> logoutRequest = new HashMap<>();
        logoutRequest.put("refreshToken", secondRefreshToken);
        HttpEntity<Map<String, String>> logoutEntity = new HttpEntity<>(logoutRequest, secondHeaders);
        ResponseEntity<Map> logoutRes = restTemplate.postForEntity(getBaseUrl() + "/auth/logout", logoutEntity, Map.class);
        assertEquals(HttpStatus.OK, logoutRes.getStatusCode());
        assertNotNull(logoutRes.getBody());
        assertEquals(true, logoutRes.getBody().get("success"));

        // 10. POST /auth/refresh should fail with the logged-out refresh token
        Map<String, String> loggedOutRefreshRequest = new HashMap<>();
        loggedOutRefreshRequest.put("refreshToken", secondRefreshToken);
        ResponseEntity<Map> loggedOutRefreshRes = restTemplate.postForEntity(getBaseUrl() + "/auth/refresh", loggedOutRefreshRequest, Map.class);
        assertEquals(HttpStatus.FORBIDDEN, loggedOutRefreshRes.getStatusCode());

        // 11. Local signup and local login flow
        Map<String, String> signupRequest = new HashMap<>();
        signupRequest.put("username", "localuser");
        signupRequest.put("full_name", "Local User");
        signupRequest.put("email", "local@skillsphere.com");
        signupRequest.put("password", "secure_password_123");
        signupRequest.put("role", "STUDENT");

        ResponseEntity<Map> localSignupRes = restTemplate.postForEntity(getBaseUrl() + "/auth/signup", signupRequest, Map.class);
        assertEquals(HttpStatus.CREATED, localSignupRes.getStatusCode());
        assertNotNull(localSignupRes.getBody());
        assertEquals(true, localSignupRes.getBody().get("success"));

        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "local@skillsphere.com");
        loginRequest.put("password", "secure_password_123");

        ResponseEntity<Map> localLoginRes = restTemplate.postForEntity(getBaseUrl() + "/auth/login", loginRequest, Map.class);
        assertEquals(HttpStatus.OK, localLoginRes.getStatusCode());
        assertNotNull(localLoginRes.getBody());
        assertEquals(true, localLoginRes.getBody().get("success"));
        assertNotNull(localLoginRes.getBody().get("accessToken"));
        assertNotNull(localLoginRes.getBody().get("refreshToken"));
    }
}
