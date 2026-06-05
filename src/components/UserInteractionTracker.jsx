import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from 'posthog-js';

const UserInteractionTracker = () => {
  const location = useLocation();

  useEffect(() => {
    let startTime = Date.now();
    
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
      
      posthog.capture('scroll_depth', {
        depth: Math.round(scrollPercent),
        max_depth: Math.round(maxScrollDepth),
        pathname: location.pathname
      });
    };
    
    const handleButtonClick = (e) => {
      const button = e.target.closest('button, a, .clickable');
      if (button) {
        posthog.capture('user_interaction', {
          interaction_type: 'click',
          element_type: button.tagName,
          element_text: button.innerText?.substring(0, 50),
          element_id: button.id,
          element_class: button.className,
          pathname: location.pathname,
          timestamp: new Date().toISOString()
        });
      }
    };
    
    let formStartTime = {};
    const handleFormFocus = (e) => {
      const input = e.target.closest('input, textarea, select');
      if (input && input.name) {
        formStartTime[input.name] = Date.now();
        posthog.capture('form_field_focus', {
          field_name: input.name,
          field_type: input.type,
          pathname: location.pathname
        });
      }
    };
    
    const handleFormBlur = (e) => {
      const input = e.target.closest('input, textarea, select');
      if (input && input.name && formStartTime[input.name]) {
        const timeSpent = Date.now() - formStartTime[input.name];
        posthog.capture('form_field_blur', {
          field_name: input.name,
          time_spent_ms: timeSpent,
          has_value: !!input.value,
          pathname: location.pathname
        });
        delete formStartTime[input.name];
      }
    };
    
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime;
      posthog.capture('page_exit', {
        time_on_page_seconds: Math.round(timeSpent / 1000),
        max_scroll_depth: Math.round(maxScrollDepth),
        pathname: location.pathname
      });
    };
    
    posthog.capture('session_start', {
      pathname: location.pathname,
      referrer: document.referrer,
      screen_size: `${window.innerWidth}x${window.innerHeight}`
    });
    
    if (posthog.sessionRecording) {
      posthog.sessionRecording.start();
    }
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleButtonClick);
    window.addEventListener('focusin', handleFormFocus);
    window.addEventListener('focusout', handleFormBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleButtonClick);
      window.removeEventListener('focusin', handleFormFocus);
      window.removeEventListener('focusout', handleFormBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      const timeSpent = Date.now() - startTime;
      posthog.capture('page_leave', {
        time_on_page_seconds: Math.round(timeSpent / 1000),
        max_scroll_depth: Math.round(maxScrollDepth),
        pathname: location.pathname
      });
    };
  }, [location.pathname]);

  return null;
};

export default UserInteractionTracker;