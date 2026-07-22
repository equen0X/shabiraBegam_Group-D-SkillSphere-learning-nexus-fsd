import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";
import Background from "../components/Background";
import CourseCard from "../components/CourseCard";
import { FiSearch, FiCheckCircle, FiShoppingCart, FiX, FiLock, FiBookOpen, FiAward, FiZap } from "react-icons/fi";
import "../styles/courses.css";

export default function CoursesPage() {
  const { user, earnXp, completedTopics } = useAuth();
  const { courses: adminCourses } = useAdmin();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Cart & Checkout state
  const [checkoutCourse, setCheckoutCourse] = useState(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    try {
      const savedIds = localStorage.getItem("enrolled_course_ids");
      const savedProgress = localStorage.getItem("course_progress_map");
      const progressMap = savedProgress ? JSON.parse(savedProgress) : {};

      const freeIds = adminCourses.filter(c => !c.isPremium).map(c => c.id); 
      const defaultEnrolled = [2, 4, ...freeIds]; 
      const enrolledIds = savedIds ? JSON.parse(savedIds) : defaultEnrolled;

      setCourses(adminCourses.map(course => {
        const isEnrolled = enrolledIds.includes(course.id);
        const progress = isEnrolled ? (progressMap[course.id] !== undefined ? progressMap[course.id] : 0) : 0;
        return {
          ...course,
          isEnrolled,
          progress
        };
      }));
    } catch {
      setCourses(adminCourses.map(c => ({...c, isEnrolled: false, progress: 0})));
    }
  }, [adminCourses]);

  // Calculate real-time progress strictly isolated per specific course ID out of 6 modules
  const getDynamicProgress = (courseId, fallbackProgress) => {
    const completedList = completedTopics || [];

    const prefixMap = {
      1: "fsd_",
      2: "react_",
      3: "javascript_",
      4: "dsa_",
      5: "genai_",
      6: "ml_",
      7: "node_",
      8: "nextjs_",
      9: "web3_",
      10: "aws_",
      11: "python_",
      12: "uiux_"
    };

    const prefix = prefixMap[courseId];
    if (prefix) {
      const matchCount = completedList.filter(id => id.startsWith(prefix)).length;
      return Math.round((matchCount / 6) * 100);
    }

    return 0; // Newly enrolled courses show 0%
  };

  // Triggered when user clicks "Enroll Now" -> Opens Cart / Checkout modal
  const handleEnrollClick = (courseId) => {
    const courseToCheckout = courses.find(c => c.id === courseId);
    if (courseToCheckout) {
      setCheckoutCourse(courseToCheckout);
    }
  };

  // Triggered when user completes Checkout Modal action
  const handleCompleteCheckout = () => {
    if (!checkoutCourse) return;
    setIsProcessingCheckout(true);

    setTimeout(() => {
      const courseId = checkoutCourse.id;
      
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          // Set progress to 0% for newly checked out course!
          return { ...course, isEnrolled: true, progress: 0 };
        }
        return course;
      });

      setCourses(updatedCourses);

      // Save to localStorage
      const enrolledIds = updatedCourses.filter(c => c.isEnrolled).map(c => c.id);
      localStorage.setItem("enrolled_course_ids", JSON.stringify(enrolledIds));
      
      const savedProgress = localStorage.getItem("course_progress_map");
      const progressMap = savedProgress ? JSON.parse(savedProgress) : {};
      progressMap[courseId] = 0; // Newly enrolled course starts at 0%
      localStorage.setItem("course_progress_map", JSON.stringify(progressMap));

      // Earn XP reward
      if (earnXp) {
        earnXp(100);
      }

      setIsProcessingCheckout(false);
      setCheckoutCourse(null);

      // Trigger toast message
      setToastMessage(checkoutCourse.isPremium ? `🎉 Checkout Complete! Successfully purchased "${checkoutCourse.title}"!` : `🎉 Successfully enrolled in "${checkoutCourse.title}"!`);
      setTimeout(() => {
        setToastMessage("");
      }, 4500);
    }, 1200);
  };

  const handleContinue = (courseId) => {
    // Map each course ID directly to its unique track key in LearningPage
    const trackMap = {
      1: "fsd",
      2: "react",
      3: "javascript",
      4: "dsa",
      5: "genai",
      6: "ml",
      7: "node",
      8: "nextjs",
      9: "web3",
      10: "aws",
      11: "python",
      12: "uiux"
    };

    const trackKey = trackMap[courseId] || "react";
    navigate(`/learning?track=${trackKey}`, { state: { track: trackKey } });
  };

  // Filter courses by tab & search query with dynamic progress sync
  const filteredCourses = courses.map(course => ({
    ...course,
    progress: course.isEnrolled ? getDynamicProgress(course.id, course.progress) : 0
  })).filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === "enrolled") return course.isEnrolled;
    if (activeFilter === "free") return !course.isPremium;
    if (activeFilter === "premium") return course.isPremium;
    return true; // "all"
  });

  return (
    <div className={`courses-page ${isSidebarOpen ? 'with-sidebar' : ''}`}>
      <Background />
      <Navbar 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
        showSidebarToggle={true} 
      />
      <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className="courses-content-wrapper">
        
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '85px',
            right: '25px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #00e5ff, #8a2be2)',
            color: 'var(--text-primary)',
            padding: '14px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 229, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: '600',
            fontSize: '15px',
            animation: 'fadeIn 0.3s ease'
          }}>
            <FiCheckCircle size={22} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Checkout & Cart Drawer / Modal Overlay */}
        {checkoutCourse && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5, 6, 11, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: 'linear-gradient(145deg, var(--bg-secondary), #1e1b4b)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '20px',
              maxWidth: '540px',
              width: '100%',
              padding: '30px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 229, 255, 0.2)',
              position: 'relative',
              animation: 'slideUp 0.3s ease'
            }}>
              <button 
                onClick={() => setCheckoutCourse(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'var(--text-primary)',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                <FiX />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00e5ff', marginBottom: '15px' }}>
                <FiShoppingCart size={24} />
                <h2 style={{ margin: 0, fontFamily: 'Orbitron, sans-serif', fontSize: '22px' }}>Course Checkout</h2>
              </div>

              {/* Course Item Summary */}
              <div style={{
                display: 'flex',
                gap: '15px',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '15px',
                borderRadius: '14px',
                border: "1px solid var(--border-color)",
                marginBottom: '20px'
              }}>
                <img 
                  src={checkoutCourse.image} 
                  alt={checkoutCourse.title} 
                  style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} 
                />
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', color: 'var(--text-primary)' }}>{checkoutCourse.title}</h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{checkoutCourse.description}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(0, 229, 255, 0.15)', color: '#00e5ff', padding: '3px 8px', borderRadius: '10px' }}>GFG Study Notes Included</span>
                    <span style={{ fontSize: '11px', background: 'rgba(255, 0, 200, 0.15)', color: '#ff00c8', padding: '3px 8px', borderRadius: '10px' }}>Certificate Unlocked</span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '16px', borderRadius: '12px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <span>Course Tuition Fee:</span>
                  <span>{checkoutCourse.isPremium ? `₹${checkoutCourse.price}` : '₹4,999.00'}</span>
                </div>
                {!checkoutCourse.isPremium && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#22c55e' }}>
                    <span>SkillSphere Scholarship Grant (100% OFF):</span>
                    <span>-₹4,999.00</span>
                  </div>
                )}
                <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  <span>Total Due Today:</span>
                  <span style={{ color: checkoutCourse.isPremium ? '#ff00c8' : '#00e5ff' }}>
                    {checkoutCourse.isPremium ? `₹${checkoutCourse.price}` : '₹0.00'}
                  </span>
                </div>
              </div>

              {/* Included Perks */}
              <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '25px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FiLock /> Instant Access</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FiZap /> +100 XP Bonus</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FiBookOpen /> GFG Notes</span>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleCompleteCheckout}
                disabled={isProcessingCheckout}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(90deg, #00e5ff, #8a2be2)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '25px',
                  fontWeight: '700',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(0, 229, 255, 0.4)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                {isProcessingCheckout ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{checkoutCourse.isPremium ? `Pay ₹${checkoutCourse.price} & Unlock Access` : 'Complete Enrollment (Free)'}</span>
                    <FiCheckCircle />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="courses-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1>Our Courses</h1>
            <p>Level up your skills with our top-rated industry tracks.</p>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                borderRadius: '25px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
          {[
            { id: "all", label: "All Courses" },
            { id: "enrolled", label: `My Enrolled (${courses.filter(c => c.isEnrolled).length})` },
            { id: "free", label: "Free Courses" },
            { id: "premium", label: "Premium Tracks" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: activeFilter === tab.id ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.1)',
                background: activeFilter === tab.id ? 'rgba(0, 229, 255, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                color: activeFilter === tab.id ? '#00e5ff' : 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onEnroll={handleEnrollClick}
                onContinue={handleContinue}
              />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '70px 20px' }}>
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>
                {activeFilter === 'enrolled' ? '📚' : activeFilter === 'free' ? '🆓' : activeFilter === 'premium' ? '👑' : '🔍'}
              </div>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--text-primary)', fontSize: '20px', marginBottom: '10px' }}>
                {activeFilter === 'enrolled' && 'No Courses Enrolled Yet'}
                {activeFilter === 'free' && 'No Free Courses Match'}
                {activeFilter === 'premium' && 'No Premium Tracks Match'}
                {activeFilter === 'all' && 'No Courses Found'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                {activeFilter === 'enrolled' && 'Browse all courses and enroll to start your learning journey!'}
                {activeFilter === 'free' && 'Try clearing your search or browse all courses.'}
                {activeFilter === 'premium' && 'Try clearing your search query to see all premium tracks.'}
                {activeFilter === 'all' && 'No results found for your search. Try a different keyword.'}
              </p>
              {activeFilter !== 'all' && (
                <button
                  onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                  style={{
                    background: 'linear-gradient(90deg, #00e5ff, #8a2eff)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '20px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Browse All Courses
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
