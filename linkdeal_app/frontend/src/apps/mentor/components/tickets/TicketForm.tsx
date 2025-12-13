import { FunctionComponent, useState } from 'react';
import { BackButton, FormHeader, SubjectInput, CategorySelect, DescriptionTextarea, FileUpload, TipBox, ActionButtons, CommonQuestions } from '.';

const TicketForm: FunctionComponent = () => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = () => {
    console.log('Ticket submitted:', { subject, category, description, attachments });
  };

  const handleCancel = () => {
    console.log('Ticket cancelled');
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto text-white font-inter">
      <div className="absolute -top-16 -left-8 w-64 h-64 rounded-full bg-[#8033d0]/30 blur-[160px]" />
      <div className="absolute bottom-0 -right-6 w-72 h-72 rounded-full bg-[#0a203b]/40 blur-[160px]" />

      <div className="relative space-y-6 sm:space-y-8">
        <BackButton />

        <FormHeader />

        <div className="rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black/30 px-6 sm:px-10 py-10 space-y-8">
          <div className="space-y-6 text-[14px] font-arimo text-gray-300">
            <SubjectInput value={subject} onChange={setSubject} />
            <CategorySelect value={category} onChange={setCategory} />
            <DescriptionTextarea value={description} onChange={setDescription} />
            <FileUpload files={attachments} onChange={setAttachments} />
            <TipBox />
            <ActionButtons
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              canSubmit={Boolean(subject && category && description)}
            />
          </div>
        </div>

        <CommonQuestions />
      </div>
    </div>
  );
};

export { TicketForm };
