import {
  BookImage,
  CalendarRange,
  CircleCheck,
  CircleDotDashed,
  CircleUser,
  ImagePlus,
  Images,
  Tent,
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
          title: "Holidays",
          icon: Tent,
          url: "/holidays",
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

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
];
