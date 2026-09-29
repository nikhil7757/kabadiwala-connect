import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Camera, Trash2, Image as ImageIcon, Plus } from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { StepHeader } from '../../components/common/StepHeader.js';
import { StickyActionBar } from '../../components/common/StickyActionBar.js';
import { SpeakerButton } from '../../components/common/SpeakerButton.js';
import { db, PhotoItem } from '../../db/index.js';

export const NewLotPhotoScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<Array<{ id: string; dataUrl: string; sha256: string; file: File }>>([]);
  const [compressing, setCompressing] = useState(false);

  // Compress photo with HTML5 Canvas (max 1024px, JPEG quality 0.7) per TRD Section 12.5
  const compressImage = async (file: File): Promise<{ dataUrl: string; sha256: string; blob: Blob }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        URL.revokeObjectURL(img.src);
        const maxSide = 1024;
        let { width, height } = img;

        if (width > maxSide || height > maxSide) {
          if (width > height) {
            height = Math.round((height * maxSide) / width);
            width = maxSide;
          } else {
            width = Math.round((width * maxSide) / height);
            height = maxSide;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context unavailable'));

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          async (blob) => {
            if (!blob) return reject(new Error('Image compression failed'));

            // Compute SHA-256 via Web Crypto Subtle
            const arrayBuffer = await blob.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const sha256 = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                dataUrl: reader.result as string,
                sha256,
                blob,
              });
            };
            reader.readAsDataURL(blob);
          },
          'image/jpeg',
          0.7
        );
      };
      img.onerror = reject;
    });
  };

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length >= 4) {
      alert('Maximum 4 photos allowed');
      return;
    }

    setCompressing(true);
    try {
      const file = files[0];
      const { dataUrl, sha256 } = await compressImage(file);
      const newPhoto = {
        id: crypto.randomUUID(),
        dataUrl,
        sha256,
        file,
      };

      setPhotos((prev) => [...prev, newPhoto]);
    } catch (err) {
      console.error('Photo processing error:', err);
    } finally {
      setCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleNext = () => {
    if (photos.length === 0) return;
    // Save draft in session / navigate
    navigate('/lot/new/material', { state: { photos } });
  };

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-28">
      <TopBar title={t('step_photo')} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-2 flex flex-col">
        <StepHeader currentStep={1} totalSteps={3} title={t('step_photo')} />

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-kc-ink-dim">
            Take clear photos of the scrap material (up to 4 photos).
          </p>
          <SpeakerButton
            audioKey="take_photo"
            fallbackText="Take clear photos of the scrap. Make sure labels and parts are visible."
            size="sm"
          />
        </div>

        {/* Hidden Camera Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          className="hidden"
          disabled={photos.length >= 4 || compressing}
        />

        {/* Big Camera Frame */}
        <div
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          className={`w-full h-56 rounded-xs border-3 border-dashed border-kc-border-strong bg-kc-surface flex flex-col items-center justify-center cursor-pointer select-none transition-transform active:scale-98 shadow-[2px_2px_0px_#141414] mb-4 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus ${
            photos.length >= 4 ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          {compressing ? (
            <div className="flex flex-col items-center gap-2">
              <span className="w-10 h-10 border-3 border-kc-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-bold text-kc-ink-dim uppercase">Optimizing Photo...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-kc-accent-soft border-2 border-kc-accent flex items-center justify-center text-kc-accent">
                <Camera className="w-9 h-9 stroke-[2.2]" />
              </div>
              <span className="text-lg font-bold text-kc-ink uppercase tracking-wider">
                {photos.length === 0 ? 'Open Camera' : 'Add Another Photo'}
              </span>
              <span className="text-xs text-kc-ink-dim font-mono">
                {photos.length} / 4 PHOTOS TAKEN
              </span>
            </div>
          )}
        </div>

        {/* Thumbnails Row */}
        {photos.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {photos.map((p, idx) => (
              <div key={p.id} className="relative aspect-square rounded-xs border-2 border-kc-border-strong overflow-hidden bg-kc-surface-2 group">
                <img src={p.dataUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p.id);
                  }}
                  className="absolute top-1 right-1 w-7 h-7 rounded-full bg-kc-danger text-white flex items-center justify-center active:scale-90"
                  aria-label="Delete photo"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <StickyActionBar
        primaryLabel="Next Step"
        primaryOnClick={handleNext}
        primaryDisabled={photos.length === 0 || compressing}
      />
    </div>
  );
};
