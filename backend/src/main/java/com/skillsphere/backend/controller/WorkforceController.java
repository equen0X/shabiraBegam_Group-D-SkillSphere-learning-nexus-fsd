package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.Employee;
import com.skillsphere.backend.model.LeaveRequest;
import com.skillsphere.backend.model.Project;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.EmployeeRepository;
import com.skillsphere.backend.repository.LeaveRequestRepository;
import com.skillsphere.backend.repository.ProjectRepository;
import com.skillsphere.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/workforce")
public class WorkforceController {

    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;

    public WorkforceController(
            EmployeeRepository employeeRepository,
            ProjectRepository projectRepository,
            LeaveRequestRepository leaveRequestRepository,
            UserRepository userRepository) {
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.leaveRequestRepository = leaveRequestRepository;
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

    @GetMapping("/employees")
    public ResponseEntity<Map<String, Object>> getAllEmployees() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<Employee> employees = employeeRepository.findAll();
        response.put("success", true);
        response.put("employees", employees);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/employees")
    public ResponseEntity<Map<String, Object>> createEmployee(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String name = (String) body.get("name");
        String role = (String) body.get("role");
        String dept = (String) body.get("dept");
        String status = body.containsKey("status") ? (String) body.get("status") : "Active";
        
        Object scoreObj = body.get("score");
        int score = 85;
        if (scoreObj instanceof Number) {
            score = ((Number) scoreObj).intValue();
        } else if (scoreObj instanceof String) {
            try { score = Integer.parseInt((String) scoreObj); } catch (Exception ignored) {}
        }

        if (name == null || name.trim().isEmpty() || role == null || role.trim().isEmpty() || dept == null || dept.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Name, role, and dept are required");
            return ResponseEntity.status(400).body(response);
        }

        Employee employee = new Employee(name.trim(), role.trim(), dept.trim(), status, score);
        Employee saved = employeeRepository.save(employee);

        response.put("success", true);
        response.put("employee", saved);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/projects")
    public ResponseEntity<Map<String, Object>> getAllProjects() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<Project> projects = projectRepository.findAll();
        response.put("success", true);
        response.put("projects", projects);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/projects")
    public ResponseEntity<Map<String, Object>> createProject(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String title = (String) body.get("title");
        String assignee = (String) body.get("assignee");
        String priority = body.containsKey("priority") ? (String) body.get("priority") : "Medium";
        
        Object progressObj = body.get("progress");
        int progress = 10;
        if (progressObj instanceof Number) {
            progress = ((Number) progressObj).intValue();
        } else if (progressObj instanceof String) {
            try { progress = Integer.parseInt((String) progressObj); } catch (Exception ignored) {}
        }

        if (title == null || title.trim().isEmpty() || assignee == null || assignee.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Title and assignee are required");
            return ResponseEntity.status(400).body(response);
        }

        Project project = new Project(title.trim(), assignee.trim(), progress, priority);
        Project saved = projectRepository.save(project);

        response.put("success", true);
        response.put("project", saved);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/leaves")
    public ResponseEntity<Map<String, Object>> getAllLeaves() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<LeaveRequest> leaves = leaveRequestRepository.findAll();
        response.put("success", true);
        response.put("leaveRequests", leaves);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/leaves/{id}/decision")
    public ResponseEntity<Map<String, Object>> handleLeaveDecision(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String decision = body.get("decision"); // "APPROVED" or "REJECTED"
        if (decision == null || (!decision.equals("APPROVED") && !decision.equals("REJECTED"))) {
            response.put("success", false);
            response.put("message", "Decision must be either APPROVED or REJECTED");
            return ResponseEntity.status(400).body(response);
        }

        LeaveRequest leaveRequest = leaveRequestRepository.findById(id).orElse(null);
        if (leaveRequest == null) {
            response.put("success", false);
            response.put("message", "Leave request not found");
            return ResponseEntity.status(404).body(response);
        }

        leaveRequest.setStatus(decision);
        leaveRequestRepository.save(leaveRequest);

        // If approved, update matching employee's status to "On Leave"
        if (decision.equals("APPROVED")) {
            Optional<Employee> empOpt = employeeRepository.findByName(leaveRequest.getName());
            if (empOpt.isPresent()) {
                Employee employee = empOpt.get();
                employee.setStatus("On Leave");
                employeeRepository.save(employee);
            }
        }

        response.put("success", true);
        response.put("message", "Leave decision processed successfully");
        return ResponseEntity.ok(response);
    }
}
