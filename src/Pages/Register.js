import React, { useEffect, useState } from "react";
import auth, { storage } from "../firebase";
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { useUploadFile } from "react-firebase-hooks/storage";
import { getDownloadURL, ref } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";

import AddAvatar from "../img/addAvatar.png";
import Spinner from "../components/Spinner";

const Register = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, updating] = useUpdateProfile(auth);

  const [uploadFile] = useUploadFile();
  // const [value] = useDownloadURL(ref(storage, `${user.displayName}`));
  const [err, setErr] = useState("");

  //!-------- handle successful Signup --------
  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  //!-------- handle Signup error --------
  useEffect(() => {
    if (error) {
      setErr(error.message);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const displayImg = e.target[3].files[0];

    const ref1 = ref(storage, `${displayName}`);

    await createUserWithEmailAndPassword(email, password);
    await updateProfile({ displayName: displayName });

    const result = await uploadFile(ref1, displayImg, {
      contentType: "image/jpeg",
    });

    if (result) {
      getDownloadURL(result.ref).then(async (downloadURL) => {
        await updateProfile({ photoURL: downloadURL });
      });
    }
  };

  return (
    <div className="formContainer">
      {loading ? (
        <Spinner></Spinner>
      ) : (
        <div className="formWrapper">
          <span className="logo">Chat App</span>
          <span className="title">Register</span>
          <form onSubmit={handleSubmit}>
            <input required type="text" placeholder="Display Name" />
            <input required type="email" placeholder="Email" />
            <input required type="password" placeholder="Password" />
            <input required style={{ display: "none" }} type="file" id="file" />
            <label htmlFor="file">
              <img src={AddAvatar} alt="" />
              <span>Add an Avatar</span>
            </label>
            <button>Sign up</button>
          </form>
          <p>You have an account? Login</p>
          {err && <p className="error-msg">${err}</p>}
        </div>
      )}
    </div>
  );
};

export default Register;
