export function formatTimeAgo(isoString?: string): string {
  if (!isoString) return '';
  const now = Date.now();
  const date = new Date(isoString).getTime();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 30) return 'এইমাত্র';
  if (diffSec < 60) return `${toBanglaNumber(diffSec)} সেকেন্ড আগে`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${toBanglaNumber(diffMin)} মিনিট আগে`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${toBanglaNumber(diffHour)} ঘণ্টা আগে`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${toBanglaNumber(diffDay)} দিন আগে`;

  return new Date(isoString).toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function toBanglaNumber(n: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(n).replace(/\d/g, d => banglaDigits[Number(d)]);
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
