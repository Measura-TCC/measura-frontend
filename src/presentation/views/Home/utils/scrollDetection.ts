export const getActiveSection = (): string => {
  const scrollPosition = window.scrollY;
  const headerOffset = 150;
  const adjustedScrollPosition = scrollPosition + headerOffset;

  // Get all sections
  const sections = [
    { id: "team", element: document.getElementById("team") },
    { id: "benefits", element: document.getElementById("benefits") },
    { id: "features", element: document.getElementById("features") },
    { id: "home", element: document.getElementById("home") },
  ];

  // Find the active section (check from bottom to top)
  for (const section of sections) {
    if (section.element) {
      const sectionTop =
        section.element.getBoundingClientRect().top + window.scrollY;
      if (adjustedScrollPosition >= sectionTop) {
        return section.id;
      }
    }
  }

  return "home"; // Default fallback
};
