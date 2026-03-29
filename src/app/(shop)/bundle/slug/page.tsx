export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { getBundleBySlug } from "@/server/actions/bundle.action";
import { BundlePage } from "@/components/bundle/BundlePage";

interface Props{
    params: Promise<{
        slug: string;
    }>;
}

export default async function BundleSlugPage({ params }: Props) {
    const { slug } = await params;
    const bundleResult = await getBundleBySlug(slug);


    if (!bundleResult.success) {
        notFound();
    }
    
    return <BundlePage bundle={bundleResult.data.bundle }  courses={bundleResult.data.courses}/>;
}
