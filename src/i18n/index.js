// Sistema de internacionalización ligero para AaaS
let currentLocale = 'es';
let isInitialized = false;

// Detectar idioma del navegador
function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  return browserLang.startsWith('en') ? 'en' : 'es';
}

// Inicializar idioma
function initializeLocale() {
  if (isInitialized) return;
  
  const savedLocale = localStorage.getItem('aaas-locale');
  
  if (savedLocale) {
    // Si hay un idioma guardado, usarlo (prioridad máxima)
    currentLocale = savedLocale;
  } else {
    // Solo detectar automáticamente si no hay preferencia guardada
    const detectedLocale = detectBrowserLanguage();
    currentLocale = detectedLocale;
    localStorage.setItem('aaas-locale', currentLocale);
  }
  
  isInitialized = true;
  
  // Disparar evento inmediatamente después de inicializar
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('localeInitialized', { detail: { locale: currentLocale } }));
    }, 100);
  }
}

// Obtener idioma actual
export function getLocale() {
  if (!isInitialized) {
    initializeLocale();
  }
  return currentLocale;
}

// Cambiar idioma
export function setLocale(locale) {
  if (locale === currentLocale) return; // No hacer nada si es el mismo idioma
  
  const previousLocale = currentLocale;
  currentLocale = locale;
  localStorage.setItem('aaas-locale', locale);
  
  // Actualizar toda la página
  updatePageContent();
  
  // Disparar evento personalizado para componentes que necesiten actualizarse
  window.dispatchEvent(new CustomEvent('localeChanged', { 
    detail: { 
      locale, 
      previousLocale 
    } 
  }));
  
  console.log(`🌐 Language changed from ${previousLocale} to ${locale}`);
}

// Función de traducción
export function t(key, params = {}) {
  const keys = key.split('.');
  let value = translations[currentLocale];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (!value) {
    console.warn(`Translation missing for key: ${key} in locale: ${currentLocale}`);
    return key;
  }
  
  // Reemplazar parámetros
  return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
    return params[param] || match;
  });
}

// Actualizar contenido de la página
function updatePageContent() {
  // Actualizar elementos con data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });
  
  // Actualizar placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = t(key);
  });
  
  // Actualizar títulos
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    element.title = t(key);
  });
  
  // Actualizar contenido HTML
  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    const key = element.getAttribute('data-i18n-html');
    element.innerHTML = t(key);
  });
}

// Función para forzar actualización completa de la página
export function forceUpdatePageContent() {
  updatePageContent();
}

// Inicializar cuando se carga el DOM
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeLocale();
    updatePageContent();
  });
}

