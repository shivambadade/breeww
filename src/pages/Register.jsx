import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ReceiptText,
  Smartphone,
  UserRoundPlus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthShell from '../components/auth/AuthShell';

const methodOptions = [
  { id: 'phone', label: 'Phone number', icon: Smartphone, prefix: '+91' },
  { id: 'email', label: 'Email address', icon: Mail, prefix: '@' },
];

const agreementLabel = 'I have read and agree';

const AuthField = ({
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  rightSlot,
  prefix,
}) => (
  <label className="block">
    <div className="mb-3 flex items-center gap-2 text-[1.55rem] font-medium text-white">
      <Icon size={18} className="text-[#58acff]" />
      <span className="text-lg">{label}</span>
    </div>
    <div className="flex gap-3">
      {prefix ? (
        <div className="flex h-[3.75rem] min-w-[6.2rem] items-center justify-center rounded-2xl bg-[#353d86] px-4 text-xl text-blue-100/90">
          {prefix}
        </div>
      ) : null}
      <div className="relative flex-1">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="auth-input w-full pr-12"
        />
        {rightSlot ? (
          <div className="absolute inset-y-0 right-4 flex items-center text-white/60">{rightSlot}</div>
        ) : null}
      </div>
    </div>
  </label>
);

const Register = () => {
  const [method, setMethod] = useState('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('34424245421');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const selectedMethod = methodOptions.find((option) => option.id === method);

  return (
    <AuthShell
      title="Register"
      subtitle="Please register by phone number or email"
      icon={UserRoundPlus}
      sectionTitle={`Register your ${method}`}
      altPrompt="I have an account"
      altLinkLabel="Login"
      altLinkTo="/login"
    >
      <div className="grid grid-cols-2 gap-3 rounded-[1.4rem] bg-[#2b3270] p-1.5">
        {methodOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setMethod(option.id)}
            className={`rounded-[1rem] px-4 py-3 text-sm font-semibold transition ${
              method === option.id
                ? 'bg-[#4aa4ff] text-white shadow-[0_10px_24px_rgba(53,134,255,0.35)]'
                : 'text-blue-100/70 hover:bg-white/5'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <AuthField
        label={selectedMethod.label}
        icon={selectedMethod.icon}
        placeholder={`Please enter the ${method === 'phone' ? 'phone number' : 'email address'}`}
        prefix={selectedMethod.prefix}
        value={identifier}
        onChange={(event) => setIdentifier(event.target.value)}
      />

      <AuthField
        label="Set password"
        icon={LockKeyhole}
        type={showPassword ? 'text' : 'password'}
        placeholder="Set password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        rightSlot={
          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        }
      />

      <AuthField
        label="Confirm password"
        icon={LockKeyhole}
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        }
      />

      <AuthField
        label="Invite code"
        icon={ReceiptText}
        placeholder="Enter invite code"
        value={inviteCode}
        onChange={(event) => setInviteCode(event.target.value)}
      />

      <label className="mt-1 flex items-center gap-3 text-sm text-blue-50/80">
        <input type="checkbox" className="auth-checkbox" />
        <span>{agreementLabel}</span>
        <Link to="/" className="text-red-400 transition hover:text-red-300">
          [Privacy Agreement]
        </Link>
      </label>

      <button
        type="button"
        className="auth-primary-button mt-4 w-full"
      >
        Register
      </button>
    </AuthShell>
  );
};

export default Register;
