import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Progress from 'react-native-progress';
import useMyCourses from '../hooks/useMyCourses';

export default function MyCoursesScreen() {
  const { courses, loading } = useMyCourses();
  const [activeTab, setActiveTab] = useState('ALL');

  const filteredCourses = useMemo(() => {
    if (activeTab === 'ALL') return courses;
    return courses.filter(c => {
      if (activeTab === 'COMPLETED') return c.progress_percent === 1;
      if (activeTab === 'ON GOING') return c.progress_percent > 0 && c.progress_percent < 1;
      return false;
    });
  }, [courses, activeTab]);

  const formatDuration = (lessonCount: any) => {
    const mins = lessonCount * 5;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h} hrs ${m} mins`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00bfff" />
        <Text style={styles.loading}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Image
            style={styles.bannerImg}
            source={{ uri: 'https://res.cloudinary.com/dwzjxsdli/image/upload/v1761711204/banner_mycourse_vnelze.jpg' }}
          />
        </View>

        <View style={styles.tabs}>
          {['ALL', 'ON GOING', 'COMPLETED'].map(tab => (
            <Pressable key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabTxt, activeTab === tab && styles.tabTxtOn]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabLine} />}
            </Pressable>
          ))}
        </View>

        <View style={styles.list}>
          {filteredCourses.length === 0 ? (
            <Text style={styles.empty}>Chưa có khóa học nào.</Text>
          ) : (
            filteredCourses.map(course => {
              const p = course.progress_percent;
              const done = p === 1;

              return (
                <Pressable key={course.id} style={styles.card}>
                  <Image source={{ uri: course.thumbnail }} style={styles.thumb} />
                  <View style={styles.info}>
                    <Text style={styles.courseName} numberOfLines={2}>
                      {course.title}
                    </Text>
                    <Text style={styles.duration}>{formatDuration(course.lesson_count)}</Text>

                    <View style={styles.progressBox}>
                      <Progress.Bar
                        progress={p}
                        width={null}
                        style={styles.bar}
                        color="#00bfff"
                        unfilledColor="#eee"
                        borderWidth={0}
                        height={8}
                      />
                      <Text style={styles.percent}>
                        {done ? '100%' : `${Math.round(p * 100)}%`}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  banner: { marginHorizontal: 20, height: 180, borderRadius: 16, overflow: 'hidden' },
  bannerImg: { width: '100%', height: '100%' },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#eee' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabTxt: { fontSize: 14, color: '#666' },
  tabTxtOn: { color: '#00bfff', fontWeight: 'bold' },
  tabLine: { position: 'absolute', bottom: 0, height: 3, width: '60%', backgroundColor: '#00bfff', borderRadius: 2 },
  list: { padding: 20 },
  empty: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  thumb: { width: 100, height: 100 },
  info: { flex: 1, padding: 12, justifyContent: 'space-between' },
  courseName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  duration: { fontSize: 13, color: '#666', marginTop: 4 },
  progressBox: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  bar: { flex: 1, marginRight: 8 },
  percent: { fontSize: 12, color: '#00bfff', fontWeight: 'bold' },
  loading: { marginTop: 10, textAlign: 'center', color: '#666' },
});