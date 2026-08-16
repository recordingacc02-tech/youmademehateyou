import { toast } from 'sonner';

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
};

export const shareNotice = async () => {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'youmademehateyou',
        text: 'a warning notice — for the new boy',
        url,
      });
    } catch {
      // user dismissed the sheet
    }
    return;
  }
  toast((await copyText(url)) ? 'link copied. pass it on quietly.' : 'copy failed — the address bar works too.');
};

export const shareCoda = async () => {
  const url = `${window.location.origin}${window.location.pathname}#coda`;
  toast(
    (await copyText(url))
      ? 'coda link copied. for someone who already read it once.'
      : 'copy failed — the address bar works too.'
  );
};
