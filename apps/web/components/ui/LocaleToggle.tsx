'use client';

import { Button } from '@/packages/ui/src';
import { useLocale } from '@/apps/web/context/LocaleContext';

export default function LocaleToggle() {
  const { toggleLocale, messages } = useLocale();

  return (
    <Button type="button" variant="ghost" size="sm" onClick={toggleLocale} className="font-ui-en">
      {messages.common.switchLocale}
    </Button>
  );
}
