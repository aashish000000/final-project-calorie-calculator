"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { FiPlus, FiGlobe, FiCheck, FiX } from "react-icons/fi";

interface LanguageSelectorProps {
  variant?: "footer" | "settings" | "compact";
}

export function LanguageSelector({ variant = "footer" }: LanguageSelectorProps) {
  const { language, setLanguage, languages, t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    }
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  // Get top languages for quick selection (Facebook-style footer)
  const quickLanguages = languages.slice(0, 9);
  const currentLang = languages.find((l) => l.code === language);

  if (variant === "footer") {
    return (
      <>
        {/* Facebook-style language footer */}
        <div className="border-t border-gray-200 bg-white py-3 px-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            {/* Current language first - bold and dark */}
            <span className="font-semibold text-gray-800 leading-none">{currentLang?.nativeName}</span>
            
            {/* Quick language links - lighter grey, clickable */}
            {quickLanguages
              .filter((l) => l.code !== language)
              .slice(0, 8)
              .map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className="text-gray-600 hover:underline hover:text-blue-600 transition-colors font-normal leading-none"
                >
                  {lang.nativeName}
                </button>
              ))}
            
            {/* More languages button - light grey with dark plus */}
            <button
              onClick={() => setShowModal(true)}
              className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded border border-gray-300 transition-colors flex-shrink-0"
              title="More languages"
            >
              <FiPlus className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Language selection modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div
              ref={modalRef}
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Choose your language</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Language list */}
              <div className="overflow-y-auto max-h-96 p-2">
                <div className="grid grid-cols-2 gap-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowModal(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        language === lang.code
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{lang.nativeName}</p>
                        <p className="text-sm text-gray-500">{lang.name}</p>
                      </div>
                      {language === lang.code && (
                        <FiCheck className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (variant === "settings") {
    return (
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <FiGlobe className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">{t('settings.language')}</p>
            <p className="text-sm text-gray-500">{currentLang?.nativeName}</p>
          </div>
        </div>
        <span className="text-gray-400">›</span>

        {/* Language selection modal */}
        {showModal && (
          <div 
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={modalRef}
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Choose your language</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Language list */}
              <div className="overflow-y-auto max-h-96 p-2">
                <div className="grid grid-cols-2 gap-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowModal(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        language === lang.code
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{lang.nativeName}</p>
                        <p className="text-sm text-gray-500">{lang.name}</p>
                      </div>
                      {language === lang.code && (
                        <FiCheck className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </button>
    );
  }

  // Compact variant (for navbar or small spaces)
  return (
    <button
      onClick={() => setShowModal(true)}
      className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
    >
      <FiGlobe className="w-4 h-4" />
      <span>{currentLang?.code.toUpperCase()}</span>
    </button>
  );
}

