import { useEffect } from 'react';

export default function useSEO({ 
  title, 
  description = 'Discover delicious recipes with our premium Recipe Finder application.',
  image = 'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg/preview',
  url = window.location.href
}) {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = `${title} | Recipe Finder`;
    document.title = fullTitle;

    // 2. Update/Create Meta Tags
    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    setMetaTag('name', 'description', description);

    // Open Graph / Facebook
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);

    // Twitter
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:url', url);
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // Cleanup not strictly necessary for SEO as we overwrite them on next page load,
    // but good practice if we want to revert to a default state, though standard SPA 
    // behavior is just overwriting on route change.

  }, [title, description, image, url]);
}
