"use server";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
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

export const getAllCustomers = async () => {
  try {
    const customers = await db.customer.findMany();

    return customers;
  } catch (error) {
    console.log("Error fetching customers:", error);
    return null;
  }
};

export const updateCustomer = async (
  id: string,
  data: {
    name: string;
    phone: string;
  }
) => {
  try {
    const customer = await db.customer.update({
      where: {
        customer_id: id,
      },
      data,
    });

    return customer;
  } catch (error) {
    console.log("Error updating customer:", error);
    return null;
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    const customer = await db.customer.delete({
      where: {
        customer_id: id,
      },
    });

    return customer;
  } catch (error) {
    console.log("Error deleting customer:", error);
    return null;
  }
};
