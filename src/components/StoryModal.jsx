import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { $epics, updateStoryStatus } from '../store/data.js';

export default function StoryModal({ story, isOpen, onClose, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [editedStory, setEditedStory] = useState(story || {});
  const [newComment, setNewComment] = useState('');
  const [comments] = useState([
    {
      id: 1,
      author: 'Scrum Master Interno',
      content: 'Esta historia necesita más criterios de aceptación específicos. ¿Cómo mediremos el éxito de esta tarea?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'feedback'
    },
    {
      id: 2,
      author: 'Product Owner de tu Vida',
      content: 'Bloqueada por dependencia externa. Necesitamos resolver el impedimento de motivación antes de continuar.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      type: 'blocker'
    }
  ]);

  const epics = useStore($epics);

  if (!isOpen || !story) return null;

  const epic = epics.find(e => e.id === story.epicId);
  
  const statusOptions = [
    { value: 'TODO', label: 'Por Hacer', color: 'bg-gray-100 text-gray-800' },
    { value: 'IN_PROGRESS', label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
    { value: 'DONE', label: 'Completado', color: 'bg-green-100 text-green-800' }
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Baja', color: 'bg-gray-100 text-gray-800' },
    { value: 'MEDIUM', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'HIGH', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: 'CRITICAL', label: 'Crítica', color: 'bg-red-100 text-red-800' }
  ];

  const handleStatusChange = (newStatus) => {
    updateStoryStatus(story.id, newStatus);
    onUpdate && onUpdate({ ...story, status: newStatus });
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-bg-secondary border-b border-border-color p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-sm text-text-secondary">#{story.id}</span>
                <span className="text-sm text-text-secondary">•</span>
                <span className="text-sm text-primary font-medium">{epic?.title}</span>
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">{story.title}</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={story.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-sm border border-border-color rounded px-3 py-1 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className={`px-3 py-1 text-sm font-medium rounded ${
                  priorityOptions.find(p => p.value === story.priority)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {priorityOptions.find(p => p.value === story.priority)?.label || story.priority}
                </span>
                <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full ${
                  story.points <= 3 ? 'bg-green-200 text-green-800' :
                  story.points <= 8 ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {story.points}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Descripción</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-text-secondary leading-relaxed">
                  {story.description || 'No hay descripción disponible.'}
                </p>
              </div>
            </div>

            {/* Acceptance Criteria */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Criterios de Aceptación</h3>
              <div className="space-y-2">
                {story.acceptanceCriteria && story.acceptanceCriteria.length > 0 ? (
                  story.acceptanceCriteria.map((criteria, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-text-primary">{criteria}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-yellow-800 text-sm">
                        <strong>Impedimento Metodológico:</strong> Esta historia carece de criterios de aceptación específicos. 
                        Se recomienda una sesión de refinamiento con el Product Owner de tu vida.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-3">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments/Activity */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Actividad y Comentarios</h3>
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="border border-border-color rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {comment.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary text-sm">{comment.author}</p>
                          <p className="text-xs text-text-secondary">{formatDate(comment.timestamp)}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        comment.type === 'blocker' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {comment.type === 'blocker' ? 'Bloqueador' : 'Feedback'}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">{comment.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="mt-4 border border-border-color rounded-lg p-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Añadir comentario sobre esta historia..."
                />
                <div className="flex justify-end mt-2">
                  <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded font-medium transition-colors text-sm">
                    Comentar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-50 p-6 border-l border-border-color overflow-y-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Detalles</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Asignado a</label>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{story.assignee}</span>
                  </div>
                  <span className="text-sm text-text-primary">John Doe (tú)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Épica</label>
                <p className="text-sm text-text-primary">{epic?.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Sprint</label>
                <p className="text-sm text-text-primary">
                  {story.sprintId ? 'Sprint de Supervivencia Básica' : 'Sin asignar'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Story Points</label>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full ${
                    story.points <= 3 ? 'bg-green-200 text-green-800' :
                    story.points <= 8 ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {story.points}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {story.points <= 3 ? 'Trivial' : story.points <= 8 ? 'Moderado' : 'Complejo'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Prioridad</label>
                <span className={`px-3 py-1 text-sm font-medium rounded ${
                  priorityOptions.find(p => p.value === story.priority)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {priorityOptions.find(p => p.value === story.priority)?.label || story.priority}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Creado</label>
                <p className="text-sm text-text-primary">Hace 3 días</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Última actualización</label>
                <p className="text-sm text-text-primary">Hace 2 horas</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-border-color">
              <h4 className="font-medium text-text-primary mb-3">Acciones</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-white hover:text-text-primary rounded transition-colors">
                  📝 Editar historia
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-white hover:text-text-primary rounded transition-colors">
                  🔗 Crear subtarea
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-white hover:text-text-primary rounded transition-colors">
                  📊 Ver métricas
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">
                  🗑️ Eliminar historia
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}