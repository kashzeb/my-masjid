import { useState } from 'react';
import { ScrollView, Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useTimetableStore } from '@/store/timetableStore';
import TextField from '@/components/TextField';
import PrimaryButton from '@/components/PrimaryButton';
import Card from '@/components/Card';
import ScreenContainer from '@/components/ScreenContainer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/app/RootNavigator';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

type Props = NativeStackScreenProps<SettingsStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const signIn = useAuthStore((s) => s.signIn);
  const masjid = useTimetableStore((s) => s.masjid);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setSubmitting(true);
    setFormError(null);
    try {
      await signIn(data.email, data.password);
      // Replaces, not pushes - so back-from-Dashboard skips Login and
      // lands on Settings (Navigation Flow §3.2).
      navigation.replace('Dashboard');
    } catch {
      setFormError('Incorrect email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  // Uses the real masjid name (from the same shared store Home already
  // populated), falling back gracefully if it hasn't loaded for some
  // reason - "Masjid Admin" rather than a blank or broken string.
  const title = masjid ? `${masjid.name} Admin` : 'Masjid Admin';

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Sign in to manage timings and announcements</Text>

          <Card style={styles.card}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextField
                  label="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <TextField
                  label="Password"
                  secureTextEntry
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.password?.message}
                />
              )}
            />

            {formError && <Text style={styles.formError}>{formError}</Text>}

            <PrimaryButton label="Log in" onPress={handleSubmit(onSubmit)} loading={submitting} />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.xl },
  title: { fontSize: theme.typography.heading, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xl, textAlign: 'center' },
  card: { padding: theme.spacing.lg },
  formError: { color: theme.colors.danger, fontSize: theme.typography.caption, marginBottom: theme.spacing.md, textAlign: 'center' },
});
