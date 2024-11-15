"use server";

import { deleteGallery } from "@/lib/s3";
import { db } from "@/lib/db";

export const addNewGallery = async (galleryData: {
  name: string;
  category:
    | "FASHION"
    | "COMMERCIAL"
    | "EDITORIAL"
    | "BEAUTY"
    | "CORPORATE_PROFILES";
  mainImageUrl: string;
  subImageUrls: string[];
}) => {
  try {
    const newGallery = await db.gallery.create({
      data: {
        title: galleryData.name,
        category: galleryData.category,
        main_image_url: galleryData.mainImageUrl,
        sub_images: {
          create: [
            {
              sub_image_url: galleryData.mainImageUrl, // Add the main image as the first sub-image
            },
            ...galleryData.subImageUrls.map((url) => ({
              sub_image_url: url,
            })),
          ],
        },
      },
      include: {
        sub_images: true,
      },
    });

    return newGallery; // Return the created gallery object
  } catch (error) {
    console.log("Error creating gallery:", error);
    return null;
  }
};

export const getAllGalleries = async () => {
  try {
    const galleries = await db.gallery.findMany({
      include: {
        sub_images: {
          select: {
            sub_image_url: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return galleries;
  } catch (error) {
    console.log("Error fetching galleries:", error);
    return null;
  }
};

export const getGalleriesbyCategory = async (
  category:
    | "FASHION"
    | "COMMERCIAL"
    | "EDITORIAL"
    | "BEAUTY"
    | "CORPORATE_PROFILES"
) => {
  try {
    const galleries = await db.gallery.findMany({
      where: {
        category,
      },
      include: {
        sub_images: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return galleries;
  } catch (error) {
    console.log("Error fetching galleries:", error);
    return null;
  }
};

export const getSubImagesUrlByGalleryId = async (galleryId: string) => {
  try {
    const subImages = await db.gallery_SubImage.findMany({
      where: {
        gallery_id: galleryId,
      },
      select: {
        sub_image_url: true,
      },
    });

    return subImages.map((subImage) => subImage.sub_image_url);
  } catch (error) {
    console.log("Error fetching subimages:", error);
    return null;
  }
};

export const getGalleryById = async (galleryId: string) => {
  try {
    const gallery = await db.gallery.findUnique({
      where: {
        gallery_id: galleryId,
      },
      include: {
        sub_images: true,
      },
    });

    return gallery;
  } catch (error) {
    console.log("Error fetching gallery:", error);
    return null;
  }
};
export const updateGallery = async (galleryData: {
  gallery_id: string;
  name: string;
  category:
    | "FASHION"
    | "COMMERCIAL"
    | "EDITORIAL"
    | "BEAUTY"
    | "CORPORATE_PROFILES";
}) => {
  try {
    const updatedGallery = await db.gallery.update({
      where: {
        gallery_id: galleryData.gallery_id,
      },
      data: {
        title: galleryData.name,
        category: galleryData.category,
      },
    });

    return updatedGallery;
  } catch (error) {
    console.log("Error updating gallery:", error);
    return null;
  }
};

export const deleteGalleryById = async (galleryId: string) => {
  console.log("Deleting gallery with ID:", galleryId);
  try {
    const subImages = await getSubImagesUrlByGalleryId(galleryId);
    console.log("Sub images:", subImages);

    const gallery = await db.gallery.delete({
      where: {
        gallery_id: galleryId,
      },
    });
    console.log("Deleted gallery:", gallery);

    const mainImageUrl = gallery.main_image_url;
    const mainFileName = mainImageUrl?.split("/").pop();
    console.log("Main file name:", mainFileName);

    const subFileNames = (subImages || []).map((url: string) =>
      url.split("/").pop()
    );
    console.log("Sub file names:", subFileNames);

    const fileNames = [mainFileName, ...subFileNames].filter(Boolean);
    console.log("All file names to delete:", fileNames);

    for (const fileName of fileNames) {
      if (fileName) {
        await deleteGallery(fileName);
        console.log("Deleted file:", fileName);
      }
    }

    return gallery;
  } catch (error) {
    console.log("Error deleting gallery:", error);
    return { error: "Failed to delete gallery" };
  }
};
