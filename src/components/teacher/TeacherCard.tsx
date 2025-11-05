import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, User } from '../../types';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCallback } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

type TeacherCardProps = {
	teacher: User;
};

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'TeacherProfile'>>();

  const handlePress = useCallback(() => {
    navigation.navigate('TeacherProfile', { teacherId: teacher.id });
  }, [teacher.id, navigation]);

	return (
		<Pressable onPress={handlePress} style={styles.container}>
			<Image source={{ uri: teacher.avatarUrl }} style={styles.avatar} />
			<View style={styles.info}>
				<Text style={styles.name}>{teacher.fullName}</Text>
				<Text style={styles.rating}>★ 4.5 (1233)</Text>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: { flexDirection: 'row', alignItems: 'center', padding: 10 },
	avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
	info: { flex: 1 },
	name: { fontSize: 16, fontWeight: 'bold', color: '#000' },
	rating: { fontSize: 14, color: '#666' },
});