// export const BASE_URL = 'http://192.168.1.4:3000';
// export const BASE_URL = 'http://192.168.1.4:8080'; //Wifi nhà
export const BASE_URL = 'http://192.168.20.87:8080'; //Bamos 2G
// export const BASE_URL = 'http://172.20.10.2:8080'; //4G

export const API_URL = {
  categories: `${BASE_URL}/categories`,
  courses: `${BASE_URL}/courses`,
  sections: `${BASE_URL}/sections`,
  lessons: `${BASE_URL}/lessons`,
  myCourses: `${BASE_URL}/courses/my-courses`,
  users: `${BASE_URL}/users`,
  reviews: `${BASE_URL}/api/reviews`,
  favorites: `${BASE_URL}/favorites`,
  enrollments: `${BASE_URL}/enrollments`,
  progress: `${BASE_URL}/progress`,
  popularCourses: `${BASE_URL}/courses/popular`,
  recommendedCourses: `${BASE_URL}/courses/recommended`, 
  inspiringCourses: `${BASE_URL}/courses/inspiring`,
  topTeachers: `${BASE_URL}/users/topTeachers`,
};
