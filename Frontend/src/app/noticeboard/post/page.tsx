'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select } from "../components/ui/select";
import { ArrowLeft, Send, User, MessageSquare, MapPin } from "lucide-react";
import { noticeService } from "../services/noticeService";
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

  const regions = noticeService.getRegions().filter(region => region !== "All Regions");

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
              Post to Bazaar
            </h1>
            <p className="text-base text-orange-600 font-medium">Share your needs, offers, or announcements</p>
          </div>
        </div>
        {/* Form Card */}
        <Card className="shadow-xl border border-orange-200 bg-white rounded-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-xl text-orange-700 font-bold">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              Create Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-black">
                  <User className="h-4 w-4 text-orange-500" />
                  Your Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
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
                  Region
                </Label>
                <Select
                  id="region"
                  value={formData.region}
                  onChange={e => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  className={`h-12 border-orange-200 focus:ring-2 focus:ring-orange-400 text-black bg-orange-50 ${errors.region ? 'border-2 border-orange-500' : ''}`}
                >
                  <option value="" disabled>Select your region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </Select>
                {errors.region && <p className="text-orange-600 text-xs font-semibold mt-1">{errors.region}</p>}
              </div>
              {/* Address Field (optional) */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2 text-sm font-semibold text-black">
                  Address (optional)
                </Label>
                <Input
                  id="address"
                  placeholder="Enter address (optional)"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="h-12 border-orange-200 focus:ring-2 focus:ring-orange-400 text-black placeholder:text-orange-300 bg-orange-50"
                />
              </div>
              {/* City Field */}
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2 text-sm font-semibold text-black">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="Enter city"
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
                  Contact Info
                </Label>
                <Input
                  id="contact"
                  placeholder="Enter phone, email, or other contact info"
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
                  <MessageSquare className="h-4 w-4 text-orange-500" />
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Describe your need, offer, or announcement. Be specific about what you're looking for or offering..."
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
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2 text-white" />
                    Post to Bazaar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Tips */}
        <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h3 className="font-semibold text-orange-700 mb-2">💡 Tips for better notices:</h3>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Be specific about quantities, timelines, and requirements</li>
            <li>• Include contact preferences in your message</li>
            <li>• Mention if you're flexible on pricing or terms</li>
            <li>• Use clear, simple language that everyone can understand</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post; 