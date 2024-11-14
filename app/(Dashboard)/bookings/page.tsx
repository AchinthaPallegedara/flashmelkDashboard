import { redirect } from "next/navigation";

const page = () => {
  redirect("/bookings/approved");
};

export default page;
