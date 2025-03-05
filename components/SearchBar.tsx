import { Search } from "lucide-react";
import Form from "next/form";
import { translations } from '@/lib/translations';

export default function SearchBar() {
  return (
    <div className="w-full max-w-3xl">
      <Form action='/search' className="relative flex gap-2">
          <input
            type="text"
            name="q"
            placeholder={translations.search.placeholder}
            className="w-full h-[39px] px-4 text-sm border rounded-[2px] bg-[#E5EAED] focus:outline-none focus:ring-1 focus:ring-[#0068D7] focus:border-[#0068D7]"
          />
          <button
            type="submit"
            className="h-[39px] sm:px-4 bg-[#0068D7] text-white rounded-[2px] hover:bg-[#0068D7]/90 transition-colors flex items-center justify-center sm:justify-start sm:gap-2 sm:text-[14px] w-[39px] sm:w-auto"
            aria-label={translations.search.button}
          >
            <Search size={15} className="relative lg:-top-[1px]" />
            <span className="hidden sm:inline">{translations.search.button}</span>
          </button>
      </Form>
    </div>
  );
}