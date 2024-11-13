"use client";
import UpdateGallery from "@/components/updateGallery";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getGalleryById } from "@/lib/actions/gallery.action";

const Page = () => {
  const { id } = useParams<{ id: string }>();

  const [gallerydeatils, setGalleryDetails] = useState<{
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
  } | null>(null);

  useEffect(() => {
    const fetchGalleryDetails = async () => {
      try {
        const gallerydeatils = await getGalleryById(id);
        setGalleryDetails(gallerydeatils);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGalleryDetails();
  }, [id]);

  console.log(gallerydeatils);
  return (
    <div>
      <UpdateGallery details={gallerydeatils} />
    </div>
  );
};

export default Page;
