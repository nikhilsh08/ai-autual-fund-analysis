export const dynamic = 'force-dynamic';

import { getActiveBundleForHomepage } from "@/server/actions/bundle.action";
import { getHomePageCoursesAction } from "@/server/actions/home-courses";
import { BundlePage, BundlePageProps } from "@/components/bundle/BundlePage";

export default async function BundlePageRoute() {
    const bundleResult = await getActiveBundleForHomepage();
    const bundle = bundleResult.success ? bundleResult.data : null;
    const courses = await getHomePageCoursesAction();

    return <BundlePage bundle={bundle as any} courses={courses} />;
}