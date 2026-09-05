"use client";

import React, { useEffect, useState } from 'react';
import { Mail, Search, Trash2, Calendar, User, MessageSquare, X, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Selected message state (for viewing detail)
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const fetchMessages = () => {
    setLoading(true);
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessages(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening the message details view
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(m => m._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
      } else {
        alert(data.error || 'Failed to delete message.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  };

  const filteredMessages = messages.filter(m => 
    m.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    m.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 bg-zinc-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Inbox Messages</h1>
          <p className="text-gray-500 text-sm mt-1">Review contact inquiries and feedback requests submitted by site visitors.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider block">Total Messages</span>
            <span className="text-3xl font-bold text-gray-900 mt-2 block">{messages.length}</span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
            <Mail className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Messages List Area */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200 bg-gray-50/50">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                placeholder="Search inbox..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredMessages.length > 0 ? (
            <div className="divide-y divide-gray-100 overflow-y-auto max-h-[60vh]">
              {filteredMessages.map((msg) => (
                <div 
                  key={msg._id} 
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-blue-50/20 transition-all ${
                    selectedMessage && selectedMessage._id === msg._id ? 'bg-blue-50/40 border-l-4 border-blue-600 pl-4' : ''
                  }`}
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">
                        {msg.firstName} {msg.lastName}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 block truncate">{msg.email}</span>
                    <p className="text-gray-500 text-sm truncate">{msg.message}</p>
                  </div>

                  <button 
                    onClick={(e) => handleDelete(msg._id, e)}
                    className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all cursor-pointer flex-shrink-0"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No messages matching search query.</p>
            </div>
          )}
        </div>

        {/* Message Details Preview Panel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[40vh]">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-serif">
                    {selectedMessage.firstName} {selectedMessage.lastName}
                  </h3>
                  <span className="text-xs text-blue-600 font-semibold">{selectedMessage.email}</span>
                </div>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-all"
                  title="Close Details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Message Body</span>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="text-xs text-gray-400 flex items-center gap-1.5 pt-4 border-t border-gray-100">
                <Calendar className="w-3.5 h-3.5" />
                Received on: {formatDate(selectedMessage.createdAt)}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 py-10">
              <Eye className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-sm font-semibold">No Message Selected</p>
              <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Select any message card on the left panel list to view full body contents.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
