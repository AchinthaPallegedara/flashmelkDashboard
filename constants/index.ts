import {
  BookImage,
  CalendarPlus,
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
          url: "#",
          isActive: true,
        },
        {
          title: "Approved",
          icon: CircleCheck,
          url: "#",
        },
        {
          title: "Add New",
          icon: CalendarPlus,
          url: "#",
        },
        {
          title: "Customers",
          icon: CircleUser,
          url: "#",
        },
        {
          title: "Settings",
          icon: Settings,
          url: "#",
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
