import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://interviewsaceai.online";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/dashboard/",
        "/api/",
        "/_next/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
