import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Email yoki parol noto\'g\'ri');
      }
    } catch (err) {
      setError('Kirish jarayonida xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setEmail('admin@kutubxona.uz');
      setPassword('admin123');
    } else {
      setEmail('user@kutubxona.uz');
      setPassword('user123');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/70 rounded-2xl mb-4">
          <span className="text-2xl">📚</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Kutubxonaga kirish
        </h1>
        <p className="text-muted-foreground">
          Hisobingizga kirish uchun ma'lumotlaringizni kiriting
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email manzili</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            className="h-12 border-2 focus:border-primary transition-colors"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Parol</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parolingizni kiriting"
            required
            className="h-12 border-2 focus:border-primary transition-colors"
          />
        </div>

        {error && (
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg font-medium" 
          disabled={loading}
        >
          {loading ? '⏳ Kirilmoqda...' : '🚀 Kirish'}
        </Button>
      </form>

      <div className="mt-8 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Demo uchun</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-primary/20 hover:border-primary hover:bg-primary/5"
            onClick={() => fillDemoCredentials('admin')}
          >
            👑 Admin
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-primary/20 hover:border-primary hover:bg-primary/5"
            onClick={() => fillDemoCredentials('user')}
          >
            👤 Foydalanuvchi
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Hisobingiz yo'qmi?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary hover:underline font-medium"
          >
            Ro'yxatdan o'ting
          </button>
        </p>
      </div>
    </div>
  );
};