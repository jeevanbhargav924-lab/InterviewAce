import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.interviewaceai.online";

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
