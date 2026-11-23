import type {
  BlogPost,
  Course,
  ExamNotice,
  FacultyMember,
  GalleryItem,
  SiteSettings,
  StudentResult,
  Testimonial,
  VideoLecture,
} from '../types';

export const ASSETS = {
  hero: '/src/assets/images/gyansai_hero_classroom_1795428135673.jpg',
  mentoring: '/src/assets/images/gyansai_mentoring_session_1795428138115.jpg',
  studyHall: '/src/assets/images/gyansai_study_hall_1795428133811.jpg',
  courseDesk: '/src/assets/images/gyansai_iit_course_1795428137053.jpg',
  toppers: '/src/assets/images/gyansai_topper_celebration_1795428136213.jpg',
};

export const CLASS_LEVELS = [
  'Class 8 (Foundation)',
  'Class 9 (Foundation)',
  'Class 10 (SSC / CBSE)',
  'Class 11 (Science)',
  'Class 12 (Science)',
  'Dropper / Repeater (JEE)',
  'F.E. / S.E. Engineering (BATU)',
];

export const BATCH_PREFERENCES = [
  'Morning Batch (7:30 AM – 11:30 AM)',
  'Afternoon Batch (1:30 PM – 5:00 PM)',
  'Evening Batch (5:15 PM – 8:15 PM)',
  'Weekend Practice Batch',
  'Any Available Batch',
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  institute_name: 'Gyansai Maths IIT Center',
  tagline:
    'Conceptual Mathematics mastery, daily problem practice, and disciplined mentoring for IIT-JEE, MHT-CET, Boards, and Engineering exams since 2009.',
  phone: '+91 9970603939',
  secondary_phone: '+91 9209731097',
  email: 'gyansaimathsiitcentertech@gmail.com',
  whatsapp: '+91 9970603939',
  address:
    'Opp. Sant Eknath Rang Mandir Road, Below Laptop Bazar, New Usmanpura, Chhatrapati Sambhajinagar, Maharashtra – 431001',
  office_hours: 'Monday to Sunday, 7:30 AM – 8:30 PM',
  logo_url: '',
  favicon_url: '',
  logo_width: 180,
  logo_height: 48,
  header_bg: '#142A58',
  header_text_color: '#FFFFFF',
  nav_active_color: '#FFBE1B',
  announcement_enabled: false,
  announcement_text:
    'Admissions open for 2026–27 IIT-JEE, MHT-CET, 11th–12th Science, Foundation, and Engineering Mathematics batches — limited seats per batch.',
  announcement_bg: '#FFBE1B',
  announcement_text_color: '#142A58',
  show_header_cta: true,
  header_cta_label: 'Enroll Now',
  header_cta_link: '/admission',
  show_floating_cta: false,
  floating_cta_label: 'Apply Now',
  floating_cta_link: '/admission',
  hero_title: 'Where deep mathematical thinking meets consistent rank results',
  hero_subtitle:
    'Guided by Prof. Taterao Kendre (KT Sir) since 2009 in Chhatrapati Sambhajinagar — small batches, daily practice papers, and personal doubt solving.',
  about_heading: 'Clarity in Concepts. Discipline in Practice. Confidence in Every Exam.',
  about_intro:
    'Founded in 2009 by Prof. Taterao Kendre (KT Sir) in New Usmanpura, Chhatrapati Sambhajinagar, Gyansai Maths IIT Center has built a trusted reputation for turning Mathematics from an exam bottleneck into a student’s strongest scoring subject.',
  founder_name: 'Prof. Taterao Kendre (KT Sir)',
  founder_message:
    'Mathematics rewards clarity, daily consistency, and honest self-evaluation. Our promise since 2009 has been simple: teach every theorem from first principles, check every student’s work personally, and guide families with complete transparency.',
  courses_page_title: 'Structured Mathematics Programmes',
  courses_page_subtitle:
    'Purpose-built classroom batches for IIT-JEE (Main & Advanced), MHT-CET, 11th–12th Boards, BITSAT, NDA, Classes 8–10 Foundation, and Engineering Mathematics (M1–M3).',
  show_quick_links: true,
  show_value_offerings: true,
  show_results_section: true,
  show_lectures_section: true,
  show_courses_section: true,
  show_location_section: true,
  stat_selections_value: '1,450+',
  stat_selections_label: 'Engineering, IIT-JEE, MHT-CET & NDA Selections',
  stat_percentile_value: '99.8+',
  stat_percentile_label: 'Top Mathematics Percentiles Achieved by Students',
  popup_enabled: false,
  popup_title: 'GMAT 2026 Scholarship & Admission Open',
  popup_body:
    'Register for the Gyansai Maths Aptitude & Scholarship Test for Class 10 moving to Class 11 IIT-JEE & MHT-CET batches. Merit scholarships up to 50% available.',
  popup_cta_label: 'Register Now',
  popup_cta_link: '/admission',
  seo_title: 'Gyansai Maths IIT Center | IIT-JEE, MHT-CET & Engineering Maths Coaching',
  seo_description:
    'Gyansai Maths IIT Center in New Usmanpura, Chhatrapati Sambhajinagar — dedicated IIT-JEE, MHT-CET, Boards, Foundation, and Engineering Mathematics coaching by Prof. Taterao Kendre (KT Sir) since 2009.',
  seo_keywords:
    'Gyansai Maths IIT Center, KT Sir Maths, IIT-JEE coaching Chhatrapati Sambhajinagar, MHT-CET Maths Aurangabad, Engineering Maths DBATU',
  footer_about:
    'Dedicated Mathematics and IIT-JEE coaching in New Usmanpura, Chhatrapati Sambhajinagar since 2009. Small batches, daily problem sets, weekly tests, and honest parent feedback.',
  footer_copyright: 'Gyansai Maths IIT Center, Chhatrapati Sambhajinagar. All rights reserved.',
  map_query: 'Sant Eknath Rang Mandir New Usmanpura Aurangabad',
  exam_portal_url: 'https://gyansaipp.vercel.app/',
};

