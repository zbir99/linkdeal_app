import { FunctionComponent } from 'react';

const FormHeader: FunctionComponent = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#A684FF]"
        >
          <path
            d="M15.9993 29.3337C23.3631 29.3337 29.3327 23.3641 29.3327 16.0003C29.3327 8.63653 23.3631 2.66699 15.9993 2.66699C8.63555 2.66699 2.66602 8.63653 2.66602 16.0003C2.66602 23.3641 8.63555 29.3337 15.9993 29.3337Z"
            stroke="#A684FF"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.1191 11.9998C12.4326 11.1087 13.0513 10.3573 13.8657 9.87863C14.6802 9.39999 15.6377 9.22503 16.5687 9.38473C17.4998 9.54443 18.3442 10.0285 18.9526 10.7512C19.5609 11.4738 19.8939 12.3885 19.8925 13.3331C19.8925 15.9998 15.8925 17.3331 15.8925 17.3331"
            stroke="#A684FF"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 22.667H16.0133"
            stroke="#A684FF"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="text-3xl sm:text-[32px] font-semibold">Create Support Ticket</h1>
      </div>
      <p className="text-base text-gray-300 font-arimo">Our team will respond as soon as possible</p>
    </div>
  );
};

export { FormHeader };
