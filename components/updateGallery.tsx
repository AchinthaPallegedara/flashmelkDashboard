/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
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

import { toast } from "sonner";
import { updateGallery } from "@/lib/actions/gallery.action";

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

interface Props {
  details: {
    gallery_id: string;
    category:
      | "FASHION"
      | "COMMERCIAL"
      | "EDITORIAL"
      | "BEAUTY"
      | "CORPORATE_PROFILES";
    main_image_url: string;
    title: string;
    created_at: Date;
    sub_images: { sub_image_url: string }[];
  } | null;
}

const UpdateGallery = ({ details }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: details?.title || "Default Name",
      category: details?.category || "FASHION",
      mainImage: null,
      subImages: [],
    },
  });

  useEffect(() => {
    // Set default values once `details` is available
    form.reset({
      name: details?.title || "Default Name",
      category: details?.category || "FASHION",
      mainImage: details?.main_image_url || null,
      subImages: details?.sub_images || [],
    });
  }, [details, form]);

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoaded(true);
      const { name, category } = values;
      if (!details?.gallery_id) {
        throw new Error("Gallery ID is required");
      }
      updateGallery({
        gallery_id: details.gallery_id,
        name,
        category,
      });

      toast("Gallery has been updated.", {
        description: "Gallery has been updated successfully",
      });

      setIsLoaded(false);
    } catch (error) {
      console.log("Form submission failed:", error);
      toast("There is an Error", {
        description: "There is an error while updating the gallery",
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
                {details?.main_image_url && details?.title && (
                  <>
                    <p className="text-lg font-medium">Main Image</p>
                    <img
                      src={details.main_image_url}
                      alt={details.title}
                      className="object-cover w-60 h-80"
                    />
                  </>
                )}
              </div>
            </div>

            <div>
              <p className="text-lg font-medium">Sub Images </p>
              <div className="grid grid-cols-4">
                {details?.sub_images &&
                  details?.title &&
                  details.sub_images.map(
                    (subImage: { sub_image_url: string }, index: number) => (
                      <div key={index} className="grid mx-1 mt-2">
                        <img
                          src={subImage.sub_image_url}
                          alt={details.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )
                  )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoaded}>
              {isLoaded ? "Submitting..." : "Submit Gallery"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdateGallery;
