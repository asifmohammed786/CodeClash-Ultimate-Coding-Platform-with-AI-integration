import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { 
        type: String, 
        required: function() { return this.authMethod === 'local' } 
    },
    isAdmin: { type: Boolean, default: false },
    authMethod: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleId: String,
    avatar: String,
    verifyOtp: { type: String, default: ' ' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { 
        type: Boolean, 
        default: function() { return this.authMethod === 'google' } 
    },
    resetOtp: { type: String, default: ' ' },
    resetOtpExpireAt: { type: Number, default: 0 },

    // Profile stats fields
    problemsSolved: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 }
    },
    submissionCalendar: {
      type: Map,
      of: Number,
      default: {}
    },
    languagesUsed: { type: [String], default: [] },
    submissions: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'submission' 
    }],
    createdAt: { type: Date, default: Date.now }
});

// Conditional required for password only for local auth
userSchema.path('password').required(function() {
    return this.authMethod === 'local';
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
