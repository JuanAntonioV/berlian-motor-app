import Center from '@/components/Center';
import LoginForm from '@/components/LoginForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  return (
    <Center className='bg-authGradient'>
      <Card className='max-w-md w-full shadow-xl'>
        <CardHeader>
          <CardTitle className='font-bold'>Masuk</CardTitle>
          <CardDescription>Silahkan masuk untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent className='mt-2'>
          <LoginForm />
        </CardContent>
      </Card>
    </Center>
  );
}
