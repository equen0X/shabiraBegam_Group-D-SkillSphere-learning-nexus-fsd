import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";
import "../styles/learningPage.css";

export default function LearningPage() {
  const { user, completedTopics, completeTopic, earnXp } = useAuth();
  const navigate = useNavigate();

  // Active track selection
  const [activeTrack, setActiveTrack] = useState("react"); // "react", "java", "springboot"
  
  // Selected topic ID within track ("react_intro", ..., or "quiz")
  const [activeTopicId, setActiveTopicId] = useState("react_intro");

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);

  // Track configurations
  const tracks = {
    react: {
      name: "React Developer",
      class: "react",
      instructor: "Hitesh Choudhary",
      videoTitle: "React JS One Shot Complete Course (Chai aur Code)",
      videoId: "eILUmHJ_5_8",
      badgeName: "React Master Badge",
      badgeKey: "react_badge",
      topics: [
        {
          id: "react_intro",
          title: "1. React Introduction",
          xp: 100,
          content: (
            <div>
              <p>React is an open-source JavaScript library developed by Facebook for building user interfaces, specifically single-page applications. It allows developers to create reusable UI components.</p>
              <p><strong>Key Concept: The Virtual DOM</strong></p>
              <p>Instead of manipulating the browser's DOM directly (which is slow), React creates an in-memory data structure cache called the Virtual DOM. When a component changes, React computes the diff and updates only the altered elements in the real DOM.</p>
              <pre>
                <code>{`// Basic React Render Code Example
import React from 'react';
import ReactDOM from 'react-dom/client';

const heading = <h1>Hello, SkillSphere!</h1>;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(heading);`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "react_jsx",
          title: "2. React JSX Syntax",
          xp: 100,
          content: (
            <div>
              <p>JSX stands for JavaScript XML. It is a syntax extension for JavaScript that allows you to write HTML-like structures directly inside your JavaScript code.</p>
              <p><strong>JSX Rules:</strong></p>
              <ul>
                <li>Must return a single root element (wrap elements in a Fragment <code>&lt;&gt;&lt;/&gt;</code> or div).</li>
                <li>Close all tags explicitly (e.g. <code>&lt;br /&gt;</code>).</li>
                <li>Use camelCase for HTML attributes (e.g., <code>className</code> instead of <code>class</code>).</li>
              </ul>
              <pre>
                <code>{`// JSX Expression Embedding Example
const username = "CypherCoder";
const element = (
  <div>
    <h2>Welcome, {username}!</h2>
    <p>Current Time: {new Date().toLocaleTimeString()}</p>
  </div>
);`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "react_components",
          title: "3. Functional Components",
          xp: 150,
          content: (
            <div>
              <p>Components are the building blocks of any React application. Modern React uses Functional Components, which are simply JavaScript functions returning JSX code.</p>
              <pre>
                <code>{`// Functional Component Example
import React from 'react';

function ProfileCard(props) {
  return (
    <div className="profile-card">
      <h3>Name: {props.name}</h3>
      <p>Role: {props.role}</p>
    </div>
  );
}

export default ProfileCard;`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "react_props_state",
          title: "4. State & Props",
          xp: 150,
          content: (
            <div>
              <p><strong>Props</strong> are read-only variables passed from parent components down to child components. They cannot be modified inside the child component.</p>
              <p><strong>State</strong> represents data private to the component that can change over time. Updating state triggers a component re-render.</p>
              <pre>
                <code>{`// State Counter Hook Example
import React, { useState } from 'react';

function ClickCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click Me
      </button>
    </div>
  );
}`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "react_hooks",
          title: "5. React Hooks (useEffect)",
          xp: 200,
          content: (
            <div>
              <p>Hooks let you use state and other React features without writing a class component. The <code>useEffect</code> hook allows you to perform side effects (such as fetching data or API calls) in functional components.</p>
              <pre>
                <code>{`// useEffect API Fetch Hook Example
import React, { useState, useEffect } from 'react';

function UserLoader() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch('https://api.github.com/users/octocat')
      .then(res => res.json())
      .then(data => setUserData(data));
  }, []); // Empty dependency array run on mount only

  return userData ? <p>User: {userData.name}</p> : <p>Loading...</p>;
}`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "react_lifecycle",
          title: "6. React Component Lifecycle",
          xp: 150,
          content: (
            <div>
              <p>React components go through three primary lifecycle phases:</p>
              <ul>
                <li><strong>Mounting</strong>: Component is created and inserted into the DOM (e.g. <code>useEffect</code> runs).</li>
                <li><strong>Updating</strong>: State changes or Props update, re-rendering the component.</li>
                <li><strong>Unmounting</strong>: Component is removed from the DOM (e.g. return statement cleanups in <code>useEffect</code>).</li>
              </ul>
              <pre>
                <code>{`// Cleanup Function Example inside useEffect
useEffect(() => {
  const handleScroll = () => console.log(window.scrollY);
  window.addEventListener('scroll', handleScroll);

  return () => {
    // Unmounting cleanup removes listeners
    window.removeEventListener('scroll', handleScroll);
  };
}, []);`}</code>
              </pre>
            </div>
          )
        }
      ],
      quiz: [
        {
          q: "What is the primary function of the Virtual DOM in React?",
          options: [
            "To directly modify the browser's real HTML document structure.",
            "To compute changes in memory and batch update only altered real DOM nodes.",
            "To serve as a database storage layer for client sessions.",
            "To bind styles statically on compiling."
          ],
          correct: 1
        },
        {
          q: "Which of the following is NOT a rule of JSX?",
          options: [
            "Must return a single root element (Fragment or div).",
            "Tags must be explicitly closed (e.g. <br />).",
            "Use standard lowercase class attributes for styling.",
            "HTML attributes must use camelCase naming (e.g. className)."
          ],
          correct: 2
        },
        {
          q: "What is the key difference between props and state in React?",
          options: [
            "State is read-only, props can be mutated inside the child component.",
            "Props are private, state is public.",
            "Props are immutable data passed down, state is mutable local component data.",
            "State is managed by parent components, props by the child."
          ],
          correct: 2
        },
        {
          q: "How do you run a useEffect hook ONLY once on component mount?",
          options: [
            "Omit the dependency array completely.",
            "Pass an empty array [] as the second parameter.",
            "Pass the variable inside the array [variable].",
            "Call useEffect inside an if-statement."
          ],
          correct: 1
        },
        {
          q: "Which hook is used to manage local state in functional components?",
          options: [
            "useEffect",
            "useContext",
            "useState",
            "useReducer"
          ],
          correct: 2
        }
      ]
    },
    java: {
      name: "Java Master",
      class: "java",
      instructor: "Striver (takeUforward) / Kunal Kushwaha",
      videoTitle: "Java OOPs Concepts, Inheritance & Polymorphism Classes",
      videoId: "bSrmtUscR_4",
      badgeName: "Java Master Badge",
      badgeKey: "java_badge",
      topics: [
        {
          id: "java_intro",
          title: "1. Java JVM, JRE & JDK",
          xp: 100,
          content: (
            <div>
              <p>Java is a robust, class-based, object-oriented programming language designed to have as few implementation dependencies as possible (Write Once, Run Anywhere - WORA).</p>
              <p><strong>Architecture Stack:</strong></p>
              <ul>
                <li><strong>JVM (Java Virtual Machine)</strong>: Executes compiled Java Bytecode (.class files).</li>
                <li><strong>JRE (Java Runtime Environment)</strong>: Contains the JVM and standard libraries to run Java apps.</li>
                <li><strong>JDK (Java Development Kit)</strong>: Complete kit to develop Java applications, containing JRE, compiler (javac), and debugger tools.</li>
              </ul>
              <pre>
                <code>{`// Standard Java Hello World Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java World!");
    }
}`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "java_datatypes",
          title: "2. Data Types & Variables",
          xp: 100,
          content: (
            <div>
              <p>Java is a strongly typed language, meaning every variable must be declared with a data type before compilation.</p>
              <p><strong>Primitive Types</strong>: byte, short, int, long, float, double, boolean, char.</p>
              <p><strong>Reference Types</strong>: Strings, Arrays, Classes, Interfaces. They store references/memory address pointers to objects.</p>
              <pre>
                <code>{`// Declaring primitives and Reference Types in Java
int score = 450;
double price = 99.99;
boolean isActive = true;
String banner = "Welcome to SkillSphere Learning!";`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "java_oops",
          title: "3. Core OOPs Pillars",
          xp: 200,
          content: (
            <div>
              <p>Java is heavily anchored in Object-Oriented Programming (OOPs) structured around four pillars:</p>
              <ul>
                <li><strong>Inheritance</strong>: Child classes derive fields/methods from parent classes using <code>extends</code>.</li>
                <li><strong>Polymorphism</strong>: Methods perform different tasks based on object inputs (Overloading & Overriding).</li>
                <li><strong>Encapsulation</strong>: Restricting direct variable modifications using private scopes and public getters/setters.</li>
                <li><strong>Abstraction</strong>: Hiding complex logic using abstract classes or interfaces.</li>
              </ul>
              <pre>
                <code>{`// Abstract Class and Inheritance Example
abstract class Animal {
    public abstract void makeSound();
}

class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof Woof!");
    }
}`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "java_exceptions",
          title: "4. Exception Handling",
          xp: 150,
          content: (
            <div>
              <p>Exceptions are events that disrupt the normal flow of instructions. Java uses <code>try-catch-finally</code> blocks to handle errors gracefully.</p>
              <pre>
                <code>{`// Exception Try Catch Example
public class ExceptionTest {
    public static void main(String[] args) {
        try {
            int quotient = 100 / 0; // Throws ArithmeticException
        } catch (ArithmeticException e) {
            System.err.println("Math error: division by zero!");
        } finally {
            System.out.println("This block always executes.");
        }
    }
}`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "java_collections",
          title: "5. Collections Framework",
          xp: 200,
          content: (
            <div>
              <p>The Java Collections Framework provides an architecture to store and manipulate a group of objects dynamically.</p>
              <ul>
                <li><strong>List</strong>: Ordered list allowing duplicates (e.g. <code>ArrayList</code>, <code>LinkedList</code>).</li>
                <li><strong>Set</strong>: Unordered list rejecting duplicates (e.g. <code>HashSet</code>).</li>
                <li><strong>Map</strong>: Key-Value pairs mapping unique identifiers (e.g. <code>HashMap</code>).</li>
              </ul>
              <pre>
                <code>{`// HashMap Collection Example
import java.util.HashMap;

public class CollectionsTest {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        map.put("CypherLearner", 2450);
        map.put("NeonCoder", 2900);
        
        System.out.println("XP: " + map.get("CypherLearner"));
    }
}`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "java_multithreading",
          title: "6. Java Multithreading",
          xp: 200,
          content: (
            <div>
              <p>Multithreading is a Java feature that allows concurrent execution of two or more threads for maximum CPU utilization.</p>
              <pre>
                <code>{`// Runnable Thread Example
class Task implements Runnable {
    public void run() {
        System.out.println("Running task inside thread: " + 
                           Thread.currentThread().getName());
    }
}

public class ThreadTest {
    public static void main(String[] args) {
        Thread thread = new Thread(new Task());
        thread.start(); // Starts the thread
    }
}`}</code>
              </pre>
            </div>
          )
        }
      ],
      quiz: [
        {
          q: "Which component of the Java architecture compiles code into bytecode?",
          options: [
            "JVM (Java Virtual Machine)",
            "JRE (Java Runtime Environment)",
            "JDK (which invokes javac compiler)",
            "JIT Compiler"
          ],
          correct: 2
        },
        {
          q: "What OOPs pillar is represented by extending a class and reusing its methods?",
          options: [
            "Encapsulation",
            "Inheritance",
            "Polymorphism",
            "Abstraction"
          ],
          correct: 1
        },
        {
          q: "What block is guaranteed to execute regardless of whether an exception is thrown?",
          options: [
            "try block",
            "catch block",
            "finally block",
            "throws block"
          ],
          correct: 2
        },
        {
          q: "Which collection interface rejects duplicate elements?",
          options: [
            "List",
            "Map",
            "Set",
            "Queue"
          ],
          correct: 2
        },
        {
          q: "How do you start a new Thread using a class that implements Runnable?",
          options: [
            "Call the run() method directly.",
            "Instantiate a Thread object passing the Runnable task, and call start().",
            "Use the start() keyword on the Runnable reference.",
            "Java runs Runnable classes automatically on compile."
          ],
          correct: 1
        }
      ]
    },
    springboot: {
      name: "Spring Boot Pro",
      class: "springboot",
      instructor: "Telusko (Navin Reddy)",
      videoTitle: "Spring Boot Core Framework & Microservices Course",
      videoId: "35EQXmHKZYs",
      badgeName: "Spring Boot Master Badge",
      badgeKey: "springboot_badge",
      topics: [
        {
          id: "springboot_intro",
          title: "1. Spring Boot Introduction",
          xp: 100,
          content: (
            <div>
              <p>Spring Boot is an extension of the Spring Framework that simplifies the bootstrapping and development of production-ready web applications by eliminating complex XML configurations.</p>
              <p><strong>Primary Features:</strong></p>
              <ul>
                <li><strong>Auto-Configuration</strong>: Automatically configures classes based on jar dependencies added to the project.</li>
                <li><strong>Starter Dependencies</strong>: Simplifies Maven/Gradle dependency imports using opinionated bundles.</li>
                <li><strong>Embedded Servers</strong>: Runs apps directly using built-in Tomcat (no external WAR deployment required).</li>
              </ul>
              <pre>
                <code>{`// Main Application class template
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "springboot_mvc",
          title: "2. Controllers & Mappings",
          xp: 150,
          content: (
            <div>
              <p>Spring Boot MVC uses the RestController annotation to build REST endpoints routing web requests directly to methods.</p>
              <pre>
                <code>{`// Spring Boot RestController Example
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {
    
    @GetMapping("/api/greet")
    public String getGreeting() {
        return "Greeting from SkillSphere Spring Boot microservice!";
    }
}`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "springboot_di",
          title: "3. Dependency Injection",
          xp: 150,
          content: (
            <div>
              <p>Spring Core manages Dependency Injection (DI) through IoC (Inversion of Control) Containers. Class beans are registered using Component annotations and injected using <code>@Autowired</code>.</p>
              <pre>
                <code>{`// Service Injection Example
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class XpService {
    public int getMockXp() { return 2450; }
}

// Controller using injection
@RestController
class XpController {
    @Autowired
    private XpService xpService;
}`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "springboot_jpa",
          title: "4. Spring Data JPA Repository",
          xp: 200,
          content: (
            <div>
              <p>Spring Data JPA simplifies database database layers by providing automatic CrudRepository interfaces, mapping SQL queries from method name declarations.</p>
              <pre>
                <code>{`// JPA Entity and Repository Mapping Template
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;

@Entity
class UserProfile {
    @Id
    private String email;
    private int xpPoints;
}

interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    // Generates select * from user_profile where xp_points > ?
    List<UserProfile> findByXpPointsGreaterThan(int xpValue);
}`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "springboot_rest",
          title: "5. Spring REST API & Responses",
          xp: 200,
          content: (
            <div>
              <p>Spring Boot endpoints handle complex model object inputs via JSON serialization, binding payloads with `@RequestBody` and returning details using `@ResponseBody` inside response templates.</p>
              <pre>
                <code>{`// Rest Post mapping with ResponseEntity template
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

@PostMapping("/api/xp/add")
public ResponseEntity<String> addXp(@RequestBody XpPayload payload) {
    if (payload.getPoints() <= 0) {
        return ResponseEntity.badRequest().body("Invalid point rewards!");
    }
    return ResponseEntity.ok("Successfully added " + payload.getPoints() + " XP!");
}`}</code>
              </pre>
            </div>
          )
        },
        {
          id: "springboot_security",
          title: "6. Spring Boot Security & JWT",
          xp: 250,
          content: (
            <div>
              <p>Spring Security is the standard framework providing authentication, authorization, and protection against common web threats (like CSRF, SQL injections).</p>
              <pre>
                <code>{`// Basic Web Security Configure Bean
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests()
            .requestMatchers("/api/public/**").permitAll()
            .anyRequest().authenticated();
        return http.build();
    }
}`}</code>
              </pre>
            </div>
          )
        }
      ],
      quiz: [
        {
          q: "How does Spring Boot run web applications without external server installations?",
          options: [
            "It compiles code directly into native OS desktop binaries.",
            "It packages an embedded Tomcat server inside the executable build JAR.",
            "It uses JRE browser plugins to run bytecode dynamically.",
            "It requires Apache HTTP Server to serve static resources."
          ],
          correct: 1
        },
        {
          q: "Which annotation tells Spring Boot that a class routes API requests directly?",
          options: [
            "@Service",
            "@Component",
            "@RestController",
            "@Repository"
          ],
          correct: 2
        },
        {
          q: "What mechanism does @Autowired trigger in Spring Core?",
          options: [
            "Garbage collection of old controller variables.",
            "Automatic dependency injection of registered beans.",
            "Encryption of database JPA password fields.",
            "Compilation of custom SQL query mappings."
          ],
          correct: 1
        },
        {
          q: "What database mapping technology does Spring Data JPA integrate by default?",
          options: [
            "MongoDB document loader",
            "Redis Cache interface",
            "Hibernate ORM engine",
            "ElasticSearch index mappings"
          ],
          correct: 2
        },
        {
          q: "How do you map custom HTTP response headers and status codes in Spring Controllers?",
          options: [
            "By returning a raw String message value.",
            "By mapping the return using @ResponseBody only.",
            "By wrapping returns in a ResponseEntity<T> container object.",
            "By throwing custom RuntimeExceptions."
          ],
          correct: 2
        }
      ]
    }
  };

  // Get current active track configuration
  const currentTrack = tracks[activeTrack];

  // Get current active topic configuration
  const currentTopic = currentTrack.topics.find(t => t.id === activeTopicId) || currentTrack.topics[0];

  // Calculate track progress
  const trackTopicIds = currentTrack.topics.map(t => t.id);
  const completedInTrackCount = trackTopicIds.filter(id => completedTopics.includes(id)).length;
  const trackProgressPct = Math.round((completedInTrackCount / currentTrack.topics.length) * 100);

  const handleTrackChange = (trackKey) => {
    setActiveTrack(trackKey);
    // Set default topic to first topic in selected track
    const firstTopicId = tracks[trackKey].topics[0].id;
    setActiveTopicId(firstTopicId);
    
    // Reset local quiz state
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setBadgeUnlocked(false);
  };

  const handleOptionSelect = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    if (!user) return;
    
    let correctCount = 0;
    currentTrack.quiz.forEach((question, idx) => {
      if (quizAnswers[idx] === question.correct) {
        correctCount++;
      }
    });

    const marks = correctCount * 4; // Max 20 marks
    const pct = (marks / 20) * 100;
    setQuizScore(marks);
    setQuizSubmitted(true);

    const isQuizPassedKey = `completed_quiz_${activeTrack}_${user.email || user.username}`;
    const wasQuizPreviouslyPassed = localStorage.getItem(isQuizPassedKey);

    // Dynamic XP Reward: 15 XP per Mark (Max 300 XP per track)
    if (!wasQuizPreviouslyPassed) {
      earnXp(marks * 15);
      localStorage.setItem(isQuizPassedKey, "true");
    }

    // Badge Unlock: 85% score threshold (>= 17 marks, i.e. 5/5 correct)
    if (pct >= 85) {
      localStorage.setItem(`badge_${currentTrack.badgeKey}_${user.email || user.username}`, "true");
      setBadgeUnlocked(true);
    } else {
      setBadgeUnlocked(false);
    }
  };

  const isRegisteredStudent = user && user.role === "STUDENT";

  if (!isRegisteredStudent) {
    return (
      <div className="learning-portal-page">
        <Background />
        <Navbar />

        <main className="learning-portal-content">
          
          {/* Header Title Section */}
          <section className="lp-header-section guest-hero">
            <div className="lp-badge" style={{
              display: 'inline-block',
              background: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              color: '#00e5ff',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontFamily: 'Orbitron, sans-serif',
              marginBottom: '15px'
            }}>
              🎓 SKILLSPHERE ACADEMY
            </div>
            <h1 style={{ marginBottom: '15px' }}>Explore Professional Code Tracks</h1>
            <p>We provide hands-on modules in React, Java, and Spring Boot. Pass assessments, earn verifiable cyber-badges, and track your metrics!</p>
          </section>

          {/* Grid of Courses */}
          <div className="guest-courses-grid">
            {Object.keys(tracks).map((trackKey) => {
              const track = tracks[trackKey];
              return (
                <div key={trackKey} className={`guest-course-card ${trackKey}`}>
                  <div className="guest-card-header">
                    <span className="guest-course-icon">
                      {trackKey === "react" ? "⚛️" : trackKey === "java" ? "☕" : "🍃"}
                    </span>
                    <span className="guest-chapters-count">{track.topics.length} Chapters</span>
                  </div>
                  
                  <h3>{track.name}</h3>
                  <p className="guest-instructor">Led by <strong>{track.instructor}</strong></p>
                  
                  <div className="guest-badge-preview">
                    <span>🏆 Reward Badge:</span> <strong>{track.badgeName}</strong>
                  </div>

                  <div className="guest-syllabus-box">
                    <h4>Syllabus Overview</h4>
                    <ul>
                      {track.topics.map((t) => (
                        <li key={t.id}>{t.title}</li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    className="guest-unlock-btn"
                    onClick={() => navigate('/register', { state: { role: 'STUDENT', step: 2 } })}
                  >
                    Start Course Now
                  </button>
                </div>
              );
            })}
          </div>

          {/* Locked Features Callout */}
          <section className="guest-locked-callout">
            <div className="lock-icon">🔒</div>
            <h2>Unlock Full Interactive Learning Suite</h2>
            <p>
              Register a free Student account to gain full access to the video libraries, active reading sandbox modules, real-time code complete rewards, and badge-unlocking final assessments.
            </p>
            <div className="guest-cta-buttons">
              <button className="cta-register-btn" onClick={() => navigate('/register', { state: { role: 'STUDENT', step: 2 } })}>
                Register Student Profile
              </button>
              <button className="cta-login-btn" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="learning-portal-page">
      <Background />
      <Navbar />

      <main className="learning-portal-content">
        
        {/* Header Title Section */}
        <section className="lp-header-section">
          <h1>Learning Curriculum Portal</h1>
          <p>Read programming modules in React, Java, and Spring Boot. Pass final track challenges to unlock cyber-badges!</p>
        </section>

        {/* Track Selector Tabs */}
        <section className="lp-track-tabs">
          <button 
            className={`lp-tab-btn react ${activeTrack === "react" ? "active" : ""}`}
            onClick={() => handleTrackChange("react")}
          >
            ⚛️ React Development
          </button>
          <button 
            className={`lp-tab-btn java ${activeTrack === "java" ? "active" : ""}`}
            onClick={() => handleTrackChange("java")}
          >
            ☕ Java OOPs
          </button>
          <button 
            className={`lp-tab-btn springboot ${activeTrack === "springboot" ? "active" : ""}`}
            onClick={() => handleTrackChange("springboot")}
          >
            🍃 Spring Boot Microservices
          </button>
        </section>

        {/* Track Progress Bar */}
        <section className="lp-overall-progress">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '700' }}>
            <span>{currentTrack.name} Path Completion</span>
            <span style={{ color: '#00e5ff' }}>{completedInTrackCount} / {currentTrack.topics.length} Chapters ({trackProgressPct}%)</span>
          </div>
          <div className="lp-progress-bar-container">
            <div 
              className="lp-progress-bar-fill" 
              style={{ 
                width: `${trackProgressPct}%`,
                background: activeTrack === "react" ? "linear-gradient(90deg, #00e5ff, #8a2eff)" : activeTrack === "java" ? "linear-gradient(90deg, #ef4444, #f97316)" : "linear-gradient(90deg, #22c55e, #8a2eff)"
              }}
            ></div>
          </div>
        </section>

        {/* Workspace Columns */}
        <div className="lp-split-workspace">
          
          {/* Left Sidebar Chapter List */}
          <aside className="lp-sidebar-chapters">
            {currentTrack.topics.map(topic => {
              const isCompleted = completedTopics.includes(topic.id);
              return (
                <div 
                  key={topic.id} 
                  className={`lp-chapter-item ${activeTopicId === topic.id ? "active" : ""}`}
                  onClick={() => setActiveTopicId(topic.id)}
                >
                  <span className="lp-chapter-title">{topic.title}</span>
                  <span className="lp-chapter-status">
                    {isCompleted ? (
                      <span className="lp-status-completed">✓</span>
                    ) : (
                      <span className="lp-status-pending">○</span>
                    )}
                  </span>
                </div>
              );
            })}

            {/* Quiz section in list */}
            <div 
              className={`lp-chapter-item ${activeTopicId === "quiz" ? "active" : ""}`}
              onClick={() => setActiveTopicId("quiz")}
              style={{ border: '1px dashed rgba(255, 255, 255, 0.15)', marginTop: '15px', background: activeTopicId === "quiz" ? 'rgba(0, 229, 255, 0.05)' : '' }}
            >
              <span className="lp-chapter-title" style={{ fontWeight: '700' }}>📝 Track Quiz Challenge</span>
              <span className="lp-chapter-status">
                {user && localStorage.getItem(`completed_quiz_${activeTrack}_${user.email || user.username}`) ? (
                  <span className="lp-status-completed">✓ Passed</span>
                ) : (
                  <span className="lp-status-pending">20 Marks</span>
                )}
              </span>
            </div>
          </aside>

          {/* Right Main Reading Panel */}
          <article className="lp-reading-panel">
            {activeTopicId === "quiz" ? (
              /* Quiz Render Mode */
              <div>
                <div className="lp-tutorial-header">
                  <div className="lp-tutorial-title">
                    <h2>Track Quiz Challenge: {currentTrack.name}</h2>
                    <span style={{ fontSize: '14px', color: '#94a3b8' }}>Total Marks: 20 (5 questions * 4 marks each). Needs 85% (17+ marks) to unlock the badge!</span>
                  </div>
                </div>

                {quizSubmitted && (
                  <div className={`lp-quiz-results ${quizScore >= 17 ? "" : "failed"}`}>
                    <h3 className="lp-quiz-results-title">
                      {quizScore >= 17 ? "🎉 Assessment Passed!" : "⚠️ Assessment Failed"}
                    </h3>
                    <p style={{ fontSize: '18px', fontWeight: '700' }}>Your Score: {quizScore} / 20 Marks ({Math.round((quizScore / 20) * 100)}%)</p>
                    <p style={{ fontSize: '15px', color: '#94a3b8', marginTop: '8px' }}>
                      {quizScore >= 17 
                        ? `Congratulations! You unlocked the ${currentTrack.badgeName}! View it in your dashboard.`
                        : "You scored less than 85%. Review the chapters and try again to unlock your badge."
                      }
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmitQuiz} className="lp-quiz-container">
                  {currentTrack.quiz.map((item, qIdx) => (
                    <div key={qIdx} className="lp-quiz-question-card">
                      <p className="lp-quiz-question-text">{qIdx + 1}. {item.q}</p>
                      <div className="lp-quiz-options">
                        {item.options.map((opt, optIdx) => (
                          <label 
                            key={optIdx} 
                            className={`lp-quiz-option-label ${quizAnswers[qIdx] === optIdx ? "selected" : ""}`}
                          >
                            <input 
                              type="radio" 
                              name={`question_${qIdx}`}
                              className="lp-quiz-option-input"
                              checked={quizAnswers[qIdx] === optIdx}
                              onChange={() => handleOptionSelect(qIdx, optIdx)}
                              disabled={quizSubmitted}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="lp-completion-area" style={{ marginTop: '20px' }}>
                    {!user ? (
                      <>
                        <span className="lp-guest-warning">⚠️ Please log in to submit your quiz and earn XP!</span>
                        <button className="lp-btn-complete" type="button" onClick={() => navigate('/login')}>
                          Sign In
                        </button>
                      </>
                    ) : user.role !== 'STUDENT' ? (
                      <span className="lp-guest-warning">⚠️ Only Student accounts can submit quizzes to earn rewards.</span>
                    ) : quizSubmitted ? (
                      <button 
                        className="lp-btn-complete" 
                        type="button"
                        onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                        style={{ background: 'transparent', border: '1px solid #00e5ff', color: '#00e5ff', boxShadow: 'none' }}
                      >
                        Retake Quiz
                      </button>
                    ) : (
                      <button 
                        className="lp-btn-complete" 
                        type="submit"
                        disabled={Object.keys(quizAnswers).length < currentTrack.quiz.length}
                      >
                        Submit Quiz
                      </button>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              /* Tutorial Render Mode */
              <div>
                <div>
                  <div className="lp-tutorial-header">
                    <div className="lp-tutorial-title">
                      <h2>{currentTopic.title}</h2>
                      <span style={{ fontSize: '14px', color: '#94a3b8' }}>Course: {currentTrack.name}</span>
                    </div>
                    <div className="lp-tutorial-reward">
                      +{currentTopic.xp} XP REWARD
                    </div>
                  </div>

                  <div className="lp-tutorial-content">
                    {currentTopic.content}
                  </div>
                </div>

                {/* Clickable video thumbnail redirect container */}
                <div className="lp-video-section" style={{ marginTop: '30px', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', overflow: 'hidden', background: 'rgba(0,0,0,0.5)', padding: '20px' }}>
                  <h4 style={{ fontFamily: 'Orbitron', fontSize: '16px', color: activeTrack === "react" ? "#00e5ff" : activeTrack === "java" ? "#f97316" : "#22c55e", marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🎥 Recommended Video Tutorial by {currentTrack.instructor} (Redirects to YouTube)
                  </h4>
                  
                  <div 
                    className="lp-video-thumbnail-container"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${currentTrack.videoId}`, '_blank')}
                    style={{ position: 'relative', width: '100%', height: '260px', overflow: 'hidden', borderRadius: '8px', background: '#000' }}
                  >
                    <img 
                      src={`https://img.youtube.com/vi/${currentTrack.videoId}/hqdefault.jpg`} 
                      alt={currentTrack.videoTitle}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="lp-video-play-overlay">
                      <span>▶</span>
                    </div>
                  </div>

                  <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginTop: '10px', fontStyle: 'italic' }}>
                    Click card to play on YouTube: {currentTrack.videoTitle}
                  </span>
                </div>

                {/* Bottom complete action button */}
                <div className="lp-completion-area" style={{ marginTop: '35px' }}>
                  {!user ? (
                    <>
                      <span className="lp-guest-warning">
                        ⚠️ Please sign up or log in as a student to save progress and earn XP rewards!
                      </span>
                      <button className="lp-btn-complete" onClick={() => navigate('/login')}>
                        Sign In
                      </button>
                    </>
                  ) : user.role !== 'STUDENT' ? (
                    <span className="lp-guest-warning" style={{ color: '#ff00c8' }}>
                      ⚠️ XP rewards and study trackers are exclusive to Student accounts.
                    </span>
                  ) : completedTopics.includes(currentTopic.id) ? (
                    <button className="lp-btn-complete" disabled>
                      ✓ Completed (+{currentTopic.xp} XP Earned)
                    </button>
                  ) : (
                    <button 
                      className="lp-btn-complete" 
                      onClick={() => completeTopic(currentTopic.id, currentTopic.xp)}
                    >
                      Mark Chapter as Completed
                    </button>
                  )}
                </div>
              </div>
            )}
          </article>

        </div>

      </main>

      <Footer />
    </div>
  );
}