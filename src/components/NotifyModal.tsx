"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X, BellRing } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { createNotificationRequestAction } from "@/server/actions/notify-actions";

interface NotifyModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
}

export function NotifyModal({ isOpen, onClose, courseId }: NotifyModalProps) {
    const [email, setEmail] = useState("");
    const [notifying, setNotifying] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNotifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!email) return toast.error("Please enter your email");

        setNotifying(true);
        try {
            const result = await createNotificationRequestAction(email, courseId);

            if (result.success) {
                toast.success(result.message || "You will be notified!");
                setEmail("");
                onClose();
            } else {
                toast.error(result.message || "Something went wrong.");
            }
        } catch (error) {
            toast.error("Failed to submit request.");
        } finally {
            setNotifying(false);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden pointer-events-auto border border-zinc-200"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                            <BellRing size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-zinc-900">Get Notified</h3>
                                            <p className="text-sm text-zinc-500">We'll email you when this is available.</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                                        className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-full transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleNotifySubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                                            Email Address
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoFocus
                                            className="w-full"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
                                        disabled={notifying}
                                        size="lg"
                                    >
                                        {notifying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Notify Me"
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
