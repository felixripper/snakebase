'use client';

import styles from './LeaderboardUISettings.module.css';

interface LeaderboardUIConfig {
  headerBackground: string;
  headerTextColor: string;
  rowBackgroundEven: string;
  rowBackgroundOdd: string;
  rowBackgroundHover: string;
  currentUserHighlight: string;
  topThreeBackground: string;
  textColor: string;
  fontSize: number;
  borderRadius: number;
  spacing: number;
}

interface Props {
  config: LeaderboardUIConfig;
  onChange: (config: LeaderboardUIConfig) => void;
}

export default function LeaderboardUISettings({ config, onChange }: Props) {
  const handleChange = (key: keyof LeaderboardUIConfig, value: string | number) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.section}>
          <h3>Başlık Bölümü</h3>
          
          <div className={styles.field}>
            <label>Arkaplan</label>
            <div className={styles.colorInput}>
              <input
                type="text"
                value={config.headerBackground}
                onChange={(e) => handleChange('headerBackground', e.target.value)}
                placeholder="linear-gradient(...)"
              />
              <div 
                className={styles.colorPreview}
                style={{ background: config.headerBackground }}
              />
            </div>
            <span className={styles.hint}>Gradient veya renk kodu</span>
          </div>

          <div className={styles.field}>
            <label>Yazı Rengi</label>
            <div className={styles.colorInput}>
              <input
                type="color"
                value={config.headerTextColor}
                onChange={(e) => handleChange('headerTextColor', e.target.value)}
              />
              <input
                type="text"
                value={config.headerTextColor}
                onChange={(e) => handleChange('headerTextColor', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Satır Renkleri</h3>
          
          <div className={styles.field}>
            <label>Çift Satır Arkaplan</label>
            <div className={styles.colorInput}>
              <input
                type="color"
                value={config.rowBackgroundEven}
                onChange={(e) => handleChange('rowBackgroundEven', e.target.value)}
              />
              <input
                type="text"
                value={config.rowBackgroundEven}
                onChange={(e) => handleChange('rowBackgroundEven', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Tek Satır Arkaplan</label>
            <div className={styles.colorInput}>
              <input
                type="color"
                value={config.rowBackgroundOdd}
                onChange={(e) => handleChange('rowBackgroundOdd', e.target.value)}
              />
              <input
                type="text"
                value={config.rowBackgroundOdd}
                onChange={(e) => handleChange('rowBackgroundOdd', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Hover Arkaplan</label>
            <div className={styles.colorInput}>
              <input
                type="color"
                value={config.rowBackgroundHover}
                onChange={(e) => handleChange('rowBackgroundHover', e.target.value)}
              />
              <input
                type="text"
                value={config.rowBackgroundHover}
                onChange={(e) => handleChange('rowBackgroundHover', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Özel Vurgular</h3>
          
          <div className={styles.field}>
            <label>Mevcut Kullanıcı Vurgusu</label>
            <div className={styles.colorInput}>
              <input
                type="color"
                value={config.currentUserHighlight}
                onChange={(e) => handleChange('currentUserHighlight', e.target.value)}
              />
              <input
                type="text"
                value={config.currentUserHighlight}
                onChange={(e) => handleChange('currentUserHighlight', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>İlk 3 Arkaplan</label>
            <div className={styles.colorInput}>
              <input
                type="color"
                value={config.topThreeBackground}
                onChange={(e) => handleChange('topThreeBackground', e.target.value)}
              />
              <input
                type="text"
                value={config.topThreeBackground}
                onChange={(e) => handleChange('topThreeBackground', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Yazı Rengi</label>
            <div className={styles.colorInput}>
              <input
                type="color"
                value={config.textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
              />
              <input
                type="text"
                value={config.textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Boyutlar ve Aralıklar</h3>
          
          <div className={styles.field}>
            <label>Yazı Boyutu: {config.fontSize}px</label>
            <input
              type="range"
              min="10"
              max="24"
              value={config.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
            />
          </div>

          <div className={styles.field}>
            <label>Köşe Yuvarlama: {config.borderRadius}px</label>
            <input
              type="range"
              min="0"
              max="30"
              value={config.borderRadius}
              onChange={(e) => handleChange('borderRadius', parseInt(e.target.value))}
            />
          </div>

          <div className={styles.field}>
            <label>Boşluk: {config.spacing}px</label>
            <input
              type="range"
              min="0"
              max="40"
              value={config.spacing}
              onChange={(e) => handleChange('spacing', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className={styles.preview}>
        <h4>Önizleme</h4>
        <div 
          className={styles.mockLeaderboard}
          style={{
            fontSize: `${config.fontSize}px`,
            borderRadius: `${config.borderRadius}px`,
            gap: `${config.spacing}px`
          }}
        >
          <div 
            className={styles.mockHeader}
            style={{
              background: config.headerBackground,
              color: config.headerTextColor,
              borderRadius: `${config.borderRadius}px ${config.borderRadius}px 0 0`
            }}
          >
            🏆 Lider Tablosu
          </div>
          <div className={styles.mockRows}>
            <div 
              className={styles.mockRow}
              style={{
                background: config.topThreeBackground,
                color: config.textColor
              }}
            >
              🥇 Player1 - 1000
            </div>
            <div 
              className={styles.mockRow}
              style={{
                background: config.rowBackgroundEven,
                color: config.textColor
              }}
            >
              #4 Player4 - 400
            </div>
            <div 
              className={styles.mockRow}
              style={{
                background: config.currentUserHighlight,
                color: config.textColor,
                fontWeight: 'bold'
              }}
            >
              #5 SEN - 350
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
