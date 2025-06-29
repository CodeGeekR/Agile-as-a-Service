import { atom, map } from 'nanostores';
import { getLocale, t } from '../i18n/index.js';

// Función para obtener historias traducidas según el idioma actual
function getLocalizedStories() {
  const locale = getLocale();
  
  if (locale === 'en') {
    return [
      {
        id: 1,
        title: "As a human being, I want to drink coffee so I don't collapse existentially",
        description: "Critical blocker: caffeine dependency management. Requires stakeholder analysis (barista), local coffee shop market research, and post-caffeine retrospective to optimize the process.",
        status: "TODO",
        points: 8,
        epicId: 1,
        sprintId: 1,
        assignee: "JD",
        priority: "CRITICAL",
        tags: ["blocker", "dependency"],
        acceptanceCriteria: [
          "Coffee must be at optimal temperature (65-70°C)",
          "Caffeine level must be sufficient for productivity KPIs",
          "Process must be documented for future iterations"
        ]
      },
      {
        id: 2,
        title: "As a responsible adult, I want to take out the trash to maintain neighborly relations",
        description: "High-priority epic: waste management with external stakeholder impact. Includes reputational risk analysis and contingency plan for forgetfulness.",
        status: "TODO",
        points: 13,
        epicId: 2,
        sprintId: 1,
        assignee: "JD",
        priority: "HIGH",
        tags: ["social-impact", "recurring"],
        acceptanceCriteria: [
          "Trash must be taken out before 7:00 AM",
          "Bags must be properly sealed",
          "Container must be returned to original position"
        ]
      },
      {
        id: 3,
        title: "As a functional member of society, I want to shower to be socially acceptable",
        description: "Critical story for maintaining hygiene standards according to social acceptance framework. Currently blocked by hot water availability and personal motivation.",
        status: "IN_PROGRESS",
        points: 5,
        epicId: 1,
        sprintId: 1,
        assignee: "JD",
        priority: "MEDIUM",
        tags: ["hygiene", "blocked"],
        acceptanceCriteria: [
          "Minimum duration: 5 minutes",
          "Soap usage mandatory",
          "Water temperature must be comfortable"
        ]
      },
      {
        id: 4,
        title: "As a food consumer, I want to buy groceries to avoid starvation",
        description: "Nutritional sustainability epic with multiple dependencies: transportation, budget, and complex decision-making at the supermarket. Requires planning poker to estimate effort.",
        status: "TODO",
        points: 21,
        epicId: 1,
        sprintId: null,
        assignee: "JD",
        priority: "HIGH",
        tags: ["complex", "dependencies"],
        acceptanceCriteria: [
          "Shopping list must be prioritized",
          "Budget must not exceed established limit",
          "Perishable products must have adequate expiration dates"
        ]
      },
      {
        id: 5,
        title: "As a person with a bed, I want to make it to feel productive",
        description: "Low-complexity story but high psychological impact. Successfully delivered after 3 sprints of refinement and multiple retrospectives on sheet-folding techniques.",
        status: "DONE",
        points: 2,
        epicId: 3,
        sprintId: 1,
        assignee: "JD",
        priority: "LOW",
        tags: ["quick-win", "psychological"],
        acceptanceCriteria: [
          "Sheets must be stretched without wrinkles",
          "Pillows correctly positioned",
          "Sense of achievement must be documented"
        ]
      },
      {
        id: 6,
        title: "As a professional, I want to check emails to maintain the illusion of productivity",
        description: "High-volume recurring task with questionable ROI. Includes sub-tasks of classification, automatic response, and structured procrastination.",
        status: "IN_PROGRESS",
        points: 3,
        epicId: 2,
        sprintId: 1,
        assignee: "JD",
        priority: "MEDIUM",
        tags: ["recurring", "low-value"],
        acceptanceCriteria: [
          "Inbox must reach zero (temporarily)",
          "Important emails must be flagged",
          "Responses must be sent within SLA"
        ]
      }
    ];
  }
  
  // Spanish stories (default)
  return [
    {
      id: 1,
      title: "Como ser humano, quiero beber café para no colapsar existencialmente",
      description: "Bloqueador crítico: gestión de dependencia de cafeína. Requiere análisis de stakeholders (barista), research de mercado de cafeterías locales y retrospectiva post-cafeína para optimizar el proceso.",
      status: "TODO",
      points: 8,
      epicId: 1,
      sprintId: 1,
      assignee: "JD",
      priority: "CRITICAL",
      tags: ["blocker", "dependency"],
      acceptanceCriteria: [
        "Café debe estar a temperatura óptima (65-70°C)",
        "Nivel de cafeína debe ser suficiente para KPIs de productividad",
        "Proceso debe ser documentado para futuras iteraciones"
      ]
    },
    {
      id: 2,
      title: "Como adulto responsable, quiero sacar la basura para mantener relaciones vecinales",
      description: "Epic de alta prioridad: gestión de residuos con impacto en stakeholders externos. Incluye análisis de riesgo reputacional y plan de contingencia para olvidos.",
      status: "TODO",
      points: 13,
      epicId: 2,
      sprintId: 1,
      assignee: "JD",
      priority: "HIGH",
      tags: ["social-impact", "recurring"],
      acceptanceCriteria: [
        "Basura debe ser sacada antes de las 7:00 AM",
        "Bolsas deben estar correctamente cerradas",
        "Contenedor debe ser devuelto a posición original"
      ]
    },
    {
      id: 3,
      title: "Como miembro funcional de la sociedad, quiero ducharme para ser socialmente aceptable",
      description: "Historia crítica para mantener estándares de higiene según framework de aceptación social. Actualmente bloqueada por disponibilidad de agua caliente y motivación personal.",
      status: "IN_PROGRESS",
      points: 5,
      epicId: 1,
      sprintId: 1,
      assignee: "JD",
      priority: "MEDIUM",
      tags: ["hygiene", "blocked"],
      acceptanceCriteria: [
        "Duración mínima: 5 minutos",
        "Uso de jabón obligatorio",
        "Temperatura del agua debe ser confortable"
      ]
    },
    {
      id: 4,
      title: "Como persona que consume alimentos, quiero comprar groceries para evitar la inanición",
      description: "Epic de sostenibilidad nutricional con múltiples dependencias: transporte, presupuesto, y toma de decisiones complejas en el supermercado. Requiere planning poker para estimar esfuerzo.",
      status: "TODO",
      points: 21,
      epicId: 1,
      sprintId: null,
      assignee: "JD",
      priority: "HIGH",
      tags: ["complex", "dependencies"],
      acceptanceCriteria: [
        "Lista de compras debe estar priorizada",
        "Presupuesto no debe exceder límite establecido",
        "Productos perecederos deben tener fecha de vencimiento adecuada"
      ]
    },
    {
      id: 5,
      title: "Como persona con cama, quiero hacerla para sentirme productivo",
      description: "Historia de baja complejidad pero alto impacto psicológico. Entregada exitosamente después de 3 sprints de refinamiento y múltiples retrospectivas sobre técnicas de doblado de sábanas.",
      status: "DONE",
      points: 2,
      epicId: 3,
      sprintId: 1,
      assignee: "JD",
      priority: "LOW",
      tags: ["quick-win", "psychological"],
      acceptanceCriteria: [
        "Sábanas deben estar estiradas sin arrugas",
        "Almohadas correctamente posicionadas",
        "Sensación de logro debe ser documentada"
      ]
    },
    {
      id: 6,
      title: "Como profesional, quiero revisar emails para mantener la ilusión de productividad",
      description: "Tarea recurrente de alto volumen con ROI cuestionable. Incluye sub-tareas de clasificación, respuesta automática y procrastinación estructurada.",
      status: "IN_PROGRESS",
      points: 3,
      epicId: 2,
      sprintId: 1,
      assignee: "JD",
      priority: "MEDIUM",
      tags: ["recurring", "low-value"],
      acceptanceCriteria: [
        "Inbox debe llegar a cero (temporalmente)",
        "Emails importantes deben ser flaggeados",
        "Respuestas deben ser enviadas dentro de SLA"
      ]
    }
  ];
}

