'use client'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Select from 'react-select';
import { Id } from "@/convex/_generated/dataModel";
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { translations } from '@/lib/translations';

interface FilterProps {
  isFilter: boolean;
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBrand: { value: Id<"brands">; label: string } | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<{ value: Id<"brands">; label: string } | null>>;
  selectedModel: { value: Id<"models">; label: string } | null;
  setSelectedModel: React.Dispatch<React.SetStateAction<{ value: Id<"models">; label: string } | null>>;
  selectedCategory: { value: Id<"categories">; label: string } | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<{ value: Id<"categories">; label: string } | null>>;
  selectedSubcategory: { value: Id<"subcategories">; label: string } | null;
  setSelectedSubcategory: React.Dispatch<React.SetStateAction<{ value: Id<"subcategories">; label: string } | null>>;
  selectedYear: { value: Id<"years">; label: string } | null;
  setSelectedYear: React.Dispatch<React.SetStateAction<{ value: Id<"years">; label: string } | null>>;
  selectedWilaya: { value: Id<"wilayas">; label: string } | null;
  setSelectedWilaya: React.Dispatch<React.SetStateAction<{ value: Id<"wilayas">; label: string } | null>>;
  resetFilters: () => void;
}

export default function Filter({ 
  isFilter, 
  setIsFilter,
  selectedBrand,
  setSelectedBrand,
  selectedModel,
  setSelectedModel,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedYear,
  setSelectedYear,
  selectedWilaya,
  setSelectedWilaya,
  resetFilters
}: FilterProps) {
  const brands = useQuery(api.form.getBrands);
  const models = useQuery(api.form.getModelsByBrand, selectedBrand ? { brandId: selectedBrand.value } : "skip");
  const categories = useQuery(api.form.getCategories);
  const subcategories = useQuery(api.form.getSubcategoriesByCategory, selectedCategory ? { categoryId: selectedCategory.value } : "skip");
  const years = useQuery(api.form.getYears);
  const wilayas = useQuery(api.form.getWilayas);

  const brandOptions = brands?.map(brand => ({ value: brand._id, label: brand.name })) || [];
  const modelOptions = models?.map(model => ({ value: model._id, label: model.name })) || [];
  const categoryOptions = categories?.map(cat => ({ value: cat._id, label: cat.name })) || [];
  const subcategoryOptions = subcategories?.map(sub => ({ value: sub._id, label: sub.name })) || [];
  const yearOptions = years?.map(year => ({ value: year._id, label: year.name })) || [];
  const wilayaOptions = wilayas?.map(wilaya => ({ value: wilaya._id, label: wilaya.name })) || [];

  return (
    <div className="w-[250px] border-2 border-orange-500/50 rounded-[2px] bg-white flex flex-col items-center justify-center gap-4 p-4 shadow-lg">
      <div className="text-[#F97316] font-bold flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-[14px] w-[14px] font-bold" />
        {translations.filter.labels.chooseFilter}
      </div>
      {(selectedBrand || selectedModel || selectedCategory || selectedSubcategory || selectedYear || selectedWilaya) && (
        <div className="w-full">
          <p className="text-sm font-bold mb-2 opacity-70">{translations.filter.labels.selectedFilters}</p>
          <div className="flex flex-wrap gap-2">
            {selectedBrand && <span className="px-2 py-1 bg-blue-200 rounded text-[10px]">{selectedBrand.label}</span>}
            {selectedModel && <span className="px-2 py-1 bg-blue-200 rounded text-[10px]">{selectedModel.label}</span>}
            {selectedCategory && <span className="px-2 py-1 bg-blue-200 rounded text-[10px]">{selectedCategory.label}</span>}
            {selectedSubcategory && <span className="px-2 py-1 bg-blue-200 rounded text-[10px]">{selectedSubcategory.label}</span>}
            {selectedYear && <span className="px-2 py-1 bg-blue-200 rounded text-[10px]">{selectedYear.label}</span>}
            {selectedWilaya && <span className="px-2 py-1 bg-blue-200 rounded text-[10px]">{selectedWilaya.label}</span>}
          </div>
        </div>
      )}
      {(selectedBrand || selectedModel || selectedCategory || selectedSubcategory || selectedYear || selectedWilaya) && (
        <hr className="w-[90%] mx-auto border-t border-gray-500 opacity-50 shadow-lg" />
      )}

      <Select
        className="w-full"
        options={brandOptions}
        value={selectedBrand}
        onChange={(v) => { setSelectedBrand(v); setIsFilter(true); }}
        placeholder={translations.filter.placeholders.selectBrand}
        classNames={{
          control: () => 'min-h-[39px] rounded-[2px] border-0 text-[13px] py-1',
          option: () => 'text-[13px] py-2 break-words',
          menu: () => 'text-[13px]',
          valueContainer: () => 'py-1'
        }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#F85A00' : baseStyles.borderColor,
            boxShadow: state.isFocused ? '0 0 0 1px #F85A00' : baseStyles.boxShadow,
            '&:hover': {
              borderColor: '#F85A00'
            }
          })
        }}
      />

      <Select
        className="w-full"
        options={modelOptions}
        value={selectedModel}
        onChange={(v) => { setSelectedModel(v); setIsFilter(true); }}
        isDisabled={!selectedBrand}
        placeholder={selectedBrand ? translations.filter.placeholders.selectModel : translations.filter.placeholders.selectModelFirst}
        classNames={{
          control: () => 'min-h-[39px] rounded-[2px] border-0 text-[13px] py-1',
          option: () => 'text-[13px] py-2 break-words',
          menu: () => 'text-[13px]',
          valueContainer: () => 'py-1'
        }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#F85A00' : baseStyles.borderColor,
            boxShadow: state.isFocused ? '0 0 0 1px #F85A00' : baseStyles.boxShadow,
            '&:hover': {
              borderColor: '#F85A00'
            }
          })
        }}
      />

      <Select
        className="w-full"
        options={categoryOptions}
        value={selectedCategory}
        onChange={(v) => { setSelectedCategory(v); setIsFilter(true); }}
        placeholder={translations.filter.placeholders.selectCategory}
        classNames={{
          control: () => 'min-h-[39px] rounded-[2px] border-0 text-[13px] py-1',
          option: () => 'text-[13px] py-2 break-words',
          menu: () => 'text-[13px]',
          valueContainer: () => 'py-1'
        }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#F85A00' : baseStyles.borderColor,
            boxShadow: state.isFocused ? '0 0 0 1px #F85A00' : baseStyles.boxShadow,
            '&:hover': {
              borderColor: '#F85A00'
            }
          })
        }}
      />

      <Select
        className="w-full"
        options={subcategoryOptions}
        value={selectedSubcategory}
        onChange={(v) => { setSelectedSubcategory(v); setIsFilter(true); }}
        isDisabled={!selectedCategory}
        placeholder={selectedCategory ? translations.filter.placeholders.selectSubcategory : translations.filter.placeholders.selectCategoryFirst}
        classNames={{
          control: () => 'min-h-[39px] rounded-[2px] border-0 text-[13px] py-1',
          option: () => 'text-[13px] py-2 break-words',
          menu: () => 'text-[13px]',
          valueContainer: () => 'py-1'
        }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#F85A00' : baseStyles.borderColor,
            boxShadow: state.isFocused ? '0 0 0 1px #F85A00' : baseStyles.boxShadow,
            '&:hover': {
              borderColor: '#F85A00'
            }
          })
        }}
      />

      <Select
        className="w-full"
        options={yearOptions}
        value={selectedYear}
        onChange={(v) => { setSelectedYear(v); setIsFilter(true); }}
        placeholder={translations.filter.placeholders.selectYear}
        classNames={{
          control: () => 'min-h-[39px] rounded-[2px] border-0 text-[13px] py-1',
          option: () => 'text-[13px] py-2 break-words',
          menu: () => 'text-[13px]',
          valueContainer: () => 'py-1'
        }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#F85A00' : baseStyles.borderColor,
            boxShadow: state.isFocused ? '0 0 0 1px #F85A00' : baseStyles.boxShadow,
            '&:hover': {
              borderColor: '#F85A00'
            }
          })
        }}
      />

      <Select
        className="w-full"
        options={wilayaOptions}
        value={selectedWilaya}
        onChange={(v) => { setSelectedWilaya(v); setIsFilter(true); }}
        placeholder={translations.filter.placeholders.selectWilaya}
        classNames={{
          control: () => 'min-h-[39px] rounded-[2px] border-0 text-[13px] py-1',
          option: () => 'text-[13px] py-2 break-words',
          menu: () => 'text-[13px]',
          valueContainer: () => 'py-1'
        }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#F85A00' : baseStyles.borderColor,
            boxShadow: state.isFocused ? '0 0 0 1px #F85A00' : baseStyles.boxShadow,
            '&:hover': {
              borderColor: '#F85A00'
            }
          })
        }}
      />

      <button 
        onClick={resetFilters} 
        className={`px-2 py-1 text-sm border rounded-sm flex items-center justify-center ${isFilter ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-500 opacity-70 cursor-not-allowed'}`} 
        disabled={!isFilter}
      >
        <RotateCcw className="mr-1 w-4 h-4" /> {translations.filter.labels.reset}
      </button>
    </div>
  );
}
