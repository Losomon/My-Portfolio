export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export type OgCardProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  footerLeft: string;
  footerRight: string;
};

export default function OgCard({ eyebrow, title, subtitle, footerLeft, footerRight }: OgCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1e1e',
        padding: '52px 64px',
        color: '#fefff8',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', fontSize: 20, letterSpacing: 6, color: 'rgba(254, 255, 248, 0.55)' }}>
          {eyebrow}
        </div>
        <div style={{ display: 'flex', fontSize: 20, letterSpacing: 2, color: 'rgba(254, 255, 248, 0.55)' }}>
          {footerRight}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontSize: 84, lineHeight: 1.05, letterSpacing: -3 }}>{title}</div>
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 28,
            lineHeight: 1.35,
            color: 'rgba(254, 255, 248, 0.68)',
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(254, 255, 248, 0.18)',
          paddingTop: 24,
          fontSize: 20,
          letterSpacing: 2,
          color: 'rgba(254, 255, 248, 0.55)',
        }}
      >
        <div style={{ display: 'flex' }}>{footerLeft}</div>
        <div style={{ display: 'flex' }}>NAIROBI, KENYA</div>
      </div>
    </div>
  );
}