// Función para obtener épicas traducidas
function getLocalizedEpics() {
  const locale = getLocale();
  
  if (locale === 'en') {
    return [
      {
        id: 1,
        title: "Basic Survival Q1 2025",
        description: "Fundamental epic to maintain operational existence",
        status: "ACTIVE",
        userId: 1
      },
      {
        id: 2,
        title: "Advanced Social Integration",
        description: "Optimization of interpersonal relationships through Agile framework",
        status: "PLANNING",
        userId: 1
      },
      {
        id: 3,
        title: "Domestic Excellence Sprint",
        description: "Digital transformation of home into productive environment",
        status: "BACKLOG",
        userId: 1
      }
    ];
  }
  
  // Spanish epics (default)
  return [
    {
      id: 1,
      title: "Supervivencia Básica Q1 2025",
      description: "Epic fundamental para mantener la existencia operativa",
      status: "ACTIVE",
      userId: 1
    },
    {
      id: 2,
      title: "Integración Social Avanzada",
      description: "Optimización de relaciones interpersonales mediante framework Agile",
      status: "PLANNING",
      userId: 1
    },
    {
      id: 3,
      title: "Excelencia Doméstica Sprint",
      description: "Transformación digital del hogar en entorno productivo",
      status: "BACKLOG",
      userId: 1
    }
  ];
}

