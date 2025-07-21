import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { User, MapPin, Clock } from "lucide-react";
import type { Notice } from "../types/notice";
import { formatDistanceToNow } from 'date-fns';

interface NoticeCardProps {
  notice: Notice;
  language?: string;
}

const translations: { [key: string]: { [key: string]: string } } = {
  en: { address: "Address", city: "City", contact: "Contact" },
  hi: { address: "पता", city: "शहर", contact: "संपर्क" },
  ta: { address: "முகவரி", city: "நகரம்", contact: "தொடர்பு" }
};

function mockTranslate(text: string, lang: string) {
  if (lang === 'en') return text;
  if (!text) return text;
  return `[${lang.toUpperCase()}] ${text}`;
}

// Hard-coded translations for demo (by notice name+message or id if available)
const noticeTranslations: {
  [lang: string]: {
    [key: string]: { name: string; message: string }
  }
} = {
  hi: {
    'Ravi Kumar|Looking for high-quality cotton thread for weaving. Need 50kg for upcoming festival orders. Will pay good price!': {
      name: 'रवि कुमार',
      message: 'बुनाई के लिए उच्च गुणवत्ता वाले सूती धागे की तलाश है। आगामी त्योहार के ऑर्डर के लिए 50 किलोग्राम चाहिए। अच्छा मूल्य दूंगा!'
    },
    'Meera Devi|Need 2 helpers for Pongal fair preparation. Pottery and craft arrangement work. Daily wages provided.': {
      name: 'मीरा देवी',
      message: 'पोंगल मेले की तैयारी के लिए 2 सहायकों की आवश्यकता है। मिट्टी के बर्तन और शिल्प व्यवस्था का कार्य। दैनिक वेतन मिलेगा।'
    },
    'Arjun Reddy|Selling handmade terracotta pots and lamps. Special designs for Diwali. Contact for bulk orders.': {
      name: 'अर्जुन रेड्डी',
      message: 'हाथ से बने टेराकोटा बर्तन और दीये बेच रहे हैं। दिवाली के लिए विशेष डिज़ाइन। थोक ऑर्डर के लिए संपर्क करें।'
    },
    'Lakshmi Nair|Looking for coconut coir for basket weaving. Need sustainable supplier for regular orders.': {
      name: 'लक्ष्मी नायर',
      message: 'टोकरी बुनाई के लिए नारियल की रस्सी चाहिए। नियमित ऑर्डर के लिए स्थायी आपूर्तिकर्ता चाहिए।'
    },
    'Vikram Singh|Teaching traditional block printing techniques. Weekend workshop available. All materials provided.': {
      name: 'विक्रम सिंह',
      message: 'पारंपरिक ब्लॉक प्रिंटिंग तकनीक सिखा रहे हैं। सप्ताहांत कार्यशाला उपलब्ध है। सभी सामग्री प्रदान की जाएगी।'
    },
    'Priya Sharma|Need brass items for jewelry making. Looking for local suppliers with good quality metal work.': {
      name: 'प्रिया शर्मा',
      message: 'आभूषण बनाने के लिए पीतल की वस्तुएं चाहिए। अच्छी गुणवत्ता वाले धातु कार्य के लिए स्थानीय आपूर्तिकर्ता चाहिए।'
    }
  },
  ta: {
    'Ravi Kumar|Looking for high-quality cotton thread for weaving. Need 50kg for upcoming festival orders. Will pay good price!': {
      name: 'ரவிகுமார்',
      message: 'நெய்வதற்காக உயர்தர பருத்தி நூல் தேவை. வரவிருக்கும் திருவிழா ஆர்டர்களுக்காக 50 கிலோ தேவை. நல்ல விலை வழங்கப்படும்!'
    },
    'Meera Devi|Need 2 helpers for Pongal fair preparation. Pottery and craft arrangement work. Daily wages provided.': {
      name: 'மீரா தேவி',
      message: 'பொங்கல் திருவிழா தயாரிப்புக்கு 2 உதவியாளர்கள் தேவை. மண் பானை மற்றும் கைவினை ஏற்பாடு வேலை. தினசரி ஊதியம் வழங்கப்படும்.'
    },
    'Arjun Reddy|Selling handmade terracotta pots and lamps. Special designs for Diwali. Contact for bulk orders.': {
      name: 'அர்ஜுன் ரெட்டி',
      message: 'கைமடக்கப்பட்ட டெர்ரகோட்டா பானைகள் மற்றும் விளக்குகள் விற்பனை. தீபாவளிக்காக சிறப்பு வடிவங்கள். மொத்த ஆர்டர்களுக்கு தொடர்பு கொள்ளவும்.'
    },
    'Lakshmi Nair|Looking for coconut coir for basket weaving. Need sustainable supplier for regular orders.': {
      name: 'லட்சுமி நாயர்',
      message: 'கூடை நெய்வதற்காக தேங்காய் நார் தேவை. தொடர்ச்சியான ஆர்டர்களுக்காக நிலையான வழங்குநர் தேவை.'
    },
    'Vikram Singh|Teaching traditional block printing techniques. Weekend workshop available. All materials provided.': {
      name: 'விக்ரம் சிங்',
      message: 'பாரம்பரிய பிளாக் பிரிண்டிங் நுட்பங்களை கற்றுத்தருகிறேன். வார இறுதி பணிமனை கிடைக்கும். அனைத்து பொருட்களும் வழங்கப்படும்.'
    },
    'Priya Sharma|Need brass items for jewelry making. Looking for local suppliers with good quality metal work.': {
      name: 'ப்ரியா சர்மா',
      message: 'நகை தயாரிப்புக்கு பித்தளை பொருட்கள் தேவை. நல்ல தரமான உலோக வேலைக்காக உள்ளூர் வழங்குநர்கள் தேவை.'
    }
  }
};

