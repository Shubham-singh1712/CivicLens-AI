import React, { useState } from "react";
import { MessageSquare, Send, User, Loader2, Calendar } from "lucide-react";
import { CivicIssue } from "../../types";

interface CommentsProps {
  issue: CivicIssue;
  onAddComment: (author: string, text: string) => Promise<void>;
}

export default function Comments({ issue, onAddComment }: CommentsProps) {
  const [author, setAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      const commentAuthor = author.trim() || "Anonymous Citizen";
      await onAddComment(commentAuthor, commentText.trim());
      setCommentText("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to dispatch your testimony comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const commentsList = issue.comments || [];

  return (
    <div id={`comments-section-${issue.id}`} className="space-y-6 text-left">
      <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h3 className="font-display font-bold text-lg text-white">
          Citizen Testimony & Dispatch Comments
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Comment Input Form */}
        <form onSubmit={handlePostComment} className="lg:col-span-5 bg-gray-950/40 border border-gray-900 rounded-2xl p-5 space-y-4">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
            POST NEW TESTIMONY LOG
          </span>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-400 uppercase">Your Name (Optional)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Anonymous Citizen"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                />
                <User className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-400 uppercase">Testimony Message</label>
              <textarea
                rows={3}
                placeholder="Share eyewitness safety assessments, road closures, or dispatch coordination progress..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 resize-none"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-[10px] font-mono text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold rounded-lg cursor-pointer transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>DISPATCH COMMENTS</span>
              </>
            )}
          </button>
        </form>

        {/* Testimony Comments Feed List */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
            FEEDBACK JOURNAL ({commentsList.length})
          </span>

          {commentsList.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-900 bg-gray-950/10 rounded-2xl text-gray-600 font-mono text-xs">
              No citizen testimonies posted yet. Be the first to coordinate!
            </div>
          ) : (
            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {[...commentsList].reverse().map((comment) => (
                <div key={comment.id} className="bg-gray-950/30 border border-gray-900 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <span className="text-gray-300 font-bold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{comment.author}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(comment.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