// Función para obtener sprint activo traducido
function getLocalizedActiveSprint() {
  const locale = getLocale();
  
  if (locale === 'en') {
    return {
      id: 1,
      name: "Basic Survival Sprint",
      startDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), // 11 days ago
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days ahead
      status: "ACTIVE",
      goal: "Maintain operational existence with minimum human functionality KPIs",
      totalPoints: 31,
      completedPoints: 7,
      userId: 1
    };
  }
  
  // Spanish sprint (default)
  return {
    id: 1,
    name: "Sprint de Supervivencia Básica",
    startDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), // 11 días atrás
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días adelante
    status: "ACTIVE",
    goal: "Mantener la existencia operativa con KPIs mínimos de funcionalidad humana",
    totalPoints: 31,
    completedPoints: 7,
    userId: 1
  };
}

// Función para generar datos de burndown realistas
function generateBurndownData(activeSprint) {
  if (!activeSprint) return { ideal: [], actual: [] };
  
  const totalPoints = activeSprint.totalPoints;
  const completedPoints = activeSprint.completedPoints;
  const startDate = new Date(activeSprint.startDate);
  const endDate = new Date(activeSprint.endDate);
  const currentDate = new Date();
  
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.min(totalDays, Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24)));
  
  // Generate ideal burndown (linear)
  const ideal = [];
  for (let day = 0; day <= totalDays; day++) {
    const idealRemaining = totalPoints - (totalPoints * day / totalDays);
    ideal.push(Math.max(0, idealRemaining));
  }
  
  // Generate actual burndown with realistic patterns
  const actual = [];
  const dailyVelocity = completedPoints / Math.max(1, daysElapsed);
  
  for (let day = 0; day <= totalDays; day++) {
    if (day === 0) {
      actual.push(totalPoints);
    } else if (day <= daysElapsed) {
      // Add realistic variance
      const baseProgress = dailyVelocity * day;
      const variance = Math.sin(day * 0.8) * 1.5; // Daily variations
      const weekendSlowdown = (day % 7 === 0 || day % 7 === 6) ? -0.5 : 0; // Weekend effect
      const sprintStart = day <= 2 ? -1 : 0; // Slow start
      const sprintEnd = day >= totalDays - 2 ? 1 : 0; // Sprint push
      
      const actualCompleted = Math.min(totalPoints, Math.max(0, 
        baseProgress + variance + weekendSlowdown + sprintStart + sprintEnd
      ));
      actual.push(Math.max(0, totalPoints - actualCompleted));
    } else {
      actual.push(null); // Future days
    }
  }
  
  return { ideal, actual };
}

// Épicas predefinidas para el demo
export const $epics = atom(getLocalizedEpics());

// Historias de usuario predefinidas
export const $stories = atom(getLocalizedStories());

// Sprint activo
export const $activeSprint = atom(getLocalizedActiveSprint());

// Datos para burndown chart (generados dinámicamente)
export const $burndownData = atom(generateBurndownData(getLocalizedActiveSprint()));

// Funciones para manipular datos
export function updateStoryStatus(storyId, newStatus) {
  const stories = $stories.get();
  const updatedStories = stories.map(story => 
    story.id === storyId ? { ...story, status: newStatus } : story
  );
  $stories.set(updatedStories);
  
  // Actualizar puntos completados en el sprint
  updateBurndownData();
}

export function createStory(storyData) {
  const stories = $stories.get();
  const newStory = {
    id: Date.now(),
    assignee: "JD",
    priority: "MEDIUM",
    tags: [],
    acceptanceCriteria: [],
    ...storyData
  };
  $stories.set([...stories, newStory]);
}

export function updateBurndownData() {
  const stories = $stories.get();
  const activeSprint = $activeSprint.get();
  const sprintStories = stories.filter(s => s.sprintId === activeSprint.id);
  const completedPoints = sprintStories
    .filter(s => s.status === 'DONE')
    .reduce((sum, s) => sum + s.points, 0);
  
  const updatedSprint = {
    ...activeSprint,
    completedPoints
  };
  
  $activeSprint.set(updatedSprint);
  $burndownData.set(generateBurndownData(updatedSprint));
}

export function getStoriesByStatus(status) {
  const stories = $stories.get();
  const activeSprint = $activeSprint.get();
  return stories.filter(s => s.sprintId === activeSprint.id && s.status === status);
}

export function getSprintProgress() {
  const sprint = $activeSprint.get();
  const progress = (sprint.completedPoints / sprint.totalPoints) * 100;
  return Math.round(progress);
}

// Actualizar datos cuando cambie el idioma
if (typeof window !== 'undefined') {
  window.addEventListener('localeChanged', () => {
    $epics.set(getLocalizedEpics());
    $stories.set(getLocalizedStories());
    const newActiveSprint = getLocalizedActiveSprint();
    $activeSprint.set(newActiveSprint);
    $burndownData.set(generateBurndownData(newActiveSprint));
  });
}