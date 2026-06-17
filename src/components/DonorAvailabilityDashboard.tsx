import React, { useMemo, useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { Droplet, Users, TrendingUp, Activity } from "lucide-react";

interface DonorData {
    donorName: string;
    age: string;
    gender: string;
    phone: string;
    bloodGroup: string;
    availability: string | Date;
    address: string;
    recentlyDonated: string;
}

interface ChartData {
    bloodGroup: string;
    donors: number;
}

const DonorAvailabilityDashboard = () => {
    const [donors, setDonors] = useState<DonorData[]>([]);

    useEffect(() => {
        const loadDonors = () => {
            try {
                const rawData = localStorage.getItem("blood-donors");

                if (!rawData) {
                    setDonors([]);
                    return;
                }

                const parsedData = JSON.parse(rawData);

                if (!Array.isArray(parsedData)) {
                    setDonors([]);
                    return;
                }

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const validDonors = parsedData.filter((donor): donor is DonorData => {
                    if (
                        !donor ||
                        typeof donor !== "object" ||
                        !donor.bloodGroup ||
                        !donor.availability
                    ) {
                        return false;
                    }

                    const availabilityDate = new Date(donor.availability);

                    if (isNaN(availabilityDate.getTime())) {
                        return false;
                    }

                    availabilityDate.setHours(0, 0, 0, 0);

                    return availabilityDate >= today;
                });

                setDonors(validDonors);
            } catch (error) {
                console.error("Failed to load donor data:", error);
                setDonors([]);
            }
        };

        loadDonors();

        window.addEventListener("storage", loadDonors);

        return () => {
            window.removeEventListener("storage", loadDonors);
        };
    }, []);
    const COLORS = [
        "#DC2626",
        "#F97316",
        "#EAB308",
        "#22C55E",
        "#06B6D4",
        "#3B82F6",
        "#8B5CF6",
        "#EC4899",
    ];
    const stats = useMemo(() => {
        const bloodGroups = {
            "A+": 0,
            "A-": 0,
            "B+": 0,
            "B-": 0,
            "AB+": 0,
            "AB-": 0,
            "O+": 0,
            "O-": 0,
        };

        donors.forEach((donor: DonorData) => {
            if (bloodGroups.hasOwnProperty(donor.bloodGroup)) {
                bloodGroups[donor.bloodGroup]++;
            }
        });

        const chartData: ChartData[] = Object.entries(bloodGroups).map(
            ([group, count]) => ({
                bloodGroup: group,
                donors: count,
            })
        );

        const totalDonors = donors.length;

        const mostAvailable = chartData.reduce((a, b) =>
            a.donors > b.donors ? a : b
        );

        const leastAvailable = chartData.reduce((a, b) =>
            a.donors < b.donors ? a : b
        );

        return {
            chartData,
            totalDonors,
            mostAvailable,
            leastAvailable,
        };
    }, [donors]);

    return (
        <div className="w-full py-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-block mb-3 px-3 py-1 bg-blood/10 text-blood rounded-full text-sm font-medium">
                        Real-Time Insights
                    </div>

                    <h1 className="text-4xl font-bold text-gradient mb-3">
                        Blood Availability Dashboard
                    </h1>

                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Monitor donor distribution across all blood groups and
                        quickly identify availability trends.
                    </p>
                </div>

                {stats.totalDonors === 0 ? (
                    <div className="bg-white rounded-2xl border border-blood/10 shadow-sm p-12 text-center">
                        <Droplet className="h-14 w-14 text-blood mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">
                            No Donor Data Available
                        </h2>
                        <p className="text-muted-foreground">
                            Donor statistics will appear once users start
                            registering as blood donors.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                            <div className="bg-white p-6 rounded-2xl border border-blood/10 shadow-sm">
                                <Users className="h-8 w-8 text-blue-500 mb-3" />
                                <p className="text-sm text-muted-foreground">
                                    Total Donors
                                </p>
                                <h3 className="text-3xl font-bold">
                                    {stats.totalDonors}
                                </h3>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-blood/10 shadow-sm">
                                <TrendingUp className="h-8 w-8 text-green-500 mb-3" />
                                <p className="text-sm text-muted-foreground">
                                    Most Available
                                </p>
                                <h3 className="text-3xl font-bold">
                                    {stats.mostAvailable.bloodGroup}
                                </h3>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-blood/10 shadow-sm">
                                <Activity className="h-8 w-8 text-orange-500 mb-3" />
                                <p className="text-sm text-muted-foreground">
                                    Rarest Group
                                </p>
                                <h3 className="text-3xl font-bold">
                                    {stats.leastAvailable.bloodGroup}
                                </h3>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-blood/10 shadow-sm">
                                <Droplet className="h-8 w-8 text-blood mb-3" />
                                <p className="text-sm text-muted-foreground">
                                    Blood Types
                                </p>
                                <h3 className="text-3xl font-bold">8</h3>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                            <div className="bg-white rounded-2xl border border-blood/10 shadow-sm p-6 ">
                                <h2 className="text-xl font-semibold mb-6">
                                    Blood Group Distribution
                                </h2>

                                <div className="h-[420px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="bloodGroup" />
                                            <YAxis
                                                allowDecimals={false}
                                                domain={[0, "auto"]}
                                            />
                                            <Tooltip />
                                            <Bar
                                                dataKey="donors"
                                                radius={[8, 8, 0, 0]}
                                                fill="#dc2626"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-blood/10 shadow-sm p-6 ">
                                <h2 className="text-xl font-semibold mb-2">
                                    Blood Group Percentage Distribution
                                </h2>

                                <p className="text-muted-foreground mb-6">
                                    Percentage share of registered donors by blood group.
                                </p>

                                <div className="h-[420px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.chartData.filter(item => item.donors > 0)}
                                                dataKey="donors"
                                                nameKey="bloodGroup"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={"70%"}
                                                label={({ bloodGroup, percent }) =>
                                                    `${bloodGroup} ${(percent * 100).toFixed(0)}%`
                                                }
                                            >
                                                {stats.chartData
                                                    .filter(item => item.donors > 0)
                                                    .map((_, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={COLORS[index % COLORS.length]}
                                                        />
                                                    ))}
                                            </Pie>

                                            <Tooltip
                                                formatter={(value: number) => [
                                                    `${value} donor${value !== 1 ? "s" : ""}`,
                                                    "Count",
                                                ]}
                                            />

                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-blood/10 shadow-sm p-6 mb-10">
                            <h2 className="text-xl font-semibold mb-4">
                                Availability Insights
                            </h2>

                            <div className="space-y-3 text-muted-foreground">
                                <p>
                                    • Highest availability:{" "}
                                    <span className="font-semibold text-green-500" >
                                        {stats.mostAvailable.bloodGroup}
                                    </span>
                                </p>

                                <p>
                                    • Lowest availability:{" "}
                                    <span className="font-semibold text-blood">
                                        {stats.leastAvailable.bloodGroup}
                                    </span>
                                </p>

                                <p>
                                    • Total registered donors:{" "}
                                    <span className="font-semibold text-blue-500">
                                        {stats.totalDonors}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DonorAvailabilityDashboard;