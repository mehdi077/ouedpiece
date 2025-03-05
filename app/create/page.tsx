'use client'

import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import Spinner from "@/components/Spinner";
import Select from 'react-select';
import { Id } from "@/convex/_generated/dataModel";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { translations } from '@/lib/translations';

function Create() {
  const [selectedBrand, setSelectedBrand] = useState<{ value: Id<"brands">; label: string; } | null>(null);
  const [selectedModel, setSelectedModel] = useState<{ value: Id<"models">; label: string; } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ value: Id<"categories">; label: string; } | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{ value: Id<"subcategories">; label: string; } | null>(null);
  const [selectedYear, setSelectedYear] = useState<{ value: Id<"years">; label: string; } | null>(null);
  const [selectedWilaya, setSelectedWilaya] = useState<{ value: Id<"wilayas">; label: string; } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { toast } = useToast();

  const brands = useQuery(api.form.getBrands)
  const models = useQuery(api.form.getModelsByBrand, 
    selectedBrand ? { brandId: selectedBrand.value } : "skip"
  );
  const categories = useQuery(api.form.getCategories);
  const subcategories = useQuery(api.form.getSubcategoriesByCategory,
    selectedCategory ? { categoryId: selectedCategory.value } : "skip"
  );
  const years = useQuery(api.form.getYears);
  const wilayas = useQuery(api.form.getWilayas);

  // Convex mutations
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);
  const addPostImages = useMutation(api.posts.addPostImages);

  if (!brands || !categories || !years || !wilayas) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isPhoneValid) {
    console.log("phone is valid")
  }
  
  const brandOptions = brands.map(brand => ({
    value: brand._id,
    label: brand.name
  }));

  const modelOptions = models?.map(model => ({
    value: model._id,
    label: model.name
  })) || [];

  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name
  }));

  const subcategoryOptions = subcategories?.map(subcategory => ({
    value: subcategory._id,
    label: subcategory.name
  })) || [];

  const yearOptions = years.map(year => ({
    value: year._id,
    label: year.name
  }));

  const wilayaOptions = wilayas.map(wilaya => ({
    value: wilaya._id,
    label: wilaya.name
  }));

  const isFormValid = () => {
    return (
      selectedBrand !== null &&
      selectedModel !== null &&
      selectedYear !== null &&
      selectedCategory !== null &&
      selectedSubcategory !== null &&
      selectedWilaya !== null &&
      phoneNumber.length === 10 &&
      selectedImages.length > 0
    );
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); 
    if (value.length <= 10) {
      setPhoneNumber(value);
      setIsPhoneValid(value.length === 10 || value.length === 0);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    setSelectedImages(prev => [...prev, ...imageFiles]);
    
    // Create preview URLs for the new images
    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]); // Clean up the URL
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!isFormValid() || isPublishing) return;
    
    try {
      setIsPublishing(true);
      toast({
        title: "Publishing your request",
        description: "Please wait while we process your images and create your request...",
      });

      // Upload each image individually with its own upload URL
      const imageStorageIds = [];
      for (const file of selectedImages) {
        try {
          // Generate a unique upload URL for this specific image
          const uploadUrl = await generateUploadUrl();
          
          // Upload the file to the generated URL
          const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text().catch(() => 'Unknown error');
            throw new Error(`Failed to upload image (${uploadResponse.status}): ${errorText}`);
          }

          // Parse the response to get the storage ID
          const responseData = await uploadResponse.json();
          const storageId = responseData.storageId;
          
          if (!storageId) {
            throw new Error('No storage ID received from server');
          }

          imageStorageIds.push(storageId);

          // Show progress toast for each successful upload
          toast({
            title: "Image Upload Progress",
            description: `Successfully uploaded image ${imageStorageIds.length} of ${selectedImages.length}`,
          });

        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            title: "Upload Error",
            description: `Failed to upload image ${imageStorageIds.length + 1} of ${selectedImages.length}. ${error instanceof Error ? error.message : 'Please try again.'}`,
            variant: "destructive",
          });
          throw error; // Re-throw to stop the process
        }
      }

      // Create the post once all images are uploaded
      const postId = await createPost({
        brand: selectedBrand!.value,
        model: selectedModel!.value,
        year: selectedYear!.value,
        category: selectedCategory!.value,
        subcategory: selectedSubcategory!.value,
        phone: parseInt(phoneNumber),
        wilaya: selectedWilaya!.value,
      });

      // Add all successfully uploaded images to the post
      await addPostImages({
        postId,
        images: imageStorageIds,
      });

      toast({
        title: "Success!",
        description: "Your part request has been created successfully.",
        className: "bg-green-50 border-green-200",
      });

      // Show success state
      setIsSuccess(true);
      
    } catch (error) {
      console.error("Error publishing post:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error creating your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (isPublishing) {
    return (
      <div className="bg-black/50 fixed inset-0 overflow-y-auto">
        <div className="min-h-[100vh] w-full flex items-center justify-center p-4">
          <div className="bg-white rounded-[2px] flex flex-col p-4 gap-4 w-full max-w-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
              <Spinner />
              <p className="text-gray-600">Creating your part request...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-black/50 fixed inset-0 overflow-y-auto">
        <div className="min-h-[100vh] w-full flex items-center justify-center p-4">
          <div className="bg-white rounded-[2px] flex flex-col p-4 gap-8 w-full max-w-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-6">
              <CheckCircle2 className="w-24 h-24 text-green-500" />
              <h2 className="text-2xl font-semibold text-gray-800">Your part request has been created successfully!</h2>
              <Link href="/">
                <button className="h-[39px] bg-[#F85A00] hover:bg-[#d94e00] rounded-[2px] text-white flex items-center justify-center gap-2 px-8 transition-colors">
                  <span className="text-[14px]">Go to feed</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="bg-black/50 fixed inset-0 overflow-y-auto">
    <div className="min-h-[100vh] w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-[2px] flex flex-col p-4 gap-4 w-full max-w-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)]">
        <div className="w-full h-auto flex justify-end items-center sticky top-0 z-10 bg-white">
          <Button variant="destructive" size="sm" className="h-9 w-9 px-2 shadow-md" asChild>
            <Link href="/">
              <span className="text-xl">×</span>
            </Link>
          </Button>
        </div>

        <div className="w-full flex justify-center items-center py-2 text-black">
          {translations.post.create.title}
        </div>

        <div className="w-full p-2 md:p-8 lg:p-8 flex flex-col gap-2">
          
          <div className="w-full py-2 px-4 flex flex-row gap-2">
            <div className="w-[100px] min-h-[39px] flex items-center">
              <span className="font-bold text-[12px] text-[#041A24]">{translations.filter.fields.brand} :</span>
            </div>
            <div className="w-[300px] min-h-[39px]">
              <Select
                value={selectedBrand}
                onChange={(option) => {
                  setSelectedBrand(option);
                  setSelectedModel(null);
                }}
                options={brandOptions}
                className="min-h-full"
                classNames={{
                  control: () => 'min-h-[39px] rounded-[2px] border-0 text-[13px] py-1',
                  option: () => 'text-[13px] py-2 break-words',
                  menu: () => 'text-[13px]',
                  valueContainer: () => 'py-1'
                }}
                placeholder={translations.filter.placeholders.selectBrand}
              />
            </div>
          </div>

          <div className="w-full py-2 px-4 flex flex-row gap-2">
            <div className="w-[100px] min-h-[39px] flex items-center">
              <span className="font-bold text-[12px] text-[#041A24]">{translations.filter.fields.model} :</span>
            </div>
            <div className="w-[300px] min-h-[39px]">
              <Select
                value={selectedModel}
                onChange={(option) => setSelectedModel(option)}
                options={modelOptions}
                isDisabled={!selectedBrand}
                className="min-h-full"
                classNames={{
                  control: () => 'min-h-[39px] rounded-[2px] border-0 text-[13px] py-1',
                  option: () => 'text-[13px] py-2 break-words',
                  menu: () => 'text-[13px]',
                  valueContainer: () => 'py-1'
                }}
                placeholder={
                  selectedBrand && !models ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#0068D7] border-t-transparent rounded-full animate-spin"></div>
                      <span>{translations.actions.loading}</span>
                    </div>
                  ) : selectedBrand ? translations.filter.placeholders.selectModel : translations.filter.placeholders.selectModelFirst
                }
              />
            </div>
          </div>

          <div className="w-full py-2 px-4 flex flex-row gap-2">
            <div className="w-[100px] min-h-[39px] flex items-center">
              <span className="font-bold text-[12px] text-[#041A24]">{translations.filter.fields.year} :</span>
            </div>
            <div className="w-[300px] min-h-[39px]">
              <Select
                value={selectedYear}
                onChange={(option) => setSelectedYear(option)}
                options={yearOptions}
                className="min-h-full"
                classNames={{
                  control: () => 'min-h-[39px] rounded-[2px] border-0 text-[13px] py-1',
                  option: () => 'text-[13px] py-2 break-words',
                  menu: () => 'text-[13px]',
                  valueContainer: () => 'py-1'
                }}
                placeholder={translations.filter.placeholders.selectYear}
              />
            </div>
          </div>

          <div className="w-full py-2 px-4 flex flex-row gap-2">
            <div className="w-[100px] min-h-[39px] flex items-center">
              <span className="font-bold text-[12px] text-[#041A24]">{translations.filter.fields.category} :</span>
            </div>
            <div className="w-[300px] min-h-[39px]">
              <Select
                value={selectedCategory}
                onChange={(option) => {
                  setSelectedCategory(option);
                  setSelectedSubcategory(null);
                }}
                options={categoryOptions}
                className="min-h-full"
                classNames={{
                  control: () => 'min-h-[39px] rounded-[2px] border-0 text-[13px] py-1',
                  option: () => 'text-[13px] py-2 break-words',
                  menu: () => 'text-[13px]',
                  valueContainer: () => 'py-1'
                }}
                placeholder={translations.filter.placeholders.selectCategory}
              />
            </div>
          </div>

          <div className="w-full py-2 px-4 flex flex-row gap-2">
            <div className="w-[100px] min-h-[39px] flex items-center">
              <span className="font-bold text-[12px] text-[#041A24]">{translations.filter.fields.subcategory} :</span>
            </div>
            <div className="w-[300px] min-h-[39px]">
              <Select
                value={selectedSubcategory}
                onChange={(option) => setSelectedSubcategory(option)}
                options={subcategoryOptions}
                isDisabled={!selectedCategory}
                className="min-h-full"
                classNames={{
                  control: () => 'min-h-[39px] rounded-[2px] border-0 text-[13px] py-1',
                  option: () => 'text-[13px] py-2 break-words',
                  menu: () => 'text-[13px]',
                  valueContainer: () => 'py-1'
                }}
                placeholder={
                  selectedCategory && !subcategories ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#0068D7] border-t-transparent rounded-full animate-spin"></div>
                      <span>{translations.actions.loading}</span>
                    </div>
                  ) : selectedCategory ? translations.filter.placeholders.selectSubcategory : translations.filter.placeholders.selectCategoryFirst
                }
              />
            </div>
          </div>

          <div className="w-full px-4 flex flex-row gap-2">
            <div className="w-[100px] min-h-[39px] flex items-center">
              <span className="font-bold text-[12px] text-[#041A24]">{translations.filter.fields.location} :</span>
            </div>
            <div className="w-[300px] min-h-[39px]">
              <Select
              value={selectedWilaya}
              onChange={(option) => setSelectedWilaya(option)}
              options={wilayaOptions}
                className="min-h-full"
                classNames={{
                  control: () => 'min-h-[39px] rounded-[2px] border-0 text-[13px] py-1',
                  option: () => 'text-[13px] py-2 break-words',
                  menu: () => 'text-[13px]',
                  valueContainer: () => 'py-1'
                }}
                placeholder={translations.filter.placeholders.selectWilaya}
              />
            </div>
          </div>

          <div className="w-full px-4 flex flex-row gap-2">
            <div className="w-[100px] min-h-[39px] flex items-center">
              <span className="font-bold text-[12px] text-[#041A24]">Phone :</span>
            </div>
            <div className="w-[300px] min-h-[39px]">
              <input
                type="text"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                className="w-full min-h-[39px] rounded-[2px] border-0 text-[13px] py-1 px-2 outline-none focus:ring-1 focus:ring-[#0068D7]"
              />
            </div>
          </div>
        </div>

        {true && (
          <div className="w-full p-2 flex justify-start">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="h-[39px] bg-[#0068D7] rounded-[2px] text-white flex items-center justify-center gap-2 px-4 shadow-lg cursor-pointer"
            >
              <span className="text-[14px]">{translations.post.create.upload}</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </label>
          </div>
        )}

        {previewUrls.length > 0 && (
          <div className="w-full p-2">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={url}
                    alt={translations.image.alt.postImage(index)}
                    width={150}
                    height={150}
                    className="object-cover w-full h-[150px] rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full p-2 flex items-center justify-center">
          <button 
            disabled={!isFormValid() || isPublishing}
            onClick={handlePublish}
            className={`h-[39px] rounded-[2px] text-white flex items-center justify-center gap-2 px-4 transition-colors
              ${isFormValid() && !isPublishing
                ? 'bg-[#F85A00] hover:bg-[#d94e00] cursor-pointer' 
                : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            {isPublishing ? (
              <>
                <span className="text-[14px]">{translations.post.create.publishing}</span>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : (
              <>
                <span className="text-[14px]">{translations.post.create.publish}</span>
                <Image 
                  src="/icons/loud_speaker_icon.png"
                  alt="Loud Speaker"
                  width={24}
                  height={24}
                  className={`object-contain h-[24px] w-auto ${!isFormValid() ? 'opacity-50' : ''}`}
                />
              </>
            )}
          </button>
        </div>
        
        {/* Mobile-only vertical spacer */}
        <div className="h-[500px] md:hidden" />
      </div>
    </div>
  </div>
  )
}

export default Create