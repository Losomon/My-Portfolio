export const waitFrames = (count: number) =>
  new Promise<void>((resolve) => {
    let remaining = count;

    const step = () => {
      remaining -= 1;
      if (remaining <= 0) resolve();
      else requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });

export const waitForImage = (image: HTMLImageElement | null) => {
  if (!image) return Promise.resolve();
  if (image.complete && image.naturalWidth > 0) return Promise.resolve();

  return new Promise<void>((resolve) => {
    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener('error', () => resolve(), { once: true });
  });
};