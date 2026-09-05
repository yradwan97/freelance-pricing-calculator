import { useEffect } from 'react';

export default function AdSenseUnit({ slot, format = 'auto' }) {
  useEffect(() => {
    // Push adsbygoogle queue for this ad unit
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSense script may not be loaded yet
      console.log('AdSense unit not ready');
    }
  }, [slot]);

  return (
    <div style={{ margin: '2rem 0', minHeight: '100px' }}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
        data-ad-client="ca-pub-9588469746780239"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
