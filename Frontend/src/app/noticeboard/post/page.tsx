'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select } from "../components/ui/select";
import { ArrowLeft, Send, User, MessageSquare, MapPin, Mic } from "lucide-react";
import { noticeService } from "../services/noticeService";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";

const translations: { [key: string]: { [key: string]: string } } = {
  en: {
    postToBazaar: "Post to Bazaar",
    share: "Share your needs, offers, or announcements",
    createNotice: "Create Notice",
    yourName: "Your Name",
    region: "Region",
    address: "Address (optional)",
    city: "City",
    contact: "Contact Info",
    yourMessage: "Your Message",
    post: "Post to Bazaar",
    posting: "Posting...",
    tips: "💡 Tips for better notices:",
    tip1: "• Be specific about quantities, timelines, and requirements",
    tip2: "• Include contact preferences in your message",
    tip3: "• Mention if you're flexible on pricing or terms",
    tip4: "• Use clear, simple language that everyone can understand"
  },
  hi: {
    postToBazaar: "बाज़ार में पोस्ट करें",
    share: "अपनी ज़रूरतें, ऑफ़र या घोषणाएँ साझा करें",
    createNotice: "नोटिस बनाएँ",
    yourName: "आपका नाम",
    region: "क्षेत्र",
    address: "पता (वैकल्पिक)",
    city: "शहर",
    contact: "संपर्क जानकारी",
    yourMessage: "आपका संदेश",
    post: "बाज़ार में पोस्ट करें",
    posting: "पोस्ट हो रहा है...",
    tips: "💡 बेहतर नोटिस के लिए सुझाव:",
    tip1: "• मात्रा, समयसीमा और आवश्यकताओं के बारे में स्पष्ट रहें",
    tip2: "• अपने संदेश में संपर्क वरीयताएँ शामिल करें",
    tip3: "• यदि आप मूल्य या शर्तों पर लचीले हैं तो उल्लेख करें",
    tip4: "• स्पष्ट, सरल भाषा का उपयोग करें जिसे हर कोई समझ सके"
  },
  ta: {
    postToBazaar: "பஜாரில் இடுக",
    share: "உங்கள் தேவைகள், சலுகைகள் அல்லது அறிவிப்புகளை பகிர்க",
    createNotice: "அறிவிப்பு உருவாக்குக",
    yourName: "உங்கள் பெயர்",
    region: "பகுதி",
    address: "முகவரி (விரும்பினால்)",
    city: "நகரம்",
    contact: "தொடர்பு தகவல்",
    yourMessage: "உங்கள் செய்தி",
    post: "பஜாரில் இடுக",
    posting: "இடுகிறது...",
    tips: "💡 சிறந்த அறிவிப்புகளுக்கான குறிப்புகள்:",
    tip1: "• அளவு, காலவரையறை மற்றும் தேவைகள் குறித்து தெளிவாக இருங்கள்",
    tip2: "• உங்கள் செய்தியில் தொடர்பு விருப்பங்களை சேர்க்கவும்",
    tip3: "• நீங்கள் விலையிலும் விதிகளிலும் நெகிழ்வாக இருந்தால் குறிப்பிடவும்",
    tip4: "• அனைவரும் புரிந்துகொள்ளும் தெளிவான, எளிய மொழியை பயன்படுத்தவும்"
  }
};

// import { useToast } from "../hooks/use-toast"; // Uncomment if you have a toast hook

