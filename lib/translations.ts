// Type definition for supported languages
type LanguageCode = 'fr' | 'en' | 'ar';

// Current language selection - can be modified as needed
const currentLanguage: LanguageCode = 'fr';

// French translations
const frTranslations = {
  // Search related translations
  search: {
    placeholder: "Rechercher par modèle, pièce ...",
    button: "RECHERCHER",
    results: {
      count: (count: number) => `${count} recherche${count !== 1 ? 's' : ''}`,
      showing: "recherches pour:",
      noResults: {
        title: "Aucun résultat trouvé",
        description: "Essayez d'ajuster vos termes de recherche ou vérifiez l'orthographe. Vous pouvez rechercher par marque, modèle, catégorie, année ou lieu."
      },
      endOfFeed: "Vous avez vu toutes les publications disponibles"
    },
  },

  // Filter related translations
  filter: {
    button: "FILTRER",
    cancelFilter: "annuler le filtre",
    sections: {
      vehicle: "Information du Véhicule",
      part: "Information de la Pièce",
      contact: "Information de Contact"
    },
    fields: {
      brand: "Marque",
      model: "Modèle",
      year: "Année",
      category: "Catégorie",
      subcategory: "Sous-catégorie",
      phone: "Téléphone",
      location: "Lieu"
    },
    placeholders: {
      selectBrand: "Sélectionner une marque",
      selectModel: "Sélectionner un modèle",
      selectModelFirst: "Sélectionner une marque d'abord",
      selectCategory: "Sélectionner une catégorie",
      selectSubcategory: "Sélectionner une sous-catégorie",
      selectCategoryFirst: "Sélectionner une catégorie d'abord",
      selectYear: "Sélectionner une année",
      selectWilaya: "Sélectionner une wilaya"
    },
    labels: {
      chooseFilter: "Choisissez un filtre ici :",
      selectedFilters: "filtres sélectionnés :",
      reset: "Réinitialiser"
    }
  },

  // Post related translations
  post: {
    expiration: {
      notice: "Toutes les demandes disparaissent dans 24h",
      timeLeft: "La demande expire dans",
      expired: "Demande expirée"
    },
    create: {
      title: "Créer une demande de pièce",
      upload: "TÉLÉCHARGER",
      publish: "PUBLIER",
      publishing: "PUBLICATION EN COURS...",
      success: "Votre demande a été créée avec succès !",
      goToFeed: "Retourner au fil d'actualité",
      phoneValidation: "Entrez un numéro à 10 chiffres",
      contactInfo: "Fournissez vos informations de contact",
      processing: "Création de votre demande en cours...",
      imageUploadProgress: (current: number, total: number) => 
        `Image ${current} sur ${total} téléchargée avec succès`
    }
  },

  // Common actions
  actions: {
    cancel: "Annuler",
    confirm: "Confirmer",
    save: "Enregistrer",
    delete: "Supprimer",
    close: "Fermer",
    loading: "Chargement..."
  },

  // Image related translations
  image: {
    preview: "Aperçu",
    navigation: {
      next: "Image suivante",
      previous: "Image précédente"
    },
    alt: {
      preview: "Aperçu de l'image",
      postImage: (index: number) => `Image de l'annonce ${index + 1}`
    }
  },

  // Auth related translations
  auth: {
    signIn: "Se connecter",
    signOut: "Se déconnecter",
    userProfile: "Profil utilisateur"
  },

  // Footer translations
  footer: {
    quickLinks: {
      title: "Liens Rapides",
      about: "À Propos",
      contact: "Contact",
      createRequest: "Créer une Demande"
    },
    contact: {
      title: "Contactez-nous",
      email: "Email: contact@ouedpiece.com",
      phone: "Téléphone: +213 123 456 789",
      address: "Adresse: Algérie"
    },
    social: {
      title: "Suivez-nous",
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      developedBy: "Développé par:"
    },
    legal: {
      copyright: (year: number) => `© ${year} OuedPiece. Tous droits réservés.`,
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation"
    },
    description: "Connectez-vous avec la pièce automobile que vous recherchez"
  },

  // Metadata
  meta: {
    title: "OuedPiece",
    description: "Connectez-vous avec la pièce automobile que vous recherchez"
  }
}

// English translations
const enTranslations = {
  search: {
    placeholder: "Search by model, part ...",
    button: "SEARCH",
    results: {
      count: (count: number) => `${count} result${count !== 1 ? 's' : ''}`,
      showing: "searches for:",
      noResults: {
        title: "No results found",
        description: "Try adjusting your search terms or check spelling. You can search by brand, model, category, year or location."
      },
      endOfFeed: "You have seen all available posts"
    },
  },
  filter: {
    button: "FILTER",
    cancelFilter: "cancel filter",
    sections: {
      vehicle: "Vehicle Information",
      part: "Part Information",
      contact: "Contact Information"
    },
    fields: {
      brand: "Brand",
      model: "Model",
      year: "Year",
      category: "Category",
      subcategory: "Subcategory",
      phone: "Phone",
      location: "Location"
    },
    placeholders: {
      selectBrand: "Select a brand",
      selectModel: "Select a model",
      selectModelFirst: "Select a brand first",
      selectCategory: "Select a category",
      selectSubcategory: "Select a subcategory",
      selectCategoryFirst: "Select a category first",
      selectYear: "Select a year",
      selectWilaya: "Select a wilaya"
    },
    labels: {
      chooseFilter: "Choose a filter here:",
      selectedFilters: "selected filters:",
      reset: "Reset"
    }
  },
  post: {
    expiration: {
      notice: "All requests disappear in 24h",
      timeLeft: "Request expires in",
      expired: "Request expired"
    },
    create: {
      title: "Create a part request",
      upload: "UPLOAD",
      publish: "PUBLISH",
      publishing: "PUBLISHING...",
      success: "Your request has been created successfully!",
      goToFeed: "Return to feed",
      phoneValidation: "Enter a 10-digit number",
      contactInfo: "Provide your contact information",
      processing: "Creating your request...",
      imageUploadProgress: (current: number, total: number) => 
        `Image ${current} of ${total} uploaded successfully`
    }
  },
  actions: {
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    close: "Close",
    loading: "Loading..."
  },
  image: {
    preview: "Preview",
    navigation: {
      next: "Next image",
      previous: "Previous image"
    },
    alt: {
      preview: "Image preview",
      postImage: (index: number) => `Post image ${index + 1}`
    }
  },
  auth: {
    signIn: "Sign in",
    signOut: "Sign out",
    userProfile: "User profile"
  },
  footer: {
    quickLinks: {
      title: "Quick Links",
      about: "About",
      contact: "Contact",
      createRequest: "Create Request"
    },
    contact: {
      title: "Contact Us",
      email: "Email: contact@ouedpiece.com",
      phone: "Phone: +213 123 456 789",
      address: "Address: Algeria"
    },
    social: {
      title: "Follow Us",
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      developedBy: "Developed by:"
    },
    legal: {
      copyright: (year: number) => `© ${year} OuedPiece. All rights reserved.`,
      privacy: "Privacy Policy",
      terms: "Terms of Use"
    },
    description: "Connect with the car part you're looking for"
  },
  meta: {
    title: "OuedPiece",
    description: "Connect with the car part you're looking for"
  }
}