export const ABOUT_HIGHLIGHTS = [
  { value: '2009', label: 'Established in Chhatrapati Sambhajinagar' },
  { value: '17+ Yrs', label: 'Dedicated JEE & CET Mentorship by KT Sir' },
  { value: '99.8%ile', label: 'Consistent Top Percentile Scores in Maths' },
  { value: 'IIT · NIT · COEP', label: 'Alumni Across Premier Engineering Campuses' },
];

export const APPROACH_STEPS = [
  {
    step: '01',
    title: 'Conceptual Derivation',
    description:
      'Every theorem and formula is derived from first principles on the board so students understand why a method works rather than memorising shortcuts.',
  },
  {
    step: '02',
    title: 'Guided In-Class Practice',
    description:
      'Students solve graded JEE Main, Advanced, and MHT-CET problems directly in class while faculty observe working steps and correct errors early.',
  },
  {
    step: '03',
    title: 'Daily Practice Papers (DPP)',
    description:
      'Structured daily problem sheets are checked and discussed before moving forward, preventing chapter backlogs from accumulating.',
  },
  {
    step: '04',
    title: 'Weekly Tests & Paper Analysis',
    description:
      'Timed weekly chapter tests and cumulative mock exams build speed, accuracy, and calm temperament with written progress reports for parents.',
  },
];

export const WHY_CHOOSE_ITEMS = [
  {
    title: 'Direct Teaching by KT Sir',
    description:
      'Core Mathematics batches are personally taught and monitored by Prof. Taterao Kendre (KT Sir) across the full academic year.',
  },
  {
    title: 'Focused Batch Strength',
    description:
      'Carefully capped classroom size ensures every student’s notebook, test paper, and conceptual gap is tracked individually.',
  },
  {
    title: 'Daily Practice Sheets (DPP)',
    description:
      'Graded Level-1 (Board/CET), Level-2 (JEE Main), and Level-3 (JEE Advanced) worksheets handed out and reviewed daily.',
  },
  {
    title: 'Dedicated Doubt-Clearing Desk',
    description:
      'Scheduled post-lecture doubt hours and one-on-one problem review sessions so no unanswered question turns into a weak chapter.',
  },
  {
    title: 'Board + Entrance Alignment',
    description:
      'HSC & CBSE descriptive writing practice integrated seamlessly with objective MCQ speed drills for JEE and MHT-CET.',
  },
  {
    title: 'Weekly Cumulative Assessments',
    description:
      'Chapter tests every Sunday with full error analysis, rank benchmarks, and corrective revision plans on Monday.',
  },
  {
    title: 'Transparent Parent Updates',
    description:
      'Regular attendance logs, test score summaries, and one-on-one parent meetings with honest academic guidance.',
  },
  {
    title: 'Hybrid Revision Support',
    description:
      'Physical classroom instruction complemented by recorded concept revisions and digital test practice through our student learning system.',
  },
];

