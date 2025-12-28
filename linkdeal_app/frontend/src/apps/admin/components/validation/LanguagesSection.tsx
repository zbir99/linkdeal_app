import { FunctionComponent } from 'react';

interface LanguagesSectionProps {
    languages: string;
}

const LanguagesSection: FunctionComponent<LanguagesSectionProps> = ({ languages }) => {
    // Handle cases where languages might be a JSON string, Python list string, or comma-separated
    const getLanguagesList = (langs: string) => {
        if (!langs) return [];

        try {
            // Try parsing as JSON first (if it's stored as ["English", "French"])
            const parsed = JSON.parse(langs);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            // Not standard JSON, try handling Python-style list string
        }

        // Handle Python-style list strings like "['English', 'German', 'Portuguese']"
        if (langs.startsWith('[') && langs.endsWith(']')) {
            // Remove brackets, split by comma, and clean up quotes
            return langs
                .slice(1, -1) // Remove [ and ]
                .split(',')
                .map(l => l.trim().replace(/^['"]|['"]$/g, '')) // Remove surrounding quotes
                .filter(Boolean);
        }

        // Split by comma if it's a string like "English, French"
        return langs.split(',').map(l => l.trim()).filter(Boolean);
    };

    const languagesList = getLanguagesList(languages);

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white">Languages</h2>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {languagesList.length > 0 ? (
                    languagesList.map((language, index) => (
                        <span
                            key={index}
                            className="px-3 py-1.5 rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-200 text-sm font-medium"
                        >
                            {language}
                        </span>
                    ))
                ) : (
                    <p className="text-white/40 italic">No languages specified</p>
                )}
            </div>
        </div>
    );
};

export default LanguagesSection;
