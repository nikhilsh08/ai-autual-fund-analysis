export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { getBundleBySlug } from "@/server/actions/bundle.action";
import { BundlePage } from "@/components/bundle/BundlePage";


interface Props {
    params: {
        slug: string;
    };
}

export default async function BundleSlugPage({ params }: Props) {
    const { slug } = await params;
    const bundleResult = await getBundleBySlug(slug);

    if (!bundleResult.success) {
        notFound();
    }
    // The API returns { ...bundle, courses }
    const {  ...bundle } = bundleResult.data;
    const { courses } = bundleResult.data as { courses: any[] };
    
    return <BundlePage bundle={bundle as any} courses={courses} />;
}
