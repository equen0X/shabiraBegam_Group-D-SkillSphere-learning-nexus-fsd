package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.Comment;
import com.skillsphere.backend.model.Post;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.PostRepository;
import com.skillsphere.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/discussions")
public class DiscussionController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public DiscussionController(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
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

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllDiscussions() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<Post> posts = postRepository.findAll();
        // Sort posts by id descending to show newest first
        posts.sort((p1, p2) -> p2.getId().compareTo(p1.getId()));

        List<Map<String, Object>> mappedPosts = posts.stream().map(post -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", post.getId());
            map.put("author", post.getAuthor());
            map.put("avatar", post.getAvatar());
            map.put("role", post.getRole());
            map.put("category", post.getCategory());
            map.put("title", post.getTitle());
            map.put("content", post.getContent());
            map.put("upvotes", post.getUpvotes());

            // Check if current user has upvoted this post
            String upvotedUsers = post.getUpvotedUsers() != null ? post.getUpvotedUsers() : "";
            List<String> upvotedList = Arrays.asList(upvotedUsers.split(","));
            map.put("isUpvoted", upvotedList.contains(user.getId().toString()));

            // Map comments
            List<Map<String, Object>> mappedComments = post.getComments().stream().map(comment -> {
                Map<String, Object> cMap = new HashMap<>();
                cMap.put("id", comment.getId());
                cMap.put("author", comment.getAuthor());
                cMap.put("text", comment.getText());
                cMap.put("time", "Just now");
                return cMap;
            }).collect(Collectors.toList());

            map.put("comments", mappedComments);
            map.put("time", "Just now");
            return map;
        }).collect(Collectors.toList());

        response.put("success", true);
        response.put("posts", mappedPosts);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(@RequestBody Map<String, String> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String title = body.get("title");
        String content = body.get("content");
        String category = body.get("category");

        if (title == null || title.trim().isEmpty() || content == null || content.trim().isEmpty() || category == null || category.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Title, content, and category are required");
            return ResponseEntity.status(400).body(response);
        }

        String authorName = user.getFullName() != null && !user.getFullName().isEmpty() ? user.getFullName() : user.getUsername();
        String avatar = authorName.substring(0, 1).toUpperCase();
        String role = user.getRole();

        Post post = new Post(authorName, avatar, role, category, title, content);
        Post savedPost = postRepository.save(post);

        response.put("success", true);
        response.put("post", savedPost);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/comment")
    public ResponseEntity<Map<String, Object>> addComment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String text = body.get("text");
        if (text == null || text.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Comment text is required");
            return ResponseEntity.status(400).body(response);
        }

        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            response.put("success", false);
            response.put("message", "Post not found");
            return ResponseEntity.status(404).body(response);
        }

        String authorName = user.getFullName() != null && !user.getFullName().isEmpty() ? user.getFullName() : user.getUsername();
        Comment comment = new Comment(authorName, text.trim());
        post.getComments().add(comment);
        postRepository.save(post);

        response.put("success", true);
        response.put("message", "Comment added successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<Map<String, Object>> toggleUpvote(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            response.put("success", false);
            response.put("message", "Post not found");
            return ResponseEntity.status(404).body(response);
        }

        String userIdStr = user.getId().toString();
        String upvotedUsers = post.getUpvotedUsers() != null ? post.getUpvotedUsers() : "";
        List<String> upvotedList = new ArrayList<>(Arrays.asList(upvotedUsers.split(",")));
        upvotedList.removeIf(String::isEmpty);

        boolean isUpvoted;
        if (upvotedList.contains(userIdStr)) {
            upvotedList.remove(userIdStr);
            post.setUpvotes(Math.max(0, post.getUpvotes() - 1));
            isUpvoted = false;
        } else {
            upvotedList.add(userIdStr);
            post.setUpvotes(post.getUpvotes() + 1);
            isUpvoted = true;
        }

        post.setUpvotedUsers(String.join(",", upvotedList));
        postRepository.save(post);

        response.put("success", true);
        response.put("upvotes", post.getUpvotes());
        response.put("isUpvoted", isUpvoted);
        return ResponseEntity.ok(response);
    }
}
