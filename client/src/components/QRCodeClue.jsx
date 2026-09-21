import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, ExternalLink, QrCode } from 'lucide-react';

const QRCodeClue = ({ clueUrl, clueId, title, showDownload = false }) => {
  const fullUrl = window.location.origin + clueUrl;

  const handleDownload = () => {
    const svgElement = document.getElementById(`qr-code-svg-${clueId}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 60;
      ctx.fillStyle = '#070A13';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      
      ctx.fillStyle = '#6366F1';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title || `CIPHER CASE - ${clueId}`, canvas.width / 2, canvas.height - 15);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `CipherCase_QR_${clueId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="bg-mystery-900 border border-indigo-500/30 rounded-2xl p-5 flex flex-col items-center gap-4 text-center shadow-glow-purple max-w-xs mx-auto">
      <div className="flex items-center gap-2 text-indigo-400 font-heading font-bold text-sm uppercase tracking-wider">
        <QrCode className="w-4 h-4" /> QR CLUE EVIDENCE
      </div>

      <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-indigo-400/50">
        <QRCodeSVG
          id={`qr-code-svg-${clueId}`}
          value={fullUrl}
          size={160}
          bgColor="#FFFFFF"
          fgColor="#0F172A"
          level="H"
          includeMargin={false}
        />
      </div>

      <p className="text-xs text-slate-300 font-mono">
        Scan or click to open clue: <br />
        <a 
          href={clueUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-indigo-400 underline font-semibold hover:text-indigo-300 flex items-center justify-center gap-1 mt-1"
        >
          {clueUrl} <ExternalLink className="w-3 h-3" />
        </a>
      </p>

      {showDownload && (
        <button
          onClick={handleDownload}
          className="w-full py-2 px-3 rounded-xl bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" /> DOWNLOAD QR
        </button>
      )}
    </div>
  );
};

export default QRCodeClue;
