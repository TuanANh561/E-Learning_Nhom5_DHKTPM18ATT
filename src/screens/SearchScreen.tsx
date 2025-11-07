import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useCategories from '../hooks/useCategories';
import useCourses from '../hooks/useCourses';
import useSearchCourses from '../hooks/useSearch';
import CategoryListSearch from '../components/category/CategoryListSearch';
import CourseCardVertical from '../components/course/CourseCardVertical';
import RecommendedSection from '../components/course/RecommendedSection';
import FilterModal from '../components/search/FilterModal';
import { Course } from '../types';

const HOT_TOPICS = ['Web', 'React', 'PHP', 'Python', 'Digital', 'Photoshop', 'Watercolor'];

export default function SearchScreen() {
  const { categories, loading: loadCat, error: errCat } = useCategories();
  const { recommended, loading: loadCourse, error: errCourse } = useCourses();
  const { searchCourses, courses: searchResults, loading: loadSearch, error: errSearch } = useSearchCourses();

  const navigation = useNavigation<any>();

  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const loading = loadCat || loadCourse || loadSearch;
  const error = errCat || errCourse || errSearch;

  useEffect(() => {
    if (error) Alert.alert('Lỗi kết nối', error);
  }, [error]);

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleSubmitSearch = useCallback(async () => {
    const trimmed = searchText.trim();
    setIsSearching(!!trimmed);
    if (trimmed) {
      await searchCourses({ title: trimmed });
    }
  }, [searchText]);

  const handleTopicPress = useCallback(async (topic: string) => {
    setSearchText(topic);
    setIsSearching(true);
    await searchCourses({ title: topic });
  }, []);

  const handleCategorySearch = useCallback(async (id: number, name: string) => {
    setSearchText(name);
    setIsSearching(true);
    await searchCourses({ categoryId: id });
  }, []);

  const toggleFilterModal = useCallback(() => {
    setIsFilterModalVisible(prev => !prev);
  }, []);

  const handleApplyFilters = useCallback(
    async (topic?: string, categoryId?: number) => {
      // 🔹 Đóng modal trước
      setIsFilterModalVisible(false);

      // 🔹 Chỉ tìm nếu có topic hoặc category
      if (topic || categoryId) {
        setIsSearching(true);
        await searchCourses({
          title: topic || '',
          categoryId: categoryId || undefined,
        });
      }
    },
    [searchCourses]
  );

  const renderCourseCard = useCallback(
    ({ item }: { item: Course }) => (
      <View style={styles.courseResultItem}>
        <CourseCardVertical course={item} />
      </View>
    ),
    []
  );

  if (loading)
    return <ActivityIndicator size="large" color="#00bfff" style={styles.loadingIndicator} />;

  const DefaultView = (
    <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.hotTopicsTitle}>Từ khóa được tìm nhiều</Text>
      <View style={styles.hotTopicsContainer}>
        {HOT_TOPICS.map(topic => (
          <Pressable key={topic} style={styles.topicTag} onPress={() => handleTopicPress(topic)}>
            <Text style={styles.topicText}>{topic}</Text>
          </Pressable>
        ))}
      </View>
      <CategoryListSearch
        categories={categories}
        onCategoryPress={(id, name) => handleCategorySearch(id, name)}
      />
      <RecommendedSection
        courses={recommended}
        onViewMore={() => navigation.navigate('CourseListScreen', { title: 'Recommended for you' })}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  );

  const ResultsView = (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsCount}>{searchResults.length} Kết quả được tìm thấy</Text>
      <FlatList
        data={searchResults}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCourseCard}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy khóa học nào phù hợp.</Text>}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.inputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Nhập từ khóa tìm kiếm..."
            value={searchText}
            onChangeText={handleSearchTextChange}
            onSubmitEditing={handleSubmitSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
        </View>
        <Pressable style={styles.filterButton} onPress={toggleFilterModal}>
          <Ionicons name="filter" size={20} color="#fff" />
          <Text style={styles.filterText}>Lọc</Text>
        </Pressable>
      </View>

      {isSearching ? ResultsView : DefaultView}

      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={toggleFilterModal}
        onApply={handleApplyFilters}
        categories={categories}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingIndicator: { flex: 1, justifyContent: 'center' },
  contentContainer: { paddingHorizontal: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16 },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00bfff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  hotTopicsTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  hotTopicsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  topicTag: {
    borderWidth: 1,
    borderColor: '#00bfff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  topicText: { color: '#00bfff', fontSize: 14 },
  resultsContainer: { flex: 1, paddingHorizontal: 20 },
  resultsCount: { fontSize: 14, color: '#666', marginVertical: 8 },
  courseResultItem: { marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 40 },
});
