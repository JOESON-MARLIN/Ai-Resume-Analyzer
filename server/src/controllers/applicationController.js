import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get all user applications
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res) => {
    try {
        const apps = await prisma.jobApplication.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(apps);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fully load Kanban tracking' });
    }
};

// @desc    Add new application
// @route   POST /api/applications
// @access  Private
export const addApplication = async (req, res) => {
    try {
        const { company, role, url, salary, notes, source, dateApplied, followUpDate, status } = req.body;
        
        if (!company || !role) {
            return res.status(400).json({ error: 'Company and role are required' });
        }

        const app = await prisma.jobApplication.create({
            data: {
                userId: req.user.id,
                company,
                role,
                url,
                salary,
                notes,
                source,
                dateApplied: dateApplied ? new Date(dateApplied) : null,
                followUpDate: followUpDate ? new Date(followUpDate) : null,
                status: status || 'SAVED'
            }
        });

        res.status(201).json(app);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save application' });
    }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const app = await prisma.jobApplication.update({
            where: { id },
            data: { status }
        });

        res.status(200).json(app);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update application status' });
    }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.jobApplication.delete({ where: { id } });
        res.status(200).json({ message: 'Application deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove application' });
    }
};
