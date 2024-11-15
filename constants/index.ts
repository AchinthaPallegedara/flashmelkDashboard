import {
  BookImage,
  CalendarRange,
  CircleCheck,
  CircleDotDashed,
  CircleUser,
  ImagePlus,
  Images,
  Settings,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Bookings",
      icon: CalendarRange,
      url: "#",
      items: [
        {
          title: "Pending to Approve",
          icon: CircleDotDashed,
          url: "/bookings/pending",
          isActive: true,
        },
        {
          title: "Approved",
          icon: CircleCheck,
          url: "/bookings/approved",
        },
        // {
        //   title: "Add New",
        //   icon: CalendarPlus,
        //   url: "/bookings/new",
        // },
        {
          title: "Customers",
          icon: CircleUser,
          url: "/customers",
        },
        {
          title: "Settings",
          icon: Settings,
          url: "/settings",
        },
      ],
    },

    {
      title: "Gallery",
      icon: BookImage,
      url: "#",
      items: [
        {
          title: "View All",
          icon: Images,
          url: "/gallery",
        },
        {
          title: "Add New",
          icon: ImagePlus,
          url: "/gallery/new",
        },
      ],
    },
  ],
};
