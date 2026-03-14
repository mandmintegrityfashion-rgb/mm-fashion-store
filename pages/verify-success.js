export default function VerifySuccess() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 shadow-md rounded-lg text-center">
        <h1 className="text-2xl font-bold text-green-600">✅ Email Verified!</h1>
        <p className="mt-4">You can now log in to your account.</p>
        <a href="/login" className="mt-6 inline-block px-4 py-2 bg-[#0F1923] text-white rounded-md hover:bg-[#1A2332] transition">
          Go to Login
        </a>
      </div>
    </div>
  );
}
