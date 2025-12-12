import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import './LoginPage.css';

const loginSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await authService.login(data.name);
      navigate('/clients');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Olá, seja bem-vindo!</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Digite o seu nome:"
              {...register('name')}
              className={errors.name ? 'error' : ''}
              autoFocus
            />
            {errors.name && <span className="error-message">{errors.name.message}</span>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-login">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
