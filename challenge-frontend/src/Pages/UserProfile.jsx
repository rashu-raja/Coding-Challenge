import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/useAuth";

function UserProfile() {
  const { id } = useParams();
  const { token, user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        setUser(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, token]);

  const isOwner = authUser?.id === user?.id;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-md mx-auto mt-10">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm btn-ghost gap-2 hover:bg-base-200 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-5">
            {user.user_pictures?.length > 0 ? (
              <div className="avatar">
                <div className="w-20 rounded-full">
                  <img
                    src={`http://127.0.0.1:8000/storage/${user.user_pictures[0].path}`}
                    alt={user.name}
                  />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="w-20 rounded-full bg-primary text-primary-content">
                  <span className="text-2xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-sm text-base-content/60">
                {user.designation ?? "—"}
              </p>
              <p className="text-sm text-base-content/60">
                {user.department ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {isOwner && (
              <button className="btn btn-xs btn-outline">Edit</button>
            )}

            <div className="space-y-2 text-sm text-right">
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {user.phone ?? "—"}
              </p>
              <span
                className={`badge ${
                  user.status == 1 ? "badge-success" : "badge-error"
                }`}
              >
                {user.status == 1 ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow border border-base-200 h-full">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Personal Info</h2>
              {isOwner && (
                <button className="btn btn-xs btn-outline">Edit</button>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Gender:</span> Male
              </p>
              <p>
                <span className="font-semibold">DOB:</span> 1998-05-12
              </p>
              <p>
                <span className="font-semibold">Address:</span> Kathmandu, Nepal
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card bg-base-100 shadow border border-base-200 flex-1">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Education</h2>
                {isOwner && (
                  <button className="btn btn-xs btn-outline">Edit</button>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Degree:</span> BSc Computer
                  Science
                </p>
                <p>
                  <span className="font-semibold">University:</span> Tribhuvan
                  University
                </p>
                <p>
                  <span className="font-semibold">Year:</span> 2022
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow border border-base-200 flex-1">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Account Info</h2>
                {isOwner && (
                  <button className="btn btn-xs btn-outline">Edit</button>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Bank:</span> NIC Asia Bank
                </p>
                <p>
                  <span className="font-semibold">Account No:</span> 1234567890
                </p>
                <p>
                  <span className="font-semibold">IFSC:</span> NIC000123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