export const CAMPUS_ECOSYSTEM = [
  {
    title: 'Dedicated Doubt-Clearing & Study Room',
    description:
      'Quiet, faculty-supervised study bays at our New Usmanpura campus where students stay after class to finish DPPs and resolve doubts immediately.',
    image: ASSETS.studyHall,
    points: [
      'Supervised daily self-study hours with quiet wooden study desks',
      'Immediate access to Mathematics mentors for stuck JEE/CET derivations',
      'Curated reference library of Cengage, Black Book, Arihant, and PYQ archives',
      'Disciplined phone-free study zone for deep concentration',
    ],
  },
  {
    title: 'Personalised Mentoring & Assessment Lab',
    description:
      'Structured weekly testing, paper correction workshops, and individual exam-temperament counselling for both classroom and repeater students.',
    image: ASSETS.mentoring,
    points: [
      'Weekly OMR and CBT-pattern mock tests mirroring JEE Main & MHT-CET',
      'Individual mistake-log notebook reviewed every fortnight by KT Sir',
      'Dedicated parent-teacher review interactions after major test series',
      'Digital lecture backup and formula compendiums for exam-month revision',
    ],
  },
];

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'iit-jee-two-year-integrated',
    slug: 'iit-jee-two-year-integrated',
    name: 'Two-Year IIT-JEE (Main + Advanced) Integrated',
    category: 'IIT-JEE & Competitive',
    class_level: 'Class 11 & 12 Science',
    duration: '2 Years',
    target_exams: 'JEE Main, JEE Advanced, MHT-CET & 12th Boards',
    subjects: 'Mathematics (Core Mastery) · Physics & Chemistry Coordination',
    batch_timings: 'Morning & Evening Batches Available',
    description:
      'Our flagship two-year programme for Class 11 and 12 students aiming for IITs, NITs, IIITs, and top state engineering colleges. Builds rock-solid Algebra, Calculus, Coordinate Geometry, Vectors, and Trigonometry from first principles to Advanced-level multi-concept problems.',
    highlights:
      'Complete 11th & 12th JEE Main + Advanced syllabus coverage\nDaily Practice Papers (DPPs) with graded difficulty tiers\nFull NCERT, State Board, and 20-year PYQ integration\nWeekly chapter tests and All-India level mock test series\nIndividual mistake-analysis mentoring with Prof. Taterao Kendre (KT Sir)',
    eligibility: 'Students moving into Class 11 Science (HSC or CBSE) aiming for IIT-JEE and MHT-CET.',
    methodology:
      'Lectures start from visual intuition and formal derivations, transition into timed classroom drills, and conclude each week with cumulative Sunday assessments.',
    admission_status: 'open',
    image_url: ASSETS.hero,
    display_order: 1,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'mht-cet-board-mastery',
    slug: 'mht-cet-board-mastery',
    name: 'MHT-CET & 11th–12th Board Mastery Batch',
    category: 'MHT-CET & Boards',
    class_level: 'Class 11 & 12 Science',
    duration: '1–2 Years',
    target_exams: 'MHT-CET (Engineering) & HSC / CBSE Board Exams',
    subjects: 'Mathematics · Full Board Paper Writing & Speed MCQs',
    batch_timings: 'Morning & Afternoon Batches',
    description:
      'Designed specifically for students targeting 99+ percentile in MHT-CET for COEP, VJTI, PICT, and SPIT alongside 95+ marks in HSC/CBSE Class 12 Board Mathematics. Balances step-by-step theorem writing with high-speed MCQ elimination techniques.',
    highlights:
      'Line-by-line HSC & NCERT textbook mastery with theorem proofs\nTimed 90-minute MHT-CET Maths speed & accuracy drills (50 MCQs / 100 marks)\nFormula handbooks and rapid shortcut sessions without losing conceptual depth\n25+ full-length MHT-CET computer-based pattern mock tests',
    eligibility: 'Class 11 and Class 12 Science students preparing for Maharashtra State Board / CBSE and MHT-CET.',
    methodology:
      'Dual-track calendar: descriptive board presentation practice on weekdays paired with timed objective MHT-CET sprints every weekend.',
    admission_status: 'open',
    image_url: ASSETS.courseDesk,
    display_order: 2,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'jee-dropper-repeater-batch',
    slug: 'jee-dropper-repeater-batch',
    name: 'One-Year Dropper / Repeater JEE Rank Booster',
    category: 'IIT-JEE & Competitive',
    class_level: 'Class 12 Pass / Repeater',
    duration: '1 Year',
    target_exams: 'JEE Main (Jan & April), JEE Advanced, MHT-CET, BITSAT',
    subjects: 'Intensive Complete 11th + 12th Mathematics',
    batch_timings: 'Full-Day Morning + Supervised Practice',
    description:
      'A high-accountability one-year intensive batch for Class 12 pass students focused on dramatically jumping their JEE Main percentile and Advanced rank. Eliminates previous conceptual gaps through rapid revision, high-volume problem sets, and daily testing.',
    highlights:
      'Fast-paced yet rigorous rebuilding of complete Class 11 & 12 syllabus\nDaily 4-hour supervised problem-solving and doubt resolution\nBi-weekly full-syllabus mock papers with score-jump tracking\nPersonalised rank strategy and weak-topic remediation by KT Sir',
    eligibility: 'Students who have completed Class 12 and are dedicating one focused year to JEE Main/Advanced and MHT-CET.',
    methodology:
      'Diagnostic audit in Week 1 followed by structured module blocks, daily test drills, and intensive January/April attempt peaking cycles.',
    admission_status: 'open',
    image_url: ASSETS.studyHall,
    display_order: 3,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'bitsat-nda-mathematics-accelerator',
    slug: 'bitsat-nda-mathematics-accelerator',
    name: 'BITSAT & NDA Mathematics Accelerator',
    category: 'IIT-JEE & Competitive',
    class_level: 'Class 11 & 12',
    duration: '1 Year',
    target_exams: 'BITSAT (Pilani / Goa / Hyderabad) & UPSC NDA',
    subjects: 'Competitive Mathematics & Quantitative Speed Aptitude',
    batch_timings: 'Evening & Weekend Batches',
    description:
      'Focused quantitative and speed-training module tailored for UPSC NDA Mathematics Paper-I and BITSAT. Trains students to maintain high accuracy under strict time pressure across Algebra, Matrices, Probability, Calculus, and Statistics.',
    highlights:
      'Complete NDA Paper-I (300 marks) and BITSAT Maths pattern coverage\nTime-per-question benchmarking and mental calculation conditioning\nArchive of 15 years of solved UPSC NDA and BITSAT memory-based papers\nWeekly timed objective tests with negative-marking control coaching',
    eligibility: 'Class 11 & 12 students aspiring for BITS Pilani campuses or the National Defence Academy (NDA).',
    methodology:
      'High-frequency pattern drills, visual geometry shortcuts, and timed mock sprints reviewed immediately after every session.',
    admission_status: 'open',
    image_url: ASSETS.mentoring,
    display_order: 4,
    is_featured: false,
    is_published: true,
  },
  {
    id: 'career-foundation-programme',
    slug: 'career-foundation-programme',
    name: 'Career Foundation Programme (Classes 8–10)',
    category: 'Foundation & School',
    class_level: 'Classes 8, 9 & 10',
    duration: '1–3 Years',
    target_exams: 'School Boards, NTSE, IMO / IOQM & Early IIT-JEE Prep',
    subjects: 'Foundation Mathematics & Analytical Reasoning',
    batch_timings: 'After-School Evening Batches',
    description:
      'Early conceptual grooming for Class 8, 9, and 10 students that strengthens school board performance while quietly building the algebraic fluency, geometry intuition, and logical reasoning required for Class 11–12 IIT-JEE success.',
    highlights:
      'Complete SSC / CBSE school Mathematics mastery ahead of school schedule\nEarly introduction to inequalities, number theory, quadratics, and geometry proofs\nOlympiad (IMO / IOQM) and scholarship test preparation\nStress-free small batches that cultivate curiosity and joy in Mathematics',
    eligibility: 'Students in Class 8, 9, or 10 (State Board, CBSE, or ICSE).',
    methodology:
      'Activity-oriented derivations, guided homework sessions, and fortnightly concept diagnostics with parent feedback.',
    admission_status: 'open',
    image_url: ASSETS.hero,
    display_order: 5,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'engineering-mathematics-batu',
    slug: 'engineering-mathematics-batu',
    name: 'Engineering Mathematics (DBATU / BAMU — M1, M2, M3)',
    category: 'University & Engineering',
    class_level: 'F.E. / S.E. Engineering',
    duration: 'Semester-Wise',
    target_exams: 'DBATU, Dr. BAMU & Autonomous Engineering University Exams',
    subjects: 'Engineering Maths I, II, III & Applied Mathematics',
    batch_timings: 'Morning & Late-Evening College-Friendly Slots',
    description:
      'Trusted by engineering undergraduates across Chhatrapati Sambhajinagar for clear, scoring mastery of M1, M2, and M3 — covering Linear Algebra, Differential Equations, Laplace & Fourier Transforms, Complex Variables, and Vector Calculus.',
    highlights:
      '100% syllabus coverage aligned with latest DBATU & BAMU exam blueprints\nStep-by-step solved question banks from past 10 university semesters\nDedicated backlog-clearing and distinction-scoring tracks\nConcise formula sheets and end-semester rapid revision marathons',
    eligibility: 'First-Year (F.E.) and Second-Year (S.E.) B.Tech / B.E. students across all engineering branches.',
    methodology:
      'Clear worked examples for every university question type, weekly unit tests, and pre-semester full-paper simulations.',
    admission_status: 'open',
    image_url: ASSETS.courseDesk,
    display_order: 6,
    is_featured: true,
    is_published: true,
  },
];

