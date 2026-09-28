import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  AnalysisResult,
  SavedOutfit,
  CompleteLook,
  MakeupItem,
  HairstyleItem,
  OutfitItem,
  OccasionItem,
  FestivalItem,
  AdminLog,
} from '../types/style';
import {
  INITIAL_USERS,
  INITIAL_MAKEUP_ITEMS,
  INITIAL_HAIRSTYLES,
  INITIAL_OUTFITS,
  INITIAL_OCCASIONS,
  INITIAL_FESTIVALS,
  INITIAL_ADMIN_LOGS,
  DEFAULT_ADMIN_PASSCODE,
} from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAdminUnlocked: boolean;
  adminPasscode: string;
  allUsers: UserProfile[];
  latestAnalysis: AnalysisResult | null;
  savedOutfits: SavedOutfit[];
  makeupList: MakeupItem[];
  hairstyleList: HairstyleItem[];
  outfitList: OutfitItem[];
  occasionList: OccasionItem[];
  festivalList: FestivalItem[];
  adminLogs: AdminLog[];
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  unlockAdminWithPasscode: (passcode: string) => { success: boolean; error?: string };
  lockAdmin: () => void;
  updateAdminPasscode: (currentPass: string, newPass: string) => { success: boolean; error?: string };
  updateUserPassword: (userId: string, newPass: string) => { success: boolean; error?: string };
  switchDemoUser: (role: 'user' | 'admin' | 'guest') => void;
  saveOutfit: (look: CompleteLook, occasion?: string, notes?: string) => boolean;
  removeSavedOutfit: (id: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  deleteAccount: () => void;
  deleteUploadedPhoto: () => void;
  setLatestAnalysis: (analysis: AnalysisResult | null) => void;
  // Admin handlers
  toggleUserStatus: (userId: string) => void;
  addMakeupItem: (item: Omit<MakeupItem, 'id'>) => void;
  updateMakeupItem: (id: string, item: Partial<MakeupItem>) => void;
  deleteMakeupItem: (id: string) => void;
  addHairstyleItem: (item: Omit<HairstyleItem, 'id'>) => void;
  updateHairstyleItem: (id: string, item: Partial<HairstyleItem>) => void;
  deleteHairstyleItem: (id: string) => void;
  addOutfitItem: (item: Omit<OutfitItem, 'id'>) => void;
  updateOutfitItem: (id: string, item: Partial<OutfitItem>) => void;
  deleteOutfitItem: (id: string) => void;
  addOccasionItem: (item: Omit<OccasionItem, 'id'>) => void;
  updateOccasionItem: (id: string, item: Partial<OccasionItem>) => void;
  deleteOccasionItem: (id: string) => void;
  addFestivalItem: (item: Omit<FestivalItem, 'id'>) => void;
  updateFestivalItem: (id: string, item: Partial<FestivalItem>) => void;
  deleteFestivalItem: (id: string) => void;
  addAdminLog: (action: string, category: AdminLog['category'], details: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load users or initialize
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('stylematch_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Current logged in user (Default to Sarah as general user for delightful immediate experience)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('stylematch_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0]; // Logged in as Sarah by default
  });

  // Latest AI analysis state
  const [latestAnalysis, setLatestAnalysisState] = useState<AnalysisResult | null>(() => {
    const saved = localStorage.getItem('stylematch_latest_analysis');
    return saved ? JSON.parse(saved) : null;
  });

  // Dataset states for Admin management & app data
  const [makeupList, setMakeupList] = useState<MakeupItem[]>(() => {
    const saved = localStorage.getItem('stylematch_makeup');
    return saved ? JSON.parse(saved) : INITIAL_MAKEUP_ITEMS;
  });

  const [hairstyleList, setHairstyleList] = useState<HairstyleItem[]>(() => {
    const saved = localStorage.getItem('stylematch_hairstyles');
    return saved ? JSON.parse(saved) : INITIAL_HAIRSTYLES;
  });

  const [outfitList, setOutfitList] = useState<OutfitItem[]>(() => {
    const saved = localStorage.getItem('stylematch_outfits');
    return saved ? JSON.parse(saved) : INITIAL_OUTFITS;
  });

  const [occasionList, setOccasionList] = useState<OccasionItem[]>(() => {
    const saved = localStorage.getItem('stylematch_occasions');
    return saved ? JSON.parse(saved) : INITIAL_OCCASIONS;
  });

  const [festivalList, setFestivalList] = useState<FestivalItem[]>(() => {
    const saved = localStorage.getItem('stylematch_festivals');
    return saved ? JSON.parse(saved) : INITIAL_FESTIVALS;
  });

  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(() => {
    const saved = localStorage.getItem('stylematch_admin_logs');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_LOGS;
  });

  // Master Backoffice Passcode state
  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    const saved = localStorage.getItem('stylematch_admin_passcode');
    return saved || DEFAULT_ADMIN_PASSCODE;
  });

  // Admin unlocked state for backoffice access
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    const saved = localStorage.getItem('stylematch_admin_unlocked');
    return saved === 'true';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('stylematch_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('stylematch_admin_passcode', adminPasscode);
  }, [adminPasscode]);

  useEffect(() => {
    localStorage.setItem('stylematch_admin_unlocked', isAdminUnlocked ? 'true' : 'false');
  }, [isAdminUnlocked]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('stylematch_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('stylematch_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (latestAnalysis) {
      localStorage.setItem('stylematch_latest_analysis', JSON.stringify(latestAnalysis));
    } else {
      localStorage.removeItem('stylematch_latest_analysis');
    }
  }, [latestAnalysis]);

  useEffect(() => {
    localStorage.setItem('stylematch_makeup', JSON.stringify(makeupList));
  }, [makeupList]);

  useEffect(() => {
    localStorage.setItem('stylematch_hairstyles', JSON.stringify(hairstyleList));
  }, [hairstyleList]);

  useEffect(() => {
    localStorage.setItem('stylematch_outfits', JSON.stringify(outfitList));
  }, [outfitList]);

  useEffect(() => {
    localStorage.setItem('stylematch_occasions', JSON.stringify(occasionList));
  }, [occasionList]);

  useEffect(() => {
    localStorage.setItem('stylematch_festivals', JSON.stringify(festivalList));
  }, [festivalList]);

  useEffect(() => {
    localStorage.setItem('stylematch_admin_logs', JSON.stringify(adminLogs));
  }, [adminLogs]);

  // Auth methods
  const login = (email: string, password?: string) => {
    const trimmed = email.trim().toLowerCase();
    const found = allUsers.find((u) => u.email.toLowerCase() === trimmed);
    if (!found) {
      return { success: false, error: 'ไม่พบบัญชีผู้ใช้งานที่มีอีเมลนี้ในระบบ' };
    }
    if (found.status === 'disabled') {
      return { success: false, error: 'บัญชีนี้ถูกระงับการใช้งานชั่วคราว กรุณาติดต่อผู้ดูแลระบบ' };
    }
    if (!password || password.trim() === '') {
      return { success: false, error: 'กรุณากรอกรหัสผ่านเพื่อเข้าสู่ระบบ' };
    }
    // Verify password if set on user, or fallback to default credentials
    const expectedPassword = found.password || (found.role === 'admin' ? 'admin1234' : 'user1234');
    if (password !== expectedPassword) {
      return { success: false, error: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านอีกครั้ง' };
    }

    const updated = {
      ...found,
      lastActive: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setCurrentUser(updated);
    if (found.role === 'admin') {
      setIsAdminUnlocked(true);
    }
    setAllUsers((prev) => prev.map((u) => (u.id === found.id ? updated : u)));
    addAdminLog(`ผู้ใช้เข้าสู่ระบบ: ${found.name}`, 'User', `Email: ${found.email} (${found.role})`);
    return { success: true };
  };

  const register = (name: string, email: string, password?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (allUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'อีเมลนี้ถูกลงทะเบียนไว้ในระบบแล้ว' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' };
    }
    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      email: trimmedEmail,
      password: password,
      role: 'user',
      status: 'active',
      registeredDate: new Date().toISOString().slice(0, 10),
      lastActive: new Date().toISOString().replace('T', ' ').slice(0, 16),
      favoriteStyles: ['Casual', 'Korean'],
      favoriteColors: ['#FAF5F0', '#3B82F6'],
      savedOutfits: [],
    };
    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    addAdminLog(`ผู้ใช้ใหม่ลงทะเบียน: ${newUser.name}`, 'User', `Email: ${newUser.email}`);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdminUnlocked(false);
  };

  const unlockAdminWithPasscode = (passcode: string): { success: boolean; error?: string } => {
    const trimmed = passcode.trim();
    if (!trimmed) {
      return { success: false, error: 'กรุณากรอกรหัสผ่านระบบหลังบ้าน' };
    }
    if (trimmed !== adminPasscode.trim()) {
      addAdminLog('พยายามปลดล็อคระบบหลังบ้านไม่สำเร็จ (รหัสผิด)', 'Security', `รหัสที่ป้อน: ${passcode.replace(/./g, '*')}`);
      return { success: false, error: 'รหัสผ่านระบบหลังบ้านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' };
    }

    // Success! Unlock admin session
    setIsAdminUnlocked(true);
    // If not currently logged in as admin, switch/elevate to Panu (Admin)
    if (!currentUser || currentUser.role !== 'admin') {
      const admin = allUsers.find((u) => u.role === 'admin') || INITIAL_USERS[1];
      setCurrentUser(admin);
    }
    addAdminLog('ปลดล็อคระบบหลังบ้านด้วย Master Passcode สำเร็จ', 'Security', 'เข้าถึงระบบบริหารจัดการ StyleMatch AI');
    return { success: true };
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    addAdminLog('ล็อคระบบหลังบ้านแล้ว', 'Security', 'ปิดการเชื่อมต่อเซสชันแอดมิน');
  };

  const updateAdminPasscode = (currentPass: string, newPass: string): { success: boolean; error?: string } => {
    if (currentPass.trim() !== adminPasscode.trim()) {
      return { success: false, error: 'รหัสผ่านหลังบ้านเดิมไม่ถูกต้อง' };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, error: 'รหัสผ่านหลังบ้านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร' };
    }
    const cleanNewPass = newPass.trim();
    setAdminPasscode(cleanNewPass);
    addAdminLog('เปลี่ยนรหัสผ่าน Master Passcode ระบบหลังบ้าน', 'Security', 'อัปเดตรหัสความปลอดภัยสำเร็จ');
    return { success: true };
  };

  const updateUserPassword = (userId: string, newPass: string): { success: boolean; error?: string } => {
    if (!newPass || newPass.trim().length < 6) {
      return { success: false, error: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' };
    }
    const cleanPass = newPass.trim();
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: cleanPass } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, password: cleanPass });
    }
    addAdminLog(`เปลี่ยนรหัสผ่านบัญชี: ID ${userId}`, 'Security', 'เปลี่ยนรหัสผ่านสำเร็จ');
    return { success: true };
  };

  const switchDemoUser = (role: 'user' | 'admin' | 'guest') => {
    if (role === 'guest') {
      setCurrentUser(null);
      setIsAdminUnlocked(false);
    } else if (role === 'admin') {
      const admin = allUsers.find((u) => u.role === 'admin') || INITIAL_USERS[1];
      setCurrentUser(admin);
      setIsAdminUnlocked(true);
    } else {
      const user = allUsers.find((u) => u.role === 'user') || INITIAL_USERS[0];
      setCurrentUser(user);
      setIsAdminUnlocked(false);
    }
  };

  const setLatestAnalysis = (analysis: AnalysisResult | null) => {
    setLatestAnalysisState(analysis);
    if (analysis && currentUser) {
      // Sync skin tone and face shape to user profile if not set
      const updatedUser: UserProfile = {
        ...currentUser,
        skinTone: analysis.skinTone,
        faceShape: analysis.faceShape,
        bodyProportion: analysis.bodyProportion,
      };
      setCurrentUser(updatedUser);
      setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }
  };

  const saveOutfit = (look: CompleteLook, occasion?: string, notes?: string): boolean => {
    if (!currentUser) return false;
    const newSave: SavedOutfit = {
      id: 'save-' + Date.now(),
      title: look.lookTitle,
      occasion: occasion || look.concept || 'ชุดสำหรับโอกาสพิเศษ',
      dateSaved: new Date().toISOString().slice(0, 10),
      look,
      notes,
    };

    const updatedSaved = [newSave, ...(currentUser.savedOutfits || [])];
    const updatedUser = { ...currentUser, savedOutfits: updatedSaved };
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    return true;
  };

  const removeSavedOutfit = (id: string) => {
    if (!currentUser) return;
    const updatedSaved = (currentUser.savedOutfits || []).filter((s) => s.id !== id);
    const updatedUser = { ...currentUser, savedOutfits: updatedSaved };
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    const id = currentUser.id;
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
    setCurrentUser(null);
    setLatestAnalysisState(null);
  };

  const deleteUploadedPhoto = () => {
    if (latestAnalysis) {
      setLatestAnalysisState({
        ...latestAnalysis,
        uploadedPhotoUrl: undefined,
      });
    }
    if (currentUser?.avatarUrl) {
      updateProfile({ avatarUrl: undefined });
    }
  };

  // Admin controls
  const toggleUserStatus = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'disabled' : 'active';
          addAdminLog(
            `เปลี่ยนสถานะผู้ใช้ ${u.name} เป็น ${nextStatus}`,
            'Security',
            `User ID: ${userId}`
          );
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const addMakeupItem = (item: Omit<MakeupItem, 'id'>) => {
    const newItem = { ...item, id: 'mk-' + Date.now() };
    setMakeupList((prev) => [newItem, ...prev]);
    addAdminLog(`เพิ่มไอเทมเมคอัพใหม่: ${newItem.name}`, 'Content', `Category: ${newItem.category}`);
  };

  const updateMakeupItem = (id: string, item: Partial<MakeupItem>) => {
    setMakeupList((prev) => prev.map((m) => (m.id === id ? { ...m, ...item } : m)));
    addAdminLog(`แก้ไขไอเทมเมคอัพ ID: ${id}`, 'Content', `Updated fields`);
  };

  const deleteMakeupItem = (id: string) => {
    setMakeupList((prev) => prev.filter((m) => m.id !== id));
    addAdminLog(`ลบไอเทมเมคอัพ ID: ${id}`, 'Content', `Item removed`);
  };

  const addHairstyleItem = (item: Omit<HairstyleItem, 'id'>) => {
    const newItem = { ...item, id: 'hair-' + Date.now() };
    setHairstyleList((prev) => [newItem, ...prev]);
    addAdminLog(`เพิ่มทรงผมใหม่: ${newItem.name}`, 'Content', `Length: ${newItem.length}`);
  };

  const updateHairstyleItem = (id: string, item: Partial<HairstyleItem>) => {
    setHairstyleList((prev) => prev.map((h) => (h.id === id ? { ...h, ...item } : h)));
  };

  const deleteHairstyleItem = (id: string) => {
    setHairstyleList((prev) => prev.filter((h) => h.id !== id));
  };

  const addOutfitItem = (item: Omit<OutfitItem, 'id'>) => {
    const newItem = { ...item, id: 'outfit-' + Date.now() };
    setOutfitList((prev) => [newItem, ...prev]);
    addAdminLog(`เพิ่มชุดแฟชั่นใหม่: ${newItem.title}`, 'Content', `Style: ${newItem.style}`);
  };

  const updateOutfitItem = (id: string, item: Partial<OutfitItem>) => {
    setOutfitList((prev) => prev.map((o) => (o.id === id ? { ...o, ...item } : o)));
  };

  const deleteOutfitItem = (id: string) => {
    setOutfitList((prev) => prev.filter((o) => o.id !== id));
  };

  const addOccasionItem = (item: Omit<OccasionItem, 'id'>) => {
    const newItem = { ...item, id: 'occ-' + Date.now() };
    setOccasionList((prev) => [newItem, ...prev]);
  };

  const updateOccasionItem = (id: string, item: Partial<OccasionItem>) => {
    setOccasionList((prev) => prev.map((o) => (o.id === id ? { ...o, ...item } : o)));
  };

  const deleteOccasionItem = (id: string) => {
    setOccasionList((prev) => prev.filter((o) => o.id !== id));
  };

  const addFestivalItem = (item: Omit<FestivalItem, 'id'>) => {
    const newItem = { ...item, id: 'fest-' + Date.now() };
    setFestivalList((prev) => [newItem, ...prev]);
  };

  const updateFestivalItem = (id: string, item: Partial<FestivalItem>) => {
    setFestivalList((prev) => prev.map((f) => (f.id === id ? { ...f, ...item } : f)));
  };

  const deleteFestivalItem = (id: string) => {
    setFestivalList((prev) => prev.filter((f) => f.id !== id));
  };

  const addAdminLog = (action: string, category: AdminLog['category'], details: string) => {
    const newLog: AdminLog = {
      id: 'log-' + Date.now(),
      action,
      category,
      performedBy: currentUser?.email || 'System',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      details,
    };
    setAdminLogs((prev) => [newLog, ...prev]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        isAdminUnlocked,
        adminPasscode,
        allUsers,
        latestAnalysis,
        savedOutfits: currentUser?.savedOutfits || [],
        makeupList,
        hairstyleList,
        outfitList,
        occasionList,
        festivalList,
        adminLogs,
        login,
        register,
        logout,
        unlockAdminWithPasscode,
        lockAdmin,
        updateAdminPasscode,
        updateUserPassword,
        switchDemoUser,
        saveOutfit,
        removeSavedOutfit,
        updateProfile,
        deleteAccount,
        deleteUploadedPhoto,
        setLatestAnalysis,
        toggleUserStatus,
        addMakeupItem,
        updateMakeupItem,
        deleteMakeupItem,
        addHairstyleItem,
        updateHairstyleItem,
        deleteHairstyleItem,
        addOutfitItem,
        updateOutfitItem,
        deleteOutfitItem,
        addOccasionItem,
        updateOccasionItem,
        deleteOccasionItem,
        addFestivalItem,
        updateFestivalItem,
        deleteFestivalItem,
        addAdminLog,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
