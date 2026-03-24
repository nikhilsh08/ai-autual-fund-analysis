"use server";

import { dataBasePrisma } from "@/lib/dbPrisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth/auth";

// ============ ADMIN ACTIONS ============

export async function createBundle(data: {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  courseIds: string[];
  features: string[];
  membershipDuration?: number;
}) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Auto-generate slug from name if not provided
    const slug = data.slug?.trim() ||
      data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check for existing bundle with same name or slug
    const existing = await dataBasePrisma.bundle.findFirst({
      where: {
        OR: [
          { name: { equals: data.name, mode: "insensitive" } },
          { slug: { equals: slug, mode: "insensitive" } },
        ],
      },
    });

    if (existing) {
      return { success: false, error: "Bundle with this name or slug already exists" };
    }

    // Validate courseIds exist and are available (not "Coming Soon")
    const courses = await dataBasePrisma.course.findMany({
      where: { id: { in: data.courseIds } },
    });

    if (courses.length !== data.courseIds.length) {
      return { success: false, error: "Some courses not found" };
    }

    // Check if any course is "Coming Soon"
    const comingSoonCourses = courses.filter(c => c.status !== "Available");
    if (comingSoonCourses.length > 0) {
      const titles = comingSoonCourses.map(c => c.title).join(", ");
      return { success: false, error: `Cannot add "Coming Soon" courses to bundle: ${titles}` };
    }

    // Calculate original price if not provided
    const calculatedOriginalPrice =
      data.originalPrice || courses.reduce((sum, c) => sum + c.price, 0);

    const bundle = await dataBasePrisma.bundle.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description || null,
        price: data.price,
        originalPrice: calculatedOriginalPrice,
        courseIds: data.courseIds,
        features: data.features,
        membershipDuration: data.membershipDuration || 365,
        isPublished: true,
        isActive: true,
      },
    });

    revalidatePath("/admin/bundles");
    return { success: true, data: bundle };
  } catch (error: any) {
    console.error("Create Bundle Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllBundles() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const bundles = await dataBasePrisma.bundle.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: bundles };
  } catch (error: any) {
    console.error("Get All Bundles Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getBundleById(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const bundle = await dataBasePrisma.bundle.findUnique({
      where: { id },
    });

    if (!bundle) {
      return { success: false, error: "Bundle not found" };
    }

    return { success: true, data: bundle };
  } catch (error: any) {
    console.error("Get Bundle By ID Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateBundle(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string | null;
    price?: number;
    originalPrice?: number | null;
    courseIds?: string[];
    features?: string[];
    membershipDuration?: number;
    isPublished?: boolean;
    isActive?: boolean;
  }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Build a safe update payload (ignore unknown/immutable fields from API body)
    const updateData: {
      name?: string;
      slug?: string;
      description?: string | null;
      price?: number;
      originalPrice?: number | null;
      courseIds?: string[];
      features?: string[];
      membershipDuration?: number;
      isPublished?: boolean;
      isActive?: boolean;
    } = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice;
    if (data.courseIds !== undefined) updateData.courseIds = data.courseIds;
    if (data.features !== undefined) updateData.features = data.features;
    if (data.membershipDuration !== undefined) updateData.membershipDuration = data.membershipDuration;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // If courseIds provided, validate they exist and are available
    if (updateData.courseIds) {
      const courses = await dataBasePrisma.course.findMany({
        where: { id: { in: updateData.courseIds } },
      });

      if (courses.length !== updateData.courseIds.length) {
        return { success: false, error: "Some courses not found" };
      }

      // Check if any course is "Coming Soon"
      const comingSoonCourses = courses.filter(c => c.status !== "Available");
      if (comingSoonCourses.length > 0) {
        const titles = comingSoonCourses.map(c => c.title).join(", ");
        return { success: false, error: `Cannot add "Coming Soon" courses to bundle: ${titles}` };
      }

      // Recalculate original price if not explicitly provided
      if (updateData.originalPrice === undefined) {
        updateData.originalPrice = courses.reduce((sum, c) => sum + c.price, 0);
      }
    }

    const bundle = await dataBasePrisma.bundle.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/bundles");
    return { success: true, data: bundle };
  } catch (error: any) {
    console.error("Update Bundle Error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteBundle(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Check if bundle has any orders
    const ordersWithBundle = await dataBasePrisma.bundleOrderItem.findFirst({
      where: { bundleId: id },
    });

    if (ordersWithBundle) {
      return {
        success: false,
        error: "Cannot delete bundle with existing orders. Deactivate it instead.",
      };
    }

    await dataBasePrisma.bundle.delete({
      where: { id },
    });

    revalidatePath("/admin/bundles");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Bundle Error:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleBundleStatus(id: string, isActive: boolean) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await dataBasePrisma.bundle.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/admin/bundles");
    return { success: true };
  } catch (error: any) {
    console.error("Toggle Bundle Status Error:", error);
    return { success: false, error: error.message };
  }
}

// ============ PUBLIC ACTIONS ============

export async function getPublishedBundles() {
  try {
    const bundles = await dataBasePrisma.bundle.findMany({
      where: { isPublished: true, isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: bundles };
  } catch (error: any) {
    console.error("Get Published Bundles Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getActiveBundleForHomepage() {
  try {
    // Get the primary active bundle for homepage display
    const bundle = await dataBasePrisma.bundle.findFirst({
      where: { isPublished: true, isActive: true },
      orderBy: { createdAt: "asc" }, // Get the first created bundle
    });

    if (!bundle) {
      return { success: false, error: "No active bundle found" };
    }

    // Get course count for this bundle
    const courses = await dataBasePrisma.course.findMany({
      where: { id: { in: bundle.courseIds }, isPublished: true },
      select: { id: true, title: true },
    });

    return {
      success: true,
      data: {
        id: bundle.id,
        name: bundle.name,
        slug: bundle.slug,
        description: bundle.description,
        price: bundle.price,
        originalPrice: bundle.originalPrice || 0,
        features: bundle.features,
        courseIds: bundle.courseIds,
        coursesIncluded: courses.length,
        savings: (bundle.originalPrice || 0) - bundle.price,
        savingsPercent: bundle.originalPrice
          ? Math.round(
              ((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100
            )
          : 0,
      },
    };
  } catch (error: any) {
    console.error("Get Active Bundle Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getBundleBySlug(slug: string) {
  try {
    const bundle = await dataBasePrisma.bundle.findUnique({
      where: { slug, isPublished: true, isActive: true },
    });

    if (!bundle) {
      return { success: false, error: "Bundle not found" };
    }

    return { success: true, data: bundle };
  } catch (error: any) {
    console.error("Get Bundle By Slug Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getBundleWithCourses(id: string) {
  try {
    const bundle = await dataBasePrisma.bundle.findUnique({
      where: { id },
    });

    if (!bundle) {
      return { success: false, error: "Bundle not found" };
    }

    const courses = await dataBasePrisma.course.findMany({
      where: { id: { in: bundle.courseIds } },
      select: {
        id: true,
        title: true,
        price: true,
        thumbnail: true,
        slug: true,
      },
    });

    return {
      success: true,
      data: {
        ...bundle,
        courses,
      },
    };
  } catch (error: any) {
    console.error("Get Bundle With Courses Error:", error);
    return { success: false, error: error.message };
  }
}
