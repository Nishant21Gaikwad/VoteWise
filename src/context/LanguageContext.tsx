'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'HI' | 'MR';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {
    'nav.journey': 'Journey',
    'nav.timeline': 'Timeline',
    'nav.assistant': 'AI Assistant',
    'nav.resources': 'Resources',
    'nav.myths': 'Myths',
    'hero.badge': 'Festival of Democracy',
    'hero.title1': 'Your Voice.',
    'hero.title2': 'Your India.',
    'hero.desc': 'Join 1 billion citizens in the world\'s largest democratic exercise. Master the process, combat myths, and cast your vote with absolute confidence.',
    'hero.btn.evm': 'Experience 3D EVM',
    'hero.btn.ai': 'Ask AI Assistant',
    'widget.title': 'Quick Eligibility Check',
    'widget.subtitle': 'Are you ready to vote in the upcoming elections?',
    'widget.age': 'Age Requirement',
    'widget.age.desc': '18+ years old as of Jan 1st',
    'widget.epic': 'Valid EPIC Card',
    'widget.epic.desc': 'Registered via Form 6',
    'widget.search.label': 'Find Your Polling Station',
    'widget.search.placeholder': 'Enter 6-digit Pincode',
    'stats.voters': 'Registered Voters',
    'stats.booths': 'Polling Stations',
    'stats.constituencies': 'Constituencies',
    'stats.officials': 'Polling Officials',
    'bento.title': 'Everything you need to ',
    'bento.subtitle': 'Explore our interactive modules to understand the election process inside out.',
    'bento.ai.title': 'AI Election Assistant',
    'bento.ai.desc': 'Have questions about Form 6, MCC, or candidate backgrounds? Ask our AI in multiple Indian languages and get instant, accurate answers.',
    'bento.ai.chat1': 'How do I check if my name is on the electoral roll?',
    'bento.ai.chat2': 'You can visit the NVSP portal or download the Voter Helpline App.',
    'bento.evm.title': '3D EVM Simulation',
    'bento.evm.desc': 'Experience the polling booth. Press the blue button, see the red LED, and watch the VVPAT slip drop.',
    'bento.journey.title': 'Interactive Journey',
    'bento.journey.desc': 'Follow the 6 steps from Eligibility to Polling Day. Track your progress and earn your Readiness Score.',
    'bento.resources.tag': 'Knowledge Hub',
    'bento.resources.title': 'Comprehensive Election Library',
    'bento.resources.desc': 'Understand the difference between Lok Sabha and Vidhan Sabha. Read about the ECI, MCC, and your fundamental rights.',
    'cinematic.title1': 'The Great',
    'cinematic.title2': 'Indian',
    'cinematic.title3': 'Election',
    'cinematic.scroll': 'Scroll to immerse',
    'cinematic.booth': 'Experience the Booth',
    'cinematic.booth.desc': 'You\'ve reached Polling Day. The realistic Indian EVM is ready. Press the blue button to cast your vote.'
  },
  HI: {
    'nav.journey': 'यात्रा',
    'nav.timeline': 'समयरेखा',
    'nav.assistant': 'AI सहायक',
    'nav.resources': 'संसाधन',
    'nav.myths': 'मिथक',
    'hero.badge': 'लोकतंत्र का पर्व',
    'hero.title1': 'आपकी आवाज़.',
    'hero.title2': 'आपका भारत.',
    'hero.desc': 'दुनिया के सबसे बड़े लोकतांत्रिक अभ्यास में 1 अरब नागरिकों के साथ जुड़ें। प्रक्रिया को समझें और पूर्ण विश्वास के साथ अपना वोट डालें।',
    'hero.btn.evm': '3D EVM का अनुभव करें',
    'hero.btn.ai': 'AI से पूछें',
    'widget.title': 'त्वरित पात्रता जांच',
    'widget.subtitle': 'क्या आप आगामी चुनावों में मतदान के लिए तैयार हैं?',
    'widget.age': 'आयु आवश्यकता',
    'widget.age.desc': '1 जनवरी को 18+ वर्ष',
    'widget.epic': 'वैध EPIC कार्ड',
    'widget.epic.desc': 'फॉर्म 6 के माध्यम से पंजीकृत',
    'widget.search.label': 'अपना मतदान केंद्र खोजें',
    'widget.search.placeholder': '6-अंकीय पिनकोड दर्ज करें',
    'stats.voters': 'पंजीकृत मतदाता',
    'stats.booths': 'मतदान केंद्र',
    'stats.constituencies': 'निर्वाचन क्षेत्र',
    'stats.officials': 'मतदान अधिकारी',
    'bento.title': 'सब कुछ जो आपको चाहिए ',
    'bento.subtitle': 'चुनाव प्रक्रिया को गहराई से समझने के लिए हमारे संवादात्मक मॉड्यूल का अन्वेषण करें।',
    'bento.ai.title': 'AI चुनाव सहायक',
    'bento.ai.desc': 'फॉर्म 6 या एमसीसी के बारे में प्रश्न हैं? हमारे एआई से कई भारतीय भाषाओं में पूछें और सटीक उत्तर प्राप्त करें।',
    'bento.ai.chat1': 'मैं कैसे जांचूं कि मेरा नाम मतदाता सूची में है?',
    'bento.ai.chat2': 'आप NVSP पोर्टल पर जा सकते हैं या वोटर हेल्पलाइन ऐप डाउनलोड कर सकते हैं।',
    'bento.evm.title': '3D EVM सिमुलेशन',
    'bento.evm.desc': 'मतदान केंद्र का अनुभव करें। नीला बटन दबाएं, लाल एलईडी देखें, और VVPAT पर्ची गिरते हुए देखें।',
    'bento.journey.title': 'संवादात्मक यात्रा',
    'bento.journey.desc': 'पात्रता से मतदान के दिन तक 6 चरणों का पालन करें। अपनी प्रगति ट्रैक करें।',
    'bento.resources.tag': 'ज्ञान केंद्र',
    'bento.resources.title': 'व्यापक चुनाव पुस्तकालय',
    'bento.resources.desc': 'लोकसभा और विधानसभा के बीच का अंतर समझें। ईसीआई और अपने मौलिक अधिकारों के बारे में पढ़ें।',
    'cinematic.title1': 'महान',
    'cinematic.title2': 'भारतीय',
    'cinematic.title3': 'चुनाव',
    'cinematic.scroll': 'अनुभव करने के लिए नीचे स्क्रॉल करें',
    'cinematic.booth': 'बूथ का अनुभव करें',
    'cinematic.booth.desc': 'आप मतदान के दिन पहुँच गए हैं। यथार्थवादी भारतीय ईवीएम तैयार है। अपना वोट डालने के लिए नीला बटन दबाएं।'
  },
  MR: {
    'nav.journey': 'प्रवास',
    'nav.timeline': 'वेळापत्रक',
    'nav.assistant': 'AI सहाय्यक',
    'nav.resources': 'संसाधने',
    'nav.myths': 'गैरसमज',
    'hero.badge': 'लोकशाहीचा उत्सव',
    'hero.title1': 'तुमचा आवाज.',
    'hero.title2': 'तुमचा भारत.',
    'hero.desc': 'जगातील सर्वात मोठ्या लोकशाही प्रक्रियेत 1 अब्ज नागरिकांसह सामील व्हा. प्रक्रिया समजून घ्या आणि पूर्ण आत्मविश्वासाने मतदान करा.',
    'hero.btn.evm': '3D EVM अनुभव घ्या',
    'hero.btn.ai': 'AI ला विचारा',
    'widget.title': 'पात्रता तपासा',
    'widget.subtitle': 'तुम्ही आगामी निवडणुकीत मतदान करण्यासाठी तयार आहात का?',
    'widget.age': 'वयाची अट',
    'widget.age.desc': '1 जानेवारी रोजी 18+ वर्षे',
    'widget.epic': 'वैध EPIC कार्ड',
    'widget.epic.desc': 'फॉर्म 6 द्वारे नोंदणीकृत',
    'widget.search.label': 'तुमचे मतदान केंद्र शोधा',
    'widget.search.placeholder': '6-अंकी पिनकोड प्रविष्ट करा',
    'stats.voters': 'नोंदणीकृत मतदार',
    'stats.booths': 'मतदान केंद्रे',
    'stats.constituencies': 'मतदारसंघ',
    'stats.officials': 'मतदान अधिकारी',
    'bento.title': 'तुम्हाला आवश्यक असलेले सर्वकाही ',
    'bento.subtitle': 'निवडणूक प्रक्रिया समजून घेण्यासाठी आमच्या मॉड्यूल्सचा वापर करा.',
    'bento.ai.title': 'AI निवडणूक सहाय्यक',
    'bento.ai.desc': 'फॉर्म 6 किंवा एमसीसी बद्दल प्रश्न आहेत? आमच्या एआयला अनेक भारतीय भाषांमध्ये विचारा आणि अचूक उत्तरे मिळवा.',
    'bento.ai.chat1': 'माझे नाव मतदार यादीत आहे की नाही हे मी कसे तपासू?',
    'bento.ai.chat2': 'तुम्ही NVSP पोर्टलला भेट देऊ शकता किंवा वोटर हेल्पलाइन ॲप डाउनलोड करू शकता.',
    'bento.evm.title': '3D EVM सिम्युलेशन',
    'bento.evm.desc': 'मतदान केंद्राचा अनुभव घ्या. निळे बटण दाबा, लाल एलईडी पहा आणि VVPAT स्लिप पडताना पहा.',
    'bento.journey.title': 'परस्परसंवादी प्रवास',
    'bento.journey.desc': 'पात्रतेपासून मतदानाच्या दिवसापर्यंत 6 टप्प्यांचे अनुसरण करा. तुमची प्रगती ट्रॅक करा.',
    'bento.resources.tag': 'ज्ञान केंद्र',
    'bento.resources.title': 'व्यापक निवडणूक ग्रंथालय',
    'bento.resources.desc': 'लोकसभा आणि विधानसभा यातील फरक समजून घ्या. निवडणूक आयोग आणि तुमच्या मूलभूत अधिकारांबद्दल वाचा.',
    'cinematic.title1': 'महान',
    'cinematic.title2': 'भारतीय',
    'cinematic.title3': 'निवडणूक',
    'cinematic.scroll': 'अनुभव घेण्यासाठी खाली स्क्रोल करा',
    'cinematic.booth': 'बूथचा अनुभव घ्या',
    'cinematic.booth.desc': 'तुम्ही मतदानाच्या दिवशी पोहोचला आहात. भारतीय ईव्हीएम तयार आहे. तुमचे मत देण्यासाठी निळे बटण दाबा.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('EN');

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
