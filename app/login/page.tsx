import { login } from "../actions";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        action={login}
        className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Admin Login
        </h1>

        <label className="text-sm font-semibold text-gray-600">Username</label>
        <input
          name="username"
          type="text"
          placeholder="admin"
          className="p-2 border rounded text-black"
          required
        />

        <label className="text-sm font-semibold text-gray-600">Password</label>
        <input
          name="password"
          type="password"
          placeholder="******"
          className="p-2 border rounded text-black"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
