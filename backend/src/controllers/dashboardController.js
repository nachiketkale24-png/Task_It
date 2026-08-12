const { getDashboardStats } = require('../services/dashboardService');

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const stats = await getDashboardStats(userId);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data"
        });
    }
};

module.exports = {
    getDashboardData
};
