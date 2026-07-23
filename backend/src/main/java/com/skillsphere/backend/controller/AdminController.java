package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.Course;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.CourseRepository;
import com.skillsphere.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public AdminController(CourseRepository courseRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    // Courses Endpoints
    @GetMapping("/courses")
    public ResponseEntity<Map<String, Object>> getCourses() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("courses", courseRepository.findAll());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/courses")
    public ResponseEntity<Map<String, Object>> saveCourse(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        
        Long id = body.containsKey("id") && body.get("id") != null ? Long.parseLong(body.get("id").toString()) : null;
        String title = (String) body.get("title");
        String image = (String) body.get("image");
        Boolean isPremium = body.containsKey("isPremium") ? (Boolean) body.get("isPremium") : false;
        
        Object priceObj = body.get("price");
        int price = 0;
        if (priceObj instanceof Number) {
            price = ((Number) priceObj).intValue();
        } else if (priceObj instanceof String) {
            try { price = Integer.parseInt((String) priceObj); } catch (Exception ignored) {}
        }
        
        String language = body.containsKey("language") ? (String) body.get("language") : "English";
        String rating = body.containsKey("rating") ? (String) body.get("rating") : "4.5";
        String reviews = body.containsKey("reviews") ? (String) body.get("reviews") : "1K+";
        String description = (String) body.get("description");

        if (title == null || title.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Course title is required");
            return ResponseEntity.status(400).body(response);
        }

        Course course;
        if (id != null) {
            Optional<Course> opt = courseRepository.findById(id);
            if (opt.isPresent()) {
                course = opt.get();
                course.setTitle(title.trim());
                course.setImage(image);
                course.setIsPremium(isPremium);
                course.setPrice(price);
                course.setLanguage(language);
                course.setRating(rating);
                course.setReviews(reviews);
                course.setDescription(description);
            } else {
                course = new Course(title.trim(), image, isPremium, price, language, rating, reviews, description);
            }
        } else {
            course = new Course(title.trim(), image, isPremium, price, language, rating, reviews, description);
        }

        Course saved = courseRepository.save(course);
        response.put("success", true);
        response.put("course", saved);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Map<String, Object>> deleteCourse(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            response.put("success", true);
            response.put("message", "Course deleted successfully");
            return ResponseEntity.ok(response);
        }
        response.put("success", false);
        response.put("message", "Course not found");
        return ResponseEntity.status(404).body(response);
    }

    // Users Endpoints
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("users", userRepository.findAll());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/{id}/toggle-status")
    public ResponseEntity<Map<String, Object>> toggleUserStatus(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        Optional<User> opt = userRepository.findById(id);
        if (opt.isPresent()) {
            User u = opt.get();
            u.setIsActive(!u.getIsActive());
            userRepository.save(u);
            response.put("success", true);
            response.put("message", "User status updated successfully");
            response.put("user", u);
            return ResponseEntity.ok(response);
        }
        response.put("success", false);
        response.put("message", "User not found");
        return ResponseEntity.status(404).body(response);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            response.put("success", true);
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        }
        response.put("success", false);
        response.put("message", "User not found");
        return ResponseEntity.status(404).body(response);
    }
}
