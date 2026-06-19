"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    let ticking = false;

    // prefer container scrolling when using .site-scroll wrapper
    const container = el.closest('.site-scroll') || document.documentElement || document.scrollingElement;

    const getScrollInfo = () => {
      if (container && container !== document.documentElement && container !== document.scrollingElement) {
        const scrollTop = container.scrollTop;
        const height = container.scrollHeight - container.clientHeight;
        return { scrollTop, height };
      }
      const doc = document.documentElement || document.body;
      const scrollTop = window.scrollY || window.pageYOffset || doc.scrollTop || 0;
      const height = doc.scrollHeight - doc.clientHeight;
      return { scrollTop, height };
    };

    const update = () => {
      const { scrollTop, height } = getScrollInfo();
      const progress = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
      el.style.width = `${progress}%`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    // initialize
    update();
    if (container && container !== document.documentElement && container !== document.scrollingElement) {
      container.addEventListener('scroll', onScroll, { passive: true });
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('resize', onScroll);

    return () => {
      if (container && container !== document.documentElement && container !== document.scrollingElement) {
        container.removeEventListener('scroll', onScroll);
      } else {
        window.removeEventListener('scroll', onScroll);
      }
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="scroll-progress-container">
      <div ref={barRef} className="scroll-progress-bar" />
    </div>
  );
}