export const DEFAULT_EXAMS: ExamNotice[] = [
  {
    id: 'gmat-scholarship-2026',
    title: 'Gyansai Maths Aptitude & Scholarship Test (GMAT 2026)',
    course_category: 'Scholarship & Admission',
    class_level: 'Class 10 moving to Class 11',
    exam_date: '2026-12-06',
    exam_time: '10:00 AM',
    duration_minutes: 90,
    mode: 'Offline at New Usmanpura Campus',
    syllabus: 'Class 9 & 10 Algebra, Geometry, Trigonometry, Mensuration, and Logical Reasoning.',
    instructions: 'Carry school ID card and blue/black ballpoint pen. Reporting time is 9:30 AM. Top performers qualify for up to 50% tuition scholarship.',
    status: 'open',
    registration_url: '/admission?course=Two-Year%20IIT-JEE%20(Main%20%2B%20Advanced)%20Integrated',
    display_order: 1,
    is_published: true,
  },
  {
    id: 'jee-main-mock-series-dec',
    title: 'All-Sambhajinagar JEE Main Mathematics Full Mock Test',
    course_category: 'IIT-JEE Test Series',
    class_level: 'Class 12 & Dropper',
    exam_date: '2026-12-13',
    exam_time: '09:00 AM',
    duration_minutes: 180,
    mode: 'Offline OMR & CBT Pattern',
    syllabus: 'Full Class 11 & 12 JEE Main Mathematics syllabus (Calculus, Coordinate Geometry, Algebra, Vectors & 3D).',
    instructions: 'Paper discussion and detailed error-analysis session by KT Sir immediately follows the result declaration.',
    status: 'open',
    registration_url: 'https://gyansaipp.vercel.app/',
    display_order: 2,
    is_published: true,
  },
  {
    id: 'mht-cet-speed-drill-2026',
    title: 'MHT-CET Mathematics 90-Minute Speed Assessment',
    course_category: 'MHT-CET',
    class_level: 'Class 12 Science',
    exam_date: '2026-12-20',
    exam_time: '11:00 AM',
    duration_minutes: 90,
    mode: 'Gyansai e-Exam Online Portal & Campus Hall',
    syllabus: '50 Questions (100 Marks) — 20% Class 11 + 80% Class 12 Maharashtra Board CET weightage.',
    instructions: 'Zero negative marking pattern. Detailed percentile predictor shared with students and parents.',
    status: 'open',
    registration_url: 'https://gyansaipp.vercel.app/',
    display_order: 3,
    is_published: true,
  },
  {
    id: 'foundation-diagnostic-2026',
    title: 'Foundation Mathematics Olympiad Diagnostic Test',
    course_category: 'Foundation',
    class_level: 'Classes 8, 9 & 10',
    exam_date: '2026-12-27',
    exam_time: '10:30 AM',
    duration_minutes: 60,
    mode: 'Offline at New Usmanpura Campus',
    syllabus: 'Grade-appropriate Number Systems, Linear Equations, Triangles, and Quantitative Reasoning.',
    instructions: 'Free diagnostic evaluation report with parent counselling slot included.',
    status: 'upcoming',
    registration_url: '/admission?course=Career%20Foundation%20Programme%20(Classes%208%E2%80%9310)',
    display_order: 4,
    is_published: true,
  },
];

