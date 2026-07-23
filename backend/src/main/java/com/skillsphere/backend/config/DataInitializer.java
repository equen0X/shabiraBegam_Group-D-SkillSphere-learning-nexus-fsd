package com.skillsphere.backend.config;

import com.skillsphere.backend.model.Comment;
import com.skillsphere.backend.model.Post;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.model.Employee;
import com.skillsphere.backend.model.Project;
import com.skillsphere.backend.model.LeaveRequest;
import com.skillsphere.backend.repository.PostRepository;
import com.skillsphere.backend.repository.UserRepository;
import com.skillsphere.backend.repository.EmployeeRepository;
import com.skillsphere.backend.repository.ProjectRepository;
import com.skillsphere.backend.repository.LeaveRequestRepository;
import com.skillsphere.backend.model.Quest;
import com.skillsphere.backend.repository.QuestRepository;
import com.skillsphere.backend.model.Course;
import com.skillsphere.backend.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final QuestRepository questRepository;
    private final CourseRepository courseRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            PostRepository postRepository,
            EmployeeRepository employeeRepository,
            ProjectRepository projectRepository,
            LeaveRequestRepository leaveRequestRepository,
            QuestRepository questRepository,
            CourseRepository courseRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.questRepository = questRepository;
        this.courseRepository = courseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default test users
        createTestUserIfMissing("sroy", "S Roy", "sroy@gmail.com", "1234", "STUDENT");
        createTestUserIfMissing("student", "Student Demo", "student@skillsphere.com", "1234", "STUDENT");
        createTestUserIfMissing("employee", "Employee Demo", "employee@skillsphere.com", "1234", "EMPLOYEE");
        createTestUserIfMissing("manager", "Manager Demo", "manager@company.com", "1234", "EMPLOYEE");

        // Seed initial posts and comments if database is empty
        if (postRepository.count() == 0) {
            seedDefaultPosts();
        }

        // Seed default employees
        if (employeeRepository.count() == 0) {
            employeeRepository.save(new Employee("Jane Doe", "Full-Stack Engineer", "Engineering", "Active", 92));
            employeeRepository.save(new Employee("Mark Smith", "Product Manager", "Product", "Active", 88));
            employeeRepository.save(new Employee("NeonCoder", "UX Developer", "Design", "Active", 95));
            employeeRepository.save(new Employee("Sarah Jenkins", "DevOps specialist", "Infrastructure", "On Leave", 85));
            System.out.println("✅ DataInitializer: Seeded default employees");
        }

        // Seed default projects
        if (projectRepository.count() == 0) {
            projectRepository.save(new Project("SkillSphere Mobile Platform Upgrade", "NeonCoder", 60, "High"));
            projectRepository.save(new Project("OAuth2 & JWT Token Upgrades", "Jane Doe", 35, "Medium"));
            projectRepository.save(new Project("Vite 6 Migration Strategy", "Sarah Jenkins", 80, "Low"));
            System.out.println("✅ DataInitializer: Seeded default projects");
        }

        // Seed default leave requests
        if (leaveRequestRepository.count() == 0) {
            leaveRequestRepository.save(new LeaveRequest("Sarah Jenkins", "Sick Leave", "Requires 2 days off following dental surgery. (June 18-19)", "PENDING"));
            leaveRequestRepository.save(new LeaveRequest("Mark Smith", "Casual Leave", "Annual family getaway (3 days). (July 2-4)", "PENDING"));
            System.out.println("✅ DataInitializer: Seeded default leave requests");
        }

        // Seed default quests
        if (questRepository.count() == 0) {
            questRepository.save(new Quest("Log in and maintain your daily streak", 50));
            questRepository.save(new Quest("Complete the React architecture practice quiz", 150));
            questRepository.save(new Quest("Solve the Spring Boot security challenge", 200));
            System.out.println("✅ DataInitializer: Seeded default quests");
        }

        // Seed default courses
        if (courseRepository.count() == 0) {
            courseRepository.save(new Course("Frontend System Design", "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop", true, 999, "English", "4.8", "5K+", "Go from Zero to Hero in Frontend System Design. Master large-scale application architecture."));
            courseRepository.save(new Course("React", "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop", true, 499, "English", "4.7", "40K+", "Master React.js. Learn from the ground up and build real-world applications with ease."));
            courseRepository.save(new Course("JavaScript", "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=400&fit=crop", false, 0, "English", "4.8", "50K+", "A pure in-depth JavaScript Course released for Free."));
            courseRepository.save(new Course("Data Structures & Algorithms (DSA)", "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop", true, 1499, "English", "4.9", "100K+", "Comprehensive DSA bootcamp for FAANG interviews. Covers arrays, trees, dynamic programming and more."));
            courseRepository.save(new Course("Generative AI Engineering", "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop", true, 1999, "English", "4.9", "12K+", "Learn to build LLM applications, RAG pipelines, and integrate AI into your software."));
            courseRepository.save(new Course("Machine Learning Foundations", "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop", false, 0, "English", "4.6", "25K+", "A beginner-friendly guide to Machine Learning concepts, models, and Python implementation."));
            courseRepository.save(new Course("Advanced Node.js & Microservices", "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop", true, 799, "English", "4.7", "18K+", "Scale your backend architecture. Learn Docker, Kubernetes, and Node.js microservices."));
            courseRepository.save(new Course("Fullstack Next.js 14", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop", true, 1299, "English", "4.8", "30K+", "Build SEO-friendly, highly performant web applications using App Router and Server Actions."));
            courseRepository.save(new Course("Web3 & Solidity Development", "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&h=400&fit=crop", true, 1999, "English", "4.5", "8K+", "Master blockchain development, smart contracts, and decentralized application (dApp) design."));
            courseRepository.save(new Course("Cloud Computing with AWS", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop", false, 0, "English", "4.7", "55K+", "Get certified. Learn EC2, S3, Lambda, and complete AWS infrastructure management."));
            courseRepository.save(new Course("Python for Data Science", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop", true, 899, "English", "4.8", "60K+", "Master Pandas, NumPy, Matplotlib, and data analysis techniques using Python."));
            courseRepository.save(new Course("UI/UX Design Masterclass", "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop", true, 699, "English", "4.9", "22K+", "Learn Figma, design thinking, user research, and build stunning user interfaces."));
            System.out.println("✅ DataInitializer: Seeded default courses");
        }
    }

    private void createTestUserIfMissing(String username, String fullName, String email, String password, String role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setRole(role);
            user.setProvider("LOCAL");
            user.setIsActive(true);
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
            System.out.println("✅ DataInitializer: Created test user -> " + email);
        }
    }

    private void seedDefaultPosts() {
        Post post1 = new Post(
            "Alexis Mangin", "A", "Frontend Architect", "System Design",
            "How do you handle micro-frontend state sync across independent React apps?",
            "When splitting a large monolithic web application into micro-frontends using Webpack Module Federation, what is your preferred approach for sharing global auth tokens and theme states without tight coupling?"
        );
        post1.setUpvotes(24);
        post1.getComments().add(new Comment("CypherLearner", "We use CustomEvent bus on the window object combined with RxJS behavior subjects for decoupled pub/sub events!"));
        post1.getComments().add(new Comment("NeonCoder", "Single-SPA with shared React Context wrappers works great for auth headers."));

        Post post2 = new Post(
            "Hitesh Choudhary", "H", "Senior Educator", "React & Frontend",
            "Common React 19 useActionState gotchas for beginners",
            "React 19 introduces useActionState and Server Actions. Make sure you return structured objects containing error messages and pending states instead of mutating local component state manually!"
        );
        post2.setUpvotes(42);
        post2.getComments().add(new Comment("ByteKnight", "Super helpful tip! The optimistic UI updates with useOptimistic are also incredible."));

        Post post3 = new Post(
            "Andrew Ng", "A", "AI Lead", "Generative AI",
            "RAG vs Fine-Tuning: Which should you choose for enterprise docs?",
            "If your underlying knowledge base changes daily or weekly, RAG (Retrieval Augmented Generation) with Vector DBs like Pinecone/FAISS is far superior and more cost-effective than continuous LLM fine-tuning."
        );
        post3.setUpvotes(56);
        post3.getComments().add(new Comment("SynthGuru", "Agreed! HyDE (Hypothetical Document Embeddings) improved our RAG precision by 30%."));

        Post post4 = new Post(
            "Java Guru", "J", "Backend Lead", "Java & Backend",
            "Spring Boot Virtual Threads (Project Loom) performance benchmark",
            "Switching from standard Tomcat thread pools to Spring Boot 3.2 Virtual Threads handled 10,000 concurrent HTTP requests with 80% less memory allocation on JRE 21!"
        );
        post4.setUpvotes(31);

        postRepository.save(post1);
        postRepository.save(post2);
        postRepository.save(post3);
        postRepository.save(post4);

        System.out.println("✅ DataInitializer: Seeded default discussions posts");
    }
}
