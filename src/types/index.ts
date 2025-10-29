import { StackNavigationProp } from '@react-navigation/stack';

// ✅ Định nghĩa Root Stack Params (Cần cho CourseCard để navigate)
export type RootStackParamList = {
    Home: undefined;
    Search: undefined;
    MyCourses: undefined;
    Profile: undefined;
    CourseDetail: { courseId: number };
    Learning: { lessonId: number; courseId: number };
    HomeFeed: undefined;
};

// ✅ Định nghĩa kiểu Navigation Prop cho Home Stack
export type CourseCardNavigationProp = StackNavigationProp<RootStackParamList, 'HomeFeed'>;

export type User = {
	id: number;
	username: string;
	full_name: string;
	email: string;
	password: string;
	role: string;
	avatar_url: string;
};

export type Category = {
	id: number;
	name: string;
	image_Url: string;
	icon_name: string;
};

export type Course = {
	id: number;
	title: string;
	description: string;
	category_id: number;
	teacher_id: number;
	thumbnail: string;
	price: number;
	rating_avg: number;
    rating_count: number;
    lesson_count: number;
	original_price: number
    video_url_preview?: string;
    benefits: string[];
};

export type Section = { 
	id: number; 
	course_id: number; 
	title: string; 
};

export type Lesson = {
    id: number;
    section_id: number;
    title: string;
    duration_mins: number;
    video_url: string;
    is_free: boolean;
};

export type Review = {
    id: number;
    course_id: number;
    user_id: number;
    rating: number; 
    comment: string;
    date: string;
};

export interface Favorite {
  id: number;
  user_id: number;
  course_id: number;
};

export type Enrollment = {
  id: number;
  user_id: number;
  course_id: number;
  enrollment_date: string;
  order_id: number | null;
};

export type LessonProgress = {
  id: number;
  enrollment_id: number;
  lesson_id: number;
  is_completed: boolean;
  updated_at: string;
};

export type MyCourse = {
  user_id?: number;
  id: number;
  title: string;
  thumbnail: string;
  lesson_count: number;
  completed_count: number;
  progress_percent: number;
};