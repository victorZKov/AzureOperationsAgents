import { useState } from 'react';

// ----------------------------------------------------------------------

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

type ReturnType = {
  copy: CopyFn;
  copiedText: CopiedValue;
};

export function useCopyToClipboard(): ReturnType {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    console.log('copying', text);
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      console.log('copying', text);
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      console.log('copied', text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  };

  return { copiedText, copy };
}
