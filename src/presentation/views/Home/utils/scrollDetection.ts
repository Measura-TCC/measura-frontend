export const getActiveSection = (): string => {
  const headerOffset = 150;
  const viewportHeight = window.innerHeight;

  const sections = [
    { id: "home", element: document.getElementById("home") },
    { id: "features", element: document.getElementById("features") },
    { id: "benefits", element: document.getElementById("benefits") },
    { id: "team", element: document.getElementById("team") },
  ];

  let bestMatch = "home";
  let maxVisibility = 0;

  for (const section of sections) {
    if (section.element) {
      const rect = section.element.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const sectionHeight = rect.height;

      // Calculate visible portion of the section
      const visibleTop = Math.max(sectionTop, headerOffset);
      const visibleBottom = Math.min(sectionBottom, viewportHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      // Calculate visibility percentage
      const visibilityPercentage =
        sectionHeight > 0 ? visibleHeight / sectionHeight : 0;

      // A section becomes active when more than 50% is visible
      // or when it's the most visible section
      if (visibilityPercentage > maxVisibility) {
        maxVisibility = visibilityPercentage;
        bestMatch = section.id;
      }
    }
  }

  // Only activate if at least 30% of the section is visible
  // This prevents tiny slivers from activating sections
  return maxVisibility > 0.3 ? bestMatch : "home";
};
