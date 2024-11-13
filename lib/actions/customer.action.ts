"use server";
import { db } from "@/lib/db";

export const getCustomerByEmail = async (email: string) => {
  try {
    const customer = await db.customer.findFirst({
      where: {
        email,
      },
    });

    return customer;
  } catch (error) {
    console.log("Error fetching customer:", error);
    return null;
  }
};

export const createCustomer = async ({
  email,
  name,
  phone,
}: {
  email: string;
  name: string;
  phone: string;
}) => {
  try {
    const customer = await db.customer.create({
      data: {
        email,
        name,
        phone,
      },
    });

    return customer;
  } catch (error) {
    console.log("Error creating customer:", error);
    return null;
  }
};