export const DEFAULT_RESULTS: StudentResult[] = [
  {
    id: 'res-pranav-deshmukh',
    student_name: 'Pranav Deshmukh',
    achievement_title: 'JEE Main 2026 · Mathematics Topper',
    score: '99.74 %ile',
    category: 'IIT-JEE',
    class_level: 'Class 12 Integrated',
    academic_year: '2025-26',
    college_admitted: 'IIT Bombay (B.Tech)',
    photo_url: ASSETS.toppers,
    display_order: 1,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'res-sakshi-kulkarni',
    student_name: 'Sakshi Kulkarni',
    achievement_title: 'MHT-CET 2026 · PCM Distinction',
    score: '99.86 %ile',
    category: 'MHT-CET',
    class_level: 'Class 12 Science',
    academic_year: '2025-26',
    college_admitted: 'COEP Technological University, Pune',
    photo_url: ASSETS.toppers,
    display_order: 2,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'res-omkar-jadhav',
    student_name: 'Omkar Jadhav',
    achievement_title: 'JEE Advanced Qualified · AIR 1842',
    score: 'AIR 1842',
    category: 'IIT-JEE',
    class_level: 'Two-Year Integrated',
    academic_year: '2025-26',
    college_admitted: 'IIT Madras (Mechanical Engg.)',
    photo_url: ASSETS.toppers,
    display_order: 3,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'res-snehal-patil',
    student_name: 'Snehal Patil',
    achievement_title: 'HSC Class 12 Board Mathematics',
    score: '100 / 100',
    category: 'Board Exams',
    class_level: 'Class 12 HSC',
    academic_year: '2025-26',
    college_admitted: 'VJTI Mumbai (Computer Engg.)',
    photo_url: ASSETS.toppers,
    display_order: 4,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'res-aditya-shinde',
    student_name: 'Aditya Shinde',
    achievement_title: 'UPSC NDA Written & SSB Qualified',
    score: 'AIR 114',
    category: 'BITSAT & NDA',
    class_level: 'NDA Maths Batch',
    academic_year: '2024-25',
    college_admitted: 'National Defence Academy, Khadakwasla',
    photo_url: ASSETS.toppers,
    display_order: 5,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'res-tanvi-joshi',
    student_name: 'Tanvi Joshi',
    achievement_title: 'JEE Main & BITSAT High Scorer',
    score: '332 / 390',
    category: 'BITSAT & NDA',
    class_level: 'Class 12 Integrated',
    academic_year: '2024-25',
    college_admitted: 'BITS Pilani (EEE)',
    photo_url: ASSETS.toppers,
    display_order: 6,
    is_featured: true,
    is_published: true,
  },
];