export const NoticeCard = ({ notice, language = "en" }: NoticeCardProps) => {
  // Always show relative time (e.g., '3 hours ago', '10 days ago', 'in 2 months')
  const createdAt = new Date(notice.createdAt);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500 bg-gradient-to-br from-orange-50 via-yellow-50 to-white text-black rounded-2xl" style={{ color: '#000', opacity: 1 }}>
      <CardHeader className="pb-3 text-black" style={{ color: '#000', opacity: 1 }}>
        <div className="flex items-start justify-between gap-2 text-black" style={{ color: '#000', opacity: 1 }}>
          <div className="flex items-center gap-2 flex-1 text-black" style={{ color: '#000', opacity: 1 }}>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <User className="h-4 w-4 text-orange-500" />
            </div>
            <h3 className="font-bold text-lg text-orange-600 truncate" style={{ color: '#ea580c', opacity: 1 }}>
              {noticeTranslations[language]?.[`${notice.name}|${notice.message}`]?.name || notice.name}
            </h3>
          </div>
          <Badge variant="secondary" className="shrink-0 bg-orange-100 text-orange-700 border-orange-200 font-semibold" style={{ color: '#ea580c', opacity: 1 }}>
            <MapPin className="h-3 w-3 mr-1 text-orange-500" />
            {notice.region}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 text-black" style={{ color: '#000', opacity: 1 }}>
        <p className="text-base text-black mb-3" style={{ color: '#000', opacity: 1 }}>
          {noticeTranslations[language]?.[`${notice.name}|${notice.message}`]?.message || notice.message}
        </p>
        {notice.address && (
          <p className="text-sm text-black mb-1" style={{ color: '#000', opacity: 1 }}><span className="text-orange-600 font-semibold">{translations[language]?.address || translations.en.address}:</span> {notice.address}</p>
        )}
        <p className="text-sm text-black mb-1" style={{ color: '#000', opacity: 1 }}><span className="text-orange-600 font-semibold">{translations[language]?.city || translations.en.city}:</span> {notice.city}</p>
        <p className="text-sm text-black mb-3" style={{ color: '#000', opacity: 1 }}><span className="text-orange-600 font-semibold">{translations[language]?.contact || translations.en.contact}:</span> {notice.contact}</p>
        <div className="flex items-center gap-1 text-xs text-orange-500 font-semibold" style={{ color: '#ea580c', opacity: 1 }}>
          <Clock className="h-3 w-3 text-orange-400" />
          {timeAgo}
        </div>
      </CardContent>
    </Card>
  );
};