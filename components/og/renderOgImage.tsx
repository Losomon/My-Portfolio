import { ImageResponse } from 'next/og';
import OgCard, { OG_SIZE, type OgCardProps } from '@/components/og/OgCard';

export function renderOgImage(props: OgCardProps): ImageResponse {
  return new ImageResponse(<OgCard {...props} />, { ...OG_SIZE });
}