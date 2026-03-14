import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import { UserRole } from '../../models';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
};

const ROLES: { value: UserRole; label: string; icon: React.ComponentProps<typeof Ionicons>['name']; desc: string }[] = [
  { value: 'parent',    label: 'Parent',    icon: 'home-outline',       desc: 'Managing my child' },
  { value: 'teacher',   label: 'Teacher',   icon: 'school-outline',     desc: 'Supporting students' },
  { value: 'caregiver', label: 'Caregiver', icon: 'heart-outline',      desc: 'Professional care' },
];

export default function SignupScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('parent');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!displayName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(email.trim().toLowerCase(), password, displayName.trim(), role);
    } catch (err: any) {
      const message =
        err.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists.'
          : err.message ?? 'Registration failed. Please try again.';
      Alert.alert('Sign Up Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[Colors.secondary, Colors.primaryDark]} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={Colors.textOnPrimary} />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="person-add" size={40} color={Colors.secondary} />
            </View>
            <Text style={styles.appName}>Create Account</Text>
            <Text style={styles.tagline}>Join SpectoCare today</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Role picker */}
            <Text style={styles.roleLabel}>I am a…</Text>
            <View style={styles.roleRow}>
              {ROLES.map((r) => {
                const active = role === r.value;
                return (
                  <TouchableOpacity
                    key={r.value}
                    style={[styles.roleBtn, active && styles.roleBtnActive]}
                    onPress={() => setRole(r.value)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={r.icon}
                      size={22}
                      color={active ? Colors.textOnPrimary : Colors.secondary}
                    />
                    <Text style={[styles.roleBtnText, active && styles.roleBtnTextActive]}>
                      {r.label}
                    </Text>
                    <Text style={[styles.roleBtnDesc, active && styles.roleBtnDescActive]}>
                      {r.desc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Field
              icon="person-outline"
              placeholder="Full name"
              value={displayName}
              onChangeText={setDisplayName}
            />
            <Field
              icon="mail-outline"
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <PasswordField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              show={showPassword}
              toggle={() => setShowPassword((v) => !v)}
            />
            <PasswordField
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              show={showPassword}
              toggle={() => setShowPassword((v) => !v)}
            />

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.textOnPrimary} />
              ) : (
                <Text style={styles.btnText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.secondaryBtnText}>
                Already have an account?{' '}
                <Text style={styles.secondaryBtnHighlight}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const Field = ({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  autoCapitalize?: any;
}) => (
  <View style={styles.inputWrapper}>
    <Ionicons name={icon} size={20} color={Colors.textMuted} style={styles.inputIcon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={Colors.textMuted}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize ?? 'words'}
      autoCorrect={false}
    />
  </View>
);

const PasswordField = ({
  placeholder,
  value,
  onChangeText,
  show,
  toggle,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  show: boolean;
  toggle: () => void;
}) => (
  <View style={styles.inputWrapper}>
    <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
    <TextInput
      style={[styles.input, styles.inputFlex]}
      placeholder={placeholder}
      placeholderTextColor={Colors.textMuted}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!show}
      autoCapitalize="none"
    />
    <TouchableOpacity onPress={toggle} style={styles.eyeBtn}>
      <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textOnPrimary,
  },
  tagline: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  inputIcon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    height: '100%',
  },
  inputFlex: { flex: 1 },
  eyeBtn: { padding: Spacing.xs },
  btn: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  secondaryBtn: { alignItems: 'center', marginTop: Spacing.lg },
  secondaryBtnText: { fontSize: FontSize.md, color: Colors.textSecondary },
  secondaryBtnHighlight: { color: Colors.secondary, fontWeight: '700' },
  roleLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  roleBtn: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
    gap: 4,
  },
  roleBtnActive: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary,
  },
  roleBtnText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.secondary,
  },
  roleBtnTextActive: { color: Colors.textOnPrimary },
  roleBtnDesc: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  roleBtnDescActive: { color: 'rgba(255,255,255,0.8)' },
});
