import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export const Settings = () => {
  const { language, setLanguage, availableLanguages, t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto px-3 sm:px-0"
    >
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">{t('settings.language')}</h3>
        <div className="flex gap-2">
          {availableLanguages.map((lang) => (
            <Button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              variant={language === lang.code ? "default" : "outline"}
              size="sm"
              className={`flex-1 font-medium ${
                language === lang.code 
                  ? "bg-gray-900 text-white hover:bg-gray-800" 
                  : "bg-white/60 backdrop-blur-sm border-gray-200/50 text-gray-700 hover:bg-white/80"
              }`}
            >
              {lang.name}
            </Button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-3 font-normal">
          Language changes will be applied immediately.
        </p>
      </div>

    </motion.div>
  );
};