export const DEFAULT_FACULTY: FacultyMember[] = [
  {
    id: 'prof-taterao-kendre',
    name: 'Prof. Taterao Kendre (KT Sir)',
    role: 'Founder, Director & Chief Mathematics Mentor',
    subject: 'IIT-JEE, MHT-CET & Engineering Mathematics',
    qualification: 'M.Sc. / Engineering Mathematics Specialist',
    experience: '17+ Years (Est. 2009)',
    bio: 'Founder of Gyansai Maths IIT Center, KT Sir is widely respected across Chhatrapati Sambhajinagar for demystifying Calculus, Coordinate Geometry, and Algebra. Thousands of his students have secured admissions to IITs, NITs, COEP, VJTI, BITS, and NDA.',
    photo_url: ASSETS.mentoring,
    display_order: 1,
    is_published: true,
  },
  {
    id: 'prof-mahesh-chavan',
    name: 'Prof. Mahesh Chavan',
    role: 'Senior Faculty — Calculus & Vectors',
    subject: 'JEE Advanced Mathematics',
    qualification: 'M.Tech (NIT), GATE Qualified',
    experience: '11+ Years',
    bio: 'Leads high-level problem-solving workshops, JEE Advanced rank booster modules, and daily doubt-clearing sessions for Class 12 and Dropper batches.',
    photo_url: ASSETS.hero,
    display_order: 2,
    is_published: true,
  },
  {
    id: 'prof-pallavi-deshpande',
    name: 'Prof. Pallavi Deshpande',
    role: 'Head — MHT-CET & Board Mathematics',
    subject: 'HSC / CBSE Boards & MHT-CET',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    experience: '10+ Years',
    bio: 'Specialises in theorem presentation for 95+ board scoring and systematic MHT-CET speed-building drills, mentoring Class 11 & 12 students through weekly tests.',
    photo_url: ASSETS.studyHall,
    display_order: 3,
    is_published: true,
  },
  {
    id: 'prof-rajesh-more',
    name: 'Prof. Rajesh More',
    role: 'Faculty — Foundation & Engineering Maths',
    subject: 'Classes 8–10 Foundation & DBATU M1–M3',
    qualification: 'B.E., M.E. (Distinction)',
    experience: '9+ Years',
    bio: 'Builds early mathematical fluency for Classes 8–10 Olympiad aspirants and guides First & Second Year engineering undergraduates through DBATU/BAMU Mathematics.',
    photo_url: ASSETS.courseDesk,
    display_order: 4,
    is_published: true,
  },
];

