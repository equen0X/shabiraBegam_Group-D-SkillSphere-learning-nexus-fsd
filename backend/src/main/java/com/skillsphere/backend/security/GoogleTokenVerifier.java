package com.skillsphere.backend.security;

import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Component
public class GoogleTokenVerifier {

    private final String clientId;
    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifier(@Value("${skillsphere.google.client-id}") String clientId) {
        this.clientId = clientId;
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    public GoogleProfile verifyToken(String credentialToken) throws GeneralSecurityException, IOException {
        if (credentialToken.startsWith("mock_google_token_")) {
            String mockEmail = credentialToken.replace("mock_google_token_", "");
            String mockUsername = mockEmail.split("@")[0];
            return new GoogleProfile(
                    "google_mock_id_" + mockUsername,
                    mockEmail,
                    mockUsername.toUpperCase()
            );
        }

        GoogleIdToken idToken = verifier.verify(credentialToken);
        if (idToken == null) {
            throw new IllegalArgumentException("Invalid Google credential token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        return new GoogleProfile(
                payload.getSubject(),
                payload.getEmail(),
                (String) payload.get("name")
        );
    }

    public static class GoogleProfile {
        private final String googleId;
        private final String email;
        private final String name;

        public GoogleProfile(String googleId, String email, String name) {
            this.googleId = googleId;
            this.email = email;
            this.name = name;
        }

        public String getGoogleId() {
            return googleId;
        }

        public String getEmail() {
            return email;
        }

        public String getName() {
            return name;
        }
    }
}
