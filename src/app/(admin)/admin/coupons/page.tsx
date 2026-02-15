"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, Tag, Calendar, Check, X } from "lucide-react";
import {
    createCoupon,
    getAllCoupons,
    deleteCoupon,
    toggleCouponStatus,
} from "@/server/actions/coupon.action";
import { getCoursesAction } from "@/server/actions/get-courses";

const couponSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
    discount: z.coerce.number().min(0, "Discount must be positive"),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    expiryDate: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Expiry date must be in the future",
    }),
    usageLimit: z.coerce.number().optional(),
    minAmount: z.coerce.number().optional(),
    description: z.string().optional(),
    applicableCourseIds: z.array(z.string()).optional(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [couponsRes, coursesRes] = await Promise.all([
                    getAllCoupons(),
                    getCoursesAction(),
                ]);

                if (couponsRes.success) {
                    setCoupons(couponsRes.data || []);
                }
                if (coursesRes) {
                    setCourses(coursesRes);
                }

            } catch (error) {
                toast.error("Failed to fetch data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CouponFormValues>({
        resolver: zodResolver(couponSchema) as any,
        defaultValues: {
            code: "",
            discount: 0,
            discountType: "PERCENTAGE",
            expiryDate: "",
            usageLimit: undefined,
            minAmount: undefined,
            description: "",
            applicableCourseIds: [],
        },
    });

    const selectedCourseIds = watch("applicableCourseIds") || [];

    const onSubmit = async (data: CouponFormValues) => {
        try {
            const res = await createCoupon({
                ...data,
                expiryDate: new Date(data.expiryDate),
                // usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
            });

            if (res.success) {
                toast.success("Coupon created successfully");
                setCoupons([res.data, ...coupons]);
                setIsDialogOpen(false);
                reset();
            } else {
                toast.error(res.error || "Failed to create coupon");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        try {
            const res = await deleteCoupon(id);
            if (res.success) {
                setCoupons(coupons.filter((c) => c.id !== id));
                toast.success("Coupon deleted");
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete coupon");
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await toggleCouponStatus(id, !currentStatus);
            if (res.success) {
                setCoupons(
                    coupons.map((c) =>
                        c.id === id ? { ...c, isEnabled: !currentStatus } : c
                    )
                );
                toast.success(`Coupon ${!currentStatus ? "enabled" : "disabled"}`);
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    const toggleCourseSelection = (courseId: string) => {
        const current = selectedCourseIds;
        if (current.includes(courseId)) {
            setValue("applicableCourseIds", current.filter(id => id !== courseId));
        } else {
            setValue("applicableCourseIds", [...current, courseId]);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Coupons</h1>
                    <p className="text-zinc-500 mt-2">Manage discounts and promotions.</p>
                </div>

                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors"
                >
                    <Plus size={16} /> Create Coupon
                </button>
            </div>

            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-zinc-100">
                            <h2 className="text-lg font-semibold text-zinc-900">Create New Coupon</h2>
                            <button onClick={() => setIsDialogOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Coupon Code</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                    <input
                                        {...register("code")}
                                        placeholder="SUMMER25"
                                        className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 uppercase"
                                    />
                                </div>
                                {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700">Discount Type</label>
                                    <select
                                        {...register("discountType")}
                                        className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    >
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700">Value</label>
                                    <input
                                        {...register("discount")}
                                        type="number"
                                        placeholder="10"
                                        className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    />
                                    {errors.discount && <p className="text-xs text-red-500">{errors.discount.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Expiry Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                    <input
                                        {...register("expiryDate")}
                                        type="datetime-local"
                                        className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    />
                                </div>
                                {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700">Usage Limit</label>
                                    <input
                                        {...register("usageLimit")}
                                        type="number"
                                        placeholder="Unlimited"
                                        className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700">Min Order (₹)</label>
                                    <input
                                        {...register("minAmount")}
                                        type="number"
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Applicable Courses (Optional)</label>
                                <div className="border border-zinc-200 rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                                    {courses.length === 0 && <p className="text-xs text-zinc-500">No courses found.</p>}
                                    {courses.map(course => (
                                        <div key={course.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`course-${course.id}`}
                                                checked={selectedCourseIds.includes(course.id)}
                                                onChange={() => toggleCourseSelection(course.id)}
                                                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                            />
                                            <label htmlFor={`course-${course.id}`} className="text-sm text-zinc-700 cursor-pointer select-none">
                                                {course.title}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-zinc-500">Leave empty to apply to all courses.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center bg-zinc-900 text-white py-2 rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Coupon"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-zinc-400" />
                </div>
            ) : coupons.length === 0 ? (
                <div className="text-center py-20 bg-zinc-50 rounded-lg border border-dashed border-zinc-200 max-w-2xl mx-auto">
                    <Tag className="mx-auto h-10 w-10 text-zinc-400 mb-2" />
                    <p className="text-zinc-500">No coupons created yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Code</th>
                                    <th className="px-6 py-4 font-medium">Discount</th>
                                    <th className="px-6 py-4 font-medium">Usage</th>
                                    <th className="px-6 py-4 font-medium">Expiry</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {coupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-zinc-900">{coupon.code}</td>
                                        <td className="px-6 py-4">
                                            {coupon.discountType === "PERCENTAGE" ? `${coupon.discount}%` : `₹${coupon.discount}`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-600 font-medium">{coupon.usedCount}</span>
                                            {coupon.usageLimit && <span className="text-zinc-400"> / {coupon.usageLimit}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500">
                                            {new Date(coupon.expiryDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(coupon.id, coupon.isEnabled)}
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-colors ${coupon.isEnabled ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200'}`}
                                            >
                                                {coupon.isEnabled ? "Active" : "Disabled"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className="text-zinc-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                                                onClick={() => handleDelete(coupon.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
