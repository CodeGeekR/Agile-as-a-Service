import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { $stories, $activeSprint, updateStoryStatus, getStoriesByStatus } from '../store/data.js';
import StoryModal from './StoryModal.jsx';

const columns = [
  { id: 'TODO', title: 'Por Hacer', bgColor: 'bg-gray-50', limit: null },
  { id: 'IN_PROGRESS', title: 'En Progreso', bgColor: 'bg-blue-50', limit: 3 },
  { id: 'DONE', title: 'Completado', bgColor: 'bg-green-50', limit: null }
];

export default function KanbanBoard() {
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);

  const stories = useStore($stories);
  const activeSprint = useStore($activeSprint);

  const sprintStories = stories.filter(story => story.sprintId === activeSprint.id);

  const handleDragStart = (e, story) => {
    setDraggedItem(story);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem.status !== newStatus) {
      // Check WIP limits
      const column = columns.find(col => col.id === newStatus);
      if (column.limit) {
        const currentCount = getStoriesByStatus(newStatus).length;
        if (currentCount >= column.limit) {
          alert(`⚠️ Límite WIP alcanzado: Máximo ${column.limit} historias en "${column.title}"`);
          return;
        }
      }

      updateStoryStatus(draggedItem.id, newStatus);
      
      // Show celebration for completed tasks
      if (newStatus === 'DONE') {
        showCompletionCelebration(draggedItem);
      }
    }
    
    setDraggedItem(null);
  };

  const showCompletionCelebration = (story) => {
    // Create a temporary celebration element
    const celebration = document.createElement('div');
    celebration.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                  background: linear-gradient(45deg, #00875A, #36B37E); color: white; 
                  padding: 20px; border-radius: 10px; z-index: 1000; text-align: center;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: celebrationPop 0.5s ease-out;">
        <div style="font-size: 24px; margin-bottom: 10px;">🎉</div>
        <div style="font-weight: bold; margin-bottom: 5px;">¡Historia Completada!</div>
        <div style="font-size: 14px; opacity: 0.9;">+${story.points} puntos de productividad existencial</div>
      </div>
    `;
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      document.body.removeChild(celebration);
    }, 3000);
  };

  const getStoriesForColumn = (status) => {
    return sprintStories.filter(story => story.status === status);
  };

  const getStatusColors = (status) => {
    const colors = {
      TODO: 'bg-gray-100 text-gray-600',
      IN_PROGRESS: 'bg-blue-100 text-blue-600',
      DONE: 'bg-green-100 text-green-600'
    };
    return colors[status];
  };

  const getPointsColor = (points) => {
    return points <= 3 ? 'bg-green-200 text-green-800' : 
           points <= 5 ? 'bg-yellow-200 text-yellow-800' : 
           'bg-red-200 text-red-800';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      CRITICAL: '🔥',
      HIGH: '⬆️',
      MEDIUM: '➡️',
      LOW: '⬇️'
    };
    return icons[priority] || '➡️';
  };

  const openStoryModal = (story) => {
    setSelectedStory(story);
    setShowStoryModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map(column => {
          const columnStories = getStoriesForColumn(column.id);
          const isOverLimit = column.limit && columnStories.length > column.limit;
          
          return (
            <div
              key={column.id}
              className={`${column.bgColor} rounded-lg p-4 min-h-96 transition-all duration-200 ${
                draggedItem && draggedItem.status !== column.id ? 'ring-2 ring-primary ring-opacity-50' : ''
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-text-primary text-sm uppercase tracking-wide">
                    {column.title}
                  </h2>
                  {column.limit && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      isOverLimit ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      WIP: {columnStories.length}/{column.limit}
                    </span>
                  )}
                </div>
                <span className="bg-text-secondary text-white text-xs px-2 py-1 rounded-full">
                  {columnStories.length}
                </span>
              </div>
              
              {isOverLimit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-800 text-xs">
                    ⚠️ <strong>Límite WIP excedido:</strong> Demasiadas tareas en progreso pueden afectar tu velocity.
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                {columnStories.map(story => (
                  <div
                    key={story.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, story)}
                    onDragEnd={handleDragEnd}
                    onClick={() => openStoryModal(story)}
                    className="bg-bg-secondary p-4 rounded-lg shadow-sm border border-border-color hover:shadow-md transition-all duration-200 cursor-move group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start space-x-2 flex-1">
                        <span className="text-sm">{getPriorityIcon(story.priority)}</span>
                        <h3 className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                          {story.title}
                        </h3>
                      </div>
                      <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${getPointsColor(story.points)} ml-2 flex-shrink-0`}>
                        {story.points}
                      </span>
                    </div>
                    
                    {story.description && (
                      <p className="text-xs text-text-secondary mb-3 line-clamp-2">
                        {story.description.substring(0, 100)}...
                      </p>
                    )}
                    
                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {story.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {story.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{story.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-text-secondary">#{story.id}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColors(story.status)}`}>
                          {story.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{story.assignee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {column.id === 'TODO' && (
                <button className="w-full mt-4 p-3 border-2 border-dashed border-border-color text-text-secondary hover:border-primary hover:text-primary transition-colors rounded-lg text-sm">
                  + Crear Nueva Historia de Usuario
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Story Modal */}
      <StoryModal
        story={selectedStory}
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        onUpdate={(updatedStory) => {
          setSelectedStory(updatedStory);
        }}
      />

      <style jsx>{`
        @keyframes celebrationPop {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}