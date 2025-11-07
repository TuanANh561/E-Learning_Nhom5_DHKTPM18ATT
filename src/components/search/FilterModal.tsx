import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Category = { 
  id: number; 
  name: string 
};

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (selectedTopic?: string, selectedCategoryId?: number) => void;
  categories: Category[];
}

export default function FilterModal({ isVisible, onClose, onApply, categories }: FilterModalProps) {
  const HOT_TOPICS = ['Web', 'React', 'PHP', 'Python', 'Digital', 'Photoshop', 'Watercolor'];
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const handleSelectTopic = (name: string) => {
    setSelectedTopic(prev => (prev === name ? null : name));
  };

  const handleSelectCategory = (id: number) => {
    setSelectedCategoryId(prev => (prev === id ? null : id));
  };

  const handleReset = () => {
    setSelectedTopic(null);
    setSelectedCategoryId(null);
  };

  const handleApply = () => {
    onApply(selectedTopic || undefined, selectedCategoryId || undefined);
  };

  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Bộ lọc Khóa học</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close-circle-outline" size={28} color="#666" />
            </Pressable>
          </View>

          {/* Nội dung */}
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Chủ đề nổi bật</Text>
            <View style={styles.row}>
              {HOT_TOPICS.map((topic, i) => (
                <Pressable
                  key={i}
                  style={[styles.tag, selectedTopic === topic && styles.tagSelected]}
                  onPress={() => handleSelectTopic(topic)}
                >
                  <Text style={[styles.tagText, selectedTopic === topic && styles.tagTextSelected]}>
                    {topic}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Lọc theo Danh mục</Text>
            <View style={styles.row}>
              {categories.map(cat => (
                <Pressable
                  key={cat.id}
                  style={[styles.tag, selectedCategoryId === cat.id && styles.tagSelected]}
                  onPress={() => handleSelectCategory(cat.id)}
                >
                  <Text style={[styles.tagText, selectedCategoryId === cat.id && styles.tagTextSelected]}>
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable style={[styles.button, styles.resetBtn]} onPress={handleReset}>
              <Text style={styles.resetText}>Đặt lại</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.applyBtn]} onPress={handleApply}>
              <Text style={styles.applyText}>Áp dụng</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '80%' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 10, color: '#333' },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  tag: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 20,
    paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, marginBottom: 10,
    backgroundColor: '#f9f9f9'
  },
  tagSelected: { backgroundColor: '#00bfff', borderColor: '#00bfff' },
  tagText: { color: '#666' },
  tagTextSelected: { color: '#fff', fontWeight: 'bold' },
  footer: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#eee' },
  button: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  resetBtn: { backgroundColor: '#eee' },
  applyBtn: { backgroundColor: '#00bfff' },
  resetText: { color: '#666', fontWeight: 'bold' },
  applyText: { color: '#fff', fontWeight: 'bold' },
});
