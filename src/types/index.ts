
export type RootStackParamList = {
    Home: undefined;
    Search: undefined;
    MyCourses: undefined;
    CourseDetail: { courseId: number };
    Learning: { lessonId: number; courseId: number; isEnrolled: boolean};
    CoursesByCategory: { categoryId: number; categoryName: string };
    TeacherProfile: { teacherId: number };
    CourseListScreen: { title: string };
    Payment: { course: Course };
    Login: undefined;
    Register: undefined;
    Profile: { isLoggedIn?: boolean; userId?: number };
};

export type RootTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  MyCoursesTab: undefined;
  ProfileTab: undefined;
};

export type User = {
	id: number;
	username: string;
	fullName: string;
	email: string;
	password: string;
	role: string;
	avatarUrl: string;
};

export type Category = {
	id: number;
	name: string;
	imageUrl: string;
	iconName: string;
};

export type Course = {
	id: number;
	title: string;
	description: string;
	categoryName: string;
  categoryId: number;
	instructorName: string;
  instructorId: number;
	thumbnailUrl: string;
	price: number;
  originalPrice: number
	ratingAvg: number;
  ratingCount: number;
  lessonCount: number;
  videoPreviewUrl: string;
};

export type Section = { 
	id: number; 
	courseId: number; 
	title: string; 
};

export type Lesson = {
    id: number;
    section_id: number;
    title: string;
    durationInSeconds: number;
    playbackUrl: string;
    isFree: boolean;
    viewsCount: number;
};

export type Review = {
    id: number;
    courseId: number;
    userId: number;
    rating: number; 
    comment: string;
    userFullName: string;
    userAvatarUrl: string;
    createdAt: string;
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
  id: number;
  studentId: number;
  title: string;
  thumbnailUrl: string;
  lessonCount: number;
  completedLessons: number;
  progressPercentage: number;
};

export type Quiz = {
  id: number;
  lesson_id: number;
  title: string;
}