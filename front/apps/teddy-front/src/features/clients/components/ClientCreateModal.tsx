import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Client } from '../../../shared/lib/selectedClients.store';
import { Modal } from '../../../shared/components/Modal';
import './ClientModals.css';

const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  salary: z.number().min(0.01, 'Salário deve ser maior que 0'),
  companyValuation: z.number().min(0.01, 'Valor da empresa deve ser maior que 0'),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientCreateModalProps {
  onClose: () => void;
  onCreate: (client: Omit<Client, 'id'>) => Promise<void>;
}

export function ClientCreateModal({ onClose, onCreate }: ClientCreateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = async (data: ClientFormData) => {
    await onCreate(data);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Criar cliente:">
      <form onSubmit={handleSubmit(onSubmit)} className="client-form">
        <div className="form-group">
          <input
            type="text"
            id="name"
            placeholder="Digite o nome:"
            autoFocus
            {...register('name')}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <input
            type="number"
            id="salary"
            placeholder="Digite o salário:"
            step="0.01"
            {...register('salary', { valueAsNumber: true })}
            className={errors.salary ? 'error' : ''}
          />
          {errors.salary && <span className="error-message">{errors.salary.message}</span>}
        </div>

        <div className="form-group">
          <input
            type="number"
            id="companyValuation"
            placeholder="Digite o valor da empresa:"
            step="0.01"
            {...register('companyValuation', { valueAsNumber: true })}
            className={errors.companyValuation ? 'error' : ''}
          />
          {errors.companyValuation && (
            <span className="error-message">{errors.companyValuation.message}</span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-submit-modal">
          {isSubmitting ? 'Criando...' : 'Criar cliente'}
        </button>
      </form>
    </Modal>
  );
}
