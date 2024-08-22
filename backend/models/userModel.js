import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {

    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    totalFunds: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    stocks: {

      watching: {
        type: [String],
        required: true,
        default: []
      },

      portfolio: [
        {
          ticker: {
            type: String,
            required: true,
          },
          numShares: {
            type: Number,
            required: true,
            min: 1,
          },
          datePurchased: {
            type: Date,
            required: true,
          },
          priceInvested: {
            type: Number,
            required: true,
            min: 0,
          }
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// encrypting the password
userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;