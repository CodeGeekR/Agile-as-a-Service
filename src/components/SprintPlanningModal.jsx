import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { $stories, $epics, createStory } from '../store/data.js';

export default function SprintPlanningModal({ isOpen, onClose, onStartSprint }) {
  const [selectedStories, setSelectedStories] = useState([]);
  const [sprintGoal, setSprintGoal] = useState('');
  const [sprintName, setSprintName] = useState('');
  const [newStoryForm, setNewStoryForm] = useState({
    title: '',
    description: '',
    points: 3,
    epicId: 1
  });
  const [showNewStoryForm, setShowNewStoryForm] = useState(false);

  const stories = useStore($stories);
  const epics = useStore($epics);
  
  const backlogStories = stories.filter(s => !s.sprintId || s.sprintId === null);
  const totalPoints = selectedStories.reduce((sum, id) => {
    const story = stories.find(s => s.id === id);
    return sum + (story?.points || 0);
  }, 0);

  const toggleStorySelection = (storyId) => {
    setSelectedStories(prev => 
      prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const handleCreateNewStory = () => {
    if (newStoryForm.title.trim()) {
      createStory({
        ...newStoryForm,
        status: 'TODO',
        sprintId: null
      });
      setNewStoryForm({
        title: '',
        description: '',
        points: 3,
        epicId: 1
      });
      setShowNewStoryForm(false);
    }
  };

  const handleStartSprint = () => {
    if (selectedStories.length > 0 && sprintName.trim()) {
      onStartSprint({
        name: sprintName,
        goal: sprintGoal,
        storyIds: selectedStories,
        totalPoints
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Sprint Planning</h2>
              <p className="opacity-90 mt-1">Planifica tu próximo sprint de existencia optimizada</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Left Panel - Sprint Details */}
          <div className="w-1/3 p-6 border-r border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Detalles del Sprint</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Sprint
                </label>
                <input
                  type="text"
                  value={sprintName}
                  onChange={(e) => setSprintName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Sprint de Supervivencia Avanzada"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo del Sprint
                </label>
                <textarea
                  value={sprintGoal}
                  onChange={(e) => setSprintGoal(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Mantener la funcionalidad básica mientras se optimizan los procesos de higiene personal..."
                />
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Métricas del Sprint</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Historias Seleccionadas:</span>
                    <span className="font-medium text-purple-600">{selectedStories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Story Points Totales:</span>
                    <span className="font-medium text-purple-600">{totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-medium">2 semanas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Velocity Estimada:</span>
                    <span className={`font-medium ${
                      totalPoints > 50 ? 'text-red-600' : 
                      totalPoints > 30 ? 'text-amber-600' : 
                      'text-green-600'
                    }`}>
                      {totalPoints > 50 ? 'Optimista' : totalPoints > 30 ? 'Realista' : 'Conservadora'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartSprint}
                disabled={selectedStories.length === 0 || !sprintName.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
              >
                Iniciar Sprint
              </button>
            </div>
          </div>

          {/* Right Panel - Story Selection */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Product Backlog</h3>
              <button
                onClick={() => setShowNewStoryForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nueva Historia
              </button>
            </div>

            {/* New Story Form */}
            {showNewStoryForm && (
              <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
                <h4 className="font-medium text-gray-900 mb-4">Crear Nueva Historia de Usuario</h4>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={newStoryForm.title}
                      onChange={(e) => setNewStoryForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Como [rol], quiero [acción] para [beneficio]"
                    />
                  </div>

                  <div>
                    <textarea
                      value={newStoryForm.description}
                      onChange={(e) => setNewStoryForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="3"
                      placeholder="Descripción y criterios de aceptación..."
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 font-medium">Points:</span>
                      {[1, 2, 3, 5, 8].map(points => (
                        <button
                          key={points}
                          onClick={() => setNewStoryForm(prev => ({ ...prev, points }))}
                          className={`w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                            newStoryForm.points === points
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {points}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowNewStoryForm(false)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleCreateNewStory}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Crear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stories List */}
            <div className="space-y-3">
              {backlogStories.map(story => {
                const epic = epics.find(e => e.id === story.epicId);
                const isSelected = selectedStories.includes(story.id);
                
                return (
                  <div
                    key={story.id}
                    onClick={() => toggleStorySelection(story.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                      isSelected
                        ? 'border-purple-300 bg-purple-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <h4 className="font-medium text-gray-900 text-sm flex-1">{story.title}</h4>
                        </div>
                        
                        {story.description && (
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {story.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-3 text-xs">
                          <span className="text-gray-500">{epic?.title}</span>
                          <span className={`px-2 py-1 rounded font-medium ${
                            story.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                            story.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {story.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex items-center space-x-2">
                        <span className={`inline-flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full ${
                          story.points <= 3 ? 'bg-green-200 text-green-800' :
                          story.points <= 8 ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {story.points}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {backlogStories.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <p className="text-gray-500">No hay historias en el backlog</p>
                <p className="text-sm text-gray-400 mt-1">Crea tu primera historia para comenzar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}