// Arabic translations
const arTranslations = {
  search: {
    placeholder: " ... البحث عن طريق الموديل، القطعة",
    button: "بحث",
    results: {
      count: (count: number) => `${count} ${count !== 1 ? 'نتائج' : 'نتيجة'}`,
      showing: ":البحث عن",
      noResults: {
        title: "لم يتم العثور على نتائج",
        description: "حاول تعديل مصطلحات البحث أو التحقق من الإملاء. يمكنك البحث حسب العلامة التجارية، الموديل، الفئة، السنة أو الموقع."
      },
      endOfFeed: "لقد شاهدت جميع المنشورات المتاحة"
    },
  },
  filter: {
    button: "تصفية",
    cancelFilter: "إلغاء التصفية",
    sections: {
      vehicle: "معلومات المركبة",
      part: "معلومات القطعة",
      contact: "معلومات الاتصال"
    },
    fields: {
      brand: "العلامة التجارية",
      model: "الموديل",
      year: "السنة",
      category: "الفئة",
      subcategory: "الفئة الفرعية",
      phone: "الهاتف",
      location: "الموقع"
    },
    placeholders: {
      selectBrand: "اختر علامة تجارية",
      selectModel: "اختر موديل",
      selectModelFirst: "اختر علامة تجارية أولاً",
      selectCategory: "اختر فئة",
      selectSubcategory: "اختر فئة فرعية",
      selectCategoryFirst: "اختر فئة أولاً",
      selectYear: "اختر سنة",
      selectWilaya: "اختر ولاية"
    },
    labels: {
      chooseFilter: "اختر تصفية هنا:",
      selectedFilters: "التصفيات المختارة:",
      reset: "إعادة تعيين"
    }
  },
  post: {
    expiration: {
      notice: "جميع الطلبات تختفي خلال 24 ساعة",
      timeLeft: "الطلب ينتهي في",
      expired: "انتهى الطلب"
    },
    create: {
      title: "إنشاء طلب قطعة",
      upload: "رفع",
      publish: "نشر",
      publishing: "جاري النشر...",
      success: "تم إنشاء طلبك بنجاح!",
      goToFeed: "العودة إلى الصفحة الرئيسية",
      phoneValidation: "أدخل رقم هاتف من 10 أرقام",
      contactInfo: "قدم معلومات الاتصال الخاصة بك",
      processing: "جاري إنشاء طلبك...",
      imageUploadProgress: (current: number, total: number) => 
        `تم رفع الصورة ${current} من ${total} بنجاح`
    }
  },
  actions: {
    cancel: "إلغاء",
    confirm: "تأكيد",
    save: "حفظ",
    delete: "حذف",
    close: "إغلاق",
    loading: "جاري التحميل..."
  },
  image: {
    preview: "معاينة",
    navigation: {
      next: "الصورة التالية",
      previous: "الصورة السابقة"
    },
    alt: {
      preview: "معاينة الصورة",
      postImage: (index: number) => `صورة الإعلان ${index + 1}`
    }
  },
  auth: {
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    userProfile: "الملف الشخصي"
  },
  footer: {
    quickLinks: {
      title: "روابط سريعة",
      about: "حول",
      contact: "اتصل بنا",
      createRequest: "إنشاء طلب"
    },
    contact: {
      title: "اتصل بنا",
      email: "البريد الإلكتروني: contact@ouedpiece.com",
      phone: "الهاتف: +213 123 456 789",
      address: "العنوان: الجزائر"
    },
    social: {
      title: "تابعنا",
      facebook: "فيسبوك",
      instagram: "انستغرام",
      twitter: "تويتر",
      developedBy: "طور بواسطة:"
    },
    legal: {
      copyright: (year: number) => `© ${year} واد بياس. جميع الحقوق محفوظة.`,
      privacy: "سياسة الخصوصية",
      terms: "شروط الاستخدام"
    },
    description: "تواصل مع قطعة السيارة التي تبحث عنها"
  },
  meta: {
    title: "واد بياس",
    description: "تواصل مع قطعة السيارة التي تبحث عنها"
  }
}

// Export translations based on current language
export const translations = {
  'fr': frTranslations,
  'en': enTranslations,
  'ar': arTranslations
}[currentLanguage]; 