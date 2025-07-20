import { Notice, Region } from '../types/notice';

// Mock data for demonstration
const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
const mockNotices: Notice[] = [
  {
    id: '1',
    name: 'Ravi Kumar',
    message: 'Looking for high-quality cotton thread for weaving. Need 50kg for upcoming festival orders. Will pay good price!',
    region: 'Tamil Nadu',
    address: '123 Main St, Near Temple',
    city: 'Chennai',
    contact: '9876543210',
    createdAt: fourHoursAgo
  },
  {
    id: '2',
    name: 'Meera Devi',
    message: 'Need 2 helpers for Pongal fair preparation. Pottery and craft arrangement work. Daily wages provided.',
    region: 'Tamil Nadu',
    address: '',
    city: 'Madurai',
    contact: 'meera@example.com',
    createdAt: fourHoursAgo
  },
  {
    id: '3',
    name: 'Arjun Reddy',
    message: 'Selling handmade terracotta pots and lamps. Special designs for Diwali. Contact for bulk orders.',
    region: 'Andhra Pradesh',
    address: 'Bazaar Road',
    city: 'Vijayawada',
    contact: 'arjunreddy@bazaar.com',
    createdAt: fourHoursAgo
  },
  {
    id: '4',
    name: 'Lakshmi Nair',
    message: 'Looking for coconut coir for basket weaving. Need sustainable supplier for regular orders.',
    region: 'Kerala',
    address: '',
    city: 'Kochi',
    contact: 'lakshmi.nair@crafts.in',
    createdAt: fourHoursAgo
  },
  {
    id: '5',
    name: 'Vikram Singh',
    message: 'Teaching traditional block printing techniques. Weekend workshop available. All materials provided.',
    region: 'Karnataka',
    address: 'Block 5, Artisans Colony',
    city: 'Bangalore',
    contact: 'vikram@printwork.com',
    createdAt: fourHoursAgo
  },
  {
    id: '6',
    name: 'Priya Sharma',
    message: 'Need brass items for jewelry making. Looking for local suppliers with good quality metal work.',
    region: 'Maharashtra',
    address: '',
    city: 'Pune',
    contact: 'priya.sharma@jewels.com',
    createdAt: fourHoursAgo
  }
];

class NoticeService {
  private notices: Notice[] = [...mockNotices];

  getAllNotices(region?: string): Notice[] {
    if (!region || region === 'All Regions') {
      return [...this.notices].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return this.notices
      .filter(notice => notice.region === region)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  addNotice(noticeData: Omit<Notice, 'id' | 'createdAt'>): Notice {
    const newNotice: Notice = {
      ...noticeData,
      id: Date.now().toString(),
      createdAt: new Date(),
      address: noticeData.address || '',
      city: noticeData.city,
      contact: noticeData.contact
    };
    this.notices.unshift(newNotice);
    return newNotice;
  }

  getRegions(): Region[] {
    return [
      "All Regions",
      "Tamil Nadu",
      "Karnataka",
      "Kerala",
      "Andhra Pradesh",
      "Telangana",
      "Maharashtra"
    ];
  }
}

export const noticeService = new NoticeService();