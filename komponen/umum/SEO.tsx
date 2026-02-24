import React, { useEffect } from 'react';
import { siteConfig } from '../../config/site';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, image, keywords }) => {
  const location = useLocation();
  const metaTitle = title || siteConfig.name;
  const metaDesc = description || siteConfig.description;
  const metaImage = image || siteConfig.ogImage;
  const metaKeywords = keywords || "loker purwakarta, lowongan kerja purwakarta, karirkita, loker pwk, kawasan industri bic";
  const canonicalUrl = `${siteConfig.url}${location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = metaTitle;

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper for Link tags (Canonical)
    const updateLink = (rel: string, href: string) => {
        let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
        if (!element) {
            element = document.createElement('link');
            element.setAttribute('rel', rel);
            document.head.appendChild(element);
        }
        element.setAttribute('href', href);
    }

    // 2. Standard Meta Tags
    updateMeta('description', metaDesc);
    updateMeta('keywords', metaKeywords);
    updateMeta('author', 'KarirKita Purwakarta');
    
    // 3. Local SEO Geo Tags (Purwakarta Specific)
    updateMeta('geo.region', 'ID-JB'); // West Java
    updateMeta('geo.placename', 'Purwakarta');
    updateMeta('geo.position', '-6.5561;107.4421'); // Coordinates for Purwakarta
    updateMeta('ICBM', '-6.5561, 107.4421');

    // 4. Open Graph (OG)
    updateMeta('og:title', metaTitle, 'property');
    updateMeta('og:description', metaDesc, 'property');
    updateMeta('og:image', metaImage, 'property');
    updateMeta('og:type', 'website', 'property');
    updateMeta('og:url', canonicalUrl, 'property');
    updateMeta('og:site_name', 'KarirKita', 'property');
    updateMeta('og:locale', 'id_ID', 'property');

    // 5. Twitter Card
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', metaTitle, 'name');
    updateMeta('twitter:description', metaDesc, 'name');
    updateMeta('twitter:image', metaImage, 'name');

    // 6. Canonical
    updateLink('canonical', canonicalUrl);

    // 7. JSON-LD Schema for Local Business/Organization & WebSite (Sitelinks)
    const schemaData = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "KarirKita",
        "url": siteConfig.url,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteConfig.url}/lowongan?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "KarirKita",
        "url": siteConfig.url,
        "logo": siteConfig.ogImage,
        "description": metaDesc,
        "sameAs": [
            "https://facebook.com/karirkita.purwakarta",
            "https://instagram.com/karirkita.my.id",
            "https://twitter.com/karirkita_pwk",
            "https://linkedin.com/company/karirkita"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Cari Lowongan",
            "description": "Temukan ribuan lowongan kerja terbaru",
            "url": `${siteConfig.url}/lowongan`
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "Buat CV Online",
            "description": "Buat CV ATS-friendly secara gratis",
            "url": `${siteConfig.url}/user/cv-builder`
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Kelas Karir",
            "description": "Ikuti kelas dan mentoring profesional",
            "url": `${siteConfig.url}/kelas`
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "Untuk Perusahaan",
            "description": "Pasang lowongan dan cari kandidat",
            "url": `${siteConfig.url}/perusahaan`
          }
        ]
      }
    ];

    let script = document.querySelector('#schema-json-ld');
    if (!script) {
        script = document.createElement('script');
        script.id = 'schema-json-ld';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemaData);

  }, [metaTitle, metaDesc, metaImage, metaKeywords, canonicalUrl]);

  return null;
};