import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from 'posthog-js';

const PostHogHeatmap = () => {
  const location = useLocation();
  const isHeatmapActive = useRef(false);

  useEffect(() => {
    const mainPages = ['/map', "/login"];
    
    if (mainPages.includes(location.pathname)) {
      if (!isHeatmapActive.current) {
        posthog.capture('$heatmap_start', {
          pathname: location.pathname,
          timestamp: new Date().toISOString()
        });
        
        const handleMouseMove = (e) => {
          posthog.capture('$heatmap_mouse_move', {
            x: e.clientX,
            y: e.clientY,
            pathname: location.pathname
          });
        };
        
        const handleClick = (e) => {
          const target = e.target;
          posthog.capture('$heatmap_click', {
            x: e.clientX,
            y: e.clientY,
            element: target.tagName,
            className: target.className,
            id: target.id,
            text: target.innerText?.substring(0, 100),
            pathname: location.pathname
          });
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);
        isHeatmapActive.current = true;
        
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('click', handleClick);
        };
      }
    }
  }, [location.pathname]);

  return null;
};

export default PostHogHeatmap;