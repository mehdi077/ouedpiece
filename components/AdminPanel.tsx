'use client'
import { useState, useRef, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { processModelsCsv, processSubcategoriesCsv } from '@/app/actions/uploadCsv'
import { toast } from 'sonner'

function AdminPanel() {
    const [button, setButton] = useState("");
    const [brandInput, setBrandInput] = useState("");
    const [categoryInput, setCategoryInput] = useState("");
    const [subcategoryInput, setSubcategoryInput] = useState("");
    const [modelInput, setModelInput] = useState("");
    const [selectedBrandId, setSelectedBrandId] = useState<Id<"brands"> | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<Id<"categories"> | null>(null);
    const [brandSearchQuery, setBrandSearchQuery] = useState("");
    const [categorySearchQuery, setCategorySearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isCategorySearchFocused, setIsCategorySearchFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const categorySearchRef = useRef<HTMLDivElement>(null);
    const [modelToggle, setModelToggle] = useState(false);
    const [subcategoryToggle, setSubcategoryToggle] = useState(false);
    const modelFileRef = useRef<HTMLInputElement>(null)
    const subcategoryFileRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    
    // Admin APIs
    const addCategories = useMutation(api.admin.addCategories);
    const addSubcategories = useMutation(api.admin.addSubcategories);
    const addBrands = useMutation(api.admin.addBrands);
    const addModels = useMutation(api.admin.addModels);

    // Form APIs
    const brands = useQuery(api.form.getBrands);
    const categories = useQuery(api.form.getCategories);
    const models = useQuery(api.form.getModelsByBrand, selectedBrandId ? { brandId: selectedBrandId } : "skip");
    const subcategories = useQuery(api.form.getSubcategoriesByCategory, selectedCategoryId ? { categoryId: selectedCategoryId } : "skip");

    // Delete mutations
    const deleteBrand = useMutation(api.admin.deleteBrand);
    const deleteModel = useMutation(api.admin.deleteModel);
    const deleteCategory = useMutation(api.admin.deleteCategory);
    const deleteSubcategory = useMutation(api.admin.deleteSubcategory);

    // Filter brands based on search query
    const filteredBrands = brands?.filter(brand => 
        brand.name.toLowerCase().includes(brandSearchQuery.toLowerCase())
    ) || [];

    // Filter categories based on search query
    const filteredCategories = categories?.filter(category => 
        category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
    ) || [];

    // Handle click outside search dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle click outside category search dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categorySearchRef.current && !categorySearchRef.current.contains(event.target as Node)) {
                setIsCategorySearchFocused(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle brand selection
    const handleBrandSelect = (brand: { _id: Id<"brands">; name: string }) => {
        setSelectedBrandId(brand._id);
        setBrandSearchQuery(brand.name);
        setIsSearchFocused(false);
    };

    // Handle category selection for subcategories
    const handleCategorySelect = (category: { _id: Id<"categories">; name: string }) => {
        setSelectedCategoryId(category._id);
        setCategorySearchQuery(category.name);
        setIsCategorySearchFocused(false);
    };

    // Handle brand submission
    const handleAddBrands = async () => {
        if (!brandInput.trim()) return;
        
        // Split input by newlines and filter empty lines
        const brandNames = brandInput
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        
        if (brandNames.length === 0) return;

        try {
            // Format brands for API
            const brandsToAdd = brandNames.map(name => ({ name }));
            
            // Call the API
            const result = await addBrands({ brands: brandsToAdd });
            
            // Clear input on success
            setBrandInput('');
            
            // Optional: You could add success feedback here
            console.log('Brands added successfully:', result);
        } catch (error) {
            console.error('Error adding brands:', error);
            // Optional: You could add error feedback here
        }
    };

    // Handle category submission
    const handleAddCategories = async () => {
        if (!categoryInput.trim()) return;
        
        // Split input by newlines and filter empty lines
        const categoryNames = categoryInput
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        
        if (categoryNames.length === 0) return;

        try {
            // Format categories for API
            const categoriesToAdd = categoryNames.map(name => ({ name }));
            
            // Call the API
            const result = await addCategories({ categories: categoriesToAdd });
            
            // Clear input on success
            setCategoryInput('');
            
            // Optional: You could add success feedback here
            console.log('Categories added successfully:', result);
        } catch (error) {
            console.error('Error adding categories:', error);
            // Optional: You could add error feedback here
        }
    };

    // Handle model submission
    const handleAddModels = async () => {
        if (!modelInput.trim() || !selectedBrandId) return;
        
        // Split input by newlines and filter empty lines
        const modelNames = modelInput
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        
        if (modelNames.length === 0) return;

        try {
            // Format models for API
            const modelsToAdd = modelNames.map(name => ({ name }));
            
            // Call the API with properly typed brandId
            const result = await addModels({ 
                brandId: selectedBrandId,
                models: modelsToAdd 
            });
            
            // Clear input on success
            setModelInput('');
            
            console.log('Models added successfully:', result);
        } catch (error) {
            console.error('Error adding models:', error);
        }
    };

    // Handle subcategory submission
    const handleAddSubcategories = async () => {
        if (!subcategoryInput.trim() || !selectedCategoryId) return;
        
        // Split input by newlines and filter empty lines
        const subcategoryNames = subcategoryInput
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        
        if (subcategoryNames.length === 0) return;

        try {
            // Format subcategories for API
            const subcategoriesToAdd = subcategoryNames.map(name => ({ name }));
            
            // Call the API
            const result = await addSubcategories({ 
                categoryId: selectedCategoryId,
                subcategories: subcategoriesToAdd 
            });
            
            // Clear input on success
            setSubcategoryInput('');
            
            console.log('Subcategories added successfully:', result);
        } catch (error) {
            console.error('Error adding subcategories:', error);
        }
    };

    // Handle delete functions
    const handleDeleteBrand = async (brandId: Id<"brands">) => {
        try {
            await deleteBrand({ brandId });
            console.log('Brand deleted successfully');
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    const handleDeleteModel = async (modelId: Id<"models">) => {
        try {
            await deleteModel({ modelId });
            console.log('Model deleted successfully');
        } catch (error) {
            console.error('Error deleting model:', error);
        }
    };

    const handleDeleteCategory = async (categoryId: Id<"categories">) => {
        try {
            await deleteCategory({ categoryId });
            console.log('Category deleted successfully');
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleDeleteSubcategory = async (subcategoryId: Id<"subcategories">) => {
        try {
            await deleteSubcategory({ subcategoryId });
            console.log('Subcategory deleted successfully');
        } catch (error) {
            console.error('Error deleting subcategory:', error);
        }
    };

    // Handle CSV upload for models
    const handleModelCsvUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedBrandId || !modelFileRef.current?.files?.[0]) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', modelFileRef.current.files[0])
            
            const result = await processModelsCsv(formData)
            if (result.success) {
                toast.success('CSV processed successfully')
                if (modelFileRef.current) modelFileRef.current.value = ''
            } else {
                toast.error(result.error || 'Failed to process CSV')
            }
        } catch {
            toast.error('Error uploading CSV')
        } finally {
            setIsUploading(false)
        }
    }

    // Handle CSV upload for subcategories
    const handleSubcategoryCsvUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedCategoryId || !subcategoryFileRef.current?.files?.[0]) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', subcategoryFileRef.current.files[0])
            
            const result = await processSubcategoriesCsv(formData)
            if (result.success) {
                toast.success('CSV processed successfully')
                if (subcategoryFileRef.current) subcategoryFileRef.current.value = ''
            } else {
                toast.error(result.error || 'Failed to process CSV')
            }
        } catch {
            toast.error('Error uploading CSV')
        } finally {
            setIsUploading(false)
        }
    }

  return (
        <div className='h-fit max-w-[1145px] lg:max-w-[1145px] p-4 sm:p-8 my-4 sm:my-8 mx-2 sm:mx-0 bg-[#E5EAED] shadow-lg rounded-[2px]'>
            <div className="flex justify-center py-2 sm:py-4">
                <h1 className="text-[18px] sm:text-[20px] lg:text-[25px] font-bold text-[#132530] text-center">ADMIN MANAGEMENT PANEL</h1>
        </div>

            <div className="lg:max-w-[940px] rounded-[2px] p-2 sm:p-4 mt-4 sm:mt-8">
                <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 lg:gap-8">
                <button 
                    onClick={() => setButton("Add Brand")}
                        className={`px-2 sm:px-4 py-2 text-[13px] sm:text-[15px] text-white bg-[#F85A00] shadow-lg rounded-[2px] ${button === "Add Brand" ? "border-2 border-[#0068D7]" : ""}`}
                >
                    Add Brand
                </button>
                <button
                    onClick={() => setButton("Add Model")} 
                        className={`px-2 sm:px-4 py-2 text-[13px] sm:text-[15px] text-white bg-[#F85A00] shadow-lg rounded-[2px] ${button === "Add Model" ? "border-2 border-[#0068D7]" : ""}`}
                >
                    Add Model
                </button>
                <button
                    onClick={() => setButton("Add Category")}
                        className={`px-2 sm:px-4 py-2 text-[13px] sm:text-[15px] text-white bg-[#F85A00] shadow-lg rounded-[2px] ${button === "Add Category" ? "border-2 border-[#0068D7]" : ""}`}
                >
                    Add Category
                </button>
                <button
                    onClick={() => setButton("Add Sub-Category")}
                        className={`px-2 sm:px-4 py-2 text-[13px] sm:text-[15px] text-white bg-[#F85A00] shadow-lg rounded-[2px] ${button === "Add Sub-Category" ? "border-2 border-[#0068D7]" : ""}`}
                >
                    Add Sub-Category
                </button>
            </div>
        </div>

            <div className="rounded-[2px] p-2 sm:p-4 mt-2 sm:mt-4 w-full">
            {button === "Add Brand" && (
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                {/* 1 left */}
                    <div className="w-full sm:w-1/4 min-h-[100px] sm:min-h-[400px] rounded-[2px] flex flex-row sm:flex-col justify-between items-center sm:items-stretch bg-white/50 p-2">
                    <div className="p-2 flex justify-center ">
                        <span className="font-bold text-black">Brands :</span>
                    </div>

                    <div className=" p-2 flex justify-start">
                            <span className="text-black text-[10px]">total brands : {brands ? brands.length : '...'}</span>
                        </div>
                    </div>
                    {/* 2 right */}
                    <div className="w-full sm:w-3/4 min-h-[300px] sm:min-h-[400px] rounded-[2px] flex flex-col justify-between bg-white/50 p-2">
                        <div className="p-2">
                            {brands ? (
                                <div className="max-h-[200px] sm:max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                    {brands.map((brand) => (
                                        <div 
                                            key={brand._id} 
                                            className="p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                                        >
                                            <span className="text-sm text-gray-700">{brand.name}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDeleteBrand(brand._id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-[300px]">
                                    <span className="text-sm text-gray-500">Loading brands...</span>
                </div>
                            )}
                    </div>

                    <div className="flex h-[39px] w-full gap-2">
                        <textarea 
                                value={brandInput}
                                onChange={(e) => setBrandInput(e.target.value)}
                            className="w-4/5 px-2 py-1 border border-black/50 rounded-[2px] resize-none overflow-y-auto"
                                placeholder="Enter brand names (one per line)..."
                        />
                            <button 
                                onClick={handleAddBrands}
                                className="w-1/5 bg-[#0068D7] text-white flex items-center justify-center rounded-[2px] hover:bg-[#0056b3] transition-colors"
                            >
                            Add +
                        </button>
                    </div>
                </div>
            </div>
            )}
            {button === "Add Model" && (
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                        {/* 1 left */}
                        <div className="w-full sm:w-1/4 min-h-[100px] sm:min-h-[400px] rounded-[2px] flex flex-row sm:flex-col justify-between items-center sm:items-stretch bg-white/50 p-2">
                            <div className="p-2 flex justify-center">
                                <span className="font-bold text-black">Models :</span>
                            </div>

                            <div className="p-2 flex justify-start">
                                <span className="text-black text-[10px]">
                                    total models : {models ? models.length : selectedBrandId ? '...' : 'Select a brand'}
                                </span>
                            </div>
                        </div>

                        {/* 2 right */}
                        <div className="w-full sm:w-3/4 min-h-[300px] sm:min-h-[400px] rounded-[2px] flex flex-col justify-between bg-white/50 p-2">
                            {/* Brand Selection Dropdown */}
                            <div className="p-2 border-b border-gray-200">
                                <div className="relative w-full" ref={searchRef}>
                                    <input
                                        type="text"
                                        value={brandSearchQuery}
                                        onChange={(e) => setBrandSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        placeholder="Search brands..."
                                        className="w-full p-2 border border-gray-300 rounded-[2px] mb-1 text-sm sm:text-base"
                                    />
                                    {isSearchFocused && (
                                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-[2px] max-h-[200px] overflow-y-auto shadow-lg">
                                            {filteredBrands.map((brand) => (
                                                <div
                                                    key={brand._id}
                                                    onClick={() => handleBrandSelect(brand)}
                                                    className="p-2 hover:bg-gray-50 cursor-pointer"
                                                >
                                                    {brand.name}
                                                </div>
                                            ))}
                                            {filteredBrands.length === 0 && (
                                                <div className="p-2 text-gray-500 text-center">
                                                    No brands found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Models List */}
                            <div className="flex-1 p-2">
                                {selectedBrandId ? (
                                    models ? (
                                        <div className="max-h-[200px] sm:max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                            {models.map((model) => (
                                                <div 
                                                    key={model._id}
                                                    className="p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                                                >
                                                    <span className="text-sm text-gray-700">{model.name}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDeleteModel(model._id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-[200px]">
                                            <span className="text-sm text-gray-500">Loading models...</span>
                                        </div>
                                    )
                                ) : (
                                    <div className="flex items-center justify-center h-[200px]">
                                        <span className="text-sm text-gray-500">Select a brand to view models</span>
                                    </div>
                                )}
                            </div>

                            {/* Add Model Input */}
                            {selectedBrandId && (
                                <div className="flex flex-col sm:flex-row h-auto sm:h-[39px] w-full gap-2 items-center">
                                    {!modelToggle ? (
                                        <>
                                            <textarea 
                                                value={modelInput}
                                                onChange={(e) => setModelInput(e.target.value)}
                                                className="w-full sm:w-4/5 px-2 py-1 border border-black/50 rounded-[2px] resize-none overflow-y-auto min-h-[60px] sm:min-h-0"
                                                placeholder="(one per line)..."
                                                disabled={!selectedBrandId}
                                            />
                                            <button 
                                                onClick={handleAddModels}
                                                className={`w-full sm:w-1/5 h-full text-white flex items-center justify-center rounded-[2px] transition-colors ${
                                                    selectedBrandId 
                                                        ? 'bg-[#0068D7] hover:bg-[#0056b3]' 
                                                        : 'bg-gray-400 cursor-not-allowed'
                                                }`}
                                                disabled={!selectedBrandId}
                                            >
                                                Add +
                                            </button>
                                        </>
                                    ) : (
                                        <form onSubmit={handleModelCsvUpload} className="flex items-center gap-2 w-full">
                                            <input
                                                type="file"
                                                accept=".csv"
                                                ref={modelFileRef}
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        e.target.form?.requestSubmit()
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => modelFileRef.current?.click()}
                                                disabled={isUploading || !selectedBrandId}
                                                className="px-2 bg-[#0068D7] text-white flex items-center justify-center rounded-[2px] hover:bg-[#0056b3] transition-colors py-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                UPLOAD
                                            </button>
                                        </form>
                                    )}
                                    <Switch
                                        checked={modelToggle}
                                        onCheckedChange={setModelToggle}
                                        className="ml-0 sm:ml-2 mt-2 sm:mt-0"
                                    />
                                </div>
                            )}
                        </div>
                </div>
            )}
            {button === "Add Category" && (
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                    {/* 1 left */}
                    <div className="w-full sm:w-1/4 min-h-[100px] sm:min-h-[400px] rounded-[2px] flex flex-row sm:flex-col justify-between items-center sm:items-stretch bg-white/50 p-2">
                        <div className="p-2 flex justify-center">
                            <span className="font-bold text-black">Categories :</span>
                        </div>

                        <div className="p-2 flex justify-start">
                            <span className="text-black text-[10px]">total categories : {categories ? categories.length : '...'}</span>
                        </div>
                    </div>

                    {/* 2 right */}
                    <div className="w-full sm:w-3/4 min-h-[300px] sm:min-h-[400px] rounded-[2px] flex flex-col justify-between bg-white/50 p-2">
                        <div className="p-2">
                            {categories ? (
                                <div className="max-h-[200px] sm:max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                    {categories.map((category) => (
                                        <div 
                                            key={category._id} 
                                            className="p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                                        >
                                            <span className="text-sm text-gray-700">{category.name}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDeleteCategory(category._id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-[300px]">
                                    <span className="text-sm text-gray-500">Loading categories...</span>
                                </div>
                            )}
                        </div>

                        <div className="flex h-[39px] w-full gap-2">
                            <textarea 
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                className="w-4/5 px-2 py-1 border border-black/50 rounded-[2px] resize-none overflow-y-auto"
                                placeholder="Enter category names (one per line)..."
                            />
                            <button 
                                onClick={handleAddCategories}
                                className="w-1/5 bg-[#0068D7] text-white flex items-center justify-center rounded-[2px] hover:bg-[#0056b3] transition-colors"
                            >
                                Add +
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {button === "Add Sub-Category" && (
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                        {/* 1 left */}
                        <div className="w-full sm:w-1/4 min-h-[100px] sm:min-h-[400px] rounded-[2px] flex flex-row sm:flex-col justify-between items-center sm:items-stretch bg-white/50 p-2">
                            <div className="p-2 flex justify-center">
                                <span className="font-bold text-black">Sub-Categories :</span>
                            </div>

                            <div className="p-2 flex justify-start">
                                <span className="text-black text-[10px]">
                                    total subcategories : {subcategories ? subcategories.length : selectedCategoryId ? '...' : 'Select a category'}
                                </span>
                            </div>
                        </div>

                        {/* 2 right */}
                        <div className="w-full sm:w-3/4 min-h-[300px] sm:min-h-[400px] rounded-[2px] flex flex-col justify-between bg-white/50 p-2">
                            {/* Category Selection Dropdown */}
                            <div className="p-2 border-b border-gray-200">
                                <div className="relative w-full" ref={categorySearchRef}>
                                    <input
                                        type="text"
                                        value={categorySearchQuery}
                                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                                        onFocus={() => setIsCategorySearchFocused(true)}
                                        placeholder="Search categories..."
                                        className="w-full p-2 border border-gray-300 rounded-[2px] mb-1 text-sm sm:text-base"
                                    />
                                    {isCategorySearchFocused && (
                                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-[2px] max-h-[200px] overflow-y-auto shadow-lg">
                                            {filteredCategories.map((category) => (
                                                <div
                                                    key={category._id}
                                                    onClick={() => handleCategorySelect(category)}
                                                    className="p-2 hover:bg-gray-50 cursor-pointer"
                                                >
                                                    {category.name}
                                                </div>
                                            ))}
                                            {filteredCategories.length === 0 && (
                                                <div className="p-2 text-gray-500 text-center">
                                                    No categories found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Subcategories List */}
                            <div className="flex-1 p-2">
                                {selectedCategoryId ? (
                                    subcategories ? (
                                        <div className="max-h-[200px] sm:max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                            {subcategories.map((subcategory) => (
                                                <div 
                                                    key={subcategory._id}
                                                    className="p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                                                >
                                                    <span className="text-sm text-gray-700">{subcategory.name}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDeleteSubcategory(subcategory._id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-[200px]">
                                            <span className="text-sm text-gray-500">Loading subcategories...</span>
                                        </div>
                                    )
                                ) : (
                                    <div className="flex items-center justify-center h-[200px]">
                                        <span className="text-sm text-gray-500">Select a category to view subcategories</span>
                                    </div>
                                )}
                            </div>

                            {/* Add Subcategory Input */}
                            {selectedCategoryId && (
                                <div className="flex flex-col sm:flex-row h-auto sm:h-[39px] w-full gap-2 items-center">
                                    {!subcategoryToggle ? (
                                        <>
                                            <textarea 
                                                value={subcategoryInput}
                                                onChange={(e) => setSubcategoryInput(e.target.value)}
                                                className="w-full sm:w-4/5 px-2 py-1 border border-black/50 rounded-[2px] resize-none overflow-y-auto min-h-[60px] sm:min-h-0"
                                                placeholder="(one per line)..."
                                                disabled={!selectedCategoryId}
                                            />
                                            <button 
                                                onClick={handleAddSubcategories}
                                                className={`w-full sm:w-1/5 h-full text-white flex items-center justify-center rounded-[2px] transition-colors ${
                                                    selectedCategoryId 
                                                        ? 'bg-[#0068D7] hover:bg-[#0056b3]' 
                                                        : 'bg-gray-400 cursor-not-allowed'
                                                }`}
                                                disabled={!selectedCategoryId}
                                            >
                                                Add +
                                            </button>
                                        </>
                                    ) : (
                                        <form onSubmit={handleSubcategoryCsvUpload} className="flex items-center gap-2 w-full">
                                            <input
                                                type="file"
                                                accept=".csv"
                                                ref={subcategoryFileRef}
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        e.target.form?.requestSubmit()
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => subcategoryFileRef.current?.click()}
                                                disabled={isUploading || !selectedCategoryId}
                                                className="px-2 bg-[#0068D7] text-white flex items-center justify-center rounded-[2px] hover:bg-[#0056b3] transition-colors py-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                UPLOAD
                                            </button>
                                        </form>
                                    )}
                                    <Switch
                                        checked={subcategoryToggle}
                                        onCheckedChange={setSubcategoryToggle}
                                        className="ml-0 sm:ml-2 mt-2 sm:mt-0"
                                    />
                                </div>
                            )}
                        </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default AdminPanel