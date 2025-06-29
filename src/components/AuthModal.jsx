import { useState } from 'preact/hooks';
import { login, register } from '../store/auth.js';

export default function AuthModal({ isOpen, onClose, mode = 'login' }) {
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (currentMode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.email, formData.password, formData.name);
      }

      if (result.success) {
        onClose();
        // Redirect to onboarding
        window.location.href = '/onboarding';
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error del sistema. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="bg-primary text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {currentMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm opacity-90 mt-2">
            {currentMode === 'login' 
              ? 'Accede a tu dashboard de existencia optimizada' 
              : 'Únete a la revolución de la ineficiencia metodológica'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {currentMode === 'register' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="w-full p-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tu nombre para el sprint de la vida"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email Corporativo
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              className="w-full p-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="tu.email@empresa.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              className="w-full p-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Mínimo 8 caracteres (como un sprint corto)"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Procesando...
              </div>
            ) : (
              currentMode === 'login' ? 'Iniciar Sprint' : 'Crear Cuenta'
            )}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setCurrentMode(currentMode === 'login' ? 'register' : 'login')}
              className="text-primary hover:text-primary-dark text-sm transition-colors"
            >
              {currentMode === 'login' 
                ? '¿No tienes cuenta? Regístrate aquí' 
                : '¿Ya tienes cuenta? Inicia sesión'
              }
            </button>
          </div>
        </form>

        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-blue-800 text-xs">
              <strong>Tip Pro:</strong> Una vez dentro, no podrás escapar de las ceremonias Agile obligatorias. 
              Tu productividad será monitoreada 24/7 por nuestros algoritmos de optimización existencial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}