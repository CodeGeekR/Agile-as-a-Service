import { useState, useEffect } from 'preact/hooks';
import { createStory, $epics } from '../store/data.js';
import { useStore } from '@nanostores/preact';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: '¡Bienvenido a AaaS!',
    subtitle: 'Agile as a Service',
    content: 'Estás a punto de revolucionar tu existencia aplicando metodologías Agile a cada aspecto de tu vida diaria. Prepárate para convertir tareas simples en complejos workflows empresariales.'
  },
  {
    id: 'concepts',
    title: 'Conceptos Fundamentales',
    subtitle: 'Tu nueva realidad metodológica',
    content: 'En AaaS, tu vida se organiza en Épicas (grandes objetivos como "Supervivencia Básica"), Historias de Usuario (tareas específicas como "hacer café"), y Sprints (períodos de 2 semanas para completar objetivos).'
  },
  {
    id: 'first-epic',
    title: 'Tu Primera Épica de Vida',
    subtitle: 'Supervivencia Básica Q1 2025',
    content: 'Hemos creado tu primera épica: "Supervivencia Básica". Aquí gestionarás tareas críticas como alimentarte, hidratarte y mantener estándares mínimos de higiene personal.'
  },
  {
    id: 'create-story',
    title: 'Crear tu Primera Historia',
    subtitle: 'Transforma lo mundano en metodológico',
    content: 'Ahora crearás tu primera historia de usuario. Recuerda: debe seguir el formato "Como [rol], quiero [acción] para [beneficio]".'
  }
];

export default function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [newStory, setNewStory] = useState({
    title: '',
    description: '',
    points: 3,
    epicId: 1
  });
  const [showStoryForm, setShowStoryForm] = useState(false);
  const epics = useStore($epics);

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (currentStepData.id === 'create-story') {
      setShowStoryForm(true);
    } else if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleCreateStory = () => {
    if (newStory.title.trim()) {
      createStory({
        ...newStory,
        status: 'TODO',
        sprintId: 1
      });
      onComplete();
    }
  };

  const storyTemplates = [
    "Como ser humano, quiero desayunar para tener energía básica",
    "Como persona responsable, quiero pagar las cuentas para evitar cortes de servicios",
    "Como individuo social, quiero llamar a mi madre para mantener relaciones familiares",
    "Como profesional, quiero revisar emails para simular productividad"
  ];

  return (
    <div className="fixed inset-0 bg-primary bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Progress Bar */}
        <div className="bg-gray-200 h-2">
          <div 
            className="bg-primary h-2 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          {/* Step Counter */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
              Paso {currentStep + 1} de {ONBOARDING_STEPS.length}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {currentStepData.title}
            </h1>
            <h2 className="text-xl text-primary font-medium mb-4">
              {currentStepData.subtitle}
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed max-w-xl mx-auto">
              {currentStepData.content}
            </p>
          </div>

          {/* Special Content for Each Step */}
          {currentStepData.id === 'concepts' && (
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">É</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Épicas de Vida™</h3>
                <p className="text-sm text-text-secondary">Grandes objetivos existenciales divididos en sprints manejables</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">H</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Historias de Usuario</h3>
                <p className="text-sm text-text-secondary">Tareas específicas con criterios de aceptación detallados</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">S</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Sprints Existenciales</h3>
                <p className="text-sm text-text-secondary">Períodos de 2 semanas para lograr objetivos de vida</p>
              </div>
            </div>
          )}

          {currentStepData.id === 'first-epic' && (
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-lg mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Épica: Supervivencia Básica Q1 2025</h3>
                  <p className="opacity-90">Epic fundamental para mantener la existencia operativa</p>
                  <div className="flex items-center mt-3 space-x-4 text-sm">
                    <span>📊 89 Story Points</span>
                    <span>⏱️ Sprint Activo</span>
                    <span>🎯 23% Completado</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">89</div>
                  <div className="text-sm opacity-75">Puntos Totales</div>
                </div>
              </div>
            </div>
          )}

          {/* Story Creation Form */}
          {showStoryForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Crear tu Primera Historia de Usuario</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Título de la Historia (formato: Como [rol], quiero [acción] para [beneficio])
                </label>
                <input
                  type="text"
                  value={newStory.title}
                  onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Como ser humano, quiero..."
                />
                
                <div className="mt-2">
                  <p className="text-xs text-text-secondary mb-2">Sugerencias:</p>
                  <div className="flex flex-wrap gap-2">
                    {storyTemplates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => setNewStory(prev => ({ ...prev, title: template }))}
                        className="text-xs bg-white border border-border-color px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors"
                      >
                        {template.substring(0, 30)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Descripción Detallada
                </label>
                <textarea
                  value={newStory.description}
                  onChange={(e) => setNewStory(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="3"
                  placeholder="Incluye criterios de aceptación, dependencias y riesgos..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Story Points (Complejidad)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 5, 8, 13, 21].map(points => (
                    <button
                      key={points}
                      onClick={() => setNewStory(prev => ({ ...prev, points }))}
                      className={`w-10 h-10 rounded-full font-bold transition-colors ${
                        newStory.points === points
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {points}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  1-3: Trivial | 5-8: Moderado | 13-21: Complejo
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
              className={`px-6 py-2 rounded font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              disabled={currentStep === 0}
            >
              ← Anterior
            </button>

            <div className="flex space-x-2">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {showStoryForm ? (
              <button
                onClick={handleCreateStory}
                disabled={!newStory.title.trim()}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear Historia y Continuar →
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded font-medium transition-colors"
              >
                {isLastStep ? 'Ir al Dashboard →' : 'Siguiente →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}