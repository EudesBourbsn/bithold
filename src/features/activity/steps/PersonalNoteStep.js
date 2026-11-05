import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { useT } from '../../../i18n/index';
import { NoteEntry } from '../components/NoteEntry';

export function PersonalNoteStep({ message, onBack, onSave }) {
  const t = useT();
  return (
    <>
      <SheetHeader title="" onBack={onBack} />
      <NoteEntry
        title={t('note.title')}
        placeholder={t('note.title')}
        initial={message ?? ''}
        onSubmit={async note => {
          await onSave(note);
          onBack();
        }}
      />
    </>
  );
}
