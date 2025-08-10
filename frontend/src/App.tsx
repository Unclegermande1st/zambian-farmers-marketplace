import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

type User = {
  email: string;
  uid: string;
  role: string;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        if (userData && userData.role) {
          setUser({
            email: firebaseUser.email || '',
            uid: firebaseUser.uid,
            role: userData.role,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="App">
      <h1>Smart Agro Marketplace</h1>

      {user ? (
        <div>
          <p>Welcome, <strong>{user.email}</strong>!</p>
          <p>Your role is <em>{user.role}</em></p>

          {user.role === 'farmer' && <p>Farmer Dashboard Placeholder</p>}
          {user.role === 'buyer' && <p>Buyer Dashboard Placeholder</p>}

          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <div>
            <button onClick={() => setShowLogin(true)}>Login</button>
            <button onClick={() => setShowLogin(false)}>Register</button>
          </div>
          {showLogin ? <LoginForm /> : <RegisterForm />}
        </>
      )}
    </div>
  );
}

export default App;
