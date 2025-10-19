"use client";
import React, { useState } from "react";

const ItemsTab = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      label: "Dashboard",
      icon: "📊",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Dashboard Overview
          </h3>
          <p className="text-gray-600">
            Welcome to your dashboard. Here you can see all your important
            metrics.
          </p>
        </div>
      ),
    },
    {
      id: 1,
      label: "Projects",
      icon: "🚀",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Your Projects</h3>
          <p className="text-gray-600">
            Manage and track all your ongoing projects.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      label: "Team",
      icon: "👥",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Team Members</h3>
          <p className="text-gray-600">
            Collaborate with your team members efficiently.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      label: "Settings",
      icon: "⚙️",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Settings</h3>
          <p className="text-gray-600">
            Customize your preferences and account settings.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Tabs Header */}
        <div className="flex bg-gray-50 p-2 m-6 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white shadow-lg text-blue-600 transform scale-105"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="px-8 pb-8">
          <div className="animate-fade-in">
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsTab;
