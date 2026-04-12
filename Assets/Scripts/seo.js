(function () {
  const head = document.head;

  const metas = [
    { name: "description", content: "Indie software studio from Baku, Azerbaijan. We build Shapix (Android game), Dev Helper (AI browser extension for Chrome & Edge), and ECode (QR code web app)." },
    { name: "author",      content: "Elsim" },
    { name: "robots",      content: "index, follow" },
    { name: "theme-color", content: "#060606" },

    { property: "og:type",              content: "website" },
    { property: "og:url",               content: "https://elsim.dev/" },
    { property: "og:title",             content: "Elsim — Software Studio | Shapix, Dev Helper, ECode" },
    { property: "og:description",       content: "Indie software studio from Baku, Azerbaijan. Shapix (Android game) · Dev Helper (AI extension) · ECode (QR app)." },
    { property: "og:image",             content: "https://i.imgur.com/DEEeNgR.png" },
    { property: "og:image:width",       content: "1024" },
    { property: "og:image:height",      content: "1024" },
    { property: "og:image:alt",         content: "Elsim Software Studio logo" },
    { property: "og:locale",            content: "en_US" },
    { property: "og:locale:alternate",  content: "ru_RU" },
    { property: "og:locale:alternate",  content: "az_AZ" },
    { property: "og:site_name",         content: "Elsim" },

    { name: "twitter:card",        content: "summary_large_image" },
    { name: "twitter:title",       content: "Elsim — Software Studio | Shapix, Dev Helper, ECode" },
    { name: "twitter:description", content: "Indie software studio from Baku, Azerbaijan. Shapix · Dev Helper · ECode." },
    { name: "twitter:image",       content: "https://i.imgur.com/DEEeNgR.png" },
    { name: "twitter:image:alt",   content: "Elsim Software Studio logo" },
  ];

  metas.forEach(attrs => {
    const el = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    head.appendChild(el);
  });

  ["en", "ru", "az", "x-default"].forEach(lang => {
    const el = document.createElement("link");
    el.rel = "alternate";
    el.hreflang = lang;
    el.href = "https://elsim.dev/";
    head.appendChild(el);
  });

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Elsim",
      "url": "https://elsim.dev",
      "logo": "https://i.imgur.com/uMqXPgY.png",
      "description": "Indie software development studio from Baku, Azerbaijan.",
      "email": "elsimdev@gmail.com",
      "address": { "@type": "PostalAddress", "addressLocality": "Baku", "addressCountry": "AZ" },
      "sameAs": ["https://t.me/ElsimCore"]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Elsim",
      "url": "https://elsim.dev",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://elsim.dev/#products",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Elsim Products",
      "itemListElement": [
        {
          "@type": "SoftwareApplication",
          "position": 1,
          "name": "Shapix",
          "url": "https://shapix.vercel.app",
          "applicationCategory": "GameApplication",
          "operatingSystem": "Android",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "description": "Minimalist knife-throwing Android game.",
          "author": { "@type": "Organization", "name": "Elsim" }
        },
        {
          "@type": "SoftwareApplication",
          "position": 2,
          "name": "Dev Helper",
          "url": "https://dev-helper-browser.vercel.app",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Chrome, Edge",
          "offers": [
            { "@type": "Offer", "name": "Basic", "price": "2", "priceCurrency": "USD" },
            { "@type": "Offer", "name": "Plus",  "price": "5", "priceCurrency": "USD" }
          ],
          "description": "AI browser extension. Select text or screenshot for instant answers.",
          "author": { "@type": "Organization", "name": "Elsim" }
        },
        {
          "@type": "SoftwareApplication",
          "position": 3,
          "name": "ECode",
          "url": "https://elsim-ecode.vercel.app",
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "description": "QR code generator and scanner web app.",
          "author": { "@type": "Organization", "name": "Elsim" }
        }
      ]
    }
  ];

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(jsonLd);
  head.appendChild(script);
})();