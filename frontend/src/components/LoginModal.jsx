import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";

function LoginModal({ close }) {
  const [mode, setMode] = useState("sign-in");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      
      <div className="bg-white rounded-2xl w-[400px] max-h-[600px] overflow-hidden shadow-2xl">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 flex justify-between">
          <h2 className="font-semibold">
            {mode === "sign-in" ? "Sign in" : "Register"}
          </h2>
          <button onClick={close}>✕</button>
        </div>

        {/* BODY */}
        <div className="p-4 flex justify-center">

          <div className="w-full scale-[0.95]">

            {mode === "sign-in" ? (
              <SignIn
                routing="hash"
                appearance={{
                  variables: { colorPrimary: "#7c3aed" },
                  elements: {
                    card: "shadow-none",
                    footerAction: "hidden", // 🔥 hide default link
                  },
                }}
                redirectUrl="/dashboard"
              />
            ) : (
              <SignUp
                routing="hash"
                appearance={{
                  variables: { colorPrimary: "#7c3aed" },
                  elements: {
                    card: "shadow-none",
                    footerAction: "hidden",
                  },
                }}
                redirectUrl="/dashboard"
              />
            )}

          </div>
        </div>

        {/* CUSTOM SWITCH */}
        <p className="text-center text-sm pb-4">
          {mode === "sign-in" ? "New user?" : "Already have account?"}
          <span
            onClick={() =>
              setMode(mode === "sign-in" ? "sign-up" : "sign-in")
            }
            className="text-purple-600 cursor-pointer ml-1"
          >
            {mode === "sign-in" ? "Register" : "Login"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default LoginModal;