const Post = () => {
  const router = useRouter();
  // const { toast } = useToast(); // Uncomment if you have a toast hook
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    region: "",
    address: "",
    city: "",
    contact: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    region: '',
    city: '',
    contact: '',
    message: ''
  });
  const [isListening, setIsListening] = useState<{ [key: string]: boolean }>({});
  const recognitionRef = useRef<any>(null);

  const regions = noticeService.getRegions().filter(region => region !== "All Regions");

  // Map app language to Web Speech API language code
  const langMap: { [key: string]: string } = { en: "en-IN", hi: "hi-IN", ta: "ta-IN" };

  // Voice input handler
  const handleVoiceInput = (field: string) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = langMap[language] || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening((prev) => ({ ...prev, [field]: true }));
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData((prev) => ({ ...prev, [field]: transcript }));
      setIsListening((prev) => ({ ...prev, [field]: false }));
    };
    recognition.onerror = () => {
      setIsListening((prev) => ({ ...prev, [field]: false }));
    };
    recognition.onend = () => {
      setIsListening((prev) => ({ ...prev, [field]: false }));
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const validate = () => {
    const newErrors: typeof errors = { name: '', region: '', city: '', contact: '', message: '' };
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters.';
    if (!formData.region) newErrors.region = 'Region is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required.';
    else if (formData.contact.trim().length !== 10) newErrors.contact = 'Contact must be exactly 10 characters.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters.';
    else if (formData.message.length > 500) newErrors.message = 'Message cannot exceed 500 characters.';
    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      noticeService.addNotice({
        name: formData.name.trim(),
        message: formData.message.trim(),
        region: formData.region,
        address: formData.address.trim(),
        city: formData.city.trim(),
        contact: formData.contact.trim()
      });
      // Uncomment if you have a toast hook
      // toast({
      //   title: "Notice Posted!",
      //   description: "Your notice has been posted to the bazaar board.",
      // });
      setFormData({ name: "", message: "", region: "", address: "", city: "", contact: "" });
      setTimeout(() => {
        router.push("/noticeboard");
      }, 1000);
    } catch (error) {
      // Uncomment if you have a toast hook
      // toast({
      //   title: "Error",
      //   description: "Failed to post notice. Please try again.",
      //   variant: "destructive"
      // });
      alert("Failed to post notice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchParams = useSearchParams();
  const language = searchParams.get("lang") || "en";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white flex flex-col items-center justify-center py-8">
      {/* Artisan Icon Branding */}
      <div className="mb-6 flex justify-center">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 flex items-center justify-center shadow-lg">
          {/* Simple artisan basket icon */}
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="16" cy="24" rx="12" ry="5" fill="#fb923c" />
            <path d="M8 24c0-6 4-12 8-12s8 6 8 12" stroke="#f59e42" strokeWidth="2" fill="none" />
            <path d="M12 24c0-4 2-8 4-8s4 4 4 8" stroke="#f59e42" strokeWidth="2" fill="none" />
            <circle cx="16" cy="12" r="2" fill="#f59e42" />
          </svg>
        </div>
      </div>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push("/noticeboard")}
            className="shrink-0 border-orange-300 text-orange-600 hover:bg-orange-100 focus:ring-2 focus:ring-orange-400"
          >
            <ArrowLeft className="h-4 w-4 text-orange-500" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent tracking-tight">
              {translations[language].postToBazaar}
            </h1>
            <p className="text-base text-orange-600 font-medium">{translations[language].share}</p>
          </div>
        </div>
        {/* Form Card */}
        <Card className="shadow-xl border border-orange-200 bg-white rounded-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-xl text-orange-700 font-bold">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              {translations[language].createNotice}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-black">
                  <User className="h-4 w-4 text-orange-500" />
                  {translations[language].yourName}
                 <button type="button" onClick={() => handleVoiceInput('name')} className={`ml-2 p-1 rounded-full border ${isListening['name'] ? 'bg-orange-200 animate-pulse' : 'bg-white'} focus:outline-none`} aria-label="Speak Name">
                   <Mic className={`h-4 w-4 ${isListening['name'] ? 'text-orange-600' : 'text-orange-400'}`} />
                 </button>
                </Label>
                <Input
                  id="name"
                  placeholder={translations[language].yourName}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`h-12 border-orange-200 focus:ring-2 focus:ring-orange-400 text-black placeholder:text-orange-300 bg-orange-50 ${errors.name ? 'border-2 border-orange-500' : ''}`}
                />
                {errors.name && <p className="text-orange-600 text-xs font-semibold mt-1">{errors.name}</p>}
              </div>
              {/* Region Field */}
              <div className="space-y-2">
                <Label htmlFor="region" className="flex items-center gap-2 text-sm font-semibold text-black">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  {translations[language].region}
                 <button type="button" onClick={() => handleVoiceInput('region')} className={`ml-2 p-1 rounded-full border ${isListening['region'] ? 'bg-orange-200 animate-pulse' : 'bg-white'} focus:outline-none`} aria-label="Speak Region">
                   <Mic className={`h-4 w-4 ${isListening['region'] ? 'text-orange-600' : 'text-orange-400'}`} />
                 </button>
                </Label>
                <Select
                  id="region"
                  value={formData.region}
                  onChange={e => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  className={`h-12 border-orange-200 focus:ring-2 focus:ring-orange-400 text-black bg-orange-50 ${errors.region ? 'border-2 border-orange-500' : ''}`}
                >
                  <option value="" disabled>{translations[language].region}</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </Select>
                {errors.region && <p className="text-orange-600 text-xs font-semibold mt-1">{errors.region}</p>}
              </div>
              {/* Address Field (optional) */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2 text-sm font-semibold text-black">
                  {translations[language].address}
                 <button type="button" onClick={() => handleVoiceInput('address')} className={`ml-2 p-1 rounded-full border ${isListening['address'] ? 'bg-orange-200 animate-pulse' : 'bg-white'} focus:outline-none`} aria-label="Speak Address">
                   <Mic className={`h-4 w-4 ${isListening['address'] ? 'text-orange-600' : 'text-orange-400'}`} />
                 </button>
                </Label>
                <Input
                  id="address"
                  placeholder={translations[language].address}
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="h-12 border-orange-200 focus:ring-2 focus:ring-orange-400 text-black placeholder:text-orange-300 bg-orange-50"
                />
              </div>
              {/* City Field */}
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2 text-sm font-semibold text-black">
                  {translations[language].city}
                 <button type="button" onClick={() => handleVoiceInput('city')} className={`ml-2 p-1 rounded-full border ${isListening['city'] ? 'bg-orange-200 animate-pulse' : 'bg-white'} focus:outline-none`} aria-label="Speak City">
                   <Mic className={`h-4 w-4 ${isListening['city'] ? 'text-orange-600' : 'text-orange-400'}`} />
                 </button>
                </Label>
                <Input
                  id="city"
                  placeholder={translations[language].city}
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className={`h-12 border-orange-200 focus:ring-2 focus:ring-orange-400 text-black placeholder:text-orange-300 bg-orange-50 ${errors.city ? 'border-2 border-orange-500' : ''}`}
                  required
                />
                {errors.city && <p className="text-orange-600 text-xs font-semibold mt-1">{errors.city}</p>}
              </div>
              {/* Contact Field */}
              <div className="space-y-2">
                <Label htmlFor="contact" className="flex items-center gap-2 text-sm font-semibold text-black">
                  {translations[language].contact}
                </Label>
                <Input
                  id="contact"
                  placeholder={translations[language].contact}
                  value={formData.contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                  className={`h-12 border-orange-200 focus:ring-2 focus:ring-orange-400 text-black placeholder:text-orange-300 bg-orange-50 ${errors.contact ? 'border-2 border-orange-500' : ''}`}
                  required
                />
                {errors.contact && <p className="text-orange-600 text-xs font-semibold mt-1">{errors.contact}</p>}
              </div>
              {/* Message Field */}
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-black">
                  <MessageSquare className="h-5 w-5 text-orange-500" />
                  {translations[language].yourMessage}
                 <button type="button" onClick={() => handleVoiceInput('message')} className={`ml-2 p-1 rounded-full border ${isListening['message'] ? 'bg-orange-200 animate-pulse' : 'bg-white'} focus:outline-none`} aria-label="Speak Message">
                   <Mic className={`h-4 w-4 ${isListening['message'] ? 'text-orange-600' : 'text-orange-400'}`} />
                 </button>
                </Label>
                <Textarea
                  id="message"
                  placeholder={translations[language].yourMessage}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className={`min-h-32 resize-none border-orange-200 focus:ring-2 focus:ring-orange-400 text-black placeholder:text-orange-300 bg-orange-50 ${errors.message ? 'border-2 border-orange-500' : ''}`}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-orange-500">
                    {formData.message.length}/500 characters
                  </p>
                  {errors.message && <p className="text-orange-600 text-xs font-semibold mt-1 text-right">{errors.message}</p>}
                </div>
              </div>
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-bold shadow-lg rounded-lg transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    {translations[language].posting}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2 text-white" />
                    {translations[language].post}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Tips */}
        <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h3 className="font-semibold text-orange-700 mb-2">{translations[language].tips}</h3>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>{translations[language].tip1}</li>
            <li>{translations[language].tip2}</li>
            <li>{translations[language].tip3}</li>
            <li>{translations[language].tip4}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post; 