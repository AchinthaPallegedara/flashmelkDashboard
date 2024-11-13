/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";

import {
  deleteGalleryById,
  getAllGalleries,
} from "@/lib/actions/gallery.action";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

import { useEffect, useState } from "react";
import { GalleryCategory } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// import { deleteGallery } from "@/app/api/upload/route";

const Page = () => {
  const router = useRouter();
  const [galleries, setGalleries] = useState<
    | ({ sub_images: { sub_image_url: string }[] } & {
        gallery_id: string;
        category: GalleryCategory;
        main_image_url: string;
        title: string;
        created_at: Date;
      })[]
    | null
  >([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (galleryId: string) => {
    if (!confirm("Are you sure you want to delete this gallery?")) return;

    try {
      setIsDeleting(true);
      await deleteGalleryById(galleryId);

      // Refresh the page or remove the item from state if using local state management
      toast.success("Gallery deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete gallery:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const galleryData = await getAllGalleries();
        setGalleries(galleryData || []);
      } catch (error) {
        console.error("Error fetching galleries:", error);
      }
    };

    fetchGalleries();
  }, []);
  if (!galleries)
    return (
      <div className="flex items-center w-full h-screen">
        No galleries added yet
      </div>
    );

  return (
    <div className="mx-2 md:mx-10">
      <div className="w-full  flex justify-end my-4">
        <Link href="/gallery/new">
          <Button>
            Add New <Plus />
          </Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 lg:grid-cols-4 mb-10">
        {galleries.map((item, index) => (
          <div key={index} className=" relative group mx-1 mt-2">
            <img
              src={item.main_image_url}
              alt={item.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end ">
              <h1 className="text-white text-sm text-center my-1 font-bold">
                {item.title}
              </h1>
              <div className="flex mb-10">
                <Button
                  variant="secondary"
                  size="sm"
                  className="mr-2"
                  onClick={() => {
                    window.location.href = `/gallery/${item.gallery_id}`;
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.gallery_id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
