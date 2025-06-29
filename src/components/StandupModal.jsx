import { useState, useEffect } from 'preact/hooks';

export default function StandupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(['', '', '']);

  const questions = [
    "¿Qué hiciste ayer para optimizar tu existencia?",
    "¿Qué vas a hacer hoy para maximizar tu valor como unidad productiva?",
    "¿Hay algún impedimento que esté bloqueando tu felicidad según el framework Agile?"
  ];

  useEffect(() => {
    // Randomly interrupt the user with stand-up meetings
    const timer = setTimeout(() => {
      if (Math.random() > 0.7) { // 30% chance
        setIsOpen(true);
      }
    }, 10000 + Math.random() * 20000); // Between 10-30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // "Submit" the standup
      console.log('Daily Standup completed:', answers);
      setIsOpen(false);
      setCurrentQuestion(0);
      setAnswers(['', '', '']);
      
      // Schedule next interruption
      setTimeout(() => {
        if (Math.random() > 0.8) {
          setIsOpen(true);
        }
      }, 15000 + Math.random() * 30000);
    }
  };

  const updateAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="bg-primary text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">🚨 Daily Stand-up Obligatorio</h2>
            <div className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>
          <p className="text-sm opacity-90 mt-1">
            Es hora de sincronizar tu existencia con el equipo
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-primary mb-2">
              {questions[currentQuestion]}
            </label>
            <textarea
              value={answers[currentQuestion]}
              onChange={(e) => updateAnswer(e.target.value)}
              className="w-full p-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="4"
              placeholder="Escribe tu respuesta aquí... (obligatorio para continuar usando la aplicación)"
              required
            />
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-yellow-800 text-sm">
                <strong>Recordatorio:</strong> Las respuestas vacías o poco constructivas impactarán negativamente tu score de productividad personal.
              </p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Posponer (penalización -5 pts)
            </button>
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion].trim()}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestion === questions.length - 1 ? 'Finalizar Stand-up' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}