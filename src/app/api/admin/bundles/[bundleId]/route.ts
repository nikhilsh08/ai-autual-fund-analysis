import {
  deleteBundle,
  getBundleById,
  updateBundle,
  toggleBundleStatus,
} from "@/server/actions/bundle.action";
import { auth } from "@/server/auth/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bundleId: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bundleId } = await params;
    const result = await getBundleById(bundleId);

    if (result.success) {
      return NextResponse.json(result.data);
    } else {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ bundleId: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bundleId } = await params;
    const body = await req.json();

    // Check if we are toggling status only
    if (Object.keys(body).length === 1 && typeof body.isActive === "boolean") {
      const result = await toggleBundleStatus(bundleId, body.isActive);
      if (result.success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    // Full update
    const result = await updateBundle(bundleId, body);
    if (result.success) {
      return NextResponse.json(result.data);
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ bundleId: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bundleId } = await params;
    const result = await deleteBundle(bundleId);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
