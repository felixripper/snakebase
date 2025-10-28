'use client';
import React from 'react';

// Minimal placeholder header — wallet UI removed for game-only mode
export default function WalletBar() {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%', background: 'transparent' }}>
      <div style={{ maxWidth: 1024, margin: '0 auto', padding: '6px 12px', color: '#fff' }}>
        {/* Intentionally minimal — wallet features disabled */}
      </div>
    </div>
  );
}
