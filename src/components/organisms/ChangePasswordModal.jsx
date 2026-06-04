import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Icon from '../atoms/Icon';

const ChangePasswordModal = () => {
  const { user, changePassword, logout } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Solamente mostrar el modal si el usuario está autenticado y tiene pendiente el cambio de contraseña
  if (!user || !user.mustChangePassword) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(newPassword);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al cambiar la contraseña. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden p-8 text-center animate-scale-in">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
            success ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
          }`}>
            <Icon name={success ? 'check_circle' : 'lock_reset'} className="text-3xl" />
          </div>
        </div>

        {success ? (
          <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold text-slate-800">¡Contraseña Actualizada!</h2>
            <p className="font-body text-slate-500 text-sm">
              Tu contraseña ha sido actualizada con éxito. Ya puedes comenzar a utilizar la plataforma con tus nuevas credenciales.
            </p>
            <div className="pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-full transition-all cursor-pointer shadow-md border-none"
              >
                Comenzar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="text-center space-y-2">
              <h2 className="font-headline text-2xl font-bold text-slate-800">Actualizar Contraseña</h2>
              <p className="font-body text-slate-500 text-sm">
                Has iniciado sesión con tu contraseña temporal (DNI). Por motivos de seguridad, debes establecer una nueva contraseña para continuar.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nueva Contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:bg-white focus:outline-none transition-all text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmar Contraseña</label>
                <input
                  type="password"
                  placeholder="Repite la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:bg-white focus:outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-100 p-3 rounded-xl text-center">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-full shadow-lg shadow-orange-600/10 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border-none"
              >
                {isSubmitting ? 'Guardando...' : 'Cambiar Contraseña'}
              </button>
              <button
                type="button"
                onClick={() => logout()}
                className="w-full py-3 bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-bold text-xs rounded-full transition-all cursor-pointer border-none"
              >
                Cerrar Sesión
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
