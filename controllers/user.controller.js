const User = require("../models/User");

class UserController {
  async getAllUsers(req, res) {
    try {
      const status = req.query["user-status"];
      const query = {};

      switch (status) {
        case "archived":
          query.archived = true;
          break;
        case "active":
          query.archived = false;
          break;
        case "all":
          query.archived;
          break;
        default:
          return res.status(400).json({
            message:
              "Please enter valid query from ['all', 'active', 'archived'] to user-status",
          });
      }

      const allUsers = await User.find(query);

      return res.json({
        message: "Got all users",
        payload: allUsers,
      });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }

  async archiveUser(req, res) {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { archived: true },
      { new: true }
    );

    if (user) {
      return res.status(200).json({
        message: `Successfully archived ${user.first_name}`,
      });
    }

    return res.status(404).json({
      message: "User not found",
    });
  }

  async unarchiveUser(req, res) {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { archived: false },
      { new: true }
    );

    if (user) {
      return res.status(200).json({
        message: `Successfully unarchived ${user.first_name}`,
      });
    }

    return res.status(404).json({
      message: "User not found",
    });
  }

  async changeUserRole(req, res) {
    try{
      const { id } = req.params;
      const { newRole } = req.body;
      const { role, id: updaterId } = req.user;

      if (id === updaterId) {
        return res.status(403).json({
          message: `${role} can't update its role`,
        });
      }

      let user;

      if (newRole === "owner" && role === "manager")
        return res.status(403).json({
          message: `${role} can't update this role`,
        });

      user = await User.findByIdAndUpdate(id, { role: newRole }, { new: true });
      return res.json({
        message: "Successfully updated the role",
        payload: user,
      });

    }
    catch(error){
      res.status(500).json({
        message: error
      })
    }
  }

  async getBarbers(req, res){
    try{
      const allBarbers = await User.find({role: "barber"});
      res.json({
        message: "Got all barbers",
        payload: allBarbers
      })
    }
    catch(error){
      res.status(500).json({
        message: error
      })
    }
  }
}

module.exports = new UserController();