export const DEFAULT_LECTURES: VideoLecture[] = [
  {
    id: 'lec-definite-integration',
    title: 'Definite Integration: King’s Property & Leibnitz Rule Mastery',
    subject: 'Calculus',
    topic: 'Definite Integration',
    class_level: 'Class 12 · IIT-JEE',
    teacher_name: 'Prof. Taterao Kendre (KT Sir)',
    duration_label: '48 min',
    video_url: '',
    thumbnail_url: ASSETS.hero,
    summary:
      'Step-by-step derivation of King’s property, Newton–Leibnitz differentiation under the integral sign, and 12 solved JEE Main & Advanced PYQs.',
    display_order: 1,
    is_published: true,
  },
  {
    id: 'lec-conic-sections-locus',
    title: 'Parabola & Ellipse: Tangents, Normals & Locus Intuition',
    subject: 'Coordinate Geometry',
    topic: 'Conic Sections',
    class_level: 'Class 11 · IIT-JEE',
    teacher_name: 'Prof. Taterao Kendre (KT Sir)',
    duration_label: '54 min',
    video_url: '',
    thumbnail_url: ASSETS.courseDesk,
    summary:
      'Visual geometric approach to parametric tangent equations and chord of contact problems that appear repeatedly in JEE Main and BITSAT.',
    display_order: 2,
    is_published: true,
  },
  {
    id: 'lec-mht-cet-matrices',
    title: 'Matrices & Determinants: 45-Second MHT-CET Solving Techniques',
    subject: 'Algebra',
    topic: 'Matrices & Determinants',
    class_level: 'Class 12 · MHT-CET',
    teacher_name: 'Prof. Pallavi Deshpande',
    duration_label: '36 min',
    video_url: '',
    thumbnail_url: ASSETS.mentoring,
    summary:
      'High-yield properties of adjoints, inverse checks, and system consistency tricks tailored for scoring full marks in MHT-CET Paper-I.',
    display_order: 3,
    is_published: true,
  },
  {
    id: 'lec-laplace-batu',
    title: 'Laplace Transforms & Inverse Convolution for Engineering M3',
    subject: 'Engineering Maths',
    topic: 'Laplace Transforms',
    class_level: 'S.E. Engineering (DBATU)',
    teacher_name: 'Prof. Rajesh More',
    duration_label: '42 min',
    video_url: '',
    thumbnail_url: ASSETS.studyHall,
    summary:
      'Complete semester exam walkthrough covering shifting theorems, unit step functions, and solving second-order ODEs via Laplace Transforms.',
    display_order: 4,
    is_published: true,
  },
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-pranav-deshmukh',
    display_name: 'Pranav Deshmukh',
    role_or_class: 'Two-Year Integrated Batch · IIT Bombay',
    outcome: 'Improved Maths from 62 to 99.74 %ile in JEE Main',
    quote:
      'Before joining Gyansai Maths IIT Center, Calculus and Coordinate Geometry felt intimidating. KT Sir insisted we derive every result cleanly and maintain an error notebook after every Sunday test. By the January attempt, Mathematics became my highest-scoring subject.',
    rating: 5,
    display_order: 1,
    is_published: true,
  },
  {
    id: 'test-sakshi-kulkarni',
    display_name: 'Sakshi Kulkarni',
    role_or_class: 'Class 11–12 MHT-CET Batch · COEP Pune',
    outcome: 'Scored 99.86 %ile in MHT-CET & 98/100 in HSC Maths',
    quote:
      'The balance between HSC board step-writing and timed MHT-CET mock drills is unmatched in Sambhajinagar. Whenever I got stuck on a DPP question, I could sit in the doubt room right after class and clear it the same day.',
    rating: 5,
    display_order: 2,
    is_published: true,
  },
  {
    id: 'test-sanjay-patil-parent',
    display_name: 'Sanjay Patil (Parent)',
    role_or_class: 'Father of Snehal Patil · VJTI Mumbai',
    outcome: '100/100 in HSC Class 12 Mathematics',
    quote:
      'As parents, we valued the discipline and honesty at Gyansai. We never had to guess how our daughter was performing — weekly test scores, attendance updates, and personal discussions with KT Sir kept her steady through two demanding years.',
    rating: 5,
    display_order: 3,
    is_published: true,
  },
  {
    id: 'test-rohan-gaikwad',
    display_name: 'Rohan Gaikwad',
    role_or_class: 'S.E. Mechanical · DBATU Engineering Maths',
    outcome: 'Cleared M2 & M3 with Distinction',
    quote:
      'KT Sir’s Engineering Mathematics batch saved my semester. Complex topics like Fourier Series and Laplace Transforms were broken down into clean repeatable steps with exact university exam problems.',
    rating: 5,
    display_order: 4,
    is_published: true,
  },
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-classroom-calculus',
    album: 'Classrooms',
    title: 'Main IIT-JEE Mathematics Classroom',
    caption: 'Interactive board derivations of Calculus and Conic Sections at our New Usmanpura campus.',
    file_url: ASSETS.hero,
    display_order: 1,
    is_published: true,
  },
  {
    id: 'gal-kt-sir-mentoring',
    album: 'Mentoring',
    title: 'Small-Group Doubt Clearing Session',
    caption: 'Direct one-on-one problem review and approach guidance for Class 12 aspirants.',
    file_url: ASSETS.mentoring,
    display_order: 2,
    is_published: true,
  },
  {
    id: 'gal-study-hall',
    album: 'Study Hall',
    title: 'Supervised Self-Study & Reference Hall',
    caption: 'Quiet phone-free reading room where students complete daily practice papers.',
    file_url: ASSETS.studyHall,
    display_order: 3,
    is_published: true,
  },
  {
    id: 'gal-annual-felicitation',
    album: 'Achievements',
    title: 'Annual Topper Felicitation Ceremony',
    caption: 'Celebrating IIT-JEE, MHT-CET, and HSC Board Mathematics rankers with their families.',
    file_url: ASSETS.toppers,
    display_order: 4,
    is_published: true,
  },
  {
    id: 'gal-study-material',
    album: 'Classrooms',
    title: 'Structured DPP & Reference Workbooks',
    caption: 'Curated Level 1–3 problem sets designed for systematic mastery from Boards to JEE Advanced.',
    file_url: ASSETS.courseDesk,
    display_order: 5,
    is_published: true,
  },
];

