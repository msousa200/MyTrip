'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export default function ScrollAnimation({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up'
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, delay);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  const getAnimationClass = () => {
    switch (direction) {
      case 'up':
        return 'scroll-animate-up';
      case 'down':
        return 'scroll-animate-down';
      case 'left':
        return 'scroll-animate-left';
      case 'right':
        return 'scroll-animate-right';
      case 'fade':
        return 'scroll-animate-fade';
      default:
        return 'scroll-animate-up';
    }
  };

  return (
    <div ref={ref} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
}
