import { toast } from 'sonner';

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
  try {
    await navigator.clipboard.writeText(url);
    toast('link copied. pass it on quietly.');
  } catch {
    toast('copy failed — the address bar works too.');
  }
};
