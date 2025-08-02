import HelpRequest from '../models/HelpRequest.js';
import User from '../models/User.js';

export const createHelpRequest = async (req, res) => {
    try {
      const { vehicleType, description, location, urgency } = req.body;
  
      const user = await User.findById(req.user._id);
  
      const helpRequest = await HelpRequest.create({
        userId: req.user._id,
        phone: user.phone,
        vehicleType,
        description,
        location,
        urgency,
        status: 'pending', // Optional, assuming default
      });
  
      // ✅ Emit real-time event *after* creation
      const io = req.app.get('io');
      io.emit('new-help-request', helpRequest); // notify all clients/mechanics
  
      res.status(201).json({ message: 'Help request submitted', helpRequest });
    } catch (err) {
      console.error("Error creating help request:", err);
      res.status(500).json({ message: 'Failed to create help request', error: err.message });
    }
  };
  

export const getAllHelpRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests', error: err.message });
  }
};

// Used by mechanic to accept a request
export const acceptHelpRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const updated = await HelpRequest.findByIdAndUpdate(
      requestId,
      { status: 'accepted' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request accepted', request: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

// Optional: update to any valid status
export const updateHelpRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const validStatuses = ['pending', 'accepted', 'in-progress', 'resolved'];
    const validTransitions = {
      pending: ['accepted'],
      accepted: ['in-progress'],
      'in-progress': ['resolved'],
      resolved: [],
    };
  
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
  
    try {
      const helpRequest = await HelpRequest.findById(id).populate('userId', 'email');
  
      if (!helpRequest) {
        return res.status(404).json({ message: 'Help request not found' });
      }
  
      const currentStatus = helpRequest.status;
  
      if (!validTransitions[currentStatus].includes(status)) {
        return res.status(400).json({
          message: `❌ Invalid transition: Cannot move from "${currentStatus}" to "${status}".`,
        });
      }
  
      helpRequest.status = status;
      await helpRequest.save();
  
      const io = req.app.get('io');
      
      // ✅ Emit to all clients (mechanic + users)
      io.emit('status-update', {
        requestId: helpRequest._id,
        newStatus: status,
        userEmail: helpRequest.userId.email,
      });
  
      res.json({ message: '✅ Status updated successfully', helpRequest });
    } catch (err) {
      console.error('Error updating status:', err.message);
      res.status(500).json({ message: 'Failed to update status', error: err.message });
    }
  };
  