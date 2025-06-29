import { useState, useEffect } from 'preact/hooks';
import { getLocale, setLocale } from '../i18n/index.js';

export default function LanguageSelector({ className = '' }) {
  const [currentLocale, setCurrentLocale] = useState('es');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentLocale(getLocale());
    
    // Escuchar cambios de idioma
    const handleLocaleChange = (event) => {
      setCurrentLocale(event.detail.locale);
    };
    
    window.addEventListener('localeChanged', handleLocaleChange);
    
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange);
    };
  }, []);

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLocale);

  const handleLanguageChange = (locale) => {
    setLocale(locale);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-white hover:text-gray-200 transition-colors rounded-lg hover:bg-white hover:bg-opacity-10"
        aria-label="Select language"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="hidden md:inline font-medium">{currentLanguage?.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border-color z-20 animate-slide-up">
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                    currentLocale === language.code ? 'bg-blue-50 text-primary font-medium' : 'text-text-primary'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                  {currentLocale === language.code && (
                    <svg className="w-4 h-4 ml-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            <div className="border-t border-border-color px-4 py-2">
              <p className="text-xs text-text-secondary">
                {currentLocale === 'es' ? 'Idioma detectado automáticamente' : 'Language auto-detected'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}