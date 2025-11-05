import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CourseCardVertical from '../course/CourseCardVertical';
import { Course, User } from '../../types';
import useUsers from '../../hooks/useUsers';

interface Props {
  course: Course;
  similarCourses: Course[];
}

export default function CourseOverviewTab({ course, similarCourses }: Props) {
  const [full, setFull] = useState(false);

  const { fetchTeacherById } = useUsers();
  const [teacher, setTeacher] = useState<User | null>(null);

  const fetchTeacher = async () => {
    const teacherData = await fetchTeacherById(course.instructorId);
    setTeacher(teacherData);
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  const benefits = [
    { icon: 'videocam-outline', txt: '14 hours on-demand video' },
    { icon: 'globe-outline', txt: 'Native teacher' },
    { icon: 'document-outline', txt: '100% free document' },
    { icon: 'time-outline', txt: 'Full lifetime access' },
    { icon: 'ribbon-outline', txt: 'Certificate of complete' },
    { icon: 'headset-outline', txt: '24/7 support' },
  ];

  return (
    <View style={st.container}>
      {/* Teacher */}
      <View style={st.teacher}>
        <Image source={{ uri: teacher?.avatarUrl || 'https://via.placeholder.com/50' }} style={st.avatar} />
        <View style={st.tInfo}>
          <Text style={st.tName}>{teacher?.fullName || 'Loading…'}</Text>
          <Text style={st.tRole}>UI/UX Designer</Text>
        </View>
        <Pressable style={st.follow}>
          <Text style={st.followTxt}>Follow</Text>
        </Pressable>
      </View>

      {/* Description */}
      <Text style={st.sec}>Description</Text>
      <Text style={st.desc} numberOfLines={full ? undefined : 3}>
        {course.description}
      </Text>
      {!full && (
        <Pressable onPress={() => setFull(true)}>
          <Text style={st.more}>See more</Text>
        </Pressable>
      )}

      {/* Benefits */}
      <Text style={st.sec}>Benefits</Text>
      {benefits.map((b, i) => (
        <View key={i} style={st.ben}>
          <Ionicons name={b.icon as any} size={20} color="#00bfff" />
          <Text style={st.benTxt}>{b.txt}</Text>
        </View>
      ))}

      {/* Similar */}
      <Text style={st.sec}>Similar courses</Text>
      <FlatList
        data={similarCourses}
        renderItem={({ item }) => <CourseCardVertical course={item} />}
        keyExtractor={i => i.id.toString()}
        scrollEnabled={false}
      />
    </View>
  );
}

const st = StyleSheet.create({
  container: { padding: 20 },
  teacher: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  tInfo: { flex: 1, marginLeft: 12 },
  tName: { fontWeight: 'bold', fontSize: 16 },
  tRole: { color: '#666', fontSize: 14 },
  follow: { backgroundColor: '#e0f7ff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  followTxt: { color: '#00bfff', fontWeight: 'bold' },

  sec: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  desc: { fontSize: 14, color: '#666', lineHeight: 20 },
  more: { color: '#00bfff', marginTop: 4 },

  ben: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  benTxt: { marginLeft: 12, fontSize: 14 },
});