export const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 'master-jee-calculus-without-rote',
    slug: 'master-jee-calculus-without-rote',
    title: 'How to Master IIT-JEE Calculus Without Memorising 200 Formulas',
    category: 'JEE Strategy',
    excerpt:
      'Why top rankers derive core limits, continuity, and definite integral properties visually — and the 45-minute daily drill we follow at Gyansai.',
    content: `Calculus accounts for nearly a third of the IIT-JEE Mathematics paper, yet many students treat it like a list of isolated formulas to cram before exams.\n\n## Start with Graphical Intuition\nBefore touching a single formula sheet, sketch the behaviour of fundamental curves — polynomials, exponentials, logarithms, and inverse trigonometric functions. Half of all JEE Continuity and Differentiability questions resolve visually in under 30 seconds.\n\n## Maintain a Three-Column Error Log\nAfter every weekly test, divide your missed questions into three columns: Conceptual Gap, Algebraic Slip, and Time Pressure. Re-solve only those marked questions seven days later without looking at the solution.\n\n## Respect the Daily Practice Paper (DPP)\nSolving 15 thoughtfully graded questions every single day beats attempting 120 questions in a Sunday panic. Consistency builds pattern recognition far better than marathon cramming.\n\n## Ask Doubts the Same Week\nBecause Differential Calculus directly feeds into Integral Calculus and Differential Equations, letting one chapter stay shaky weakens the entire second half of Class 12. Use the daily doubt desk immediately.`,
    featured_image_url: ASSETS.courseDesk,
    author: 'Prof. Taterao Kendre (KT Sir)',
    published_date: '2026-11-10',
    read_time: '4 min read',
    is_published: true,
  },
  {
    id: 'mht-cet-99-percentile-maths-plan',
    slug: 'mht-cet-99-percentile-maths-plan',
    title: 'The 90-Minute MHT-CET Mathematics Blueprint for 99+ Percentile',
    category: 'MHT-CET Guide',
    excerpt:
      'With 50 questions carrying 100 marks and zero negative marking, Mathematics is the decisive half of your MHT-CET score. Here is how to pace every minute.',
    content: `In MHT-CET, Mathematics alone accounts for 100 out of 200 marks — equal to Physics and Chemistry combined. A strong 85+ score in Mathematics almost guarantees a 99+ percentile.\n\n## Split the 90 Minutes into Three Passes\nUse Pass 1 (first 40 minutes) to sweep all direct textbook-level questions in Logic, Matrices, Vectors, and Linear Programming. Use Pass 2 (next 35 minutes) for standard Calculus and 3D Geometry derivations. Reserve the final 15 minutes for multi-step problems and verification.\n\n## Never Ignore the Maharashtra State Board Textbook\nOver 70% of MHT-CET Mathematics stems directly from the exercises and miscellaneous problems of the HSC Class 11 and 12 textbooks. Master every solved example before chasing exotic material.\n\n## Practise Under a Real Clock\nSpeed is built by taking 25+ timed 90-minute papers prior to exam week so that your calculation rhythm stays calm even on tricky shifts.`,
    featured_image_url: ASSETS.hero,
    author: 'Prof. Pallavi Deshpande',
    published_date: '2026-10-28',
    read_time: '5 min read',
    is_published: true,
  },
  {
    id: 'choosing-right-maths-coaching-sambhajinagar',
    slug: 'choosing-right-maths-coaching-sambhajinagar',
    title: 'Four Questions Parents Should Ask Before Selecting an 11th–12th Coaching Batch',
    category: 'Parent Guide',
    excerpt:
      'Batch size, teacher continuity, daily homework checks, and honest progress reporting matter far more than billboard promises.',
    content: `Choosing a Class 11–12 coaching institute is one of the most consequential academic decisions a family makes. Before enrolling, visit the campus and ask four practical questions.\n\n## 1. Will the Senior Subject Mentor Teach My Child Throughout the Year?\nAsk specifically who teaches the regular weekday lectures — not just the orientation seminar. Year-long continuity with a seasoned mentor builds student trust.\n\n## 2. How Are Daily Practice Problems Checked?\nLectures alone never produce ranks. Verify whether daily problem sheets are distributed, checked, and discussed before the class moves to the next topic.\n\n## 3. How Do Parents Receive Performance Updates?\nRegular written weekly test reports and transparent attendance communication ensure problems are spotted in July rather than January.\n\n## 4. What Support Exists When a Student Falls Behind?\nLook for structured doubt-clearing hours and a supervised study room where students can ask questions without hesitation.`,
    featured_image_url: ASSETS.mentoring,
    author: 'Gyansai Academic Desk',
    published_date: '2026-10-14',
    read_time: '4 min read',
    is_published: true,
  },
];

export const DEFAULT_FAQS = [
  {
    question: 'How do I take admission at Gyansai Maths IIT Center?',
    answer:
      'Submit the online admission application or enquiry form on this website, or visit our campus opposite Sant Eknath Rang Mandir Road, Below Laptop Bazar, New Usmanpura, Chhatrapati Sambhajinagar. You can meet Prof. Taterao Kendre (KT Sir), review the batch schedule and study plan, and confirm your seat.',
  },
  {
    question: 'Which examinations and classes do you offer coaching for?',
    answer:
      'We offer structured batches for IIT-JEE (Main & Advanced), MHT-CET, Class 11 & 12 Science Boards (HSC & CBSE), BITSAT, UPSC NDA Mathematics, Career Foundation (Classes 8, 9 & 10), and Engineering Mathematics (M1, M2, M3 for DBATU & BAMU).',
  },
  {
    question: 'Can a student attend a demo interaction before confirming admission?',
    answer:
      'Yes. Prospective students and parents are welcome to schedule an academic counselling session and observe a classroom lecture before finalising admission. Call +91 9970603939 or request a callback via the Contact page.',
  },
  {
    question: 'How do you track weekly progress and update parents?',
    answer:
      'Every batch has weekly chapter assessments and cumulative mock tests. Attendance, test marks, and teacher remarks are shared regularly with parents, with dedicated parent-mentor meetings after major test series.',
  },
  {
    question: 'Do students receive printed notes, DPPs, and digital revision support?',
    answer:
      'Yes. Every enrolled student receives graded Daily Practice Papers (DPPs), chapterwise formula & PYQ booklets, supervised doubt-clearing hours at campus, and recorded revision support through our digital learning platform.',
  },
  {
    question: 'Are scholarship tests available for Class 10 students moving into Class 11?',
    answer:
      'Yes. We conduct the Gyansai Maths Aptitude & Scholarship Test (GMAT) before each new academic cycle. High performers receive merit-based tuition scholarships for our Two-Year Integrated batches.',
  },
];
