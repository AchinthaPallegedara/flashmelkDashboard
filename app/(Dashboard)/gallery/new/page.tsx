"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SingleDropzone, MultiDropzone } from "@/components/Dropzone";
import { addNewGallery } from "@/lib/actions/gallery.action";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  category: z.enum([
    "FASHION",
    "COMMERCIAL",
    "EDITORIAL",
    "BEAUTY",
    "CORPORATE_PROFILES",
  ]),
  mainImage: z.any(),
  subImages: z.any(),
});

type FormData = z.infer<typeof formSchema>;

const Page = () => {
  const [mainImagePreview, setMainImagePreview] = useState<File | null>(null);
  const [subImagesPreview, setSubImagesPreview] = useState<File[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "FASHION",
      mainImage: null,
      subImages: [],
    },
  });

  const handleMainImageSelect = (file: File | null) => {
    form.setValue("mainImage", file);
    setMainImagePreview(file);
  };

  const handleSubImagesSelect = (files: File[]) => {
    form.setValue("subImages", files);
    setSubImagesPreview(files);
  };

  const uploadToR2 = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const clearForm = () => {
    form.reset();

    setMainImagePreview(null);
    setSubImagesPreview([]);
  };

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoaded(true);
      const mainImageUrl = values.mainImage
        ? await uploadToR2(values.mainImage)
        : null;
      const subImageUrls = await Promise.all(
        values.subImages.map((file: File) => uploadToR2(file))
      );

      console.log({
        name: values.name,
        category: values.category,
        mainImageUrl,
        subImageUrls,
      });
      addNewGallery({
        name: values.name,
        category: values.category,
        mainImageUrl: mainImageUrl || "",
        subImageUrls: subImageUrls,
      });
      clearForm();
      toast("Gallery has been created.", {
        description: "Gallery has been created successfully",
      });

      setIsLoaded(false);
    } catch (error) {
      console.log("Form submission failed:", error);
      toast("There is and Error", {
        description: "There is an error while creating the gallery",
      });
      setIsLoaded(false);
    }
  };

  return (
    <Card className="my-10 md:mx-20">
      <CardHeader>
        <CardTitle>Add New Gallery</CardTitle>
        <CardDescription>
          Fill in the form below to add a new gallery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-3 max-md:grid-cols-1 md:space-x-6">
              <div className="col-span-2">
                <div className="space-y-4 md:pr-10">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Gallery name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FASHION">Fashion</SelectItem>
                            <SelectItem value="COMMERCIAL">
                              Commercial
                            </SelectItem>
                            <SelectItem value="EDITORIAL">Editorial</SelectItem>
                            <SelectItem value="BEAUTY">Beauty</SelectItem>
                            <SelectItem value="CORPORATE_PROFILES">
                              Corporate Profiles
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid">
                <FormField
                  control={form.control}
                  name="mainImage"
                  render={() => (
                    <FormItem>
                      <FormLabel>Main Image</FormLabel>
                      <FormControl>
                        <SingleDropzone
                          onFileSelect={handleMainImageSelect}
                          value={mainImagePreview}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="subImages"
              render={() => (
                <FormItem>
                  <FormLabel>Sub Images</FormLabel>
                  <FormControl>
                    <MultiDropzone
                      onFileSelect={handleSubImagesSelect}
                      value={subImagesPreview}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoaded}>
              {isLoaded ? "Submitting..." : "Submit Gallery"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Page;
