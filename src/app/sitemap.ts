import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/seo';
import { dataBasePrisma } from '@/lib/dbPrisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch active courses/masterclasses
    const courses = await dataBasePrisma.course.findMany({
        where: { isPublished: true },
        select: { slug: true, staticRoute: true, createdAt: true },
    });

    const courseUrls: MetadataRoute.Sitemap = courses.map((course) => {
        // Determine the path based on whether it has a static route or dynamic slug
        const path = course.staticRoute
            ? `/${course.staticRoute}`
            : `/courses/${course.slug}`;

        return {
            url: `${siteConfig.url}${path}`,
            lastModified: course.createdAt,
            changeFrequency: 'weekly',
            priority: 0.8,
        };
    });

    // Fetch published blogs
    const blogs = await dataBasePrisma.blog.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
    });

    const blogUrls: MetadataRoute.Sitemap = blogs.map((blog) => ({
        url: `${siteConfig.url}/blogs/${blog.slug}`,
        lastModified: blog.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${siteConfig.url}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${siteConfig.url}/courses`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${siteConfig.url}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${siteConfig.url}/contact-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${siteConfig.url}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${siteConfig.url}/terms-conditions`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${siteConfig.url}/refund-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${siteConfig.url}/delivery-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    return [...staticRoutes, ...courseUrls, ...blogUrls];
}
