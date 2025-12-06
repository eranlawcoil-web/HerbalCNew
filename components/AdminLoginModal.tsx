
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Check, Mail, KeyRound, RefreshCw } from 'lucide-react';
import { useData } from './DataProvider';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { authorizedEmails } = useData();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  if (!isOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    setTimeout(() => {
      if (authorizedEmails.includes(email.toLowerCase().trim())) {
        setStatus('idle');
        setStep('code');
      } else {
        setStatus('error');
        setErrorMessage('אימייל זה אינו מורשה במערכת.');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }, 1000);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Simulate code check
    setTimeout(() => {
      if (code === '123456') {
        setStatus('success');
        setTimeout(() => {
          onLoginSuccess();
          handleClose();
        }, 1500);
      } else {
        setStatus('error');
        setErrorMessage('קוד שגוי. נסה שנית.');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }, 1000);
  };

  const handleResendCode = () => {
    setResendStatus('שולח...');
    setTimeout(() => {
      setResendStatus('הקוד נשלח שוב!');
      setTimeout(() => setResendStatus(''), 3000);
    }, 1500);
  };

  const handleClose = () => {
    setEmail('');
    setCode('');
    setStep('email');
    setStatus('idle');
    setErrorMessage('');
    setResendStatus('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={handleClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-earth-900 border border-earth-700 p-8 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <button onClick={handleClose} className="absolute top-4 left-4 text-gray-500 hover:text-white">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-earth-800 rounded-full flex items-center justify-center mx-auto mb-4 text-earth-accent">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-serif text-white font-bold">כניסת מנהל מערכת</h2>
          <p className="text-gray-400">
            {step === 'email' ? 'הזדהות באמצעות אימייל' : 'אימות זהות'}
          </p>
        </div>

        {status === 'success' ? (
           <div className="text-center py-8">
             <div className="text-green-500 mb-4 flex justify-center"><Check size={48} /></div>
             <p className="text-xl text-white">מאומת! נכנס למערכת...</p>
           </div>
        ) : (
          <>
            {step === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <Mail size={16} /> אימייל
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-earth-950 border border-earth-700 rounded-lg p-3 text-white focus:border-earth-accent outline-none text-left ltr"
                    placeholder="email@example.com"
                    required
                    autoFocus
                  />
                </div>
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-earth-accent text-earth-900 font-bold py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'בודק...' : 'שלח קוד אימות'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div className="bg-earth-800/50 p-3 rounded-lg text-center mb-4">
                  <p className="text-sm text-gray-400">קוד אימות נשלח לכתובת:</p>
                  <p className="text-earth-accent font-bold">{email}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <KeyRound size={16} /> קוד אימות (לדוגמה: 123456)
                  </label>
                  <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-earth-950 border border-earth-700 rounded-lg p-3 text-white focus:border-earth-accent outline-none text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoFocus
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-earth-accent text-earth-900 font-bold py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {status === 'loading' ? 'מאמת...' : 'היכנס'}
                  </button>
                  
                  <div className="flex justify-between items-center text-sm">
                    <button 
                      type="button"
                      onClick={handleResendCode}
                      className="text-earth-accent hover:underline flex items-center gap-1"
                    >
                      <RefreshCw size={12} />
                      {resendStatus || 'שלח קוד שוב'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setStep('email'); setErrorMessage(''); }}
                      className="text-gray-500 hover:text-white"
                    >
                      חזור לאימייל
                    </button>
                  </div>
                </div>
              </form>
            )}

            {errorMessage && (
              <p className="text-red-400 text-sm text-center mt-4 animate-pulse">{errorMessage}</p>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};
