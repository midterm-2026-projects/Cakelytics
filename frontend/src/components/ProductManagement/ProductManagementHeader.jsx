import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

export default function ProductManagementHeader({ userName = "Evangeline V.", notificationCount = 1 }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = now.toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const initial = userName.trim().charAt(0).toUpperCase();

  return (
    <header className="w-full bg-white border-b border-[#ead6d0] px-6 py-4 flex items-center justify-between">
      <h1 className="text-lg font-bold text-[#2d1712]">Product Management</h1>

      <div className="flex items-center gap-5">
        <span className="text-sm text-[#5c4033] font-medium">
          {formattedDate} • {formattedTime}
        </span>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-full border border-[#ead6d0] hover:bg-[#fbf7f6] transition-colors">
          <Bell size={16} className="text-[#5c4033]" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#2d1712]">{userName}</span>
          <div className="w-8 h-8 rounded-full bg-[#5c4033] text-white flex items-center justify-center text-sm font-bold">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}
