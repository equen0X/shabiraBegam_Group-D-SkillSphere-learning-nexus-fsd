package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.UserRepository;
import com.skillsphere.backend.model.Quest;
import com.skillsphere.backend.repository.QuestRepository;
import com.skillsphere.backend.model.StudentCertificate;
import com.skillsphere.backend.repository.StudentCertificateRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final QuestRepository questRepository;
    private final StudentCertificateRepository studentCertificateRepository;

    public UserController(
            UserRepository userRepository,
            QuestRepository questRepository,
            StudentCertificateRepository studentCertificateRepository) {
        this.userRepository = userRepository;
        this.questRepository = questRepository;
        this.studentCertificateRepository = studentCertificateRepository;
    }

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof Claims)) {
            return null;
        }
        Claims claims = (Claims) principal;
        Long userId = Long.parseLong(claims.getSubject());
        return userRepository.findById(userId).orElse(null);
    }

    @GetMapping({"/me", "/profile"})
    public ResponseEntity<Map<String, Object>> getMe() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized: User context missing or not found");
            return ResponseEntity.status(401).body(response);
        }

        // Update daily streak
        updateUserDailyStreak(user);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId().toString());
        userData.put("username", user.getUsername());
        userData.put("full_name", user.getFullName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());
        userData.put("provider", user.getProvider());
        userData.put("is_active", user.getIsActive() ? 1 : 0);
        userData.put("last_login_at", user.getLastLoginAt());
        userData.put("created_at", user.getCreatedAt());
        userData.put("updated_at", user.getUpdatedAt());

        // Profile fields
        userData.put("title", user.getTitle() != null ? user.getTitle() : "");
        userData.put("bio", user.getBio() != null ? user.getBio() : "");
        userData.put("contact_email", user.getContactEmail() != null ? user.getContactEmail() : "");
        userData.put("phone", user.getPhone() != null ? user.getPhone() : "");
        userData.put("location", user.getLocation() != null ? user.getLocation() : "");
        userData.put("github", user.getGithub() != null ? user.getGithub() : "");
        userData.put("linkedin", user.getLinkedin() != null ? user.getLinkedin() : "");
        userData.put("portfolio", user.getPortfolio() != null ? user.getPortfolio() : "");
        userData.put("skills", user.getSkills() != null ? user.getSkills() : "");
        userData.put("xp", user.getXp() != null ? user.getXp() : 0);

        List<String> completedTopicsList = new ArrayList<>();
        if (user.getCompletedTopics() != null && !user.getCompletedTopics().isEmpty()) {
            completedTopicsList = Arrays.asList(user.getCompletedTopics().split(","));
        }
        userData.put("completed_topics", completedTopicsList);

        userData.put("streak", user.getStreak() != null ? user.getStreak() : 1);

        List<String> badgesList = new ArrayList<>();
        if (user.getBadges() != null && !user.getBadges().isEmpty()) {
            badgesList = Arrays.asList(user.getBadges().split(","));
        }
        userData.put("badges", badgesList);

        List<String> enrolledCoursesList = new ArrayList<>();
        if (user.getEnrolledCourses() != null && !user.getEnrolledCourses().isEmpty()) {
            enrolledCoursesList = Arrays.asList(user.getEnrolledCourses().split(","));
        }
        userData.put("enrolled_courses", enrolledCoursesList);

        response.put("success", true);
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/profile/update")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, String> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        if (body.containsKey("full_name")) user.setFullName(body.get("full_name"));
        if (body.containsKey("title")) user.setTitle(body.get("title"));
        if (body.containsKey("bio")) user.setBio(body.get("bio"));
        if (body.containsKey("contact_email")) user.setContactEmail(body.get("contact_email"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        if (body.containsKey("location")) user.setLocation(body.get("location"));
        if (body.containsKey("github")) user.setGithub(body.get("github"));
        if (body.containsKey("linkedin")) user.setLinkedin(body.get("linkedin"));
        if (body.containsKey("portfolio")) user.setPortfolio(body.get("portfolio"));
        if (body.containsKey("skills")) user.setSkills(body.get("skills"));

        userRepository.save(user);

        response.put("success", true);
        response.put("message", "Profile updated successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/xp/add")
    public ResponseEntity<Map<String, Object>> addXp(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Object pointsObj = body.get("points");
        int points = 0;
        if (pointsObj instanceof Number) {
            points = ((Number) pointsObj).intValue();
        } else if (pointsObj instanceof String) {
            try {
                points = Integer.parseInt((String) pointsObj);
            } catch (NumberFormatException e) {
                // Ignore
            }
        }

        int currentXp = user.getXp() != null ? user.getXp() : 0;
        user.setXp(currentXp + points);
        userRepository.save(user);

        response.put("success", true);
        response.put("message", "XP added successfully");
        response.put("xp", user.getXp());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/topic/complete")
    public ResponseEntity<Map<String, Object>> completeTopic(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String topicId = (String) body.get("topicId");
        if (topicId == null || topicId.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "topicId is required");
            return ResponseEntity.status(400).body(response);
        }

        Object xpRewardObj = body.get("xpReward");
        int xpReward = 0;
        if (xpRewardObj instanceof Number) {
            xpReward = ((Number) xpRewardObj).intValue();
        } else if (xpRewardObj instanceof String) {
            try {
                xpReward = Integer.parseInt((String) xpRewardObj);
            } catch (NumberFormatException e) {
                // Ignore
            }
        }

        String currentTopics = user.getCompletedTopics() != null ? user.getCompletedTopics() : "";
        List<String> topicsList = new ArrayList<>();
        if (!currentTopics.isEmpty()) {
            topicsList = new ArrayList<>(Arrays.asList(currentTopics.split(",")));
        }

        if (!topicsList.contains(topicId)) {
            topicsList.add(topicId);
            user.setCompletedTopics(String.join(",", topicsList));
            int currentXp = user.getXp() != null ? user.getXp() : 0;
            user.setXp(currentXp + xpReward);
            userRepository.save(user);

            // Auto-generate certificate if track is fully completed
            checkAndGenerateCertificate(user, topicId);
        }

        response.put("success", true);
        response.put("message", "Topic completed successfully");
        response.put("xp", user.getXp());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/badge/unlock")
    public ResponseEntity<Map<String, Object>> unlockBadge(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String badgeId = (String) body.get("badgeId");
        if (badgeId == null || badgeId.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "badgeId is required");
            return ResponseEntity.status(400).body(response);
        }

        String currentBadges = user.getBadges() != null ? user.getBadges() : "";
        List<String> badgesList = new ArrayList<>();
        if (!currentBadges.isEmpty()) {
            badgesList = new ArrayList<>(Arrays.asList(currentBadges.split(",")));
        }

        if (!badgesList.contains(badgeId)) {
            badgesList.add(badgeId);
            user.setBadges(String.join(",", badgesList));
            userRepository.save(user);
        }

        response.put("success", true);
        response.put("message", "Badge unlocked successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/course/enroll")
    public ResponseEntity<Map<String, Object>> enrollCourse(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Object courseIdObj = body.get("courseId");
        if (courseIdObj == null) {
            response.put("success", false);
            response.put("message", "courseId is required");
            return ResponseEntity.status(400).body(response);
        }

        String courseId = String.valueOf(courseIdObj);
        String currentCourses = user.getEnrolledCourses() != null ? user.getEnrolledCourses() : "";
        List<String> coursesList = new ArrayList<>();
        if (!currentCourses.isEmpty()) {
            coursesList = new ArrayList<>(Arrays.asList(currentCourses.split(",")));
        }

        if (!coursesList.contains(courseId)) {
            coursesList.add(courseId);
            user.setEnrolledCourses(String.join(",", coursesList));
            userRepository.save(user);
        }

        response.put("success", true);
        response.put("message", "Enrolled in course successfully");
        return ResponseEntity.ok(response);
    }

    private void updateUserDailyStreak(User user) {
        java.time.LocalDateTime lastLogin = user.getLastLoginAt();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        
        if (lastLogin == null) {
            user.setStreak(1);
            user.setLastLoginAt(now);
            userRepository.save(user);
            return;
        }

        long daysDiff = java.time.temporal.ChronoUnit.DAYS.between(lastLogin.toLocalDate(), now.toLocalDate());
        
        if (daysDiff == 1) {
            user.setStreak((user.getStreak() != null ? user.getStreak() : 0) + 1);
            user.setLastLoginAt(now);
            userRepository.save(user);
        } else if (daysDiff > 1) {
            user.setStreak(1);
            user.setLastLoginAt(now);
            userRepository.save(user);
        }
    }

    private void checkAndGenerateCertificate(User user, String completedTopicId) {
        String track = "";
        String title = "";
        List<String> required = new ArrayList<>();
        
        if (completedTopicId.startsWith("react_")) {
            track = "react";
            title = "Modern Frontend Engineering (React & Vite)";
            required = Arrays.asList("react_intro", "react_jsx", "react_components", "react_props_state", "react_hooks", "react_lifecycle");
        } else if (completedTopicId.startsWith("java_")) {
            track = "java";
            title = "Java Object-Oriented Programming (OOPs)";
            required = Arrays.asList("java_intro", "java_datatypes", "java_oops", "java_exceptions", "java_collections", "java_multithreading");
        } else if (completedTopicId.startsWith("springboot_")) {
            track = "springboot";
            title = "Spring Boot Microservices & Backend Architecture";
            required = Arrays.asList("springboot_intro", "springboot_mvc", "springboot_di", "springboot_jpa", "springboot_rest", "springboot_security");
        }
        
        if (track.isEmpty()) return;
        
        List<String> completed = Arrays.asList(user.getCompletedTopics().split(","));
        if (completed.containsAll(required)) {
            // Check if certificate already exists
            List<StudentCertificate> certs = studentCertificateRepository.findByUserId(user.getId());
            final String finalTitle = title;
            boolean exists = certs.stream().anyMatch(c -> c.getTitle().equals(finalTitle));
            if (!exists) {
                String verificationCode = "CERT-SS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                StudentCertificate certificate = new StudentCertificate(user.getId(), finalTitle, verificationCode, java.time.LocalDateTime.now());
                studentCertificateRepository.save(certificate);
                System.out.println("🎓 Generated certificate: " + finalTitle + " for user " + user.getUsername());
            }
        }
    }

    @GetMapping("/api/leaderboard")
    public ResponseEntity<Map<String, Object>> getLeaderboard() {
        User currentUser = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        List<User> topUsers = userRepository.findTop10ByRoleOrderByXpDesc("STUDENT");
        List<Map<String, Object>> list = new ArrayList<>();

        int rank = 1;
        for (User u : topUsers) {
            Map<String, Object> m = new HashMap<>();
            m.put("rank", rank++);
            m.put("username", u.getUsername());
            m.put("xp", u.getXp() != null ? u.getXp() : 0);
            m.put("isSelf", currentUser != null && currentUser.getId().equals(u.getId()));
            list.add(m);
        }

        response.put("success", true);
        response.put("leaderboard", list);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/quests")
    public ResponseEntity<Map<String, Object>> getQuests() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<Quest> allQuests = questRepository.findAll();
        List<Map<String, Object>> questDataList = new ArrayList<>();

        String claimed = user.getClaimedQuests() != null ? user.getClaimedQuests() : "";
        List<String> claimedList = Arrays.asList(claimed.split(","));

        String completedTopics = user.getCompletedTopics() != null ? user.getCompletedTopics() : "";
        List<String> completedTopicsList = Arrays.asList(completedTopics.split(","));

        // Count completed topics
        long reactCompleted = completedTopicsList.stream().filter(t -> t.startsWith("react_")).count();

        for (Quest quest : allQuests) {
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("id", quest.getId());
            qMap.put("title", quest.getTitle());
            qMap.put("xpReward", quest.getXpReward());

            String status = "IN_PROGRESS";
            String questIdStr = quest.getId().toString();

            if (claimedList.contains(questIdStr)) {
                status = "COMPLETED";
            } else {
                if (quest.getId() == 1) {
                    if (user.getStreak() != null && user.getStreak() >= 1) {
                        status = "CLAIMABLE";
                    }
                } else if (quest.getId() == 2) {
                    if (reactCompleted >= 3 || completedTopicsList.contains("react_lifecycle")) {
                        status = "CLAIMABLE";
                    }
                } else if (quest.getId() == 3) {
                    if (completedTopicsList.contains("springboot_security")) {
                        status = "CLAIMABLE";
                    }
                }
            }
            qMap.put("status", status);
            questDataList.add(qMap);
        }

        response.put("success", true);
        response.put("quests", questDataList);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/quests/claim")
    public ResponseEntity<Map<String, Object>> claimQuest(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Object questIdObj = body.get("questId");
        if (questIdObj == null) {
            response.put("success", false);
            response.put("message", "questId is required");
            return ResponseEntity.status(400).body(response);
        }

        Long questId = Long.parseLong(String.valueOf(questIdObj));
        Quest quest = questRepository.findById(questId).orElse(null);
        if (quest == null) {
            response.put("success", false);
            response.put("message", "Quest not found");
            return ResponseEntity.status(404).body(response);
        }

        String claimed = user.getClaimedQuests() != null ? user.getClaimedQuests() : "";
        List<String> claimedList = new ArrayList<>(Arrays.asList(claimed.split(",")));
        claimedList.removeIf(String::isEmpty);

        String questIdStr = questId.toString();
        if (claimedList.contains(questIdStr)) {
            response.put("success", false);
            response.put("message", "Quest reward already claimed");
            return ResponseEntity.status(400).body(response);
        }

        String completedTopics = user.getCompletedTopics() != null ? user.getCompletedTopics() : "";
        List<String> completedTopicsList = Arrays.asList(completedTopics.split(","));
        long reactCompleted = completedTopicsList.stream().filter(t -> t.startsWith("react_")).count();

        boolean canClaim = false;
        if (questId == 1) {
            canClaim = user.getStreak() != null && user.getStreak() >= 1;
        } else if (questId == 2) {
            canClaim = reactCompleted >= 3 || completedTopicsList.contains("react_lifecycle");
        } else if (questId == 3) {
            canClaim = completedTopicsList.contains("springboot_security");
        }

        if (!canClaim) {
            response.put("success", false);
            response.put("message", "Quest requirements not met yet");
            return ResponseEntity.status(400).body(response);
        }

        claimedList.add(questIdStr);
        user.setClaimedQuests(String.join(",", claimedList));
        int currentXp = user.getXp() != null ? user.getXp() : 0;
        user.setXp(currentXp + quest.getXpReward());
        userRepository.save(user);

        response.put("success", true);
        response.put("message", "Reward claimed successfully!");
        response.put("xp", user.getXp());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/certificates")
    public ResponseEntity<Map<String, Object>> getCertificates() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<StudentCertificate> certs = studentCertificateRepository.findByUserId(user.getId());
        List<Map<String, Object>> certList = new ArrayList<>();

        for (StudentCertificate c : certs) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", c.getVerificationCode());
            m.put("title", c.getTitle());
            String dateStr = c.getIssuedAt().format(java.time.format.DateTimeFormatter.ofPattern("MMMM d, yyyy"));
            m.put("date", dateStr);
            certList.add(m);
        }

        response.put("success", true);
        response.put("certificates", certList);
        return ResponseEntity.ok(response);
    }
}
