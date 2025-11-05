// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log("Nhấn")
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    // Giả lập đăng nhập thành công (sau này gọi API)
    Alert.alert(
      'Đăng nhập thành công!',
      `Chào mừng bạn trở lại!`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Chuyển sang Profile với trạng thái đã đăng nhập
            navigation.replace('Profile', { isLoggedIn: true, userId: 3 });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Ionicons name="school-outline" size={80} color="#00bfff" style={styles.logo} />
          <Text style={styles.title}>Chào mừng trở lại!</Text>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục học tập</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#666"
                style={styles.eyeIcon}
              />
            </Pressable>
          </View>

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </Pressable>

          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>HOẶC</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerButtonText}>Tạo tài khoản mới</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  logo: { alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 32 },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#333', paddingVertical: 14 },
  eyeIcon: { marginLeft: 8 },

  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { color: '#00bfff', fontWeight: '600' },

  loginButton: {
    backgroundColor: '#00bfff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 24,
  },
  loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },

  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  line: { flex: 1, height: 1, backgroundColor: '#ddd' },
  orText: { marginHorizontal: 16, color: '#999', fontSize: 14 },

  registerButton: {
    borderWidth: 2,
    borderColor: '#00bfff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: { color: '#00bfff', fontWeight: 'bold', fontSize: 16 },
});