import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import TextField from '@/components/TextField';
import PrimaryButton from '@/components/PrimaryButton';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/RootNavigator';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const signIn = useAuthStore((s) => s.signIn);
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
      // lands on Settings (Navigation Flow SS3.2).
      navigation.replace('Dashboard');
    } catch {
      setFormError('Incorrect email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masjid admin</Text>
      <Text style={styles.subtitle}>Sign in to manage timings and announcements</Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: theme.spacing.xl, backgroundColor: theme.colors.surface },
  title: { fontSize: theme.typography.heading, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xl, textAlign: 'center' },
  formError: { color: '#B3261E', fontSize: theme.typography.caption, marginBottom: theme.spacing.md, textAlign: 'center' },
});
