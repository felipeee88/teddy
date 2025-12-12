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

interface ClientEditModalProps {
  client: Client;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id'>) => Promise<void>;
}

export function ClientEditModal({ client, onClose, onSave }: ClientEditModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client.name,
      salary: client.salary,
      companyValuation: client.companyValuation,
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    await onSave(data);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Editar cliente:">
      <form onSubmit={handleSubmit(onSubmit)} className="client-form">
        <div className="form-group">
          <input
            type="text"
            id="name"
            placeholder="Nome"
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
            placeholder="Salário"
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
            placeholder="Valor da empresa"
            step="0.01"
            {...register('companyValuation', { valueAsNumber: true })}
            className={errors.companyValuation ? 'error' : ''}
          />
          {errors.companyValuation && (
            <span className="error-message">{errors.companyValuation.message}</span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-submit-modal">
          {isSubmitting ? 'Editando...' : 'Editar cliente'}
        </button>
      </form>
    </Modal>
  );
}
