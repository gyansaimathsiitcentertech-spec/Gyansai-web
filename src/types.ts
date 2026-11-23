export interface SiteSettings {
  institute_name: string;
  tagline: string;
  phone: string;
  secondary_phone: string;
  email: string;
  whatsapp: string;
  address: string;
  office_hours: string;
  logo_url: string;
  favicon_url: string;
  logo_width: number;
  logo_height: number;
  header_bg: string;
  header_text_color: string;
  nav_active_color: string;
  announcement_enabled: boolean;
  announcement_text: string;
  announcement_bg: string;
  announcement_text_color: string;
  show_header_cta: boolean;
  header_cta_label: string;
  header_cta_link: string;
  show_floating_cta: boolean;
  floating_cta_label: string;
  floating_cta_link: string;
  hero_title: string;
  hero_subtitle: string;
  about_heading: string;
  about_intro: string;
  founder_name: string;
  founder_message: string;
  courses_page_title: string;
  courses_page_subtitle: string;
  show_quick_links: boolean;
  show_value_offerings: boolean;
  show_results_section: boolean;
  show_lectures_section: boolean;
  show_courses_section: boolean;
  show_location_section: boolean;
  stat_selections_value: string;
  stat_selections_label: string;
  stat_percentile_value: string;
  stat_percentile_label: string;
  popup_enabled: boolean;
  popup_title: string;
  popup_body: string;
  popup_cta_label: string;
  popup_cta_link: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  footer_about: string;
  footer_copyright: string;
  map_query: string;
  exam_portal_url: string;
}

export interface Course {
  id: string;
  slug: string;
  name: string;
  category: string;
  class_level: string;
  duration: string;
  target_exams: string;
  subjects: string;
  batch_timings: string;
  description: string;
  highlights: string;
  eligibility: string;
  methodology: string;
  admission_status: 'open' | 'closing_soon' | 'closed';
  image_url: string;
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
}

export interface ExamNotice {
  id: string;
  title: string;
  course_category: string;
  class_level: string;
  exam_date: string;
  exam_time: string;
  duration_minutes: number;
  mode: string;
  syllabus: string;
  instructions: string;
  status: 'open' | 'upcoming' | 'completed';
  registration_url: string;
  display_order: number;
  is_published: boolean;
}

export interface StudentResult {
  id: string;
  student_name: string;
  achievement_title: string;
  score: string;
  category: string;
  class_level: string;
  academic_year: string;
  college_admitted: string;
  photo_url: string;
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
}

export interface VideoLecture {
  id: string;
  title: string;
  subject: string;
  topic: string;
  class_level: string;
  teacher_name: string;
  duration_label: string;
  video_url: string;
  thumbnail_url: string;
  summary: string;
  display_order: number;
  is_published: boolean;
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  subject: string;
  qualification: string;
  experience: string;
  bio: string;
  photo_url: string;
  display_order: number;
  is_published: boolean;
}

export interface Testimonial {
  id: string;
  display_name: string;
  role_or_class: string;
  outcome: string;
  quote: string;
  rating: number;
  display_order: number;
  is_published: boolean;
}

export interface GalleryItem {
  id: string;
  album: string;
  title: string;
  caption: string;
  file_url: string;
  display_order: number;
  is_published: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  author: string;
  published_date: string;
  read_time: string;
  is_published: boolean;
}

export interface EnquiryRecord {
  id: string;
  student_name: string;
  parent_name?: string;
  phone: string;
  email?: string;
  class_level?: string;
  course_name?: string;
  preferred_batch?: string;
  message?: string;
  source?: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  createdAt?: unknown;
}

export interface AdmissionRecord {
  id: string;
  reference_code: string;
  student_name: string;
  parent_name: string;
  phone: string;
  email?: string;
  class_level: string;
  course_name?: string;
  preferred_batch?: string;
  school?: string;
  address?: string;
  message?: string;
  status: 'pending' | 'reviewed' | 'confirmed' | 'archived';
  createdAt?: unknown;
}
