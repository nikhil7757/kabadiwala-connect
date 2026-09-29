/**
 * Motion safety guard checking prefers-reduced-motion and budget device RAM
 * per TRD Section 12.11 and UI_UX.md Section 7
 */

export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowMemory =
    typeof (navigator as any).deviceMemory !== 'undefined' &&
    (navigator as any).deviceMemory <= 2;

  return prefersReduced || isLowMemory;
}

export function initMotionGuard(): void {
  if (typeof window === 'undefined') return;

  const reduced = isReducedMotion();
  document.documentElement.setAttribute('data-motion', reduced ? 'reduced' : 'on');

  window
    .matchMedia('(prefers-reduced-motion: reduce)')
    .addEventListener('change', () => {
      document.documentElement.setAttribute(
        'data-motion',
        isReducedMotion() ? 'reduced' : 'on'
      );
    });
}
