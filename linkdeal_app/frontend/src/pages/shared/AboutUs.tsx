import { useState } from 'react';
import { Link } from 'react-router-dom';
import linkDealLogo from "@/assets/landing_page/images/logo (2).png";
import linkDealLogoLight from "@/assets/landing_page/images/logo_light_mode.png";

export const AboutUs = (): JSX.Element => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const teamMembers = [
        {
            name: 'Équipe Technique',
            role: 'Développement & Innovation',
            description: 'Notre équipe technique travaille sans relâche pour créer une plateforme de mentorat exceptionnelle.'
        },
        {
            name: 'Équipe Mentorat',
            role: 'Gestion des Mentors',
            description: 'Nous sélectionnons et formons les meilleurs mentors pour garantir une expérience de qualité.'
        },
        {
            name: 'Équipe IA',
            role: 'Intelligence Artificielle',
            description: 'Nous développons des solutions IA avancées pour un coaching personnalisé et efficace.'
        }
    ];

    const values = [
        {
            title: 'Excellence',
            description: 'Nous nous engageons à fournir un service de mentorat de la plus haute qualité.'
        },
        {
            title: 'Innovation',
            description: 'Nous combinons l\'IA et l\'expertise humaine pour créer des solutions uniques.'
        },
        {
            title: 'Accessibilité',
            description: 'Le mentorat de qualité doit être accessible à tous, partout et à tout moment.'
        },
        {
            title: 'Communauté',
            description: 'Nous créons une communauté d\'apprenants et de mentors passionnés par la croissance.'
        }
    ];

    return (
        <>
            <style>{`
                .theme-toggle {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    width: 70px;
                    height: 35px;
                    background: rgba(194, 122, 255, 0.2) !important;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    overflow: hidden;
                    border: 2px solid rgba(194, 122, 255, 0.3) !important;
                }
                
                .theme-toggle:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
                }
                
                .theme-toggle.dark {
                    background: linear-gradient(90deg, rgba(10, 25, 47, 1), rgba(26, 15, 46, 1)) !important;
                    border-color: rgba(109, 40, 217, 0.5) !important;
                    box-shadow: 0 4px 15px rgba(109, 40, 217, 0.3);
                }
                
                .theme-slider {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 0 4px;
                    transition: all 0.3s ease;
                }
                
                .theme-toggle.dark .theme-slider {
                    justify-content: flex-end;
                }
                
                .theme-icon {
                    width: 28px;
                    height: 28px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    color: #1e293b;
                }
                
                .light-mode {
                    background: #ffffff !important;
                    position: relative;
                    overflow: hidden;
                }
                
                .light-mode::before {
                    content: '';
                    position: absolute;
                    top: 20%;
                    right: -100px;
                    transform: translateY(-50%);
                    width: 288px;
                    height: 288px;
                    border-radius: 50%;
                    background: linear-gradient(297deg, rgba(255, 133, 203, 0.25) 0%, rgba(163, 124, 205, 0.25) 100%);
                    filter: blur(32px);
                    z-index: 0;
                    pointer-events: none;
                }
                
                .light-mode::after {
                    content: '';
                    position: absolute;
                    bottom: 10%;
                    left: 970px;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(109, 40, 217, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
                    filter: blur(24px);
                    z-index: 0;
                    pointer-events: none;
                }
                
                .light-mode .text-white {
                    color: #1e293b !important;
                }
                
                .light-mode .btn-primary {
                    color: #ffffff !important;
                }
                
                .light-mode [class*="text-gray-300"] {
                    color: #64748b !important;
                }
                
                .light-mode [class*="bg-[#0a192fcc]"] {
                    background: rgba(255, 255, 255, 0.95) !important;
                }
                
                .light-mode [class*="border-[#6d28d833]"] {
                    border-color: rgba(109, 40, 217, 0.2) !important;
                }
                
                .light-mode .text-purple-400 {
                    color: #8200DB !important;
                }
                
                .btn-primary {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .btn-primary::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s ease;
                }
                
                .btn-primary:hover::before {
                    left: 100%;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 8px 25px rgba(109, 40, 217, 0.4);
                    filter: brightness(1.1);
                }
                
                .btn-primary:active {
                    transform: translateY(0) scale(0.98);
                }
                
                .btn-secondary {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .btn-secondary:hover {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 8px 25px rgba(109, 40, 217, 0.3);
                    background: white;
                    border-color: rgba(109, 40, 217, 0.8);
                }
                
                .btn-secondary:active {
                    transform: translateY(0) scale(0.98);
                }
                
                .btn-arrow {
                    transition: transform 0.3s ease;
                }
                
                .btn-primary:hover .btn-arrow,
                .btn-secondary:hover .btn-arrow {
                    transform: translateX(4px);
                }
                
                .card-hover {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .card-hover::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(109, 40, 217, 0.1), transparent);
                    transition: left 0.5s ease;
                }
                
                .card-hover:hover::before {
                    left: 100%;
                }
                
                .card-hover:hover {
                    transform: translateY(-5px) scale(1.02);
                    box-shadow: 0 10px 30px rgba(109, 40, 217, 0.3);
                    background: linear-gradient(135deg, rgba(109, 40, 217, 0.1), rgba(110, 17, 176, 0.05)) !important;
                    border-color: rgba(109, 40, 217, 0.6) !important;
                }
                
                .logo-protected {
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    -webkit-user-drag: none;
                    pointer-events: none;
                }
            `}</style>
            <div className={`min-h-screen ${!isDarkMode ? 'light-mode' : 'bg-[linear-gradient(180deg,rgba(10,25,47,1)_0%,rgba(26,15,46,1)_50%,rgba(45,27,78,1)_100%)]'}`}>
                {/* Theme Toggle Button */}
                <button
                    className={`theme-toggle ${isDarkMode ? 'dark' : ''}`}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    <div className="theme-slider">
                        <span className="theme-icon">
                            {isDarkMode ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                            )}
                        </span>
                    </div>
                </button>

                {/* Header avec logo */}
                <div className="container mx-auto px-6 py-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-purple-400 transition-colors mb-8">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Retour à l'accueil</span>
                    </Link>

                    <div className="flex flex-col items-center text-center mb-16">
                        <img
                            className={`w-40 h-40 mb-6 logo-protected ${isDarkMode ? 'animate-pulse' : ''}`}
                            style={{
                                filter: isDarkMode ? 'drop-shadow(0 0 20px rgba(109, 40, 217, 0.8)) drop-shadow(0 0 40px rgba(110, 17, 176, 0.6))' : 'none',
                            }}
                            alt="LinkDeal Logo"
                            src={isDarkMode ? linkDealLogo : linkDealLogoLight}
                        />
                        <h1 className="text-5xl font-bold text-white mb-4">À propos de LinkDeal</h1>
                        <p className="text-xl text-gray-300 max-w-3xl">
                            LinkDeal révolutionne le mentorat en combinant la puissance de l'intelligence artificielle avec l'expertise humaine pour créer une expérience d'apprentissage personnalisée et accessible à tous.
                        </p>
                    </div>

                    {/* Notre Mission */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="bg-[#0a192fcc] border border-[#6d28d833] rounded-2xl p-8 card-hover">
                            <h2 className="text-3xl font-bold text-white mb-4">Notre Mission</h2>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Chez LinkDeal, nous croyons que chacun mérite d'avoir accès à un mentorat de qualité. Notre mission est de démocratiser l'accès aux mentors experts et à l'accompagnement personnalisé grâce à une plateforme innovante qui combine coaching IA 24/7 et sessions de mentorat humain. Nous voulons permettre à chaque étudiant, entrepreneur et professionnel d'atteindre son plein potentiel en bénéficiant de conseils adaptés à leurs besoins spécifiques.
                            </p>
                        </div>
                    </div>

                    {/* Notre Vision */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="bg-[#0a192fcc] border border-[#6d28d833] rounded-2xl p-8 card-hover">
                            <h2 className="text-3xl font-bold text-white mb-4">Notre Vision</h2>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Nous imaginons un monde où le mentorat de qualité n'est plus un privilège réservé à quelques-uns, mais une opportunité accessible à tous. En tirant parti des avancées en intelligence artificielle et en créant une communauté de mentors passionnés, nous construisons le futur de l'apprentissage personnalisé. Notre vision est de devenir la plateforme de référence mondiale pour le mentorat hybride, où technologie et humanité se rencontrent pour créer des parcours d'apprentissage transformateurs.
                            </p>
                        </div>
                    </div>

                    {/* Nos Valeurs */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold text-white text-center mb-12">Nos Valeurs</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {values.map((value, index) => (
                                <div key={index} className="bg-[#0a192fcc] border border-[#6d28d833] rounded-2xl p-6 card-hover">
                                    <h3 className="text-2xl font-semibold text-white mb-3">{value.title}</h3>
                                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notre Équipe */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold text-white text-center mb-12">Notre Équipe</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="bg-[#0a192fcc] border border-[#6d28d833] rounded-2xl p-6 text-center card-hover">
                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-purple-500/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                                    <p className="text-purple-400 mb-3">{member.role}</p>
                                    <p className="text-gray-300 text-sm">{member.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold text-white text-center mb-12">Notre Impact</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-[#0a192fcc] border border-[#6d28d833] rounded-2xl p-6 text-center card-hover">
                                <div className="text-4xl font-bold text-white mb-2">10K+</div>
                                <div className="text-gray-300">Utilisateurs Actifs</div>
                            </div>
                            <div className="bg-[#0a192fcc] border border-[#6d28d833] rounded-2xl p-6 text-center card-hover">
                                <div className="text-4xl font-bold text-white mb-2">500+</div>
                                <div className="text-gray-300">Mentors Experts</div>
                            </div>
                            <div className="bg-[#0a192fcc] border border-[#6d28d833] rounded-2xl p-6 text-center card-hover">
                                <div className="text-4xl font-bold text-white mb-2">50K+</div>
                                <div className="text-gray-300">Sessions IA</div>
                            </div>
                            <div className="bg-[#0a192fcc] border border-[#6d28d833] rounded-2xl p-6 text-center card-hover">
                                <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
                                <div className="text-gray-300">Note Moyenne</div>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-[#0a192fcc] border border-[#6d28d833] rounded-2xl p-12 card-hover">
                            <h2 className="text-3xl font-bold text-white mb-4">Rejoignez-nous dans cette aventure</h2>
                            <p className="text-xl text-gray-300 mb-8">
                                Que vous soyez un apprenant en quête de guidance ou un expert prêt à partager ses connaissances, LinkDeal est l'endroit idéal pour vous.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/signup"
                                    className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[linear-gradient(90deg,rgba(109,40,217,1)_0%,rgba(110,17,176,1)_100%)] text-white font-semibold text-lg no-underline"
                                >
                                    <span>Commencer maintenant</span>
                                    <svg className="w-5 h-5 btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <Link
                                    to="/"
                                    className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-colors no-underline"
                                >
                                    <span>En savoir plus</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