// Traducciones
const translations = {
  es: {
    // Landing Page
    hero: {
      title: "Agile as a Service",
      subtitle: "Optimiza tu existencia con el framework que está revolucionando la ineficiencia. Transforma el caos de tu vida en un backlog perfectamente organizado de decepciones predecibles.",
      startSprint: "Comenzar Sprint Gratuito",
      viewDemo: "🎯 Ver Demo Completo",
      demoAvailable: "DEMO PÚBLICO DISPONIBLE",
      tryPlatform: "Prueba la plataforma completa sin registro:",
      email: "Email:",
      password: "Password:",
      orCreate: "O usa cualquier email/contraseña para crear tu cuenta",
      trustedBy: "Confían en nosotros:",
      notReally: "*No realmente, pero podrían"
    },
    features: {
      title: "¿Por qué complicar lo simple cuando puedes hacer lo imposible?",
      subtitle: "Nuestro framework patentado convierte tareas de 5 minutos en épicas de múltiples sprints, garantizando la máxima burocracia en cada aspecto de tu vida diaria.",
      epics: {
        title: "Épicas de Vida™",
        description: "Convierte \"hacer café\" en una épica de 34 historias de usuario. Incluye análisis de stakeholders, research de mercado de cafeterías y retrospectiva post-cafeína."
      },
      burndown: {
        title: "Burndown Existencial",
        description: "Gráficos detallados que muestran cómo tu felicidad decrece proporcionalmente al avance del sprint. Incluye métricas de ansiedad y desesperanza."
      },
      ceremonies: {
        title: "Ceremonias Forzadas",
        description: "Daily stand-ups obligatorios contigo mismo. Retrospectivas semanales sobre por qué no lograste tus objetivos. Planning poker para decidir cuántos puntos vale ducharse."
      }
    },
    demoAccess: {
      title: "Acceso Demo Instantáneo",
      description: "Prueba todas las funcionalidades de AaaS sin necesidad de registro. Usa estas credenciales públicas para acceder inmediatamente:",
      emailDemo: "Email Demo:",
      passwordDemo: "Password Demo:",
      accessNow: "🚀 Acceder al Demo Ahora",
      includes: "Dashboard completo • Kanban interactivo • Métricas en tiempo real • Stand-ups forzados • Y mucho más sufrimiento metodológico"
    },
    testimonials: {
      title: "Lo que dicen nuestros usuarios desesperados",
      testimonial1: "\"Antes tardaba 30 segundos en cepillarme los dientes. Ahora tengo un backlog de 47 subtareas y 3 dependencias externas. ¡Nunca había sido tan productivamente miserable!\"",
      testimonial2: "\"Mi sprint para 'hacer la cama' lleva 3 iteraciones. He identificado 12 impedimentos y estoy considerando contratar un Scrum Master para mi dormitorio.\"",
      testimonial3: "\"AaaS me ha enseñado que incluso respirar puede optimizarse con un framework Agile. Ahora tengo KPIs para cada inhalación.\"",
      role1: "Senior Life Engineer",
      role2: "Product Owner de su propia vida",
      role3: "Agile Coach Existencial"
    },
    cta: {
      title: "¿Listo para transformar tu vida en un proyecto fallido perfectamente documentado?",
      subtitle: "Únete a los miles de profesionales que ya han convertido su existencia en un desastre metodológicamente impecable.",
      startFree: "Comenzar Sprint Gratuito",
      talkConsultant: "Hablar con un Consultor",
      noCommitment: "Sin compromiso. Cancela cuando te des cuenta de lo absurdo de todo esto."
    },
    footer: {
      tagline: "Revolucionando la ineficiencia desde 2025.",
      product: "Producto",
      features: "Características",
      pricing: "Precios",
      integrations: "Integraciones",
      company: "Empresa",
      about: "Sobre nosotros",
      careers: "Carreras",
      press: "Prensa",
      support: "Soporte",
      documentation: "Documentación",
      guides: "Guías",
      status: "Estado del sistema",
      copyright: "© 2025 AaaS. Todos los derechos innecesariamente reservados. Hecho con 💀 para el Hackathon \"Mierda Inútil\""
    },
    // Auth Modal
    auth: {
      login: "Iniciar Sesión",
      register: "Crear Cuenta",
      loginSubtitle: "Accede a tu dashboard de existencia optimizada",
      registerSubtitle: "Únete a la revolución de la ineficiencia metodológica",
      fullName: "Nombre Completo",
      fullNamePlaceholder: "Tu nombre para el sprint de la vida",
      corporateEmail: "Email Corporativo",
      emailPlaceholder: "tu.email@empresa.com",
      password: "Contraseña",
      passwordPlaceholder: "Mínimo 6 caracteres",
      demoPublic: "Demo Público:",
      autoFillDemo: "Autocompletar credenciales demo",
      startSprint: "Iniciar Sprint",
      createAccount: "Crear Cuenta",
      noAccount: "¿No tienes cuenta? Regístrate aquí",
      hasAccount: "¿Ya tienes cuenta? Inicia sesión",
      tipPro: "Una vez dentro, no podrás escapar de las ceremonias Agile obligatorias. Tu productividad será monitoreada 24/7 por nuestros algoritmos de optimización existencial.",
      processing: "Procesando..."
    },
    // Dashboard
    dashboard: {
      title: "Sprint: \"Supervivencia Básica Q1 2025\"",
      titleEn: "Sprint: \"Basic Survival Q1 2025\"",
      loading: "Cargando información del sprint...",
      inCrisis: "🔥 En Crisis",
      createStory: "Crear Historia",
      sprintPlanning: "Sprint Planning",
      pointsRemaining: "Puntos Restantes",
      daysRemaining: "Días Restantes",
      completed: "Completado",
      velocity: "Velocidad",
      criticalRisk: "🚨 Sprint en Zona de Riesgo Crítico",
      risk: "⚠️ Sprint en Zona de Riesgo",
      onTrack: "✅ Sprint en Buen Camino",
      criticalMessage: "Su existencia está significativamente por debajo de las expectativas del sprint. Se recomienda: escalar con el Product Owner de su vida, implementar pair programming para tareas básicas, y considerar reducir el scope del sprint eliminando \"dormir 8 horas\".",
      riskMessage: "Su productividad está en zona de riesgo. Considere implementar pair programming para tareas básicas y revisar impedimentos actuales.",
      onTrackMessage: "Su sprint está en buen camino. Mantenga el momentum actual y prepare la retrospectiva de éxitos.",
      kanbanTitle: "Tablero Kanban de la Existencia",
      todo: "Por Hacer",
      inProgress: "En Progreso",
      done: "Completado",
      wipLimit: "Demasiadas tareas en progreso pueden afectar tu velocity.",
      createNewStory: "+ Crear Nueva Historia de Usuario",
      burndownTitle: "Gráfico Burndown:",
      ideal: "Ideal",
      reality: "Realidad Deplorable",
      despairChart: "Gráfico de desesperanza existencial",
      trendWorsening: "Tendencia: Empeorando significativamente",
      trendImproving: "Tendencia: Mejorando gradualmente",
      systemAlert: "🚨 Alerta del Sistema:",
      systemWarning: "⚠️ Advertencia del Sistema:",
      systemStatus: "✅ Estado del Sistema:",
      alertMessage: "Su existencia está significativamente por debajo de los KPIs establecidos. Se recomienda una reunión de crisis con su Scrum Master interno.",
      warningMessage: "Su productividad está en zona de riesgo. Considere implementar pair programming para tareas básicas.",
      statusMessage: "Su sprint está en buen camino. Mantenga el momentum actual y prepare la retrospectiva de éxitos.",
      recentActivity: "Actividad Reciente del Sprint",
      storyBlocked: "Historia bloqueada:",
      storyCompleted: "Historia completada:",
      impedimentIdentified: "Impedimento identificado:",
      hoursAgo: "Hace {{hours}} horas",
      daysAgo: "Hace {{days}} días",
      sprintName: "Sprint de Supervivencia Básica",
      activeStories: "historias activas",
      daysRemainingText: "días restantes",
      pointsToComplete: "puntos por completar",
      successProbability: "Probabilidad de Éxito",
      wipLimitExceeded: "Límite WIP excedido:",
      wipLimitReached: "⚠️ Límite WIP alcanzado: Máximo 3 historias en \"En Progreso\"",
      noSpecificDescription: "Sin descripción específica.",
      reminder: "Recordatorio:",
      sprintPlanningMessage: "🚧 Sprint Planning estará disponible en la próxima iteración. Mientras tanto, puedes crear nuevas historias y gestionar el sprint actual."
    },
    // Story Modal
    story: {
      createNew: "Crear Nueva Historia de Usuario",
      title: "Título de la Historia",
      titlePlaceholder: "Como [rol], quiero [acción] para [beneficio]",
      description: "Descripción",
      descriptionPlaceholder: "Incluye criterios de aceptación, dependencias y riesgos...",
      storyPoints: "Story Points",
      cancel: "Cancelar",
      create: "Crear Historia",
      completed: "¡Historia Completada!",
      pointsEarned: "+{{points}} puntos de productividad existencial"
    },
    // Stand-up Modal
    standup: {
      title: "🚨 Daily Stand-up Obligatorio",
      subtitle: "Es hora de sincronizar tu existencia con el equipo",
      question1: "¿Qué hiciste ayer para optimizar tu existencia?",
      question2: "¿Qué vas a hacer hoy para maximizar tu valor como unidad productiva?",
      question3: "¿Hay algún impedimento que esté bloqueando tu felicidad según el framework Agile?",
      placeholder: "Escribe tu respuesta aquí... (obligatorio para continuar usando la aplicación)",
      reminder: "Las respuestas vacías o poco constructivas impactarán negativamente tu score de productividad personal.",
      postpone: "Posponer (penalización -5 pts)",
      next: "Siguiente",
      finish: "Finalizar Stand-up"
    },
    // Onboarding
    onboarding: {
      welcome: "¡Bienvenido a AaaS!",
      subtitle: "Agile as a Service",
      welcomeMessage: "¡Hola {{name}}! Estás a punto de revolucionar tu existencia aplicando metodologías Agile a cada aspecto de tu vida diaria. Prepárate para convertir tareas simples en complejos workflows empresariales.",
      concepts: "Conceptos Fundamentales",
      conceptsSubtitle: "Tu nueva realidad metodológica",
      conceptsMessage: "En AaaS, tu vida se organiza en Épicas (grandes objetivos como \"Supervivencia Básica\"), Historias de Usuario (tareas específicas como \"hacer café\"), y Sprints (períodos de 2 semanas para completar objetivos).",
      firstEpic: "Tu Primera Épica de Vida",
      firstEpicSubtitle: "Supervivencia Básica Q1 2025",
      firstEpicMessage: "Hemos creado tu primera épica: \"Supervivencia Básica\". Aquí gestionarás tareas críticas como alimentarte, hidratarte y mantener estándares mínimos de higiene personal.",
      ready: "Listo para Comenzar",
      readySubtitle: "Tu dashboard te espera",
      readyMessage: "Ya tienes todo configurado. Tu primera épica está lista, algunas historias de ejemplo han sido creadas, y tu primer sprint está a punto de comenzar. ¡Es hora de optimizar tu existencia!",
      epicsTitle: "Épicas de Vida™",
      epicsDescription: "Grandes objetivos existenciales divididos en sprints manejables",
      storiesTitle: "Historias de Usuario",
      storiesDescription: "Tareas específicas con criterios de aceptación detallados",
      sprintsTitle: "Sprints Existenciales",
      sprintsDescription: "Períodos de 2 semanas para lograr objetivos de vida",
      previous: "← Anterior",
      next: "Siguiente →",
      goToDashboard: "Ir al Dashboard →",
      step: "Paso {{current}} de {{total}}"
    },
    // Header
    header: {
      home: "Home",
      dashboard: "Dashboard",
      sprints: "Sprints",
      retrospectives: "Retrospectives",
      logout: "Cerrar Sesión",
      logoutConfirm: "¿Estás seguro de que quieres cerrar sesión? Perderás todo tu progreso existencial."
    },
    // Common
    common: {
      close: "Cerrar",
      save: "Guardar",
      edit: "Editar",
      delete: "Eliminar",
      confirm: "Confirmar",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      warning: "Advertencia",
      info: "Información"
    }
  },
  en: {
    // Landing Page
    hero: {
      title: "Agile as a Service",
      subtitle: "Optimize your existence with the framework that's revolutionizing inefficiency. Transform the chaos of your life into a perfectly organized backlog of predictable disappointments.",
      startSprint: "Start Free Sprint",
      viewDemo: "🎯 View Full Demo",
      demoAvailable: "PUBLIC DEMO AVAILABLE",
      tryPlatform: "Try the complete platform without registration:",
      email: "Email:",
      password: "Password:",
      orCreate: "Or use any email/password to create your account",
      trustedBy: "Trusted by:",
      notReally: "*Not really, but they could be"
    },
    features: {
      title: "Why make simple things complicated when you can make impossible things?",
      subtitle: "Our patented framework converts 5-minute tasks into multi-sprint epics, guaranteeing maximum bureaucracy in every aspect of your daily life.",
      epics: {
        title: "Life Epics™",
        description: "Turn \"making coffee\" into a 34-user-story epic. Includes stakeholder analysis, coffee shop market research, and post-caffeine retrospective."
      },
      burndown: {
        title: "Existential Burndown",
        description: "Detailed charts showing how your happiness decreases proportionally to sprint progress. Includes anxiety and despair metrics."
      },
      ceremonies: {
        title: "Forced Ceremonies",
        description: "Mandatory daily stand-ups with yourself. Weekly retrospectives on why you didn't achieve your goals. Planning poker to decide how many points showering is worth."
      }
    },
    demoAccess: {
      title: "Instant Demo Access",
      description: "Try all AaaS functionalities without registration. Use these public credentials to access immediately:",
      emailDemo: "Demo Email:",
      passwordDemo: "Demo Password:",
      accessNow: "🚀 Access Demo Now",
      includes: "Complete Dashboard • Interactive Kanban • Real-time Metrics • Forced Stand-ups • And much more methodological suffering"
    },
    testimonials: {
      title: "What our desperate users say",
      testimonial1: "\"I used to take 30 seconds to brush my teeth. Now I have a backlog of 47 subtasks and 3 external dependencies. I've never been so productively miserable!\"",
      testimonial2: "\"My 'make the bed' sprint is on its 3rd iteration. I've identified 12 impediments and I'm considering hiring a Scrum Master for my bedroom.\"",
      testimonial3: "\"AaaS has taught me that even breathing can be optimized with an Agile framework. Now I have KPIs for every inhalation.\"",
      role1: "Senior Life Engineer",
      role2: "Product Owner of their own life",
      role3: "Existential Agile Coach"
    },
    cta: {
      title: "Ready to transform your life into a perfectly documented failed project?",
      subtitle: "Join thousands of professionals who have already converted their existence into a methodologically impeccable disaster.",
      startFree: "Start Free Sprint",
      talkConsultant: "Talk to a Consultant",
      noCommitment: "No commitment. Cancel when you realize how absurd this all is."
    },
    footer: {
      tagline: "Revolutionizing inefficiency since 2025.",
      product: "Product",
      features: "Features",
      pricing: "Pricing",
      integrations: "Integrations",
      company: "Company",
      about: "About us",
      careers: "Careers",
      press: "Press",
      support: "Support",
      documentation: "Documentation",
      guides: "Guides",
      status: "System status",
      copyright: "© 2025 AaaS. All rights unnecessarily reserved. Made with 💀 for the \"Useless Shit\" Hackathon"
    },
    // Auth Modal
    auth: {
      login: "Sign In",
      register: "Create Account",
      loginSubtitle: "Access your optimized existence dashboard",
      registerSubtitle: "Join the methodological inefficiency revolution",
      fullName: "Full Name",
      fullNamePlaceholder: "Your name for the sprint of life",
      corporateEmail: "Corporate Email",
      emailPlaceholder: "your.email@company.com",
      password: "Password",
      passwordPlaceholder: "Minimum 6 characters",
      demoPublic: "Public Demo:",
      autoFillDemo: "Auto-fill demo credentials",
      startSprint: "Start Sprint",
      createAccount: "Create Account",
      noAccount: "Don't have an account? Register here",
      hasAccount: "Already have an account? Sign in",
      tipPro: "Once inside, you won't be able to escape mandatory Agile ceremonies. Your productivity will be monitored 24/7 by our existential optimization algorithms.",
      processing: "Processing..."
    },
    // Dashboard
    dashboard: {
      title: "Sprint: \"Basic Survival Q1 2025\"",
      titleEn: "Sprint: \"Basic Survival Q1 2025\"",
      loading: "Loading sprint information...",
      inCrisis: "🔥 In Crisis",
      createStory: "Create Story",
      sprintPlanning: "Sprint Planning",
      pointsRemaining: "Points Remaining",
      daysRemaining: "Days Remaining",
      completed: "Completed",
      velocity: "Velocity",
      criticalRisk: "🚨 Sprint in Critical Risk Zone",
      risk: "⚠️ Sprint in Risk Zone",
      onTrack: "✅ Sprint on Track",
      criticalMessage: "Your existence is significantly below sprint expectations. Recommended: escalate with your life's Product Owner, implement pair programming for basic tasks, and consider reducing sprint scope by eliminating \"sleeping 8 hours\".",
      riskMessage: "Your productivity is in the risk zone. Consider implementing pair programming for basic tasks and reviewing current impediments.",
      onTrackMessage: "Your sprint is on track. Maintain current momentum and prepare the success retrospective.",
      kanbanTitle: "Existence Kanban Board",
      todo: "To Do",
      inProgress: "In Progress",
      done: "Done",
      wipLimit: "Too many tasks in progress can affect your velocity.",
      createNewStory: "+ Create New User Story",
      burndownTitle: "Burndown Chart:",
      ideal: "Ideal",
      reality: "Deplorable Reality",
      despairChart: "Existential despair chart",
      trendWorsening: "Trend: Significantly worsening",
      trendImproving: "Trend: Gradually improving",
      systemAlert: "🚨 System Alert:",
      systemWarning: "⚠️ System Warning:",
      systemStatus: "✅ System Status:",
      alertMessage: "Your existence is significantly below established KPIs. A crisis meeting with your internal Scrum Master is recommended.",
      warningMessage: "Your productivity is in the risk zone. Consider implementing pair programming for basic tasks.",
      statusMessage: "Your sprint is on track. Maintain current momentum and prepare the success retrospective.",
      recentActivity: "Recent Sprint Activity",
      storyBlocked: "Story blocked:",
      storyCompleted: "Story completed:",
      impedimentIdentified: "Impediment identified:",
      hoursAgo: "{{hours}} hours ago",
      daysAgo: "{{days}} days ago",
      sprintName: "Basic Survival Sprint",
      activeStories: "active stories",
      daysRemainingText: "days remaining",
      pointsToComplete: "points to complete",
      successProbability: "Success Probability",
      wipLimitExceeded: "WIP limit exceeded:",
      wipLimitReached: "⚠️ WIP limit reached: Maximum 3 stories in \"In Progress\"",
      noSpecificDescription: "No specific description.",
      reminder: "Reminder:",
      sprintPlanningMessage: "🚧 Sprint Planning will be available in the next iteration. Meanwhile, you can create new stories and manage the current sprint."
    },
    // Story Modal
    story: {
      createNew: "Create New User Story",
      title: "Story Title",
      titlePlaceholder: "As [role], I want [action] so that [benefit]",
      description: "Description",
      descriptionPlaceholder: "Include acceptance criteria, dependencies and risks...",
      storyPoints: "Story Points",
      cancel: "Cancel",
      create: "Create Story",
      completed: "Story Completed!",
      pointsEarned: "+{{points}} existential productivity points"
    },
    // Stand-up Modal
    standup: {
      title: "🚨 Mandatory Daily Stand-up",
      subtitle: "Time to synchronize your existence with the team",
      question1: "What did you do yesterday to optimize your existence?",
      question2: "What will you do today to maximize your value as a productive unit?",
      question3: "Are there any impediments blocking your happiness according to the Agile framework?",
      placeholder: "Write your answer here... (required to continue using the application)",
      reminder: "Empty or unconstructive answers will negatively impact your personal productivity score.",
      postpone: "Postpone (-5 pts penalty)",
      next: "Next",
      finish: "Finish Stand-up"
    },
    // Onboarding
    onboarding: {
      welcome: "Welcome to AaaS!",
      subtitle: "Agile as a Service",
      welcomeMessage: "Hello {{name}}! You're about to revolutionize your existence by applying Agile methodologies to every aspect of your daily life. Get ready to turn simple tasks into complex enterprise workflows.",
      concepts: "Fundamental Concepts",
      conceptsSubtitle: "Your new methodological reality",
      conceptsMessage: "In AaaS, your life is organized into Epics (big goals like \"Basic Survival\"), User Stories (specific tasks like \"making coffee\"), and Sprints (2-week periods to complete objectives).",
      firstEpic: "Your First Life Epic",
      firstEpicSubtitle: "Basic Survival Q1 2025",
      firstEpicMessage: "We've created your first epic: \"Basic Survival\". Here you'll manage critical tasks like eating, hydrating, and maintaining minimum personal hygiene standards.",
      ready: "Ready to Begin",
      readySubtitle: "Your dashboard awaits",
      readyMessage: "Everything is set up. Your first epic is ready, some example stories have been created, and your first sprint is about to begin. Time to optimize your existence!",
      epicsTitle: "Life Epics™",
      epicsDescription: "Large existential objectives divided into manageable sprints",
      storiesTitle: "User Stories",
      storiesDescription: "Specific tasks with detailed acceptance criteria",
      sprintsTitle: "Existential Sprints",
      sprintsDescription: "2-week periods to achieve life goals",
      previous: "← Previous",
      next: "Next →",
      goToDashboard: "Go to Dashboard →",
      step: "Step {{current}} of {{total}}"
    },
    // Header
    header: {
      home: "Home",
      dashboard: "Dashboard",
      sprints: "Sprints",
      retrospectives: "Retrospectives",
      logout: "Sign Out",
      logoutConfirm: "Are you sure you want to sign out? You'll lose all your existential progress."
    },
    // Common
    common: {
      close: "Close",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      confirm: "Confirm",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information"
    }
  }
};

// Exportar traducciones para uso directo si es necesario
export { translations };

// Inicializar automáticamente si estamos en el navegador
if (typeof window !== 'undefined') {
  initializeLocale();
}