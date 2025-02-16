'use client'

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function Test() {
  // Fetch categories and subcategories
  const categories = useQuery(api.form.getCategories);
  const allSubcategories = useQuery(api.admin.getAllSubcategories);

  // Calculate subcategory counts per category
  const subcategoryCounts = categories?.reduce((acc, category) => {
    const count = allSubcategories?.filter(sub => sub.category === category._id).length || 0;
    acc[category._id] = count;
    return acc;
  }, {} as Record<string, number>) || {};

  // Mapping of category names to their reference counts
  const referenceCountMap: Record<string, number> = {
    'Boîte de vitesses / embrayage / transmission': 74,
    'Carrosserie / pièces de carrosserie / crochet': 108,
    'Dispositifs / interrupteurs / système électronique': 324,
    'Essieu arrière': 48,
    'Essieu avant': 71,
    'Habitacle / intérieur': 289,
    'Moteur': 98,
    'Parties extérieures de la carrosserie arrière': 76,
    'Parties extérieures de la carrosserie avant': 72,
    'Phares / système de lavage / nettoyage des phares': 30,
    'Porte': 144,
    'Roues / pneus / capuchons': 134,
    'Système d\'échappement de gaz': 44,
    'Système d\'éclairage': 52,
    'Système de climatisation-chauffage / radiateurs': 75,
    'Système de freinage': 43,
    'Système de mélange de carburant': 97,
    'Vitres': 24
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Category Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Total Categories</h2>
            <p className="text-3xl font-bold text-[#0068D7]">{categories?.length || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Total Subcategories</h2>
            <p className="text-3xl font-bold text-[#F85A00]">{allSubcategories?.length || 0}</p>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Categories & Subcategories</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {categories?.map((category) => (
              <div key={category._id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                <span className="text-gray-800 font-medium">{category.name}</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {referenceCountMap[category.name] || 0} ref
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {subcategoryCounts[category._id]} current
                  </span>
                </div>
              </div>
            ))}
            
            {!categories && (
              <div className="px-4 py-3 text-gray-500 text-center">
                Loading categories...
              </div>
            )}
            
            {categories?.length === 0 && (
              <div className="px-4 py-3 text-gray-500 text-center">
                No categories found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test;