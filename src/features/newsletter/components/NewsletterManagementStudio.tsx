"use client";

import React from "react";
import { Mail, RefreshCw, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useNewsletterManagement } from "../hooks/useNewsletterManagement";
import { NewsletterStatsCards } from "./NewsletterStatsCards";
import { NewsletterBioCardCustomizer } from "./NewsletterBioCardCustomizer";
import { NewsletterBroadcastsHistory } from "./NewsletterBroadcastsHistory";
import { NewsletterSubscribersTable } from "./NewsletterSubscribersTable";
import { NewsletterAddSubscriberModal } from "./NewsletterAddSubscriberModal";
import { NewsletterBroadcastModal } from "./NewsletterBroadcastModal";
import { AppButton } from "@/shared/ui";

export function NewsletterManagementStudio() {
  const {
    settings,
    setSettings,
    stats,
    subscribers,
    broadcasts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isLoading,
    isSavingSettings,
    isSendingBroadcast,
    feedback,
    isAddModalOpen,
    setIsAddModalOpen,
    isBroadcastModalOpen,
    setIsBroadcastModalOpen,
    handleSaveSettings,
    handleAddSubscriber,
    handleToggleSubscriberStatus,
    handleDeleteSubscriber,
    handleSendBroadcast,
    refreshAll,
  } = useNewsletterManagement();

  return (
    <div className="space-y-6">
      {/* Top Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
              <span>استوديو إدارة النشرة البريدية والمشتركين</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/15 text-primary">
                PRO
              </span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              اجمع جهات الاتصال من صفحة البايو، أرسل حملاتك التسويقية، وقم بإدارة وتصدير قائمتك البريدية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <AppButton
            type="button"
            variant="outline"
            size="sm"
            onClick={refreshAll}
            disabled={isLoading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
          >
            تحديث
          </AppButton>
          <AppButton
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setIsBroadcastModalOpen(true)}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            إرسال حملة بريدية
          </AppButton>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-fadeIn ${
            feedback.type === "success"
              ? "bg-emerald-950/30 text-emerald-400 border border-emerald-500/30"
              : "bg-error-container/30 text-error border border-error/30"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Stats Cards */}
      <NewsletterStatsCards stats={stats} />

      {/* Bio Newsletter Card Customizer */}
      <NewsletterBioCardCustomizer
        settings={settings}
        onChange={(updates) => setSettings((prev) => ({ ...prev, ...updates }))}
        onSave={() => handleSaveSettings()}
        isSaving={isSavingSettings}
      />

      {/* Broadcasts History */}
      <NewsletterBroadcastsHistory
        broadcasts={broadcasts}
        onOpenNewBroadcast={() => setIsBroadcastModalOpen(true)}
      />

      {/* Subscribers CRM Table */}
      <NewsletterSubscribersTable
        subscribers={subscribers}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onToggleStatus={handleToggleSubscriberStatus}
        onDelete={handleDeleteSubscriber}
      />

      {/* Modals */}
      <NewsletterAddSubscriberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSubscriber}
      />

      <NewsletterBroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onSend={handleSendBroadcast}
        isSending={isSendingBroadcast}
        activeSubscribersCount={stats.active}
      />
    </div>
  );
}
