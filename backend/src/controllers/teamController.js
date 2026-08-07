const Team = require("../models/Team");
const { validationResult } = require("express-validator");
const User = require("../models/User");
/*
    @desc   Create Team
    @route  POST /api/team
    @access Private
*/

const createTeam = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { teamName, description } = req.body;

    // Logged-in user (from auth middleware)
    const userId = req.user._id;

    // Create new team
    const team = await Team.create({
      teamName,
      description,
      owner: userId,
      members: [
        {
          user: userId,
          role: "Owner",
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


/*
    @desc   Get All Teams of Logged-in User
    @route  GET /api/team
    @access Private
*/

const getMyTeams = async (req, res) => {
  try {

    const teams = await Team.find({
      "members.user": req.user._id,
    })
      .populate("owner", "fullName email")
        .populate("members.user", "fullName email");

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

/*
    @desc   Get Single Team
    @route  GET /api/team/:id
    @access Private
*/

const getTeamById = async (req, res) => {

  try {

    const team = await Team.findById(req.params.id)
      .populate("owner", "fullName email")
.populate("members.user", "fullName email");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const isMember = team.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: team,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

/*
    @desc   Delete Team
    @route  DELETE /api/team/:id
    @access Private
*/

const deleteTeam = async (req, res) => {

  try {

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (team.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can delete the team",
      });
    }

    await team.deleteOne();

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

/*
    @desc   Update Team
    @route  PUT /api/team/:id
    @access Private (Owner only)
*/

const updateTeam = async (req, res) => {
    try {
        const { teamName, description } = req.body;

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found",
            });
        }

        if (team.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the owner can update the team",
            });
        }

        if (teamName !== undefined) {
    if (!teamName.trim()) {
        return res.status(400).json({
            success: false,
            message: "Team name cannot be empty",
        });
    }

    team.teamName = teamName;
}
        if (description !== undefined) team.description = description;

        await team.save();

        res.status(200).json({
            success: true,
            message: "Team updated successfully",
            data: team,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/*
    @desc   Invite Member
    @route  POST /api/team/:id/invite
    @access Private (Owner only)
*/

const inviteMember = async (req, res) => {
    try {

        const { email } = req.body;

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found",
            });
        }

        if (team.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the owner can invite members",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const alreadyMember = team.members.some(
            member => member.user.toString() === user._id.toString()
        );

        if (alreadyMember) {
            return res.status(400).json({
                success: false,
                message: "User is already a member",
            });
        }

        team.members.push({
            user: user._id,
            role: "Member",
        });

        await team.save();

        res.status(200).json({
            success: true,
            message: "Member added successfully",
            data: team,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};

/*
    @desc   Remove Member
    @route  DELETE /api/team/:id/member/:userId
    @access Private (Owner only)
*/

const removeMember = async (req, res) => {
    try {

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found",
            });
        }

        if (team.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the owner can remove members",
            });
        }

        if (req.params.userId === team.owner.toString()) {
            return res.status(400).json({
                success: false,
                message: "Owner cannot be removed",
            });
        }

        const memberExists = team.members.some(
            (member) => member.user.toString() === req.params.userId
        );

        if (!memberExists) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
            });
        }

        team.members = team.members.filter(
            (member) => member.user.toString() !== req.params.userId
        );

        await team.save();

        res.status(200).json({
            success: true,
            message: "Member removed successfully",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};

/*
    @desc   Leave Team
    @route  DELETE /api/team/:id/leave
    @access Private
*/

const leaveTeam = async (req, res) => {

    try {

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found",
            });
        }

        if (team.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message:
                    "Owner cannot leave the team. Delete the team or transfer ownership.",
            });
        }

        const memberExists = team.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        );

        if (!memberExists) {
            return res.status(404).json({
                success: false,
                message: "You are not a member of this team",
            });
        }

        team.members = team.members.filter(
            (member) => member.user.toString() !== req.user._id.toString()
        );

        await team.save();

        res.status(200).json({
            success: true,
            message: "You left the team successfully",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};

module.exports = {
    createTeam,
    getMyTeams,
    getTeamById,
    updateTeam,
    inviteMember,
    removeMember,
    leaveTeam,
    deleteTeam,
};