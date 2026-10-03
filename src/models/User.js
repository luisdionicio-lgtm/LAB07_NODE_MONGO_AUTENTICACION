import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: (value) => /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@]).{8,}$/.test(value),
      message: 'La contrasena debe tener 8 caracteres, una mayuscula, un numero y un simbolo (# $ % & * @)'
    }
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  name: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  birthdate: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value <= new Date(),
      message: 'La fecha de nacimiento no puede estar en el futuro'
    }
  },
  url_profile: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
