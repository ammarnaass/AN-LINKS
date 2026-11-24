"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export interface PhoneWebviewIframeProps {
  username: string;
  refreshKey?: number;
  className?: string;
}

export function PhoneWebviewIframe({
  username,
  refreshKey = 0,
  className = "",
}: PhoneWebviewIframeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const srcUrl = `/${username}?preview=true`;

  return (
    <div className={`relative w-full h-full flex flex-col bg-surface-container-lowest ${className}`}>
      {/* Loading Shimmer / Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface-container-lowest/90 backdrop-blur-sm gap-2 text-xs text-on-surface-variant">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span>جاري تحميل المتصفح الحقيقي...</span>
        </div>
      )}

      {/* Embedded Webview Iframe */}
      <iframe
        key={`${username}-${refreshKey}`}
        src={srcUrl}
        title="Phone Live Webview"
        onLoad={() => setIsLoading(false)}
        className="w-full h-full border-none select-auto flex-1 bg-transparent"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
